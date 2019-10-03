/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import {
    ETaskStatus,
    IComment,
    IExtendedDocument,
    IExtendedTask,
    IStage,
    ITemplate,
    ITemplateDocument,
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
    addComment,
    addStages,
    addTaskDocument,
    addTemplateAssignment,
    deleteComment,
    deleteTaskDocument,
    getAddressesForFormat,
    getAllRegions,
    getCitiesForRegion,
    getFormatsForCity,
    getTaskExtended,
    getTemplates,
    IGetTaskExtendedResponse,
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

type TDocumentWithAnswers = ITemplateDocument & IExtendedDocument;

export const ViewTask: React.FC<IViewTaskProps> = ({ taskId }) => {
    const context = useContext(AppContext);

    // dot menu
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);

    // all templates
    const [templates, setTemplates] = useState<IEditableTemplate[]>([]);

    // modal
    const [messageModalOpen, setMessageModalOpen] = useState(false);

    // task state
    const [task, setTask] = useState<IExtendedTask>({
        id: 0,
        title: "",
        templates: [],
        stages: [],
        documents: [],
        marketplace: {
            address: "",
            city: "",
            format: "",
            region: "",
        },
        status: ETaskStatus.DRAFT,
    });

    // redirects
    const [redirect, setRedirect] = useState({
        trigger: false,
        to: "",
    });

    // marketplace
    const [marketplaceRegions, setMarketplaceRegions] = useState<string[]>([]);
    const [regionCities, setRegionCities] = useState<string[]>([]);
    const [cityFormats, setCityFormats] = useState<string[]>([]);
    const [formatAddresses, setFormatAddresses] = useState<string[]>([]);

    const region = (task.marketplace || {}).region;
    const city = (task.marketplace || {}).city;
    const format = (task.marketplace || {}).format;

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

    const fetchFormatsAndUpdateState = useCallback(
        (region: string, city: string) => {
            getFormatsForCity(context.courier, region, city)
                .then(response => setCityFormats(response.formats))
                .catch(console.error);
        },
        [context.courier],
    );

    const fetchRegionsAndUpdateState = useCallback(() => {
        getAllRegions(context.courier)
            .then(response => setMarketplaceRegions(response.regions))
            .catch(console.error);
    }, [context.courier]);

    const fetchCitiesAndUpdateState = useCallback(
        (region: string) => {
            getCitiesForRegion(context.courier, region)
                .then(response => setRegionCities(response.cities))
                .catch(console.error);
        },
        [context.courier],
    );

    const fetchAddressesAndUpdateState = useCallback(
        (region: string, city: string, format: string) => {
            getAddressesForFormat(context.courier, region, city, format)
                .then(response => setFormatAddresses(response.addresses))
                .catch(console.error);
        },
        [context.courier],
    );

    function setTemplateState(response: IGetTemplatesResponse, nextTask: IExtendedTask) {
        const buffer: any[] = [];
        response.templates.forEach(template => buffer.push(template));
        buffer.forEach((data, index, array) => {
            const template = nextTask.templates.find(template => template.id === data.id);
            if (template) {
                array[index] = _.merge(data, template);
            }
        });
        setTemplates([...buffer]);
    }

    const fetchTaskAndUpdateState = useCallback(() => {
        getTaskExtended(context.courier, _.toNumber(taskId))
            .then(setTaskState)
            .then(async nextTask => {
                if (!nextTask || !isTaskEditable(nextTask)) {
                    return;
                }
                const response = await getTemplates(context.courier);

                setTemplateState(response, nextTask);

                if (nextTask.marketplace) {
                    const { city, region, format } = nextTask.marketplace;
                    await Promise.all([
                        fetchRegionsAndUpdateState(),
                        fetchCitiesAndUpdateState(region),
                        fetchFormatsAndUpdateState(region, city),
                        fetchAddressesAndUpdateState(region, city, format),
                    ]).catch(console.error);
                }
            })
            .catch(console.error);
    }, [
        context.courier,
        fetchAddressesAndUpdateState,
        fetchCitiesAndUpdateState,
        fetchFormatsAndUpdateState,
        fetchRegionsAndUpdateState,
        setTaskState,
        taskId,
    ]);

    const prevTaskId = useRef<number | null>(null);
    useEffect(() => {
        if (prevTaskId.current !== taskId) {
            prevTaskId.current = taskId;
            fetchTaskAndUpdateState();
        }
    }, [fetchTaskAndUpdateState, taskId]);

    useEffect(() => {
        // only draft mode contains marketplace selects
        if (task.status !== ETaskStatus.DRAFT) {
            return;
        }
        fetchRegionsAndUpdateState();
    }, [fetchRegionsAndUpdateState, task.status]);

    // get all regions initially
    const prevTaskRegion = useRef(region);
    useEffect(() => {
        if (!(region && prevTaskRegion.current !== region)) {
            return;
        }
        fetchCitiesAndUpdateState(region);
    }, [fetchCitiesAndUpdateState, region]);

    // fetching all available formats for city
    // if task marketplace city has changed
    const prevTaskCity = useRef(city);
    useEffect(() => {
        if (!(city && region && prevTaskCity.current !== city)) {
            return;
        }
        fetchFormatsAndUpdateState(region, city);
    }, [region, city, fetchFormatsAndUpdateState]);

    // fetching all available addresses for format
    // if task marketplace format has changed
    const prevTaskFormat = useRef(format);
    useEffect(() => {
        if (!(city && region && format && prevTaskFormat.current !== format)) {
            return;
        }
        fetchAddressesAndUpdateState(region, city, format);
    }, [format, region, city, fetchAddressesAndUpdateState]);

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
                fetchTaskAndUpdateState();
                context.setSnackbarState({
                    open: true,
                    message: "Задание успешно обновлено",
                });
            })
            .catch((error: Error) => {
                // rollback status
                task.status = prevStatus;
                let message = "Не удалось обновить задание";
                if (error instanceof NoStagesException) {
                    message = "Заполнение этапов обязательно";
                }
                context.setSnackbarState({ open: true, message });
                context.setSnackbarError(true);
            });
    }, [addTaskStages, context, task, taskId, templates, fetchTaskAndUpdateState]);

    function onTaskWithdrawClick() {
        if (task.status === ETaskStatus.IN_PROGRESS) {
            task.status = ETaskStatus.ON_CHECK;
        }
        updateTask(context.courier, taskId, getTaskPayload(task))
            .then(() => {
                fetchTaskAndUpdateState();
                context.setSnackbarState({
                    open: true,
                    message: "Задание успешно отозвано",
                });
            })
            .catch(() => {
                context.setSnackbarState({ open: true, message: "Не удалось отозвать задание" });
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
                fetchTaskAndUpdateState();
                context.setSnackbarState({
                    open: true,
                    message: "Задание успешно звершено",
                });
            })
            .catch(() => {
                context.setSnackbarState({ open: true, message: "Не удалось завершить задание" });
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
                context.setSnackbarState({ open: true, message: "Сообщение успешно отправлено" });
            })
            .catch(() => {
                setMessageModalOpen(false);
                context.setSnackbarState({ open: true, message: "Не удалось отправить сообщениу" });
                context.setSnackbarError(true);
            });
    }

    function onMessageModalClose() {
        setMessageModalOpen(false);
    }

    const onAddTaskDocument = useCallback(
        (document: File) => {
            addTaskDocument(context.courier, taskId, document)
                .then(() => fetchTaskAndUpdateState())
                .catch(() => {
                    context.setSnackbarState({ open: true, message: "Не удалось сохранить файл" });
                    context.setSnackbarError(true);
                });
        },
        [context, taskId, fetchTaskAndUpdateState],
    );

    const onDeleteTaskDocument = useCallback(
        (documentId: number) => {
            deleteTaskDocument(context.courier, taskId, documentId)
                .then(() => fetchTaskAndUpdateState())
                .catch(() => {
                    context.setSnackbarState({ open: true, message: "Не удалось удалить файл" });
                    context.setSnackbarError(true);
                });
        },
        [context, taskId, fetchTaskAndUpdateState],
    );

    const onAddComment = useCallback(
        (comment: IComment) => {
            addComment(context.courier, taskId, comment.idAssignment, comment.text)
                .then(() => fetchTaskAndUpdateState())
                .catch(() => {
                    context.setSnackbarState({
                        open: true,
                        message: "Не удалось добавить комментарий",
                    });
                    context.setSnackbarError(true);
                });
        },
        [context, taskId, fetchTaskAndUpdateState],
    );

    const onDeleteComment = useCallback(
        (commentId: number) => {
            deleteComment(context.courier, taskId, commentId)
                .then(() => fetchTaskAndUpdateState())
                .catch(() => {
                    context.setSnackbarState({
                        open: true,
                        message: "Не удалось удалить комментарий",
                    });
                    context.setSnackbarError(true);
                });
        },
        [context, taskId, fetchTaskAndUpdateState],
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
                                        Посмотреть историю
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
                    regions={marketplaceRegions}
                    cities={regionCities}
                    formats={cityFormats}
                    addresses={formatAddresses}
                    templates={isTaskEditable(task) ? templates : task.templates}
                    variant="view"
                    onTaskChange={onTaskChange}
                    onDeleteAsset={onDeleteTaskDocument}
                    onAddAsset={onAddTaskDocument}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                />
            </Grid>
        </SectionLayout>
    );
};

function getTaskPayload(task: IExtendedTask) {
    return _.omit(task, ["id", "templates", "stages", "documents"]);
}
