/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorContext } from "context";
import * as React from "react";
import { useContext } from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { Question } from "./Question";

export class QuestionFactory implements IPuzzleFactory {
    create(props: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);

        return <Question {...props} {...context} />;
    }
}
