/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EPuzzleType, IAnswer } from "@magnit/entities";
import { CheckIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { getPuzzleFactory } from "services/item";

interface IPuzzleRendererProps {
    puzzle: object;
    last?: boolean;
    answer?: IAnswer;
}

export const PuzzleRenderer: React.FC<IPuzzleRendererProps> = props => {
    const { puzzle, last = false, answer } = props;

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
                                    left: "20.5px", // TODO: dynamic calculation
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
                                background: answer ? theme.colors.primary : theme.colors.white,
                                color: answer ? theme.colors.white : "initial",
                            })}
                        >
                            {answer && <CheckIcon />}
                        </div>
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
                    {_.get(puzzle, "puzzles", [])
                        .filter((puzzle: object) =>
                            answer ? answer.answer === _.get(puzzle, "title") : true,
                        )
                        .map((puzzle: object, index: number) => {
                            const puzzleType = _.get(puzzle, "puzzleType") as EPuzzleType;
                            const factory = getPuzzleFactory(puzzleType);
                            return factory.create({ index, puzzle });
                        })}
                </Grid>
            </Grid>
        </Grid>
    );
};
