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

function getRandomInt(min, max){


    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate_ship_positions(){
	
	var tmp_pos = new Array();
	var ck = new Array(11);
	for(var i = 1; i <= 10; i ++){
		ck[i] = new Array(11);
		for(var j = 1; j <= 10; j ++)
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
    		for(var j = 0; j < ship_size; j ++)
    			ck[line][column + j] = 1;
		}
		else{
    		for(var j = 0; j < ship_size; j ++)
    			ck[line + j][column ] = 1;
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
	}
	else{
		for(var i = 0; i < ship_size; i ++)
			bboard[line + i][column] = ship.id;
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
        		image.src = ship.imgs[i];
        		image.className = ship.id + "_" + i + ' rot90';
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
	player_board = new Array(11);
	ancel_board = new Array(11);
	player_shots = new Array(11);
	ancel_shots = new Array(11);
	for(var i = 1; i <= 10; i++){
		player_board[i] = new Array(11);
		ancel_board[i] = new Array(11);
		player_shots[i] = new Array(11);
		ancel_shots[i] = new Array(11);
		for(var j = 1; j <= 10; j ++){
			player_board[i][j] = 0;
			ancel_board[i][j] = 0;
			player_shots[i][j] = 0;
			ancel_shots[i][j] = 0;
		}
	}

	score = 100;
	ancel_pos = generate_ship_positions();
	turn = 'Player';
	$('#turn').html('Player');
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

		if(ancel_board[line][column] !== 0){
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
		ancel_shots[line][column] = 1;

		if(player_board[line][column] !== 0){
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
				return player_board[line][column];
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
			$('#' + String.fromCharCode(line + 64) + column + 'player-board').html(image);
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

function ancel_bot(){
	return ancel_bot_random();
	//return ancel_bot_ai();
}

function hit(e){
	e.preventDefault();
  
	var coord = $(this).attr('data-coord');
  	var line = coord.charCodeAt(0) - 64;
	var column = parseInt(coord.substring(1));

	if(turn !== 'Player' && player_shots[line][column] !== 0)
		return;

	var r = shot('Player', coord);
	turn = 'Ancel';
	$("#turn").html("Ancel");
	if(ancel_left === 0){
		$('#final-score').html(score);
		$('#show-win').click();
		return;
	}
	if(r !== ''){
		for(var i = 0; i < ships_list.length; i ++)
			if(r === ships_list[i].id)
				alert("You destroyed Ancel's " + ships_list[i].name);
	}

	var r = shot('Ancel', ancel_bot());
	turn = 'You';
	$("#turn").html("You"); 
	if(player_left === 0){
		$('#show-lose').click();
		return;
	}
}