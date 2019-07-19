/** @jsx jsx */

import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import { SectionTitle } from "components/section-title";
import { SectionLayout } from "components/section-layout";
import { Button } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import { ITask, TaskEditor } from "@magnit/task-editor";
import { AppContext } from "context";
import { getTask, getTemplate, IGetTaskResponse } from "services/api";
import _ from "lodash";

interface IViewTaskProps {
    taskId: string;
}

export const ViewTask: React.FC<IViewTaskProps> = ({ taskId }) => {
    const context = useContext(AppContext);
    const [task, setTask] = useState<Partial<IGetTaskResponse["task"]>>({});
    const [, setUpdatedTask] = useState<Partial<ITask>>({});

    useEffect(() => {
        getTask(context.courier, _.toNumber(taskId))
            .then(response => setTask(response.task))
            .catch(console.error);
    }, [context.courier, taskId]);

    function getTemplateHandler(id: string) {
        return getTemplate(context.courier, _.toNumber(id));
    }

    function onTaskChange(task: ITask): void {
        setUpdatedTask({ ...task });
    }

    function onTaskSave(): void {
        // TODO: update task
    }

    return (
        <SectionLayout>
            <SectionTitle title="Информация о задании">
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
                })}
            >
                <TaskEditor
                    task={
                        ({
                            ...task,
                            templates: (task.templates || []).map(_.toString),
                        } as unknown) as ITask
                    }
                    templates={[]}
                    variant="view"
                    getTemplate={getTemplateHandler}
                    onTaskChange={onTaskChange}
                />
            </Grid>
        </SectionLayout>
    );
};
