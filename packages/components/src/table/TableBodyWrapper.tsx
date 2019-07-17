/** @jsx jsx */

import { FC } from "react";
import { TableBody, TableCell, TableRow } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IColumn } from "./TableWrapper";
import * as _ from "lodash";

interface ITableBodyWrapperProps {
    data: object[];
    columns: IColumn[];

    onRowClick?(row?: object): void;
}

export const TableBodyWrapper: FC<ITableBodyWrapperProps> = ({ data, columns, ...props }) => {
    return (
        <TableBody>
            {data.map((value, index) => (
                <TableRow
                    hover
                    key={index}
                    onClick={() => props.onRowClick && props.onRowClick(value)}
                >
                    {columns.map((column: IColumn, index) => {
                        const label = _.get(value, column.key, null);
                        return (
                            <TableCell
                                key={index}
                                css={theme => ({
                                    borderBottomColor: theme.colors.light,
                                    color: theme.colors.black,
                                    fontSize: theme.fontSize.sNormal,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                    cursor: "pointer",
                                })}
                                title={label}
                            >
                                {!_.isNull(label) ? label : "(не задано)"}
                            </TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </TableBody>
    );
};
