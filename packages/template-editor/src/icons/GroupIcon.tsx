/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";

export const GroupIcon: React.FC = () => {
    return (
        <SvgIcon
            width={18}
            height={18}
            viewBox="0 0 18 18"
            css={css`
                fill: none;
            `}
        >
            <circle cx="9" cy="4.875" r="1.375" stroke="#2F97FF" />
            <circle cx="4.5" cy="12.75" r="1.375" stroke="#2F97FF" />
            <circle cx="13.5" cy="12.75" r="1.375" stroke="#2F97FF" />
            <path
                d="M8.25 6V8C8.25 8.55228 7.80228 9 7.25 9H5.5C4.94772 9 4.5 9.44772 4.5 10V11.25"
                stroke="#2F97FF"
            />
            <path
                d="M9.75 6V8C9.75 8.55228 10.1977 9 10.75 9H12.5C13.0523 9 13.5 9.44772 13.5 10V11.25"
                stroke="#2F97FF"
            />
        </SvgIcon>
    );
};
