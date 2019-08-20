/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import { IExtendedTask, TaskEditor } from "@magnit/task-editor";
import { Grid, Typography } from "@material-ui/core";
import { Redirect } from "@reach/router";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Snackbar } from "components/snackbar";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { getTaskExtended, updateTask } from "services/api";
import uuid from "uuid/v4";

interface IViewTaskProps {
    taskId: number;
}

export const ViewTask: React.FC<IViewTaskProps> = ({ taskId }) => {
    const context = useContext(AppContext);
    const [task, setTask] = useState<IExtendedTask>({
        title: "",
        id: uuid(),
        templates: [],
    });
    const [error, setError] = useState(false); // success/error snackbar state
    const [open, setOpen] = useState(false); // open/close snackbar
    const [redirect, setRedirect] = useState(false);

    const isValidTask = (value: object): value is IExtendedTask =>
        _.has(value, "id") && _.has(value, "title") && _.has(value, "templates");

    useEffect(() => {
        getTaskExtended(context.courier, _.toNumber(taskId))
            .then(response => {
                if (isValidTask(response.task)) {
                    return setTask({ ...response.task, id: response.task.id.toString() });
                }
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
                    templates={task.templates || []}
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
