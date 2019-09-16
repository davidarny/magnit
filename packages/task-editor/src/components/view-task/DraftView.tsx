/** @jsx jsx */

import { jsx } from "@emotion/core";
import { DateField, InputField, SelectableBlockWrapper, SelectField } from "@magnit/components";
import { IExtendedTask } from "@magnit/entities";
import { IEditorService } from "@magnit/services";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import { TaskFieldContainer } from "components/task-field-container";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface IDraftViewProps {
    service: IEditorService;
    task: Partial<Omit<IExtendedTask, "id">> & { id: string };
    focusedPuzzleId?: string;

    onTaskChange?(task: Partial<IExtendedTask>): void;

    onChangeStageTitle(id: number, value: string): void;

    onChangeStageDeadline(id: number, value: string): void;

    onBlurStage(): void;
}

export const DraftView: React.FC<IDraftViewProps> = props => {
    const { focusedPuzzleId, service, task } = props;
    const { onChangeStageTitle, onBlurStage, onChangeStageDeadline, onTaskChange } = props;
    const { stages, id, title, notifyBefore } = task;

    const lastStage = _.last(stages);

    const [lastStageTitle, setLastStageTitle] = useState(lastStage ? lastStage.title : "");
    const [lastStageDeadline, setLastStageDeadline] = useState(lastStage ? lastStage.deadline : "");
    const [taskTitle, setTaskTitle] = useState(title || "");

    const prevTitle = useRef(title);
    const prevStageTitle = useRef(lastStage ? lastStage.title : "");
    const prevStageDeadline = useRef(lastStage ? lastStage.deadline : "");

    useEffect(() => {
        if (title && prevTitle.current !== title) {
            prevTitle.current = title;
            setTaskTitle(title);
        }
        if (lastStage && prevStageTitle.current !== lastStage.title) {
            prevStageTitle.current = lastStage.title;
            setLastStageTitle(lastStage.title);
        }
        if (lastStage && prevStageDeadline.current !== lastStage.deadline) {
            prevStageDeadline.current = lastStage.deadline;
            setLastStageDeadline(lastStage.deadline);
        }
    }, [lastStage, title]);

    const onBlurStageCallback = useCallback(() => {
        if (!lastStage) {
            return;
        }
        onChangeStageTitle(lastStage.id, lastStageTitle);
        onChangeStageDeadline(lastStage.id, lastStageDeadline);
        onBlurStage();
    }, [
        lastStage,
        lastStageDeadline,
        lastStageTitle,
        onBlurStage,
        onChangeStageDeadline,
        onChangeStageTitle,
    ]);

    const onBlurTaskTitleCallback = useCallback(() => {
        if (onTaskChange) {
            onTaskChange({ title, ..._.omit(task, "id") });
        }
    }, [onTaskChange, task, title]);

    function onStageTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLastStageTitle(event.target.value);
    }

    function onStageDeadlineChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLastStageDeadline(event.target.value);
    }

    function onTaskTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTaskTitle(event.target.value);
    }

    return (
        <SelectableBlockWrapper
            css={theme => ({
                padding: theme.spacing(3),
                zIndex: focusedPuzzleId === id ? 1300 : "initial",
            })}
            onFocus={service.onPuzzleFocus.bind(service, id, false)}
            onMouseDown={service.onPuzzleFocus.bind(service, id, false)}
            focused={focusedPuzzleId === id}
            id={id}
        >
            <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                <Grid item xs={12}>
                    <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                        Основная информация
                    </Typography>
                </Grid>
                <TaskFieldContainer label="Название задания">
                    <InputField
                        placeholder="Введите название задания"
                        value={taskTitle}
                        onChange={onTaskTitleChange}
                        onBlur={onBlurTaskTitleCallback}
                        fullWidth
                    />
                </TaskFieldContainer>
                <TaskFieldContainer label="Этап задания">
                    <Grid container direction="row" alignItems="flex-end" spacing={2}>
                        <Grid item xs>
                            <InputField
                                value={lastStageTitle}
                                onChange={onStageTitleChange}
                                onBlur={onBlurStageCallback}
                                placeholder="Введите название этапа"
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <DateField
                                value={lastStageDeadline}
                                placeholder="Срок выполнения"
                                onChange={onStageDeadlineChange}
                                onBlur={onBlurStageCallback}
                            />
                        </Grid>
                    </Grid>
                </TaskFieldContainer>
                <TaskFieldContainer label="Уведомить исполнителя о наступлении срока выполнения заказа">
                    <SelectField
                        value={notifyBefore || 3}
                        css={theme => ({ minWidth: theme.spacing(30) })}
                    >
                        <MenuItem value={1}>За 1 день</MenuItem>
                        <MenuItem value={2}>За 2 дня</MenuItem>
                        <MenuItem value={3}>За 3 дня</MenuItem>
                        <MenuItem value={4}>За 4 дня</MenuItem>
                        <MenuItem value={5}>За 5 дней</MenuItem>
                        <MenuItem value={6}>За 6 дней</MenuItem>
                        <MenuItem value={7}>За 7 дней</MenuItem>
                    </SelectField>
                </TaskFieldContainer>
                <TaskFieldContainer label="Местоположение">
                    <Grid container direction="row" alignItems="flex-end" spacing={2}>
                        <Grid item xs>
                            <SelectField placeholder="Регион" fullWidth />
                        </Grid>
                        <Grid item xs>
                            <SelectField placeholder="Филиал" fullWidth />
                        </Grid>
                        <Grid item xs>
                            <SelectField placeholder="Формат" fullWidth />
                        </Grid>
                        <Grid item xs>
                            <SelectField placeholder="Адрес" fullWidth />
                        </Grid>
                    </Grid>
                </TaskFieldContainer>
                <TaskFieldContainer label="Исполнитель">
                    <Grid item xs={4}>
                        <SelectField placeholder="Выберите исполнителя" fullWidth />
                    </Grid>
                </TaskFieldContainer>
            </Grid>
        </SelectableBlockWrapper>
    );
};

DraftView.displayName = "DraftView";
