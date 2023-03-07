let gameboard;
let selectedCell = null;
let startGrid;
let currentGrid = [[]];
const cells = [];
let prefiledCells =[];
const notFilledCells = [];
const selectedCells = [];

gameboard = document.querySelector('.gameboard');
createGameField();
fillNumberContainer();

document.querySelector('.btn-one').addEventListener('click', () =>{
    startGrid = sudokuGen(29).original;
    prefiledCells = [];
    currentGrid = startGrid.map((arr) => {
        return arr.slice();
    });
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
            let el = cells.find(x => x.className.includes(`row-${i} col-${j}`));
            if(startGrid[i][j] != 0 ){
                prefiledCells.push(el);
            }
            setTimeout(() => el.innerText = startGrid[i][j] == 0 ? '' : startGrid[i][j], Math.random() * 500);
        }
    }

    if(selectedCell)
    {
        deselectAll();
        deselectCell(selectedCell);
    }
});

document.querySelector('.btn-three').addEventListener('click', (e) => {
    if(e.target.innerText == 'Validate')
    {
        let isGood = isValidSudoku(currentGrid);

        //TODO animate valid/invalid grid
        console.log(isGood);
        e.target.innerText = 'Solve it!'
    }
    else if (e.target.innerText = 'Solve it!')
    {
        //TODO animate solution
        solveSudoku(currentGrid);
        console.log(currentGrid);
    }
    if(selectedCell)
    {
        deselectAll();
        deselectCell(selectedCell);
    }
});

document.querySelector('.btn-two').addEventListener('click', () => {

    for (const el of cells) {
        if(!prefiledCells.find(x => x == el))
        {
            setTimeout(() => el.innerText = '', Math.random() * 500);
        }
    }
    if(selectedCell)
    {
        deselectAll();
        deselectCell(selectedCell);
    }
});

document.querySelectorAll('.number').forEach(x => x.addEventListener('click', (e) => {
    if(selectedCell && !prefiledCells.find(x => x == selectedCell)){
        selectedCell.innerText = e.target.innerText;
        let row = Array.from(selectedCell.classList).find(x => x.includes('row')).charAt(4);
        let col = Array.from(selectedCell.classList).find(x => x.includes('col')).charAt(4);
        currentGrid[row][col] = Number(e.target.innerText);
    }

    
})) 

function onClickCell(e)
{      
    if(selectedCell == e.target){
        deselectCell(selectedCell)
        deselectAll();
        return;
    }
    if(selectedCell)
    {
        deselectCell(selectedCell);
        deselectAll();
    }
    
    SelectCell(e.target);

    if(e.target.innerText != '' && cells.find(x => x == e.target))
    {
        selectSameValue(e.target);
    }
}

function SelectCell(target)
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

function deselectCell(target)
{
    target.classList.remove('selected');
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