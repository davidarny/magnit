/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorContext } from "context";
import * as React from "react";
import { useContext } from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { Question } from "./Question";

export class QuestionFactory implements IPuzzleFactory {
    create({ puzzle, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { template, ...rest } = context;

        return <Question puzzle={puzzle} title={puzzle.title} {...rest} {...props} />;
    }
}
