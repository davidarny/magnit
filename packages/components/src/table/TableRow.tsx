/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    IconButton,
    Menu,
    TableCell,
    TableRow as MaterialTableRow,
    Typography,
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import * as _ from "lodash";
import React, { useCallback, useRef, useState } from "react";
import { Checkbox } from "checkbox";
import { IColumn, ITableDataItem } from "./Table";

interface ITableRowProps {
    value: ITableDataItem;
    columns: IColumn[];
    hover: boolean;
    selectable: boolean;

    renderMenuItems?(row: ITableDataItem, onMenuClose: () => void): React.ReactNode;

    onRowClick?(row: ITableDataItem): void;

    onRowSelect?(row: ITableDataItem, selected: boolean): void;
}

export const TableRow: React.FC<ITableRowProps> = props => {
    const { value, columns, hover, selectable, onRowClick, onRowSelect, renderMenuItems } = props;

    // dot menu
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);

    const row = useRef<HTMLTableRowElement | null>(null);

    const onClickCallback = useCallback(
        (event: React.MouseEvent<HTMLTableRowElement>) => {
            const target = event.target as Node;
            if (!row.current || !row.current.contains(target)) {
                return;
            }
            if (onRowClick) {
                onRowClick(value);
            }
        },
        [value, onRowClick],
    );

    const onSelectedChange = useCallback(
        (event: unknown, checked: boolean) => {
            if (onRowSelect) {
                onRowSelect(value, checked);
            }
        },
        [onRowSelect, value],
    );

    function onMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        setMenuAnchorElement(event.currentTarget);
    }

    function onMenuClose() {
        setMenuAnchorElement(null);
    }

    return (
        <MaterialTableRow ref={row} hover={hover} onClick={onClickCallback}>
            {columns.map((column: IColumn, index) => {
                let label = _.get(value, column.key, null);

                if (typeof label !== "undefined" && label !== null) {
                    label = label.toString();
                }

                return (
                    <TableCell
                        key={index}
                        css={({ colors }) => ({
                            borderBottomColor: colors.light,
                            color: colors.black,
                            cursor: hover ? "pointer" : "inherit",
                        })}
                        title={label}
                    >
                        {selectable && index === 0 && (
                            <Checkbox
                                css={({ spacing }) => ({ marginRight: spacing(), padding: 0 })}
                                checked={!!value.selected}
                                onChange={onSelectedChange}
                                onClick={event => event.stopPropagation()}
                            />
                        )}
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.normal,
                                fontWeight: 400,
                                lineHeight: 1.5,
                            })}
                            component="span"
                        >
                            {!!label ? label : "(не задано)"}
                        </Typography>
                    </TableCell>
                );
            })}
            <TableCell
                align="right"
                css={({ colors }) => ({
                    padding: 0,
                    borderBottomColor: colors.light,
                    color: colors.black,
                    cursor: hover ? "pointer" : "inherit",
                })}
            >
                {renderMenuItems && (
                    <React.Fragment>
                        <IconButton
                            css={theme => ({ padding: theme.spacing() })}
                            onClick={onMenuClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            open={Boolean(menuAnchorElement)}
                            anchorEl={menuAnchorElement}
                            onClose={onMenuClose}
                        >
                            {renderMenuItems(value, onMenuClose)}
                        </Menu>
                    </React.Fragment>
                )}
            </TableCell>
        </MaterialTableRow>
    );
};

TableRow.displayName = "TableRow";
