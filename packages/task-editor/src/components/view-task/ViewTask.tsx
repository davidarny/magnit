/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    Button,
    ButtonLikeText,
    Fab,
    SelectableBlockWrapper,
    SelectField,
} from "@magnit/components";
import {
    ETaskStatus,
    IComment,
    IDocument,
    IExtendedDocument,
    IExtendedTask,
    IStageStep,
    IVirtualDocument,
} from "@magnit/entities";
import { AddIcon, CheckIcon } from "@magnit/icons";
import { IEditorService } from "@magnit/services";
import { Dialog, Grid, Menu, MenuItem, Typography } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import uuid from "uuid/v4";
import { ChangeAssigneeIllustration } from "./ChangeAssigneeIllustration";
import { DraftView } from "./DraftView";
import { InfoField } from "./InfoField";
import { TaskDocument } from "./TaskDocument";
import { TaskStages } from "./TaskStages";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

interface IViewTaskProps {
    task: Partial<IExtendedTask>;
    service: IEditorService;
    documents: IVirtualDocument[];
    templates: Array<IDocument & IExtendedDocument>;
    pendingComments: IComment[];
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, object>;
    editable?: boolean;
    regions?: string[];
    cities?: string[];
    formats?: string[];
    addresses?: string[];

    onAddStage?(step: IStageStep): void;

    onDeleteStage?(id: number): void;

    onTaskChange?(task: Partial<IExtendedTask>): void;

    onEditableChange?(documentId: number, editable: boolean): void;

    onTemplatesChange?(uuid: string, event: TSelectChangeEvent): void;

    onAddAsset?(file: File): void;

    onDeleteAsset?(id: number): void;

    onPendingCommentDelete?(commentId: number): void;

    onPendingCommentAccept?(comment: IComment): void;

    onCommentDelete?(commentId: number): void;
}

export const ViewTask: React.FC<IViewTaskProps> = props => {
    const {
        service,
        task,
        pendingComments,
        focusedPuzzleId,
        templateSnapshots,
        documents,
        templates,
        editable = true,
        onAddStage,
        onDeleteStage,
        onEditableChange,
        onTemplatesChange,
        onTaskChange,
        onAddAsset,
        onDeleteAsset,
        onPendingCommentDelete,
        onPendingCommentAccept,
        onCommentDelete,
        regions,
        cities,
        addresses,
        formats,
    } = props;

    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(false);

    const input = useRef<HTMLInputElement>(null);

    function onAddAssetTrigger() {
        if (input.current) {
            input.current.click();
        }
    }

    const onFileChangeCallback = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = _.first(event.target.files);
            if (!file) {
                return;
            }
            if (onAddAsset) {
                onAddAsset(file);
            }
        },
        [onAddAsset],
    );

    const onDeleteAssetCallback = useCallback(
        (id: number) => {
            if (onDeleteAsset) {
                onDeleteAsset(id);
            }
        },
        [onDeleteAsset],
    );

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

    const onAddStageCallback = useCallback((): void => {
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

    const onChangeStageTitleCallback = useCallback(
        (stageId: number, title: string): void => {
            if (!task.stages) {
                return;
            }
            if (task.stages.some(stage => stage.id === stageId)) {
                const stageIndex = task.stages.findIndex(step => step.id === stageId);
                const stage = task.stages[stageIndex];
                stage.title = title;
            }
            if (onTaskChange) {
                onTaskChange({ ...task });
            }
        },
        [task, onTaskChange],
    );

    const onChangeStageDeadlineCallback = useCallback(
        (stageId: number, deadline: string): void => {
            if (!task.stages) {
                return;
            }
            if (task.stages.some(step => step.id === stageId)) {
                const stageIndex = task.stages.findIndex(step => step.id === stageId);
                const stage = task.stages[stageIndex];
                stage.deadline = deadline;
            }
            if (onTaskChange) {
                onTaskChange({ ...task });
            }
        },
        [task, onTaskChange],
    );

    const onDeleteStageCallback = useCallback(
        (stageId: number) => {
            if (!task.stages) {
                return;
            }
            // disallow deleting if only 1 stage present
            if (task.stages.length < 2) {
                return;
            }
            if (onDeleteStage) {
                onDeleteStage(stageId);
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

    const showNewStageButton = editable && (task.stages || []).every(step => !step.editable);

    const showEmptyStages =
        (task.stages && task.stages.length > 0) ||
        ((!task.stages || task.stages.length === 0) && editable);

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

    const documentsBlockId = useRef(uuid());

    const isEditableMode =
        task.status !== ETaskStatus.IN_PROGRESS && task.status !== ETaskStatus.COMPLETED;

    const deleteAssetVisible = isEditableMode;

    const isViewOnlyMode =
        task.status === ETaskStatus.IN_PROGRESS || task.status === ETaskStatus.COMPLETED;

    const taskHasDocuments = task.documents && task.documents.length > 0;
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
                css={{ ".paper": { overflow: "hidden" } }}
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
            {task.status === ETaskStatus.DRAFT && (
                <DraftView
                    cities={cities}
                    regions={regions}
                    formats={formats}
                    addresses={addresses}
                    service={service}
                    focusedPuzzleId={focusedPuzzleId}
                    task={task}
                    onTaskChange={onTaskChange}
                    onChangeStageTitle={onChangeStageTitleCallback}
                    onChangeStageDeadline={onChangeStageDeadlineCallback}
                />
            )}
            {task.status !== ETaskStatus.DRAFT && (
                <SelectableBlockWrapper
                    css={theme => ({
                        padding: theme.spacing(3),
                        zIndex: focusedPuzzleId === getTaskId() ? 1300 : "initial",
                    })}
                    onFocus={service.onPuzzleFocus.bind(service, getTaskId(), false)}
                    onMouseDown={service.onPuzzleFocus.bind(service, getTaskId(), false)}
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
                        <Grid item xs={7} css={theme => ({ marginTop: theme.spacing(4) })}>
                            <Grid spacing={2} container direction="row">
                                <InfoField
                                    title="Администратор"
                                    value="Барановский Прохор Артёмович"
                                />
                                <InfoField
                                    title="Исполнитель"
                                    value="Рукастый Иннокентий Петрович"
                                    editable={editable}
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
                                {task.marketplace &&
                                    task.marketplace.region &&
                                    task.marketplace.city &&
                                    task.marketplace.address && (
                                        <InfoField
                                            title="Местоположение"
                                            value={`${task.marketplace.region}, г. ${task.marketplace.city}, ул. ${task.marketplace.address}`}
                                        />
                                    )}
                                {task.marketplace && task.marketplace.format && (
                                    <InfoField
                                        title="Формат объекта"
                                        value={task.marketplace.format}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
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
                                        <TaskStages
                                            task={task}
                                            onChangeStageDeadline={onChangeStageDeadlineCallback}
                                            onChangeStageTitle={onChangeStageTitleCallback}
                                            onDeleteStage={onDeleteStageCallback}
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
                                            onClick={onAddStageCallback}
                                        >
                                            <AddIcon />
                                            <Typography>Новый этап</Typography>
                                        </Button>
                                    )}
                                </Grid>
                                {task.status !== ETaskStatus.COMPLETED && task.notifyBefore && (
                                    <Grid
                                        item
                                        xs={12}
                                        css={theme => ({ marginLeft: theme.spacing(6) })}
                                    >
                                        <Typography>
                                            Уведомить исполнителя о наступлении <br /> срока
                                            выполнения этапа
                                            {editable && (
                                                <ButtonLikeText
                                                    onClick={onMenuClick}
                                                    css={theme => ({
                                                        fontSize: theme.fontSize.normal,
                                                    })}
                                                >
                                                    &nbsp;за {task.notifyBefore}
                                                    &nbsp;{getNotifySuffix(task.notifyBefore)}
                                                </ButtonLikeText>
                                            )}
                                            {!editable && (
                                                <React.Fragment>
                                                    &nbsp;за {task.notifyBefore}
                                                    &nbsp;{getNotifySuffix(task.notifyBefore)}
                                                </React.Fragment>
                                            )}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </SelectableBlockWrapper>
            )}
            {((isViewOnlyMode && taskHasDocuments) || isEditableMode) && (
                <SelectableBlockWrapper
                    css={theme => ({
                        padding: theme.spacing(3),
                        zIndex: focusedPuzzleId === documentsBlockId.current ? 1300 : "initial",
                    })}
                    onFocus={service.onPuzzleFocus.bind(service, documentsBlockId.current, false)}
                    onMouseDown={service.onPuzzleFocus.bind(
                        service,
                        documentsBlockId.current,
                        false,
                    )}
                    focused={focusedPuzzleId === documentsBlockId.current}
                    id={documentsBlockId.current}
                >
                    <Grid
                        container
                        spacing={2}
                        css={theme => ({ padding: `0 ${theme.spacing(4)}` })}
                    >
                        <Grid item xs={12}>
                            <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                                Документы
                            </Typography>
                        </Grid>
                        {(task.documents || []).map(document => (
                            <Grid item xs={2} key={document.id}>
                                <Grid
                                    container
                                    justify="center"
                                    alignItems="center"
                                    direction="column"
                                    css={theme => ({
                                        height: "100%",
                                        border: `1px solid ${theme.colors.lightGray}`,
                                        borderRadius: theme.radius(0.5),
                                        minHeight: theme.spacing(20),
                                        position: "relative",
                                    })}
                                >
                                    <img
                                        css={theme => ({
                                            width: "100%",
                                            objectFit: "contain",
                                            maxHeight: theme.spacing(20),
                                        })}
                                        alt={document.originalName}
                                        src={document.filename}
                                    />
                                    {deleteAssetVisible && (
                                        <div
                                            onClick={() => onDeleteAssetCallback(document.id)}
                                            css={theme => ({
                                                padding: theme.spacing(0.5),
                                                borderRadius: "50%",
                                                background: theme.colors.gray,
                                                color: theme.colors.white,
                                                position: "absolute",
                                                top: "-12px", // TODO: dynamic calculation
                                                right: "-12px", // TODO: dynamic calculation
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                cursor: "pointer",
                                            })}
                                        >
                                            <CloseIcon
                                                css={theme => ({
                                                    fontSize: theme.fontSize.normal,
                                                })}
                                            />
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                        {editable && (
                            <Grid item xs={2}>
                                <Grid
                                    container
                                    justify="center"
                                    alignItems="center"
                                    direction="column"
                                    css={theme => ({
                                        height: "100%",
                                        border: `1px solid ${theme.colors.lightGray}`,
                                        borderRadius: theme.radius(0.5),
                                        minHeight: theme.spacing(20),
                                        position: "relative",
                                    })}
                                >
                                    <input
                                        ref={input}
                                        accept="image/*,.pdf,.doc,.xls,.xlsx"
                                        type="file"
                                        hidden
                                        onChange={onFileChangeCallback}
                                    />
                                    <Fab
                                        css={theme => ({
                                            width: theme.spacing(4),
                                            height: theme.spacing(4),
                                            minHeight: theme.spacing(4),
                                            marginBottom: theme.spacing(),
                                        })}
                                        onClick={onAddAssetTrigger}
                                    >
                                        <AddIcon />
                                    </Fab>
                                    <Typography
                                        css={theme => ({
                                            userSelect: "none",
                                            fontSize: theme.fontSize.sNormal,
                                            color: theme.colors.secondary,
                                        })}
                                        align="center"
                                    >
                                        Добавить файл
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </SelectableBlockWrapper>
            )}
            {documents.map(document => {
                const documentPendingComments = pendingComments.filter(
                    comment => comment.idAssignment === document.id,
                );

                const template = (task.templates || []).find(
                    template => template.id === document.id,
                );
                const comments: IComment[] = [];
                if (template && _.isArray(template.comments)) {
                    comments.push(...template.comments);
                }

                return (
                    <TaskDocument
                        key={document.__uuid}
                        pendingComments={documentPendingComments}
                        comments={comments}
                        editable={editable}
                        documents={documents}
                        document={document}
                        templates={templates}
                        service={service}
                        templateSnapshots={templateSnapshots}
                        focusedPuzzleId={focusedPuzzleId}
                        onEditableChange={onEditableChangeCallback}
                        onTemplateChange={onTemplatesChange}
                        onPendingCommentDelete={onPendingCommentDelete}
                        onPendingCommentAccept={onPendingCommentAccept}
                        onCommentDelete={onCommentDelete}
                    />
                );
            })}
        </React.Fragment>
    );
};

ViewTask.displayName = "ViewTask";

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
