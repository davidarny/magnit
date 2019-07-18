/** @jsx jsx */

import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import { TaskEditor } from "@magnit/task-editor";
import { AppContext } from "context";
import { getTemplate, getTemplates } from "services/api";
import _ from "lodash";

interface IShortTemplate {
    id: string;
    title: string;
}

export const CreateTask: React.FC = () => {
    const context = useContext(AppContext);
    const [templates, setTemplates] = useState<IShortTemplate[]>([]);

    useEffect(() => {
        getTemplates(context.courier)
            .then(response => {
                return response.templates.map(template => ({
                    ...template,
                    id: template.id.toString(),
                }));
            })
            .then(templates => setTemplates(templates))
            .catch(console.error);
    }, [context.courier]);

    function getTemplateHandler(id: string) {
        return getTemplate(context.courier, _.toNumber(id));
    }

    return (
        <SectionLayout>
            <SectionTitle title="Создание задания">
                <Grid item>
                    <Button
                        variant="contained"
                        title="Отправить"
                        scheme="blue"
                        icon={<SendIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                </Grid>
            </SectionTitle>
            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                })}
            >
                <TaskEditor templates={templates} getTemplate={getTemplateHandler} />
            </Grid>
        </SectionLayout>
    );
};
