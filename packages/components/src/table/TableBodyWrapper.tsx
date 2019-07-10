/** @jsx jsx */

import { FC } from "react";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IColumn } from "./TableWrapper";
import * as _ from "lodash";

interface ITableBodyWrapperProps {
    data: object[];
    columns: IColumn[];

    onRowClick?(): void;
}

export const TableBodyWrapper: FC<ITableBodyWrapperProps> = ({ data, columns, onRowClick }) => {
    return (
        <TableBody>
            {data.map((value, index) => (
                <TableRow hover key={index} onClick={onRowClick}>
                    {columns.map((column: IColumn, index) => {
                        const label = _.get(value, column.id, null);
                        return (
                            <TableCell key={index}>
                                {!_.isNull(label) ? label : "(не задано)"}
                            </TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </TableBody>
    );
};
