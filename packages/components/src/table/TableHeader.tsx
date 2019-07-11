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
                    <TableCell
                        key={header.id}
                        css={theme => ({ borderBottomColor: theme.colors.light })}
                    >
                        <TableSortLabel
                            hideSortIcon={!header.sortable}
                            css={theme => ({
                                fontSize: theme.fontSize.sNormal,
                                lineHeight: 1.5,
                                fontWeight: 500,
                                color: theme.colors.secondary,
                                transition: "0.25s",
                                ":hover": { color: theme.colors.black },
                            })}
                        >
                            {header.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};
