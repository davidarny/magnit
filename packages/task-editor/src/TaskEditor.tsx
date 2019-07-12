/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
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

interface ITaskEditorProps {
    initialState?: ITask;
    templates: Omit<IDocument, "__uuid">[];

    getTemplate?(id: string): Promise<{ template: string }>;
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
    const [templateSnapshots, setTemplateSnapshots] = useState<Map<string, object>>(new Map());
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([task.id]);
    const service = useRef(
        getEditorService(EEditorType.TASK, [[focusedPuzzleChain, setFocusedPuzzleChain]])
    );

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

    useEffect(() => {
        setTask({
            ...task,
            documents: documents.map(document => document.id),
        });
        if (documents.some(document => document.__uuid === focusedPuzzleId)) {
            const documentId = documents.find(document => document.__uuid === focusedPuzzleId)!.id;
            props.getTemplate &&
                props
                    .getTemplate(documentId)
                    .then(response => JSON.parse(response.template))
                    .then(template => {
                        templateSnapshots.set(documentId, template);
                        setTemplateSnapshots(new Map(templateSnapshots));
                    });
        }
    }, [documents]);

    function onTemplateChange(documentId: string, event: TChangeEvent): void {
        const templateId = event.target.value as string;
        if (!task.documents.includes(documentId)) {
            setTask({ ...task, documents: [...task.documents, documentId] });
        }
        if (documents.some(document => document.id === documentId)) {
            const templateIndex = templates.findIndex(template => template.id === templateId);
            const documentIndex = documents.findIndex(document => document.id === documentId);
            documents[documentIndex].id = templates[templateIndex].id;
            documents[documentIndex].title = templates[templateIndex].title;
            setDocuments([...documents]);
        }
    }

    return (
        <React.Fragment>
            <EditorToolbar
                top={0}
                items={[
                    {
                        label: "Добавить шаблон",
                        icon: <QuestionIcon />,
                        action: _.noop,
                    },
                    {
                        label: "Оставить комментарий",
                        icon: <CommentsIcon />,
                        action: _.noop,
                    },
                    { label: "Удалить шаблон", icon: <TrashIcon />, action: _.noop },
                ]}
            />
            <SelectableBlockWrapper
                css={theme => ({
                    padding: theme.spacing(3),
                    zIndex: 1300,
                })}
                onFocus={service.current.onPuzzleFocus.bind(service.current, task.id)}
                onMouseDown={service.current.onPuzzleFocus.bind(service.current, task.id)}
                onBlur={service.current.onPuzzleBlur.bind(service.current)}
                focused={focusedPuzzleId === task.id}
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
                return (
                    <SelectableBlockWrapper
                        key={document.id}
                        onFocus={service.current.onPuzzleFocus.bind(
                            service.current,
                            document.__uuid
                        )}
                        onMouseDown={service.current.onPuzzleFocus.bind(
                            service.current,
                            document.__uuid
                        )}
                        onBlur={service.current.onPuzzleBlur.bind(service.current)}
                        css={theme => ({ padding: theme.spacing(3) })}
                        focused={focusedPuzzleId === document.__uuid}
                    >
                        <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                            <Grid item xs={3}>
                                <SelectField
                                    placeholder="Выбрать шаблон"
                                    value={document.id}
                                    fullWidth
                                    onChange={event => onTemplateChange(document.id, event)}
                                >
                                    {templates.map(template => (
                                        <MenuItem key={template.id} value={template.id}>
                                            {template.title}
                                        </MenuItem>
                                    ))}
                                </SelectField>
                            </Grid>
                            <Grid item xs={12}>
                                <pre>
                                    {JSON.stringify(templateSnapshots.get(document.id), null, 2)}
                                </pre>
                            </Grid>
                        </Grid>
                    </SelectableBlockWrapper>
                );
            })}
        </React.Fragment>
    );
};
