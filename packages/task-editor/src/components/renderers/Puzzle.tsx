/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EPuzzleType, IAnswer, IPuzzle } from "@magnit/entities";
import { CheckIcon, InfoIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { PuzzleAnswerRenderer } from "./Answer";

interface IPuzzleRendererProps {
    puzzle: IPuzzle;
    last?: boolean;
    answers: IAnswer[];
}

export const PuzzleRenderer: React.FC<IPuzzleRendererProps> = props => {
    const { puzzle, last = false, answers } = props;

    const reference = puzzle.puzzles.some(
        child => child.puzzleType === EPuzzleType.REFERENCE_ANSWER,
    );
    const upload = answers.some(answer => answer.answerType === EPuzzleType.UPLOAD_FILES);

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
                                background: answers.length
                                    ? theme.colors.primary
                                    : theme.colors.white,
                                color: reference
                                    ? theme.colors.primary
                                    : answers.length
                                    ? theme.colors.white
                                    : "initial",
                            })}
                        >
                            {!!answers.length && <CheckIcon />}
                            {reference && <InfoIcon />}
                        </div>
                    </Grid>
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                color: theme.colors.secondary,
                            })}
                        >
                            {puzzle.title}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item css={theme => ({ marginLeft: theme.spacing(5) })}>
                <Grid container direction="column" spacing={2}>
                    <PuzzleAnswerRenderer
                        reference={reference}
                        upload={upload}
                        answers={answers}
                        puzzle={puzzle}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

PuzzleRenderer.displayName = "PuzzleRenderer";
