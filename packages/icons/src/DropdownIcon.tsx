/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const DropdownIcon: React.FC<IIconProps> = ({ size = 18, ...props }) => {
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
            <circle cx="9" cy="9" r="7.5" fill="#286BFF" />
            <path d="M6.5 7.75L9 10.25L11.5 7.75H6.5Z" fill="white" />
        </SvgIcon>
    );
};
