import { readXmlFile } from "../parser.js";

describe(
    "Checkinf readXmlFile",
    () => {
        const validString = readXmlFile("./input.xml");
        const validInput = "./input.xml";
        const invalidInput = "../../input.xml";
        const invalidCaseMessage = "Ошибка при чтении файла: ";

        test (
            "Valid xml file", () => {
                const res = readXmlFile(validInput);
                expect(res).toBe(validString);
            }
        )

        test (
            "Invalid xml file", () => {
                expect(() => readXmlFile(invalidInput).toThrow(invalidCaseMessage));
            }
        )
    }
)