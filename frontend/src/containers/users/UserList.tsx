/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IColumn, Table } from "@magnit/components";
import { Grid, Paper } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import { EmptyList } from "components/list";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { AppContext } from "context";
import { useUsers } from "hooks";
import { useContext } from "react";

const columns: IColumn[] = [
    { key: "fullName", label: "ФИО исполнителя", sortable: false },
    { key: "email", label: "Эл. почта", sortable: false },
];

export interface IUserListProps extends RouteComponentProps {}

export const UserList: React.FC<IUserListProps> = () => {
    const context = useContext(AppContext);

    const users = useUsers(context.courier);

    const empty = !users.length;

    return (
        <SectionLayout>
            <SectionTitle title="Список исполнителей" />
            {empty && <EmptyList title="Исполнителей нет" />}
            {!empty && (
                <Paper
                    square={true}
                    css={({ spacing, boxShadow }) => ({
                        margin: spacing(3),
                        boxShadow: boxShadow.paper,
                    })}
                >
                    <Grid
                        container
                        direction="row"
                        css={theme => ({ marginTop: theme.spacing(2) })}
                    >
                        <Grid xs={12} item css={theme => ({ padding: theme.spacing(3) })}>
                            <Table
                                columns={columns}
                                data={users.map(user => ({
                                    ...user,
                                    fullName: `${user.firstName} ${user.lastName}`,
                                }))}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </SectionLayout>
    );
};

UserList.displayName = "UserList";
