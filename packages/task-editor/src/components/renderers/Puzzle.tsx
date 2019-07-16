/** @jsx jsx */

import * as React from "react";
import _ from "lodash";
import { Grid, Typography } from "@material-ui/core";
import { EPuzzleType } from "@magnit/services";
import { jsx } from "@emotion/core";
import { getPuzzleFactory } from "services/item";

interface IPuzzleRendererProps {
    puzzle: object;
    last?: boolean;
}

export const PuzzleRenderer: React.FC<IPuzzleRendererProps> = ({ puzzle, last = false }) => {
    return (
        <Grid
            container
            direction="column"
            spacing={2}
            css={theme => ({ marginTop: theme.spacing(3), position: "relative" })}
        >
            <Grid item>
                <Grid container spacing={2}>
                    <Grid item>
                        {!last && (
                            <div
                                css={theme => ({
                                    width: theme.spacing(0.25),
                                    height: "100%",
                                    background: theme.colors.lightGray,
                                    position: "absolute",
                                    top: theme.spacing(4),
                                    left: "20px", // TODO: dynamic calculation
                                    zIndex: 1,
                                })}
                            />
                        )}
                        <div
                            css={theme => ({
                                width: theme.spacing(3),
                                height: theme.spacing(3),
                                borderRadius: "50%",
                                border: `2px solid ${theme.colors.primary}`,
                                zIndex: 2,
                                position: "relative",
                                background: theme.colors.white,
                            })}
                        />
                    </Grid>
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                color: theme.colors.secondary,
                            })}
                        >
                            {_.get(puzzle, "title")}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item css={theme => ({ marginLeft: theme.spacing(5) })}>
                <Grid container direction="column" spacing={1}>
                    {_.get(puzzle, "puzzles", []).map((puzzle: object, index: number) => {
                        const puzzleType = _.get(puzzle, "puzzleType") as EPuzzleType;
                        const factory = getPuzzleFactory(puzzleType);
                        return factory.create({ index, puzzle });
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
};
