/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import {
    Button,
    ButtonLikeText,
    Checkbox,
    DateField,
    SelectableBlockWrapper,
    SelectField,
    StepperWrapper,
} from "@magnit/components";
import {
    ETaskStatus,
    IDocument,
    IExtendedTask,
    IStageStep,
    IVirtualDocument,
    IWithAnswers,
} from "@magnit/entities";
import { AddIcon, CheckIcon } from "@magnit/icons";
import { getFriendlyDate, IEditorService } from "@magnit/services";
import {
    Dialog,
    FormControl,
    FormControlLabel,
    Grid,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core";
import { TemplateRenderer } from "components/renderers";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import uuid from "uuid/v4";
import { ChangeAssigneeIllustration } from "./ChangeAssigneeIllustration";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

interface IViewTaskProps {
    task: Partial<IExtendedTask>;
    service: IEditorService;
    documents: IVirtualDocument[];
    templates: Array<IDocument & IWithAnswers>;
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, object>;

    onAddStage?(step: IStageStep): void;

    onDeleteStage?(id: number): void;

    onTaskChange?(task: Partial<IExtendedTask>): void;

    onEditableChange?(documentId: number, editable: boolean): void;

    onTemplatesChange?(uuid: string, event: TSelectChangeEvent): void;
}

export const ViewTask: React.FC<IViewTaskProps> = props => {
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(false);
    const { service, task, focusedPuzzleId, templateSnapshots, documents, templates } = props;
    const { onAddStage, onDeleteStage, onEditableChange, onTemplatesChange, onTaskChange } = props;

    const [stageTitleMap, setStageTitleMap] = useState(new Map<number, string>());
    const [stageDeadlineMap, setStageDeadlineMap] = useState(new Map<number, string>());

    const editable =
        task.status !== ETaskStatus.IN_PROGRESS && task.status !== ETaskStatus.COMPLETED;
    const allowUseStageEditable = editable;

    useEffect(() => {
        if (!task.stages || !onAddStage || !editable) {
            return;
        }
        if (task.stages.length === 0) {
            onAddStage({
                id: 0,
                editable: true,
                title: "",
                completed: false,
                deadline: "",
            });
        }
    }, [task.stages, onAddStage, editable]);

    function onDialogClose(): void {
        setOpen(false);
    }

    function onAssigneeChange(): void {
        setOpen(true);
    }

    function onAssigneeChangeComplete(): void {
        setOpen(false);
    }

    const onAddStepCallback = useCallback((): void => {
        const last = _.last(task.stages);
        if (!last) {
            return;
        }
        if (onAddStage) {
            onAddStage({
                id: last.id + 1,
                title: "",
                deadline: "",
                editable: true,
            });
        }
    }, [task.stages, onAddStage]);

    const onChangeStepTitleCallback = useCallback(
        (id: number, value: string): void => {
            if (!task.stages) {
                return;
            }
            if (task.stages.some(step => step.id === id)) {
                const stageIndex = task.stages.findIndex(step => step.id === id);
                const stage = task.stages[stageIndex];
                stageTitleMap.set(stage.id, value);
                setStageTitleMap(new Map(stageTitleMap));
                // stage.title = value;
                // if (onAddStage && onDeleteStage) {
                //     onDeleteStage(stage.id);
                //     onAddStage(stage);
                // }
            }
        },
        [task.stages, stageTitleMap],
    );

    const onChangeStepDateCallback = useCallback(
        (id: number, value: string): void => {
            if (!task.stages) {
                return;
            }
            if (task.stages.some(step => step.id === id)) {
                const stageIndex = task.stages.findIndex(step => step.id === id);
                const stage = task.stages[stageIndex];
                stageDeadlineMap.set(stage.id, value);
                setStageDeadlineMap(new Map(stageDeadlineMap));
                // stage.deadline = value;
                // if (onAddStage && onDeleteStage) {
                //     onDeleteStage(stage.id);
                //     onAddStage(stage);
                // }
            }
        },
        [task.stages, stageDeadlineMap],
    );

    const onStepDeleteCallback = useCallback(
        (id: number) => {
            if (!task.stages) {
                return;
            }
            // disallow deleting if only 1 stage present
            if (task.stages.length < 2) {
                return;
            }
            if (onDeleteStage) {
                onDeleteStage(id);
            }
        },
        [onDeleteStage, task.stages],
    );

    const onEditableChangeCallback = useCallback(
        (documentId: number, editable: boolean) => {
            if (onEditableChange) {
                onEditableChange(documentId, editable);
            }
        },
        [onEditableChange],
    );

    const onStepBlurCallback = useCallback(() => {
        if (!task.stages || !onTaskChange) {
            return;
        }
        const stages = task.stages.map(stage => ({
            ...stage,
            title: stage.title || stageTitleMap.get(stage.id) || "",
            deadline: stage.deadline || stageDeadlineMap.get(stage.id) || "",
        }));
        onTaskChange({ ...task, stages });
    }, [task, onTaskChange, stageTitleMap, stageDeadlineMap]);

    function onMenuClick(event: React.MouseEvent<HTMLElement>) {
        setMenuAnchorElement(event.currentTarget);
    }

    function onMenuClose() {
        setMenuAnchorElement(null);
    }

    const onNotifyBeforeChange = useCallback(
        (notifyBefore: number) => {
            onMenuClose();
            if (onTaskChange) {
                onTaskChange({ ...task, notifyBefore });
            }
        },
        [onTaskChange, task],
    );

    const getTaskId = useCallback(() => _.get(task, "id", uuid()).toString(), [task]);

    const showNewStageButton =
        allowUseStageEditable && (task.stages || []).every(step => !step.editable);

    const showEmptyStages =
        (task.stages && task.stages.length > 0) ||
        ((!task.stages || task.stages.length === 0) && allowUseStageEditable);

    function onNotifyBeforeOneDay() {
        onNotifyBeforeChange(1);
    }

    function onNotifyBeforeTwoDays() {
        onNotifyBeforeChange(2);
    }

    function onNotifyBeforeThreeDays() {
        onNotifyBeforeChange(3);
    }

    function onNotifyBeforeFourDays() {
        onNotifyBeforeChange(4);
    }

    function onNotifyBeforeFiveDays() {
        onNotifyBeforeChange(5);
    }

    function onNotifyBeforeSixDays() {
        onNotifyBeforeChange(6);
    }

    function onNotifyBeforeSevenDays() {
        onNotifyBeforeChange(7);
    }

    return (
        <React.Fragment>
            <Menu
                keepMounted
                open={Boolean(menuAnchorElement)}
                anchorEl={menuAnchorElement}
                onClose={onMenuClose}
            >
                <MenuItem onClick={onNotifyBeforeOneDay}>за 1 день</MenuItem>
                <MenuItem onClick={onNotifyBeforeTwoDays}>за 2 дня</MenuItem>
                <MenuItem onClick={onNotifyBeforeThreeDays}>за 3 дня</MenuItem>
                <MenuItem onClick={onNotifyBeforeFourDays}>за 4 дня</MenuItem>
                <MenuItem onClick={onNotifyBeforeFiveDays}>за 5 дней</MenuItem>
                <MenuItem onClick={onNotifyBeforeSixDays}>за 6 дней</MenuItem>
                <MenuItem onClick={onNotifyBeforeSevenDays}>за 7 дней</MenuItem>
            </Menu>
            <Dialog
                onClose={onDialogClose}
                open={open}
                classes={{ paper: "paper" }}
                css={css`
                    .paper {
                        overflow: hidden;
                    }
                `}
            >
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    css={theme => ({
                        padding: theme.spacing(6),
                        minWidth: theme.spacing(50),
                    })}
                >
                    <Grid item>
                        <Grid container justify="center" alignItems="center">
                            <Grid item>
                                <ChangeAssigneeIllustration />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography css={theme => ({ fontSize: theme.fontSize.medium })}>
                            Выберите исполнителя:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <SelectField fullWidth placeholder="Выберите исполнителя">
                            <MenuItem>Гончар Семён Платонович</MenuItem>
                            <MenuItem>Маслов Гарри Валерьевич</MenuItem>
                            <MenuItem>Буров Юлиан Данилович</MenuItem>
                            <MenuItem>Воронов Юрий Виталиевич</MenuItem>
                            <MenuItem>Лановой Устин Иванович</MenuItem>
                        </SelectField>
                    </Grid>
                    <Grid item css={theme => ({ paddingTop: `${theme.spacing(5)} !important` })}>
                        <Grid container justify="center" alignItems="center">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    scheme="blue"
                                    onClick={onAssigneeChangeComplete}
                                >
                                    <CheckIcon />
                                    <Typography>Сохранить</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
            <SelectableBlockWrapper
                css={theme => ({
                    padding: theme.spacing(3),
                    zIndex: focusedPuzzleId === getTaskId() ? 1300 : "initial",
                })}
                onFocus={service.onPuzzleFocus.bind(service, getTaskId())}
                onMouseDown={service.onPuzzleFocus.bind(service, getTaskId())}
                focused={focusedPuzzleId === getTaskId()}
                id={getTaskId()}
            >
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        css={theme => ({
                            paddingLeft: theme.spacing(4),
                            paddingRight: theme.spacing(4),
                        })}
                    >
                        <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                            {task.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <span
                            css={theme => ({
                                width: theme.spacing(),
                                height: theme.spacing(),
                                borderRadius: "50%",
                                display: "inline-block",
                                background: task.status
                                    ? getColorByStatus(theme, task.status)
                                    : "none",
                                margin: "2px 10px 2px 0",
                            })}
                        />
                        <span
                            css={theme => ({
                                color: task.status
                                    ? getColorByStatus(theme, task.status)
                                    : "inherit",
                            })}
                        >
                            {task.status && getTitleByStatus(task.status)}
                        </span>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs css={theme => ({ marginTop: theme.spacing(4) })}>
                        <Grid spacing={2} container direction="row">
                            <InfoField title="Администратор" value="Барановский Прохор Артёмович" />
                            <InfoField
                                title="Исполнитель"
                                value="Рукастый Иннокентий Петрович"
                                editable
                                label="Изменить исполнителя"
                                onEditableClick={onAssigneeChange}
                            />
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            direction="row"
                            css={theme => ({ marginTop: theme.spacing(3) })}
                        >
                            <InfoField
                                title="Местоположение"
                                value="Челябинская область, г. Челябинск, ул. Железная, д. 5"
                            />
                            <InfoField title="Формат объекта" value="МК" />
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <Grid
                            container
                            spacing={2}
                            css={{
                                height: "100%",
                                alignItems: !showEmptyStages ? "flex-end" : "initial",
                            }}
                        >
                            <Grid item xs={12}>
                                {showEmptyStages && (
                                    <StepperWrapper
                                        onTitleChange={onChangeStepTitleCallback}
                                        onTitleBlur={onStepBlurCallback}
                                        onStepDelete={onStepDeleteCallback}
                                        steps={(task.stages || []).map(stage => {
                                            const safeStageDeadline =
                                                stage.deadline ||
                                                stageDeadlineMap.get(stage.id) ||
                                                "";
                                            const deadline = !stage.editable
                                                ? getFriendlyDate(new Date(safeStageDeadline))
                                                : safeStageDeadline;
                                            const safeStageTitle =
                                                stage.title || stageTitleMap.get(stage.id) || "";
                                            return {
                                                id: stage.id,
                                                editable: stage.editable,
                                                completed: stage.finished,
                                                title: safeStageTitle,
                                                content: (
                                                    <DateField
                                                        disabled={!stage.editable}
                                                        onChange={event =>
                                                            onChangeStepDateCallback(
                                                                stage.id,
                                                                event.target.value,
                                                            )
                                                        }
                                                        onBlur={onStepBlurCallback}
                                                        value={deadline}
                                                    />
                                                ),
                                            };
                                        })}
                                    />
                                )}
                                {showNewStageButton && (
                                    <Button
                                        variant="outlined"
                                        scheme="outline"
                                        css={theme => ({
                                            color: theme.colors.primary,
                                            marginLeft: theme.spacing(6),
                                        })}
                                        onClick={onAddStepCallback}
                                    >
                                        <AddIcon />
                                        <Typography>Новый этап</Typography>
                                    </Button>
                                )}
                            </Grid>
                            {task.notifyBefore && (
                                <Grid
                                    item
                                    xs={12}
                                    css={theme => ({ marginLeft: theme.spacing(6) })}
                                >
                                    <Typography>
                                        Уведомить исполнителя о наступлении <br /> срока выполнения
                                        этапа
                                        <ButtonLikeText
                                            onClick={onMenuClick}
                                            css={theme => ({ fontSize: theme.fontSize.normal })}
                                        >
                                            &nbsp;за {task.notifyBefore}
                                            &nbsp;{getNotifySuffix(task.notifyBefore)}
                                        </ButtonLikeText>
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </SelectableBlockWrapper>
            {documents.map(document => (
                <TaskDocument
                    documents={documents}
                    key={document.__uuid}
                    document={document}
                    templates={templates}
                    service={service}
                    templateSnapshots={templateSnapshots}
                    focusedPuzzleId={focusedPuzzleId}
                    onEditableChange={onEditableChangeCallback}
                    onTemplateChange={onTemplatesChange}
                />
            ))}
        </React.Fragment>
    );
};

ViewTask.displayName = "ViewTask";

interface ITaskDocumentProps {
    documents: IVirtualDocument[];
    document: IVirtualDocument;
    service: IEditorService;
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, object>;
    templates: Array<IDocument & IWithAnswers>;

    onEditableChange?(documentId: number, editable: boolean): void;

    onTemplateChange?(uuid: string, event: TSelectChangeEvent): void;
}

const TaskDocument: React.FC<ITaskDocumentProps> = props => {
    const { focusedPuzzleId, service, document, templates, documents, templateSnapshots } = props;
    const { onEditableChange, onTemplateChange } = props;

    const snapshot = templateSnapshots.get(document.id.toString());
    const focused = focusedPuzzleId === document.__uuid;

    const answers = templates
        .filter(template => template.id === document.id)
        .flatMap(template => template.answers || []);

    const onEditableChangeCallback = useCallback(
        (event: TSelectChangeEvent, checked: boolean) => {
            if (onEditableChange) {
                onEditableChange(document.id, checked);
            }
        },
        [document.id, onEditableChange],
    );

    const onTemplateChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            if (onTemplateChange) {
                onTemplateChange(document.__uuid, event);
            }
        },
        [document.__uuid, onTemplateChange],
    );

    return (
        <SelectableBlockWrapper
            onFocus={service.onPuzzleFocus.bind(service, document.__uuid)}
            onMouseDown={service.onPuzzleFocus.bind(service, document.__uuid)}
            css={theme => ({
                padding: theme.spacing(3),
                zIndex: focusedPuzzleId === document.__uuid ? 1300 : "initial",
            })}
            focused={focused}
            id={document.__uuid}
        >
            {document.virtual && (
                <Grid item xs={3} css={theme => ({ paddingLeft: theme.spacing(3) })}>
                    <SelectField
                        placeholder="Выбрать шаблон"
                        value={document.id === -1 ? "" : document.id}
                        fullWidth
                        onChange={onTemplateChangeCallback}
                    >
                        {templates
                            .filter(template =>
                                document.id !== template.id
                                    ? !documents.find(document => document.id === template.id)
                                    : true,
                            )
                            .map(template => (
                                <MenuItem key={template.id} value={template.id}>
                                    {template.title}
                                </MenuItem>
                            ))}
                    </SelectField>
                </Grid>
            )}
            <Grid container css={theme => ({ padding: theme.spacing(4) })}>
                <Grid item xs={9}>
                    <Typography css={theme => ({ fontSize: theme.fontSize.xLarge })}>
                        {_.get(snapshot, "title")}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Grid container justify="center" alignItems="flex-end">
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={document.editable}
                                        css={theme => ({ marginRight: theme.spacing() })}
                                        onChange={onEditableChangeCallback}
                                    />
                                }
                                label="Разрешить редактирование"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {focused && <TemplateRenderer answers={answers} template={snapshot} />}
                </Grid>
            </Grid>
        </SelectableBlockWrapper>
    );
};

TaskDocument.displayName = "TaskDocument";

interface IMainInfoProps {
    title: string;
    value: string;
    editable?: boolean;
    label?: string;

    onEditableClick?(): void;
}

const InfoField: React.FC<IMainInfoProps> = props => {
    const { title, value, editable, label, onEditableClick } = props;
    return (
        <Grid item xs>
            <Typography
                css={theme => ({
                    color: theme.colors.secondary,
                    fontSize: theme.fontSize.smaller,
                    textTransform: "uppercase",
                })}
            >
                {title}
            </Typography>
            <Typography
                css={theme => ({
                    fontSize: theme.fontSize.normal,
                    color: theme.colors.black,
                })}
            >
                {value}
            </Typography>
            {editable && <ButtonLikeText onClick={onEditableClick}>{label}</ButtonLikeText>}
        </Grid>
    );
};

InfoField.displayName = "InfoField";

function getTitleByStatus(status: ETaskStatus): string {
    return {
        [ETaskStatus.IN_PROGRESS]: "В работе",
        [ETaskStatus.ON_CHECK]: "На проверке",
        [ETaskStatus.COMPLETED]: "Завершено",
        [ETaskStatus.DRAFT]: "Черновик",
        [ETaskStatus.EXPIRED]: "Просрочено",
    }[status];
}

function getColorByStatus(theme: any, status: ETaskStatus): string {
    return {
        [ETaskStatus.IN_PROGRESS]: theme.colors.violet,
        [ETaskStatus.ON_CHECK]: theme.colors.darkYellow,
        [ETaskStatus.COMPLETED]: theme.colors.green,
        [ETaskStatus.DRAFT]: theme.colors.secondary,
        [ETaskStatus.EXPIRED]: theme.colors.darkRed,
    }[status];
}

function getNotifySuffix(notifyBefore: number): string {
    if (notifyBefore === 1) {
        return "день";
    }
    if (notifyBefore > 1 && notifyBefore < 5) {
        return "дня";
    }
    return "дней";
}
