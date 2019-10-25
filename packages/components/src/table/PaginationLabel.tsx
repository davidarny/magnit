/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";

interface IPaginationLabelProps {
    from: number;
    to: number;
    count: number;
    page: number;
}

export const PaginationLabel: React.FC<IPaginationLabelProps> = ({ from, count, to }) => {
    return <span>{`${from} - ${to} из ${count}`}</span>;
};

PaginationLabel.displayName = "PaginationLabel";
