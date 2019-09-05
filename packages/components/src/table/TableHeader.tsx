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
    const { headers, selectable = false, order, orderBy, rowCount = 0, numSelected = 0 } = props;
    const { onSelectToggle, onRequestSort } = props;

    const onSelectToggleCallback = useCallback(
        (event: unknown, checked: boolean) => {
            if (onSelectToggle) {
                onSelectToggle(checked);
            }
        },
        [onSelectToggle],
    );

    return (
        <TableHead>
            <TableRow>
                {headers.map((header, index) => {
                    function onSortClick(event: React.MouseEvent<unknown>) {
                        if (onRequestSort) {
                            onRequestSort(event, header.key);
                        }
                    }

                    return (
                        <TableCell
                            key={header.key}
                            css={theme => ({ borderBottomColor: theme.colors.light })}
                            sortDirection={orderBy === header.key ? order : false}
                        >
                            {selectable && index === 0 && (
                                <Checkbox
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    css={({ spacing }) => ({ marginRight: spacing() })}
                                    checked={
                                        numSelected !== 0 &&
                                        rowCount !== 0 &&
                                        numSelected === rowCount
                                    }
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
                })}
            </TableRow>
        </TableHead>
    );
};

TableHeader.displayName = "TableHeader";
