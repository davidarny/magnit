/** @jsx jsx */

import { jsx } from "@emotion/core";
import { TableBody as MaterialTableBody } from "@material-ui/core";
import React from "react";
import { IColumn, ITableDataItem } from "./Table";
import { TableRow } from "./TableRow";

interface ITableBodyProps {
    data: ITableDataItem[];
    columns: IColumn[];
    hover?: boolean;
    selectable?: boolean;

    renderMenuItems?(row: ITableDataItem, onMenuClose: () => void): React.ReactNode;

    onRowClick?(row: ITableDataItem): void;

    onRowSelectToggle?(row: ITableDataItem, selected: boolean): void;
}

export const TableBody: React.FC<ITableBodyProps> = props => {
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
        <MaterialTableBody>
            {data.map((value, index) => (
                <TableRow
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
        </MaterialTableBody>
    );
};

TableBody.displayName = "TableBody";
