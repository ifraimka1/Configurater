/**
 * Это модуль. Его имя module:myFunctions
 * Содержит основную логику веб-приложения
 *
 * @module myFunctions
 */
import { readFileSync } from 'fs';

/**
 * @type {Number}
 */
const defaultPrice = 40000;


/**
 * Возвращает стоимость по умолчанию (defaultPrice)
 *
 * @returns {Number}
 */
function getDefaultPrice() {
    return defaultPrice;
}

/**
 * Рассчитывает конечную стоимость с учетом выбранных опций.
 *
 * @param {Array<object>} options - Массив опций
 * @returns {Number} Возвращает стоимость
 */
function calculateCost(options) {
    let result = defaultPrice;

    for (let option of options) {
        switch (option.selectedVar) {
            case 0:
                result += option.price[0];
                break;
            case 1:
                result += option.price[1];
                break;
            case 2:
                result += option.price[2];
                break;
        }
    }

    return result;
}

/**
 * Считывает доступные опции из файла.
 * Данные о доступных опциях хранятся в виде: Опция,вариант1,цена1,вариант2,цена2.
 * При считывании строка разбивается по переносу строки (\r\n), затем по запятым.
 * Из этих данных формируется массив объектов, где каждый объект - отдельная опция.
 *
 * У каждого объекта опции есть следующие поля:
 * 1. name {String} - название опции;
 * 2. var {Array<String>} - варианты опций;
 * 3. price {Array<Number>} - стоимость вариантов;
 * 4. selectedVar {Number} - текущая выбранная опция (по умолчанию = 0).
 *
 * Пример такого объекта опций:
 * {
 *     name: 'color',
 *     var: ['black', 'white', 'orange'],
 *     price: [0, 500, 1000],
 *     selectedVar: 0
 * }
 *
 * @returns {Array<object>} - Возвращает массив опций (объектов)
 */
function readOptions() {
    const options = [];
    const data = readFileSync("./options.txt", { encoding: 'utf8', flag: 'r' });
    const rowArray = data.split('\r\n');

    for (let i = 0; i < rowArray.length; i++) {
        const row = rowArray[i].split(',');
        const option = {
            name: row[0],
            var: [],
            price: [],
            selectedVar: 0
        };

        for (let j = 1; j < row.length; j += 2) {
            option.var.push(row[j]);
            option.price.push(parseInt(row[j + 1]));
        }

        options.push(option);
    }

    return options;
}

/**
 * Составляет название необходимой картинки из выбранных опций
 *
 * @param {Array<object>} options - Массив опций (объектов)
 * @returns {String} Возвращает название необходимой картинки
 */
function getImageName(options) {
    let imageName = "";

    for (let option of options) {
        imageName += option.var[option.selectedVar];
    }

    return imageName;
}

/**
 * Составляет текст для записи заказа в файл.
 * Текст включает в себя email, название выбранных опций и конечную стоимость всего заказа
 *
 * @param {Array<object>} options - Массив опций с указанием выбранных
 * @param {String} email - Email заказчика
 * @returns {String} Возвращает текст для записи заказа в файл
 */
function getStringForFile(options, email) {
    let result = `email:${email}\n`;

    for (const option of options) {
        result += `${option.name}:${option.var[option.selectedVar]}\n`;
    }

    result += calculateCost(options);

    return result;
}

export {getDefaultPrice, calculateCost, readOptions, getImageName, getStringForFile}