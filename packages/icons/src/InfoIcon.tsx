/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { SvgIcon } from "@material-ui/core";
import * as React from "react";
import { IIconProps } from "./IIconProps";

export const InfoIcon: React.FC<IIconProps> = ({ size = 24, ...props }) => {
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
                d="M13 7C13 7.55228 12.5523 8 12 8C11.4477 8 11 7.55228 11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7Z"
                fill="#2F97FF"
            />
            <path
                d="M11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V12Z"
                fill="#2F97FF"
            />
        </SvgIcon>
    );
};
