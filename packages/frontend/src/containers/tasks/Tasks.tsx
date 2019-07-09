/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, Paper } from "@material-ui/core";
import * as React from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import {
    IColumn,
    InputField,
    ITab,
    SelectField,
    TableWrapper,
    TabsWrapper,
    CustomButton,
} from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { ETaskStatus } from "../../entities";

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

const data = [
    { title: "aaa", region: "12313", address: "1111", step: 1 },
    { title: "aaa", region: "12313", address: "1111", step: 2 },
    { title: "aaa", region: "12313", address: "1111", step: 3 },
];

export const Tasks: React.FC<RouteComponentProps> = () => {
    return (
        <SectionLayout>
            {/* <RouteMatcher
                routes={[
                    {
                        paths: ["", ETabPath.ALL],
                        render: () => setTabIndex(ETabIndex.ALL),
                    },
                    {
                        path: ETabPath.NEW,
                        render: () => setTabIndex(ETabIndex.NEW),
                    },
                    {
                        path: ETabPath.SENT,
                        render: () => setTabIndex(ETabIndex.SENT),
                    },
                    {
                        path: ETabPath.IN_PROGRESS,
                        render: () => setTabIndex(ETabIndex.IN_PROGRESS),
                    },
                    {
                        path: ETabPath.DONE,
                        render: () => setTabIndex(ETabIndex.DONE),
                    },
                    {
                        path: ETabPath.REJECTED,
                        render: () => setTabIndex(ETabIndex.REJECTED),
                    },
                    {
                        path: ETabPath.OVERDUE,
                        render: () => setTabIndex(ETabIndex.OVERDUE),
                    },
                    {
                        path: ETabPath.DEACTIVATED,
                        render: () => setTabIndex(ETabIndex.DEACTIVATED),
                    },
                ]}
            />*/}
            <SectionTitle title="Список заданий">
                <Grid item>
                    <CustomButton
                        component={Link}
                        to="/tasks/create"
                        variant="contained"
                        title="Создать задание"
                        scheme="blue"
                        icon={<AddIcon />}
                        css={theme => ({ width: 180 })}
                    />
                </Grid>
            </SectionTitle>
            <Paper
                square={true}
                css={theme => ({
                    margin: theme.spacing(3),
                    boxShadow: "0px 0px 15px rgba(207, 217, 227, 0.45) !important",
                })}
            >
                <Grid container direction="row" style={{ marginTop: 18 }}>
                    <TabsWrapper tabs={tabs}>
                        <Grid
                            container
                            direction="column"
                            css={theme => ({ padding: theme.spacing(3) })}
                        >
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs>
                                    <InputField placeholder={"Поиск ..."} fullWidth />
                                </Grid>
                                <Grid item xs={2}>
                                    <SelectField placeholder={"Выберите регион"} fullWidth />
                                </Grid>
                                <Grid item xs={2}>
                                    <SelectField placeholder={"Выберите филиал"} fullWidth />
                                </Grid>
                            </Grid>
                            <Grid item css={theme => ({ padding: theme.spacing(3) })}>
                                <TableWrapper columns={columns} data={data} />
                            </Grid>
                        </Grid>
                    </TabsWrapper>
                </Grid>
            </Paper>
        </SectionLayout>
    );
};
