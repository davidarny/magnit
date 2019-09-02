/** @jsx jsx */

import { css, jsx } from "@emotion/core";
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
import { useState } from "react";
import { TableBodyWrapper } from "./TableBodyWrapper";
import { TableHeader } from "./TableHeader";

export interface ITableDataItem {
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
    initialPage?: number;
    rowsPerPage?: number;
    showPagination?: boolean;
    rowHover?: boolean;
    selectable?: boolean;
    allSelected?: boolean;

    onRowClick?(row: ITableDataItem): void;

    onSelectToggle?(selected: boolean): void;

    onRowSelectToggle?(row: ITableDataItem, selected: boolean): void;
}

export const TableWrapper: React.FC<ITableWrapperProps> = props => {
    const {
        columns,
        data,
        initialPage = 0,
        rowsPerPage = 10,
        showPagination = true,
        rowHover = true,
        selectable = false,
        allSelected = false,
    } = props;
    const { onRowClick, onRowSelectToggle, onSelectToggle } = props;

    const [page, setPage] = useState(initialPage);

    function onChangePage(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number,
    ) {
        setPage(newPage);
    }
    return (
        <React.Fragment>
            <Table>
                <TableHeader
                    allSelected={allSelected}
                    selectable={selectable}
                    headers={columns}
                    onSelectToggle={onSelectToggle}
                />
                <TableBodyWrapper
                    data={
                        showPagination
                            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : data
                    }
                    selectable={selectable}
                    columns={columns}
                    hover={rowHover}
                    onRowClick={onRowClick}
                    onRowSelectToggle={onRowSelectToggle}
                />
            </Table>
            {showPagination && (
                <MaterialTablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    labelDisplayedRows={PaginationLabel}
                    ActionsComponent={TablePagination}
                    labelRowsPerPage=""
                    SelectProps={{ style: { display: "none" } }}
                    onChangePage={onChangePage}
                    // TODO: refactor
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
            css={css`
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 0;
                width: auto;
            `}
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
