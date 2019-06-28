/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const ReportsIcon: React.FC<IIconProps> = ({ size = 36, isActive = false }) => {
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
                d="M16.4999 19.5V10.5026C11.7467 10.6164 7.92859 14.5052 7.92859 19.2857C7.92859 24.1379 11.8621 28.0714 16.7143 28.0714C21.4949 28.0714 25.3837 24.2532 25.4975 19.5H17.9999H16.7147H16.4999ZM17.9999 18V9H16.7143H16.4999V9.00219C10.9182 9.11634 6.42859 13.6767 6.42859 19.2857C6.42859 24.9664 11.0337 29.5714 16.7143 29.5714C22.3233 29.5714 26.8838 25.0817 26.9978 19.5H27.0004V18H17.9999Z"
                fill={isActive ? "#2F97FF" : "#AAB4BE"}
            />
        </SvgIcon>
    );
};
