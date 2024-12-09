import { writeTxtFile, readXmlFile } from "../parser.js";

describe(
    "Checking writeTxtFile",
    () => {
        const text = readXmlFile("./output.txt");
        const validPath = "./output.txt";
        const invalidPath = "./out";

        const validCaseMessage = "Файл ./output.txt успешно записан";
        const invalidCaseMessage = "Ошибка при записи в файл: ";

        test (
            "Valid path", () => {
                const res = writeTxtFile(validPath, text);
                expect(res).toBe(validCaseMessage);
            }
        )

        test (
            "Invalid path", () => {
                expect(() => writeTxtFile(invalidPath, text).toThrow(invalidCaseMessage));
            }
        )
    }
)