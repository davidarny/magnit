/** @jsx jsx */

import * as React from "react";
import { SelectableBlockWrapper } from "@magnit/components";
import { jsx } from "@emotion/core";
import { IPuzzle } from "entities";
import { EPuzzleType } from "@magnit/services";
import { ItemFactory } from "components/item";
import { ConditionsWrapper } from "components/conditions";
import _ from "lodash";

interface IContentGroupProps {
    index: number;
    puzzle: IPuzzle;
    parentPuzzle?: IPuzzle;

    isFocused(id: string): boolean;

    onFocus(id: string): void;

    onBlur(event: React.SyntheticEvent): void;
}

export const GroupOfItems: React.FC<IContentGroupProps> = props => {
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
                <ItemFactory
                    puzzle={puzzle}
                    parentPuzzle={parentPuzzle}
                    index={props.index}
                    active={focused}
                    onFocus={onFocus}
                    onBlur={props.onBlur}
                />
                {isGroup && (
                    <ConditionsWrapper
                        puzzleId={puzzle.id}
                        conditions={puzzle.conditions}
                        validations={puzzle.validations}
                        focused={focused}
                        puzzleType={puzzle.puzzleType}
                        answerType={_.get(_.head(puzzle.puzzles), "puzzleType")}
                    />
                )}
                {(puzzle.puzzles || []).map((childPuzzle, index) => {
                    if (childPuzzle.puzzleType === EPuzzleType.QUESTION) {
                        return (
                            <GroupOfItems
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
                        <ItemFactory
                            deep={childPuzzle.puzzleType === EPuzzleType.REFERENCE_ANSWER}
                            puzzle={childPuzzle}
                            index={index}
                            active={focused}
                            onFocus={onFocus}
                            onBlur={props.onBlur}
                            key={childPuzzle.id}
                            parentPuzzle={puzzle}
                        />
                    );
                })}
                {!isGroup && (
                    <ConditionsWrapper
                        puzzleId={puzzle.id}
                        conditions={puzzle.conditions}
                        validations={puzzle.validations}
                        focused={focused}
                        puzzleType={puzzle.puzzleType}
                        answerType={_.get(_.head(puzzle.puzzles), "puzzleType")}
                    />
                )}
            </div>
        </SelectableBlockWrapper>
    );
};
