/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useState } from "react";
import { Dialog, Grid, MenuItem, Typography } from "@material-ui/core";
import {
    Button,
    ButtonLikeText,
    DateField,
    SelectableBlockWrapper,
    SelectField,
    StepperWrapper,
} from "@magnit/components";
import { ETaskStatus, IEditorService } from "@magnit/services";
import { IDocument, IStep, ITask } from "entities";
import _ from "lodash";
import { TemplateRenderer } from "components/renderers";
import { AddIcon, CheckIcon } from "@magnit/icons";
import { ChangeAssigneIllustration } from "./ChangeAssigneIllustration";
import uuid from "uuid/v4";

interface IViewTaskProps {
    task: ITask;
    service: IEditorService;
    documents: IDocument[];
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, object>;

    onAssigneeChange?(userId: string): void;
}

export const ViewTask: React.FC<IViewTaskProps> = props => {
    const [open, setOpen] = useState(false);
    const { service, task, focusedPuzzleId, templateSnapshots } = props;

    let { documents } = props;
    documents = documents.filter(document => !!document.title);

    const [steps, setSteps] = useState<IStep[]>([
        {
            id: uuid(),
            title: "Подготовка технического плана",
            date: "07.07.2019",
            completed: false,
            editable: false,
        },
    ]);

    function onDialogClose(): void {
        setOpen(false);
    }

    function onAssigneeChange(): void {
        setOpen(true);
    }

    function onAssigneeChangeComplete(): void {
        setOpen(false);
    }

    function onAddStep(): void {
        setSteps([
            ...steps,
            {
                id: uuid(),
                title: "",
                date: "",
                completed: false,
                editable: true,
            },
        ]);
    }

    function onChangeStepTitle(id: string, value: string): void {
        if (steps.some(step => step.id === id)) {
            const stepIndex = steps.findIndex(step => step.id === id);
            steps[stepIndex].title = value;
            setSteps([...steps]);
        }
    }

    function onChangeStepDate(id: string, value: string): void {
        if (steps.some(step => step.id === id)) {
            const stepIndex = steps.findIndex(step => step.id === id);
            steps[stepIndex].date = value;
            setSteps([...steps]);
        }
    }

    function onStepDelete(id: string): void {
        if (steps.some(step => step.id === id)) {
            const stepIndex = steps.findIndex(step => step.id === id);
            steps.splice(stepIndex, 1);
            setSteps([...steps]);
        }
    }

    return (
        <React.Fragment>
            <Dialog
                onClose={onDialogClose}
                open={open}
                classes={{ paper: "paper" }}
                css={css`
                    .paper {
                        overflow: hidden;
                    }
                `}
            >
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    css={theme => ({
                        padding: theme.spacing(6),
                        minWidth: theme.spacing(50),
                    })}
                >
                    <Grid item>
                        <Grid container justify="center" alignItems="center">
                            <Grid item>
                                <ChangeAssigneIllustration />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography css={theme => ({ fontSize: theme.fontSize.medium })}>
                            Выберите исполнителя:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <SelectField fullWidth placeholder="Выберите исполнителя">
                            <MenuItem>Антонов Сергей Петрович</MenuItem>
                            <MenuItem>Антонов Сергей Петрович</MenuItem>
                            <MenuItem>Антонов Сергей Петрович</MenuItem>
                            <MenuItem>Антонов Сергей Петрович</MenuItem>
                            <MenuItem>Антонов Сергей Петрович</MenuItem>
                        </SelectField>
                    </Grid>
                    <Grid item css={theme => ({ paddingTop: `${theme.spacing(5)} !important` })}>
                        <Grid container justify="center" alignItems="center">
                            <Grid item>
                                <Button
                                    icon={<CheckIcon />}
                                    variant="contained"
                                    scheme="blue"
                                    title="Сохранить"
                                    onClick={onAssigneeChangeComplete}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
            <SelectableBlockWrapper
                css={theme => ({
                    padding: theme.spacing(3),
                    zIndex: focusedPuzzleId === task.id ? 1300 : "initial",
                })}
                onFocus={service.onPuzzleFocus.bind(service, task.id)}
                onMouseDown={service.onPuzzleFocus.bind(service, task.id)}
                onBlur={service.onPuzzleBlur.bind(service)}
                focused={focusedPuzzleId === task.id}
                id={task.id}
            >
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        css={theme => ({
                            paddingLeft: theme.spacing(4),
                            paddingRight: theme.spacing(4),
                        })}
                    >
                        <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                            Хардкорное задание для суровых прорабов
                        </Typography>
                    </Grid>
                    <Grid item>
                        <span
                            css={theme => ({
                                width: theme.spacing(),
                                height: theme.spacing(),
                                borderRadius: "50%",
                                display: "inline-block",
                                background: getColorByStatus(theme, ETaskStatus.ON_CHECK),
                                margin: "2px 10px 2px 0",
                            })}
                        />
                        <span
                            css={theme => ({
                                color: getColorByStatus(theme, ETaskStatus.ON_CHECK),
                            })}
                        >
                            {getTitleByStatus(ETaskStatus.ON_CHECK)}
                        </span>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs css={theme => ({ marginTop: theme.spacing(4) })}>
                        <Grid container direction={"row"}>
                            <InfoField title="Администратор" value="SuperMegaAdmin" />
                            <InfoField
                                title="Исполнитель"
                                value="Рукастый Иннокентий Петрович"
                                editable
                                label="Изменить исполнителя"
                                onEditableClick={onAssigneeChange}
                            />
                        </Grid>
                        <Grid
                            container
                            direction={"row"}
                            css={theme => ({ marginTop: theme.spacing(3) })}
                        >
                            <InfoField
                                title="Местоположение"
                                value="Челябинская область, Челябинск, улица Железная, 5"
                            />
                            <InfoField title="Формат объекта" value="МК" />
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <StepperWrapper
                            onTitleChange={onChangeStepTitle}
                            onStepDelete={onStepDelete}
                            steps={steps.map(step => ({
                                id: step.id,
                                editable: step.editable,
                                completed: step.completed,
                                title: step.title,
                                content: (
                                    <DateField
                                        onChange={event =>
                                            onChangeStepDate(step.id, event.target.value)
                                        }
                                        value={step.date}
                                    />
                                ),
                            }))}
                        />
                        <Button
                            variant="outlined"
                            scheme="blueOutline"
                            css={theme => ({
                                color: theme.colors.primary,
                                marginLeft: theme.spacing(6),
                            })}
                            icon={<AddIcon />}
                            title="Добавить новый этап"
                            onClick={onAddStep}
                        />
                    </Grid>
                </Grid>
            </SelectableBlockWrapper>
            {documents.length > 0 &&
                documents.map(document => {
                    const snapshot = templateSnapshots.get(document.id.toString());
                    const focused = focusedPuzzleId === document.__uuid;
                    return (
                        <SelectableBlockWrapper
                            key={document.__uuid}
                            onFocus={service.onPuzzleFocus.bind(service, document.__uuid)}
                            onMouseDown={service.onPuzzleFocus.bind(service, document.__uuid)}
                            onBlur={service.onPuzzleBlur.bind(service)}
                            css={theme => ({
                                padding: theme.spacing(3),
                                zIndex: focusedPuzzleId === document.__uuid ? 1300 : "initial",
                            })}
                            focused={focused}
                            id={document.__uuid}
                        >
                            <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                                <Grid item xs={12}>
                                    <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                                        {_.get(snapshot, "title")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    {focused && <TemplateRenderer template={snapshot} />}
                                </Grid>
                            </Grid>
                        </SelectableBlockWrapper>
                    );
                })}
        </React.Fragment>
    );
};

interface IMainInfoProps {
    title: string;
    value: string;
    editable?: boolean;
    label?: string;

    onEditableClick?(): void;
}

const InfoField: React.FC<IMainInfoProps> = ({ title, value, editable, label, ...props }) => {
    return (
        <Grid item xs>
            <Typography
                css={theme => ({
                    color: theme.colors.secondary,
                    fontSize: theme.fontSize.smaller,
                    textTransform: "uppercase",
                })}
            >
                {title}
            </Typography>
            <Typography
                css={theme => ({
                    fontSize: theme.fontSize.normal,
                    color: theme.colors.black,
                })}
            >
                {value}
            </Typography>
            {editable && <ButtonLikeText onClick={props.onEditableClick}>{label}</ButtonLikeText>}
        </Grid>
    );
};

function getTitleByStatus(status: ETaskStatus): string {
    return {
        [ETaskStatus.IN_PROGRESS]: "В работе",
        [ETaskStatus.ON_CHECK]: "На проверке",
        [ETaskStatus.COMPLETED]: "Завершено",
        [ETaskStatus.DRAFT]: "Черновик",
    }[status];
}

function getColorByStatus(theme: any, status: ETaskStatus): string {
    return {
        [ETaskStatus.IN_PROGRESS]: theme.colors.violet,
        [ETaskStatus.ON_CHECK]: theme.colors.darkYellow,
        [ETaskStatus.COMPLETED]: theme.colors.green,
        [ETaskStatus.DRAFT]: theme.colors.secondary,
    }[status];
}
