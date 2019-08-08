/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { useContext, useState } from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid, Typography } from "@material-ui/core";
import { TemplateEditor } from "@magnit/template-editor";
import { Button } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { createTemplate } from "services/api/templates";
import { AppContext } from "context";
import { Snackbar } from "components/snackbar";
import { Redirect } from "@reach/router";
import _ from "lodash";
import { uploadFile } from "../../services/api/assets";

export const CreateTemplate: React.FC = () => {
    const context = useContext(AppContext);
    const [template, setTemplate] = useState<object>({});
    const [error, setError] = useState(false); // success/error snackbar state
    const [open, setOpen] = useState(false); // open/close snackbar
    const [redirect, setRedirect] = useState(false);

    function onTemplateChange(template: object) {
        setTemplate(_.cloneDeep(template));
    }

    function onSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === "clickaway") {
            return;
        }
        if (!error) {
            setRedirect(true);
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

    async function onAddAsset(file: File) {
        return uploadFile(context.courier, file).then(response => ({
            ...response,
            filename: `${process.env.REACT_APP_BACKEND_URL}/${response.filename}`,
        }));
    }

    return (
        <SectionLayout>
            {redirect && <Redirect to={"/templates"} noThrow />}
            <SectionTitle title="Создание шаблона">
                <Grid item>
                    <Button variant="contained" scheme="blue" onClick={onTemplateSave}>
                        <CheckIcon />
                        <Typography>Сохранить</Typography>
                    </Button>
                </Grid>
            </SectionTitle>
            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                    opacity: open ? 0.5 : 1,
                    transition: "opacity 0.3s ease-in-out",
                    pointerEvents: open ? "none" : "initial",
                })}
            >
                <TemplateEditor
                    css={theme => ({ background: theme.colors.main })}
                    onChange={onTemplateChange}
                    onAddAsset={onAddAsset}
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
