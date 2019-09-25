/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { NumericAnswer } from "./NumericAnswer";

export class NumericAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleFactoryProps): React.ReactNode {
        return <NumericAnswer {...props} />;
    }
}
