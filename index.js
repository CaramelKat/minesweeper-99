let boardRow = 25, boardCol = 25, totalBombs = 25;
let board = new Array(boardCol);
for (let i = 0; i < boardCol; i++) {
    board[i] = new Array(boardRow);
}
document.addEventListener("DOMContentLoaded", function(e)
{
    generateBoard(boardRow, boardCol, totalBombs);
    let tiles = document.querySelectorAll('td');
    //console.log(tiles)
    let row = 0, col = 0;
    for(let tile of tiles) {
        tile.setAttribute('row', row);
        tile.setAttribute('col', col);
        if(col === boardCol - 1) {
            col = 0;
            row++;
        }
        else
            col++;
        tile.onclick = function (e){
            if(tile.innerText === '🚩')
                return;
            let row = tile.getAttribute('row');
            let col = tile.getAttribute('col');
            tile.style.color = null;
            tile.innerText = board[row][col];
            if(tile.innerText === '')
                return floodFill(row, col);
            processTileType(tile)
            tile.classList.add('clicked');
        }
        tile.oncontextmenu =  function (e) {
            e.preventDefault();
            if(tile.innerText === '🚩') {
                let row = tile.getAttribute('row');
                let col = tile.getAttribute('col');
                tile.style.color = null;
                tile.innerText = board[row][col];
            }
            else if(!tile.classList.contains('clicked')) {
                tile.style.color = 'unset';
                tile.innerText = '🚩';
            }
        }
    }
})

function processTileType(tile) {
    switch (tile.innerText) {
        case '1':
            tile.classList.add('one');
            break;
        case '2':
            tile.classList.add('two');
            break;
        case '3':
            tile.classList.add('three');
            break;
        case '4':
            tile.classList.add('four');
            break;
        case '5':
            tile.classList.add('five');
            break;
        case '6':
            tile.classList.add('six');
            break;
        case '7':
            tile.classList.add('seven');
            break;
        case '8':
            tile.classList.add('eight');
            break;
        case '💣':
            tile.classList.add('bomb');
            break;
    }
}

function generateBoard(num_rows, num_cols, num_mines) {
    // generate mines
    let mines = [];
    for(let i = 0; i < num_mines; i++){
        let new_mine = {};
        let new_mine_valid = false;
        while(!new_mine_valid){
            new_mine.row = Math.floor((Math.random() * num_rows));
            new_mine.col = Math.floor((Math.random() * num_cols));
            new_mine_valid = true;
            for(let j = 0; j < mines.length; j++){
                if((mines[j].row === new_mine.row) && (mines[j].col === new_mine.col)) new_mine_valid = false;
            }
        }
        mines.push(new_mine);
    }
    // generate grid
    let table = '';
    for(let r = 0; r < num_rows; r++){
        let tr = '<tr>'
        for(let c = 0; c < num_cols; c++){
            let contains_mine = false
            for(let j = 0; j < mines.length; j++){
                if((mines[j].row === r) && (mines[j].col === c)) contains_mine = true;
            }
            if(contains_mine){
                tr += '<td>&nbsp;</td>';
                board[r][c] = '💣';
            } else {
                // calculate number of adjacent mines
                let number = 0;
                for(let a = (r - 1); a <= (r + 1); a++) {
                    for(let b = (c - 1); b <= (c + 1); b++){
                        for(let j = 0; j < mines.length; j++){
                            if((mines[j].row === a) && (mines[j].col === b)) number++;
                        }
                    }
                }
                if(number === 0) {
                    tr += '<td>&nbsp;</td>';
                    board[r][c] = '';
                } else {
                    tr += '<td>&nbsp;</td>';
                    board[r][c] = number;
                }
            }
        }
        tr += '</tr>';
        table += tr;
    }
    document.getElementById('game-board').innerHTML = table;
    console.log(board)
}

function floodFill(row, col) {
    if(row >= boardRow || col >= boardCol || row < 0 || col < 0)
        return;
    let tile = document.querySelector(`[row="${row}"][col="${col}"]`);
    if(tile.classList.contains('clicked'))
        return;
    clearTile(row, col)
    if(typeof board[row][col] === 'number')
        return;
    //N
    floodFill(Number(row - 1), col);
    //NE
    //floodFill(Number(row - 1), Number(col + 1));
    //NW
    //floodFill(Number(row - 1), Number(col - 1));
    //S
    floodFill(Number(row + 1), col);
    //SE
    //floodFill(Number(row + 1), Number(col + 1));
    //SW
    //floodFill(Number(row + 1), Number(col - 1));
    //E
    floodFill(row, Number(col + 1));
    //W
    floodFill(row, Number(col - 1));

}

function clearTile(row, col) {
    //console.log(row + ' ' + col)
    let tile = document.querySelector(`[row="${row}"][col="${col}"]`);
    //console.log(tile)
    let boardTile = board[row][col];
    if(boardTile === '')
        tile.classList.add('clicked');
    else if(typeof boardTile === 'number') {
        tile.style.color = null;
        tile.innerText = board[row][col];
        processTileType(tile);
        tile.classList.add('clicked');
    }
}