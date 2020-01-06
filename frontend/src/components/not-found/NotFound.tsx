/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Redirect, RouteComponentProps } from "@reach/router";
import React, { useEffect } from "react";

interface INotFoundProps {
    to?: string;

    onLogout?(): void;
}

export const NotFound: React.FC<INotFoundProps & RouteComponentProps> = props => {
    const { to, uri, onLogout } = props;

    useEffect(() => {
        if (uri === "/logout" && onLogout) {
            onLogout();
        }
    }, [uri, onLogout]);

    if (uri === "/logout") {
        return <Redirect to="login" noThrow />;
    }

    return <Redirect to={to} noThrow />;
};
