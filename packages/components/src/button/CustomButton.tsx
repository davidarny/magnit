/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Button } from "@material-ui/core";
import _ from "lodash";

export interface ICustomButtonProps {
    title?: string;
    icon?: React.ReactNode;
    variants?: string;
    iconOnly?: boolean;
    iconSize?: number;
    component?: React.ReactNode;
    to?: string;
    variant?: "text" | "outlined" | "contained";
    color?: "inherit" | "primary" | "secondary" | "default";

    onClick?(): void;
}

export const CustomButton: React.FC<ICustomButtonProps> = ({
    title = "",
    icon = "",
    variants = "blue",
    iconOnly = false,
    iconSize = 24,
    ...rest
}) => {
    const buttons = {
        main: {
            transition: "0.25s",
            borderRadius: 40,
            width: 160,
            height: 40,
            minWidth: 40,
        },
        icon: {
            height: 24,
            width: 24,
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

    const scheme = _.get(buttons, variants);

    return (
        <Button
            css={{
                transaction: buttons.main.transition,
                borderRadius: buttons.main.borderRadius,
                width: buttons.main.width,
                height: buttons.main.height,
                minWidth: buttons.main.minWidth,
                textTransform: "none",
                position: "relative",

                color: _.get(scheme, "color"),
                border: _.get(scheme, "border"),
                background: _.get(scheme, "background"),
                boxShadow: "none",
                ":hover": {
                    boxShadow: _.get(scheme, "hover.boxShadow"),
                },
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
                css={{
                    fontSize: 14,
                    lineHeight: "15px",
                }}
            >
                {title}
            </span>
        </Button>
    );
};
