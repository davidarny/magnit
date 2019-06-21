/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";

export const ImageIcon: React.FC = () => {
    return (
        <SvgIcon
            width={24}
            height={24}
            viewBox="0 0 24 24"
            css={css`
                fill: none;
            `}
        >
            <path d="M14.14 12L11.14 15.87L9 13.28L6 17.14H18L14.14 12Z" fill="#2F97FF" />
            <rect
                x="3.75"
                y="3.75"
                width="16.5"
                height="16.5"
                rx="1.25"
                stroke="#2F97FF"
                stroke-width="1.5"
            />
            <circle cx="9" cy="10" r="0.5" fill="#3F4752" stroke="#2F97FF" />
        </SvgIcon>
    );
};
