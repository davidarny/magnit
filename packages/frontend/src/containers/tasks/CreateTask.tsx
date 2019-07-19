/** @jsx jsx */

import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import { ITask, TaskEditor } from "@magnit/task-editor";
import { AppContext } from "context";
import { addTemplatesToTask, createTask, getTemplate, getTemplates } from "services/api";
import _ from "lodash";
import { Redirect } from "@reach/router";
import { Snackbar } from "components/snackbar";

interface IShortTemplate {
    id: string;
    title: string;
}

export const CreateTask: React.FC = () => {
    const context = useContext(AppContext);
    const [templates, setTemplates] = useState<IShortTemplate[]>([]);
    const [task, setTask] = useState<Partial<ITask>>({});
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false); // success/error snackbar state
    const [open, setOpen] = useState(false); // open/close snackbar

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

    function getTemplateHandler(id: string) {
        return getTemplate(context.courier, _.toNumber(id));
    }

    function onTaskChange(task: ITask): void {
        setTask({ ...task });
    }

    function onTaskSave(): void {
        createTask(context.courier, task)
            .then(response => {
                return addTemplatesToTask(
                    context.courier,
                    _.toNumber(response.taskId),
                    (task.templates || []).map(_.toNumber)
                );
            })
            .then(() => setOpen(true))
            .catch(() => {
                setOpen(true);
                setError(true);
            });
    }

    return (
        <SectionLayout>
            {redirect && <Redirect to={"/tasks"} noThrow />}
            <SectionTitle title="Создание задания">
                <Grid item>
                    <Button
                        variant="contained"
                        title="Отправить"
                        scheme="blue"
                        icon={<SendIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                        onClick={onTaskSave}
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
                <TaskEditor
                    variant="create"
                    templates={templates}
                    getTemplate={getTemplateHandler}
                    onTaskChange={onTaskChange}
                />
            </Grid>
            <Snackbar
                open={open}
                error={error}
                onClose={onSnackbarClose}
                messages={{
                    success: "Задание успешно сохранено!",
                    error: "Ошибка сохранения задания!",
                }}
            />
        </SectionLayout>
    );
};
