/** @jsx jsx */

import { jsx } from "@emotion/core";
import React from "react";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import { UploadFiles } from "./UploadFiles";

export class UploadFilesFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <UploadFiles key={props.puzzle.id} {...props} />;
    }
}
