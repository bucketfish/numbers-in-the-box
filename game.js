// set up board
var rows = 5;
var cols = 5;

var selected = false;
var curpiece = null;

var board = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null]
]

var dragbox = document.getElementById("drag-box");
dragbox.addEventListener("mouseenter", mouseenter, false);
var gamegrid = document.getElementById("game-grid");

var boxarray = document.getElementsByClassName("drag");

for (var i = 0; i < boxarray.length; i++){
  boxarray[i].addEventListener("mousedown", setpiece);
  boxarray[i].addEventListener("mouseup", setpiece);
}

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

function setpiece(e) {
  if (e.type == 'mousedown') {
    selected = true;
    curpiece = e.target.closest('.drag');

    if (curpiece) {
      var col = curpiece.parentElement.id.substring(1, 2);
      var row = curpiece.parentElement.id.substring(2, 3);

      // col + height, row + width
      var pheight = parseInt(curpiece.id.substring(2, 3));
      var pwidth = parseInt(curpiece.id.substring(3, 4));


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

      if (row && col) {
        col = parseInt(col);
        row = parseInt(row);
        for (var i = 0; i < pheight; i++){
          for (var j = 0; j < pwidth; j++){
            board[col + i][row + j] = curpiece.id.substring(4 + i + j, 5 + i + j);
          }
        }

      }

      console.log(board);

    }
    else {
      // in box
    }
    curpiece = null;
  }
}

function mouseenter(e) {
  // extract row and column # from the HTML element's id
	var col = e.target.id.substring(1,2);
	var row = e.target.id.substring(2,3);
  if (!selected) {
    e.stopPropagation();
    return;
  }

	if (e.target.id == "drag-box"){
    movepiece(e.target);
  } else if (row && col) {
    var pheight = curpiece.id.substring(2, 3);
    var pwidth = curpiece.id.substring(3, 4);

    if ((parseInt(col) + parseInt(pheight) > 5) || (parseInt(row) + parseInt(pwidth) > 5)){

    }else{
      movepiece(e.target);
    }
  }

	e.stopPropagation();
}

function movepiece(e){
	try { curpiece.parentNode.removeChild(curpiece);} catch(err){ console.log(err)} // remove piece at old position

	try { e.appendChild(curpiece);} catch(err){
		console.log(err)

	} // add ship to new position
}
