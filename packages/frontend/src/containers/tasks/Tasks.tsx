/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { Grid, Paper } from "@material-ui/core";
import * as React from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import {
    CustomButton,
    IColumn,
    InputField,
    ITab,
    SelectField,
    TableWrapper,
    TabsWrapper,
} from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { ETaskStatus } from "../../entities";
import { EmptyList } from "components/list";

const tabs: ITab[] = [
    { value: ETaskStatus.IN_PROGRESS, label: "В работе" },
    { value: ETaskStatus.CHECKED, label: "На проверке" },
    { value: ETaskStatus.DRAFT, label: "Черновики" },
    { value: ETaskStatus.DONE, label: "Завершенные" },
];

const columns: IColumn[] = [
    { id: "title", label: "Название задания" },
    { id: "region", label: "Регион" },
    { id: "office_part", label: "Филиал" },
    { id: "address", label: "Адрес объекта" },
    { id: "step", label: "Этап" },
    { id: "date", label: "Срок выполнения" },
];

const rows: object[] = [
    {
        title: "Задание 1",
        region: "Марий Эл",
        address: "г. Йошкар-Ола, Воскресенский Проспект 17",
        step: 1,
    },
    {
        title: "Задание 2",
        region: "Марий Эл",
        address: "г. Йошкар-Ола, Воскресенский Проспект 17",
        step: 2,
    },
    {
        title: "Задание 3",
        region: "Марий Эл",
        address: "г. Йошкар-Ола, Воскресенский Проспект 17",
        step: 3,
    },
];

export const Tasks: React.FC<RouteComponentProps> = () => {
    const empty = !rows.length;

    return (
        <SectionLayout>
            <SectionTitle title="Список заданий">
                <Grid item hidden={empty}>
                    <CustomButton
                        component={Link}
                        to="create"
                        variant="contained"
                        title="Создать задание"
                        scheme="blue"
                        icon={<AddIcon />}
                        css={css`
                            width: 180px;
                        `}
                    />
                </Grid>
            </SectionTitle>
            {empty && (
                <EmptyList
                    title="Заданий нет"
                    actionName="Создать задание"
                    button={
                        <CustomButton
                            component={Link}
                            to="create"
                            icon={<AddIcon />}
                            title="Создать задание"
                            css={css`
                                width: 180px;
                            `}
                        />
                    }
                    description="Для создания задания нажмите кнопку"
                />
            )}
            {!empty && (
                <Paper
                    square={true}
                    css={theme => ({
                        margin: theme.spacing(3),
                        boxShadow: `0px 0px ${theme.spacing(2)} ${
                            theme.colors.lightGray
                        } !important`,
                    })}
                >
                    <Grid
                        container
                        direction="row"
                        css={theme => ({ marginTop: theme.spacing(2) })}
                    >
                        <TabsWrapper tabs={tabs} baseUrl="tasks">
                            <Grid
                                container
                                direction="column"
                                css={theme => ({ padding: theme.spacing(3) })}
                            >
                                <Grid container direction="row" spacing={2}>
                                    <Grid item xs>
                                        <InputField
                                            placeholder="Поиск ..."
                                            fullWidth
                                            css={theme => ({
                                                borderRadius: theme.radius(5),
                                                background: theme.colors.white,
                                                border: `1px solid ${theme.colors.lightGray}`,
                                                transition: "border 0.25s ease-in-out",
                                                cursor: "pointer",
                                                ":hover, :active": {
                                                    border: `1px solid ${theme.colors.primary}`,
                                                },
                                                div: {
                                                    ":before, :after": {
                                                        border: "none !important",
                                                    },
                                                },
                                                input: {
                                                    padding: `${theme.spacing(2)} ${theme.spacing(
                                                        4
                                                    )}`,
                                                },
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectField placeholder="Выберите регион" fullWidth />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectField placeholder="Выберите филиал" fullWidth />
                                    </Grid>
                                </Grid>
                                <Grid item css={theme => ({ padding: theme.spacing(3) })}>
                                    <TableWrapper columns={columns} data={rows} />
                                </Grid>
                            </Grid>
                        </TabsWrapper>
                    </Grid>
                </Paper>
            )}
        </SectionLayout>
    );
};
