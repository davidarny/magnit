import { ReactNode } from "react";
import { EPuzzleType } from "../../components/puzzle";
import { QuestionFactory } from "../../items/question-puzzle";
import * as React from "../../components/puzzle/Puzzle";
import { jsx } from "@emotion/core";
import { IPuzzle } from "../../entities";
import { GroupFactory } from "../../items/group-puzzle";

export interface IPuzzleFactory {
    createItem(params: IPuzzleFactoryProps): ReactNode;
}

export interface IPuzzleFactoryProps {
    index: number;
    focused: boolean;
    item: IPuzzle;
}

class DefaultFactory implements IPuzzleFactory {
    createItem({item}: IPuzzleFactoryProps): ReactNode {
        return <div key={item.id}/>;
    }
}

export const getFactory = (type: EPuzzleType): IPuzzleFactory => {
    switch (type) {
        case EPuzzleType.QUESTION:
            return new QuestionFactory();
        case EPuzzleType.GROUP:
            return new GroupFactory();
        default:
            console.warn(`Current type (${type}) factory is not exist`);
            return new DefaultFactory();
    }
};
