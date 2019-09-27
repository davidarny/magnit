/** @jsx jsx */

import { jsx } from "@emotion/core";
import { TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core";
import { Checkbox } from "checkbox";
import React, { useCallback } from "react";
import { IColumn } from "./TableWrapper";

interface ITableHeaderProps {
    selectable?: boolean;
    headers: IColumn[];
    order?: "asc" | "desc";
    orderBy?: string;
    rowCount?: number;
    numSelected?: number;

    onSelectToggle?(selected: boolean): void;

    onRequestSort?(event: React.MouseEvent<unknown>, property: string): void;
}

export const TableHeader: React.FC<ITableHeaderProps> = props => {
    const {
        headers,
        selectable = false,
        order,
        orderBy,
        rowCount = 0,
        numSelected = 0,
        onSelectToggle,
        onRequestSort,
    } = props;

    return (
        <TableHead>
            <TableRow>
                {headers.map((header, index) => (
                    <TableHeaderCell
                        key={header.key}
                        index={index}
                        header={header}
                        selectable={selectable}
                        order={order}
                        orderBy={orderBy}
                        rowCount={rowCount}
                        numSelected={numSelected}
                        onSelectToggle={onSelectToggle}
                        onRequestSort={onRequestSort}
                    />
                ))}
            </TableRow>
        </TableHead>
    );
};

TableHeader.displayName = "TableHeader";

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

const TableHeaderCell: React.FC<ITableCellProps> = props => {
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
