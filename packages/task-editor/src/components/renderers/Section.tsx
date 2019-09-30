/** @jsx jsx */

import { jsx } from "@emotion/core";
import { ButtonLikeText } from "@magnit/components";
import { EPuzzleType, IAnswer, IPuzzle, ISection } from "@magnit/entities";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useCallback, useState } from "react";
import { PuzzleRenderer } from "./Puzzle";

interface ISectionRendererProps {
    index: number;
    section: ISection;
    answers?: IAnswer[];
}

export const SectionRenderer: React.FC<ISectionRendererProps> = ({ index, section, answers }) => {
    const [collapsed, setCollapsed] = useState(false);

    const onCollapsedToggleCallback = useCallback((): void => {
        setCollapsed(!collapsed);
    }, [collapsed]);

    return (
        <Grid
            container
            direction="column"
            spacing={2}
            css={theme => ({ marginTop: theme.spacing(4) })}
        >
            <Grid item css={{ position: "relative" }}>
                <Typography
                    component="span"
                    css={theme => ({
                        fontSize: theme.fontSize.large,
                        fontWeight: 500,
                    })}
                >
                    Раздел {index + 1}.
                </Typography>
                <Typography
                    component="span"
                    css={theme => ({
                        fontSize: theme.fontSize.large,
                        marginLeft: theme.spacing(),
                    })}
                >
                    {section.title}
                </Typography>
                <ButtonLikeText
                    css={theme => ({
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: theme.spacing(4),
                    })}
                    onClick={onCollapsedToggleCallback}
                >
                    {collapsed ? "Развернуть" : "Свернуть"} раздел
                </ButtonLikeText>
            </Grid>
            {!collapsed && (
                <Grid item>
                    {(section.puzzles || [])
                        .reduce<IPuzzle[]>((puzzles, puzzle) => {
                            if (puzzle.puzzleType !== EPuzzleType.GROUP) {
                                return [...puzzles, puzzle];
                            }
                            puzzles.push(...puzzle.puzzles);
                            return [...puzzles];
                        }, [])
                        .map((puzzle, index, array) => {
                            const last = index === array.length - 1;
                            const isAnswerOfPuzzle = (answer: IAnswer) =>
                                answer.idPuzzle === puzzle.id;
                            return (
                                <PuzzleRenderer
                                    answers={(answers || []).filter(isAnswerOfPuzzle)}
                                    key={puzzle.id}
                                    puzzle={puzzle}
                                    last={last}
                                />
                            );
                        })}
                </Grid>
            )}
        </Grid>
    );
};

SectionRenderer.displayName = "SectionRenderer";
