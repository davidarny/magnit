/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";

export const SectionIcon: React.FC = () => {
    return (
        <SvgIcon
            width={18}
            height={18}
            viewBox="0 0 18 18"
            css={css`
                fill: none;
            `}
        >
            <rect x="3" y="4.5" width="12" height="3" rx="1" fill="#2F97FF" />
            <rect x="3" y="10.5" width="12" height="3" rx="1" fill="#2F97FF" />
        </SvgIcon>
    );
};
