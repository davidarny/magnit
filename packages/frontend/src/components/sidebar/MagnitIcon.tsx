/** @jsx jsx */

import { jsx } from "@emotion/core";
import { SvgIcon } from "@material-ui/core";
import * as React from "react";

export const MagnitIcon: React.FC = props => {
    return (
        <SvgIcon
            width={40}
            height={40}
            viewBox="0 0 40 40"
            css={{
                fill: "none",
                width: "40px",
                height: "40px",
            }}
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0952 6.09524H40V0H10C4.47715 0 0 4.47716 0 10V27.8095H1.09524C3.85667 27.8095 6.09524 25.5709 6.09524 22.8095V11.0952C6.09524 8.33381 8.33382 6.09524 11.0952 6.09524ZM28.9048 33.9047H3.8147e-06V39.9999H30C35.5229 39.9999 40 35.5228 40 29.9999V12.1904H38.9048C36.1433 12.1904 33.9048 14.429 33.9048 17.1904V28.9047C33.9048 31.6661 31.6662 33.9047 28.9048 33.9047ZM10.6663 20.4348L15.7041 25.0511L18.2785 27.4285L29.7137 15.7924L25.8132 12.1904L18.0915 20.0476L14.3697 16.6372L10.6663 20.4348Z"
                fill="#2F97FF"
            />
        </SvgIcon>
    );
};

MagnitIcon.displayName = "MagnitIcon";
