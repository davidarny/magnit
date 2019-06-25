/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const CopyIcon: React.FC<IIconProps> = ({ size = 24 }) => {
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
            <path
                d="M3.5 14.5V2.5H14"
                stroke="#2F97FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.75 5.75H18C18.6904 5.75 19.25 6.30964 19.25 7V19C19.25 19.6904 18.6904 20.25 18 20.25H8C7.30964 20.25 6.75 19.6904 6.75 19V5.75Z"
                stroke="#2F97FF"
                strokeWidth="1.5"
            />
        </SvgIcon>
    );
};
