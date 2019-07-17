/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
    ButtonLikeText,
    DateField,
    EditorToolbar,
    InputField,
    SelectableBlockWrapper,
    SelectField,
} from "@magnit/components";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { TaskFieldContainer } from "./components/task-field-container";
import { CommentsIcon, QuestionIcon, TrashIcon } from "@magnit/icons";
import _ from "lodash";
import { EEditorType, ETerminals, getEditorService, getFriendlyDate } from "@magnit/services";
import uuid from "uuid/v4";
import { IDocument, ITask, TChangeEvent } from "./entities";
import { TemplateRenderer } from "./components/renderers";
import { Link } from "@reach/router";

interface ITaskEditorProps {
    initialState?: ITask;
    templates: Omit<IDocument, "__uuid">[];

    getTemplate?(id: string): Promise<{ template: object }>;
}

export const TaskEditor: React.FC<ITaskEditorProps> = ({ templates, ...props }) => {
    const [task, setTask] = useState<ITask>(
        props.initialState || {
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
            documents[documentIndex].key = templates[templateIndex].id;
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
            <SelectableBlockWrapper
                css={theme => ({
                    padding: theme.spacing(3),
                    zIndex: focusedPuzzleId === task.id ? 1300 : "initial",
                })}
                onFocus={service.current.onPuzzleFocus.bind(service.current, task.id)}
                onMouseDown={service.current.onPuzzleFocus.bind(service.current, task.id)}
                onBlur={service.current.onPuzzleBlur.bind(service.current)}
                focused={focusedPuzzleId === task.id}
                id={task.id}
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
                            value={task.title}
                            fullWidth
                        />
                    </TaskFieldContainer>
                    <TaskFieldContainer label="Этап задания">
                        <Grid container direction="row" alignItems="flex-end" spacing={2}>
                            <Grid item xs>
                                <InputField
                                    placeholder="Введите название этапа"
                                    value={task.stage.title}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <DateField
                                    value={
                                        task.stage.until ? getFriendlyDate(task.stage.until) : ""
                                    }
                                    css={theme => ({ color: theme.colors.secondary })}
                                    placeholder="Срок выполнения"
                                />
                            </Grid>
                        </Grid>
                    </TaskFieldContainer>
                    <TaskFieldContainer label="Местоположение">
                        <Grid container direction="row" alignItems="flex-end" spacing={2}>
                            <Grid item xs>
                                <SelectField placeholder="Регион" fullWidth />
                            </Grid>
                            <Grid item xs>
                                <SelectField placeholder="Филиал" fullWidth />
                            </Grid>
                            <Grid item xs>
                                <SelectField placeholder="Формат" fullWidth />
                            </Grid>
                            <Grid item xs>
                                <SelectField placeholder="Адрес" fullWidth />
                            </Grid>
                        </Grid>
                    </TaskFieldContainer>
                    <TaskFieldContainer label="Исполнитель">
                        <Grid item xs={4}>
                            <SelectField placeholder="Выберите исполнителя" fullWidth />
                        </Grid>
                    </TaskFieldContainer>
                </Grid>
            </SelectableBlockWrapper>
            <SelectableBlockWrapper css={theme => ({ padding: theme.spacing(3) })}>
                <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                    <Grid item xs={12}>
                        <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                            Документы
                        </Typography>
                    </Grid>
                </Grid>
            </SelectableBlockWrapper>
            {documents.map(document => {
                const snapshot = templateSnapshots.get(document.id);
                return (
                    <SelectableBlockWrapper
                        key={document.__uuid}
                        onFocus={service.current.onPuzzleFocus.bind(
                            service.current,
                            document.__uuid
                        )}
                        onMouseDown={service.current.onPuzzleFocus.bind(
                            service.current,
                            document.__uuid
                        )}
                        onBlur={service.current.onPuzzleBlur.bind(service.current)}
                        css={theme => ({
                            padding: theme.spacing(3),
                            zIndex: focusedPuzzleId === document.__uuid ? 1300 : "initial",
                        })}
                        focused={focusedPuzzleId === document.__uuid}
                        id={document.__uuid}
                    >
                        <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                            <Grid item xs={3}>
                                <SelectField
                                    placeholder="Выбрать шаблон"
                                    value={document.id}
                                    fullWidth
                                    onChange={event => onTemplateChange(document.__uuid, event)}
                                >
                                    {templates.map(template => (
                                        <MenuItem key={template.id} value={template.id}>
                                            {template.title}
                                        </MenuItem>
                                    ))}
                                </SelectField>
                            </Grid>
                            <Grid item xs={12}>
                                {_.get(snapshot, "id") && (
                                    <ButtonLikeText
                                        component={Link}
                                        to={`/templates/edit/${_.get(snapshot, "id")}`}
                                        css={theme => ({
                                            marginLeft: theme.spacing(),
                                            marginTop: theme.spacing(2),
                                        })}
                                    >
                                        Перейти к шаблону
                                    </ButtonLikeText>
                                )}
                                <TemplateRenderer template={snapshot} />
                            </Grid>
                        </Grid>
                    </SelectableBlockWrapper>
                );
            })}
        </React.Fragment>
    );
};
