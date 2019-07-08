/** @jsx jsx */

import { FC } from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IColumn } from "./TableWrapper";

interface ITableHeaderProps {
    headers: IColumn[];
}

export const TableHeader: FC<ITableHeaderProps> = ({ headers }) => {
    return (
        <TableHead>
            <TableRow>
                {headers.map(header => (
                    <TableCell key={header.id}>
                        <TableSortLabel>{header.label}</TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};
