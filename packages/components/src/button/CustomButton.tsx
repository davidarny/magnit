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
                color: "#FFFFFF",
                boxShadow: "0 4px 8px rgba(25, 140, 255, 0.4) !important",
            },
            active: {
                background: "#207BD6 !important",
            },
        },
        green: {
            color: "#FFFFFF",
            border: "1px solid #0CDAAC",
            background: "#0CDAAC !important",
            hover: {
                color: "#FFFFFF",
                boxShadow: "0 4px 8px rgba(12, 218, 172, 0.4) !important",
            },
            active: {
                background: "#1EC9A3 !important",
            },
        },
        violet: {
            color: "#FFFFFF",
            border: "1px solid #8F7EE5",
            background: "#8F7EE5 !important",
            hover: {
                color: "#FFFFFF",
                boxShadow: "0 4px 8px rgba(143, 126, 229, 0.4) !important",
            },
            active: {
                background: "#6959B8 !important",
            },
        },
        blueOutline: {
            color: "#2F97FF",
            border: "1px solid #2F97FF !important",
            background: "none !important",
            hover: {
                boxShadow: "0 4px 8px rgba(25, 140, 255, 0.4) !important",
            },
        },
        redOutline: {
            color: "#FF6A89",
            border: "1px solid #AAB4BE",
            background: "none !important",
            hover: {
                color: "#FFFFFF",
                background: "#FF6A89 !important",
                boxShadow: "0 4px 8px rgba(255, 106, 137, 0.4) !important",
            },
            active: {
                color: "#FFFFFF",
                background: "#DE3659 !important",
            },
        },
    };

    const variant = _.get(variants, scheme);

    return (
        <Button
            css={{
                ...variants.main,
                ...variant,
                textTransform: "none",
                position: "relative",
                boxShadow: "none",
                ":hover": { ...(variant.hover ? variant.hover : {}) },
                ":active": { ...(variant.active ? variant.active : {}) },
                ...(iconOnly ? { padding: 0 } : {}),
            }}
            {...rest}
        >
            <div
                css={{
                    height: iconSize,
                    marginLeft: iconOnly ? 0 : -15,
                    marginRight: iconOnly ? 0 : 5,
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
