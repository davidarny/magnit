/** @jsx jsx */

import { jsx } from "@emotion/core";
import { TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core";
import { Checkbox } from "checkbox";
import React, { useCallback } from "react";
import { IColumn } from "./TableWrapper";

interface ITableHeaderProps {
    selectable?: boolean;
    headers: IColumn[];
    allSelected?: boolean;

    onSelectToggle?(selected: boolean): void;
}

export const TableHeader: React.FC<ITableHeaderProps> = props => {
    const { headers, selectable = false, onSelectToggle, allSelected = false } = props;

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
                {headers.map((header, index) => (
                    <TableCell
                        key={header.key}
                        css={theme => ({ borderBottomColor: theme.colors.light })}
                    >
                        {selectable && index === 0 && (
                            <Checkbox
                                css={({ spacing }) => ({ marginRight: spacing() })}
                                checked={allSelected}
                                onChange={onSelectToggleCallback}
                            />
                        )}
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

TableHeader.displayName = "TableHeader";
