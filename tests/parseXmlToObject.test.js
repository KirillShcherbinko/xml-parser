import { parseXmlToObject } from "../parser.js";
import { DOMParser } from "xmldom";

describe (
    "Checking parseXmlToObject",
    () => {
        const xmlString = "<Title>1</Title>";
        const xmlString2 = "<Title id='2'>1</Title>";
        const xmlString3 = "<Title name='2'>1</Title>";
        const xmlString4 = "<Titl3 id='2'>1</Titl3>";


        const parser = new DOMParser();
        const dom = parser.parseFromString(xmlString, "application/xml");

        const node1 = parser.parseFromString(xmlString2, "application/xml");
        const node2 = parser.parseFromString(xmlString3, "application/xml");
        const node3 = parser.parseFromString(xmlString4, "application/xml");

        console.log(parser.parseFromString("This is not an XML!", "application/xml").childNodes);

        const expectedResult1 = [{
            tagName: "Title",
            childNodes: [],
            nodeType: 1,
            textContent: "1",
            attributes: {}
        }]

        const expectedResult2 = {
            tagName: "Title",
            childNodes: [],
            nodeType: 1,
            textContent: "1",
            attributes: {id: "2"}
        }

        test (
            "Valid data", () => {
                const res = Array.from(dom.childNodes)
                    .map(rootNode => parseXmlToObject(rootNode))
                    .filter(element => element !== "");
                expect(res).toEqual(expectedResult1);
            }
        )

        test (
            "Valid parentObject", () => {
                const res = parseXmlToObject(node1.childNodes[0]);
                expect(res).toEqual(expectedResult2);
            }
        )

        test (
            "Invalid parentObject name", () => {
                expect(() => parseXmlToObject(node2.childNodes[0])).toThrow("Некорректное имя 2");
            }
        )

        test (
            "Invalid parentObject tagName", () => {
                expect(() => parseXmlToObject(node3.childNodes[0])).toThrow("Некорректное имя Titl3");
            }
        )
    }
)