/** @jsx jsx */

import { Tab, Tabs } from "@material-ui/core";
import { jsx } from "@emotion/core";
import * as React from "react";
import { FC, Fragment, useState } from "react";
import { RouteMatcher } from "route-matcher";
import { Link } from "@reach/router";

export interface ITab {
    value: string;
    label: string;
}

interface ITabsWrapperProps {
    tabs: ITab[];
}

export const TabsWrapper: FC<ITabsWrapperProps> = ({ children, tabs }) => {
    const [tab, setTab] = useState(0);

    function onTabChange(event: React.ChangeEvent<{}>, nextTabValue: number): void {
        setTab(nextTabValue);
    }

    return (
        <Fragment>
            <RouteMatcher
                routes={tabs.map(({ value }, index) => ({
                    path: value,
                    render: () => setTab(index),
                }))}
            />
            <Tabs
                value={tab}
                onChange={onTabChange}
                css={theme => ({
                    borderBottom: `1px solid ${theme.colors.lightGray}`,
                    width: "100%",
                    ".indicator": {
                        backgroundColor: theme.colors.primary,
                        boxShadow: theme.boxShadow.indicator,
                        borderTopLeftRadius: theme.radius(0.5),
                        borderTopRightRadius: theme.radius(0.5),
                        height: "3px",
                    },
                })}
                classes={{ indicator: "indicator" }}
                style={{
                    borderBottom: "1px solid #DEE5EF",
                    width: "100%",
                }}
            >
                {tabs.map(({ label, value }: ITab, index) => (
                    <Tab
                        component={Link}
                        to={value}
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
                        value={value}
                        label={label}
                    />
                ))}
            </Tabs>
            {children}
        </Fragment>
    );
};
