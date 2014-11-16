(function(){
  var app = angular.module('Senkan', []);
  var gameMode = 1;

  app.controller('TabController', function(){
    this.tab = 1;

    this.setTab = function(newValue){
      this.tab = newValue;
      gameMode = 1;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };
  });

  app.controller('GameController', function(){

    this.setMode = function(newValue){
      if(newValue === 4){
        if(!check_config_board()){
          alert("You have to place all the ships on the board!");
          return;
        }
        else{
          $('#player-bspace').html(create_board('player-board', 0));
          $('#ancel-bspace').html(create_board('ancel-board', 2));
          init_game_ancel();
        }
      }
      gameMode = newValue;
      if(gameMode === 2){
        $('#config-space').html('<div id="ships-wrapper"></div>');
        $(create_board('config-board', 1)).insertBefore('#ships-wrapper');
        $('#ships-wrapper').html(create_ships());
      }
    };

    this.isSet = function(modeName){
      return gameMode === modeName;
    };
  });



})();
