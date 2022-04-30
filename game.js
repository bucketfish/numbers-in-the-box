class Piece{
	//initialise
	constructor(id, width, height){
		this.id = id;
    this.width = width;
    this.height = height;
    this.values = [];
	}

}

const splits = [
  {
    "count": 10,
    "split":[[0, 0, 0, 1, 2],
            [3, 3, 4, 1, 2],
            [5, 6, 4, 1, 7],
            [5, 6, 8, 8, 7],
            [5, 6, 9, 9, 9]]
  }
  ]

var rangen = [
  [1, 2, 3, 4, 5],
  [2, 5, 6, 0, 9],
  [3, 6, 9, 2, 1],
  [4, 0, 2, 7, 4],
  [5, 9, 1, 4, 2]
]

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
var cursplit = splits[split]["split"]
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


console.log(pieces);

for (var i = 0; i < splits[split]["count"]; i++){
  var piece = document.createElement("div");
  piece.classList.add("drag");
  piece.classList.add("d"+pieces[i].height+pieces[i].width);
  piece.id = i + "d" + pieces[i].height + pieces[i].width + pieces[i].values.join("")

  for (var j = 0; j < pieces[i].values.length; j++){
    var box = document.createElement("div");
    box.classList.add("drag-box-square");
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
    }

  } else /* mouseup */ {
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


    // check if win

    

    }
    else {
      // in box
    }
    curpiece = null;
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
