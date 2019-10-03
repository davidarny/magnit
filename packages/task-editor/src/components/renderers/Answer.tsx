/** @jsx jsx */

import { jsx } from "@emotion/core";
import { ButtonLikeText } from "@magnit/components";
import { EPuzzleType, IAnswer, IPuzzle } from "@magnit/entities";
import { Grid } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { useState } from "react";
import { getPuzzleFactory } from "services/item";

interface IPuzzleAnswerProps {
    reference: boolean;
    upload: boolean;
    answers: IAnswer[];
    puzzle: IPuzzle;
}

export const PuzzleAnswerRenderer: React.FC<IPuzzleAnswerProps> = props => {
    const { reference, puzzle, answers, upload } = props;

    const [open, setOpen] = useState(!upload);

    function onOpenClick() {
        setOpen(!open);
    }

    return (
        <React.Fragment>
            {upload && (
                <Grid item xs={12}>
                    <ButtonLikeText
                        css={theme => ({ fontSize: theme.fontSize.normal })}
                        onClick={onOpenClick}
                    >
                        {answers.length} файл(а)
                        <ArrowDropDown
                            css={theme => ({
                                transform: open ? "rotate(-180deg)" : "none",
                                color: theme.colors.secondary,
                                verticalAlign: "bottom",
                            })}
                        />
                    </ButtonLikeText>
                </Grid>
            )}
            {open && (
                <React.Fragment>
                    {reference &&
                        getPuzzleFactory(EPuzzleType.REFERENCE_ANSWER).create({
                            index: 0,
                            puzzle: _.first(puzzle.puzzles)!,
                        })}
                    {answers
                        .map((answer, index) => {
                            const isAnswerPuzzle = (puzzle: IPuzzle) => {
                                switch (answer.answerType) {
                                    case EPuzzleType.CHECKBOX_ANSWER:
                                    case EPuzzleType.DROPDOWN_ANSWER:
                                    case EPuzzleType.RADIO_ANSWER:
                                    case EPuzzleType.REFERENCE_ANSWER:
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
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

PuzzleAnswerRenderer.displayName = "PuzzleAnswerRenderer";
