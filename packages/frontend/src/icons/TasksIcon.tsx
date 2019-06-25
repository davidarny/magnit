/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const TasksIcon: React.FC<IIconProps> = ({ size = 36 }) => {
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
            <mask id="path-1-inside-1" fill="white">
                <rect x="16" y="23" width="8.5" height="1.5" rx="0.4" />
            </mask>
            <rect
                x="16"
                y="23"
                width="8.5"
                height="1.5"
                rx="0.4"
                fill="#AAB4BE"
                stroke="#2F97FF"
                strokeWidth="1.5"
                mask="url(#path-1-inside-1)"
            />
            <mask id="path-2-inside-2" fill="white">
                <rect x="11.5" y="22.5" width="2.5" height="2.5" rx="0.4" />
            </mask>
            <rect
                x="11.5"
                y="22.5"
                width="2.5"
                height="2.5"
                rx="0.4"
                fill="#2F97FF"
                stroke="#2F97FF"
                strokeWidth="2"
                mask="url(#path-2-inside-2)"
            />
            <mask id="path-3-inside-3" fill="white">
                <rect x="16" y="18" width="8.5" height="1.5" rx="0.4" />
            </mask>
            <rect
                x="16"
                y="18"
                width="8.5"
                height="1.5"
                rx="0.4"
                fill="#AAB4BE"
                stroke="#2F97FF"
                strokeWidth="1.5"
                mask="url(#path-3-inside-3)"
            />
            <mask id="path-4-inside-4" fill="white">
                <rect x="11.5" y="17.5" width="2.5" height="2.5" rx="0.4" />
            </mask>
            <rect
                x="11.5"
                y="17.5"
                width="2.5"
                height="2.5"
                rx="0.4"
                fill="#2F97FF"
                stroke="#2F97FF"
                strokeWidth="2"
                mask="url(#path-4-inside-4)"
            />
            <mask id="path-5-inside-5" fill="white">
                <rect x="16" y="13" width="8.5" height="1.5" rx="0.4" />
            </mask>
            <rect
                x="16"
                y="13"
                width="8.5"
                height="1.5"
                rx="0.4"
                fill="#AAB4BE"
                stroke="#2F97FF"
                strokeWidth="1.5"
                mask="url(#path-5-inside-5)"
            />
            <mask id="path-6-inside-6" fill="white">
                <rect x="11.5" y="12.5" width="2.5" height="2.5" rx="0.4" />
            </mask>
            <rect
                x="11.5"
                y="12.5"
                width="2.5"
                height="2.5"
                rx="0.4"
                fill="#2F97FF"
                stroke="#2F97FF"
                strokeWidth="2"
                mask="url(#path-6-inside-6)"
            />
            <mask id="path-7-inside-7" fill="white">
                <rect x="13" y="3.5" width="10" height="5.5" rx="1" />
            </mask>
            <rect
                x="13"
                y="3.5"
                width="10"
                height="5.5"
                rx="1"
                stroke="#2F97FF"
                strokeWidth="3"
                mask="url(#path-7-inside-7)"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 6H9C7.89543 6 7 6.89543 7 8V28C7 29.1046 7.89543 30 9 30H27C28.1046 30 29 29.1046 29 28V8C29 6.89543 28.1046 6 27 6H23V7.5H27C27.2761 7.5 27.5 7.72386 27.5 8V28C27.5 28.2761 27.2761 28.5 27 28.5H9C8.72386 28.5 8.5 28.2761 8.5 28V8C8.5 7.72386 8.72386 7.5 9 7.5H13V6Z"
                fill="#2F97FF"
            />
        </SvgIcon>
    );
};
