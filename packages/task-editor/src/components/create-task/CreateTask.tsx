/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    ButtonLikeText,
    DateField,
    InputField,
    SelectableBlockWrapper,
    SelectField,
} from "@magnit/components";
import { IDocument, IRenderDocument, ITask } from "@magnit/entities";
import { IEditorService } from "@magnit/services";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import { Link } from "@reach/router";
import { TemplateRenderer } from "components/renderers";
import { TaskFieldContainer } from "components/task-field-container";
import _ from "lodash";
import * as React from "react";
import { useCallback } from "react";
import uuid from "uuid/v4";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

interface ICreateTaskProps {
    task: Partial<ITask>;
    service: IEditorService;
    templates: IDocument[];
    documents: IRenderDocument[];
    templateSnapshots: Map<string, object>;
    focusedPuzzleId?: string;

    onTaskTitleChange(title: string): void;

    onTaskTitleBlur(): void;

    onTemplatesChange(uuid: string, event: TSelectChangeEvent): void;
}

export const CreateTask: React.FC<ICreateTaskProps> = props => {
    const { task, service, documents, focusedPuzzleId, templates, templateSnapshots } = props;
    const { onTaskTitleChange, onTemplatesChange, onTaskTitleBlur } = props;

    const getTaskId = useCallback(() => _.get(task, "id", uuid()).toString(), [task]);

    const onTitleChangeCallback = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onTaskTitleChange(event.target.value);
        },
        [onTaskTitleChange],
    );

    const onTitleBlurCallback = useCallback(() => {
        onTaskTitleBlur();
    }, [onTaskTitleBlur]);

    return (
        <React.Fragment>
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
                            onChange={onTitleChangeCallback}
                            onBlur={onTitleBlurCallback}
                            fullWidth
                        />
                    </TaskFieldContainer>
                    <TaskFieldContainer label="Этап задания">
                        <Grid container direction="row" alignItems="flex-end" spacing={2}>
                            <Grid item xs>
                                <InputField placeholder="Введите название этапа" fullWidth />
                            </Grid>
                            <Grid item>
                                <DateField placeholder="Срок выполнения" />
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
            {documents.map(document => (
                <TaskDocument
                    key={document.__uuid}
                    document={document}
                    templates={templates}
                    service={service}
                    templateSnapshots={templateSnapshots}
                    focusedPuzzleId={focusedPuzzleId}
                    onTemplatesChange={onTemplatesChange}
                />
            ))}
        </React.Fragment>
    );
};

CreateTask.displayName = "CreateTask";

interface ITaskDocumentProps {
    templates: IDocument[];
    service: IEditorService;
    templateSnapshots: Map<string, object>;
    document: IRenderDocument;
    focusedPuzzleId?: string;

    onTemplatesChange(uuid: string, event: TSelectChangeEvent): void;
}

const TaskDocument: React.FC<ITaskDocumentProps> = props => {
    const { templates, templateSnapshots, document, service, focusedPuzzleId } = props;
    const { onTemplatesChange } = props;

    const snapshot = templateSnapshots.get(document.id.toString());

    const onTemplateChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            onTemplatesChange(document.__uuid, event);
        },
        [onTemplatesChange, document],
    );

    return (
        <SelectableBlockWrapper
            key={document.__uuid}
            onFocus={service.onPuzzleFocus.bind(service, document.__uuid)}
            onMouseDown={service.onPuzzleFocus.bind(service, document.__uuid)}
            css={theme => ({
                padding: theme.spacing(3),
                zIndex: focusedPuzzleId === document.__uuid ? 1300 : "initial",
            })}
            focused={focusedPuzzleId === document.__uuid}
            id={document.__uuid}
        >
            <Grid item xs={3} css={theme => ({ paddingLeft: theme.spacing(3) })}>
                <SelectField
                    placeholder="Выбрать шаблон"
                    value={document.id === -1 ? "" : document.id}
                    fullWidth
                    onChange={onTemplateChangeCallback}
                >
                    {templates.map(template => (
                        <MenuItem key={template.id} value={template.id}>
                            {template.title}
                        </MenuItem>
                    ))}
                </SelectField>
            </Grid>
            <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
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
};

TaskDocument.displayName = "TaskDocument";
