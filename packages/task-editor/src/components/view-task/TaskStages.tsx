/** @jsx jsx */

import { jsx } from "@emotion/core";
import { DateField, InputField } from "@magnit/components";
import { IExtendedTask } from "@magnit/entities";
import { getFriendlyDate } from "@magnit/services";
import {
    Grid,
    IconButton,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography,
} from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ITaskStepperProps {
    task: Partial<IExtendedTask>;

    onChangeStageTitle(stageId: number, title: string): void;

    onChangeStageDeadline(stageId: number, deadline: string): void;

    onDeleteStage(stageId: number): void;
}

export const TaskStages: React.FC<ITaskStepperProps> = props => {
    const { task, onChangeStageDeadline, onChangeStageTitle, onDeleteStage } = props;

    const stages = (task.stages || []).map((stage, index) => ({ ...stage, __index: index + 1 }));
    const addingNewStage = stages.reduce((prev, curr) => (!prev ? !!curr.editable : prev), false);

    return (
        <Stepper orientation="vertical">
            {(!addingNewStage
                ? // only last step
                  [stages[stages.length - 1]]
                : // last step + new editable
                  [stages[stages.length - 2], stages[stages.length - 1]]
            )
                .filter(Boolean)
                .map(stage => {
                    const deadline = stage.deadline || "";
                    const title = stage.title || "";

                    return (
                        <TaskStage
                            key={stage.id}
                            id={stage.id}
                            editable={!!stage.editable}
                            completed={stage.finished}
                            createdAt={getFriendlyDate(new Date(stage.createdAt))}
                            title={title}
                            deadline={
                                !stage.editable
                                    ? !_.isNaN(Date.parse(deadline))
                                        ? getFriendlyDate(new Date(deadline))
                                        : deadline
                                    : deadline
                            }
                            index={stage.__index}
                            onChangeTitle={onChangeStageTitle}
                            onChangeDeadline={onChangeStageDeadline}
                            onDelete={onDeleteStage}
                        />
                    );
                })}
        </Stepper>
    );
};

TaskStages.displayName = "TaskStages";

export interface ITaskStageProps {
    id: number;
    title: string;
    deadline: string;
    createdAt: string;
    completed: boolean;
    editable: boolean;
    index?: number;

    onChangeTitle?(stageId: number, title: string): void;

    onChangeDeadline?(stageId: number, deadline: string): void;

    onDelete?(stageId: number): void;
}

export const TaskStage: React.FC<ITaskStageProps> = props => {
    const {
        completed,
        title,
        editable,
        deadline,
        index,
        onChangeTitle,
        onChangeDeadline,
        id,
        onDelete,
        createdAt,
        ...rest
    } = props;

    const [stageTitle, setStageTitle] = useState(title || "");
    const [stageDeadline, setStageDeadline] = useState(deadline || "");

    const prevTitle = useRef(title);
    const prevDeadline = useRef(deadline);
    useEffect(() => {
        if (title && prevTitle.current !== title) {
            setStageTitle(title);
        }
        if (deadline && prevDeadline.current !== deadline) {
            setStageDeadline(deadline);
        }
    }, [deadline, title]);

    function onChangeStageTitle(event: React.ChangeEvent<HTMLInputElement>) {
        setStageTitle(event.target.value);
    }

    function onChangeStageDeadline(event: React.ChangeEvent<HTMLInputElement>) {
        setStageDeadline(event.target.value);
    }

    const onBlurStageTitleCallback = useCallback(() => {
        if (onChangeTitle) {
            onChangeTitle(id, stageTitle);
        }
    }, [id, onChangeTitle, stageTitle]);

    const onBlurStageDeadlineCallback = useCallback(() => {
        if (onChangeDeadline) {
            onChangeDeadline(id, stageDeadline);
        }
    }, [id, onChangeDeadline, stageDeadline]);

    const onStageDelete = useCallback(() => {
        if (onDelete) {
            onDelete(id);
        }
    }, [id, onDelete]);

    return (
        <Step {...rest} active={true} completed={completed}>
            <StepLabel
                {...(index ? { icon: index } : {})}
                css={theme => ({
                    svg: { color: `${theme.colors.primary} !important` },
                })}
            >
                {!editable && (
                    <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                        {title}
                    </Typography>
                )}
                {editable && (
                    <Grid container>
                        <Grid item xs={10}>
                            <InputField
                                fullWidth
                                css={theme => ({ input: { fontSize: theme.fontSize.larger } })}
                                value={stageTitle}
                                onChange={onChangeStageTitle}
                                onBlur={onBlurStageTitleCallback}
                            />
                        </Grid>
                        <Grid item xs>
                            <IconButton
                                css={theme => ({
                                    svg: { color: `${theme.colors.gray} !important` },
                                })}
                                onClick={onStageDelete}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                )}
            </StepLabel>
            <StepContent>
                {!editable && (
                    <Typography
                        css={({ colors, fontSize }) => ({
                            color: colors.gray,
                            fontSize: fontSize.secondary,
                        })}
                    >
                        {createdAt} - {deadline}
                    </Typography>
                )}
                {editable && (
                    <DateField
                        value={stageDeadline}
                        onChange={onChangeStageDeadline}
                        onBlur={onBlurStageDeadlineCallback}
                    />
                )}
            </StepContent>
        </Step>
    );
};

TaskStage.displayName = "TaskStage";
