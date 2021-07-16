import { isNumber } from 'lodash';
import {
    both, curry, flip, gt, lt, not
} from 'ramda';

/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';

const api = new Api();

// Хелперы для api
const convertApi = api.get('https://api.tech/numbers/base');
const animalsApi = id => api.get('https://animals.tech/' + id, {});

// Хелперы
const remaind = curry((divider, value) => value % divider);
const pow = curry(flip(Math.pow));

const square = pow(2);
const remainderOfThree = remaind(3);

const isPositive = both(isNumber, lt(0));
const getLength = value => String(value).length;

const processSequence = async ({ value, writeLog, handleSuccess, handleError }) => {
    writeLog(value);

    let numValue = Number(value);
    const length = getLength(value);

    const lt10 = lt(length, 10);
    const gt2 = gt(length, 2);

    if (not(isPositive(numValue)))
        return handleError(`Value must be positive number: ${value}`);

    if (not(lt10))
        return handleError(`Length must be less than 10: ${value}`);

    if (not(gt2))
        return handleError(`Length must be greater than 2: ${value}`);

    numValue = Math.round(numValue);
    writeLog(numValue);

    try {
        let {
            result: binaryValue
        } = await convertApi({ from: 10, to: 2, number: numValue });

        writeLog(binaryValue);

        binaryValue = getLength(binaryValue);
        writeLog(binaryValue);

        binaryValue = square(binaryValue);
        writeLog(binaryValue);

        binaryValue = remainderOfThree(binaryValue);
        writeLog(binaryValue);

        const {
            result: animal
        } = await animalsApi(binaryValue);

        handleSuccess(animal);
    } catch (error) {
        handleError('Network error: ' + error);
    }
};

export default processSequence;
