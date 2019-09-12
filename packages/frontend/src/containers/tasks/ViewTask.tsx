/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import {
    ETaskStatus,
    IDocument,
    IExtendedTask,
    IStage,
    ITemplate,
    IWithAnswers,
} from "@magnit/entities";
import { SendIcon } from "@magnit/icons";
import { TaskEditor } from "@magnit/task-editor";
import { Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { Redirect } from "@reach/router";
import { SimpleModal } from "components/modal";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { SendMessageForm } from "components/view-task";
import { AppContext } from "context";
import { NoStagesException } from "exceptions";
import _ from "lodash";
import * as React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    addStages,
    addTaskDocument,
    addTemplateAssignment,
    deleteTaskDocument,
    getTaskExtended,
    getTemplate,
    getTemplates,
    IGetTaskExtendedResponse,
    IGetTemplate,
    IGetTemplatesResponse,
    sendPushToken,
    updateTask,
    updateTemplateAssignment,
} from "services/api";

interface IViewTaskProps {
    taskId: number;
}

interface IEditableTemplate extends ITemplate {
    editable: boolean;
}

type TDocumentWithAnswers = IDocument & IWithAnswers;

export const ViewTask: React.FC<IViewTaskProps> = ({ taskId }) => {
    const context = useContext(AppContext);
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
    const [templates, setTemplates] = useState<IEditableTemplate[]>([]);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [task, setTask] = useState<IExtendedTask>({
        id: 0,
        title: "",
        templates: [],
        stages: [],
        documents: [],
        status: ETaskStatus.DRAFT,
    });
    const [redirect, setRedirect] = useState({
        trigger: false,
        to: "",
    });

    const isValidTask = (value: object): value is IExtendedTask =>
        _.has(value, "id") &&
        _.has(value, "title") &&
        _.has(value, "templates") &&
        _.has(value, "stages");

    const initialStages = useRef<IExtendedTask["stages"]>([]);

    const isTaskEditable = (task: IExtendedTask) =>
        task.status !== ETaskStatus.IN_PROGRESS && task.status !== ETaskStatus.COMPLETED;

    const setTaskState = useCallback((response: IGetTaskExtendedResponse) => {
        if (isValidTask(response.task)) {
            initialStages.current = _.cloneDeep(response.task.stages);
            setTask({ ...response.task });
            return response.task;
        }
    }, []);

    const fetchFullTemplate = useCallback(
        (response: IGetTemplatesResponse) => {
            return Promise.all(
                response.templates.map(template =>
                    getTemplate(context.courier, Number(template.id)),
                ),
            );
        },
        [context.courier],
    );

    const setTemplateState = (responses: IGetTemplate[], nextTask: IExtendedTask) => {
        const buffer: any[] = [];
        responses.forEach(response => buffer.push(response.template));
        buffer.forEach((data, index, array) => {
            const template = nextTask.templates.find(template => template.id === data.id);
            if (template) {
                array[index] = _.merge(data, template);
            }
        });
        setTemplates([...buffer]);
    };

    const updateTaskState = useCallback(() => {
        getTaskExtended(context.courier, _.toNumber(taskId))
            .then(setTaskState)
            .then(async nextTask => {
                if (!nextTask || !isTaskEditable(nextTask)) {
                    return;
                }
                const templates = await getTemplates(context.courier);
                const fullTemplates = await fetchFullTemplate(templates);
                setTemplateState(fullTemplates, nextTask);
            })
            .catch(console.error);
    }, [context, fetchFullTemplate, setTaskState, taskId]);

    useEffect(() => updateTaskState(), [updateTaskState]);

    function onTaskChange(task: Partial<IExtendedTask>): void {
        if (isValidTask(task)) {
            setTask({ ...task });
        }
    }

    function onMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
        setMenuAnchorElement(event.currentTarget);
    }

    function onMenuClose() {
        setMenuAnchorElement(null);
    }

    function onTaskHistoryClick() {
        setRedirect({ to: `/tasks/${taskId}/history`, trigger: true });
        onMenuClose();
    }

    function onTaskReportClick() {
        setRedirect({ to: `/tasks/${taskId}/report`, trigger: true });
        onMenuClose();
    }

    const addTaskStages = useCallback(
        async (task: IExtendedTask) => {
            const findIfStageExists = (stage: IStage) =>
                !initialStages.current.find(initialStage => initialStage.id === stage.id);

            const filterEmptyStages = (step: IStage) => step.title && step.deadline;

            const diff = task.stages
                // filter so that add only stages that doesn't exist
                .filter(findIfStageExists)
                // filter empty
                .filter(filterEmptyStages)
                .map(stage => {
                    // TODO: mask input for date
                    const splitted = stage.deadline.split(".");
                    const date = new Date();
                    date.setDate(Number(_.first(splitted)));
                    date.setMonth(Number(_.nth(splitted, 1)) - 1);
                    date.setFullYear(Number(_.nth(splitted, 2)));
                    return { ...stage, deadline: new Date(date).toISOString() };
                });
            // throw error if overall no task stages found
            const validTaskStages = task.stages.filter(stage => stage.title && stage.deadline);
            if (validTaskStages.length + diff.length === 0) {
                throw new NoStagesException();
            }
            if (!diff.length) {
                return;
            }
            return addStages(context.courier, taskId, diff);
        },
        [context.courier, taskId],
    );

    const onTaskSaveCallback = useCallback((): void => {
        const prevStatus = task.status;
        // disallow update if task is not editable
        if (!isTaskEditable(task)) {
            return;
        }
        // sending from DRAFT to IN_PROGRESS
        // only this transition is allowed
        if (
            task.status === ETaskStatus.DRAFT ||
            task.status === ETaskStatus.ON_CHECK ||
            task.status === ETaskStatus.EXPIRED
        ) {
            task.status = ETaskStatus.IN_PROGRESS;
        }

        const templateAssignmentExists = (assignment: TDocumentWithAnswers) =>
            templates.find(template => template.id === assignment.id);

        const templateIdToNumber = (template: TDocumentWithAnswers) => Number(template.id);

        const callUpdateTemplateAssignment = ({ id, editable }: TDocumentWithAnswers) =>
            updateTemplateAssignment(context.courier, taskId, Number(id), { editable });

        const transformedTemplateAssignments = (task.templates || [])
            .filter(templateAssignmentExists)
            .map(templateIdToNumber);

        const addAllTemplateAssignments = () =>
            Promise.all(task.templates.map(callUpdateTemplateAssignment));

        Promise.all([
            addTemplateAssignment(
                context.courier,
                Number(taskId),
                transformedTemplateAssignments,
            ).then(addAllTemplateAssignments),
            addTaskStages(task),
        ])
            .then(() => updateTask(context.courier, taskId, getTaskPayload(task)))
            .then(() => {
                updateTaskState();
                context.setSnackbarState({
                    open: true,
                    message: "Задание успешно обновлено!",
                });
            })
            .catch((error: Error) => {
                // rollback status
                task.status = prevStatus;
                let message = "Ошибка обновления задания!";
                if (error instanceof NoStagesException) {
                    message = "Ошибка! Заполните поля этапов!";
                }
                context.setSnackbarState({ open: true, message });
                context.setSnackbarError(true);
            });
    }, [addTaskStages, context, task, taskId, templates, updateTaskState]);

    function onTaskWithdrawClick() {
        if (task.status === ETaskStatus.IN_PROGRESS) {
            task.status = ETaskStatus.ON_CHECK;
        }
        updateTask(context.courier, taskId, getTaskPayload(task))
            .then(() => {
                updateTaskState();
                context.setSnackbarState({
                    open: true,
                    message: "Задание успешно отозвано!",
                });
            })
            .catch(() => {
                context.setSnackbarState({ open: true, message: "Ошибка отзыва задания!" });
                context.setSnackbarError(true);
            });
        onMenuClose();
    }

    function onTaskCompleteClick() {
        if (task.status === ETaskStatus.IN_PROGRESS || task.status === ETaskStatus.ON_CHECK) {
            task.status = ETaskStatus.COMPLETED;
        }
        updateTask(context.courier, taskId, getTaskPayload(task))
            .then(() => {
                updateTaskState();
                context.setSnackbarState({
                    open: true,
                    message: "Задание успешно звершено!",
                });
            })
            .catch(() => {
                context.setSnackbarState({ open: true, message: "Ошибка завершения задания!" });
                context.setSnackbarError(true);
            });
        onMenuClose();
    }

    function onOpenSendMessageModel() {
        onMenuClose();
        setMessageModalOpen(true);
    }

    function onSubmitSendMessage(title: string, message: string) {
        sendPushToken(context.courier, { title, body: message })
            .then(() => {
                setMessageModalOpen(false);
                context.setSnackbarState({ open: true, message: "Сообщение успешно отправлено!" });
            })
            .catch(() => {
                setMessageModalOpen(false);
                context.setSnackbarState({ open: true, message: "Ошибка отправки сообщения!" });
                context.setSnackbarError(true);
            });
    }

    function onMessageModalClose() {
        setMessageModalOpen(false);
    }

    const onAddTaskDocument = useCallback(
        (document: File) => {
            addTaskDocument(context.courier, taskId, document)
                .then(() => updateTaskState())
                .catch(() => {
                    context.setSnackbarState({ open: true, message: "Ошибка сохранения файла!" });
                    context.setSnackbarError(true);
                });
        },
        [context, taskId, updateTaskState],
    );

    const onDeleteTaskDocument = useCallback(
        (documentId: number) => {
            deleteTaskDocument(context.courier, taskId, documentId)
                .then(() => updateTaskState())
                .catch(() => {
                    context.setSnackbarState({ open: true, message: "Ошибка удаления файла!" });
                    context.setSnackbarError(true);
                });
        },
        [context, taskId, updateTaskState],
    );

    return (
        <SectionLayout>
            <SimpleModal width={370} open={messageModalOpen} onClose={onMessageModalClose}>
                <SendMessageForm onSubmit={onSubmitSendMessage} />
            </SimpleModal>
            {redirect.trigger && <Redirect to={redirect.to} noThrow />}
            <SectionTitle title="Информация о задании">
                <Grid item>
                    <Grid container>
                        <Grid item>
                            {isTaskEditable(task) && (
                                <Button
                                    variant="contained"
                                    scheme="blue"
                                    css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                                    onClick={onTaskSaveCallback}
                                >
                                    <SendIcon />
                                    <Typography>Отправить</Typography>
                                </Button>
                            )}
                        </Grid>
                        {task.status !== ETaskStatus.DRAFT && (
                            <React.Fragment>
                                <Grid item>
                                    <IconButton onClick={onMenuClick}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Grid>
                                <Menu
                                    keepMounted
                                    open={Boolean(menuAnchorElement)}
                                    anchorEl={menuAnchorElement}
                                    onClose={onMenuClose}
                                >
                                    <MenuItem onClick={onTaskReportClick}>
                                        Посмотреть отчет
                                    </MenuItem>
                                    <MenuItem onClick={onTaskHistoryClick}>
                                        Посмотреть истоию
                                    </MenuItem>
                                    {task.status === ETaskStatus.IN_PROGRESS && (
                                        <MenuItem onClick={onTaskWithdrawClick}>
                                            Отозвать задание
                                        </MenuItem>
                                    )}
                                    {task.status !== ETaskStatus.COMPLETED && (
                                        <MenuItem onClick={onTaskCompleteClick}>
                                            Завершить задание
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={onOpenSendMessageModel}>
                                        Отправить сообщение
                                    </MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </Grid>
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
                    task={task}
                    templates={isTaskEditable(task) ? templates : task.templates}
                    variant="view"
                    onTaskChange={onTaskChange}
                    onDeleteAsset={onDeleteTaskDocument}
                    onAddAsset={onAddTaskDocument}
                />
            </Grid>
        </SectionLayout>
    );
};

function getTaskPayload(task: IExtendedTask) {
    return _.omit(task, ["id", "templates", "stages"]);
}
