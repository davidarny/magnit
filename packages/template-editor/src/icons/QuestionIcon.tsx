/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const QuestionIcon: React.FC<IIconProps> = ({ size = 18 }) => {
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
                d="M6.375 6.75C6.375 5.85 7.25 4.5 9 4.5C11.1875 4.5 11.625 6.3 11.625 7.2C11.625 9 9.4375 9.45 9 9.9V11.25"
                stroke="#2F97FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="9" cy="13.5" r="0.5" fill="#2F97FF" stroke="#2F97FF" strokeWidth="0.5" />
        </SvgIcon>
    );
};
