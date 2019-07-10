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
    canSort?: boolean;
}

interface ITableWrapperProps {
    columns: IColumn[];
    data: object[];

    onRowClick?(): void;
}

export const TableWrapper: React.FC<ITableWrapperProps> = ({ columns, data }) => {
    return (
        <React.Fragment>
            <Table>
                <TableHeader headers={columns} />
                <TableBodyWrapper data={data} columns={columns} />
            </Table>
            <TablePagination
                component="div"
                count={data.length}
                page={0}
                rowsPerPage={20}
                labelDisplayedRows={PaginationLabel}
                ActionsComponent={ActionComponent}
                labelRowsPerPage={""}
                SelectProps={{ style: { display: "none" } }}
                onChangePage={_.noop}
                css={theme => ({
                    width: "100%",
                    marginTop: theme.spacing(2),
                    position: "relative",
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
                        width: theme.spacing(6),
                        height: theme.spacing(6),
                        fontSize: theme.fontSize.normal,
                        marginLeft: theme.spacing(2),
                    })}
                >
                    <LeftArrowIcon />
                </IconButton>
            </Grid>
            {_.range(1, range).map((page, index) => (
                <Grid item key={index}>
                    <IconButton
                        css={theme => ({
                            width: theme.spacing(6),
                            height: theme.spacing(6),
                            fontSize: theme.fontSize.normal,
                        })}
                    >
                        {page}
                    </IconButton>
                </Grid>
            ))}
            <Grid item>
                <IconButton
                    css={theme => ({
                        width: theme.spacing(6),
                        height: theme.spacing(6),
                        fontSize: theme.fontSize.normal,
                        marginRight: theme.spacing(2),
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
    return (
        <span
            css={css`
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            `}
        >{`${from} из ${count}`}</span>
    );
};
