/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { DropdownAnswer } from "./DropdownAnswer";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import _ from "lodash";

export class DropdownAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <DropdownAnswer key={_.get(props.puzzle, "id")} {...props} />;
    }
}
