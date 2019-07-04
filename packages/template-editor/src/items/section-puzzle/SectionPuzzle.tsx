/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    title: string;
    focused: boolean;
    description: string;
}

export const SectionPuzzle: React.FC<ISectionPuzzleProps> = props => {
    const { title, description, index, focused, children } = props;
    return (
        <React.Fragment>
            <Grid
                container
                alignItems="flex-end"
                justify="center"
                spacing={2}
                css={theme => ({
                    paddingLeft: theme.spacing(4),
                    paddingRight: theme.spacing(4),
                    paddingBottom: theme.spacing(2),
                    position: "relative",
                })}
            >
                <Grid
                    item
                    css={theme => ({
                        position: "absolute",
                        top: theme.spacing(),
                        left: theme.spacing(4),
                    })}
                >
                    <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                        Раздел {index + 1}.
                    </Typography>
                </Grid>
                <Grid item xs css={theme => ({ marginLeft: `${theme.spacing(16)} !important` })}>
                    <Grid
                        item
                        css={theme => ({
                            paddingLeft: theme.spacing(4),
                            paddingRight: theme.spacing(4),
                        })}
                    >
                        <InputField
                            fullWidth={true}
                            placeholder="Название раздела"
                            defaultValue={title}
                            isSimpleMode={!focused}
                            InputProps={{
                                style: {
                                    fontSize: 26,
                                    fontWeight: 500,
                                },
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        css={theme => ({
                            paddingLeft: theme.spacing(4),
                            paddingRight: theme.spacing(4),
                            paddingTop: theme.spacing(2),
                        })}
                    >
                        <InputField
                            fullWidth={true}
                            placeholder="Описание раздела (необязательно)"
                            defaultValue={description}
                            isSimpleMode={!focused}
                            InputProps={{
                                style: {
                                    fontSize: 18,
                                    fontWeight: 300,
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="column">
                {children}
            </Grid>
        </React.Fragment>
    );
};
