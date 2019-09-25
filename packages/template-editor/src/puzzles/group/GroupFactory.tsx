/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { Group } from "./Group";

export class GroupFactory implements IPuzzleFactory {
    create(_props: IPuzzleFactoryProps): React.ReactNode {
        return <Group />;
    }
}
