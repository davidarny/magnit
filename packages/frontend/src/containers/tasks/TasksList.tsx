/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { Grid, Paper } from "@material-ui/core";
import * as React from "react";
import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import {
    Button,
    IColumn,
    InputField,
    ITab,
    SelectField,
    TableWrapper,
    TabsWrapper,
} from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { EmptyList } from "components/list";
import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { getTasks } from "services/api";
import { AppContext } from "context";
import { ETaskStatus } from "@magnit/services";

const tabs: ITab[] = [
    { value: ETaskStatus.IN_PROGRESS, label: "В работе" },
    { value: ETaskStatus.ON_CHECK, label: "На проверке" },
    { value: ETaskStatus.DRAFT, label: "Черновики" },
    { value: ETaskStatus.COMPLETED, label: "Завершенные" },
];

const columns: IColumn[] = [
    { key: "name", label: "Название задания" },
    { key: "description", label: "Описание задания" },
    { key: "deadlineDate", label: "Срок выполнения" },
    { key: "createdAt", label: "Дата создания" },
    { key: "updatedAt", label: "Дата последнего обновления" },
];

type TRouteProps = { "*": string };

export const TasksList: React.FC<RouteComponentProps<TRouteProps>> = props => {
    const tab = props["*"];
    const context = useContext(AppContext);
    const [tasks, setTasks] = useState<object[]>([]);

    useEffect(() => {
        getTasks(context.courier, getTaskStatusByTab(tab))
            .then(response => setTasks(response.tasks))
            .catch(console.error);
    }, [context.courier, tab]);

    const [redirect, setRedirect] = useState({ redirect: false, to: "" });

    function onRowClick(row?: object) {
        if (!_.isObject(row) || !_.has(row, "id")) {
            return;
        }
        setRedirect({ redirect: true, to: _.get(row, "id") });
    }

    const empty = !tasks.length;

    return (
        <SectionLayout>
            {redirect.redirect && <Redirect to={`tasks/view/${redirect.to}`} noThrow />}
            <SectionTitle title="Список заданий">
                <Grid item hidden={empty}>
                    <Button
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
                        <Button
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
                    css={({ spacing, ...theme }) => ({
                        margin: spacing(3),
                        boxShadow: `0 0 ${spacing(2)} ${theme.colors.lightGray} !important`,
                    })}
                >
                    <Grid
                        container
                        direction="row"
                        css={theme => ({ marginTop: theme.spacing(2) })}
                    >
                        <TabsWrapper tabs={tabs}>
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
                                            css={({ spacing, ...theme }) => ({
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
                                                    padding: `${spacing(2)} ${spacing(4)}`,
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
                                    <TableWrapper
                                        columns={columns}
                                        data={tasks}
                                        onRowClick={onRowClick}
                                    />
                                </Grid>
                            </Grid>
                        </TabsWrapper>
                    </Grid>
                </Paper>
            )}
        </SectionLayout>
    );
};

function getTaskStatusByTab(tab?: string): ETaskStatus {
    if (!tab) {
        return ETaskStatus.IN_PROGRESS;
    }
    return (tab as unknown) as ETaskStatus;
}
