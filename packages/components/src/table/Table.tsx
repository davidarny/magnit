/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    Table as MaterialTable,
    TablePagination as MaterialTablePagination,
} from "@material-ui/core";
import * as React from "react";
import { useCallback } from "react";
import { PaginationLabel } from "./PaginationLabel";
import { TableBody } from "./TableBody";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";
import { getSortedData, getSortingNumber } from "./utils";

export interface ITableDataItem {
    [key: string]: any;
    selected?: boolean;
}

export interface IColumn {
    key: string;
    label: string;
    sortable?: boolean;
}

interface ITableWrapperProps {
    columns: IColumn[];
    data: ITableDataItem[];
    page?: number;
    order?: "asc" | "desc";
    orderBy?: string;
    rowsPerPage?: number;
    pagination?: boolean;
    hover?: boolean;
    selectable?: boolean;
    sort?: boolean;

    renderMenuItems?(row: ITableDataItem, onMenuClose: () => void): React.ReactNode;

    onRowClick?(row: ITableDataItem): void;

    onSelectToggle?(selected: boolean): void;

    onRequestSort?(sort: "asc" | "desc", sortBy: string): void;

    onRowSelectToggle?(row: ITableDataItem, selected: boolean): void;

    onChangePage?(nextPage: number): void;
}

export const Table: React.FC<ITableWrapperProps> = props => {
    const {
        columns,
        data,
        page = 0,
        order = "asc",
        orderBy = "",
        rowsPerPage = 10,
        pagination = true,
        hover = true,
        selectable = false,
        sort = false,
        onRowClick,
        onRowSelectToggle,
        onSelectToggle,
        onRequestSort,
        onChangePage,
        renderMenuItems,
        ...rest
    } = props;

    const onRequestSortCallback = useCallback(
        (event: unknown, nextOrderBy: string) => {
            const isDesc = orderBy === nextOrderBy && order === "desc";
            const nextOrder = isDesc ? "asc" : "desc";
            if (onRequestSort) {
                onRequestSort(nextOrder, nextOrderBy);
            }
        },
        [onRequestSort, order, orderBy],
    );

    const onChangePageCallback = useCallback(
        (event: unknown, nextPage: number) => {
            if (onChangePage) {
                onChangePage(nextPage);
            }
        },
        [onChangePage],
    );

    return (
        <React.Fragment>
            <MaterialTable {...rest}>
                <TableHeader
                    numSelected={data.filter(item => item.selected).length}
                    rowCount={data.length}
                    selectable={selectable}
                    headers={columns}
                    order={order}
                    orderBy={orderBy}
                    onSelectToggle={onSelectToggle}
                    onRequestSort={onRequestSortCallback}
                />
                <TableBody
                    renderMenuItems={renderMenuItems}
                    data={
                        // currently pagination work only in client side
                        // need to implement server side in future
                        pagination
                            ? sort
                                ? getSortedData(data, getSortingNumber(order, orderBy)).slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage,
                                  )
                                : data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : data
                    }
                    selectable={selectable}
                    columns={columns}
                    hover={hover}
                    onRowClick={onRowClick}
                    onRowSelectToggle={onRowSelectToggle}
                />
            </MaterialTable>
            {pagination && (
                <MaterialTablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    labelDisplayedRows={PaginationLabel}
                    ActionsComponent={TablePagination}
                    // disable default labels
                    labelRowsPerPage=""
                    SelectProps={{ style: { display: "none" } }}
                    onChangePage={onChangePageCallback}
                    // this css seems to be very complex
                    // would be nice to refactor
                    css={theme => ({
                        width: "100%",
                        marginTop: theme.spacing(2),
                        position: "relative",
                        display: "flex",
                        border: "none",
                        div: {
                            paddingLeft: 0,
                            width: "100%",
                            div: {
                                ":nth-of-type(1)": { display: "none" },
                                ":nth-of-type(3)": {
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    div: {
                                        display: "flex",
                                        width: theme.spacing(4),
                                        height: theme.spacing(4),
                                        marginLeft: theme.spacing(),
                                        button: {
                                            display: "flex",
                                            margin: "0 0 0 auto",
                                            padding: 0,
                                            width: "100%",
                                            transition: "0.25s",
                                            span: {
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
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
                                ":nth-of-type(1)": { display: "none" },
                                ":nth-of-type(2)": {
                                    display: "block",
                                    marginRight: "auto",
                                    width: "calc(100% / 2)",
                                    span: { display: "block" },
                                },
                            },
                        },
                    })}
                />
            )}
        </React.Fragment>
    );
};

Table.displayName = "Table";
