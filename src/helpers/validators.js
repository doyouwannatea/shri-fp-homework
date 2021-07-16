import {
    anyPass,
    allPass,
    propEq,
    equals,
    all,
    countBy,
    gte,
    flip,
    any,
    complement,
    not
} from 'ramda';
import { COLORS, SHAPES } from '../constants';

/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const getColorsFromShapes = shapes => Object.values(shapes);

const isWhite = equals(COLORS.WHITE);
const isRed = equals(COLORS.RED);
const isGreen = equals(COLORS.GREEN);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);

const countRed = countBy(isRed);
const countGreen = countBy(isGreen);
const countBlue = countBy(isBlue);
const countOrange = countBy(isOrange);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => {
    if (!all(isWhite, [circle, triangle])) {
        return false;
    }

    return allPass([
        propEq(SHAPES.STAR, COLORS.RED),
        propEq(SHAPES.SQUARE, COLORS.GREEN),
    ])({ star, square });

    // или так isRed(star) && isGreen(square)
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
    const colors = getColorsFromShapes(shapes);
    const countGreen = countBy(isGreen);
    return gte(countGreen(colors).true, 2);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    const colors = getColorsFromShapes(shapes);

    const blue = countBlue(colors).true;
    const red = countRed(colors).true;

    return equals(red, blue);
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (shapes) => {
    const result = allPass([
        propEq(SHAPES.CIRCLE, COLORS.BLUE),
        propEq(SHAPES.STAR, COLORS.RED),
        propEq(SHAPES.SQUARE, COLORS.ORANGE)
    ]);
    return result(shapes);

    // ну или так можно ¯\_(ツ)_/¯
    // const { star, square, circle } = shapes
    // return isBlue(circle) && isRed(star) && isOrange(square)
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
    const colors = getColorsFromShapes(shapes);

    const blue = countBlue(colors).true;
    const orange = countOrange(colors).true;
    const green = countGreen(colors).true;
    const red = countRed(colors).true;

    const gte3 = flip(gte)(3);

    return any(gte3, [blue, orange, green, red]);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. 
// Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
    const { triangle } = shapes;
    const colors = getColorsFromShapes(shapes);

    const green = countGreen(colors).true;
    if (not(equals(green, 2)) || not(isGreen(triangle))) {
        return false;
    }

    const red = countRed(colors).true;
    if (not(equals(red, 1))) {
        return false;
    }

    return true;
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => {
    const colors = getColorsFromShapes(shapes);
    const allOrange = all(isOrange);
    return allOrange(colors);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star }) => {
    const isRedOrWhite = anyPass([
        isRed,
        isWhite
    ]);

    return !isRedOrWhite(star);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => {
    const colors = getColorsFromShapes(shapes);
    const allGreen = all(isGreen);
    return allGreen(colors);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ triangle, square }) => {

    const isOneColorAndNotWhite = allPass([
        complement(isWhite),
        equals(triangle)
    ]);

    return isOneColorAndNotWhite(square);
};
