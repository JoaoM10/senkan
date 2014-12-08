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
var diags = [[-1, -1], [-1, +1], [+1, -1], [+1, +1]];
var striking_mode;
var first_ancel_line;
var first_ancel_column;
var last_ancel_shot;
var last_ancel_line;
var last_ancel_column;
var last_ancel_orient;
var rand_parity;

var game_type = null;
var game_id = null;
var game_key = null;
var game_vs = null;
var game_turn = null;

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
    		ck[line - 1][column - 1] = 1;
    		ck[line][column - 1] = 1;
    		ck[line + 1][column - 1] = 1;
    		ck[line - 1][column + ship_size] = 1;
    		ck[line][column + ship_size] = 1;
    		ck[line + 1][column + ship_size] = 1;
		}
		else{
    		for(var j = 0; j < ship_size; j ++){
    			ck[line + j][column] = 1;

     			// dont allow adjacent ships
    			ck[line + j][column - 1] = 1;
    			ck[line + j][column + 1] = 1;
    		}
    		ck[line - 1][column] = 1;
    		ck[line - 1][column - 1] = 1;
    		ck[line - 1][column + 1] = 1;
    		ck[line + ship_size][column] = 1;
    		ck[line + ship_size][column - 1] = 1;
    		ck[line + ship_size][column + 1] = 1;
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
		for(var i = -1; i <= ship_size; i ++)
			bboard[line - 1][column + i] = -1;
		for(var i = -1; i <= ship_size; i ++)
			bboard[line + 1][column + i] = -1;
		bboard[line][column - 1] = -1;
		bboard[line][column + ship_size] = -1;
	}
	else{
		for(var i = 0; i < ship_size; i ++)
			bboard[line + i][column] = ship.id;

		// Dont allow adjacent ships
		for(var i = -1; i <= ship_size; i ++)
			bboard[line + i][column - 1] = -1;
		for(var i = -1; i <= ship_size; i ++)
			bboard[line + i][column + 1] = -1;
		bboard[line - 1][column] = -1;
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
	rand_parity = getRandomInt(0, 1);

	game_type = 'Bot';
	$('#play-vs').html('Ancel');
	$('#give-up-area').show();
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

function explosion(ll, cc, bid){
	$('#' + String.fromCharCode(ll + 64) + cc + bid).removeClass('can-hit');

	var snd = new Audio("media/explosion.wav");
	snd.play();

	var canvas = document.createElement('canvas');
	canvas.id = '#canvas-' + String.fromCharCode(ll + 64) + cc + bid;
	canvas.className = 'explosion_canvas';
	canvas.width = 25;
	canvas.height = 25;
	$('#' + String.fromCharCode(ll + 64) + cc + bid).html(canvas);

	canvas = document.getElementById('#canvas-' + String.fromCharCode(ll + 64) + cc + bid);
	var dr = canvas.getContext("2d");
	var frame = 0;
	var anim_id;

	function explosion_anim() {
		dr.clearRect(0, 0, 25, 25);
		if(frame === 13){
			clearInterval(anim_id);

			var final_image = new Image();
			final_image.src = 'media/hit.png';
			final_image.className = 'hit';
			final_image.onmousedown = function(event){
				event.preventDefault();
				return false;
			};
			$('#' + String.fromCharCode(ll + 64) + cc + bid).html(final_image);
			return;
		}
		dr.drawImage(explosion_image, 39 * frame, 0, 39, 38, 0, 0, 25, 25);
		frame ++;
	}

	var explosion_image = new Image();
	explosion_image.onload = function(){
		anim_id = setInterval(explosion_anim, 73);
	};
	explosion_image.src = "media/explosion.png";
}

function splash(ll, cc, bid){
	$('#' + String.fromCharCode(ll + 64) + cc + bid).removeClass('can-hit');
	
	var snd = new Audio("media/splash.wav");
	snd.play();

	var canvas = document.createElement('canvas');
	canvas.id = '#canvas-' + String.fromCharCode(ll + 64) + cc + bid;
	canvas.className = 'splash_canvas';
	canvas.width = 25;
	canvas.height = 25;
	$('#' + String.fromCharCode(ll + 64) + cc + bid).html(canvas);

	canvas = document.getElementById('#canvas-' + String.fromCharCode(ll + 64) + cc + bid);
	var dr = canvas.getContext("2d");
	var frame = 0;
	var anim_id;

	function splash_anim() {
		dr.clearRect(0, 0, 25, 25);
		if(frame === 10){
			clearInterval(anim_id);

			var final_image = new Image();
			final_image.src = 'media/water.png';
			final_image.className = 'water';
			final_image.onmousedown = function(event){
				event.preventDefault();
				return false;
			};
			$('#' + String.fromCharCode(ll + 64) + cc + bid).html(final_image);
			return;
		}
		dr.drawImage(splash_image, 39 * frame, 0, 39, 38, 0, 0, 25, 25);
		frame ++;
	}

	var splash_image = new Image();
	splash_image.onload = function(){
		anim_id = setInterval(splash_anim, 73);
	};
	splash_image.src = "media/splash.png";
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
			explosion(line, column, 'ancel-board');
			ancel_ships_state[ancel_board[line][column]] -= 1;
			if(ancel_ships_state[ancel_board[line][column]] === 0){
				ancel_left -= 1;
				return ancel_board[line][column];
			}
		}
		else{
			splash(line, column, 'ancel-board');
		}
	}
	else{

		if(player_board[line][column] !== 0 && player_board[line][column] !== -1){
			explosion(line, column, 'player-board');
			player_ships_state[player_board[line][column]] -= 1;
			ancel_shots[line][column] = 2;
			if(player_ships_state[player_board[line][column]] === 0){
				player_left -= 1;
				last_ancel_shot = 2;
				return player_board[line][column];
			}

			last_ancel_shot = 1;
			last_ancel_line = line;
			last_ancel_column = column;
		}
		else{
        	splash(line, column, 'player-board');
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

function ancel_bot_ai_test_pos(ll, cc, dd){
	if(ancel_shots[ll][cc] !== 0)
		return false;
	if(ll < 1 || ll > 10)
		return false;
	if(cc < 1 || cc > 10)
		return false;
	for(var i = 0; i < 4; i ++)
		if(ancel_shots[ll + dirs[i][0]][cc + dirs[i][1]] === 2 && i !== ((dd + 2) % 4))
			return false;
	for(var i = 0; i < 4; i ++)
		if(ancel_shots[ll + diags[i][0]][cc + diags[i][1]] === 2)
			return false;
	return true;
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
	    						if(ancel_shots[l][c + j] !== 0 || ancel_shots[l - 1][c + j] === 2 || ancel_shots[l][c + j - 1] === 2 || ancel_shots[l + 1][c + j] === 2 || ancel_shots[l][c + j + 1] === 2 || ancel_shots[l - 1][c + j - 1] === 2 || ancel_shots[l - 1][c + j + 1] === 2 || ancel_shots[l + 1][c + j - 1] === 2 || ancel_shots[l + 1][c + j + 1] === 2)
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
	    						if(ancel_shots[l + j][c] !== 0 || ancel_shots[l + j - 1][c] === 2 || ancel_shots[l + j + 1][c] === 2 || ancel_shots[l + j][c - 1] === 2 || ancel_shots[l + j][c + 1] === 2 || ancel_shots[l + j - 1][c - 1] === 2 || ancel_shots[l + j - 1][c + 1] === 2 || ancel_shots[l + j + 1][c - 1] === 2 || ancel_shots[l + j + 1][c + 1] === 2)
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
				if((i + j) % 2 === rand_parity){
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

		var dc = [0,0,0,0];
		for(var i = 0; i < 4; i ++){
			var cur_line = last_ancel_line;
			var cur_col = last_ancel_column;
			while(ancel_bot_ai_test_pos(cur_line + dirs[i][0], cur_col + dirs[i][1], i)){
				cur_line += dirs[i][0];
				cur_col += dirs[i][1];
				dc[i] ++;
			}
		}
		var d_right = dc[0];
		var d_down = dc[1];
		var d_left = dc[2];
		var d_up = dc[3];

		var dd = getRandomInt(0, 1);

		if(d_up + d_down > d_left + d_right || (d_up + d_down === d_left + d_right && dd === 0)){
			dd = getRandomInt(0, 1);
			if(d_up === 0)
				dd = 0;
			if(d_down === 0)
				dd = 1;
			column = last_ancel_column;
			if(dd === 0)
				line = last_ancel_line + 1;	
			else
				line = last_ancel_line - 1;	
		}
		else{
			dd = getRandomInt(0, 1);
			if(d_left === 0)
				dd = 0;
			if(d_right === 0)
				dd = 1;
			line = last_ancel_line;
			if(dd === 0)
				column = last_ancel_column + 1;	
			else
				column = last_ancel_column - 1;	
		}

	}
	else{ // striking_mode = 2
		// continue striking may need to invert direction
		if(!ancel_bot_ai_test_pos(last_ancel_line + dirs[last_ancel_orient][0], last_ancel_column + dirs[last_ancel_orient][1], last_ancel_orient)){
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

function hit_bot(coord, line, column){
	var player_win = false;
	var ancel_win = false;

	turn = 'Ancel';
	$("#turn").html("Ancel");
	var r = shot('Player', coord);
	if(ancel_left === 0)
		player_win = true;
	if(r !== ''){
		var snd = new Audio("media/destroyed.wav");
		snd.play();
		for(var i = 0; i < ships_list.length; i ++)
			if(r === ships_list[i].id){
				var div = document.createElement('div');
    			div.id = "feed-player-" + i;
    			div.className = 'alert alert-success';
    			div.setAttribute('role', 'alert');
    			div.appendChild(document.createTextNode('You destroyed Ancel\'s ' + ships_list[i].name + '!'));
				$('#game-feed').prepend(div);
				$('#feed-player-' + i).delay(5000).fadeOut('slow');
			}
	}

	var cbot = ancel_bot();
	var r = shot('Ancel', cbot);
	turn = 'Player';
	$("#turn").html("You"); 
	if(player_left === 0)
		ancel_win = true;
	if(r !== ''){
		var snd = new Audio("media/destroyed.wav");
		snd.play();
		for(var i = 0; i < ships_list.length; i ++)
			if(r === ships_list[i].id){
				var div = document.createElement('div');
				div.id = "feed-ancel-" + i;
    			div.className = 'alert alert-danger';
    			div.setAttribute('role', 'alert');
    			div.appendChild(document.createTextNode('Ancel destroyed your ' + ships_list[i].name + '!'));
				$('#game-feed').prepend(div);
				$('#feed-ancel-' + i).delay(1500).fadeOut('slow');
			}
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

function hit_online(coord, line, column){
	var params = JSON.stringify({
		name: session_username,
		game: game_id,
		key: game_key,
		row: line,
		col: column
	});

	var req = new XMLHttpRequest();
	req.open("post", "http://twserver.alunos.dcc.fc.up.pt:8000/notify", true);
	req.onreadystatechange = function(){
		if(req.readyState != 4){ return; }
		if(req.status != 200){ 
			alert("There was an error communicating with the server!");
			return;
		}

		var rsp = JSON.parse(req.responseText);
		if(rsp.error !== undefined){
			alert("There was an error: " + rsp.error);
			return;
		}

		//***
	}
	req.send(params);
}

function hit(e){
	e.preventDefault();
  
	var coord = $(this).attr('data-coord');
  	var line = coord.charCodeAt(0) - 64;
	var column = parseInt(coord.substring(1));

	if(turn !== 'Player' || player_shots[line][column] !== 0)
		return;

	if(game_type === 'Online')
		hit_online(coord, line, column);
	else
		hit_bot(coord, line, column);
}

function join_game(){

	var bb = [];
	for(var i = 1; i <= 10; i ++){
		var ll = [];
		for(var j = 1; j <= 10; j ++){
			if(config_board[i][j] !== 0 && config_board[i][j] !== -1)
				ll.push(true);
			else
				ll.push(false);
		}
		bb.push(ll);
	}

	var params = JSON.stringify({
		name: session_username,
		pass: session_password,
		board: bb
	});

	var req = new XMLHttpRequest();
	req.open("post", "http://twserver.alunos.dcc.fc.up.pt:8000/join", true);
	req.onreadystatechange = function(){
		if(req.readyState != 4){ return; }
		if(req.status != 200){ 
			alert("There was an error communicating with the server!");
			return;
		}

		var rsp = JSON.parse(req.responseText);

		if(rsp.error === undefined){
			game_id = rsp.game;
			game_key = rsp.key;
			play_online();
		}
		else{
			alert("There was some error on your request! (73: " + rsp.error + ")");
			$('#go-play-config-online').click();
			return;	
		}
	}
	req.send(params);
}

function shot_online(pl, line, column, wh){
	if(pl === 'Player'){
		if(player_shots[line][column] === 0){
			score -= 1;
			$("#score").html(score);
			
			player_shots[line][column] = 1;

			if(wh){
				var hts = parseInt($("#game-progress").attr('aria-valuenow'));
				hts += 1;
				$("#game-progress").attr('aria-valuenow', hts);
				$('#game-progress').css('width', (hts * 6) + '%');
				explosion(line, column, 'ancel-board');
			}
			else
				splash(line, column, 'ancel-board');
		}
	}
	else{
		if(ancel_shots[line][column] === 0){
			ancel_shots[line][column] = 1;
			if(wh)
				explosion(line, column, 'player-board');
			else
	        	splash(line, column, 'player-board');
    	}
	}
}

function play_online(){
	game_vs = game_turn = null;

	var sse = new EventSource('http://twserver.alunos.dcc.fc.up.pt:8000/update?name=' + session_username + '&game=' + game_id + '&key=' + game_key);
	sse.onmessage = function(event){
		rsp = JSON.parse(event.data);
		
		//alert(JSON.stringify(rsp, null, 2));
		
		if(rsp.error !== undefined){
			alert("There was some error on your request! (42: " + rsp.error + ")");
			$('#go-play-config-online').click();
			game_id = game_key = null;
			event.target.close();
			return;	
		}
		if(game_vs === null || game_turn === null){
			game_vs = rsp.opponent;
			game_turn = rsp.turn;			
			$('#go-play-after-wait').click();
		}
		else if(rsp.left !== undefined){
			$('.final-score').html(score);
			if(rsp.left === session_username)
				$('#show-lose').click();
			else
				$('#show-win').click();
			game_id = game_key = null;
			event.target.close();
			return;
		}
		else{
			var ll = rsp.move.row + 1;
			var cc = rsp.move.col + 1;
			var hh = rsp.move.hit;

			if(rsp.move.name === session_username){
				shot_online('Player', ll, cc, hh);

				turn = game_turn;
				$('#turn').html(game_vs);
			}
			else{
				shot_online(game_vs, ll, cc, hh);

				turn = 'Player';
				$('#turn').html('You');	
			}

			if(rsp.winner !== undefined){
				$('.final-score').html(score);
				if(rsp.winner === session_username)
					$('#show-win').click();
				else
					$('#show-lose').click();
				game_id = game_key = null;
				event.target.close();
				return;
			}
		}
	};
}

function init_game_online(){
	player_shots = new Array(12);
	ancel_shots = new Array(12);
	player_board = new Array(12);
	for(var i = 0; i <= 11; i++){
		player_shots[i] = new Array(12);
		ancel_shots[i] = new Array(12);
		player_board[i] = new Array(12);
		for(var j = 0; j <= 11; j ++){
			player_shots[i][j] = 0;
			ancel_shots[i][j] = 0;
			player_board[i][j] = 0;
		}
	}

	game_type = 'Online';
	$('#play-vs').html(game_vs);
	$('#give-up-area').hide();
	if(game_turn === session_username){
		turn = 'Player';
		$('#turn').html('You');	
	}
	else{
		turn = game_turn;
		$('#turn').html(game_vs);
	}

	score = 100;
	$('#score').html('100');
	$('#game-progress').attr('aria-valuenow', '0');
	$('#game-progress').css('width', '0%');

	for(var i = 0; i < ships_list.length; i ++)
		place_ship('player-board', player_board, ships_pos[ships_list[i].id], ships_list[i], true);
}

function stop_game_online(){
	if(game_id === null)
		return;

	var params = JSON.stringify({
		name: session_username,
		key: game_key,
		game: game_id
	});

	var req = new XMLHttpRequest();
	req.open("post", "http://twserver.alunos.dcc.fc.up.pt:8000/leave", true);
	req.onreadystatechange = function(){
		if(req.readyState != 4){ return; }
		if(req.status != 200){
			alert("There was an error communicating with the server!");
			return;
		}

		var rsp = JSON.parse(req.responseText);

		if(rsp.error !== undefined){
			alert("There was some error stopping the game! (" + rsp.error + ")");
			return;
		}
	}
	req.send(params);
	game_id = game_key = null;
}

function is_playing_online(){
	return (game_id !== null);
}