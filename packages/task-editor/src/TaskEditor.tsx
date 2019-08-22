/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorToolbar } from "@magnit/components";
import { CommentsIcon, QuestionIcon, TrashIcon } from "@magnit/icons";
import { EEditorType, ETerminals, getEditorService } from "@magnit/services";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import uuid from "uuid/v4";
import { CreateTask } from "./components/create-task";
import { ViewTask } from "./components/view-task";
import {
    IDocument,
    IExtendedTask,
    IStageStep,
    ITask,
    IVirtualDocument,
    TChangeEvent,
} from "./entities";

type TTask = ITask | IExtendedTask;

interface ITaskEditorProps<T extends TTask> {
    initialState?: T;
    templates: Omit<IDocument, "__uuid">[];
    variant: "create" | "view";

    onTaskChange?(task: Partial<T>): void;
}

export const TaskEditor = <T extends TTask>(props: ITaskEditorProps<T>) => {
    const { templates, initialState, variant, onTaskChange } = props;

    const [task, setTask] = useState<Partial<T>>(initialState || {});
    const [documents, setDocuments] = useState<IVirtualDocument[]>([]);
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [templateSnapshots, setTemplateSnapshots] = useState<Map<string, object>>(new Map());
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([]);

    const service = useRef(
        getEditorService(EEditorType.TASK, [
            [focusedPuzzleChain, setFocusedPuzzleChain],
            [toolbarTopPosition, setToolbarTopPosition],
        ]),
    );

    const isViewMode = useCallback(
        (value: object): value is IExtendedTask => {
            const templates = _.get(value, "templates");
            if (_.isEmpty(templates)) {
                return _.eq(variant, "view");
            }
            const first = _.first(templates);
            return _.eq(variant, "view") && _.has(value, "templates") && _.isObject(first);
        },
        [variant],
    );

    const isCreateMode = useCallback(
        (value: object): value is ITask => {
            const templates = _.get(value, "templates");
            if (_.isEmpty(templates)) {
                return _.eq(variant, "create");
            }
            const first = _.first(templates);
            return (
                _.eq(variant, "create") &&
                _.has(value, "templates") &&
                (_.isString(first) || _.isNumber(first))
            );
        },
        [variant],
    );

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
                    title: ETerminals.EMPTY,
                    editable: false,
                    __uuid: uuid(),
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, task, isCreateMode]);

    // set documents if task has any
    useEffect(() => {
        if (!task.templates || !task.templates.length) {
            return;
        }
        const nextDocuments = templates.map(template => {
            const document = documents.find(document => template.id === document.id);
            templateSnapshots.set(template.id.toString(), template);
            return {
                id: _.get(template, "id"),
                title: _.get(template, "title"),
                editable: _.get(template, "editable", false),
                __uuid: (document && document.__uuid) || uuid(),
            };
        });
        setTemplateSnapshots(new Map(templateSnapshots));
        setDocuments([...nextDocuments]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templates]);

    // on every documents change we have to
    // update current task with their id's
    // also caching template JSON for current active document
    useEffect(() => {
        let nextTemplates;
        if (isCreateMode(task)) {
            nextTemplates = documents
                .filter(document => !!document.title)
                .filter(document => document.id >= 0)
                .map(document => document.id);
        }
        if (isViewMode(task)) {
            nextTemplates = documents;
        }
        setTask({ ...task, templates: nextTemplates });
        if (documents.some(document => document.__uuid === focusedPuzzleId)) {
            const documentId = documents.find(document => document.__uuid === focusedPuzzleId)!.id;
            if (documentId) {
                const template = templates.find(template => template.id === documentId);
                if (template) {
                    templateSnapshots.set(documentId.toString(), template);
                    setTemplateSnapshots(new Map(templateSnapshots));
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documents, isCreateMode, isViewMode]);

    const prevTask = useRef(_.cloneDeep(task));
    useEffect(() => {
        if (onTaskChange) {
            if (isViewMode(task)) {
                task.templates = task.templates.map(template => {
                    const document = documents.find(document => document.id === template.id);
                    if (!document) {
                        return template;
                    }
                    return { ...template, ..._.omit(document, "__uuid") };
                });
            }
            if (!_.isEqual(prevTask.current, task)) {
                prevTask.current = _.cloneDeep(task);
                onTaskChange({ ...task });
            }
        }
    }, [task, documents, variant, onTaskChange, isViewMode]);

    useEffect(() => {
        if (!_.isEqual(task, initialState) && initialState && onTaskChange) {
            setTask({ ...initialState });
            onTaskChange({ ...initialState });
            setFocusedPuzzleChain([initialState.id.toString() || ""]);
        } else if (!focusedPuzzleChain.length && initialState) {
            setFocusedPuzzleChain([initialState.id.toString() || ""]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState]);

    const onTemplatesChange = useCallback(
        (uuid: string, event: TChangeEvent): void => {
            const templateId = Number(event.target.value);
            if (documents.some(document => document.__uuid === uuid)) {
                const templateIndex = templates.findIndex(template => template.id === templateId);
                const documentIndex = documents.findIndex(document => document.__uuid === uuid);
                documents[documentIndex].id = templates[templateIndex].id;
                documents[documentIndex].title = templates[templateIndex].title;
                setDocuments([...documents]);
            }
        },
        [documents, templates],
    );

    const onEditableChange = useCallback(
        (documentId: number, editable: boolean) => {
            if (documents.some(document => document.id === documentId)) {
                const documentIndex = documents.findIndex(document => document.id === documentId);
                documents[documentIndex].editable = editable;
                setDocuments([...documents]);
            }
        },
        [documents],
    );

    const onAddDocument = useCallback((): void => {
        const nextDocument: IVirtualDocument = {
            id: -1,
            __uuid: uuid(),
            title: ETerminals.EMPTY,
            editable: false,
        };
        // TODO: allow only in DRAFT mode
        if (isViewMode(task)) {
            nextDocument.virtual = true;
        }
        setDocuments([...documents, nextDocument]);
    }, [documents, isViewMode, task]);

    const onAddStage = useCallback(
        (step: IStageStep) => {
            if (!isViewMode(task)) {
                return;
            }
            if (task.stages) {
                task.stages.push(step);
            }
            if (onTaskChange) {
                onTaskChange({ ...task });
            }
        },
        [isViewMode, onTaskChange, task],
    );

    const onDeleteStage = useCallback(
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

    const focusedPuzzleId = _.head(focusedPuzzleChain);

    const onDeleteDocument = useCallback(() => {
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
        }
    }, [documents, focusedPuzzleId, isCreateMode, task]);

    return (
        <React.Fragment>
            <EditorToolbar
                top={toolbarTopPosition}
                items={[
                    {
                        label: "Добавить шаблон",
                        icon: <QuestionIcon />,
                        action: onAddDocument,
                    },
                    {
                        label: "Оставить комментарий",
                        icon: <CommentsIcon />,
                        action: _.noop,
                    },
                    {
                        label: "Удалить шаблон",
                        icon: <TrashIcon />,
                        action: onDeleteDocument,
                    },
                ]}
            />
            {isCreateMode(task) && (
                <CreateTask
                    task={task}
                    service={service.current}
                    templates={templates}
                    documents={documents}
                    focusedPuzzleId={focusedPuzzleId}
                    templateSnapshots={templateSnapshots}
                    onTemplatesChange={onTemplatesChange}
                />
            )}
            {isViewMode(task) && (
                <ViewTask
                    task={task}
                    service={service.current}
                    templates={templates}
                    documents={documents}
                    focusedPuzzleId={focusedPuzzleId}
                    templateSnapshots={templateSnapshots}
                    onEditableChange={onEditableChange}
                    onAddStage={onAddStage}
                    onDeleteStage={onDeleteStage}
                    onTemplatesChange={onTemplatesChange}
                />
            )}
        </React.Fragment>
    );
};
