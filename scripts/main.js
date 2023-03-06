window.addEventListener('load', initialize)

let gameDiv;
let selectedCell = null;

function initialize()
{
    gameDiv = document.querySelector('.gameboard');

    createGameField();
}

function onClickCell(args)
{
    if(selectedCell)
    {       
        changeLine(selectedCell, 'row', true);
        changeLine(selectedCell, 'col', true);
        deselectCell(selectedCell);
    }
    changeLine(args.target, 'row');
    changeLine(args.target, 'col');
    SelectCell(args.target);
}

function changeLine(target, className, deselect)
{
    let lineClassName = Array.from(target.classList).find(x => x.includes(className));
    let line = document.querySelectorAll('.' + lineClassName);
    for(const el of line)
    {
        if(!deselect)
            semiSelectCell(el);
        else
            deselectCell(el);
    }

}

function SelectCell(target)
{
    target.classList.add('selected');
    selectedCell = target;
}

function deselectCell(target)
{
    target.classList.remove('selected');
    target.classList.remove('semiselected');
}

function semiSelectCell(target)
{
    target.classList.add('semiselected');
}


function createCell(y, x)
{
    let cell = document.createElement('div');
    cell.className = `cell row-${y} col-${x} hoverable`;
    cell.innerText = y;
    cell.style.backgroundColor
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
    gameDiv.append(cell);
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