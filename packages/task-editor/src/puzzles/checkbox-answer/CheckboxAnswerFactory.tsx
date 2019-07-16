/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { CheckboxAnswer } from "./CheckboxAnswer";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import _ from "lodash";

export class CheckboxAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <CheckboxAnswer key={_.get(props.puzzle, "id")} {...props} />;
    }
}
