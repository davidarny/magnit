/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const ImageIcon: React.FC<IIconProps> = ({ size = 24, ...props }) => {
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
            {...props}
        >
            <path d="M14.14 12L11.14 15.87L9 13.28L6 17.14H18L14.14 12Z" fill="currentColor" />
            <rect
                x="3.75"
                y="3.75"
                width="16.5"
                height="16.5"
                rx="1.25"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <circle cx="9" cy="10" r="0.5" fill="#3F4752" stroke="currentColor" />
        </SvgIcon>
    );
};
