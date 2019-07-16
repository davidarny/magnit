/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Button as MaterialButton } from "@material-ui/core";
import _ from "lodash";
import { Link } from "@reach/router";

const variants = {
    main: (theme: any) => ({
        transition: "0.25s",
        borderRadius: theme.radius(5),
        width: theme.spacing(20),
        height: theme.spacing(5),
    }),
    blue: ({ spacing, ...theme }: any) => ({
        color: theme.colors.white,
        border: `1px solid ${theme.colors.primary}`,
        background: `${theme.colors.primary} !important`,
        hover: {
            color: theme.colors.white,
            boxShadow: `0 ${spacing(0.5)} ${spacing()} ${theme.colors.primary}40 !important`,
        },
        active: { background: `${theme.colors.darkPrimary} !important` },
    }),
    green: ({ spacing, ...theme }: any) => ({
        color: theme.colors.white,
        border: `1px solid ${theme.colors.green}`,
        background: `${theme.colors.green} !important`,
        hover: {
            color: theme.colors.white,
            boxShadow: `0 ${spacing(0.5)} ${spacing()} ${theme.colors.green}40 !important`,
        },
        active: { background: `${theme.colors.darkGreen} !important` },
    }),
    violet: ({ spacing, ...theme }: any) => ({
        color: theme.colors.white,
        border: `1px solid ${theme.colors.violet}`,
        background: `${theme.colors.violet} !important`,
        hover: {
            color: theme.colors.white,
            boxShadow: `0 ${spacing(0.5)} ${spacing()} ${theme.colors.violet}40 !important`,
        },
        active: { background: `${theme.colors.darkViolet} !important` },
    }),
    blueOutline: ({ spacing, ...theme }: any) => ({
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.primary} !important`,
        background: "none !important",
        hover: { boxShadow: `0 ${spacing(0.5)} ${spacing()} ${theme.colors.primary}40 !important` },
    }),
    redOutline: ({ spacing, ...theme }: any) => ({
        color: theme.colors.red,
        border: `1px solid ${theme.colors.red}`,
        background: "none !important",
        hover: {
            color: theme.colors.white,
            background: `${theme.colors.red} !important`,
            boxShadow: `0 ${spacing(0.5)} ${spacing()} ${theme.colors.red}40 !important`,
        },
        active: {
            color: theme.colors.white,
            background: `${theme.colors.darkRed} !important`,
        },
    }),
};

export interface IButtonProps {
    title?: string;
    scheme?: keyof Omit<typeof variants, "main">;
    component?: React.ReactNode;
    icon?: React.ReactNode;

    onClick?(): void;
}

type TButtonProps = IButtonProps &
    React.ComponentProps<typeof MaterialButton> &
    React.ComponentProps<typeof Link>;

export const Button: React.FC<TButtonProps> = props => {
    const { title = "", icon = "", scheme = "blue", ...rest } = props;
    const variant = _.get(variants, scheme);

    return (
        <MaterialButton
            css={theme => ({
                ...variants.main(theme),
                ...variant(theme),
                textTransform: "none",
                position: "relative",
                boxShadow: "none",
                ":hover": { ..._.get(variant(theme), "hover", {}) },
                ":active": { ..._.get(variant(theme), "active", {}) },
            })}
            {...rest}
        >
            <div
                css={theme => ({
                    height: theme.spacing(3),
                    marginLeft: theme.spacing(-2),
                    marginRight: theme.spacing(),
                    svg: {
                        width: theme.spacing(3),
                        height: theme.spacing(3),
                    },
                })}
            >
                {icon}
            </div>
            <span
                css={theme => ({
                    fontSize: theme.fontSize.normal,
                    lineHeight: theme.spacing(2),
                })}
            >
                {title}
            </span>
        </MaterialButton>
    );
};
