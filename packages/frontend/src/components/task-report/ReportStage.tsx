/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IColumn, TableWrapper } from "@magnit/components";
import { getFriendlyDate } from "@magnit/services";
import { Typography } from "@material-ui/core";
import * as React from "react";
import { IReportStageTemplate } from "services/api/tasks";

const columns: IColumn[] = [
    { key: "index", label: "№" },
    { key: "title", label: "Название шаблона" },
    { key: "createdAt", label: "Дата добавления" },
    { key: "version", label: "Количество правок" },
];

interface ITaskStageProps {
    title: string;
    deadline: string;
    templates: IReportStageTemplate[];
}

export const ReportStage: React.FC<ITaskStageProps> = props => {
    const transformedTemplateData = props.templates.map((template, templateIndex) => ({
        selected: false,
        index: templateIndex + 1,
        title: template.title,
        createdAt: getFriendlyDate(new Date(template.createdAt)),
        version: template.version,
    }));

    return (
        <React.Fragment>
            <Typography
                component="div"
                css={theme => ({
                    fontSize: theme.fontSize.larger,
                    marginBottom: theme.spacing(2),
                })}
            >
                {props.title} ({getFriendlyDate(new Date(props.deadline))})
            </Typography>
            <div
                css={theme => ({
                    color: theme.colors.gray,
                    fontSize: theme.fontSize.normal,
                    marginBottom: theme.spacing(),
                })}
            >
                <span css={{ fontWeight: 500 }}>Исполнитель:</span> Рукастый Иннокентий Петрович
            </div>
            <TableWrapper
                hover={false}
                pagination={false}
                columns={columns}
                data={transformedTemplateData}
            />
        </React.Fragment>
    );
};
