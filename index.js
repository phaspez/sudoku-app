import { solvePuzzle } from "./node_modules/sudoku/dist-web/index.js";


let difficulty = {
    "very easy": 70,
    "easy": 55,
    "medium": 47,
    "hard": 35,
    "inhuman": 25
}


let solution;
let board;

let numSelected = null;
let tileSelected = null;

let errors = 0;
let overlay;
let progression = 0;
let empty_tile = 0;


window.onload = function(){
    onload_set_game();

    overlay = document.getElementById('overlay');
    document.addEventListener('mousemove', function(event) {
        overlay.style.display = 'block';
        overlay.style.left = (event.pageX - 15) + 'px';
        overlay.style.top = (event.pageY - 15) + 'px';

        
    });
      
    /*ocument.addEventListener('mouseout', function() {
        overlay.style.display = 'none';
    });*/

    
    let difficultyButtons = document.getElementsByClassName("difficulty-selection");
    console.log(difficultyButtons);
    for (let i = 0; i < difficultyButtons.length; i++) {
        difficultyButtons[i].addEventListener("click", onDifficultyButtonClicked);
    }
}

// onstart, create a sudoku board
function onload_set_game(){
    generateBoard("easy");
    document.getElementById("current-difficulty").innerText = "Easy";

    for (let i = 1; i <= 9; i++){
        let number = document.createElement("button");
        number.id = i;
        number.innerText = i;
        //number.className = "number";
        number.classList.add("number");
        number.type = "radio";
        number.addEventListener("click", selectNumber);

        document.getElementById("digits").appendChild(number);
    }

    let iterator = 0
    for (let x = 0; x < 9; x++){
        for (let y = 0; y < 9; y++){
            let tile = document.createElement("button");
            tile.id = iterator.toString();
            tile.classList.add("tile");
            tile.classList.add(".well-lg");
            if (board[iterator] != "-"){
                tile.innerText = board[iterator];
                tile.classList.add("hint_tile");
            }

            if (y == 2 || y == 5){
                tile.classList.add("tile_border_right");
            }
            if (x == 2 || x == 5){
                tile.classList.add("tile_border_bottom");
            }
            iterator+= 1;
            tile.addEventListener("click", selectTile);
            document.getElementById("board").appendChild(tile);
        }
    }
}

// create new sudoku board based on difficulty, and set to the solution and board letiable
function generateBoard(diff="medium"){
    solution = solvePuzzle(new Array(81).fill(null));
    solution = solution.map((value) => (value + 1));
    board = [...solution];

    let removeCount = 81 - (difficulty[diff] || 25);
    empty_tile = 81-difficulty[diff];
    let tileIndex;
    while (removeCount > 0) {
        tileIndex = Math.floor(Math.random()*board.length);
        if (board[tileIndex] == '-'){} 
        else {
            board[tileIndex] = '-';
            removeCount--;
        }
    }
    console.log("board: ", board);
    console.log("solution: ", solution);
}

function updateBoard(){
    let bar = document.getElementById("progression-bar");
    progression = 0;
    bar.style = "width:"+progression+"%";
    for (let i = 0; i < 81; i++){
        let tile = document.getElementById(i.toString());
        if (tile.classList.contains("hint_tile")){
            tile.classList.remove("hint_tile"); 
        }
        if (board[i] == '-') {
            tile.innerText = '';
        } else {
            tile.classList.add("hint_tile");
            tile.innerText = board[i].toString();
        }
    }

    errors = 0;
    document.getElementById("error-counter").innerText = errors.toString();
}

// gets called when user changes the game's difficulty
function onDifficultyButtonClicked(){
    let difficultyLabel = this.innerText;
    console.log("selected: ", difficultyLabel);
    generateBoard(difficultyLabel.toLowerCase());
    updateBoard();
    document.getElementById("current-difficulty").innerText = difficultyLabel;
}


function selectTile(){
    if (numSelected){
        if (this.innerText != ""){
            return;
        }
        console.log("number selected: ", numSelected.id);
        console.log("id tile: ", this.id);
        console.log("tile id solution: ", solution[this.id]);

        if (numSelected.id == solution[this.id]){
            this.innerText = numSelected.id;
            progression += 1.0/empty_tile;
            let bar = document.getElementById("progression-bar");
            bar.style = "width:"+progression*100+"%";
        } else {
            errors += 1;
            document.getElementById("error-counter").innerText = errors.toString();
        }
    }
}

function selectNumber(){
    if (numSelected != null){
        numSelected.classList.remove("on_number_selected");
    }
    numSelected = this;
    numSelected.classList.add("on_number_selected");
}


