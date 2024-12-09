import { readKeys } from "../parser.js";

describe(
    "Checking readKeys",
    () => {
        let originalArgv;
        beforeAll(() => {originalArgv = process.argv;});
        afterAll(() => {process.argv = originalArgv;});

        const expectedKeys = {
            xmlFilePath: "./input.xml",
            txtFilePath: "./output.txt",
        }

        const InvalidTestCases = [
            {
                in: ["node", "parser.js", "./first.xml", "./second.txt", "one more arg"],
                message: "Введено слишком много аргументов"
            },
            {
                in: ["node", "parser.js", "onearg.xml"],
                message: "Введено недостаточно аргументов"
            }
        ];
        
        test (
            "Valid number of arguments",
            () => {
                process.argv = ["node", "parser.js", "./input.xml", "./output.txt"];
                const res = readKeys();
                expect(res).toEqual(expectedKeys);
            }
        );

        InvalidTestCases.forEach(test => {
            it (
                "Invalid arguments",
                () => {
                    process.argv = test.in;
                    expect(() => readKeys().toThrow(test.message));
                }
            )
        })
    }
)