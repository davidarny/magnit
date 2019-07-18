/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const GroupIcon: React.FC<IIconProps> = ({ size = 30, ...props }) => {
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
            <circle cx="15" cy="6.875" r="3.625" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6.875" cy="23.125" r="3.625" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="23.125" cy="23.125" r="3.625" stroke="currentColor" strokeWidth="1.5" />
            <path
                d="M13.125 10V14.7143C13.125 15.2666 12.6773 15.7143 12.125 15.7143H7.875C7.32272 15.7143 6.875 16.162 6.875 16.7143V20"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M16.875 10V14.7143C16.875 15.2666 17.3227 15.7143 17.875 15.7143H22.125C22.6773 15.7143 23.125 16.162 23.125 16.7143V20"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </SvgIcon>
    );
};
