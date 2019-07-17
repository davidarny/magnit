/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Grid, Typography } from "@material-ui/core";
import { SectionTitle } from "components/section-title";
import { SectionLayout } from "components/section-layout";
import { Button, SelectableBlockWrapper, StepperWrapper } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { ETaskStatus } from "./ETaskStatus";

export const ViewTask: React.FC = () => {
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

    const parts = [
        { title: "Документы" },
        { title: "Ведомость работ" },
        { title: "Бриф" },
        { title: "Инженерное заключение" },
        { title: "Смета" },
    ];

    return (
        <SectionLayout>
            <SectionTitle title="Информация о задании">
                <Grid item>
                    <Button
                        variant="contained"
                        title="Завершить"
                        scheme="green"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                    <Button
                        variant="contained"
                        title="Отправить"
                        scheme="violet"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                    <Button
                        variant="contained"
                        title="Редактировать"
                        scheme="blueOutline"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                </Grid>
            </SectionTitle>
            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                })}
            >
                <SelectableBlockWrapper
                    css={theme => ({
                        padding: theme.spacing(3),
                        zIndex: 1300,
                    })}
                    focused
                >
                    <Head
                        title="Хардкорное задание для суровых прорабов"
                        status={ETaskStatus.ON_CHECK}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs css={theme => ({ marginTop: theme.spacing(4) })}>
                            <Grid container direction={"row"}>
                                <MainInfo title="Администратор" value="Andrey_555" />
                                <MainInfo
                                    title="Исполнитель"
                                    value="Рукастый Иннокентий Петрович"
                                />
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
                {parts.map((part, index) => (
                    <SelectableBlockWrapper
                        key={index}
                        css={theme => ({ padding: theme.spacing(3) })}
                    >
                        <Head title={part.title} />
                    </SelectableBlockWrapper>
                ))}
            </Grid>
        </SectionLayout>
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

interface IHeadProps {
    title: string;
    status?: string;
}

const Head: React.FC<IHeadProps> = ({ title, status }) => {
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

    return (
        <Grid container spacing={2} key={title}>
            <Grid
                item
                xs={12}
                css={theme => ({
                    paddingLeft: theme.spacing(4),
                    paddingRight: theme.spacing(4),
                })}
            >
                <Typography css={theme => ({ fontSize: theme.fontSize.large })}>{title}</Typography>
            </Grid>
            {!!status && (
                <Grid item>
                    <span
                        css={theme => ({
                            width: theme.spacing(),
                            height: theme.spacing(),
                            borderRadius: "50%",
                            display: "inline-block",
                            background: getColorByStatus(theme, status as ETaskStatus),
                            margin: "2px 10px 2px 0",
                        })}
                    />
                    <span
                        css={theme => ({ color: getColorByStatus(theme, status as ETaskStatus) })}
                    >
                        {status && getTitleByStatus(status as ETaskStatus)}
                    </span>
                </Grid>
            )}
        </Grid>
    );
};
