
var browserTesting = "click";

// ***********************************************
// storage takes user to their highest level
// ***********************************************
var storage = localStorage; 
if (storage.getItem("highestLevel")==undefined) { storage.setItem("highestLevel",0); } 
if (storage.getItem("changeLevel")==undefined) { storage.setItem("changeLevel",0); } 
else { 
	if (storage.getItem("changeLevel")!=1) {
		if (storage.getItem("highestLevel")!=0) { var lvl = "level_"+storage.getItem("highestLevel")+".html"; }
		else { var lvl = "index.html"; }
		var checkPage = window.location.href;
		var checkLvl = checkPage.substring(checkPage.indexOf("level_")+6,checkPage.lastIndexOf("."));
		if (isNaN(checkLvl.trim())) { checkLvl = 0; }
		console.log(checkLvl,storage.getItem("highestLevel"));
		if (checkLvl!=storage.getItem("highestLevel")) { window.location.href=lvl; }
	} else {
		if (storage.getItem("highestLevel")!=0) { var lvl = "level_"+storage.getItem("highestLevel")+".html"; }
		else { var lvl = "index.html"; }
		var checkPage = window.location.href;
		var checkLvl = checkPage.substring(checkPage.indexOf("level_")+6,checkPage.lastIndexOf("."));
		if (isNaN(checkLvl.trim())) { checkLvl = 0; }
		console.log(11111 + checkLvl,storage.getItem("highestLevel"));
		if (parseInt(checkLvl)>parseInt(storage.getItem("highestLevel"))) { window.location.href="index.html"; }
	}
} 

// ***********************************************
// store user best solution for each level
// ***********************************************
var checkPage = window.location.href;
var checkLvl = checkPage.substring(checkPage.indexOf("level_")+6,checkPage.lastIndexOf("."));
if (isNaN(checkLvl.trim())) { checkLvl = 0; }
if (checkLvl!=0) {
	var u = "stepsLevel_"+checkLvl;
	if (storage.getItem(u)==undefined) { storage.setItem(u,0); }
}

// TESTING
//storage.setItem("stepsLevel_31",0);
//storage.setItem("highestLevel",31);

// values in localStorage:
// - highestLevel: users highest level reached
// - changeLevel:  whether user switched between levels
// - stepsLevel_N: user best solution for each level N

$(function() {

	// populate browse levels menu
	var fastestArray = [10,14,20,13,10,14,15,14,25,10,9,9,14,25,17,20,13,17,14,15,19,11,17,16,14,12,15,12,13,15,21];
	//var fastestArray = [5,5,5,5,5,5,5,5,5,5,5];
	var lvls = "<p class='each_level' data-lvl='0' style='color:#a9a9a9;'>Intro</p>";
	var SxS = "4x4";
	if (storage.getItem("highestLevel")!=0) {
		for (var i=1; i<=parseInt(storage.getItem("highestLevel")); i++) {
			//if (i>5) { SxS = "5x4"; }
			var eachLvlStats = "stepsLevel_"+i;
			var whichColor = "";
			if (storage.getItem(eachLvlStats)==null) { storage.setItem(eachLvlStats,0); }
			if (storage.getItem(eachLvlStats)==fastestArray[i-1]) { whichColor = "green_color"; }
			else if (storage.getItem(eachLvlStats)==0) { whichColor = "no_color"; }
			else { whichColor = "red_color"; }
			var stats = "<span class='stats'>Your solution: <span class='"+whichColor+"'>"+storage.getItem(eachLvlStats)+
			"</span> | Fastest possible: <span class='"+whichColor+"'>"+fastestArray[i-1]+"</span></span>";
			lvls += "<p class='each_level' data-lvl='"+i+"'>Level " + i + " <span></span>"+stats+"</p>";
			// ("+SxS+")
		}
	}
	$("#browselevels").html(lvls+"<p class='close_levels'>Close</p>");
	
	// show user their best solution
	$("#userSteps").html(storage.getItem(u));
	$(".fastest").html(fastestArray[checkLvl-1]);
	
	// requirments for level 11 (at least 4 perfect solutions)
	if (checkLvl==11) {
		var perfectSols = 0;
		for (var i=1; i<=fastestArray.length; i++) {
			var eachLvlStats = "stepsLevel_"+i;
			if (fastestArray[i-1]==storage.getItem(eachLvlStats)) { perfectSols++; }
		}
		if (perfectSols<4) {
			$("#showReqs").show();
			$('#chessboard tr td.bluePlayer').hide();
			$('#chessboard tr td.redPlayer').hide();
		}		
	}
	
	// requirments for level 21 (at least 12 perfect solutions)
	if (checkLvl==21) {
		var perfectSols = 0;
		for (var i=1; i<=fastestArray.length; i++) {
			var eachLvlStats = "stepsLevel_"+i;
			if (fastestArray[i-1]==storage.getItem(eachLvlStats)) { perfectSols++; }
		}
		if (perfectSols<12) {
			$("#showReqs_21").show();
			$('#chessboard tr td.bluePlayer').hide();
			$('#chessboard tr td.redPlayer').hide();
		}		
	}
	
	// requirments for level 31 (at least 26 perfect solutions)
	if (checkLvl==31) {
		var perfectSols = 0;
		for (var i=1; i<=fastestArray.length; i++) {
			var eachLvlStats = "stepsLevel_"+i;
			if (fastestArray[i-1]==storage.getItem(eachLvlStats)) { perfectSols++; }
		}
		if (perfectSols<26) { 
			$("#showReqs_31").show();
			$('#chessboard tr td.bluePlayer').hide();
			$('#chessboard tr td.redPlayer').hide();
			$('#chessboard tr td.teleBox').hide();
		}		
	}
	
	// begin game
	var currentSteps = 0;
	var bp = $('#chessboard tr td.bluePlayer').attr('data-pos');
	findSpaces(bp,currentBoard,parseInt($("#rowWidth").html())); 
	
	// get movable spaces
	function findSpaces(piecePosition,currentBoard,rows) {
		var currentBoard = currentBoard;
		var rows = rows;
		piecePosition = parseInt(piecePosition); 	
		// get spaces to move to
		var openSpaces = new Array(); 
		openSpaces.push(piecePosition-rows); 
		openSpaces.push(piecePosition+rows); 
		if (piecePosition%rows!=1) { openSpaces.push(piecePosition-1); }
		if (piecePosition%rows!=0) { openSpaces.push(piecePosition+1); }
		// check for some illegal spaces
		var spacesToRemove = new Array();
		for (var i=0;i<openSpaces.length;i++) {
				if ((currentBoard[openSpaces[i]-1] == 'x') || (currentBoard[openSpaces[i]-1] == 'R') ||
						(openSpaces[i] < 1) || (openSpaces[i] > currentBoard.length)) {
						if (spacesToRemove.indexOf(openSpaces[i]) == -1) { spacesToRemove.push(openSpaces[i]); }   
				}  
		}  
		for (var i=0;i<spacesToRemove.length;i++) {
			openSpaces.splice(openSpaces.indexOf(spacesToRemove[i]),1); 
		}
		// make movable spaces clickable
		for (var i=0;i<openSpaces.length;i++) { 
			$("#chessboard td[data-pos='"+(openSpaces[i])+"']").addClass('movableGreenSpaces');
    } 
	}
	
	// check if piece is on teleport block
	function checkIfTeleport(piecePosition,currentBoard,rows,whichPiece) {
		var currentBoard = currentBoard;
		var rows = rows;
		piecePosition = parseInt(piecePosition);
		var telePos = $('#chessboard tr td.teleBox').attr('data-pos');
		telePos = parseInt(telePos);
		var newSpace = $('#chessboard tr td.teleBoxGOTO').attr('data-pos');
		newSpace = parseInt(newSpace);
		if (telePos==piecePosition) {
			currentBoard[piecePosition-1] = '0';
			if (whichPiece=="B") { 
				currentBoard[newSpace-1] = 'B';
				$('#chessboardInput').val(currentBoard.join('')); 
				$('#chessboard tr td[data-pos="'+(piecePosition)+'"]').removeClass("bluePlayer");
				$("#chessboard tr td").removeClass('movableGreenSpaces'); 
				$('#chessboard tr td[data-pos="'+(newSpace)+'"]').addClass("bluePlayer");
			} else {
				currentBoard[newSpace-1] = 'R';
				$('#chessboardInput').val(currentBoard.join('')); 
				$('#chessboard tr td[data-pos="'+(piecePosition)+'"]').removeClass("redPlayer");
				$('#chessboard tr td[data-pos="'+(newSpace)+'"]').addClass("redPlayer");
			}
			$('#chessboard tr td').removeClass("teleBox");
			$('#chessboard tr td.teleBoxGOTO span').hide();
		}
	}
	
	// tap on one of new spaces
	$("#chessboard").on(browserTesting, ".movableGreenSpaces", function() {
		currentSteps++;
		$(".curSteps").html(currentSteps);
		var currentBoard = $('#chessboardInput').val();
		currentBoard = currentBoard.split(/\r\n|\r|\n/g).join("").replace(/ /g,"").split("");  
		var rows = $("#rowWidth").html();
		movePiece(parseInt($('#chessboard tr td.bluePlayer').attr('data-pos')),parseInt($(this).attr('data-pos')),currentBoard);   
	}); 
	
	// swipe in direction of new space
	$('#chessboard').on("swipeRight", ".bluePlayer", function() {
		var piecePosition = parseInt($(this).attr('data-pos'));
		var spaceRight = $("#chessboard td[data-pos='"+(piecePosition+1)+"']");
		if (spaceRight.hasClass("movableGreenSpaces")) { movePieceSwiping(spaceRight); }
	});
	$('#chessboard').on("swipeLeft", ".bluePlayer", function() {
		var piecePosition = parseInt($(this).attr('data-pos'));
		var spaceRight = $("#chessboard td[data-pos='"+(piecePosition-1)+"']");
		if (spaceRight.hasClass("movableGreenSpaces")) { movePieceSwiping(spaceRight); }
	});
	$('#chessboard').on("swipeUp", ".bluePlayer", function() {
		var piecePosition = parseInt($(this).attr('data-pos'));
		var rows = parseInt($("#rowWidth").html());
		var spaceRight = $("#chessboard td[data-pos='"+(piecePosition-rows)+"']");
		if (spaceRight.hasClass("movableGreenSpaces")) { movePieceSwiping(spaceRight); }
	});	
	$('#chessboard').on("swipeDown", ".bluePlayer", function() {
		var piecePosition = parseInt($(this).attr('data-pos'));
		var rows = parseInt($("#rowWidth").html());
		var spaceRight = $("#chessboard td[data-pos='"+(piecePosition+rows)+"']");
		if (spaceRight.hasClass("movableGreenSpaces")) { movePieceSwiping(spaceRight); }
	});
	
	// simulate swipe* by calling movePiece function
	function movePieceSwiping(spaceRight) {
		currentSteps++;
		$(".curSteps").html(currentSteps);
		var currentBoard = $('#chessboardInput').val();
		currentBoard = currentBoard.split(/\r\n|\r|\n/g).join("").replace(/ /g,"").split("");  
		var rows = $("#rowWidth").html();
		movePiece(parseInt($('#chessboard tr td.bluePlayer').attr('data-pos')),parseInt(spaceRight.attr('data-pos')),currentBoard); 
	}
	
	// move blue piece
	function movePiece(curWhiteSpace,newSpace,currentBoard) {
    currentBoard[curWhiteSpace-1] = '0';
    currentBoard[newSpace-1] = 'B';
    $('#chessboardInput').val(currentBoard.join('')); 
    $('#chessboard tr td[data-pos="'+(curWhiteSpace)+'"]').removeClass("bluePlayer");
		$("#chessboard tr td").removeClass('movableGreenSpaces'); 
    $('#chessboard tr td[data-pos="'+(newSpace)+'"]').addClass("bluePlayer");
		// move red opposite
		var where = 0;
		if ((curWhiteSpace-newSpace)==parseInt($("#rowWidth").html())) { moveRed("D"); }
		else if ((curWhiteSpace-newSpace)==-parseInt($("#rowWidth").html())) { moveRed("U"); }
		else if ((curWhiteSpace-newSpace)==1) { moveRed("R"); }
		else if ((curWhiteSpace-newSpace)==-1) { moveRed("L"); }
	} 

	// move red piece opposite direction
	function moveRed(whereTo) {
		var currentBoard = $('#chessboardInput').val();
		currentBoard = currentBoard.split(/\r\n|\r|\n/g).join("").replace(/ /g,"").split(""); 
		var rows = parseInt($("#rowWidth").html());
		var r = $('#chessboard tr td.redPlayer').attr('data-pos');
		var rn = -1;
		if (whereTo=="D") {  
			rn = parseInt(r)+parseInt($("#rowWidth").html());
			if (rn>currentBoard.length) { rn=-1; }
		} else if (whereTo=="U") { 
			rn = parseInt(r)-parseInt($("#rowWidth").html());
			if (rn<1) { rn=-1; }
		} else if (whereTo=="R") { 
			rn = parseInt(r)+1;
			if (r%rows==0) { rn=-1; }
		} else if (whereTo=="L") { 
			rn = parseInt(r)-1;
			if (r%rows==1) { rn=-1; }
		}
		if (rn!=-1&&(currentBoard[rn-1]=='x'||currentBoard[rn-1]=='B'||currentBoard[rn-1]=='R')) { rn=-1; }
		if (rn!=-1) {
			currentBoard[r-1] = '0';
			currentBoard[rn-1] = 'R';
			$('#chessboardInput').val(currentBoard.join('')); 
			$('#chessboard tr td[data-pos="'+(r)+'"]').removeClass("redPlayer");
			$('#chessboard tr td[data-pos="'+(rn)+'"]').addClass("redPlayer");
		}
		win();
		checkIfTeleport($('#chessboard tr td.redPlayer').attr('data-pos'),currentBoard,rows,"R");
		checkIfTeleport($('#chessboard tr td.bluePlayer').attr('data-pos'),currentBoard,rows,"B");
		findSpaces($('#chessboard tr td.bluePlayer').attr('data-pos'),currentBoard,rows);
	}
	
	// reset level
	$(".resetbutton").on(browserTesting, function() { window.location.href=window.location.href; });
	
	// browse all completed levels and change level
	$(".browsebutton").on(browserTesting, function() { setTimeout(function(){ $("#browselevels").show(); }, 300); });
	$(".close_levels").on(browserTesting, function() { $("#browselevels").hide(); });
	$(".each_level").on("click", function() { 
		var cl = $(this).attr("data-lvl");
		storage.setItem("changeLevel",1);
		if (cl==0) { window.location.href="index.html"; }
		else { window.location.href="level_"+cl+".html"; }
	});
	
	// show player won
	function win() { 
		if ($('#chessboard tr td.redPlayer').attr('data-pos')==$('#chessboard tr td.firstBP').attr('data-pos')&&
				$('#chessboard tr td.bluePlayer').attr('data-pos')==$('#chessboard tr td.firstRP').attr('data-pos')) { 
				// check if solution is their best
				if (currentSteps<storage.getItem(u)||storage.getItem(u)==0) { storage.setItem(u,currentSteps); }
				$("#win p span").html(currentSteps);
				$("#win").show(); 
		}
	}
	
	// level redirects
	function redir(lvl) { 
		if (lvl=="h") { window.location.href="howtoplay.html"; }
		else { setTimeout(function(){window.location.href="level_"+lvl+".html";}, 1200); } 
	}
	function setScore(num) { if (storage.getItem("changeLevel")==0||storage.getItem("highestLevel")<num) { storage.setItem("highestLevel",num); } }
	
	$(".win_index .playagain").on(browserTesting, function() { setScore(0); window.location.href=window.location.href; });
	$(".win_index .nextlevel").on(browserTesting, function() { setScore(0); redir("h"); });
	
	$(".win_howto .playagain").on(browserTesting, function() { setScore(1); redir("h"); });
	$(".win_howto .nextlevel").on(browserTesting, function() { setScore(1); redir(1); });
	
	// play again and next level options for current level
	if (!isNaN(checkLvl.trim())) {
		checkLvl = parseInt(checkLvl);
		$(".win_level"+checkLvl+" .playagain").on(browserTesting, function() { if (checkLvl!=31) { setScore(checkLvl+1); } redir(checkLvl); });
		$(".win_level"+checkLvl+" .nextlevel").on(browserTesting, function() { if (checkLvl!=31) { setScore(checkLvl+1); redir(checkLvl+1); } });
	}
	
});













	 