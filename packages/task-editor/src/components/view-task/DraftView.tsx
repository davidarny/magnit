/** @jsx jsx */

import { jsx } from "@emotion/core";
import { DateField, InputField, SelectableBlockWrapper, SelectField } from "@magnit/components";
import { IExtendedTask } from "@magnit/entities";
import { getFriendlyDate, IEditorService } from "@magnit/services";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import { TaskFieldContainer } from "components/task-field-container";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface IDraftViewProps {
    service: IEditorService;
    task: Partial<IExtendedTask>;
    focusedPuzzleId?: string;
    regions?: string[];
    cities?: string[];
    formats?: string[];
    addresses?: string[];

    onTaskChange?(task: Partial<IExtendedTask>): void;

    onChangeStageTitle?(id: number, value: string): void;

    onChangeStageDeadline?(id: number, value: string): void;
}

type TSelectChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

export const DraftView: React.FC<IDraftViewProps> = props => {
    const {
        focusedPuzzleId,
        service,
        task,
        onChangeStageTitle,
        onChangeStageDeadline,
        onTaskChange,
        regions,
        cities,
        addresses,
        formats,
    } = props;

    const { stages, title, notifyBefore } = task;
    const id = task.id ? task.id.toString() : "";

    const lastStage = _.last(stages);

    const [lastStageTitle, setLastStageTitle] = useState(lastStage ? lastStage.title : "");
    const [lastStageDeadline, setLastStageDeadline] = useState(
        lastStage
            ? !_.isNaN(Date.parse(lastStage.deadline))
                ? getFriendlyDate(new Date(lastStage.deadline))
                : ""
            : "",
    );
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
            setLastStageDeadline(
                !_.isNaN(Date.parse(lastStage.deadline))
                    ? getFriendlyDate(new Date(lastStage.deadline))
                    : "",
            );
        }
    }, [lastStage, title]);

    // resetting fields if any marketplace value has changed
    const prevTask = useRef(_.cloneDeep(task));
    const prevTaskRegion = useRef(task.marketplace ? task.marketplace.region : "");
    const prevTaskCity = useRef(task.marketplace ? task.marketplace.city : "");
    const prevTaskFormat = useRef(task.marketplace ? task.marketplace.format : "");
    useEffect(() => {
        if (!onTaskChange || _.isEqual(prevTask.current, task) || !task.marketplace) {
            return;
        }

        const nextTask = { ...task };

        const format = task.marketplace.format;
        const city = task.marketplace.city;
        const region = task.marketplace.region;

        if (prevTaskFormat.current && prevTaskFormat.current !== format) {
            nextTask.marketplace!.address = "";
        }
        if (prevTaskCity.current && prevTaskCity.current !== city) {
            nextTask.marketplace!.address = "";
            nextTask.marketplace!.format = "";
        }
        if (prevTaskRegion.current && prevTaskRegion.current !== region) {
            nextTask.marketplace!.address = "";
            nextTask.marketplace!.format = "";
            nextTask.marketplace!.city = "";
        }

        prevTask.current = _.cloneDeep(nextTask);

        prevTaskRegion.current = region;
        prevTaskCity.current = city;
        prevTaskFormat.current = format;

        onTaskChange(nextTask);
    }, [onTaskChange, task]);

    const onBlurStageCallback = useCallback(() => {
        if (!lastStage) {
            return;
        }
        if (onChangeStageTitle) {
            onChangeStageTitle(lastStage.id, lastStageTitle);
        }
        if (onChangeStageDeadline) {
            onChangeStageDeadline(lastStage.id, lastStageDeadline);
        }
    }, [lastStage, lastStageDeadline, lastStageTitle, onChangeStageDeadline, onChangeStageTitle]);

    const onBlurTaskTitleCallback = useCallback(() => {
        if (onTaskChange) {
            onTaskChange({ ...task, title: taskTitle });
        }
    }, [onTaskChange, task, taskTitle]);

    function onStageTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLastStageTitle(event.target.value);
    }

    function onStageDeadlineChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLastStageDeadline(event.target.value);
    }

    function onTaskTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTaskTitle(event.target.value);
    }

    const onNotifyBeforeChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            if (onTaskChange) {
                onTaskChange({
                    ...task,
                    notifyBefore: event.target.value as number,
                });
            }
        },
        [onTaskChange, task],
    );

    const onRegionChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            if (onTaskChange) {
                onTaskChange({
                    ...task,
                    marketplace: {
                        ...task.marketplace!,
                        region: event.target.value as string,
                    },
                });
            }
        },
        [onTaskChange, task],
    );

    const onCityChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            if (onTaskChange) {
                onTaskChange({
                    ...task,
                    marketplace: {
                        ...task.marketplace!,
                        city: event.target.value as string,
                    },
                });
            }
        },
        [onTaskChange, task],
    );

    const onFormatChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            if (onTaskChange) {
                onTaskChange({
                    ...task,
                    marketplace: {
                        ...task.marketplace!,
                        format: event.target.value as string,
                    },
                });
            }
        },
        [onTaskChange, task],
    );

    const onAddressChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            if (onTaskChange) {
                onTaskChange({
                    ...task,
                    marketplace: {
                        ...task.marketplace!,
                        address: event.target.value as string,
                    },
                });
            }
        },
        [onTaskChange, task],
    );

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
                        onChange={onNotifyBeforeChangeCallback}
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
                        <Grid item xs={3}>
                            <SelectField
                                value={task.marketplace ? task.marketplace.region : ""}
                                placeholder="Регион"
                                fullWidth
                                onChange={onRegionChangeCallback}
                            >
                                {(regions || []).map(region => (
                                    <MenuItem key={region} value={region}>
                                        {region}
                                    </MenuItem>
                                ))}
                            </SelectField>
                        </Grid>
                        {task.marketplace && task.marketplace.region && (
                            <Grid item xs={3}>
                                <SelectField
                                    value={task.marketplace ? task.marketplace.city : ""}
                                    placeholder="Филиал"
                                    fullWidth
                                    onChange={onCityChangeCallback}
                                >
                                    {(cities || []).map(city => (
                                        <MenuItem key={city} value={city}>
                                            {city}
                                        </MenuItem>
                                    ))}
                                </SelectField>
                            </Grid>
                        )}
                        {task.marketplace && task.marketplace.city && (
                            <Grid item xs={3}>
                                <SelectField
                                    value={task.marketplace ? task.marketplace.format : ""}
                                    placeholder="Формат"
                                    fullWidth
                                    onChange={onFormatChangeCallback}
                                >
                                    {(formats || []).map(format => (
                                        <MenuItem key={format} value={format}>
                                            {format}
                                        </MenuItem>
                                    ))}
                                </SelectField>
                            </Grid>
                        )}
                        {task.marketplace && task.marketplace.format && (
                            <Grid item xs={3}>
                                <SelectField
                                    value={task.marketplace ? task.marketplace.address : ""}
                                    placeholder="Адрес"
                                    fullWidth
                                    onChange={onAddressChangeCallback}
                                >
                                    {(addresses || []).map(address => (
                                        <MenuItem key={address} value={address}>
                                            {address}
                                        </MenuItem>
                                    ))}
                                </SelectField>
                            </Grid>
                        )}
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
