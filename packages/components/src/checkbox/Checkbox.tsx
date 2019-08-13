/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { Checkbox as MaterialCheckbox } from "@material-ui/core";

type TCheckboxProps = React.ComponentProps<typeof MaterialCheckbox>;

export const Checkbox: React.FC<TCheckboxProps> = props => {
    return (
        <MaterialCheckbox
            color="primary"
            css={({ colors }) => ({ color: `${colors.primary} !important` })}
            {...props}
        />
    );
};
