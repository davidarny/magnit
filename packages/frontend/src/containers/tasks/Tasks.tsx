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

const data: object[] = [
    { title: "aaa", region: "12313", address: "1111", step: 1 },
    { title: "aaa", region: "12313", address: "1111", step: 2 },
    { title: "aaa", region: "12313", address: "1111", step: 3 },
];

export const Tasks: React.FC<RouteComponentProps> = () => {
    const hasTableItems = !!data.length;
    return (
        <SectionLayout>
            <SectionTitle title="Список заданий">
                <Grid item hidden={!hasTableItems}>
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
            {!hasTableItems && (
                <EmptyList
                    title={"Заданий нет"}
                    actionName={"Создать задание"}
                    button={
                        <CustomButton
                            component={Link}
                            to="/tasks/create"
                            icon={<AddIcon />}
                            title={"Создать задание"}
                            css={css`
                                width: 180px;
                            `}
                        />
                    }
                    description={"Для создания задания нажмите кнопку"}
                />
            )}

            {hasTableItems && (
                <Paper
                    square={true}
                    css={theme => ({
                        margin: theme.spacing(3),
                        boxShadow: `0px 0px ${theme.spacing(2)} #ced9e2 !important`,
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
            )}
        </SectionLayout>
    );
};
