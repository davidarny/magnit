/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { ButtonLikeText, SelectableBlockWrapper, StepperWrapper } from "@magnit/components";
import { ETaskStatus, IEditorService } from "@magnit/services";
import { IDocument, ITask } from "entities";
import _ from "lodash";
import { Link } from "@reach/router";
import { TemplateRenderer } from "components/renderers";

interface IViewTaskProps {
    task: ITask;
    service: IEditorService;
    templates: Omit<IDocument, "__uuid">[];
    documents: IDocument[];
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, object>;
}

export const ViewTask: React.FC<IViewTaskProps> = props => {
    const { service, task, documents, focusedPuzzleId, templateSnapshots } = props;
    const realDocument = documents.filter(document => !!document.title);
    const steps = [
        {
            title: (
                <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                    Подготовка технического плана
                </Typography>
            ),
            content: (
                <Grid container direction={"column"}>
                    <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                        до 07.07.2019 (просрочено)
                    </Typography>
                    <Typography css={theme => ({ fontSize: theme.fontSize.smaller })}>
                        История изменений
                    </Typography>
                </Grid>
            ),
            completed: false,
        },
        {
            title: (
                <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                    Подготовка технического плана
                </Typography>
            ),
            content: (
                <Grid container direction={"column"}>
                    <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                        до 07.07.2019 (просрочено)
                    </Typography>
                    <Typography css={theme => ({ fontSize: theme.fontSize.smaller })}>
                        История изменений
                    </Typography>
                </Grid>
            ),
            completed: false,
        },
    ];

    return (
        <React.Fragment>
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
                            <MainInfo title="Администратор" value="Andrey_555" />
                            <MainInfo title="Исполнитель" value="Рукастый Иннокентий Петрович" />
                        </Grid>
                        <Grid
                            container
                            direction={"row"}
                            css={theme => ({ marginTop: theme.spacing(3) })}
                        >
                            <MainInfo
                                title="Местоположение"
                                value="Челябинская область, Челябинск, улица Железная, 5"
                            />
                            <MainInfo title="Формат объекта" value="МК" />
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <StepperWrapper steps={steps} />
                    </Grid>
                </Grid>
            </SelectableBlockWrapper>
            {realDocument.length > 0 &&
                realDocument.map(document => {
                    const snapshot = templateSnapshots.get(document.id);
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
                            focused={focusedPuzzleId === document.__uuid}
                            id={document.__uuid}
                        >
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

interface IMainInfoProps {
    title: string;
    value: string;
}

const MainInfo: React.FC<IMainInfoProps> = ({ title, value }) => {
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
