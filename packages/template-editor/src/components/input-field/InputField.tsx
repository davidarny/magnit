import { TextField } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { TextFieldProps } from "@material-ui/core/TextField";

export const InputField: React.FC<TextFieldProps> = ({
    placeholder,
    defaultValue,
    fullWidth,
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
                    color: theme.colors.secondary,
                },
                div: {
                    minHeight: theme.spacing(6),
                    ":after": {
                        borderBottom: `2px solid ${theme.colors.primary}`,
                    },
                },
            })}
            {...rest}
        />
    );
};
