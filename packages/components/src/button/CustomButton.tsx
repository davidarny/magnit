/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Button } from "@material-ui/core";
import _ from "lodash";

export interface ICustomButtonProps {
    title?: string;
    icon?: React.ReactNode;
    scheme?: string;
    iconOnly?: boolean;
    iconSize?: number;
    component?: React.ReactNode;
    to?: string;
    variant?: "text" | "outlined" | "contained";
    color?: "inherit" | "primary" | "secondary" | "default";

    onClick?(): void;
}

export const CustomButton: React.FC<ICustomButtonProps> = props => {
    const { title = "", icon = "", scheme = "blue", iconSize = 24, iconOnly, ...rest } = props;
    const variants = {
        main: {
            transition: "0.25s",
            borderRadius: 40,
            width: 160,
            height: 40,
        },
        icon: {
            height: iconSize,
            width: iconSize,
        },
        blue: {
            color: "#FFFFFF",
            border: "1px solid #2F97FF",
            background: "#2F97FF !important",
            hover: {
                boxShadow: "0 8px 24px rgba(25, 140, 255, 0.5) !important",
            },
        },
        green: {
            color: "#FFFFFF",
            border: "1px solid #0CDAAC",
            background: "#0CDAAC !important",
            hover: {
                boxShadow: "0 8px 24px rgba(12, 218, 172, 0.5) !important",
            },
        },
        violet: {
            color: "#FFFFFF",
            border: "1px solid #8F7EE5",
            background: "#8F7EE5 !important",
            hover: {
                boxShadow: "0 8px 24px rgba(143, 126, 229, 0.5) !important",
            },
        },
        blueOutline: {
            color: "#2F97FF",
            border: "1px solid #2F97FF !important",
            background: "none !important",
            hover: {
                boxShadow: "0 8px 24px rgba(25, 140, 255, 0.5) !important",
            },
        },
        greyOutline: {
            color: "#AAB4BE",
            border: "1px solid #AAB4BE",
            background: "none !important",
            hover: {
                boxShadow: "0 8px 24px rgba(170, 180, 190, 0.5) !important",
            },
        },
    };

    const variant = _.get(variants, scheme);

    return (
        <Button
            css={{
                ...variants.main,
                textTransform: "none",
                position: "relative",
                ...variant,
                boxShadow: "none",
                ":hover": { ...(variant.hover ? variant.hover : {}) },
            }}
            {...rest}
        >
            <div
                css={{
                    margin: iconOnly ? "-6px 0 0 0" : "0 5px 0 -20px",
                    height: iconSize,
                    svg: {
                        width: iconSize,
                        height: iconSize,
                    },
                }}
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
        </Button>
    );
};
