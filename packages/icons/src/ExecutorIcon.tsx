/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const ExecutorIcon: React.FC<IIconProps> = ({ size = 40, ...props }) => {
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
                d="M19.1112 27.7776H7.55566C6.45109 27.7776 5.55566 26.8821 5.55566 25.7776V22.964C5.55566 21.4492 6.47557 20.0862 7.88035 19.5196C8.87431 19.1187 9.98005 19.2119 11.0063 19.5207C12.467 19.9604 13.8899 19.9587 15.3446 19.5769C16.5636 19.257 17.8849 19.245 18.9949 19.842C20.2915 20.5393 21.1112 21.8985 21.1112 23.3707V25.7776C21.1112 26.8821 20.2158 27.7776 19.1112 27.7776Z"
                fill="#ffffff"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M17.0278 12.7784C17.0278 14.8188 15.3737 16.4729 13.3334 16.4729C11.293 16.4729 9.63892 14.8188 9.63892 12.7784C9.63892 10.738 11.293 9.08398 13.3334 9.08398C15.3737 9.08398 17.0278 10.738 17.0278 12.7784Z"
                fill="#ffffff"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M31.3334 30.0004H19.7778C18.6733 30.0004 17.7778 29.105 17.7778 28.0004V26.2356C17.7778 24.6533 18.7756 23.243 20.2677 22.7164C21.1662 22.3993 22.1433 22.4701 23.06 22.7297C24.652 23.1804 26.1962 23.1719 27.7822 22.773C28.8654 22.5006 30.022 22.4944 31.0327 22.97C32.4347 23.6298 33.3334 25.0417 33.3334 26.5911V28.0004C33.3334 29.105 32.438 30.0004 31.3334 30.0004Z"
                fill="#ffffff"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <circle
                cx="25.5558"
                cy="16.1105"
                r="3.69444"
                fill="#ffffff"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </SvgIcon>
    );
};
