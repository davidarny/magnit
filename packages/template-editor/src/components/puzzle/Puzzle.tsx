/** @jsx jsx */

import * as React from "react";
import { ReactNode } from "react";
import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "./PuzzleWrapper";
import { IPuzzle } from "entities";
import { EPuzzleType } from "./EPuzzleType";
import { SelectableBlockWrapper } from "../block";

export interface ICommonComponentProps {
    index: number;
    id: string;
}

export interface ITitledComponentProps extends ICommonComponentProps {
    title: string;
}

export interface IExtendedComponentProps extends ITitledComponentProps {
    questionFocused: boolean;
}

export interface IRadioComponentProps extends IExtendedComponentProps {
    addRadioButton: boolean;
}

export interface ICheckboxComponentProps extends IExtendedComponentProps {
    addCheckboxButton: boolean;
}

export interface IDropdownComponentProps extends IExtendedComponentProps {
    addDropdownButton: boolean;
}

interface IPuzzleProps {
    puzzles: IPuzzle[];
    index: number;
    components: {
        [EPuzzleType.GROUP](props: ICommonComponentProps): ReactNode;
        [EPuzzleType.QUESTION](props: ITitledComponentProps): ReactNode;
        [EPuzzleType.TEXT_ANSWER](props: ICommonComponentProps): ReactNode;
        [EPuzzleType.DATE_ANSWER](props: ICommonComponentProps): ReactNode;
        [EPuzzleType.NUMERIC_ANSWER](props: ICommonComponentProps): ReactNode;
        [EPuzzleType.RADIO_ANSWER](props: IRadioComponentProps): ReactNode;
        [EPuzzleType.CHECKBOX_ANSWER](props: ICheckboxComponentProps): ReactNode;
        [EPuzzleType.DROPDOWN_ANSWER](props: IDropdownComponentProps): ReactNode;
    };
    // if not focused, we don't show add button
    questionFocused?: boolean;

    isFocused(id: string): boolean;

    isInFocusedChain(id: string): boolean;

    onFocus(id: string): void;

    onBlur(event: React.SyntheticEvent): void;

    onMouseDown?(): void;
}

export const Puzzle: React.FC<IPuzzleProps> = ({ puzzles, ...props }) => {
    return (
        <React.Fragment>
            {puzzles.map((puzzle, index) => {
                function onFocus(): void {
                    props.onFocus(puzzle.id);
                }

                const commonComponentProps: ICommonComponentProps = {
                    index,
                    id: puzzle.id,
                };
                const extendedComponentProps: IExtendedComponentProps = {
                    ...commonComponentProps,
                    title: puzzle.title,
                    questionFocused: index === puzzles.length - 1,
                };

                switch (puzzle.puzzleType) {
                    case EPuzzleType.GROUP: {
                        return (
                            <SelectableBlockWrapper
                                key={puzzle.id}
                                id={puzzle.id}
                                onFocus={onFocus}
                                onMouseDown={onFocus}
                                onBlur={props.onBlur}
                                styles={theme => ({
                                    position: "relative",
                                    paddingTop: theme.spacing(2),
                                    marginTop: theme.spacing(index === 0 ? 4 : 0),
                                    paddingBottom: theme.spacing(2),
                                    marginBottom: theme.spacing(
                                        index === puzzles.length - 1 ? 4 : 0
                                    ),
                                    zIndex: props.isFocused(puzzle.id)
                                        ? 1300
                                        : props.isInFocusedChain(puzzle.id)
                                        ? 1200
                                        : 0,
                                })}
                                square={true}
                                focused={props.isFocused(puzzle.id)}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.GROUP](commonComponentProps)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </SelectableBlockWrapper>
                        );
                    }
                    case EPuzzleType.QUESTION: {
                        return (
                            <SelectableBlockWrapper
                                key={puzzle.id}
                                id={puzzle.id}
                                styles={theme => ({
                                    position: "relative",
                                    paddingTop: theme.spacing(2),
                                    marginTop: theme.spacing(index === 0 ? 2 : 0),
                                    paddingBottom: theme.spacing(2),
                                    marginBottom: theme.spacing(
                                        index === puzzles.length - 1 ? 0 : 2
                                    ),
                                    zIndex: props.isFocused(puzzle.id) ? 1300 : 0,
                                })}
                                onFocus={onFocus}
                                onMouseDown={onFocus}
                                onBlur={props.onBlur}
                                square={true}
                                focused={props.isFocused(puzzle.id)}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.QUESTION](extendedComponentProps)}
                                </PuzzleWrapper>
                                <Puzzle
                                    questionFocused={props.isFocused(puzzle.id)}
                                    puzzles={puzzle.puzzles}
                                    index={props.index}
                                    onMouseDown={onFocus}
                                    {...props}
                                />
                            </SelectableBlockWrapper>
                        );
                    }
                    case EPuzzleType.TEXT_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                                onMouseDown={props.onMouseDown}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.TEXT_ANSWER](
                                        commonComponentProps
                                    )}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    case EPuzzleType.DATE_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                                onMouseDown={props.onMouseDown}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.DATE_ANSWER](
                                        commonComponentProps
                                    )}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    case EPuzzleType.NUMERIC_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                                onMouseDown={props.onMouseDown}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.NUMERIC_ANSWER](
                                        commonComponentProps
                                    )}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    case EPuzzleType.RADIO_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                                onMouseDown={props.onMouseDown}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.RADIO_ANSWER]({
                                        ...extendedComponentProps,
                                        addRadioButton: !!props.questionFocused,
                                    })}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    case EPuzzleType.CHECKBOX_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                                onMouseDown={props.onMouseDown}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.CHECKBOX_ANSWER]({
                                        ...extendedComponentProps,
                                        addCheckboxButton: !!props.questionFocused,
                                    })}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    case EPuzzleType.DROPDOWN_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                                onMouseDown={props.onMouseDown}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.DROPDOWN_ANSWER]({
                                        ...extendedComponentProps,
                                        addDropdownButton: !!props.questionFocused,
                                    })}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    default:
                        return <React.Fragment key={puzzle.id} />;
                }
            })}
        </React.Fragment>
    );
};
