/* eslint-disable react-hooks/exhaustive-deps */
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
import { IDocument, ITask, TChangeEvent } from "./entities";

interface ITaskEditorProps<T extends ITask> {
    initialState?: T;
    templates: Omit<IDocument, "__uuid">[];
    variant: "create" | "view";

    onTaskChange?(task: Partial<T>): void;
}

export const TaskEditor = <T extends ITask>(props: ITaskEditorProps<T>) => {
    const { templates, initialState, variant, onTaskChange } = props;

    const defaultState = ({
        id: uuid(),
        title: ETerminals.EMPTY,
        descriptions: ETerminals.EMPTY,
    } as unknown) as Partial<T>;

    const [task, setTask] = useState<Partial<T>>(initialState || defaultState);
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [templateSnapshots, setTemplateSnapshots] = useState<Map<string, object>>(new Map());
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([task.id || ""]);

    const service = useRef(
        getEditorService(EEditorType.TASK, [
            [focusedPuzzleChain, setFocusedPuzzleChain],
            [toolbarTopPosition, setToolbarTopPosition],
        ]),
    );

    const hasTemplates = (value: object): value is { templates: IDocument[] } =>
        _.has(value, "templates");

    // set toolbar offset top
    useEffect(() => {
        service.current.updateToolbarTopPosition();
    }, [focusedPuzzleChain]);

    // if no templates present (initially)
    // we add one stub document
    useEffect(() => {
        if (variant !== "create") {
            return;
        }
        if (hasTemplates(task) && _.isEmpty(task.templates)) {
            setDocuments([
                {
                    title: ETerminals.EMPTY,
                    id: ETerminals.EMPTY,
                    editable: false,
                    __uuid: uuid(),
                },
            ]);
        }
    }, [variant, task]);

    useEffect(() => {
        if (variant !== "view") {
            return;
        }
        const documents = templates.map(template => {
            templateSnapshots.set(template.id.toString(), template);
            return {
                id: _.get(template, "id"),
                title: _.get(template, "title"),
                editable: _.get(template, "editable", false),
                __uuid: uuid(),
            };
        });
        setTemplateSnapshots(new Map(templateSnapshots));
        setDocuments([...documents]);
    }, [templates, variant]);

    // on every documents change we have to
    // update current task with their id's
    // also caching template JSON for current active document
    useEffect(() => {
        if (props.variant !== "create") {
            return;
        }
        setTask({
            ...task,
            templates: documents.map(document => document.id),
        });
        if (documents.some(document => document.__uuid === focusedPuzzleId)) {
            const documentId = documents.find(document => document.__uuid === focusedPuzzleId)!.id;
            if (documentId) {
                const template = templates.find(template => template.id === documentId);
                if (template) {
                    templateSnapshots.set(documentId, template);
                    setTemplateSnapshots(new Map(templateSnapshots));
                }
            }
        }
    }, [documents]);

    const prevTask = useRef(_.cloneDeep(task));
    useEffect(() => {
        if (onTaskChange) {
            if (hasTemplates(task)) {
                task.templates = task.templates.map(template => {
                    const document = documents.find(document => document.id === template.id);
                    if (!document) {
                        return template;
                    }
                    return { ...template, ..._.omit(document, "__uuid") };
                });
            }
            if (!_.isEqual(prevTask.current, task)) {
                prevTask.current = task;
                onTaskChange({ ...task });
            }
        }
    }, [task, documents, variant, onTaskChange]);

    useEffect(() => {
        if (!_.isEqual(task, initialState) && initialState) {
            setTask(initialState);
            setFocusedPuzzleChain([initialState.id || ""]);
        }
    }, [initialState]);

    function onTemplateChange(uuid: string, event: TChangeEvent): void {
        const { templates } = props;
        const templateId = event.target.value as string;
        if (documents.some(document => document.__uuid === uuid)) {
            const templateIndex = templates.findIndex(template => template.id === templateId);
            const documentIndex = documents.findIndex(document => document.__uuid === uuid);
            documents[documentIndex].id = templates[templateIndex].id;
            documents[documentIndex].title = templates[templateIndex].title;
            setDocuments([...documents]);
        }
    }

    function onEditableChange(documentId: string, editable: boolean) {
        if (documents.some(document => document.id === documentId)) {
            const documentIndex = documents.findIndex(document => document.id === documentId);
            documents[documentIndex].editable = editable;
            setDocuments([...documents]);
        }
    }

    function onAddDocument(): void {
        setDocuments([
            ...documents,
            {
                id: ETerminals.EMPTY,
                __uuid: uuid(),
                title: ETerminals.EMPTY,
                editable: false,
            },
        ]);
    }

    const focusedPuzzleId = _.head(focusedPuzzleChain);

    const onDeleteDocument = useCallback(() => {
        // do not to delete document if only one exists
        if (documents.length === 1) {
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
    }, [focusedPuzzleChain]);

    console.log(task);

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
            {_.eq(props.variant, "create") && (
                <CreateTask
                    task={task}
                    service={service.current}
                    templates={props.templates}
                    documents={documents}
                    focusedPuzzleId={focusedPuzzleId}
                    templateSnapshots={templateSnapshots}
                    onTemplateChange={onTemplateChange}
                />
            )}
            {_.eq(props.variant, "view") && (
                <ViewTask
                    task={task}
                    service={service.current}
                    documents={documents}
                    focusedPuzzleId={focusedPuzzleId}
                    templateSnapshots={templateSnapshots}
                    onEditableChange={onEditableChange}
                />
            )}
        </React.Fragment>
    );
};
