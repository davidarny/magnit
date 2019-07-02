/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { EditorContext, IEditorContext } from "TemplateEditor";
import { Conditions } from "components/conditions";
import { EPuzzleType } from "components/puzzle";

interface IContentConditionsProps {
    puzzleId: string;
    focused: boolean;
    puzzleType: EPuzzleType;
}

export const ContentConditions: React.FC<IContentConditionsProps> = props => {
    const { puzzleId, focused, puzzleType } = props;
    if (!focused) {
        return null;
    }
    return (
        <EditorContext.Consumer>
            {({ onTemplateChange, template }: IEditorContext) => (
                <Conditions {...{ puzzleId, onTemplateChange, template, puzzleType }} />
            )}
        </EditorContext.Consumer>
    );
};
