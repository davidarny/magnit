/** @jsx jsx */

import { FC, ReactNode } from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import {
    CustomButton,
    DateField,
    InputField,
    SelectableBlockWrapper,
    SelectField,
} from "@magnit/components";
import { AddIcon, CheckIcon } from "@magnit/icons";
import css from "@emotion/css";

export const EditTask: FC = () => {
    const parts = [{ title: "Документы" }];

    return (
        <SectionLayout>
            <SectionTitle title="Информация о задании">
                <Grid item>
                    <CustomButton
                        variant="contained"
                        title="Сохранить"
                        scheme="green"
                        icon={<CheckIcon />}
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                    />
                    <CustomButton
                        variant="outlined"
                        title="Отмена"
                        scheme="violet"
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
                    <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                        <Grid item xs={12}>
                            <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                                Основная информация
                            </Typography>
                        </Grid>
                        {renderFieldContainer(
                            "Название задания",
                            <Grid container direction={"row"} alignItems={"flex-end"} spacing={2}>
                                <Grid item xs>
                                    <InputField
                                        placeholder={"Введите название задания"}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>,
                        )}
                        {renderFieldContainer(
                            "Этап задания",
                            <Grid container direction={"row"} alignItems={"flex-end"} spacing={2}>
                                <Grid item xs>
                                    <InputField placeholder={"Введите название этапа"} fullWidth />
                                </Grid>
                                <Grid item>
                                    <DateField placeholder={"Срок выполнения"} />
                                </Grid>
                                <Grid container>
                                    <Grid item xs style={{ marginLeft: 7 }}>
                                        <CustomButton
                                            variant="outlined"
                                            title="Добавить этап"
                                            scheme="blueOutline"
                                            css={css`
                                                width: 180px;
                                            `}
                                            icon={<AddIcon />}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>,
                        )}
                        {renderFieldContainer(
                            "Местоположение",
                            <Grid container direction={"row"} alignItems={"flex-end"} spacing={2}>
                                <Grid item xs>
                                    <SelectField placeholder={"Регион"} fullWidth />
                                </Grid>
                                <Grid item xs>
                                    <SelectField placeholder={"Филиал"} fullWidth />
                                </Grid>
                                <Grid item xs>
                                    <SelectField placeholder={"Формат"} fullWidth />
                                </Grid>
                                <Grid item xs>
                                    <SelectField placeholder={"Адрес"} fullWidth />
                                </Grid>
                            </Grid>,
                        )}
                        {renderFieldContainer(
                            "Исполнитель",
                            <Grid item xs={4}>
                                <SelectField placeholder={"Выберите исполнителя"} fullWidth />
                            </Grid>,
                        )}
                    </Grid>
                </SelectableBlockWrapper>
                {parts.map((part, index) => (
                    <SelectableBlockWrapper
                        css={theme => ({ padding: theme.spacing(3) })}
                        key={index}
                    >
                        <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                            <Grid item xs={12}>
                                <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                                    {part.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {renderFieldContainer(
                                    "Шаблон",
                                    <Grid item xs={3}>
                                        <SelectField placeholder={"Выбрать шаблон"} fullWidth />
                                    </Grid>,
                                )}
                            </Grid>
                        </Grid>
                    </SelectableBlockWrapper>
                ))}
            </Grid>
        </SectionLayout>
    );
};

function renderFieldContainer(label: string, content: ReactNode): ReactNode {
    return (
        <Grid
            container
            direction={"row"}
            spacing={2}
            alignItems={"flex-start"}
            style={{ marginTop: 10 }}
        >
            <Grid item xs={2} style={{ marginTop: 20 }}>
                <Typography component={"span"}>{label}</Typography>
            </Grid>
            <Grid item xs>
                {content}
            </Grid>
        </Grid>
    );
}
