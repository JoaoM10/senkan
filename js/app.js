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

  app.controller('HallOfFameController', function(){
    this.hall_of_fame = [
      {pos: 1, username: 'Joao', score: 83},
      {pos: 2, username: 'Filipe', score: 82},
      {pos: 3, username: 'Pedro', score: 81},
      {pos: 4, username: 'Joaquim', score: 80},
      {pos: 5, username: 'Miguel', score: 79},
      {pos: 6, username: 'Antonio', score: 78},
      {pos: 7, username: 'Rita', score: 77},
      {pos: 8, username: 'Maria', score: 76},
      {pos: 9, username: 'Andre', score: 75},
      {pos: 10, username: 'Ze', score: 74}
    ];

    //****
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

    this.randomConfig = function(){
      random_config_board();
      this.setMode(4);
    };
  });



})();
