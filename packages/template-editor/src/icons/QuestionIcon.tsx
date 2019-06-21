/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";

export const QuestionIcon: React.FC = () => {
    return (
        <SvgIcon
            width={18}
            height={18}
            viewBox="0 0 18 18"
            css={css`
                fill: none;
            `}
        >
            <path
                d="M6.375 6.75C6.375 5.85 7.25 4.5 9 4.5C11.1875 4.5 11.625 6.3 11.625 7.2C11.625 9 9.4375 9.45 9 9.9V11.25"
                stroke="#2F97FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="9" cy="13.5" r="0.5" fill="#2F97FF" stroke="#2F97FF" strokeWidth="0.5" />
        </SvgIcon>
    );
};
