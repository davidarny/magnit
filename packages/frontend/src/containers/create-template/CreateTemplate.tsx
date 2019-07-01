/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid } from "@material-ui/core";
import { TemplateEditor } from "@magnit/template-editor";
import { CustomButton } from "@magnit/components";
import template from "./template";
import { CheckIcon } from "@magnit/icons";

export const CreateTemplate: React.FC = () => {
    return (
        <SectionLayout>
            <SectionTitle title="Создание шаблона">
                <Grid item>
                    <CustomButton
                        variant="contained"
                        title="Сохранить"
                        buttonColor="blue"
                        icon={<CheckIcon />}
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
                <TemplateEditor
                    initialState={template}
                    css={theme => ({
                        background: theme.colors.main,
                    })}
                />
            </Grid>
        </SectionLayout>
    );
};
