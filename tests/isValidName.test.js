import { isValidName } from "../parser.js";

describe(
    "Checking isValidName", 
    () => {
        test("Valid name", () => {
            expect(isValidName('_name')).toBe(true);
            expect(isValidName('Name')).toBe(true);
        })

        test("Invalid name", () => {
            expect(isValidName('_nam+')).toBe(false);
            expect(isValidName('Name3')).toBe(false);
        })
    }
)