/** @jsx jsx */

import { jsx } from "@emotion/core";
import { TableCell, TableSortLabel } from "@material-ui/core";
import React, { useCallback } from "react";
import { Checkbox } from "checkbox";
import { IColumn } from "./Table";

interface ITableCellProps {
    index: number;
    selectable?: boolean;
    header: IColumn;
    order?: "asc" | "desc";
    orderBy?: string;
    rowCount: number;
    numSelected: number;

    onSelectToggle?(checked: boolean): void;

    onRequestSort?(event: React.MouseEvent<unknown>, property: string): void;
}

export const TableHeaderCell: React.FC<ITableCellProps> = props => {
    const {
        index,
        header,
        onRequestSort,
        orderBy,
        order,
        rowCount,
        numSelected,
        selectable,
        onSelectToggle,
    } = props;

    const onSortClick = useCallback(
        (event: React.MouseEvent<unknown>) => {
            if (onRequestSort) {
                onRequestSort(event, header.key);
            }
        },
        [header.key, onRequestSort],
    );

    const onSelectToggleCallback = useCallback(
        (event: unknown, checked: boolean) => {
            if (onSelectToggle) {
                onSelectToggle(checked);
            }
        },
        [onSelectToggle],
    );

    return (
        <TableCell
            key={header.key}
            css={theme => ({ borderBottomColor: theme.colors.light })}
            sortDirection={orderBy === header.key ? order : false}
        >
            {selectable && index === 0 && (
                <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    css={({ spacing }) => ({ marginRight: spacing(), padding: 0 })}
                    checked={numSelected !== 0 && rowCount !== 0 && numSelected === rowCount}
                    onChange={onSelectToggleCallback}
                />
            )}
            <TableSortLabel
                active={orderBy === header.key}
                direction={order}
                hideSortIcon={!header.sortable}
                css={theme => ({
                    fontSize: theme.fontSize.sNormal,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    color: theme.colors.secondary,
                    transitionDuration: "0.25s",
                    transitionProperty: "color",
                    ":hover": { color: theme.colors.black },
                })}
                onClick={onSortClick}
            >
                {header.label}
            </TableSortLabel>
        </TableCell>
    );
};

TableHeaderCell.displayName = "TableHeaderCell";
