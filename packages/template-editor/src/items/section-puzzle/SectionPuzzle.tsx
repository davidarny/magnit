/** @jsx jsx */

import * as React from "react";
import { Fragment } from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    title: string;
    focused: boolean;
    description: string;
}

export const SectionPuzzle: React.FC<ISectionPuzzleProps> = ({
    title,
    description,
    index,
    focused,
    children,
}) => {
    return (
        <Fragment>
            <Grid
                container
                alignItems="flex-end"
                justify="center"
                spacing={2}
                css={theme => ({
                    paddingLeft: theme.spacing(4),
                    paddingRight: theme.spacing(4),
                    position: "relative",
                })}
                style={{
                    paddingBottom: 10,
                }}
            >
                <Grid
                    item
                    css={{
                        position: "absolute",
                        top: 10,
                        left: 30,
                    }}
                >
                    <Typography
                        style={{
                            fontSize: 26,
                        }}
                    >
                        Раздел {index + 1}.
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs
                    css={{ marginLeft: "130px !important" }}
                >
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
        </Fragment>
    );
};
