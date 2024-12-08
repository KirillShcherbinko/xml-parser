import { DOMParser } from "xmldom";

export function parseValue(element) {
    // Формируем массив из дочерних тегов
    const childElements = Array.from(element.childNodes)
        .filter(node => node.nodeType === 1);

    // Проверяем, что элемент содержит только текст и является числом
    if (childElements.length === 0 && element.nodeType === 1) {
        const text = element.textContent.trim();
        if (!isNaN(text)) return text;      
    }

    // Проверка на массив
    if (childElements.length > 0 && childElements.every(child => child.tagName === childElements[0].tagName)) {
        return `list(${childElements.map(parseValue).join(", ")})`;
    }

    // Проверка на словарь
    if (childElements.length > 0 && childElements.every(child => child.tagName === childElements[0].tagName)) {
        const pairs = [];


    }


    // Если не массив и не число, то тип не определён
    throw new Error(`Не удалось определить тип элемента: ${element.tagName}`);
}


function parseXMLToObject(node) {
    // Возвращаем содержимое для тектстового узла
    if (node.nodeType === 3) {
      return node.nodeValue.trim();
    }
  
    // Создаём объект для тега
    if (node.nodeType === 1) {
        const tagObj = {
            tagName: node.tagName,
            childNodes: [],
            nodeType: node.nodeType,
            textContent: null,
            attributes: {}
        };
  
      // Добавление атрибутов элемента
    if (node.hasAttributes()) {
        Array.from(node.attributes).forEach(attribute => {
            tagObj.attributes[attribute.name] = attribute.value;
        });
    }
  
    // Добавление текста
    if (node.childNodes.length === 1 && node.nodeType === 1) {
        tagObj.textContent = node.firstChild.nodeValue.trim();
    } else {
        Array.from(node.childNodes).forEach(child => {
            const childObject = parseXMLToObject(child);
            if (childObject !== "") { // Игнорируем пустые текстовые узлы
                tagObj.childNodes.push(childObject);
            }
        });
    }
        return tagObj;
    }
  
    return null;
  }
  
// Пример использования
const xmlString = `
<Book id="1" language="en">
    <Title>1</Title>
    <Title>2</Title>
</Book>
`;
  
 const parser = new DOMParser();
const dom = parser.parseFromString(xmlString, "application/xml");
const rootNode = dom.documentElement;

const result = parseXMLToObject(rootNode);
console.log(JSON.stringify(result, null, 2));