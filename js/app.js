(function(){
  var app = angular.module('Senkan', []);
  var gameMode = 1;

  app.controller('TabController', function(){
    this.tab = 1;

    this.setTab = function(newValue){
      this.tab = newValue;
      gameMode = 1;
      if(this.tab === 3)
        hof_update();
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };
  });

  app.controller('GameController', function(){
    this.vs = 'Ancel';

    this.setMode = function(newValue){
      if(newValue === 4){
        if(!check_config_board()){
          alert("You have to place all the ships on the board!");
          return;
        }
        else{
          $('#player-bspace').html(create_board('player-board', 0));
          $('#ancel-bspace').html(create_board('ancel-board', 2));
          $('#game-feed').html('');
          init_game_ancel();
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
          this.vs = 'Ancel';
          $('#config-vs').html('Playing against Ancel');
        }
        else{
          this.vs = 'Online';
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
  });



})();
