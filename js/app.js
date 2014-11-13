(function() {
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
      if(gameMode === 2)
        init_game_board();
    };

    this.isSet = function(modeName){
      return gameMode === modeName;
    };
  });


  function init_game_board() {
    $("#wrapper").empty();

    $("#wrapper").append("<div class=\"square square-corner\"></div>");
    for(i = 1; i <= 10; i ++)
      $("#wrapper").append("<div class=\"square square-head\">" + i.toString() + "</div>");
    for(i = 0; i < 10; i ++){
      $("#wrapper").append("<div class=\"square square-head\">" + String.fromCharCode("A".charCodeAt(0) + i) + "</div>");
      for(j = 0; j < 10; j ++){
        $("#wrapper").append("<div class=\"square\"></div>");
      }
    }

    $("#wrapper").append("<script type=\"text/javascript\">$(function(){ $('.square').droppable({ drop: handleDrop }); });</script>");
  }

})();
