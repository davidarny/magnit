/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Match } from "@reach/router";

interface IRouteMatcherProps {
    routes: Array<{
        path?: string;
        paths?: string[];
        render: () => React.ReactNode | void;
    }>;
}

export const RouteMatcher: React.FC<IRouteMatcherProps> = ({ routes }) => {
    return (
        <React.Fragment>
            {routes.map(route => {
                if (typeof route.paths !== "undefined") {
                    return route.paths.map(path => {
                        return (
                            <Match path={path} key={path}>
                                {props => {
                                    if (!props.match) {
                                        return;
                                    }
                                    const component = route.render();
                                    if (typeof component !== "undefined") {
                                        return component;
                                    }
                                }}
                            </Match>
                        );
                    });
                }
                if (typeof route.path !== "undefined") {
                    return (
                        <Match path={route.path} key={route.path}>
                            {props => {
                                if (!props.match) {
                                    return;
                                }
                                const component = route.render();
                                if (typeof component !== "undefined") {
                                    return component;
                                }
                            }}
                        </Match>
                    );
                }
                return <React.Fragment />;
            })}
        </React.Fragment>
    );
};
