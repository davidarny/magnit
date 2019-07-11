/** @jsx jsx */

import { Tab, Tabs } from "@material-ui/core";
import { jsx } from "@emotion/core";
import * as React from "react";
import { RouteMatcher } from "route-matcher";
import { useState } from "react";
import { Link } from "@reach/router";

export interface ITab {
    value: string;
    label: string;
}

interface ITabsWrapperProps {
    tabs: ITab[];
    baseUrl?: string; // to handle nested paths
}

export const TabsWrapper: React.FC<ITabsWrapperProps> = ({ tabs, baseUrl = "", children }) => {
    const [tab, setTab] = useState(0);

    function getBaseUrlPath(value: string): string {
        return `${baseUrl ? baseUrl + "/" : ""}${value}`;
    }

    return (
        <React.Fragment>
            <RouteMatcher
                routes={tabs.map(({ value }, index) => ({
                    ...(index === 0
                        ? { paths: [getBaseUrlPath(""), getBaseUrlPath(value)] }
                        : { path: getBaseUrlPath(value) }),
                    render: () => setTab(index),
                }))}
            />
            <Tabs
                value={tab}
                css={theme => ({
                    borderBottom: `1px solid ${theme.colors.lightGray}`,
                    width: "100%",
                    ".indicator": {
                        backgroundColor: theme.colors.primary,
                        boxShadow: theme.boxShadow.indicator,
                        borderTopLeftRadius: theme.radius(0.5),
                        borderTopRightRadius: theme.radius(0.5),
                        borderBottom: `1px solid ${theme.colors.lightGray}`,
                        width: "100%",
                        height: "3px",
                    },
                })}
                classes={{ indicator: "indicator" }}
            >
                {tabs.map(({ label, value }: ITab, index) => {
                    return (
                        <Tab
                            component={Link}
                            to={getBaseUrlPath(value)}
                            key={index}
                            css={theme => ({
                                textTransform: "none",
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: theme.spacing(3),
                                paddingRight: theme.spacing(3),
                                maxWidth: "max-content",
                                fontSize: theme.fontSize.normal,
                                letterSpacing: "normal",
                            })}
                            label={label}
                        />
                    );
                })}
            </Tabs>
            {children}
        </React.Fragment>
    );
};
