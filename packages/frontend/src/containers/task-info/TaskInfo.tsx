/** @jsx jsx */

import { jsx } from "@emotion/core";
import { FC, ReactNode } from "react";
import { Grid, Typography } from "@material-ui/core";
import { SectionTitle } from "components/section-title";
import { SectionLayout } from "components/section-layout";
import { CustomButton, SelectableBlockWrapper, StepperWrapper } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";
import { ETaskStatus } from "../../entities";

const steps = [
    {
        title: (
            <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                Подготовка технического плана
            </Typography>
        ),
        content: (
            <Grid container direction={"column"}>
                <Typography style={{ fontSize: 16 }}>до 07.07.2019 (просрочено)</Typography>
                <Typography style={{ fontSize: 14 }}>История изменений</Typography>
            </Grid>
        ),
    },
];

export const TaskInfo: FC = () => {
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
                    <CustomButton
                        variant="contained"
                        title="Завершить"
                        scheme="green"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                    <CustomButton
                        variant="contained"
                        title="Отправить"
                        scheme="violet"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                    <CustomButton
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
                    {getBlockHead("Хардкорное задание для суровых прорабов", ETaskStatus.CHECKED)}

                    <Grid container spacing={2}>
                        <Grid item xs css={theme => ({ marginTop: theme.spacing(4) })}>
                            <Grid container direction={"row"}>
                                {getMainInfoData("Администратор", "Andrey_555")}
                                {getMainInfoData("Исполнитель", "Рукастый Иннокентий Петрович")}
                            </Grid>
                            <Grid
                                container
                                direction={"row"}
                                css={theme => ({ marginTop: theme.spacing(3) })}
                            >
                                {getMainInfoData(
                                    "Местоположение",
                                    "Челябинская область, Челябинск, улица Железная, 5"
                                )}
                                {getMainInfoData("Формат объекта", "МК")}
                            </Grid>
                        </Grid>
                        <Grid item xs>
                            <StepperWrapper steps={steps} />
                        </Grid>
                    </Grid>
                </SelectableBlockWrapper>
                {parts.map(part => (
                    <SelectableBlockWrapper css={theme => ({ padding: theme.spacing(3) })}>
                        {getBlockHead(part.title)}
                    </SelectableBlockWrapper>
                ))}
            </Grid>
        </SectionLayout>
    );
};

function getMainInfoData(title: string, value: string): ReactNode {
    return (
        <Grid item xs>
            <Typography
                css={theme => ({ color: theme.colors.secondary })}
                style={{
                    fontSize: 14,
                    textTransform: "uppercase",
                }}
            >
                {title}
            </Typography>
            <Typography css={theme => ({ color: theme.colors.black })} style={{ fontSize: 17 }}>
                {value}
            </Typography>
        </Grid>
    );
}

const statusTitle = {
    [ETaskStatus.IN_PROGRESS]: "В работе",
    [ETaskStatus.CHECKED]: "На проверке",
    [ETaskStatus.DONE]: "Завершено",
    [ETaskStatus.DRAFT]: "Черновик",
};

const colorByStatus = {
    [ETaskStatus.IN_PROGRESS]: "#8F7EE5",
    [ETaskStatus.CHECKED]: "#FFBC3C",
    [ETaskStatus.DONE]: "#0CDAAC",
    [ETaskStatus.DRAFT]: "#8A94A2",
};

function getBlockHead(title: string, status?: string): ReactNode {
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
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            display: "inline-block",
                            background: colorByStatus[status as ETaskStatus],
                            margin: "2px 10px 2px 0",
                        }}
                    />
                    <span style={{ color: colorByStatus[status as ETaskStatus] }}>
                        {status && statusTitle[status as ETaskStatus]}
                    </span>
                </Grid>
            )}
        </Grid>
    );
}
