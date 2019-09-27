/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { DateAnswer } from "./DateAnswer";

export class DateAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleFactoryProps): React.ReactNode {
        return <DateAnswer {...props} />;
    }
}
