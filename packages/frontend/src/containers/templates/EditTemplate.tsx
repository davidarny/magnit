/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid } from "@material-ui/core";
import { ITemplate, TemplateEditor } from "@magnit/template-editor";
import { Button } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { getTemplate, updateTemplate } from "services/api/templates";
import { AppContext } from "context";
import { Snackbar } from "components/snackbar";
import { Redirect } from "@reach/router";
import _ from "lodash";

interface IEditTemplateProps {
    templateId: number;
}

export const EditTemplate: React.FC<IEditTemplateProps> = ({ templateId }) => {
    const context = useContext(AppContext);
    const [template, setTemplate] = useState<object>({});
    const [error, setError] = useState(false); // success/error snackbar state
    const [open, setOpen] = useState(false); // open/close snackbar
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        getTemplate(context.courier, templateId)
            .then(response => setTemplate(response.template))
            .catch(console.error);
    }, [context.courier, templateId]);

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
        updateTemplate(context.courier, templateId, template)
            .then(() => setOpen(true))
            .catch(() => {
                setOpen(true);
                setError(true);
            });
    }

    return (
        <SectionLayout>
            {redirect && <Redirect to={"/templates"} noThrow />}
            <SectionTitle title="Редактирование шаблона">
                <Grid item>
                    <Button
                        variant="contained"
                        title="Обновить"
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
                    opacity: open ? 0.5 : 1,
                    transition: "opacity 0.3s ease-in-out",
                    pointerEvents: open ? "none" : "initial",
                })}
            >
                {!_.isEmpty(template) && (
                    <TemplateEditor
                        initialState={(template as unknown) as ITemplate}
                        css={theme => ({ background: theme.colors.main })}
                        onChange={onTemplateChange}
                    />
                )}
            </Grid>
            <Snackbar
                open={open}
                error={error}
                onClose={onSnackbarClose}
                messages={{
                    success: "Шаблон успешно обновлён!",
                    error: "Ошибка обновления шаблона!",
                }}
            />
        </SectionLayout>
    );
};
