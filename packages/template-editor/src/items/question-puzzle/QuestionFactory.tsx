/** @jsx jsx */

import * as React from "react";
import { useContext } from "react";
import { jsx } from "@emotion/core";
import { QuestionPuzzle } from "./QuestionPuzzle";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext } from "TemplateEditor";

export class QuestionFactory implements IPuzzleFactory {
    createPuzzle({ puzzle, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { template, onTemplateChange } = context;

        return (
            <QuestionPuzzle
                {...props}
                template={template!}
                id={puzzle.id}
                title={puzzle.title}
                onTemplateChange={onTemplateChange}
            />
        );
    }
}
