/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorToolbar } from "@magnit/components";
import {
    ETaskStatus,
    ETemplateType,
    IComment,
    IExtendedDocument,
    IExtendedTask,
    IStageStep,
    ITask,
    ITemplate,
    ITemplateDocument,
    IVirtualTemplateDocument,
} from "@magnit/entities";
import { CommentsIcon, QuestionIcon, TrashIcon } from "@magnit/icons";
import { EEditorType, getEditorService } from "@magnit/services";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import uuid from "uuid/v4";
import { CreateTask } from "./components/create-task";
import { ViewTask } from "./components/view-task";

type TAnyTask = ITask | IExtendedTask;

type TDocumentWithAnswers = ITemplateDocument & IExtendedDocument;

interface ITaskEditorProps<T extends TAnyTask> {
    task: T;
    templates: T extends IExtendedTask ? TDocumentWithAnswers[] : ITemplateDocument[];
    variant: "create" | "view";
    regions?: string[];
    cities?: string[];
    formats?: string[];
    addresses?: string[];

    onAddAsset?(file: File): void;

    onDeleteAsset?(assetId: number): void;

    onAddComment?(comment: IComment): void;

    onDeleteComment?(commentId: number): void;

    onTaskChange?(task: Partial<TAnyTask>): void;
}

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export const TaskEditor = <T extends TAnyTask>(props: ITaskEditorProps<T>) => {
    const {
        templates,
        task,
        variant,
        onTaskChange,
        onAddAsset,
        onDeleteAsset,
        onAddComment,
        onDeleteComment,
        regions,
        cities,
        formats,
        addresses,
    } = props;

    const [title, setTitle] = useState("");
    // not task documents
    // contains short template records mainly needed for rendering
    const [documents, setDocuments] = useState<IVirtualTemplateDocument[]>([]);
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    // full templates mainly needed for rendering
    const [templateSnapshots, setTemplateSnapshots] = useState<Map<string, ITemplate>>(new Map());
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([]);
    // local comments storage
    const [pendingComments, setPendingComments] = useState<IComment[]>([]);

    const focusedPuzzleId = _.head(focusedPuzzleChain);
    const focusedOnTaskHead = focusedPuzzleId === task.id.toString();
    const editable =
        task.status !== ETaskStatus.IN_PROGRESS && task.status !== ETaskStatus.COMPLETED;

    const service = useRef(
        getEditorService(EEditorType.TASK, [
            [focusedPuzzleChain, setFocusedPuzzleChain],
            [toolbarTopPosition, setToolbarTopPosition],
        ]),
    );

    const isViewMode = useCallback(
        (value: object): value is IExtendedTask => _.eq(variant, "view"),
        [variant],
    );

    const isCreateMode = useCallback((value: object): value is ITask => _.eq(variant, "create"), [
        variant,
    ]);

    // set toolbar offset top
    useEffect(() => {
        service.current.updateToolbarTopPosition();
    }, [focusedPuzzleChain]);

    // if no templates present (initially)
    // we add one stub document
    useEffect(() => {
        if (isCreateMode(task) && !task.templates.length && !documents.length) {
            setDocuments([
                {
                    id: -1,
                    title: "",
                    editable: false,
                    sections: [],
                    type: ETemplateType.LIGHT,
                    description: "",
                    __uuid: uuid(),
                },
            ]);
        }
    }, [variant, task, isCreateMode, documents.length]);

    // set documents if task has any
    const prevDocuments = useRef(_.cloneDeep(documents));
    useEffect(() => {
        if (isViewMode(task)) {
            const nextDocuments = (task.templates || []).map(template => {
                const document = documents.find(document => template.id === document.id);
                templateSnapshots.set(template.id.toString(), template);
                return {
                    editable: false,
                    ...template,
                    __uuid: (document && document.__uuid) || uuid(),
                };
            });
            if (!_.isEqual(prevDocuments.current, nextDocuments)) {
                prevDocuments.current = _.cloneDeep(nextDocuments);
                setTemplateSnapshots(new Map(templateSnapshots));
                setDocuments([...nextDocuments]);
            }
        }
    }, [templates, task.templates, isViewMode, isCreateMode, task, documents, templateSnapshots]);

    const initialFocusThreshold = useRef(0);
    const initialFocusSet = useRef(false);
    useEffect(() => {
        // view updates it's focus util task is not loaded
        // so if task is never loaded, we stop at some point or it becomes painful
        // TODO: pass some bool prop so to know when set focus
        if (initialFocusThreshold.current > 50) {
            return;
        }
        if (!initialFocusSet.current) {
            initialFocusThreshold.current++;
            service.current.onPuzzleFocus(task.id.toString(), true);
        }
        if (task.id !== 0 || isCreateMode(task)) {
            initialFocusSet.current = true;
        }
    }, [task, focusedPuzzleChain, isCreateMode]);

    const updateTaskTemplates = useCallback(
        (documents: IVirtualTemplateDocument[]) => {
            if (onTaskChange) {
                const nextTemplates = documents
                    .filter(document => document.id !== -1)
                    .map(document => {
                        if (isViewMode(task)) {
                            const template = templates.find(
                                template => template.id === document.id,
                            );
                            return { ...template, editable: true };
                        }
                        return document.id;
                    })
                    .filter(Boolean);
                onTaskChange({ ...task, templates: nextTemplates });
            }
        },
        [isViewMode, onTaskChange, task, templates],
    );

    const onTemplatesChangeCallback = useCallback(
        (uuid: string, event: TSelectChangeEvent): void => {
            const templateId = Number(event.target.value);
            if (documents.some(document => document.__uuid === uuid)) {
                const templateIndex = templates.findIndex(template => template.id === templateId);
                const documentIndex = documents.findIndex(document => document.__uuid === uuid);
                const documentId = templates[templateIndex].id;
                documents[documentIndex].id = documentId;
                documents[documentIndex].title = templates[templateIndex].title;
                setDocuments([...documents]);
                templateSnapshots.set(documentId.toString(), templates[templateIndex]);
                setTemplateSnapshots(new Map(templateSnapshots));
                updateTaskTemplates(documents);
            }
        },
        [documents, templateSnapshots, templates, updateTaskTemplates],
    );

    const updateTemplateAssignmentEditable = useCallback(
        (documents: ITemplateDocument[]) => {
            if (!isViewMode(task)) {
                return;
            }
            if (onTaskChange) {
                onTaskChange({
                    ...task,
                    templates: task.templates!.map(template => {
                        const document = documents.find(document => document.id === template.id);
                        if (!document) {
                            return template;
                        }
                        return { ...template, editable: document.editable };
                    }),
                });
            }
        },
        [isViewMode, onTaskChange, task],
    );

    const onEditableChangeCallback = useCallback(
        (documentId: number, editable: boolean) => {
            if (documents.some(document => document.id === documentId)) {
                const documentIndex = documents.findIndex(document => document.id === documentId);
                documents[documentIndex].editable = editable;
                setDocuments([...documents]);
                updateTemplateAssignmentEditable(documents);
            }
        },
        [documents, updateTemplateAssignmentEditable],
    );

    const onAddDocumentCallback = useCallback((): void => {
        if (documents.some(document => document.id === -1)) {
            return;
        }
        const nextDocument: IVirtualTemplateDocument = {
            id: -1,
            title: "",
            description: "",
            sections: [],
            type: ETemplateType.LIGHT,
            editable: true,
            __uuid: uuid(),
        };
        if (isViewMode(task)) {
            nextDocument.virtual = true;
        }
        setDocuments([...documents, nextDocument]);
        service.current.onPuzzleFocus(nextDocument.__uuid);
    }, [documents, isViewMode, task]);

    const onAddStageCallback = useCallback(
        (step: IStageStep) => {
            if (!isViewMode(task)) {
                return;
            }
            if (task.stages) {
                task.stages.push({
                    ...step,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    finished: false,
                });
            }
            if (onTaskChange) {
                onTaskChange({ ...task });
            }
        },
        [isViewMode, onTaskChange, task],
    );

    const onDeleteStageCallback = useCallback(
        (id: number) => {
            if (!isViewMode(task)) {
                return;
            }
            if (task.stages) {
                const stageIndex = task.stages.findIndex(stage => stage.id === id);
                if (stageIndex !== -1) {
                    task.stages.splice(stageIndex, 1);
                }
            }
            if (onTaskChange) {
                onTaskChange({ ...task });
            }
        },
        [isViewMode, onTaskChange, task],
    );

    function onTaskTitleChange(title: string) {
        setTitle(title);
    }

    const onTaskTitleBlurCallback = useCallback(() => {
        if (onTaskChange) {
            onTaskChange({ ...task, title });
        }
    }, [onTaskChange, task, title]);

    const onDeleteDocumentCallback = useCallback(() => {
        // do not to delete document if only one exists
        if (isCreateMode(task) && documents.length === 1) {
            return;
        }
        const document = documents.find(document => document.__uuid === focusedPuzzleId);
        if (!document) {
            return;
        }
        const documentId = document.id;
        if (documents.some(document => document.id === documentId)) {
            const documentIndex = documents.findIndex(document => document.id === documentId);
            documents.splice(documentIndex, 1);
            setDocuments([...documents]);
            updateTaskTemplates(documents);
            const idToFocusOn = _.last(documents) ? _.last(documents)!.__uuid : task.id.toString();
            service.current.onPuzzleFocus(idToFocusOn);
        }
    }, [documents, focusedPuzzleId, isCreateMode, task, updateTaskTemplates]);

    const onAddCommentClick = useCallback(() => {
        // allow to add if 0 pending comments
        if (pendingComments.length) {
            return;
        }
        const document = documents.find(document => document.__uuid === focusedPuzzleId);
        if (!document) {
            return;
        }
        const lastComment = _.last(pendingComments) || { id: -1 };
        const comment: IComment = {
            id: lastComment.id + 1,
            idAssignment: document.id,
            idUser: "",
            text: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setPendingComments([...pendingComments, comment]);
    }, [documents, focusedPuzzleId, pendingComments]);

    const onPendingCommentDeleteCallback = useCallback(
        (commentId: number) => {
            const index = pendingComments.findIndex(comment => comment.id === commentId);
            if (index !== -1) {
                pendingComments.splice(index, 1);
                setPendingComments([...pendingComments]);
            }
        },
        [pendingComments],
    );

    const onPendingCommentAcceptCallback = useCallback(
        (comment: IComment) => {
            if (onAddComment) {
                onAddComment({ ...comment });
                onPendingCommentDeleteCallback(comment.id);
            }
        },
        [onAddComment, onPendingCommentDeleteCallback],
    );

    const onCommentDeleteCallback = useCallback(
        (commentId: number) => {
            if (onDeleteComment) {
                onDeleteComment(commentId);
            }
        },
        [onDeleteComment],
    );

    const focusedOnDocument = documents.some(document => document.__uuid === focusedPuzzleId);

    const editorToolbarItems = useMemo(
        () => [
            {
                label: "Добавить шаблон",
                icon: <QuestionIcon />,
                action: onAddDocumentCallback,
            },
            // show comments button if focused on template
            ...(focusedOnDocument
                ? [
                      {
                          label: "Оставить комментарий",
                          icon: <CommentsIcon />,
                          action: onAddCommentClick,
                      },
                  ]
                : []),
            // show trash button if not focused on head or on document
            ...(!focusedOnTaskHead && !focusedOnDocument
                ? [
                      {
                          label: "Удалить шаблон",
                          icon: <TrashIcon css={theme => ({ color: theme.colors.gray })} />,
                          action: onDeleteDocumentCallback,
                      },
                  ]
                : []),
        ],
        [
            focusedOnDocument,
            focusedOnTaskHead,
            onAddCommentClick,
            onAddDocumentCallback,
            onDeleteDocumentCallback,
        ],
    );

    return (
        <React.Fragment>
            {editable && <EditorToolbar top={toolbarTopPosition} items={[...editorToolbarItems]} />}
            {isCreateMode(task) && (
                <CreateTask
                    cities={cities}
                    regions={regions}
                    formats={formats}
                    addresses={addresses}
                    task={{ ...task, title }}
                    service={service.current}
                    templates={templates}
                    documents={documents}
                    focusedPuzzleId={focusedPuzzleId}
                    templateSnapshots={templateSnapshots}
                    onTemplatesChange={onTemplatesChangeCallback}
                    onTaskTitleChange={onTaskTitleChange}
                    onTaskTitleBlur={onTaskTitleBlurCallback}
                    onTaskChange={onTaskChange}
                />
            )}
            {isViewMode(task) && (
                <ViewTask
                    cities={cities}
                    regions={regions}
                    formats={formats}
                    addresses={addresses}
                    task={task}
                    pendingComments={pendingComments}
                    editable={editable}
                    service={service.current}
                    templates={templates}
                    documents={documents}
                    focusedPuzzleId={focusedPuzzleId}
                    templateSnapshots={templateSnapshots}
                    onEditableChange={onEditableChangeCallback}
                    onAddStage={onAddStageCallback}
                    onDeleteStage={onDeleteStageCallback}
                    onTemplatesChange={onTemplatesChangeCallback}
                    onTaskChange={onTaskChange}
                    onAddAsset={onAddAsset}
                    onDeleteAsset={onDeleteAsset}
                    onPendingCommentDelete={onPendingCommentDeleteCallback}
                    onPendingCommentAccept={onPendingCommentAcceptCallback}
                    onCommentDelete={onCommentDeleteCallback}
                />
            )}
        </React.Fragment>
    );
};

TaskEditor.displayName = "TaskEditor";
