/** @jsx jsx */

import { FC } from "react";
import { TableBody, TableCell, TableRow } from "@material-ui/core";
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
            return (
                <TableCell
                    key={index}
                    css={theme => ({
                        borderBottomColor: theme.colors.light,
                        color: theme.colors.black,
                        fontSize: 14,
                        fontWeight: 400,
                        lineHeight: 1.5,
                        cursor: "pointer",
                    })}
                    title={value}
                >
                    {value}
                </TableCell>
            );
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
