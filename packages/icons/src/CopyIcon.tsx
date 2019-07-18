/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const CopyIcon: React.FC<IIconProps> = ({ size = 30, ...props }) => {
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
                d="M4.375 18.125V3.125H17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.25 7H23C23.6904 7 24.25 7.55964 24.25 8.25V24.25C24.25 24.9404 23.6904 25.5 23 25.5H9.5C8.80964 25.5 8.25 24.9404 8.25 24.25V7Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </SvgIcon>
    );
};
