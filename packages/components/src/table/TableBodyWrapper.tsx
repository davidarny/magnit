/** @jsx jsx */

import { FC } from "react";
import { TableBody, TableCell, TableRow } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IColumn } from "./TableWrapper";
import * as _ from "lodash";

interface ITableBodyWrapperProps {
    data: object[];
    columns: IColumn[];
    hover?: boolean;

    onRowClick?(row?: object): void;
}

export const TableBodyWrapper: FC<ITableBodyWrapperProps> = props => {
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
                            const label = _.get(value, column.key, "");

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
                                    {label || "(не задано)"}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                );
            })}
        </TableBody>
    );
};
