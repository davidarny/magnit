/** @jsx jsx */
import { TableWrapper, IColumn } from "@magnit/components";
import { Typography } from "@material-ui/core";
import * as React from "react";
import { jsx } from "@emotion/core";

const columns: IColumn[] = [
    { key: "number", label: "№" },
    { key: "name", label: "Название шаблона" },
    { key: "createdAt", label: "Дата добавления" },
    { key: "correctionCount", label: "Количество правок" },
];

export interface IReport {
    number: number;
    name: string;
    createdAt: string;
    correctionCount: number;
}

interface IProps {
    reportTableData: IReport[];
}

export const TaskReportItem: React.FC<IProps> = props => {
    return (
        <React.Fragment>
            <Typography
                component="div"
                css={theme => ({
                    fontSize: theme.fontSize.larger,
                    marginBottom: theme.spacing(2),
                })}
            >
                Подготовка технического плана (18.05.2019 - 25.05.2019)
            </Typography>
            <div
                css={theme => ({
                    color: theme.colors.gray,
                    fontSize: theme.fontSize.normal,
                    marginBottom: theme.spacing(),
                })}
            >
                <b
                    css={() => ({
                        fontWeight: 500,
                    })}
                >
                    Исполнитель:
                </b>{" "}
                Рукастый Иннокентий Петрович
            </div>

            <TableWrapper columns={columns} data={props.reportTableData} />
        </React.Fragment>
    );
};
