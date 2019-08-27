/** @jsx jsx */
import { SelectableBlockWrapper } from "@magnit/components";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { jsx } from "@emotion/core";

interface IProps {
    fields: Array<{
        title: string;
        text: string;
    }>;
}

export const TaskReportHeader: React.FC<IProps> = props => {
    return (
        <SelectableBlockWrapper>
            <Grid css={theme => ({ padding: theme.spacing(4) })}>
                <Typography css={theme => ({ fontSize: theme.fontSize.xLarge })}>
                    Хардкорное задание для суровых прорабов
                </Typography>

                <Grid
                    container
                    spacing={2}
                    justify={"space-between"}
                    css={theme => ({ marginTop: theme.spacing(2) })}
                >
                    {props.fields.map((field, fieldKey) => (
                        <Grid item xs={12} md={2} key={fieldKey}>
                            <Grid
                                css={theme => ({
                                    color: theme.colors.gray,
                                    fontSize: theme.fontSize.small,
                                    marginBottom: theme.spacing(1),
                                })}
                            >
                                {field.title}
                            </Grid>
                            <Grid css={theme => ({ fontSize: theme.fontSize.smaller })}>
                                {field.text}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </SelectableBlockWrapper>
    );
};
