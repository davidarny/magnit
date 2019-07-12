/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const CommentsIcon: React.FC<IIconProps> = ({ size = 30, isActive = false }) => {
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 3.75H24C25.2375 3.75 26.25 4.77888 26.25 6.0364V19.7548C26.25 21.0123 25.2375 22.0412 24 22.0412H8.33378C8.28018 22.0412 8.22883 22.0627 8.19123 22.1009L4.09255 26.2659C3.96703 26.3934 3.75 26.3046 3.75 26.1256V6.0364C3.75 4.77888 4.7625 3.75 6 3.75ZM23.9472 20.7843C24.4995 20.7843 24.9472 20.3365 24.9472 19.7843V5.93529C24.9472 5.38301 24.4995 4.93529 23.9472 4.93529H6.05249C5.50021 4.93529 5.05249 5.38301 5.05249 5.93529V22.9216C5.05249 23.1027 5.27397 23.1905 5.39811 23.0586L7.48011 20.8472C7.5179 20.807 7.57059 20.7843 7.62573 20.7843H23.9472Z"
                fill="#2F97FF"
            />
            <circle cx="10" cy="13.125" r="1.25" fill="#2F97FF" />
            <circle cx="15" cy="13.125" r="1.25" fill="#2F97FF" />
            <circle cx="20" cy="13.125" r="1.25" fill="#2F97FF" />
        </SvgIcon>
    );
};
