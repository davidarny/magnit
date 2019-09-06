/** @jsx jsx */

import { jsx } from "@emotion/core";
import _ from "lodash";
import * as React from "react";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import { CheckboxAnswer } from "./CheckboxAnswer";

export class CheckboxAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        const id = _.get(props.puzzle, "id");
        return <CheckboxAnswer key={id} {...props} />;
    }
}
