/** @jsx jsx */

import * as React from "react";
import { Grid, Table, TablePagination } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { TableHeader } from "./TableHeader";
import { TableBodyWrapper } from "./TableBodyWrapper";
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
                labelRowsPerPage={""}
                SelectProps={{ style: { display: "none" } }}
                onChangePage={_.noop}
                css={css`
                    width: 100%;
                `}
            />
        </React.Fragment>
    );
};

interface IPaginationLabelProps {
    from: number;
    count: number;
}

const PaginationLabel: React.FC<IPaginationLabelProps> = ({ from, count }) => {
    return <span>{`${from} из ${count}`}</span>;
};
