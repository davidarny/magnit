/** @jsx jsx */

import * as React from "react";
import { SelectableBlockWrapper } from "components/block";
import { jsx } from "@emotion/core";
import { IPuzzle } from "entities";
import { EPuzzleType } from "components/puzzle";
import { ContentItem } from "./ContentItem";
import { ContentConditions } from "./ContentConditions";
import _ from "lodash";

interface IContentGroupProps {
    index: number;
    puzzle: IPuzzle;
    parentPuzzle?: IPuzzle;

    isFocused(id: string): boolean;

    onFocus(id: string): void;

    onBlur(event: React.SyntheticEvent): void;
}

export const ContentGroup: React.FC<IContentGroupProps> = props => {
    const { isFocused, puzzle, parentPuzzle } = props;

    function onFocus(): void {
        props.onFocus(puzzle.id);
    }

    const focused = isFocused(puzzle.id);
    const isGroup = puzzle.puzzleType === EPuzzleType.GROUP;
    const hasBorder = !focused && isGroup;

    return (
        <SelectableBlockWrapper
            onFocus={onFocus}
            onMouseDown={onFocus}
            onBlur={props.onBlur}
            focused={focused}
            css={theme => ({
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                zIndex: focused ? 1300 : 0,
            })}
        >
            <div
                css={theme => ({
                    paddingLeft: !!parentPuzzle ? theme.spacing(4) : 0,
                    paddingTop: theme.spacing(),
                    paddingBottom: theme.spacing(),
                    borderTop: hasBorder ? `1px dashed ${theme.colors.gray}` : "none",
                    borderBottom: hasBorder ? `1px dashed ${theme.colors.gray}` : "none",
                })}
            >
                <ContentItem
                    puzzle={puzzle}
                    parentPuzzle={parentPuzzle}
                    index={props.index}
                    active={focused}
                    onFocus={onFocus}
                    onBlur={props.onBlur}
                />
                {puzzle.puzzles.map((childPuzzle, index) => {
                    if (childPuzzle.puzzleType === EPuzzleType.QUESTION) {
                        return (
                            <ContentGroup
                                key={childPuzzle.id}
                                puzzle={childPuzzle}
                                onFocus={props.onFocus}
                                onBlur={props.onBlur}
                                isFocused={isFocused}
                                index={props.index + index}
                                parentPuzzle={childPuzzle}
                            />
                        );
                    }
                    return (
                        <ContentItem
                            puzzle={childPuzzle}
                            index={props.index + index}
                            active={focused}
                            onFocus={onFocus}
                            onBlur={props.onBlur}
                            key={childPuzzle.id}
                            parentPuzzle={puzzle}
                        />
                    );
                })}
                <ContentConditions
                    puzzleId={puzzle.id}
                    focused={focused}
                    puzzleType={puzzle.puzzleType}
                    answerType={_.get(_.head(puzzle.puzzles), "puzzleType")}
                />
            </div>
        </SelectableBlockWrapper>
    );
};
