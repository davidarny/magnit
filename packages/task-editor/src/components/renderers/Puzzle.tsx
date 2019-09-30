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
    answers: IAnswer[];
}

export const PuzzleRenderer: React.FC<IPuzzleRendererProps> = props => {
    const { puzzle, last = false, answers } = props;

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
                                color: answers.length ? theme.colors.white : "initial",
                            })}
                        >
                            {!!answers.length && <CheckIcon />}
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
                    {answers
                        .map((answer, index) => {
                            const isAnswerPuzzle = (puzzle: IPuzzle) => {
                                switch (answer.answerType) {
                                    case EPuzzleType.CHECKBOX_ANSWER:
                                    case EPuzzleType.DROPDOWN_ANSWER:
                                    case EPuzzleType.RADIO_ANSWER:
                                        return answer.answer === puzzle.id;
                                    default:
                                        return true;
                                }
                            };
                            const answerPuzzle = puzzle.puzzles.find(isAnswerPuzzle);
                            if (!answerPuzzle) {
                                return null;
                            }
                            const factory = getPuzzleFactory(answer.answerType);
                            return factory.create({
                                index,
                                puzzle: answerPuzzle,
                                answer,
                            });
                        })
                        .filter(Boolean)}
                </Grid>
            </Grid>
        </Grid>
    );
};

PuzzleRenderer.displayName = "PuzzleRenderer";
