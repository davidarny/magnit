/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Button, Grid } from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";
import { TemplateEditor } from "@magnit/template-editor";
import template from "./template";

export const CreateTemplate: React.FC = () => {
    return (
        <SectionLayout>
            <SectionTitle title="Создание шаблона">
                <Grid item>
                    <Button
                        variant="contained"
                        css={theme => ({
                            background: theme.colors.primary,
                            ":hover": { background: theme.colors.primary },
                            color: "white",
                            textTransform: "none",
                            borderRadius: theme.radius(5),
                        })}
                    >
                        <CheckIcon
                            css={theme => ({ marginRight: theme.spacing() })}
                            alignmentBaseline="middle"
                        />
                        <span>Сохранить</span>
                    </Button>
                </Grid>
            </SectionTitle>
            <Grid
                item
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                })}
            >
                <TemplateEditor initialState={template} />
            </Grid>
        </SectionLayout>
    );
};
