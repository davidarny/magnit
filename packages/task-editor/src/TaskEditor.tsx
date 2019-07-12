/** @jsx jsx */

import * as React from "react";
import {
    DateField,
    EditorToolbar,
    InputField,
    SelectableBlockWrapper,
    SelectField,
} from "@magnit/components";
import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { TaskFieldContainer } from "./components/task-field-container";
import { QuestionIcon, TrashIcon, CommentsIcon } from "@magnit/icons";
import _ from "lodash";
import { useState } from "react";
import { useRef } from "react";
import { EEditorType, getEditorService, ETerminals, getFriendlyDate } from "@magnit/services";
import uuid from "uuid/v4";
import { ITask } from "./entities";

export const TaskEditor: React.FC = () => {
    const [task] = useState<ITask>({
        id: uuid(),
        stage: {
            title: ETerminals.EMPTY,
            until: null,
        },
        title: ETerminals.EMPTY,
        assignee: ETerminals.EMPTY,
        location: {
            region: ETerminals.EMPTY,
            address: ETerminals.EMPTY,
            branch: ETerminals.EMPTY,
            format: ETerminals.EMPTY,
        },
    });
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([task.id]);
    const service = useRef(
        getEditorService(EEditorType.TASK, [[focusedPuzzleChain, setFocusedPuzzleChain]])
    );

    const focusedPuzzleId = _.head(focusedPuzzleChain);

    return (
        <React.Fragment>
            <EditorToolbar
                top={0}
                items={[
                    {
                        label: "Добавить шаблон",
                        icon: <QuestionIcon />,
                        action: _.noop,
                    },
                    {
                        label: "Оставить комментарий",
                        icon: <CommentsIcon />,
                        action: _.noop,
                    },
                    { label: "Удалить шаблон", icon: <TrashIcon />, action: _.noop },
                ]}
            />
            <SelectableBlockWrapper
                css={theme => ({
                    padding: theme.spacing(3),
                    zIndex: 1300,
                })}
                onFocus={service.current.onPuzzleFocus.bind(service.current, task.id)}
                onMouseDown={service.current.onPuzzleFocus.bind(service.current, task.id)}
                onBlur={service.current.onPuzzleBlur.bind(service.current)}
                focused={focusedPuzzleId === task.id}
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
                            value={task.title}
                            fullWidth
                        />
                    </TaskFieldContainer>
                    <TaskFieldContainer label="Этап задания">
                        <Grid container direction="row" alignItems="flex-end" spacing={2}>
                            <Grid item xs>
                                <InputField
                                    placeholder="Введите название этапа"
                                    value={task.stage.title}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <DateField
                                    value={
                                        task.stage.until ? getFriendlyDate(task.stage.until) : ""
                                    }
                                    placeholder="Срок выполнения"
                                />
                            </Grid>
                        </Grid>
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
            <SelectableBlockWrapper css={theme => ({ padding: theme.spacing(3) })}>
                <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                    <Grid item xs={12}>
                        <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                            Документы
                        </Typography>
                    </Grid>
                </Grid>
            </SelectableBlockWrapper>
        </React.Fragment>
    );
};
