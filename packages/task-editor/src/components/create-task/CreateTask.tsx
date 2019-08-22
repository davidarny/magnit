/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    ButtonLikeText,
    DateField,
    InputField,
    SelectableBlockWrapper,
    SelectField,
} from "@magnit/components";
import { IEditorService } from "@magnit/services";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import { Link } from "@reach/router";
import { TemplateRenderer } from "components/renderers";
import { TaskFieldContainer } from "components/task-field-container";
import { IDocument, ITask, TChangeEvent } from "entities";
import _ from "lodash";
import { useCallback } from "react";
import * as React from "react";
import uuid from "uuid/v4";

interface ICreateTaskProps {
    task: Partial<ITask>;
    service: IEditorService;
    templates: Omit<IDocument, "__uuid">[];
    documents: IDocument[];
    templateSnapshots: Map<string, object>;
    focusedPuzzleId?: string;

    onTemplatesChange(uuid: string, event: TChangeEvent): void;
}

export const CreateTask: React.FC<ICreateTaskProps> = props => {
    const { task, service, documents, focusedPuzzleId, templates, templateSnapshots } = props;

    const getTaskId = useCallback(() => _.get(task, "id", uuid()).toString(), [task]);

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
            {documents.map(document => {
                const snapshot = templateSnapshots.get(document.id.toString());
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
                                onChange={event => props.onTemplatesChange(document.__uuid, event)}
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
            })}
        </React.Fragment>
    );
};
