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
                d="M20.7861 8.05612C24.4363 8.68404 27.3164 11.5641 27.9443 15.2143L20.7861 15.2143V8.05612ZM20.7861 6.53716C25.2661 7.19175 28.8087 10.7343 29.4633 15.2143C29.5348 15.7039 29.5718 16.2048 29.5718 16.7143H28.0718L20.7861 16.7143H19.2861V15.2143V7.92857V6.42857C19.7956 6.42857 20.2965 6.46562 20.7861 6.53716ZM16.5 10.5026V19.5H16.7148H18H25.4976C25.3838 24.2532 21.495 28.0714 16.7144 28.0714C11.8622 28.0714 7.92871 24.1379 7.92871 19.2857C7.92871 14.5052 11.7469 10.6164 16.5 10.5026ZM18 9V18H27.0006V19.5H26.998C26.8839 25.0817 22.3235 29.5714 16.7144 29.5714C11.0338 29.5714 6.42871 24.9664 6.42871 19.2857C6.42871 13.6767 10.9183 9.11634 16.5 9.00219V9H16.7144H18Z"
                fill={isActive ? "#2F97FF" : "#AAB4BE"}
            />
        </SvgIcon>
    );
};
