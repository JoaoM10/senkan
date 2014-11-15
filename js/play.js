var player_board;
var ancel_board;
var player_shots;
var ancel_shots;
var turn;

function generate_ancel_board(){

	var tmp_pos = new Array();
    for(var i = 0; i < ships_list.length; i ++){
    	var orient = rand() % 2;
    	var cnt = 0;
    	// count possible positions... pp[]
    	var r = rand() % cnt;
    	// place on pp[r]
    	tmp_pos = (orient == 0 ? 'H' : 'V') + pp[r];
    }



}

function place_ship(bid, bboard, pos, ship, vis){

	// mark bool board

	if(vis){

		// mark visual board

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
	}

	ancel_pos = generate_ancel_board();
	turn = 'Player';

	for(var i = 0; i < ships_list.length; i ++){
		place_ship('player-board', player_board, ships_pos[ships_list[i].id], ships_list[i], true);
		place_ship('ancel-board', ancel_board, ancel_pos[ships_list[i].id], ships_list[i], false);
	}
}
