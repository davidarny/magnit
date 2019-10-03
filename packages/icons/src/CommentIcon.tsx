/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { SvgIcon } from "@material-ui/core";
import * as React from "react";
import { IIconProps } from "./IIconProps";

export const CommentIcon: React.FC<IIconProps> = ({ size = 24, ...props }) => {
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
                d="M4.8 3H19.2C20.19 3 21 3.8231 21 4.82912V15.8038C21 16.8098 20.19 17.6329 19.2 17.6329H6.68378C6.63018 17.6329 6.57883 17.6545 6.54123 17.6927L3.34255 20.9431C3.21703 21.0706 3 20.9818 3 20.8028V4.82912C3 3.8231 3.81 3 4.8 3ZM18.9578 16.6274C19.5101 16.6274 19.9578 16.1797 19.9578 15.6274V4.94823C19.9578 4.39594 19.5101 3.94823 18.9578 3.94823H5.04199C4.48971 3.94823 4.04199 4.39594 4.04199 4.94823V18.2364C4.04199 18.4175 4.26347 18.5054 4.38761 18.3735L5.97224 16.6903C6.01004 16.6502 6.06273 16.6274 6.11786 16.6274H18.9578Z"
                fill="#2F97FF"
            />
            <circle id="Ellipse" cx="8" cy="10.5" r="1" fill="#2F97FF" />
            <circle id="Ellipse_2" cx="12" cy="10.5" r="1" fill="#2F97FF" />
            <circle id="Ellipse_3" cx="16" cy="10.5" r="1" fill="#2F97FF" />
        </SvgIcon>
    );
};
