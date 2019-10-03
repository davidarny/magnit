/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    Grid,
    IconButton,
    Table,
    TablePagination as MaterialTablePagination,
} from "@material-ui/core";
import {
    KeyboardArrowLeft as LeftArrowIcon,
    KeyboardArrowRight as RightArrowIcon,
} from "@material-ui/icons";
import * as _ from "lodash";
import * as React from "react";
import { useCallback } from "react";
import { TableBodyWrapper } from "./TableBodyWrapper";
import { TableHeader } from "./TableHeader";

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

export const TableWrapper: React.FC<ITableWrapperProps> = props => {
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
            <Table {...rest}>
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
                <TableBodyWrapper
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
            </Table>
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

TableWrapper.displayName = "TableWrapper";

interface ITablePaginationProps {
    count: number;
    page: number;
    rowsPerPage: number;

    onChangePage(event: React.MouseEvent<HTMLButtonElement> | null, page: number): void;
}

const TablePagination: React.FC<ITablePaginationProps> = props => {
    const { count, page, rowsPerPage, onChangePage } = props;

    // some stuff to correctly calculate
    // left & right offsets when changing page
    const range = {
        offsets: {
            start: 1,
            end: 2,
        },

        get start() {
            if (page === Math.ceil(count / rowsPerPage) - 1) {
                this.offsets.start++;
            }
            return Math.max(0, page - this.offsets.start);
        },

        get end() {
            if (page === 0) {
                this.offsets.end++;
            }
            return Math.max(0, Math.min(page + this.offsets.end, Math.ceil(count / rowsPerPage)));
        },
    };

    function onBackButtonClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        onChangePage(event, page - 1);
    }

    function onNextButtonClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        onChangePage(event, page + 1);
    }

    function onActionButtonClick(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        page: number,
    ) {
        onChangePage(event, page);
    }

    return (
        <Grid
            container
            alignItems="center"
            css={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: 0,
                width: "auto",
            }}
        >
            <Grid item>
                <IconButton
                    onClick={onBackButtonClick}
                    disabled={page === 0}
                    css={theme => ({
                        width: theme.spacing(4),
                        height: theme.spacing(4),
                        marginLeft: theme.spacing(2),
                        svg: {
                            width: theme.spacing(3),
                            height: theme.spacing(3),
                        },
                    })}
                >
                    <LeftArrowIcon />
                </IconButton>
            </Grid>
            {_.range(range.start, range.end).map((action, index) => (
                <Grid item key={index}>
                    <IconButton
                        onClick={event => onActionButtonClick(event, action)}
                        disabled={action === page}
                        css={theme => ({
                            width: theme.spacing(4),
                            height: theme.spacing(4),
                            fontSize: theme.fontSize.normal,
                            color:
                                (action === page ? theme.colors.white : theme.colors.secondary) +
                                " !important",
                            background:
                                (action === page ? theme.colors.primary : theme.colors.white) +
                                " !important",
                        })}
                    >
                        {action + 1}
                    </IconButton>
                </Grid>
            ))}
            <Grid item>
                <IconButton
                    onClick={onNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    css={theme => ({
                        width: theme.spacing(4),
                        height: theme.spacing(4),
                        marginRight: theme.spacing(2),
                        svg: {
                            width: theme.spacing(3),
                            height: theme.spacing(3),
                        },
                    })}
                >
                    <RightArrowIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};

TablePagination.displayName = "TablePagination";

interface IPaginationLabelProps {
    from: number;
    to: number;
    count: number;
    page: number;
}

const PaginationLabel: React.FC<IPaginationLabelProps> = ({ from, count, to }) => {
    return <span>{`${from} - ${to} из ${count}`}</span>;
};

PaginationLabel.displayName = "PaginationLabel";

// these function can be used
// if server side sorting is not available

function desc<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getSortedData<T>(array: T[], cmp: (a: T, b: T) => number) {
    const stabilized = array.map((el, index) => [el, index] as [T, number]);
    stabilized.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilized.map(el => el[0]);
}

function getSortingNumber<K extends string>(
    order: "asc" | "desc",
    orderBy: K,
): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
    return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}
