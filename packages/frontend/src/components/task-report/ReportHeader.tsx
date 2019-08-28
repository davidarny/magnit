/** @jsx jsx */

import { SelectableBlockWrapper } from "@magnit/components";
import { getFriendlyDate } from "@magnit/services";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { jsx } from "@emotion/core";
import { EReportStatuses, IReportResponse } from "services/api/tasks";

interface IReportHeaderProps {
    report: IReportResponse;
    title: string;
}

const reportStatusTranslations = {
    [EReportStatuses.IN_PROGRESS]: "В работе",
    [EReportStatuses.ON_CHECK]: "На проверке",
    [EReportStatuses.DRAFT]: "Draft",
    [EReportStatuses.COMPLETED]: "Завершен",
};

export const ReportHeader: React.FC<IReportHeaderProps> = props => {
    const headers = [
        {
            title: "АДМИНИСТРАТОР",
            text: "Терещенко Геннадий Владимирович",
        },
        {
            title: "МЕСТОПОЛОЖЕНИЕ",
            text: "Челябинская область, Челябинск, улица Железная, 5",
        },
        {
            title: "ФОРМАТ ОБЪЕКТА",
            text: "МК",
        },
        {
            title: "ДАТА СОЗДАНИЯ",
            text: getFriendlyDate(new Date(props.report.createdAt)),
        },
        {
            title: "СТАТУС",
            text: reportStatusTranslations[props.report.status],
        },
    ];

    return (
        <SelectableBlockWrapper>
            <Grid css={theme => ({ padding: theme.spacing(4) })}>
                <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                    {props.title}
                </Typography>

                <Grid
                    container
                    spacing={2}
                    justify="space-between"
                    css={theme => ({ marginTop: theme.spacing(2) })}
                >
                    {headers.map((field, fieldKey) => (
                        <Grid item xs={12} md="auto" key={fieldKey}>
                            <Grid
                                css={theme => ({
                                    color: theme.colors.gray,
                                    fontSize: theme.fontSize.sNormal,
                                    marginBottom: theme.spacing(1),
                                })}
                            >
                                {field.title}
                            </Grid>
                            <Grid css={theme => ({ fontSize: theme.fontSize.normal })}>
                                {field.text}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </SelectableBlockWrapper>
    );
};
