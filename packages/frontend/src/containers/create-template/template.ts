import uuid from "uuid/v4";
import { EPuzzleType } from "@magnit/template-editor";

export default {
    id: uuid(),
    sections: [
        {
            id: uuid(),
            title: "Благоустройство",
            description: "",
            order: 1,
            puzzles: [
                {
                    id: uuid(),
                    title: "Основная группа вопросов",
                    description: "",
                    order: 0,
                    puzzleType: EPuzzleType.GROUP,
                    puzzles: [
                        {
                            id: uuid(),
                            puzzleType: EPuzzleType.QUESTION,
                            title: "Нужна парковка?",
                            description: "",
                            order: 0,
                            puzzles: [
                                {
                                    id: uuid(),
                                    puzzleType: EPuzzleType.INPUT_ANSWER,
                                    title: "",
                                    description: "",
                                    order: 0,
                                    puzzles: [],
                                    conditions: [],
                                    validations: [],
                                },
                            ],
                            conditions: [],
                            validations: [],
                        },
                    ],
                    conditions: [],
                    validations: [],
                },
            ],
        },
    ],
    puzzles: [],
    title: "Ведомость работ",
    description: "Описание недостатков, которые необходимо устранить",
};
