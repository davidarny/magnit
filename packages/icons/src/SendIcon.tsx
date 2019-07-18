/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const SendIcon: React.FC<IIconProps> = ({ size = 22, ...props }) => {
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
            <path
                d="M16.5 5.5L5.5 9.35L10.45 11.55L12.65 16.5L16.5 5.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M10.5416 11.4583L16.5 5.5" stroke="currentColor" strokeWidth="1.5" />
        </SvgIcon>
    );
};
