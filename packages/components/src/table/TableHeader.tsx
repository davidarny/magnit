/** @jsx jsx */

import { jsx } from "@emotion/core";
import { TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { IColumn } from "./Table";
import { TableHeaderCell } from "./TableHeaderCell";

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
