/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const TrashIcon: React.FC<IIconProps> = ({ size = 30 }) => {
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
                d="M11.8367 6.40625L12.1847 5.72473L12.5548 5H17.4452L17.8153 5.72473L18.1633 6.40625H18.9286H23.75V6.71875H6.25V6.40625H11.0714H11.8367ZM22.2393 10.625L21.3776 24.1923C21.3495 24.6299 20.9734 25 20.4866 25H9.51339C9.02676 25 8.65071 24.6301 8.62245 24.1926C8.62244 24.1925 8.62243 24.1924 8.62243 24.1923L7.76075 10.625H22.2393Z"
                stroke="#8A94A2"
                strokeWidth="2.5"
            />
        </SvgIcon>
    );
};
