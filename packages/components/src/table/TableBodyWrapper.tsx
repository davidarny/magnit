/** @jsx jsx */

import { TableBody, TableCell, TableRow } from "@material-ui/core";
import { jsx } from "@emotion/core";
import React from "react";
import { IColumn } from "./TableWrapper";
import * as _ from "lodash";

interface ITableBodyWrapperProps {
    data: object[];
    columns: IColumn[];
    hover?: boolean;

    onRowClick?(row?: object): void;
}

export const TableBodyWrapper: React.FC<ITableBodyWrapperProps> = props => {
    const { data, columns, hover = true, onRowClick } = props;

    return (
        <TableBody>
            {data.map((value, index) => {
                function onClick() {
                    if (onRowClick) {
                        onRowClick(value);
                    }
                }

                return (
                    <TableRow hover={hover} key={index} onClick={onClick}>
                        {columns.map((column: IColumn, index) => {
                            let label = _.get(value, column.key, null);
                            if (typeof label !== "undefined" && label !== null) {
                                label = label.toString();
                            }

                            return (
                                <TableCell
                                    key={index}
                                    css={theme => ({
                                        borderBottomColor: theme.colors.light,
                                        color: theme.colors.black,
                                        fontSize: theme.fontSize.sNormal,
                                        fontWeight: 400,
                                        lineHeight: 1.5,
                                        cursor: hover ? "pointer" : "inherit",
                                    })}
                                    title={label}
                                >
                                    {!!label ? label : "(не задано)"}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                );
            })}
        </TableBody>
    );
};
