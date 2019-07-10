/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { SectionTitle } from "components/section-title";
import { SectionLayout } from "components/section-layout";
import { Link } from "@reach/router";
import { CustomButton } from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { EmptyList } from "../../components/list";

export const Templates: React.FC = () => {
    return (
        <SectionLayout>
            <SectionTitle title="Список шаблонов" />
            <EmptyList
                title={"Шаблонов нет"}
                actionName={"Создать шаблон"}
                button={
                    <CustomButton
                        component={Link}
                        to="/templates/create"
                        icon={<AddIcon />}
                        title={"Создать шаблон"}
                        css={css`
                            width: 180px;
                        `}
                    />
                }
                description={"Для создания шаблона нажмите кнопку"}
            />
        </SectionLayout>
    );
};
