import { IPuzzleFactory, IPuzzleFactoryProps } from "../../services/item";
import * as React from "react";
import { jsx } from "@emotion/core";
import { GroupPuzzle } from "./GroupPuzzle";
import { EditorContext, IEditorContext } from "../../TemplateEditor";


export class GroupFactory implements IPuzzleFactory {
    createItem({item, ...rest}: IPuzzleFactoryProps): React.ReactNode {
        return (
            <EditorContext.Consumer>
                {
                    ({ template, onTemplateChange }: IEditorContext) => (
                        <GroupPuzzle
                            {...rest}
                            {...{ template, onTemplateChange, id: item.id }}
                        />
                    )
                }
            </EditorContext.Consumer>
        );
    }
}
