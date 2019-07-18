/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const CheckIcon: React.FC<IIconProps> = ({ size = 24, ...props }) => {
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
                d="M17.6864 7.34467C18.1045 7.8041 18.1045 8.549 17.6864 9.00843L11.0401 16.6554C10.622 17.1149 9.94402 17.1149 9.52586 16.6554L6.31362 13.126C5.89546 12.6666 5.89546 11.9217 6.31362 11.4623C6.73177 11.0028 7.40973 11.0028 7.82788 11.4623L10.283 14.1598L16.1721 7.34467C16.5903 6.88523 17.2682 6.88523 17.6864 7.34467Z"
                fill="currentColor"
            />
        </SvgIcon>
    );
};
