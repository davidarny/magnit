/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { ETemplateType, ITemplate } from "@magnit/entities";
import { CheckIcon } from "@magnit/icons";
import { TemplateEditor } from "@magnit/template-editor";
import { Grid, Typography } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Snackbar } from "components/snackbar";
import { AppContext } from "context";
import * as React from "react";
import { useContext, useState } from "react";
import { deleteFile, uploadFile } from "services/api/assets";
import { createTemplate } from "services/api/templates";

export interface ICreateTemplateProps extends RouteComponentProps {}

export const CreateTemplate: React.FC<ICreateTemplateProps> = () => {
    const context = useContext(AppContext);
    const [template, setTemplate] = useState<ITemplate>({
        id: 0,
        sections: [],
        title: "",
        description: "",
        type: ETemplateType.LIGHT,
    });
    const [error, setError] = useState(false); // success/error snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
    }); // open/close snackbar

    function onTemplateChange(template: ITemplate) {
        setTemplate({ ...template });
    }

    function onSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ open: false, message: "" });
        // wait till animation ends
        setTimeout(() => setError(false), 100);
    }

    function onTemplateSave() {
        createTemplate(context.courier, template)
            .then(() => setSnackbar({ open: true, message: "Шаблон успешно сохранён!" }))
            .catch(() => {
                setSnackbar({ open: true, message: "Ошибка сохранения шаблона!" });
                setError(true);
            });
    }

    async function onAddAsset(file: File) {
        return uploadFile(context.courier, file).then(response => ({
            ...response,
            filename: `${process.env.REACT_APP_BACKEND_URL}/${response.filename}`,
        }));
    }

    async function onDeleteAsset(filename: string) {
        return deleteFile(context.courier, filename);
    }

    return (
        <SectionLayout>
            <SectionTitle title="Создание шаблона">
                <Grid item>
                    <Button
                        variant="contained"
                        scheme="green"
                        onClick={onTemplateSave}
                        disabled={snackbar.open}
                    >
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
                    opacity: snackbar.open ? 0.5 : 1,
                    transition: "opacity 0.3s ease-in-out",
                    pointerEvents: snackbar.open ? "none" : "initial",
                })}
            >
                <TemplateEditor
                    template={template}
                    css={theme => ({ background: theme.colors.main })}
                    onChange={onTemplateChange}
                    onAddAsset={onAddAsset}
                    onDeleteAsset={onDeleteAsset}
                />
            </Grid>
            <Snackbar
                open={snackbar.open}
                error={error}
                onClose={onSnackbarClose}
                message={snackbar.message}
            />
        </SectionLayout>
    );
};
