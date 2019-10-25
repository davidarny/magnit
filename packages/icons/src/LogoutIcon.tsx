/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const LogoutIcon: React.FC<IIconProps> = ({ size = 40, ...props }) => {
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
                d="M15.1945 8.66699C15.1945 7.97664 15.7541 7.41699 16.4445 7.41699H30.2222C30.9126 7.41699 31.4722 7.97664 31.4722 8.66699V32.5837H15.1945V8.66699Z"
                fill="white"
                stroke="#AAB4BE"
                strokeWidth="1.5"
            />
            <path
                d="M10.75 8.66699C10.75 7.97664 11.3096 7.41699 12 7.41699H25.7778C26.4681 7.41699 27.0278 7.97664 27.0278 8.66699V32.5837H10.75V8.66699Z"
                fill="white"
                stroke="#AAB4BE"
                strokeWidth="1.5"
            />
            <rect x="30" y="16.667" width="2.22222" height="5.55556" fill="white" />
            <circle
                cx="23.0555"
                cy="19.722"
                r="0.5"
                fill="#AAB4BE"
                stroke="#AAB4BE"
                strokeWidth="0.666666"
            />
            <path
                d="M38.8889 19.6338H31.1111"
                stroke="#AAB4BE"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M38.89 19.6299L36.6678 21.4817"
                stroke="#AAB4BE"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M38.8867 19.6292L36.6645 17.7773"
                stroke="#AAB4BE"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
};
