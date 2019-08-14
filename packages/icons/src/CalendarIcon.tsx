/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const CalendarIcon: React.FC<IIconProps> = ({ size = 18, ...props }) => {
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 4C3.89543 4 3 4.89543 3 6V14.75C3 15.8546 3.89543 16.75 5 16.75H14.5C15.6046 16.75 16.5 15.8546 16.5 14.75V6C16.5 4.89543 15.6046 4 14.5 4H5ZM5.125 5.125C4.57272 5.125 4.125 5.57272 4.125 6.125V14.625C4.125 15.1773 4.57272 15.625 5.125 15.625H14.375C14.9273 15.625 15.375 15.1773 15.375 14.625V6.125C15.375 5.57272 14.9273 5.125 14.375 5.125H5.125Z"
                fill="#286BFF"
            />
            <rect x="6" y="1.5" width="1.125" height="3.75" rx="0.5625" fill="#286BFF" />
            <rect x="10.875" y="1.5" width="1.125" height="3.75" rx="0.5625" fill="#286BFF" />
            <rect x="3" y="6.75" width="12" height="1.125" fill="#286BFF" />
            <rect x="4.5" y="9" width="2.25" height="1.5" rx="0.5" fill="#286BFF" />
            <rect x="4.5" y="12" width="2.25" height="1.5" rx="0.5" fill="#286BFF" />
            <rect x="8.25" y="9" width="2.25" height="1.5" rx="0.5" fill="#286BFF" />
        </SvgIcon>
    );
};
