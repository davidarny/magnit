/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Redirect, RouteComponentProps } from "@reach/router";
import React from "react";

interface IPrivateRouteProps<P> extends RouteComponentProps {
    noRedirect?: boolean;
    authorized?: boolean;
    to?: string;

    render(props: RouteComponentProps & P): React.ReactNode;
}

export function PrivateRoute<P>(props: IPrivateRouteProps<P>) {
    const { authorized = false, noRedirect = false, to = "/login", render, ...rest } = props;

    if (!authorized) {
        if (noRedirect) {
            return null;
        } else {
            return <Redirect to={to} noThrow />;
        }
    } else {
        return <React.Fragment>{render(rest as RouteComponentProps & P)}</React.Fragment>;
    }
}
