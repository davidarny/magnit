/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { RadioAnswer } from "./RadioAnswer";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import _ from "lodash";

export class RadioAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <RadioAnswer key={_.get(props.puzzle, "id")} {...props} />;
    }
}
