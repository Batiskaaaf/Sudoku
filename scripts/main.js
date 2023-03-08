let gameboard = document.querySelector('.gameboard');
let validateBtn = document.querySelector('.btn-three');
let resetBtn = document.querySelector('.btn-two');
let newGameBtn = document.querySelector('.btn-one');
let selectedCell = null;
let startGrid;
let currentGrid = [[]];
const cells = [];
let prefiledCells =[];
const notFilledCells = [];
const selectedCells = [];
let level_index = 0;
let secondsElement = document.querySelector('.seconds');
let minutesElement = document.querySelector('.minutes');
let seconds = 0;
let minutes = 0;
let timerInterval;

const stopTimer = () =>
{
    clearInterval(timerInterval);
}

const resetTimer = () =>
{
    secondsElement.innerText = '00';
    minutesElement.innerText = '00';
    minutes = 0;
    seconds = 0;
    stopTimer();
}

const startTimer = () => {
    timerInterval = setInterval(() => {
        seconds++;
        if(seconds < 10)
            secondsElement.innerText = '0' + seconds;
        if(seconds > 9)
            secondsElement.innerText = seconds;
        if(seconds >= 59){
            minutes++;
            seconds = 0;
            secondsElement.innerText = '00';
        }
        if(minutes < 10)
            minutesElement.innerText = '0' + minutes;

        if (minutes > 9)
            minutesElement.innerText = minutes;
    }, 1000);
}

const newGame = () => 
{
    resetTimer();
    validateBtn.innerText = 'Validate';
    startGrid = sudokuGen(CONSTANT.LEVEL[level_index]).original;
    prefiledCells = [];
    currentGrid = startGrid.map((arr) => {
        return arr.slice();
    });

    for(let z = 0; z < cells.length; z++)
    {
        let i = Math.floor(z / CONSTANT.GRID_SIZE);
        let j = z % CONSTANT.GRID_SIZE;
        let el = cells[z];
        if(startGrid[i][j] != 0 ){
            prefiledCells.push(el);
        }
        setTimeout(() => el.innerText = startGrid[i][j] == 0 ? '' : startGrid[i][j], Math.random() * 500);
        
    }

    if(selectedCell)
    {
        deselectAll();
        deselectCell();
    }
    startTimer();
}

createGameField();
fillNumberContainer();
newGame();

document.querySelectorAll('.number').forEach(x => x.addEventListener('click', (e) => {
    if(selectedCell && !prefiledCells.find(x => x == selectedCell)){
        selectedCell.innerText = e.target.innerText == 'X' ? '' : Number(e.target.innerText);
        let row = Array.from(selectedCell.classList).find(x => x.includes('row')).charAt(4);
        let col = Array.from(selectedCell.classList).find(x => x.includes('col')).charAt(4);
        currentGrid[row][col] = e.target.innerText == 'X' ? 0 : Number(e.target.innerText);
        let check = isComplitedSudoku(currentGrid);
        if(check){
            win();
        }

    } 
})) 

newGameBtn.addEventListener('click', () =>{
    newGame();
});

validateBtn.addEventListener('click', (e) => {
    if(e.target.innerText == 'Validate')
    {
        let isGood = isValidSudoku(currentGrid);
        if(!isGood)
        {
            setTimeout(() => gameboard.classList.add('shake-animation'),100);
            setTimeout(() => gameboard.classList.remove('shake-animation'),5000);

            for (const cell of cells) {
                setTimeout(() => cell.classList.add('red-color-animation'), 100);
                setTimeout(() => cell.classList.remove('red-color-animation'), 5000);
            }
        }
        else
            greenColorAnimation();
        e.target.innerText = 'Solve it!'
    }
    else if (e.target.innerText = 'Solve it!')
    {
        solveIt();
        stopTimer(2000);
        win(2000);
    }
    if(selectedCell)
    {
        deselectAll();
        deselectCell();
    }
});

resetBtn.addEventListener('click', () => {

    for (const el of cells) {
        if(!prefiledCells.find(x => x == el))
        {
            setTimeout(() => el.innerText = '', Math.random() * 500);
        }
    }
    if(selectedCell)
    {
        deselectAll();
        deselectCell();
    }
    currentGrid = startGrid.map((arr) => {
        return arr.slice();
    });
});

function win(delay = 0)
{
    deselectCell();
    deselectAll();
    greenColorAnimation(delay);
    stopTimer();
}

function solveIt()
{
    solveSudoku(startGrid);
    let i = 0;
    let j = 0;
    for(const cell of cells) 
    {   
        setTimeout((i,j) => {
            cell.innerText = startGrid[i][j];
        }, Math.random() * 2000,i,j);
        currentGrid = startGrid.map((arr) => {
            return arr.slice();
        });
        j++;
        if(j == 9){
            i++;
            j = 0;
        }   
    }
    
}

function onClickCell(e)
{      
    if(selectedCell == e.target){
        deselectCell()
        deselectAll();
        return;
    }
    if(selectedCell)
    {
        deselectCell();
        deselectAll();
    }
    
    selectCell(e.target);

    if(e.target.innerText != '' && cells.find(x => x == e.target))
    {
        selectSameValue(e.target);
    }
}

function selectCell(target)
{
    target.classList.add('selected');
    selectedCell = target;
}

function deselectAll()
{
    for(let el of selectedCells)
    {
        el.classList.remove('selected');
    }
}

function deselectCell()
{
    if(!selectedCell)
        return;
    selectedCell.classList.remove('selected');
    selectedCell = null;
}

function selectSameValue(target)
{
    for(let el of cells.filter(x => x.innerText == target.innerText))
    {
        el.classList.add('selected');
        selectedCells.push(el);
    }
}

function createCell(y, x)
{
    let cell = document.createElement('div');
    cell.className = `cell row-${y} col-${x}`;
    cell.style.backgroundColor;
    if(x == 2 || x == 5){;
        cell.className += ' border-right';
    }
    if(x == 3 || x == 6){;
        cell.className += ' border-left';
    }
    if(y == 2 || y == 5){;
        cell.className += ' border-bottom';
    }
    if(y == 3 || y == 6){;
        cell.className += ' border-top';
    }
    cell.addEventListener('click', onClickCell);
    cells.push(cell);
    gameboard.append(cell);
}

function createGameField()
{
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {   
            createCell(i,j);
        }
    }
}

function fillNumberContainer()
{
    let container = document.querySelector('.number-container');
    for (let i = 1; i < 10; i++) {
        let el = document.createElement('div');
        el.classList.add('number');
        el.innerText = i;
        container.append(el);
    }
    let el = document.createElement('div');
        el.classList.add('number');
        el.innerText = 'X';
    container.append(el);
    
}

function greenColorAnimation(timeout = 0)
{
    let timer = timeout;
    const chunkSize = 9;
    for (let i = 0; i < cells.length; i += chunkSize) {
        const chunk = cells.slice(i, i + chunkSize);
        for (const cell of chunk) {
            setTimeout(() => cell.classList.add('green-color-animation'), timer);
            setTimeout(() => cell.classList.remove('green-color-animation'), timeout + 2500);
        }
        timer += 100;
    }
}