/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const PlusIcon: React.FC<IIconProps> = ({ size = 24 }) => {
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
            <rect x="11" y="7" width="2" height="10" rx="1" fill="white" />
            <rect
                x="7"
                y="13"
                width="2"
                height="10"
                rx="1"
                transform="rotate(-90 7 13)"
                fill="white"
            />
        </SvgIcon>
    );
};
