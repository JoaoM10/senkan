(function(){
  var app = angular.module('Senkan', []);
  gameMode = 1;

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
      gameMode = newValue;
      if(gameMode === 2){
        $('#config-space').html('<div id="ships-wrapper"></div>');
        $(create_board('config-board', true)).insertBefore('#ships-wrapper');
        $('#ships-wrapper').append(create_ships());
      }
    };

    this.isSet = function(modeName){
      return gameMode === modeName;
    };
  });



})();
