/** @jsx jsx */

import { Tab, Tabs } from "@material-ui/core";
import { jsx } from "@emotion/core";
import * as React from "react";
import { FC, useState, Fragment } from "react";

export interface ITab {
    value: string | number;
    label: string;
}

interface ITabsWrapperProps {
    initialTab?: ITab;
    tabs: ITab[];
}

export const TabsWrapper: FC<ITabsWrapperProps> = ({ children, initialTab, tabs }) => {
    const initialState = initialTab || tabs[0];
    const [tab, setTab] = useState(initialState.value);

    function onTabChange(event: React.ChangeEvent<{}>, nextTabValue: string | number): void {
        setTab(nextTabValue);
    }

    return (
        <Fragment>
            <Tabs
                value={tab}
                onChange={onTabChange}
                css={theme => ({
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
