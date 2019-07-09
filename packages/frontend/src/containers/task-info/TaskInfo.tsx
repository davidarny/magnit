/** @jsx jsx */

import { jsx } from "@emotion/core";
import { FC, ReactNode } from "react";
import { Grid, Typography } from "@material-ui/core";
import { SectionTitle } from "components/section-title";
import { SectionLayout } from "components/section-layout";
import { CustomButton, SelectableBlockWrapper, StepperWrapper } from "@magnit/components";
import { CheckIcon } from "@magnit/icons";

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
    return (
        <SectionLayout>
            <SectionTitle title="Информация о задании">
                <Grid item>
                    <CustomButton
                        variant="contained"
                        title="Редактировать"
                        scheme="blue"
                        icon={<CheckIcon />}
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
                    })}
                    focused
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
                            <div>На проверке</div>
                        </Grid>
                    </Grid>

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
            <Typography
                css={theme => ({ color: theme.colors.black })}
                style={{
                    fontSize: 17,
                }}
            >
                {value}
            </Typography>
        </Grid>
    );
}
