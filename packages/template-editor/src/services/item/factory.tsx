/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { EPuzzleType } from "@magnit/services";
import { IPuzzle } from "entities";
import {
    CheckboxAnswerFactory,
    DateAnswerFactory,
    DropdownAnswerFactory,
    GroupFactory,
    NumericAnswerFactory,
    QuestionFactory,
    RadioAnswerFactory,
    ReferenceAssetFactory,
    ReferenceTextFactory,
    TextAnswerFactory,
    UploadFilesAnswerFactory,
} from "puzzles";

export interface IPuzzleFactory {
    create(params: IPuzzleFactoryProps): React.ReactNode;
}

export interface IPuzzleFactoryProps {
    index: number;
    focused: boolean;
    puzzle: IPuzzle;
    parentPuzzle?: IPuzzle;
}

class DefaultFactory implements IPuzzleFactory {
    create(): React.ReactNode {
        return <React.Fragment />;
    }
}

export function getPuzzleFactory(type: EPuzzleType): IPuzzleFactory {
    switch (type) {
        case EPuzzleType.QUESTION:
            return new QuestionFactory();
        case EPuzzleType.GROUP:
            return new GroupFactory();
        case EPuzzleType.DROPDOWN_ANSWER:
            return new DropdownAnswerFactory();
        case EPuzzleType.DATE_ANSWER:
            return new DateAnswerFactory();
        case EPuzzleType.TEXT_ANSWER:
            return new TextAnswerFactory();
        case EPuzzleType.CHECKBOX_ANSWER:
            return new CheckboxAnswerFactory();
        case EPuzzleType.RADIO_ANSWER:
            return new RadioAnswerFactory();
        case EPuzzleType.NUMERIC_ANSWER:
            return new NumericAnswerFactory();
        case EPuzzleType.UPLOAD_FILES:
            return new UploadFilesAnswerFactory();
        case EPuzzleType.REFERENCE_TEXT:
            return new ReferenceTextFactory();
        case EPuzzleType.REFERENCE_ASSET:
            return new ReferenceAssetFactory();
        default:
            return new DefaultFactory();
    }
}
