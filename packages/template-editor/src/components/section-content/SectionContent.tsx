/** @jsx jsx */

import { jsx } from "@emotion/core";
import { SelectableBlockWrapper } from "@magnit/components";
import { EPuzzleType, IPuzzle, ISection } from "@magnit/entities";
import { ConditionsWrapper } from "components/conditions";
import { ItemFactory } from "components/item-factory";
import _ from "lodash";
import * as React from "react";
import { useCallback } from "react";

interface IGroupOfItemsProps {
    index: number;
    puzzle: IPuzzle;
    parent: IPuzzle | ISection;

    isFocused(id: string): boolean;

    onFocus(id: string): void;
}

export const SectionContent: React.FC<IGroupOfItemsProps> = props => {
    const { puzzle, parent, isFocused, onFocus } = props;

    const isSection = (object: unknown): object is ISection => !_.has(object, "puzzleType");

    const onFocusCallback = useCallback((): void => {
        onFocus(puzzle.id);
    }, [onFocus, puzzle.id]);

    const focused = isFocused(puzzle.id);
    const isGroup = puzzle.puzzleType === EPuzzleType.GROUP;
    const hasBorder = !focused && isGroup;

    return (
        <SelectableBlockWrapper
            onFocus={onFocusCallback}
            onMouseDown={onFocusCallback}
            focused={focused}
            css={theme => ({
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                zIndex: focused ? 1300 : 0,
            })}
        >
            <div
                css={theme => ({
                    paddingLeft: !!parent && !isSection(parent) ? theme.spacing(4) : 0,
                    paddingTop: theme.spacing(),
                    paddingBottom: theme.spacing(),
                    borderTop: hasBorder ? `1px dashed ${theme.colors.gray}` : "none",
                    borderBottom: hasBorder ? `1px dashed ${theme.colors.gray}` : "none",
                })}
            >
                <ItemFactory
                    puzzle={puzzle}
                    parent={parent}
                    index={props.index}
                    active={focused}
                    onFocus={onFocusCallback}
                />
                {isGroup && (
                    <ConditionsWrapper
                        alwaysVisible
                        puzzle={puzzle}
                        parent={parent}
                        focused={focused}
                        answerType={_.get(_.head(puzzle.puzzles), "puzzleType")}
                    />
                )}
                {(puzzle.puzzles || []).map((childPuzzle, index) => {
                    if (childPuzzle.puzzleType === EPuzzleType.QUESTION) {
                        return (
                            <SectionContent
                                key={childPuzzle.id}
                                puzzle={childPuzzle}
                                onFocus={onFocus}
                                isFocused={isFocused}
                                index={props.index + index}
                                parent={
                                    puzzle.puzzleType === EPuzzleType.GROUP ? puzzle : childPuzzle
                                }
                            />
                        );
                    }
                    return (
                        <ItemFactory
                            key={childPuzzle.id}
                            deep={childPuzzle.puzzleType === EPuzzleType.REFERENCE_ANSWER}
                            puzzle={childPuzzle}
                            index={index}
                            active={focused}
                            onFocus={onFocusCallback}
                            parent={puzzle}
                        />
                    );
                })}
                {!isGroup && (
                    <ConditionsWrapper
                        puzzle={puzzle}
                        parent={parent}
                        focused={focused}
                        answerType={_.get(_.head(puzzle.puzzles), "puzzleType")}
                    />
                )}
            </div>
        </SelectableBlockWrapper>
    );
};
