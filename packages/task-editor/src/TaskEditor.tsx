/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { EditorToolbar } from "@magnit/components";
import { jsx } from "@emotion/core";
import { CommentsIcon, QuestionIcon, TrashIcon } from "@magnit/icons";
import _ from "lodash";
import { EEditorType, ETerminals, getEditorService } from "@magnit/services";
import uuid from "uuid/v4";
import { IDocument, ITask, TChangeEvent } from "./entities";
import { ViewTask } from "./components/view-task";
import { CreateTask } from "./components/create-task";

interface IGetTemplate {
    template: object;
}

interface ITaskEditorProps {
    task?: ITask;
    templates: Omit<IDocument, "__uuid">[];
    variant: "create" | "view";

    getTemplate?(id: string): Promise<IGetTemplate>;
}

export const TaskEditor: React.FC<ITaskEditorProps> = ({ templates, ...props }) => {
    const [task, setTask] = useState<ITask>(
        props.task || {
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
            documents: [],
        }
    );
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [templateSnapshots, setTemplateSnapshots] = useState<Map<string, object>>(new Map());
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([task.id]);
    const service = useRef(
        getEditorService(EEditorType.TASK, [
            [focusedPuzzleChain, setFocusedPuzzleChain],
            [toolbarTopPosition, setToolbarTopPosition],
        ])
    );

    // set toolbar offset top
    useEffect(() => {
        service.current.updateToolbarTopPosition();
    }, [focusedPuzzleChain]);

    // if no documents present (initially)
    // we add one stub document, so user won't
    // add it by himself
    useEffect(() => {
        if (_.isEmpty(task.documents)) {
            setDocuments([
                {
                    title: ETerminals.EMPTY,
                    id: ETerminals.EMPTY,
                    __uuid: uuid(),
                },
            ]);
        }
    }, []);

    const focusedPuzzleId = _.head(focusedPuzzleChain);

    // on every documents change we have to
    // update current task with their id's
    // also caching template JSON for current active document
    useEffect(() => {
        setTask({
            ...task,
            documents: documents.map(document => document.id),
        });
        if (documents.some(document => document.__uuid === focusedPuzzleId)) {
            const documentId = documents.find(document => document.__uuid === focusedPuzzleId)!.id;
            props.getTemplate &&
                documentId &&
                props
                    .getTemplate(documentId)
                    .then(response => response.template)
                    .then(template => {
                        templateSnapshots.set(documentId, template);
                        setTemplateSnapshots(new Map(templateSnapshots));
                    });
        }
    }, [documents]);

    function onTemplateChange(uuid: string, event: TChangeEvent): void {
        const templateId = event.target.value as string;
        if (documents.some(document => document.__uuid === uuid)) {
            const templateIndex = templates.findIndex(template => template.id === templateId);
            const documentIndex = documents.findIndex(document => document.__uuid === uuid);
            documents[documentIndex].id = templates[templateIndex].id;
            documents[documentIndex].title = templates[templateIndex].title;
            setDocuments([...documents]);
        }
    }

    function onAddDocument(): void {
        setDocuments([
            ...documents,
            { id: ETerminals.EMPTY, __uuid: uuid(), title: ETerminals.EMPTY },
        ]);
    }

    function onDeleteDocument(): void {
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
    }

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
                    templates={templates}
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
                    templates={templates}
                    documents={documents}
                    focusedPuzzleId={focusedPuzzleId}
                    templateSnapshots={templateSnapshots}
                />
            )}
        </React.Fragment>
    );
};
