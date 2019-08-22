/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import { ETaskStatus, ETerminals } from "@magnit/services";
import { IExtendedTask, TaskEditor } from "@magnit/task-editor";
import { ITemplate } from "@magnit/template-editor";
import { Grid, Typography } from "@material-ui/core";
import { Redirect } from "@reach/router";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Snackbar } from "components/snackbar";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import {
    addStages,
    addTemplateAssignment,
    getTaskExtended,
    getTemplate,
    getTemplates,
    updateTask,
    updateTemplateAssignment,
} from "services/api";

interface IViewTaskProps {
    taskId: number;
}

interface IEditableTemplate extends ITemplate {
    editable: boolean;
}

export const ViewTask: React.FC<IViewTaskProps> = ({ taskId }) => {
    const context = useContext(AppContext);
    const [templates, setTemplates] = useState<IEditableTemplate[]>([]);
    const [task, setTask] = useState<IExtendedTask>({
        id: 0,
        title: ETerminals.EMPTY,
        templates: [],
        stages: [],
        status: ETaskStatus.DRAFT,
    });
    const [error, setError] = useState(false); // success/error snackbar state
    const [open, setOpen] = useState(false); // open/close snackbar
    const [redirect, setRedirect] = useState(false);

    const isValidTask = (value: object): value is IExtendedTask =>
        _.has(value, "id") &&
        _.has(value, "title") &&
        _.has(value, "templates") &&
        _.has(value, "stages");

    const initialStages = useRef<IExtendedTask["stages"]>([]);

    useEffect(() => {
        let task: IExtendedTask;

        getTaskExtended(context.courier, _.toNumber(taskId))
            .then(response => {
                if (isValidTask(response.task)) {
                    initialStages.current = _.cloneDeep(response.task.stages);
                    task = response.task;
                    return setTask({ ...response.task });
                }
            })
            // TODO: allow only in DRAFT mode
            .then(() => getTemplates(context.courier))
            .then(response =>
                response.templates.map(template => ({
                    ...template,
                    id: template.id.toString(),
                })),
            )
            .then(templates =>
                Promise.all(
                    templates.map(template => getTemplate(context.courier, Number(template.id))),
                ),
            )
            .then(responses => {
                const buffer: any[] = [];
                responses.forEach(response => buffer.push(response.template));
                buffer.forEach((data, index, array) => {
                    const template = task.templates.find(template => template.id === data.id);
                    if (template) {
                        array[index] = _.merge(data, template);
                    }
                });
                setTemplates([...buffer]);
            })
            .catch(console.error);
    }, [context.courier, taskId]);

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

    function onTaskChange(task: Partial<IExtendedTask>): void {
        if (isValidTask(task)) {
            setTask({ ...task });
        }
    }

    function onTaskSave(): void {
        updateTask(context.courier, taskId, _.omit(task, ["id", "templates"]))
            .then(async () => {
                // TODO: allow only in DRAFT mode
                return addTemplateAssignment(
                    context.courier,
                    Number(taskId),
                    (task.templates || [])
                        // filter to only existing templates
                        .filter(assignment =>
                            templates.find(template => template.id === assignment.id),
                        )
                        .map(template => Number(template.id)),
                );
            })
            .then(() =>
                Promise.all(
                    task.templates.map(({ id, editable }) => {
                        const body = {
                            editable,
                        };
                        return updateTemplateAssignment(context.courier, taskId, Number(id), body);
                    }),
                ),
            )
            .then(async () => {
                const diffStages = task.stages
                    // filter so that add only stages that doens't exist
                    .filter(
                        stage =>
                            !initialStages.current.find(
                                initialStage => initialStage.id === stage.id,
                            ),
                    )
                    .map(stage => {
                        // TODO: mask input for date
                        const splitted = stage.dueDate.split(".");
                        const date = new Date();
                        date.setDate(Number(_.first(splitted)));
                        date.setMonth(Number(_.nth(splitted, 1)) - 1);
                        date.setFullYear(Number(_.nth(splitted, 2)));
                        return { ...stage, dueDate: new Date(date).toISOString() };
                    });
                if (!diffStages.length) {
                    return;
                }
                return addStages(context.courier, taskId, diffStages);
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
            <SectionTitle title="Информация о задании">
                <Grid item>
                    <Button
                        variant="contained"
                        scheme="blue"
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                        onClick={onTaskSave}
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
                })}
            >
                <TaskEditor<IExtendedTask>
                    initialState={task}
                    templates={(templates.length && templates) || task.templates}
                    variant="view"
                    onTaskChange={onTaskChange}
                />
            </Grid>
            <Snackbar
                open={open}
                error={error}
                onClose={onSnackbarClose}
                messages={{
                    success: "Задание успешно обновлено!",
                    error: "Ошибка обновления задания!",
                }}
            />
        </SectionLayout>
    );
};
