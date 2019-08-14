/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const UploadFilesIcon: React.FC<IIconProps> = ({ size = 22, ...props }) => {
    return (
        <SvgIcon
            width={size}
            height={size + 4}
            viewBox={`0 0 ${size} ${size + 4}`}
            css={css`
                fill: none;
                width: ${size}px;
                height: ${size}px;
            `}
            {...props}
        >
            <path
                d="M11 6.8125V15.5781"
                stroke="#286BFF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4.58301 15.0625V19.0875C4.58301 19.1427 4.62778 19.1875 4.68301 19.1875H17.3163C17.3716 19.1875 17.4163 19.1427 17.4163 19.0875V15.0625"
                stroke="#286BFF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11 6.8125L12.8333 9.39062"
                stroke="#2F97FF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.0003 6.8125L9.16699 9.39062"
                stroke="#2F97FF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
};
