/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import * as React from "react";
import { UploadFilesAnswer } from "./UploadFilesAnswer";

export class UploadFilesAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        return <UploadFilesAnswer focused={focused} id={puzzle.id} {...props} />;
    }
}
