/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const SectionIcon: React.FC<IIconProps> = ({ size = 30 }) => {
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
            <rect
                x="3"
                y="6.25"
                width="22.5"
                height="5.5"
                rx="1"
                stroke="#2F97FF"
                strokeWidth="1.5"
            />
            <rect
                x="3"
                y="17.5"
                width="22.5"
                height="5.5"
                rx="1"
                stroke="#2F97FF"
                strokeWidth="1.5"
            />
        </SvgIcon>
    );
};
