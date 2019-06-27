import { TextField } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { TextFieldProps } from "@material-ui/core/TextField";

export interface IInputField {
    isFocus: boolean;
}

export const InputField: React.FC<IInputField & TextFieldProps> = ({
    placeholder,
    defaultValue,
    fullWidth,
    isFocus,
    ...rest
}) => {
    return (
        <TextField
            fullWidth={fullWidth}
            placeholder={placeholder}
            defaultValue={defaultValue}
            css={theme => ({
                minHeight: theme.spacing(6),
                height: "100%",
                input: {
                    position: "absolute",
                    bottom: 0,
                    fontFamily: "Roboto",
                    color: theme.colors.black,
                },
                div: {
                    minHeight: theme.spacing(6),
                    ":before": {
                        borderBottom: isFocus ? `1px solid rgba(0, 0, 0, 0.42)` : "none !important",
                    },
                    ":after": {
                        borderBottom: isFocus
                            ? `2px solid ${theme.colors.primary}`
                            : "none !important",
                    },
                },
            })}
            {...rest}
        />
    );
};
