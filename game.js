
function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function intToChar(int) {
  const code = 'a'.charCodeAt(0);
  return String.fromCharCode(code + int);
}



class Piece{
	//initialise
	constructor(id, width, height){
		this.id = id;
    this.width = width;
    this.height = height;
    this.values = [];
	}

}


var cursplit = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null]
]

var rangen = [
  [1, 2, 3, 4, 5],
  [2, 5, 6, 0, 9],
  [3, 6, 9, 2, 1],
  [4, 0, 2, 7, 4],
  [5, 9, 1, 4, 2]
]

var choices = [[1, 3], [1, 3], [3, 1], [3, 1], [1, 3], [3, 1], [1, 2], [2, 1]];
var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];


var today = new Date()
var day = " " + today.getDate() + " " + today.getMonth() + " " + today.getFullYear()


// yes! the magic generation!
var count = 0;
for (var i = 0; i < 5; i++){
	for (var j = 0; j < 5; j++){
		if (cursplit[i][j] == null){
			var finished = false;
			var ori = choose(choices);
			var ori_width = ori[0];
			var ori_height = ori[1];

			var testc = 0
			while (i + ori_height > 5 || j + ori_width  > 5) {
				ori = choose(choices);
				ori_width = ori[0];
				ori_height = ori[1];
				testc ++;

				if (testc > 10) {
					ori = [1, 1];
					ori_width = 1;
					ori_height = 1;
				}
			}

			for (var k = 0; k < ori_height; k++){
				for (var l = 0; l < ori_width; l++){

					if (cursplit[i+k][j+l] == null) cursplit[i+k][j+l] = count;
					else {
						k = 10; l = 10;
					}
				}
			}

		count ++;
		}
	}
}

// and then the solution numbers
for (var i = 0; i < 5; i++){
	for (var j = 0; j < 5; j++){
		rangen[i][j] = choose(nums);
		if (rangen[j][i] != null) rangen[i][j] = rangen[j][i];
	}
}
console.log(cursplit);
console.log(rangen);



// set up board
var rows = 5;
var cols = 5;

var selected = false;
var curpiece = null;

// current state of board (keep track)
var board = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null]
]


// set up doc to recieve stuff
var dragbox = document.getElementById("drag-box");
dragbox.addEventListener("mouseenter", mouseenter, false);
var gamegrid = document.getElementById("game-grid");

var boxarray = document.getElementsByClassName("drag");
var titletext = document.getElementById("title");

document.addEventListener("mousedown", setpiece);
document.addEventListener("mouseup", setpiece);

// pick split
var split = 0;

// create game board
for (var i = 0; i < cols; i++){
  for (var j = 0; j < rows; j++){
    var square = document.createElement("div");
    square.classList.add("single-grid");
    gamegrid.appendChild(square);
    square.addEventListener("mouseenter", mouseenter, false);
    square.id = 's' + i + j;
  }
}

// create pieces
var pieces = [];
for (var i = 0; i < 5; i++){
  for (var j = 0; j < 5; j++){
    if (pieces[cursplit[i][j]]) {
      pieces[cursplit[i][j]].values.push(rangen[i][j])

      if (i >= 1){
        if (cursplit[i][j] == cursplit[i-1][j]){
          pieces[cursplit[i][j]].width += 1;
        }
      }

      if (j >= 1){
        if (cursplit[i][j] == cursplit[i][j-1]){
        pieces[cursplit[i][j]].height += 1;
        }
      }
    }

    else {
      var curp = new Piece(cursplit[i][j], 1, 1);
      curp.values.push(rangen[i][j])
      pieces.push(curp);
    }
  }
}




for (var i = 0; i < count; i++){
  var piece = document.createElement("div");
  piece.classList.add("drag");
  piece.classList.add("d"+pieces[i].height+pieces[i].width);
  piece.id = intToChar(i) + "d" + pieces[i].height + pieces[i].width + pieces[i].values.join("")

  for (var j = 0; j < pieces[i].values.length; j++){
    var box = document.createElement("div");
    box.classList.add("drag-box-square");
    box.dataset.val = pieces[i].values[j];
    box.innerHTML = "<p>" + pieces[i].values[j] + "</p>";
    piece.appendChild(box);
  }

  dragbox.appendChild(piece);

}



// when a piece starts dragging or releases
function setpiece(e) {
  if (e.type == 'mousedown') {
    selected = true;
    curpiece = e.target.closest('.drag'); // find the piece being dragged

    // if piece picked up
    if (curpiece) {
      var col = curpiece.parentElement.id.substring(1, 2);
      var row = curpiece.parentElement.id.substring(2, 3);

      // col + height, row + width
      var pheight = parseInt(curpiece.id.substring(2, 3));
      var pwidth = parseInt(curpiece.id.substring(3, 4));

      // set the board of that piece to null, if it came from the board
      if (curpiece.parentElement.id.substring(0, 1) == "s") {
        col = parseInt(col);
        row = parseInt(row);
        for (var i = 0; i < pheight; i++){
          for (var j = 0; j < pwidth; j++){
            board[col + i][row + j] = null;
          }
        }

      }

    var boxes = document.querySelectorAll(".single-grid");

    boxes.forEach(function(box, index){
      box.style.pointerEvents = "auto";
    })

    }

  } else /* mouseup */ {
    var boxes = document.querySelectorAll(".single-grid");

    boxes.forEach(function(box, index){
      box.style.pointerEvents = "none";
    })

    selected = false;

    if (curpiece.parentElement.id.substring(0, 1) == "s"){
      var col = curpiece.parentElement.id.substring(1, 2);
      var row = curpiece.parentElement.id.substring(2, 3);

      // col + height, row + width
      var pheight = parseInt(curpiece.id.substring(2, 3));
      var pwidth = parseInt(curpiece.id.substring(3, 4));

      // set the board values if it was placed down
      if (row && col) {
        col = parseInt(col);
        row = parseInt(row);
        for (var i = 0; i < pheight; i++){
          for (var j = 0; j < pwidth; j++){
            board[col + i][row + j] = curpiece.id.substring(4 + i + j, 5 + i + j);
          }
        }

      }

    }
    else {
      // in box
    }
    curpiece = null;

    // check if win
    var win = true;
    for (var i = 0; i < 5; i++){
      for (var j = 0; j < 5; j++){
        if (board[i][j] == null) {
          win = false;
          return;
        }
        if (board[i][j] != board[j][i]){
          win = false;
          return;
        }
      }
    }

    if (win) {
      title.innerHTML = "you win!!!!! 🎉🎉"
    }

  }
}

// dragging piece around

function mouseenter(e) {
  // extract row and column # from the HTML element's id
	var col = e.target.id.substring(1,2);
	var row = e.target.id.substring(2,3);
  if (!selected) {
    e.stopPropagation();
    return;
  }

  // if mouseover to box
	if (e.target.id == "drag-box"){
    movepiece(e.target);

  } else if (e.target.id.substring(0, 1) == "s") {
    // piece in the grid
    var pheight = curpiece.id.substring(2, 3);
    var pwidth = curpiece.id.substring(3, 4);

    var canplace = true;

    // check whether can be placed
    for (var i = 0; i < parseInt(pheight); i++){
      for (var j = 0; j < parseInt(pwidth); j++){
        if (board[parseInt(col) + i][parseInt(row) + j] != null){
          canplace = false;
        }
      }
    }

    // place it!
    if (canplace && (parseInt(col) + parseInt(pheight) <= 5) && (parseInt(row) + parseInt(pwidth) <= 5)){
      movepiece(e.target);
    }
  }

	e.stopPropagation();
}


function movepiece(e){
  // remove piece at old position
	try { curpiece.parentNode.removeChild(curpiece);} catch(err){ console.log(err)}

	try { e.appendChild(curpiece);} catch(err){
		console.log(err)
	} // add piece to new position
}
