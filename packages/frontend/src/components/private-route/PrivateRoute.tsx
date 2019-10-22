/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Redirect, RouteComponentProps } from "@reach/router";
import React from "react";

interface IPrivateRouteProps {
    noRedirect?: boolean;
    authorized?: boolean;
    to?: string;

    children(props: RouteComponentProps): React.ReactNode;
}

export const PrivateRoute: React.FC<IPrivateRouteProps & RouteComponentProps> = props => {
    const { authorized = false, noRedirect = false, to = "/login", children, ...rest } = props;

    if (!authorized) {
        if (noRedirect) {
            return null;
        } else {
            return <Redirect to={to} noThrow />;
        }
    } else {
        return <React.Fragment>{children(rest)}</React.Fragment>;
    }
};
