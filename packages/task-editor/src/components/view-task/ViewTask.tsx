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
import { useCallback, useEffect, useRef, useState } from "react";
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

    const { stages } = task;
    const initialStepsState =
        stages &&
        stages.length > 0 &&
        stages.map(stage => ({
            ...stage,
            completed: stage.finished,
            editable: !!stage.editable,
        }));
    const defaultStepsState = [
        {
            id: 0,
            title: "",
            deadline: "",
            completed: false,
            editable: true,
        },
    ];
    const [steps, setSteps] = useState<IStageStep[]>(initialStepsState || defaultStepsState);

    const initialStepsSet = useRef(false);
    useEffect(() => {
        if (!initialStepsState || initialStepsSet.current) {
            return;
        }
        if (!_.isEqual(steps, initialStepsState)) {
            initialStepsSet.current = true;
            setSteps(initialStepsState);
        }
    }, [initialStepsState, steps]);

    useEffect(() => {
        const diffSteps = steps
            .filter(step => step.title && step.deadline)
            .filter(step => stages && !stages.find(stage => stage.id === step.id));
        if (diffSteps.length) {
            diffSteps.forEach(step => onAddStage && onAddStage(step));
        }
    }, [steps, stages, onAddStage, onTaskChange, task]);

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
        const last = _.last(steps);
        if (!last) {
            return;
        }
        setSteps([
            ...steps,
            {
                id: last.id + 1,
                title: "",
                deadline: "",
                completed: false,
                editable: true,
            },
        ]);
    }, [steps]);

    const onChangeStepTitleCallback = useCallback(
        (id: number, value: string): void => {
            if (steps.some(step => step.id === id)) {
                const stepIndex = steps.findIndex(step => step.id === id);
                steps[stepIndex].title = value;
                setSteps([...steps]);
            }
        },
        [steps],
    );

    const onChangeStepDateCallback = useCallback(
        (id: number, value: string): void => {
            if (steps.some(step => step.id === id)) {
                const stepIndex = steps.findIndex(step => step.id === id);
                steps[stepIndex].deadline = value;
                setSteps([...steps]);
            }
        },
        [steps],
    );

    const onStepDeleteCallback = useCallback(
        (id: number) => {
            // disallow deleting if only 1 stage present
            if (steps.length < 2) {
                return;
            }
            if (steps.some(step => step.id === id)) {
                const stepIndex = steps.findIndex(step => step.id === id);
                steps.splice(stepIndex, 1);
                setSteps([...steps]);
                if (onDeleteStage) {
                    onDeleteStage(id);
                }
            }
        },
        [onDeleteStage, steps],
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
        const validSteps = steps.filter(step => step.title && step.deadline);
        if (validSteps.length && onTaskChange) {
            const nextStages = _.cloneDeep(steps).map(stage => ({ ...stage, finished: false }));
            onTaskChange({ ...task, stages: nextStages });
        }
    }, [onTaskChange, steps, task]);

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

    return (
        <React.Fragment>
            <Menu
                keepMounted
                open={Boolean(menuAnchorElement)}
                anchorEl={menuAnchorElement}
                onClose={onMenuClose}
            >
                <MenuItem onClick={() => onNotifyBeforeChange(1)}>за 1 день</MenuItem>
                <MenuItem onClick={() => onNotifyBeforeChange(2)}>за 2 дня</MenuItem>
                <MenuItem onClick={() => onNotifyBeforeChange(3)}>за 2 дня</MenuItem>
                <MenuItem onClick={() => onNotifyBeforeChange(4)}>за 4 дня</MenuItem>
                <MenuItem onClick={() => onNotifyBeforeChange(5)}>за 5 дней</MenuItem>
                <MenuItem onClick={() => onNotifyBeforeChange(6)}>за 6 дней</MenuItem>
                <MenuItem onClick={() => onNotifyBeforeChange(7)}>за 7 дней</MenuItem>
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
                        <Grid container direction="row">
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <StepperWrapper
                                    onTitleChange={onChangeStepTitleCallback}
                                    onTitleBlur={onStepBlurCallback}
                                    onStepDelete={onStepDeleteCallback}
                                    steps={steps.map(step => ({
                                        id: step.id,
                                        editable: step.editable,
                                        completed: step.completed,
                                        title: step.title,
                                        content: (
                                            <DateField
                                                disabled={!step.editable}
                                                onChange={event =>
                                                    onChangeStepDateCallback(
                                                        step.id,
                                                        event.target.value,
                                                    )
                                                }
                                                onBlur={onStepBlurCallback}
                                                value={
                                                    !step.editable
                                                        ? getFriendlyDate(new Date(step.deadline))
                                                        : step.deadline
                                                }
                                            />
                                        ),
                                    }))}
                                />
                                {![ETaskStatus.IN_PROGRESS, ETaskStatus.COMPLETED].includes(
                                    task.status!,
                                ) &&
                                    !steps.some(step => step.editable) && (
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
    }[status];
}

function getColorByStatus(theme: any, status: ETaskStatus): string {
    return {
        [ETaskStatus.IN_PROGRESS]: theme.colors.violet,
        [ETaskStatus.ON_CHECK]: theme.colors.darkYellow,
        [ETaskStatus.COMPLETED]: theme.colors.green,
        [ETaskStatus.DRAFT]: theme.colors.secondary,
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
