(function(){
  var app = angular.module('Senkan', []);
  var gameMode = 1;
  var vs = 'Ancel';

  app.controller('TabController', function(){
    this.tab = 1;

    this.setTab = function(newValue){
      if(is_playing_online()){
        alert("You can't leave the game!");
        return;
      }
      this.tab = newValue;
      gameMode = 1;
      vs = 'Ancel';
      if(this.tab === 3)
        hof_update();
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };
  });

  app.controller('GameController', function(){

    this.setMode = function(newValue){
      var aw = false;
      if(newValue === 10){
        newValue = 4;
        aw = true;
      }
      if(newValue === 4){
        if(!check_config_board()){
          alert("You have to place all the ships on the board!");
          return;
        }
        else{
          if(vs === 'Ancel'){
            $('#player-bspace').html(create_board('player-board', 0));
            $('#ancel-bspace').html(create_board('ancel-board', 2));
            $('#game-feed').html('');
            init_game_ancel();
          }
          else{
            if(aw){
              $('#player-bspace').html(create_board('player-board', 0));
              $('#ancel-bspace').html(create_board('ancel-board', 2));
              $('#game-feed').html('');
              init_game_online();
            }
            else{
              newValue = 9;
              join_game();
            }
          }
        }
      }
      if(newValue === 3 && session_username === null){
        alert("You need to sign in first!");
        return;
      }
      gameMode = newValue;
      if(gameMode === 2 || gameMode === 3){
        $('#config-space').html('<div id="ships-wrapper"></div>');
        $(create_board('config-board', 1)).insertBefore('#ships-wrapper');
        $('#ships-wrapper').html(create_ships());
        if(gameMode === 2){
          vs = 'Ancel';
          $('#config-vs').html('Playing against Ancel');
        }
        else{
          vs = 'Online';
          $('#config-vs').html('Playing online');
        }
        gameMode = 2;
      }
    };

    this.isSet = function(modeName){
      return gameMode === modeName;
    };

    this.randomConfig = function(){
      random_config_board();
      this.setMode(4);
    };

    this.stopWaiting = function(){
      stop_game_online();
      this.setMode(1);
    };
  });



})();
