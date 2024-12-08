import { readFileSync, writeFileSync } from "fs";
import { DOMParser } from "xmldom";


export function readKeys() {
    const args = process.argv.slice(2);

    // Проверка на число введённых аргументов
    if (args.length > 2) {
        throw new Error("Введено слишком много аргументов");
    } else if (args.length < 2) {
        throw new Error("Введено недостаточно аргументов");
    }
    
    // Объект с ключами командной строки
    const keys = {
        xmlFilePath: args[0],
        txtFilePath: args[1]
    };

    return keys;
}


export function readXmlFile(filePath) {
    try {
        const xmlString = readFileSync(filePath, 'utf-8');
        return xmlString;
    } catch (err) {
        throw new Error(`Ошибка при чтении файла: ${err.message}`);
    }
}

export function writeTxtFile(filePath, text) {
    try {
        writeFileSync(filePath, text, 'utf-8');
        return `Файл ${filePath} успешно записан`;
    } catch (err) {
        throw new Error(`Ошибка при записи в файл: ${err.message}`);
    }
}

export function parseValue(element, indent, constants) {
    // Формируем массив из дочерних тегов
    const childElements = Array.from(element.childNodes)
        .filter(node => node.nodeType === 1);

    const attributes = element.attributes;

    // Игнорируем первую строку файла
    if (attributes.version) {
        return;
    }

    // Проверка на константу
    if (childElements.length === 0 && element.nodeType === 1 && attributes.name && attributes.value) {
        constants[attributes.name] = attributes.value;
        return `define ${attributes.name} ${attributes.value}`;
    }

    // Работа с числами и операциями
    if (childElements.length === 0 || attributes.operation && element.nodeType === 1) {
        let text;
        if (!attributes.operation) {
            text = element.textContent.trim();
        }
        if (!isNaN(text)) {
            return text;
        } else if (constants[text]) {
            element.textContent = constants[text];
            return parseValue(element, indent, constants);
        } else if (attributes.operation === "+" && childElements.length === 2) {
            return `$[+ ${parseValue(childElements[0], indent, constants)} ${parseValue(childElements[1], indent, constants)}]`
        } else if (attributes.operation === "-" && childElements.length === 2) {
            return `$[- ${parseValue(childElements[0], indent, constants)} ${parseValue(childElements[1], indent, constants)}]`
        } else if (attributes.operation === "abs" && childElements.length === 1) {
            return `$[abs ${parseValue(childElements[0], indent, constants)}]`
        } else if (attributes.operation === "min") {
            return `$[min ${childElements.map(child => parseValue(child, indent, constants)).join(" ")}]`
        }
    }

    // Проверка на массив
    if (childElements.length > 0 && childElements.every(child => child.tagName === childElements[0].tagName)) {
        return `list(${childElements.map(child => parseValue(child, indent, constants)).join(", ")})`;
    }

    // Проверка на словарь
    if (childElements.length > 0 && !childElements.every(child => child.tagName === childElements[0].tagName)) {
        const pairs = [];

        // Добавление элементов в словарь
        childElements.forEach(child => {
            pairs.push(`    ${indent}${child.tagName} : ${parseValue(child, "    " + indent, constants)}`);
        });

        return `{\n${pairs.join('\n')}\n${indent}}`;
    }

    // Если не массив и не число, то тип не определён
    throw new Error(`Не удалось определить тип элемента: ${element.tagName}`);
}


function parseXMLToObject(node) {
    // Возвращаем содержимое для текстового узла
    if (node.nodeType === 3) {
        return node.nodeValue.trim();
    }

    // Родительский объект
    if (node.nodeType === 1) {
        const parentObject = {
            tagName: node.tagName,
            childNodes: [],
            nodeType: node.nodeType,
            textContent: null,
            attributes: {}
        };

        // Добавление атрибутов элемента
        if (node.hasAttributes()) {
            Array.from(node.attributes).forEach(attribute => {
                parentObject.attributes[attribute.name] = attribute.value;
            });
        }

        // Добавление текста
        if (node.childNodes.length === 1 && node.nodeType === 1) {
            parentObject.textContent = node.firstChild.nodeValue.trim();
        } else {
            Array.from(node.childNodes).forEach(child => {
                const childObject = parseXMLToObject(child);
                if (childObject !== "") {
                    parentObject.childNodes.push(childObject);
                }
            });
        }
        return parentObject;
    }

    return;
}

function main() {
    try {
        const { xmlFilePath, txtFilePath } = readKeys();
        const xmlString = readXmlFile(xmlFilePath);
        const parser = new DOMParser();
        const dom = parser.parseFromString(xmlString, "application/xml");
        const rootNodes = Array.from(dom.childNodes)
            .map(rootNode => parseXMLToObject(rootNode))
            .filter(element => element !== "");
        const constants = {};
        const text = rootNodes
            .map(elem => parseValue(elem, "", constants))
            .join('\n'); 

        console.log(writeTxtFile(txtFilePath, text));
    } catch(err) {
        console.error(err.message);
    }
}

main();