/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const CheckboxIcon: React.FC<IIconProps> = ({ size = 18, ...props }) => {
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
                d="M2.25 4.275C2.25 3.15662 3.15662 2.25 4.275 2.25H13.725C14.8434 2.25 15.75 3.15662 15.75 4.275V13.725C15.75 14.8434 14.8434 15.75 13.725 15.75H4.275C3.15662 15.75 2.25 14.8434 2.25 13.725V4.275Z"
                fill="#286BFF"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.554 6.2068C12.8153 6.48246 12.8153 6.9294 12.554 7.20506L8.40008 11.7933C8.13874 12.0689 7.71501 12.0689 7.45366 11.7933L5.44601 9.67563C5.18466 9.39997 5.18466 8.95303 5.44601 8.67737C5.70736 8.40171 6.13108 8.40171 6.39243 8.67737L7.92687 10.2959L11.6076 6.2068C11.8689 5.93114 12.2926 5.93114 12.554 6.2068Z"
                fill="white"
            />
        </SvgIcon>
    );
};
