import { parseValue } from "../parser.js";

describe (
    "Checking parseValue",
    () => {
        const constants = {varA: "1", varB: "2"};
        const invalidCaseMessage = "Не удалось определить тип элемента: Unknown";

        const unknownObject = {
            tagName: "Unknown",
            childNodes: [],
            nodeType: 1,
            textContent: "string",
            attributes: {}
        };

        const operationObject1 = {
            tagName: "p",
            childNodes: [],
            nodeType: 1,
            textContent: "2",
            attributes: {}
        }

        const operationObject2 = {
            tagName: "p",
            childNodes: [],
            nodeType: 1,
            textContent: "3",
            attributes: {}
        }

        const dictObject1 = {
            tagName: "pop",
            childNodes: [],
            nodeType: 1,
            textContent: "3",
            attributes: {}
        }

        const dictObject2 = {
            tagName: "nepop",
            childNodes: [operationObject1, operationObject2],
            nodeType: 1,
            textContent: null,
            attributes: {}
        }

        const varObject1 = {
            tagName: "w",
            childNodes: [],
            nodeType: 1,
            textContent: "varA",
            attributes: {}
        }

        const varObject2 = {
            tagName: "e",
            childNodes: [],
            nodeType: 1,
            textContent: "varB",
            attributes: {}
        }

        const validTestCases = [
            {
                object: {
                    tagName: "a",
                    childNodes: [],
                    nodeType: 1,
                    textContent: "8",
                    attributes: {name: "newVar", value: "4"}
                },
                expected: "define newVar 4"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [operationObject1, operationObject2],
                    nodeType: 1,
                    textContent: null,
                    attributes: {operation: "+"}
                },
                expected: "$[+ 2 3]"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [operationObject1, operationObject2],
                    nodeType: 1,
                    textContent: null,
                    attributes: {operation: "-"}
                },
                expected: "$[- 2 3]"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [operationObject1],
                    nodeType: 1,
                    textContent: null,
                    attributes: {operation: "abs"}
                },
                expected: "$[abs 2]"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [operationObject1, operationObject2],
                    nodeType: 1,
                    textContent: null,
                    attributes: {operation: "min"}
                },
                expected: "$[min 2 3]"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [operationObject1, operationObject2, varObject1],
                    nodeType: 1,
                    textContent: null,
                    attributes: {operation: "min"}
                },
                expected: "$[min 2 3 varA]"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [],
                    nodeType: 1,
                    textContent: 1,
                    attributes: {}
                },
                expected: "1"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [operationObject1, operationObject2],
                    nodeType: 1,
                    textContent: null,
                    attributes: {}
                },
                expected: "list(2, 3)"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [dictObject1, dictObject2],
                    nodeType: 1,
                    textContent: null,
                    attributes: {}
                },
                expected: "{\n    pop : 3\n    nepop : list(2, 3)\n}"
            },
            {
                object: {
                    tagName: "a",
                    childNodes: [varObject1, varObject2],
                    nodeType: 1,
                    textContent: null,
                    attributes: {operation: "+"}
                },
                expected: "$[+ varA varB]"
            }
        ];

        validTestCases.forEach(test => {
            it (
                "Valid version ranges",
                () => {
                    const res = parseValue(test.object, "", constants);
                    console.log(res);
                    expect(res).toBe(test.expected);
                }
            )
        })

        test (
            "Invalid value",
            () => {
                expect(() => parseValue(unknownObject, "", constants).toThrow(invalidCaseMessage));
            }
        )
    }
)