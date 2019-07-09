/** @jsx jsx */

import { FC } from "react";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IColumn } from "./TableWrapper";
import * as _ from "lodash";

interface ITableBodyWrapperProps {
    data: object[];
    columns: IColumn[];
}

export const TableBodyWrapper: FC<ITableBodyWrapperProps> = ({ data, columns }) => {
    const getCells = (lineItem: object) => {
        return columns.map((column: IColumn, index) => {
            const label = _.get(lineItem, column.id, null);
            const value = !_.isNull(label) ? label : "(не задано)";
            return <TableCell key={index}>{value}</TableCell>;
        });
    };

    return (
        <TableBody>
            {data.map((value, index) => (
                <TableRow hover key={index}>
                    {getCells(value)}
                </TableRow>
            ))}
        </TableBody>
    );
};
