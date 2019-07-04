/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const QuestionIcon: React.FC<IIconProps> = ({ size = 30 }) => {
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
            <circle cx="15" cy="15" r="13" stroke="#2F97FF" strokeWidth="1.5" />
            <rect
                x="14.0625"
                y="9.84375"
                width="1.875"
                height="10.3125"
                rx="0.9375"
                fill="#2F97FF"
            />
            <rect
                x="9.84375"
                y="15.9375"
                width="1.875"
                height="10.3125"
                rx="0.9375"
                transform="rotate(-90 9.84375 15.9375)"
                fill="#2F97FF"
            />
        </SvgIcon>
    );
};
