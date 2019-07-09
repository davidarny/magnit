/** @jsx jsx */

import { Table, TablePagination, Grid, IconButton } from "@material-ui/core";
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

function tablePaginationActions(props: TablePaginationActionsProps): ReactElement {
    const countPages = Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1);
    return (
        <Grid container alignItems={"flex-end"}>
            {_.range(1, countPages).map((page, index) => (
                <Grid item key={index}>
                    <IconButton>{page}</IconButton>
                </Grid>
            ))}
        </Grid>
    );
}

export const TableWrapper: FC<ITableWrapperProps> = ({ columns, data }) => {
    return (
        <Fragment>
            <Table>
                <TableHeader headers={columns} />
                <TableBodyWrapper data={data} columns={columns} />
            </Table>
            <TablePagination
                count={data.length}
                page={0}
                rowsPerPage={20}
                onChangePage={(event, page) => void 0}
                labelDisplayedRows={({ from, to, count }) => (
                    <Grid container xs>{`${from} из ${count}`}</Grid>
                )}
                labelRowsPerPage={""}
                SelectProps={{
                    style: { display: "none" },
                }}
                ActionsComponent={tablePaginationActions}
                style={{
                    width: "100%",
                }}
            />
        </Fragment>
    );
};
