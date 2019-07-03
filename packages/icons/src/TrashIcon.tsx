/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIconProps } from "./IIconProps";

export const TrashIcon: React.FC<IIconProps> = ({ size = 24 }) => {
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
                d="M14.25 5.125H9.75004L9.97039 4.69348L10.1969 4.25H13.8031L14.0296 4.69348L14.25 5.125ZM17.525 8.75L16.8526 19.3378C16.8526 19.3379 16.8526 19.338 16.8526 19.3381C16.8386 19.5532 16.65 19.75 16.3893 19.75H7.61071C7.34997 19.75 7.1614 19.5532 7.14744 19.3381C7.14744 19.338 7.14743 19.3379 7.14743 19.3378L6.47498 8.75H17.525Z"
                stroke="#AAB4BE"
                strokeWidth="2.5"
            />
        </SvgIcon>
    );
};
