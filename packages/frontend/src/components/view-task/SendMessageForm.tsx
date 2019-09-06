/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button, InputField } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import { Grid } from "@material-ui/core";
import * as React from "react";
import { useCallback, useState } from "react";

interface ISendMessageFormProps {
    onSubmit(title: string, message: string): void;
}

export const SendMessageForm: React.FC<ISendMessageFormProps> = props => {
    const { onSubmit } = props;

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const onSubmitCallback = useCallback(
        (event: React.FormEvent) => {
            event.preventDefault();
            onSubmit(title, message);
        },
        [title, message, onSubmit],
    );

    function onChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
        setTitle(event.target.value);
    }

    function onChangeMessage(event: React.ChangeEvent<HTMLInputElement>) {
        setMessage(event.target.value);
    }

    return (
        <form action="" onSubmit={onSubmitCallback}>
            <Grid container>
                <Grid
                    item
                    xs={12}
                    css={theme => ({
                        fontSize: theme.fontSize.larger,
                        marginBottom: theme.spacing(2),
                    })}
                >
                    Введите email, на который будет отправлен отчет
                </Grid>
                <Grid item xs={12}>
                    <InputField
                        onChange={onChangeTitle}
                        value={title}
                        placeholder="Заголовок"
                        autoFocus
                        type="text"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputField
                        onChange={onChangeMessage}
                        value={message}
                        placeholder="Текст сообщения"
                        autoFocus
                        type="text"
                        required
                        fullWidth
                        multiline
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        css={theme => ({
                            display: "flex",
                            margin: `${theme.spacing(6)} auto 0`,
                        })}
                    >
                        <SendIcon />
                        Отправить
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};
