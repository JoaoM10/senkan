var player_board;
var ancel_board;
var player_shots;
var ancel_shots;
var turn;
var player_ships_state;
var ancel_ships_state;
var player_left;
var ancel_left;
var score;
var targets;

var dirs = [[0, +1], [+1, 0], [0, -1], [-1, 0]];
var striking_mode;
var first_ancel_line;
var first_ancel_column;
var last_ancel_shot;
var last_ancel_line;
var last_ancel_column;
var last_ancel_orient;

function getRandomInt(min, max){

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate_ship_positions(){
	
	var tmp_pos = new Array();
	var ck = new Array(12);
	for(var i = 0; i <= 11; i ++){
		ck[i] = new Array(12);
		for(var j = 0; j <= 11; j ++)
			ck[i][j] = 0;
	}
	
    for(var i = 0; i < ships_list.length; i ++){
    	tmp_pos[ships_list[i].id] = ships_pos[ships_list[i].id];
    	
    	var ship_id = ships_list[i].id
    	var ship_size = parseInt(ship_id[4]);
    	var orient = getRandomInt(0, 1);

    	var pp = new Array();
    	if(orient === 0){
    		for(var l = 1; l <= 10; l ++)
    			for(var c = 1; c <= 10; c ++)
    				if(c + ship_size - 1 <= 10){
    					var tk = true;
    					for(var j = 0; j < ship_size; j ++)
    						if(ck[l][c + j] !== 0)
    							tk = false;
    					if(tk)
    						pp.push('H' + String.fromCharCode(l + 64) + c);
    				}
    	}
    	else{
    		for(var l = 1; l <= 10; l ++)
    			if(l + ship_size - 1 <= 10)
    				for(var c = 1; c <= 10; c ++){
    					var tk = true;
    					for(var j = 0; j < ship_size; j ++)
    						if(ck[l + j][c] !== 0)
    							tk = false;
    					if(tk)
    						pp.push('V' + String.fromCharCode(l + 64) + c);
    				}
    	}
    	var r = getRandomInt(0, pp.length - 1);
    	tmp_pos[ship_id] = pp[r];

    	var line = parseInt(pp[r][1].charCodeAt(0) - 64);
    	var column = parseInt(pp[r].substring(2));
    	if(orient === 0){
    		for(var j = 0; j < ship_size; j ++){
    			ck[line][column + j] = 1;

    			// dont allow adjacent ships
    			ck[line - 1][column + j] = 1;
    			ck[line + 1][column + j] = 1;
    		}
    		ck[line][column - 1] = 1;
    		ck[line][column + ship_size] = 1;
		}
		else{
    		for(var j = 0; j < ship_size; j ++){
    			ck[line + j][column] = 1;

     			// dont allow adjacent ships
    			ck[line + j][column - 1] = 1;
    			ck[line + j][column + 1] = 1;
    		}
    		ck[line - 1][column] = 1;
    		ck[line + ship_size][column] = 1;
		}
    }
	
    return tmp_pos;
}

function place_ship(bid, bboard, pos, ship, vis){

	var orient = pos[0];
  	var linec = pos[1];
  	var line = linec.charCodeAt(0) - 64;
	var column = parseInt(pos.substring(2));
	var ship_size = parseInt(ship.id.substring(4, 5));
	
	if(orient === 'H'){
		for(var i = 0; i < ship_size; i ++)
			bboard[line][column + i] = ship.id;

		// Dont allow adjacent ships
		if(line > 1)
			for(var i = 0; i < ship_size; i ++)
				bboard[line - 1][column + i] = -1;
		if(line < 10)
			for(var i = 0; i < ship_size; i ++)
				bboard[line + 1][column + i] = -1;
		if(column > 1)
			bboard[line][column - 1] = -1;
		if(column + ship_size - 1 < 10)
			bboard[line][column + ship_size] = -1;
	}
	else{
		for(var i = 0; i < ship_size; i ++)
			bboard[line + i][column] = ship.id;

		// Dont allow adjacent ships
		if(column > 1)
			for(var i = 0; i < ship_size; i ++)
				bboard[line + i][column - 1] = -1;
		if(column < 10)
			for(var i = 0; i < ship_size; i ++)
				bboard[line + i][column + 1] = -1;

		if(line > 1)
			bboard[line - 1][column] = -1;
		if(line + ship_size - 1 < 10)
			bboard[line + ship_size][column] = -1;
	}
	
	if(vis){
		if(orient === 'H'){
			for(var i = 0; i < ship_size; i ++){
        		var image = new Image();
        		image.src = ship.imgs[i];
        		image.className = ship.id + "_" + i;
        		image.onmousedown = function(event){
					event.preventDefault();
					return false;
				};
				$('#' + linec + (column + i) + bid).append(image);
			}
		}
		else{
			for(var i = 0; i < ship_size; i ++){
        		var image = new Image();
        		image.src = ship.imgs[ship_size - 1 - i];
        		image.className = ship.id + "_" + (ship_size - 1 - i) + ' rot90';
        		image.onmousedown = function(event){
					event.preventDefault();
					return false;
				};
				$('#' + String.fromCharCode(linec.charCodeAt(0) + i) + column + bid).append(image);
			}
		}
	}
}

function init_game_ancel(){
	player_board = new Array(12);
	ancel_board = new Array(12);
	player_shots = new Array(12);
	ancel_shots = new Array(12);
	for(var i = 0; i <= 11; i++){
		player_board[i] = new Array(12);
		ancel_board[i] = new Array(12);
		player_shots[i] = new Array(12);
		ancel_shots[i] = new Array(12);
		for(var j = 0; j <= 11; j ++){
			player_board[i][j] = 0;
			ancel_board[i][j] = 0;
			player_shots[i][j] = 0;
			ancel_shots[i][j] = 0;
		}
	}

	striking_mode = 0;
	last_ancel_shot = 0;
	last_ancel_line = 0;
	last_ancel_column = 0;
	last_ancel_orient = 0;
	first_ancel_line = 0;
	first_ancel_column = 0;

	score = 100;
	ancel_pos = generate_ship_positions();
	turn = 'Player';
	$('#turn').html('You');
	$('#score').html('100');
	$('#game-progress').attr('aria-valuenow', '0');
	$('#game-progress').css('width', '0%');

	player_left = ships_list.length;
	ancel_left = ships_list.length;
	player_ships_state = [];
	ancel_ships_state = [];
	for(var i = 0; i < ships_list.length; i ++){
		place_ship('player-board', player_board, ships_pos[ships_list[i].id], ships_list[i], true);
		place_ship('ancel-board', ancel_board, ancel_pos[ships_list[i].id], ships_list[i], false);
		player_ships_state[ships_list[i].id] = parseInt(ships_list[i].id[4]);
		ancel_ships_state[ships_list[i].id] = parseInt(ships_list[i].id[4]);
	}
}

function shot(pl, coord){
  	var line = coord.charCodeAt(0) - 64;
	var column = parseInt(coord.substring(1));

	if(pl === 'Player'){
		score -= 1;
		$("#score").html(score);
		
		player_shots[line][column] = 1;

		if(ancel_board[line][column] !== 0 && ancel_board[line][column] !== -1){
			var hts = parseInt($("#game-progress").attr('aria-valuenow'));
			hts += 1;
			$("#game-progress").attr('aria-valuenow', hts);
			$('#game-progress').css('width', (hts * 6) + '%');

        	var image = new Image();
        	image.src = 'media/hit.png';
        	image.className = 'hit';
        	image.onmousedown = function(event){
				event.preventDefault();
				return false;
			};
			$('#' + String.fromCharCode(line + 64) + column + 'ancel-board').html(image);
			ancel_ships_state[ancel_board[line][column]] -= 1;
			if(ancel_ships_state[ancel_board[line][column]] === 0){
				ancel_left -= 1;
				return ancel_board[line][column];
			}
		}
		else{
        	var image = new Image();
        	image.src = 'media/water.png';
        	image.className = 'water';
        	image.onmousedown = function(event){
				event.preventDefault();
				return false;
			};
			$('#' + String.fromCharCode(line + 64) + column + 'ancel-board').html(image);
		}
	}
	else{

		if(player_board[line][column] !== 0 && player_board[line][column] !== -1){
        	var image = new Image();
        	image.src = 'media/hit.png';
        	image.className = 'hit';
        	image.onmousedown = function(event){
				event.preventDefault();
				return false;
			};
			$('#' + String.fromCharCode(line + 64) + column + 'player-board').html(image);
			player_ships_state[player_board[line][column]] -= 1;
			if(player_ships_state[player_board[line][column]] === 0){
				player_left -= 1;
				last_ancel_shot = 2;
				return player_board[line][column];
			}

			ancel_shots[line][column] = 2;
			last_ancel_shot = 1;
			last_ancel_line = line;
			last_ancel_column = column;
		}
		else{
        	var image = new Image();
        	image.src = 'media/water.png';
        	image.className = 'water';
        	image.onmousedown = function(event){
				event.preventDefault();
				return false;
			};
			$('#' + String.fromCharCode(line + 64) + column + 'player-board').html(image);

			ancel_shots[line][column] = 1;
			last_ancel_shot = 0;
		}
	}

	return '';
}

function ancel_bot_random(){
	var line, column;
	do{
		line = getRandomInt(1, 10);
		column = getRandomInt(1, 10);
	}while(ancel_shots[line][column] !== 0);
	var co = String.fromCharCode(line + 64) + column;
	return co;
}

function ancel_bot_ai(){
	var line, column, co;

	if(striking_mode === 1 && last_ancel_shot === 1){
		striking_mode = 2;
		// determine direction
		if(first_ancel_line === last_ancel_line && first_ancel_column + 1 === last_ancel_column)
			last_ancel_orient = 0;
		else if(first_ancel_line + 1 === last_ancel_line && first_ancel_column === last_ancel_column)
			last_ancel_orient = 1;
		else if(first_ancel_line === last_ancel_line && first_ancel_column - 1 === last_ancel_column)
			last_ancel_orient = 2;
		else //if(first_ancel_line - 1 === last_ancel_line && first_ancel_column === last_ancel_column)
			last_ancel_orient = 3;
	}
	if(striking_mode === 0 && last_ancel_shot === 1){
		striking_mode = 1;
		first_ancel_line = last_ancel_line;
		first_ancel_column = last_ancel_column;
	}
	if(last_ancel_shot === 2){
		striking_mode = 0;
		last_ancel_line = 0;
		last_ancel_column = 0;
		last_ancel_orient = 0;
	}

	if(striking_mode === 0){

		var pr = new Array(11);
		for(var i = 1; i <= 10; i ++){
			pr[i] = new Array(11);
			for(var j = 1; j <= 10; j ++)
				pr[i][j] = 0;
		}

		for(var i = 0; i < ships_list.length; i ++){
			if(player_ships_state[ships_list[i].id] > 0){
				var ship_size = parseInt(ships_list[i].id[4]);

	    		for(var l = 1; l <= 10; l ++)
	    			for(var c = 1; c <= 10; c ++)
	    				if(c + ship_size - 1 <= 10){
	    					var tk = true;
	    					for(var j = 0; j < ship_size; j ++)
	    						if(ancel_shots[l][c + j] !== 0 || ancel_shots[l - 1][c + j] === 2 || ancel_shots[l][c + j - 1] === 2 || ancel_shots[l + 1][c + j] === 2 || ancel_shots[l][c + j + 1] === 2)
	    							tk = false;
	    					if(tk){
	    						for(var j = 0; j < ship_size; j ++)
	    							pr[l][c + j] += 1;
	    					}
	    				}
	    		for(var l = 1; l <= 10; l ++)
	    			if(l + ship_size - 1 <= 10)
	    				for(var c = 1; c <= 10; c ++){
	    					var tk = true;
	    					for(var j = 0; j < ship_size; j ++)
	    						if(ancel_shots[l + j][c] !== 0 || ancel_shots[l + j - 1][c] === 2 || ancel_shots[l + j + 1][c] === 2 || ancel_shots[l + j][c - 1] === 2 || ancel_shots[l + j][c + 1] === 2)
	    							tk = false;
	    					if(tk){
	    						for(var j = 0; j < ship_size; j ++)
	    							pr[l + j][c] += 1;
	    					}
	    				}

			}
		}

		var tt = [];
		var best = -1;
		for(var i = 1; i <= 10; i ++)
			for(var j = 1; j <= 10; j ++)
				if((i + j) % 2 === 0){
					if(pr[i][j] > best){
						tt = [];
						tt.push([i, j]);
						best = pr[i][j];
					}
					else if(pr[i][j] === best)
						tt.push([i, j]);
				}
		var rr = getRandomInt(0, tt.length - 1);
		line = tt[rr][0];
		column = tt[rr][1];
	}
	else if(striking_mode === 1){
		// need to figure out direction
		var r = getRandomInt(0, 3);
		while(ancel_shots[last_ancel_line + dirs[r][0]][last_ancel_column + dirs[r][1]] !== 0 || (last_ancel_line + dirs[r][0]) < 1 || (last_ancel_line + dirs[r][0]) > 10 || (last_ancel_column + dirs[r][1]) < 1 || (last_ancel_column + dirs[r][1]) > 10)
			r = getRandomInt(0, 3);
		line = last_ancel_line + dirs[r][0];	
		column = last_ancel_column + dirs[r][1];

		// to improve
	}
	else{ // striking_mode = 2
		// continue striking may need to invert direction
		if(ancel_shots[last_ancel_line + dirs[last_ancel_orient][0]][last_ancel_column + dirs[last_ancel_orient][1]] !== 0 || last_ancel_shot === 0 || (last_ancel_line + dirs[last_ancel_orient][0]) < 1 || (last_ancel_line + dirs[last_ancel_orient][0]) > 10 || (last_ancel_column + dirs[last_ancel_orient][1]) < 1 || (last_ancel_column + dirs[last_ancel_orient][1]) > 10){
			// invert dir
			last_ancel_line = first_ancel_line;
			last_ancel_column = first_ancel_column;
			last_ancel_orient = (last_ancel_orient + 2) % 4;
		}
		
		line = last_ancel_line + dirs[last_ancel_orient][0];
		column = last_ancel_column + dirs[last_ancel_orient][1];
	}

	co = String.fromCharCode(line + 64) + column;
	return co;
}

function ancel_bot(){
	//return ancel_bot_random();
	return ancel_bot_ai();
}

function hit(e){
	e.preventDefault();
  
	var coord = $(this).attr('data-coord');
  	var line = coord.charCodeAt(0) - 64;
	var column = parseInt(coord.substring(1));

	if(turn !== 'Player' || player_shots[line][column] !== 0)
		return;

	var player_win = false;
	var ancel_win = false;

	var r = shot('Player', coord);
	turn = 'Ancel';
	$("#turn").html("Ancel");
	if(ancel_left === 0)
		player_win = true;
	if(r !== ''){
		for(var i = 0; i < ships_list.length; i ++)
			if(r === ships_list[i].id)
				alert("You destroyed Ancel's " + ships_list[i].name);
	}

	var cbot = ancel_bot();
	var r = shot('Ancel', cbot);
	turn = 'Player';
	$("#turn").html("You"); 
	if(player_left === 0)
		ancel_win = true;
	if(r !== ''){
		for(var i = 0; i < ships_list.length; i ++)
			if(r === ships_list[i].id)
				alert("Ancel destroyed your " + ships_list[i].name);
	}

	if(player_win && ancel_win){
		$('.final-score').html(score);
		$('#show-draw').click();
		return;
	}

	if(player_win){
		$('.final-score').html(score);
		$('#show-win').click();
		return;
	}

	if(ancel_win){
		$('.final-score').html(score);
		$('#show-lose').click();
		return;
	}
}