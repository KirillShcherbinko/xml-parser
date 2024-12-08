import { DOMParser } from "xmldom";

export function parseValue(element, indent, constants) {
    // Формируем массив из дочерних тегов
    const childElements = Array.from(element.childNodes)
        .filter(node => node.nodeType === 1);

    const attributes = element.attributes;

    if (childElements.length === 0 && element.nodeType === 1 && attributes.name && attributes.value) {
        constants[attributes.name] = attributes.value;
        return `define ${attributes.name} ${attributes.value}`;
    }

    // Проверка на константу (имеет целочисленное значение)
    if (childElements.length === 0 && element.nodeType === 1) {
        const text = element.textContent.trim();
        if (!isNaN(text)) {
            return text;
        } else if (constants[text]) {

            element.textContent = constants[text];
            console.log(element);
            return parseValue(element, indent, constants);
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

    return null;
}

const xmlString = `
<r name="var" value="3" />
<Book id="1" language="en">
    <Title>1</Title>
    <Tite>2</Tite>
    <dict>
        <c id="56">1</c>
        <d>
            <l>var</l>
            <l>89</l>
        </d>
        <v>2</v>
    </dict>
</Book>
`;

const parser = new DOMParser();
const dom = parser.parseFromString(xmlString, "application/xml");
const rootNodes = Array.from(dom.childNodes); // Все узлы на верхнем уровне
const result = rootNodes
    .map(rootNode => parseXMLToObject(rootNode))
    .filter(item => item !== "");
const constants = {};
const resultString = result
    .map(elem => parseValue(elem, "", constants)) // Преобразуем каждый объект в строку
    .join('\n'); 
    
console.log(resultString);