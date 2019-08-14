/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const RadioIcon: React.FC<IIconProps> = ({ size = 18, ...props }) => {
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
            <circle cx="9" cy="9" r="6.75" stroke="#286BFF" strokeWidth="1.5" />
            <path
                d="M9 5.25C6.92893 5.25 5.25 6.92893 5.25 9C5.25 11.0711 6.92893 12.75 9 12.75C11.0711 12.75 12.75 11.0711 12.75 9C12.75 6.92893 11.0711 5.25 9 5.25V5.25Z"
                fill="#286BFF"
            />
        </SvgIcon>
    );
};
