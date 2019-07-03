/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const SectionIcon: React.FC<IIconProps> = ({ size = 18 }) => {
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
            <rect x="3" y="4.5" width="12" height="3" rx="1" fill="#2F97FF" />
            <rect x="3" y="10.5" width="12" height="3" rx="1" fill="#2F97FF" />
        </SvgIcon>
    );
};
