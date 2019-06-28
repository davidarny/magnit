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
                    puzzleType: EPuzzleType.QUESTION,
                    title: "Нужна парковка?",
                    description: "",
                    order: 0,
                    puzzles: [
                        {
                            id: uuid(),
                            puzzleType: EPuzzleType.CHECKBOX_ANSWER,
                            title: "Да",
                            description: "",
                            order: 0,
                            puzzles: [],
                            conditions: [],
                            validations: [],
                        },
                        {
                            id: uuid(),
                            puzzleType: EPuzzleType.CHECKBOX_ANSWER,
                            title: "Нет",
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
                {
                    id: uuid(),
                    title: "",
                    description: "",
                    order: 1,
                    puzzleType: EPuzzleType.GROUP,
                    puzzles: [
                        {
                            id: uuid(),
                            puzzleType: EPuzzleType.QUESTION,
                            title: "Размеры парковки",
                            description: "",
                            order: 0,
                            puzzles: [
                                {
                                    id: uuid(),
                                    puzzleType: EPuzzleType.NUMERIC_ANSWER,
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
