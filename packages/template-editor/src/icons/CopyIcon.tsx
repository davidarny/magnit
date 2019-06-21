/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";

export const CopyIcon: React.FC = () => {
    return (
        <SvgIcon
            width={24}
            height={24}
            viewBox="0 0 24 24"
            css={css`
                fill: none;
            `}
        >
            <path
                d="M3.5 14.5V2.5H14"
                stroke="#2F97FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.75 5.75H18C18.6904 5.75 19.25 6.30964 19.25 7V19C19.25 19.6904 18.6904 20.25 18 20.25H8C7.30964 20.25 6.75 19.6904 6.75 19V5.75Z"
                stroke="#2F97FF"
                strokeWidth="1.5"
            />
        </SvgIcon>
    );
};
