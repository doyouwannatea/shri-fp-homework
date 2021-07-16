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

import { isNumber } from 'lodash';
import {
    both,
    compose,
    curry,
    flip,
    gt,
    isNil,
    lt,
    not,
    pipeWith,
    prop,
    tap
} from 'ramda';

import Api from '../tools/api';

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {

    // Pipes
    // --------------------------------------------------------------------
    const pipeWithPromise = pipeWith(async (toNext, value) => {
        try {
            const res = await value;
            return toNext(res);
        } catch (error) {
            handleError(error);
        }
    });

    const pipeWhileNotNil = pipeWith((f, val) => isNil(val) ? val : f(val));
    // --------------------------------------------------------------------

    // Helpers
    // --------------------------------------------------------------------
    const getResultProp = prop('result');
    const getLength = value => String(value).length;
    const log = tap(writeLog);

    // Predicats
    const lt10 = flip(lt)(10);
    const gt2 = flip(gt)(2);
    const isPositive = both(isNumber, lt(0));
    const isNegativeNumber = compose(not, isPositive);
    const isLengthGte10 = compose(not, lt10, getLength);
    const isLengthLte2 = compose(not, gt2, getLength);
    const validate = value => {
        if (isNegativeNumber(value))
            return handleError(`Value must be positive number: ${value}`);

        if (isLengthGte10(value))
            return handleError(`Length must be less than 10: ${value}`);

        if (isLengthLte2(value))
            return handleError(`Length must be greater than 2: ${value}`);

        return value;
    };

    // Math operations
    const remaind = curry((divider, value) => value % divider);
    const remainderOfThree = remaind(3);

    const pow = curry(flip(Math.pow));
    const square = pow(2);

    // Helpers for api
    const convertApi = api.get('https://api.tech/numbers/base');
    const fromDecimalToBinary = value => convertApi({ from: 10, to: 2, number: value });
    const animalsApi = id => api.get('https://animals.tech/' + id, {});
    // --------------------------------------------------------------------

    return pipeWhileNotNil([
        log,
        Number,
        validate,
        Math.round,
        log,
        pipeWithPromise([
            fromDecimalToBinary,
            getResultProp,
            log,
            getLength,
            log,
            square,
            log,
            remainderOfThree,
            log,
            animalsApi,
            getResultProp,
            handleSuccess
        ])
    ])(value);
};

export default processSequence;
