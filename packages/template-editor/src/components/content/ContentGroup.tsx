import * as React from "react";
import { Block } from "../block";
import { jsx } from "@emotion/core";
import { IPuzzle } from "../../entities";
import { EPuzzleType } from "../puzzle";
import { ContentItem } from "./ContentItem";

interface IContentGroupProps {
    index: number;
    item: IPuzzle;

    isFocused(id: string): boolean;

    onFocus(id: string): void;

    onBlur(event: React.SyntheticEvent): void;

    onMouseDown?(): void;
}

export const ContentGroup: React.FC<IContentGroupProps> = ({
    isFocused,
    item,
    children,
    ...props
}) => {
    function onFocus(): void {
        props.onFocus(item.id);
    }

    const focused = isFocused(item.id);
    return (
        <Block
            onFocus={onFocus}
            onMouseDown={onFocus}
            onBlur={props.onBlur}
            focused={focused}
            styles={theme => ({
                position: "relative",
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                zIndex: focused ? 1300 : 0,
            })}
        >
            <ContentItem item={item} index={props.index} active={focused} />
            {item.puzzles.map((puzzle, index) => {
                if (puzzle.puzzleType === EPuzzleType.QUESTION) {
                    return (
                        <ContentGroup
                            key={puzzle.id}
                            item={puzzle}
                            onFocus={props.onFocus}
                            onBlur={props.onBlur}
                            isFocused={isFocused}
                            index={index}
                        />
                    );
                }
                return <ContentItem item={puzzle} index={index} active={focused} />;
            })}
        </Block>
    );
};
