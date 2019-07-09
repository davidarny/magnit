/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { useContext, useState } from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid } from "@material-ui/core";
import { TemplateEditor } from "@magnit/template-editor";
import { CustomButton } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { createTemplate } from "services/api/templates";
import { AppContext } from "context";
import { Snackbar } from "components/snackbar";

export const CreateTemplate: React.FC = () => {
    const context = useContext(AppContext);
    const [template, setTemplate] = useState<object>({});
    const [error, setError] = useState(false); // success/error snackbar state
    const [open, setOpen] = useState(false); // open/close snackbar

    function onTemplateChange(template: object) {
        setTemplate(template);
    }

    function onSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
        // wait till animation ends
        setTimeout(() => setError(false), 100);
    }

    function onTemplateSave() {
        createTemplate(context.courier, template)
            .then(() => setOpen(true))
            .catch(() => {
                setOpen(true);
                setError(true);
            });
    }

    return (
        <SectionLayout>
            <SectionTitle title="Создание шаблона">
                <Grid item>
                    <CustomButton
                        variant="contained"
                        title="Сохранить"
                        scheme="blue"
                        icon={<CheckIcon />}
                        onClick={onTemplateSave}
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
                    css={theme => ({ background: theme.colors.main })}
                    onChange={onTemplateChange}
                />
            </Grid>
            <Snackbar
                open={open}
                error={error}
                onClose={onSnackbarClose}
                messages={{
                    success: "Шаблон успешно сохранён!",
                    error: "Ошибка сохранения шаблона!",
                }}
            />
        </SectionLayout>
    );
};
