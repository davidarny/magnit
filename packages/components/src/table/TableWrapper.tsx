/** @jsx jsx */

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
    id: string;
    label: string;
    sortable?: boolean;
}

interface ITableWrapperProps {
    columns: IColumn[];
    data: object[];

    onRowClick?(row?: object): void;
}

export const TableWrapper: React.FC<ITableWrapperProps> = ({ columns, data, ...props }) => {
    return (
        <React.Fragment>
            <Table>
                <TableHeader headers={columns} />
                <TableBodyWrapper data={data} columns={columns} onRowClick={props.onRowClick} />
            </Table>
            <TablePagination
                component="div"
                count={data.length}
                page={0}
                rowsPerPage={15}
                labelDisplayedRows={PaginationLabel}
                ActionsComponent={ActionComponent}
                labelRowsPerPage={""}
                SelectProps={{ style: { display: "none" } }}
                onChangePage={_.noop}
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
                            ":nth-of-type(1)": {
                                display: "none",
                            },
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
                                        color: theme.colors.secondary,
                                        background: theme.colors.white,
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
                            ":nth-of-type(1)": {
                                display: "none",
                            },
                            ":nth-of-type(2)": {
                                display: "block",
                                marginRight: "auto",
                                width: "calc(100% / 2)",
                                span: {
                                    display: "block",
                                },
                            },
                        },
                    },
                })}
            />
        </React.Fragment>
    );
};

interface IActionComponentProps {
    count: number;
    rowsPerPage: number;
}

const ActionComponent: React.FC<IActionComponentProps> = ({ count, rowsPerPage }) => {
    const range = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

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
            {_.range(1, range).map((page, index) => (
                <Grid item key={index}>
                    <IconButton
                        css={theme => ({
                            width: theme.spacing(4),
                            height: theme.spacing(4),
                            fontSize: theme.fontSize.normal,
                            color: theme.colors.secondary,
                            background: theme.colors.white,
                        })}
                    >
                        {page}
                    </IconButton>
                </Grid>
            ))}
            <Grid item>
                <IconButton
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
    count: number;
}

const PaginationLabel: React.FC<IPaginationLabelProps> = ({ from, count }) => {
    return <span>{`${from} из ${count}`}</span>;
};
