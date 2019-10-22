/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Redirect, RouteComponentProps } from "@reach/router";
import React from "react";

interface INotFoundProps {
    to?: string;
}

export const NotFound: React.FC<INotFoundProps & RouteComponentProps> = props => {
    const { to } = props;

    return <Redirect to={to} noThrow />;
};
