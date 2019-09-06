/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { ButtonLikeText } from "@magnit/components";
import { EPuzzleType, IAnswer } from "@magnit/entities";
import { Grid, Typography } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { useState } from "react";
import { PuzzleRenderer } from "./Puzzle";

interface ISectionRendererProps {
    index: number;
    section: object;
    answers?: IAnswer[];
}

export const SectionRenderer: React.FC<ISectionRendererProps> = ({ index, section, answers }) => {
    const [collapsed, setCollapsed] = useState(false);

    function onCollapsedToggle(): void {
        setCollapsed(!collapsed);
    }

    return (
        <Grid
            container
            direction="column"
            spacing={2}
            css={theme => ({ marginTop: theme.spacing(4) })}
        >
            <Grid
                item
                css={css`
                    position: relative;
                `}
            >
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
                    {_.get(section, "title")}
                </Typography>
                <ButtonLikeText
                    css={theme => ({
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: theme.spacing(4),
                    })}
                    onClick={onCollapsedToggle}
                >
                    {collapsed ? "Развернуть" : "Свернуть"} раздел
                </ButtonLikeText>
            </Grid>
            {!collapsed && (
                <Grid item>
                    {_.get(section, "puzzles", [])
                        .reduce((puzzles: object[], puzzle: object) => {
                            const puzzleType = _.get(puzzle, "puzzleType") as EPuzzleType;
                            if (puzzleType !== EPuzzleType.GROUP) {
                                return [...puzzles, puzzle];
                            }
                            const children = _.get(puzzle, "puzzles", []);
                            puzzles.push(...children);
                            return [...puzzles];
                        }, [])
                        .map((puzzle: object, index: number, array: object[]) => {
                            const puzzleId = _.get(puzzle, "id");
                            const last = index === array.length - 1;
                            const answer = (answers || []).find(
                                answer => answer.idPuzzle === puzzleId,
                            );
                            return (
                                <PuzzleRenderer
                                    answer={answer}
                                    key={puzzleId}
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
