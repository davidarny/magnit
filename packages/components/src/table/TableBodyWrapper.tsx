/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IconButton, Menu, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { Checkbox } from "checkbox";
import * as _ from "lodash";
import React, { useCallback, useRef, useState } from "react";
import { IColumn, ITableDataItem } from "./TableWrapper";

interface ITableBodyWrapperProps {
    data: ITableDataItem[];
    columns: IColumn[];
    hover?: boolean;
    selectable?: boolean;

    renderMenuItems?(row: ITableDataItem, onMenuClose: () => void): React.ReactNode;

    onRowClick?(row: ITableDataItem): void;

    onRowSelectToggle?(row: ITableDataItem, selected: boolean): void;
}

export const TableBodyWrapper: React.FC<ITableBodyWrapperProps> = props => {
    const {
        data,
        columns,
        hover = true,
        selectable = false,
        onRowSelectToggle,
        onRowClick,
        renderMenuItems,
    } = props;

    return (
        <TableBody>
            {data.map((value, index) => (
                <TableRowWrapper
                    selectable={selectable}
                    key={index}
                    value={value}
                    columns={columns}
                    hover={hover}
                    renderMenuItems={renderMenuItems}
                    onRowClick={onRowClick}
                    onRowSelect={onRowSelectToggle}
                />
            ))}
        </TableBody>
    );
};

TableBodyWrapper.displayName = "TableBodyWrapper";

interface ITableRowWrapperProps {
    value: ITableDataItem;
    columns: IColumn[];
    hover: boolean;
    selectable: boolean;

    renderMenuItems?(row: ITableDataItem, onMenuClose: () => void): React.ReactNode;

    onRowClick?(row: ITableDataItem): void;

    onRowSelect?(row: ITableDataItem, selected: boolean): void;
}

const TableRowWrapper: React.FC<ITableRowWrapperProps> = props => {
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
        <React.Fragment>
            <TableRow ref={row} hover={hover} onClick={onClickCallback}>
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
            </TableRow>
        </React.Fragment>
    );
};

TableRowWrapper.displayName = "TableRowWrapper";
