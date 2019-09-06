/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IAnswer } from "@magnit/entities";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { SectionRenderer } from "./Section";

interface ITemplateRendererProps {
    template?: object;
    answers?: IAnswer[];
}

export const TemplateRenderer: React.FC<ITemplateRendererProps> = ({ template, answers }) => {
    if (!template) {
        return null;
    }
    return (
        <React.Fragment>
            {_.get(template, "sections", []).map((section: object, index: number) => (
                <SectionRenderer
                    answers={answers}
                    key={_.get(section, "id")}
                    index={index}
                    section={section}
                />
            ))}
            {process.env.NODE_ENV !== "production" && (
                <ExpansionPanel css={theme => ({ marginTop: theme.spacing(3) })}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        JSON
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <pre>{JSON.stringify(template, null, 2)}</pre>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
        </React.Fragment>
    );
};
