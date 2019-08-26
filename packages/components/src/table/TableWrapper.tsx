/** @jsx jsx */

import { useState } from "react";
import * as React from "react";
import { Grid, IconButton, Table, TablePagination } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { TableHeader } from "./TableHeader";
import { TableBodyWrapper } from "./TableBodyWrapper";
import * as _ from "lodash";
import {
    KeyboardArrowLeft as LeftArrowIcon,
    KeyboardArrowRight as RightArrowIcon,
} from "@material-ui/icons";

export interface IColumn {
    key: string;
    label: string;
    sortable?: boolean;
}

interface ITableWrapperProps {
    columns: IColumn[];
    data: object[];
    initialPage?: number;
    rowsPerPage?: number;

    onRowClick?(row?: object): void;
}

export const TableWrapper: React.FC<ITableWrapperProps> = ({ columns, data, ...props }) => {
    const { initialPage = 0, rowsPerPage = 10 } = props;

    const [page, setPage] = useState(initialPage);

    function onChangePage(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number,
    ) {
        setPage(newPage);
    }
    const isShowPagination = data.length > rowsPerPage;

    return (
        <React.Fragment>
            <Table>
                <TableHeader headers={columns} />
                <TableBodyWrapper
                    data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                    columns={columns}
                    onRowClick={props.onRowClick}
                />
            </Table>
            {isShowPagination && (
                <TablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    labelDisplayedRows={PaginationLabel}
                    ActionsComponent={ActionComponent}
                    labelRowsPerPage=""
                    SelectProps={{ style: { display: "none" } }}
                    onChangePage={onChangePage}
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

interface IActionComponentProps {
    count: number;
    page: number;
    rowsPerPage: number;

    onChangePage(event: React.MouseEvent<HTMLButtonElement> | null, page: number): void;
}

const ActionComponent: React.FC<IActionComponentProps> = props => {
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

interface IPaginationLabelProps {
    from: number;
    to: number;
    count: number;
    page: number;
}

const PaginationLabel: React.FC<IPaginationLabelProps> = ({ from, count, to }) => {
    return <span>{`${from} - ${to} из ${count}`}</span>;
};
