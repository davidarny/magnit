/** @jsx jsx */

import { jsx } from "@emotion/core";
import { TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { Checkbox } from "checkbox";
import * as _ from "lodash";
import React, { useCallback } from "react";
import { IColumn, ITableDataItem } from "./TableWrapper";

interface ITableBodyWrapperProps {
    data: ITableDataItem[];
    columns: IColumn[];
    hover?: boolean;
    selectable?: boolean;

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

    onRowClick?(row: ITableDataItem): void;

    onRowSelect?(row: ITableDataItem, selected: boolean): void;
}

const TableRowWrapper: React.FC<ITableRowWrapperProps> = props => {
    const { value, columns, hover, selectable, onRowClick, onRowSelect } = props;

    const onClickCallback = useCallback(() => {
        if (onRowClick) {
            onRowClick(value);
        }
    }, [value, onRowClick]);

    const onSelectedChange = useCallback(
        (event: unknown, checked: boolean) => {
            if (onRowSelect) {
                onRowSelect(value, checked);
            }
        },
        [onRowSelect, value],
    );

    return (
        <TableRow hover={hover} onClick={onClickCallback}>
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
        </TableRow>
    );
};

TableRowWrapper.displayName = "TableRowWrapper";
