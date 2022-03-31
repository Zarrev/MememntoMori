let numberSpanArray;
const oneLineWeeks = 13;
const AYearInWeeks = 52;
let counterForBreak = 0;
const resultHTMLId = 'result'
const infoHTML = 'info';
const yearHTML = 'year';
const containerHTML = 'container';
const resultNumberHTML = 'result-number';
let resultBlock;
const passedYear = Array.from({length: AYearInWeeks}, _ => getAWeekHTMLElement(true));
const futureYear = Array.from({length: AYearInWeeks}, _ => getAWeekHTMLElement(false));

function getAWeekHTMLElement(isFilled) {
    counterForBreak += 1;
    const result = `<div class="${isFilled ? 'week week--filled' : 'week'}"></div>`;
    return `${result}${counterForBreak % oneLineWeeks === 0 ? '<div class="break"></div>' : ''}`;
}

function addYearsToResultBlock(weeks, howMany) {
    for (let i = 0; i < howMany; i++) {
        const yearElement = document.createElement('div');
        yearElement.className = 'year';
        yearElement.innerHTML = weeks.join('');
        resultBlock.appendChild(yearElement);
    }
}

function getPassedYearsNumber(startDate) {
    const date1 = new Date(startDate);
    const date2 = new Date();
    const isSubtractionNeeded = date2.getMonth() < date1.getMonth() ?? (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate());
    const diffBetweenDates = date2.getFullYear() - date1.getFullYear()
    return isSubtractionNeeded ? diffBetweenDates - 1 : diffBetweenDates;
}

function getFutureYearsNumber(startDate, targetAge) {
    const date = new Date(startDate);
    return (date.getFullYear() + targetAge) - new Date().getFullYear();
}

function getCurrentWeek() {
    const currentDate = new Date();
    const oneJan = new Date(currentDate.getFullYear(),0,1);
    const numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil(( currentDate.getDay() + 1 + numberOfDays) / 7);
}

function getResultBlock() {
    const resultBlock = document.getElementById(resultHTMLId);
    resultBlock.innerHTML = '';

    return resultBlock;
}

function updateInfo(percent) {
    const infoSpan = document.getElementById(infoHTML);
    infoSpan.innerHTML = `You used your life <b>${percent.toFixed(2)}%</b> Use the remaining wisely!`;
}

function getGridElementsPosition(index) {
    const colCount = window.getComputedStyle(resultBlock).gridTemplateColumns.split(" ").length;
    return { row: Math.floor(index / colCount), column: Math.floor(index % colCount) };
}

function addYearsToGridItems() {
    let gridItems = document.getElementsByClassName(yearHTML);
    let column = 0;
    let actualNumber = 0;
    for (let i = 0; i < gridItems.length; i++) {
        let position = getGridElementsPosition(i);
        if (column > position.column) {
            actualNumber += getGridElementsPosition(i - 1).column + 1;
            numberSpanArray.push(actualNumber)
        }
        column = position.column;
    }
    numberSpanArray.push(actualNumber + column + 1);
    const resultNumberBlock = document.getElementById(resultNumberHTML);
    resultNumberBlock.innerHTML = '';
    numberSpanArray.forEach(value => {
        const spanElement = document.createElement('span');
        spanElement.innerText = value;
        resultNumberBlock.appendChild(spanElement);

    });
}

function calc() {
    numberSpanArray = [];
    document.getElementById(containerHTML).className = document.getElementById(containerHTML).className.split('hide')[0];
    const currentWeek = getCurrentWeek();
    resultBlock = getResultBlock();
    const actualYear = Array.from({length: AYearInWeeks},(_, index) => getAWeekHTMLElement(index < currentWeek));
    const targetAge = parseInt(document.getElementById('age').value, 10);
    const birthDate = document.getElementById('birth-date').value;
    const passedYearNumbers = getPassedYearsNumber(birthDate);
    const futureYearNumbers = getFutureYearsNumber(birthDate, targetAge);
    const usedPercent = passedYearNumbers / targetAge * 100;
    updateInfo(usedPercent);
    addYearsToResultBlock(passedYear, passedYearNumbers);
    addYearsToResultBlock(actualYear, 1);
    addYearsToResultBlock(futureYear, futureYearNumbers);
    addYearsToGridItems();
    return false;
}
