/** @jsx jsx */

import { Grid, IconButton, Table, TablePagination } from "@material-ui/core";
import { FC, Fragment, ReactElement } from "react";
import { jsx } from "@emotion/core";
import { TableHeader } from "./TableHeader";
import { TableBodyWrapper } from "./TableBodyWrapper";
import { TablePaginationActionsProps } from "@material-ui/core/TablePagination/TablePaginationActions";
import * as _ from "lodash";

export interface IColumn {
    id: string;
    label: string;
    canSort?: boolean;
}

interface ITableWrapperProps {
    columns: IColumn[];
    data: object[];

    onRowClick?(): void;
}

export const TableWrapper: FC<ITableWrapperProps> = ({ columns, data }) => {
    return (
        <Fragment>
            <Table>
                <TableHeader headers={columns}/>
                <TableBodyWrapper data={data} columns={columns}/>
            </Table>
            <TablePagination
                count={data.length}
                page={0}
                rowsPerPage={15}
                onChangePage={(event, page) => void 0}
                labelDisplayedRows={({ from, to, count }) => (
                    <Grid container xs>{`${from} из ${count}`}</Grid>
                )}
                labelRowsPerPage={""}
                SelectProps={{
                    style: { display: "none" },
                }}
                ActionsComponent={tablePaginationActions}
                css={theme => ({
                    width: "100%",
                    display: "flex",
                    border: "none",
                    div: {
                        paddingLeft: 0,
                        width: "100%",
                        div: {
                            ":nth-of-type(1)": {
                                display: "none",
                            },
                            ":nth-of-type(3)": {
                                display: "flex",
                                justifyContent: "flex-end",
                                div: {
                                    display: "flex",
                                    width: 32,
                                    height: 32,
                                    marginLeft: 8,
                                    button: {
                                        display: "flex",
                                        margin: "0 0 0 auto",
                                        padding: 0,
                                        width: "100%",
                                        color: theme.colors.secondary,
                                        background: theme.colors.white,
                                        transition: "0.25s",
                                        span: {
                                            display: "block",
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            textAlign: "center",
                                            width: "100%",
                                        },
                                        ":hover, :active": {
                                            color: theme.colors.white,
                                            background: theme.colors.primary,
                                        },
                                    },
                                },
                            },
                        },
                        span: {
                            ":nth-of-type(1)": {
                                display: "none",
                            },
                            ":nth-of-type(2)": {
                                display: "block",
                                marginRight: "auto",
                                width: "calc(100% / 2)",
                                div: {
                                    display: "block",
                                },
                            },
                        },
                    },
                })}
            />
        </Fragment>
    );
};

function tablePaginationActions(props: TablePaginationActionsProps): ReactElement {
    const countPages = Math.max(0, Math.ceil(props.count / props.rowsPerPage));
    const isOnlyPage = countPages === 1;
    return (
        <Grid
            container
            alignItems="flex-end"
            css={theme => ({
                marginLeft: "auto",
                width: "calc(100% / 2)",
                display: `${isOnlyPage ? "none" : "flex"} !important`,
            })}
        >
            {_.range(0, countPages).map((page, index) => (
                <Grid item key={index}>
                    <IconButton
                        css={theme => ({
                            color: `${
                                props.page === page ? theme.colors.white : theme.colors.secondary
                                } !important`,
                            background: `${
                                props.page === page ? theme.colors.primary : theme.colors.white
                                } !important`,
                        })}
                    >
                        {page + 1}
                    </IconButton>
                </Grid>
            ))}
        </Grid>
    );
}
