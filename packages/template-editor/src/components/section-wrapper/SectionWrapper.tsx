/** @jsx jsx */

import { jsx } from "@emotion/core";
import { SelectableBlockWrapper } from "@magnit/components";
import { EPuzzleType, ISection, ITemplate } from "@magnit/entities";
import { SectionContent } from "components/section-content";
import { SectionView } from "components/section-view";
import * as React from "react";

interface ITemplateSectionProps {
    template: ITemplate;
    section: ISection;
    index: number;
    focusedPuzzleId?: string;

    onTemplateChange(template: ITemplate): void;

    onPuzzleFocus(id: string): void;
}

export const SectionWrapper: React.FC<ITemplateSectionProps> = ({ section, ...props }) => {
    const focused = props.focusedPuzzleId === section.id;

    function isFocused(id: string) {
        return id === props.focusedPuzzleId;
    }

    let offset = 0;

    return (
        <SelectableBlockWrapper
            id={section.id}
            css={theme => ({
                marginTop: theme.spacing(4),
                marginBottom: theme.spacing(2),
                paddingTop: theme.spacing(2),
            })}
            onFocus={props.onPuzzleFocus.bind(null, section.id)}
            onMouseDown={props.onPuzzleFocus.bind(null, section.id)}
            focused={focused}
        >
            <SectionView
                id={section.id}
                title={section.title}
                index={props.index}
                focused={focused}
                template={props.template}
                onTemplateChange={props.onTemplateChange}
            >
                {section.puzzles.map((puzzle, index) => {
                    const result = (
                        <SectionContent
                            key={puzzle.id}
                            puzzle={puzzle}
                            onFocus={props.onPuzzleFocus}
                            isFocused={isFocused}
                            index={index + offset}
                        />
                    );
                    if (puzzle.puzzleType === EPuzzleType.GROUP) {
                        offset -= 1;
                        offset += puzzle.puzzles.length;
                    }
                    return result;
                })}
            </SectionView>
        </SelectableBlockWrapper>
    );
};
