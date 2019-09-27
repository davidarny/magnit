/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EPuzzleType, IAnswer, IPuzzle } from "@magnit/entities";
import { CheckIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { getPuzzleFactory } from "services/item";

interface IPuzzleRendererProps {
    puzzle: IPuzzle;
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
                            {puzzle.title}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item css={theme => ({ marginLeft: theme.spacing(5) })}>
                <Grid container direction="column" spacing={1}>
                    {(puzzle.puzzles || [])
                        .filter(puzzle =>
                            // when answer exists ...
                            answer
                                ? // ... filter only those which have answer ...
                                  answer.answerType === EPuzzleType.RADIO_ANSWER ||
                                  answer.answerType === EPuzzleType.CHECKBOX_ANSWER ||
                                  answer.answerType === EPuzzleType.DROPDOWN_ANSWER
                                    ? answer.answer === puzzle.id
                                    : true
                                : // ... or just render
                                  true,
                        )
                        .map((puzzle, index) => {
                            let answerType: EPuzzleType | null = null;
                            if (answer) {
                                answerType = answer.answerType;
                            } else {
                                answerType = puzzle.puzzleType;
                            }
                            console.log("answer", answer, puzzle, answerType);
                            if (!answerType) {
                                return null;
                            }
                            const factory = getPuzzleFactory(answerType);
                            return factory.create({ index, puzzle, answer });
                        })
                        .filter(Boolean)}
                </Grid>
            </Grid>
        </Grid>
    );
};

PuzzleRenderer.displayName = "PuzzleRenderer";
