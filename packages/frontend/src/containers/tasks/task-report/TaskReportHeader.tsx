/** @jsx jsx */
import { SelectableBlockWrapper } from "@magnit/components";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { jsx } from "@emotion/core";

interface IProps {
    fields: Array<{
        title: string;
        text: string;
        colWidth?: number;
    }>;
}

export const TaskReportHeader: React.FC<IProps> = props => {
    return (
        <SelectableBlockWrapper>
            <Grid css={theme => ({ padding: theme.spacing(4) })}>
                <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                    Хардкорное задание для суровых прорабов
                </Typography>

                <Grid
                    container
                    spacing={2}
                    justify={"space-between"}
                    css={theme => ({ marginTop: theme.spacing(2) })}
                >
                    {props.fields.map((field, fieldKey) => (
                        <Grid item xs={12} md={"auto"} key={fieldKey}>
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
