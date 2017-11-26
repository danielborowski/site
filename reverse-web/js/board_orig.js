
// setup board properties
var currentBoard = $('#chessboardInput').val();
var rows = currentBoard.match(/\n/g).length;
var cols = currentBoard.indexOf('\n');
currentBoard = currentBoard.split(/\r\n|\r|\n/g).join("").replace(/ /g,"").split("");
$("#rowWidth").html(cols);

// create display board
var space = 1;
for (var r=0; r<rows; r++) {
	var col = "";
	for (var c=0; c<cols; c++) { 
		if (currentBoard[space-1]=='x') { col += "<td data-pos='"+space+"' class='gone'></td>"; }
		else if (currentBoard[space-1]=='B') { col += "<td data-pos='"+space+"' class='bluePlayer firstBP'><span class='blueGoal'></span></td>"; }
		else if (currentBoard[space-1]=='R') { col += "<td data-pos='"+space+"' class='redPlayer firstRP'><span class='redGoal'></span></td>"; }
		else if (currentBoard[space-1]=='M') { col += "<td data-pos='"+space+"' class='teleBox'></td>"; }
		else if (currentBoard[space-1]=='m') { col += "<td data-pos='"+space+"' class='teleBoxGOTO'><span class='greenGoal'></span></td>"; }
		else { col += "<td data-pos='"+space+"'></td>"; } 
		space++; 
	}
	$("#chessboard").append("<tr>"+col+"</tr>");
}













