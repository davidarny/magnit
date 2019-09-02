/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Checkbox as MaterialCheckbox } from "@material-ui/core";
import * as React from "react";

type TCheckboxProps = React.ComponentProps<typeof MaterialCheckbox>;

export const Checkbox: React.FC<TCheckboxProps> = props => {
    return (
        <MaterialCheckbox
            color="primary"
            css={({ colors }) =>
                // if props.checked is not passed directly
                // then outline is always primary
                // keep grey outline when not checked
                typeof props.checked !== "undefined" && props.checked !== null
                    ? props.checked
                        ? { color: `${colors.primary} !important` }
                        : {}
                    : { color: `${colors.primary} !important` }
            }
            {...props}
        />
    );
};
