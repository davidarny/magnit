/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const TemplatesIcon: React.FC<IIconProps> = ({ size = 36, isActive = false }) => {
    return (
        <SvgIcon
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            css={css`
                fill: none;
                width: ${size}px;
                height: ${size}px;
            `}
        >
            <rect
                x="5.75"
                y="7.75"
                width="24.5"
                height="20.5"
                rx="1.25"
                stroke={isActive ? "#2F97FF" : "#AAB4BE"}
                strokeWidth="1.5"
            />
            <mask id="path-2-inside-1" fill="white">
                <rect x="21" y="17" width="6" height="6.5" rx="0.5" />
            </mask>
            <rect
                x="21"
                y="17"
                width="6"
                height="6.5"
                rx="0.5"
                stroke={isActive ? "#2F97FF" : "#AAB4BE"}
                strokeWidth="3"
                mask="url(#path-2-inside-1)"
            />
            <mask id="path-3-inside-2" fill="white">
                <rect x="9" y="17" width="10" height="6.5" rx="0.5" />
            </mask>
            <rect
                x="9"
                y="17"
                width="10"
                height="6.5"
                rx="0.5"
                stroke={isActive ? "#2F97FF" : "#AAB4BE"}
                strokeWidth="3"
                mask="url(#path-3-inside-2)"
            />
            <mask id="path-4-inside-3" fill="white">
                <rect x="6" y="12" width="24" height="1.5" rx="0.4" />
            </mask>
            <rect
                x="6"
                y="12"
                width="24"
                height="1.5"
                rx="0.4"
                fill={isActive ? "#2F97FF" : "#AAB4BE"}
                stroke={isActive ? "#2F97FF" : "#AAB4BE"}
                mask="url(#path-4-inside-3)"
            />
        </SvgIcon>
    );
};
