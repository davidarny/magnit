/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const TextFieldIcon: React.FC<IIconProps> = ({ size = 18, ...props }) => {
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
            <rect x="2.25" y="6" width="12.75" height="1.5" rx="0.75" fill="#286BFF" />
            <rect x="2.25" y="10.5" width="10.5" height="1.5" rx="0.75" fill="#286BFF" />
        </SvgIcon>
    );
};
