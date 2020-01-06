/** @jsx jsx */

import { jsx } from "@emotion/core";
import { SvgIcon } from "@material-ui/core";
import React from "react";

export const LogoIcon: React.FC = () => (
    <SvgIcon
        css={{ width: "100px", height: "100px" }}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.2381 15.2381H100V0H30C13.4315 0 0 13.4314 0 30V69.5238H0.238098C8.52237 69.5238 15.2381 62.8081 15.2381 54.5238V30.2381C15.2381 21.9538 21.9538 15.2381 30.2381 15.2381ZM69.7619 84.7619H7.62939e-06V100H70C86.5686 100 100 86.5685 100 70V30.4762H99.7619C91.4776 30.4762 84.7619 37.1919 84.7619 45.4762V69.7619C84.7619 78.0462 78.0462 84.7619 69.7619 84.7619ZM26.6666 51.087L39.2363 62.605L45.6972 68.5714L74.2854 39.4812L64.534 30.4762L45.23 50.1193L35.925 41.5928L26.6666 51.087Z"
            fill="#286BFF"
        />
    </SvgIcon>
);
