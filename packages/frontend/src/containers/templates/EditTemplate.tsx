/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { ETemplateType, ITemplate } from "@magnit/entities";
import { CheckIcon } from "@magnit/icons";
import { TemplateEditor } from "@magnit/template-editor";
import { Grid, Typography } from "@material-ui/core";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Snackbar } from "components/snackbar";
import { AppContext } from "context";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { deleteFile, getTemplate, updateTemplate, uploadFile } from "services/api";

export interface IEditTemplateProps {
    templateId: number;
}

export const EditTemplate: React.FC<IEditTemplateProps> = ({ templateId }) => {
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

    useEffect(() => {
        getTemplate(context.courier, templateId)
            .then(response => setTemplate(response.template))
            .catch(console.error);
    }, [context.courier, templateId]);

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
        updateTemplate(context.courier, templateId, template)
            .then(() => setSnackbar({ open: true, message: "Шаблон успешно обновлён!" }))
            .catch(() => {
                setSnackbar({ open: true, message: "Ошибка обновления шаблона!" });
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
            <SectionTitle title="Редактирование шаблона">
                <Grid item>
                    <Button
                        variant="contained"
                        scheme="blue"
                        onClick={onTemplateSave}
                        disabled={snackbar.open}
                    >
                        <CheckIcon />
                        <Typography>Обновить</Typography>
                    </Button>
                </Grid>
            </SectionTitle>
            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                    transition: "opacity 0.3s ease-in-out",
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
