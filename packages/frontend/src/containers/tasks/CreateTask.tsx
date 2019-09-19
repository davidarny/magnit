/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { ETaskStatus, ITask, ITemplate } from "@magnit/entities";
import { SendIcon } from "@magnit/icons";
import { TaskEditor } from "@magnit/task-editor";
import { Grid, Typography } from "@material-ui/core";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Snackbar } from "components/snackbar";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { addTemplateAssignment, createTask, getTemplate, getTemplates } from "services/api";

interface IEditableTemplate extends ITemplate {
    editable: boolean;
}

export const CreateTask: React.FC = () => {
    const context = useContext(AppContext);
    const [templates, setTemplates] = useState<IEditableTemplate[]>([]);
    const [task, setTask] = useState<ITask>({
        id: 0,
        title: "",
        templates: [],
        stages: [],
        marketplace: null,
        status: ETaskStatus.DRAFT,
    });
    const [error, setError] = useState(false); // success/error snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
    }); // open/close snackbar

    useEffect(() => {
        getTemplates(context.courier)
            .then(response => {
                return response.templates.map(template => ({
                    ...template,
                    id: template.id.toString(),
                }));
            })
            .then(templates => {
                return Promise.all(
                    templates.map(template => getTemplate(context.courier, Number(template.id))),
                );
            })
            .then(responses => {
                const buffer: any[] = [];
                responses.forEach(response => buffer.push(response.template));
                setTemplates([...buffer]);
            })
            .catch(console.error);
    }, [context.courier]);

    function onSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ open: false, message: "" });
        // wait till animation ends
        setTimeout(() => setError(false), 100);
    }

    function onTaskChange(task: Partial<ITask>): void {
        const isValidTask = (value: object): value is ITask =>
            _.has(value, "id") && _.has(value, "title") && _.has(value, "templates");

        if (isValidTask(task)) {
            setTask({ ...task });
        }
    }

    function onTaskSave(): void {
        createTask(context.courier, task)
            .then(async response => {
                if (!response.taskId) {
                    return;
                }
                await addTemplateAssignment(
                    context.courier,
                    Number(response.taskId),
                    (task.templates || []).map(_.toNumber),
                );
            })
            .then(() => setSnackbar({ open: true, message: "Задание успешно сохранено!" }))
            .catch(() => {
                setSnackbar({ open: true, message: "Ошибка сохранения задания!" });
                setError(true);
            });
    }

    return (
        <SectionLayout>
            <SectionTitle title="Создание задания">
                <Grid item>
                    <Button
                        variant="contained"
                        scheme="blue"
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                        onClick={onTaskSave}
                        disabled={snackbar.open}
                    >
                        <SendIcon />
                        <Typography>Отправить</Typography>
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
                <TaskEditor<ITask>
                    variant="create"
                    task={task}
                    templates={templates}
                    onTaskChange={onTaskChange}
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
