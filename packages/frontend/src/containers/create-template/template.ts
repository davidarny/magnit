import uuid from "uuid/v4";
import { EPuzzleType } from "@magnit/template-editor";

export default {
    id: uuid(),
    sections: [
        {
            id: uuid(),
            title: "",
            order: 0,
            puzzles: [
                {
                    id: uuid(),
                    title: "",
                    order: 0,
                    puzzleType: EPuzzleType.GROUP,
                    puzzles: [
                        {
                            id: uuid(),
                            puzzleType: EPuzzleType.QUESTION,
                            title: "",
                            order: 0,
                            puzzles: [
                                {
                                    id: uuid(),
                                    puzzleType: EPuzzleType.INPUT_ANSWER,
                                    title: "",
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
                {
                    id: uuid(),
                    title: "",
                    order: 1,
                    puzzleType: EPuzzleType.GROUP,
                    puzzles: [
                        {
                            id: uuid(),
                            puzzleType: EPuzzleType.QUESTION,
                            title: "",
                            order: 0,
                            puzzles: [
                                {
                                    id: uuid(),
                                    puzzleType: EPuzzleType.INPUT_ANSWER,
                                    title: "",
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
                            puzzleType: EPuzzleType.QUESTION,
                            title: "",
                            order: 1,
                            puzzles: [
                                {
                                    id: uuid(),
                                    puzzleType: EPuzzleType.INPUT_ANSWER,
                                    title: "",
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
        {
            id: uuid(),
            title: "",
            order: 1,
            puzzles: [
                {
                    id: uuid(),
                    title: "",
                    order: 0,
                    puzzleType: EPuzzleType.GROUP,
                    puzzles: [
                        {
                            id: uuid(),
                            puzzleType: EPuzzleType.QUESTION,
                            title: "",
                            order: 0,
                            puzzles: [
                                {
                                    id: uuid(),
                                    puzzleType: EPuzzleType.INPUT_ANSWER,
                                    title: "",
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
    title: "",
    description: "",
};
