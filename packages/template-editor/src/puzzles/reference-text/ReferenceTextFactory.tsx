/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import * as React from "react";
import { ReferenceText } from "./ReferenceText";
import { useContext } from "react";
import { EditorContext } from "context";

export class ReferenceTextFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);

        return (
            <ReferenceText
                template={context.template}
                text={puzzle.description}
                id={puzzle.id}
                focused={focused}
                onTemplateChange={context.onTemplateChange}
                {...props}
            />
        );
    }
}
