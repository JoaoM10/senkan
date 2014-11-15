
var dragObject = null;

var last_line = 'A';
var last_column = 1;
var last_size = 0;
var last_orientation = 'H';

var config_board;
var ships_pos;

function create_board(id, wl = false){
  var table = document.createElement('table');
  table.id = id;
  table.className = 'game-board'
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  tr.appendChild(th);
  for(var i = 1; i <= 10; i ++){
    var th = document.createElement('th');
    th.innerHTML = i;
    tr.appendChild(th);
  }
  table.appendChild(tr);
  if(wl){
    config_board = new Array(11);
    for(var i = 1; i <= 10; i++)
      config_board[i] = new Array(11);
    ships_pos = new Array();
    for(var i = 0; i < ships_list.length; i ++)
      ships_pos[ships_list[i].id] = null;
  }
  for(var i = 1; i <= 10; i ++){
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.innerHTML = String.fromCharCode(i + 64);
    tr.appendChild(th);
    for(var j = 1; j <= 10; j ++){
      var td = document.createElement('td');
      td.id = String.fromCharCode(i + 64) + j;
      td.setAttribute('data-coord', String.fromCharCode(i + 64) + j);
      if(wl){
        td.addEventListener('dragenter', dragEnter, false);
        td.addEventListener('dragover', dragOver, false);
        td.addEventListener('dragleave', dragLeave, false);
        td.addEventListener('drop', drop, false);
        td.addEventListener('drop', dragEnd, false);
      }
      tr.appendChild(td);
      if(wl)
        config_board[i][j] = 0;
    }
    table.appendChild(tr);
  }
  return table;
}

function check_config_board(){
  for(var i = 0; i < ships_list.length; i ++)
    if(ships_pos[ships_list[i].id] === null){
      alert("missing " + ships_list[i].id);
      return false;
    }
  return true;
}

function dragStart(e){
  $(this).addClass('used');
  $(this).attr('draggable', 'false');
  this.onmousedown = function(event){
    event.preventDefault();
    return false;
  };
  dragObject = this;
  var dragIcon = document.createElement('img');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('image/png', this.innerHTML);
  if($(this).hasClass('ship3_1') || $(this).hasClass('ship3_2'))
    dragIcon.src = 'media/ships/ship3.png'
  else  
    dragIcon.src = 'media/ships/' + $(this).attr('class').substring(0, 5) + '.png'
  e.dataTransfer.setDragImage(dragIcon, 15, 15);
  return true;
}

function check_ship_place(linec, column, ship_size){
  if(column + ship_size - 1 <= 10){
    for(var i = 0; i < ship_size; i ++)
      if(config_board[linec.charCodeAt(0) - 64][column + i] !== 0)
        return false;
  }
  else
    return false;
  return true;
}

function dragEnter(e){
  e.preventDefault();

  for(var i = 0; i < last_size; i ++)
    $('#' + last_line + (last_column + i)).removeClass('over');

  var coord = $(this).attr('data-coord');
  var linec = coord.substring(0, 1);
  var column = parseInt(coord.substring(1));
  var ship = $(dragObject).attr('class').substring(0,5);
  var ship_size = parseInt(ship.substring(4, 5));
  if(ship_size == 3)
    ship = $(dragObject).attr('class').substring(0,7);
  
  if(check_ship_place(linec, column, ship_size)){
    for(var i = 0; i < ship_size; i ++)
      $('#' + linec + (column + i)).addClass('over');
    last_line = linec;
    last_column = column;
    last_size = ship_size;
  }
  //else
    //$('#' + linec + (column + i)).addClass('forbidden');
}

function dragOver(e){
  if(e.preventDefault)
    e.preventDefault();
  
  var coord = $(this).attr('data-coord');
  var linec = coord.substring(0, 1);
  var column = parseInt(coord.substring(1));
  var ship = $(dragObject).attr('class').substring(0,5);
  var ship_size = parseInt(ship.substring(4, 5));
  if(ship_size == 3)
    ship = $(dragObject).attr('class').substring(0,7);

  if(check_ship_place(linec, column, ship_size))
    e.dataTransfer.dropEffect = 'move';
  else
    e.dataTransfer.dropEffect = 'none';
  
  return false;
}

function dragLeave(e){
  e.preventDefault();
  //****
}

function drop(e){
  if(e.stopPropagation)
    e.stopPropagation();
  
  e.preventDefault();

  var coord = $(this).attr('data-coord');
  var linec = coord.substring(0, 1);
  var column = parseInt(coord.substring(1));
  var ship = $(dragObject).attr('class').substring(0,5);
  var ship_size = parseInt(ship.substring(4, 5));
  if(ship_size == 3)
    ship = $(dragObject).attr('class').substring(0,7);

  for(var i = 0; i < ships_list.length; i ++){
    if(ship === ships_list[i].id){
      var imgs = ships_list[i].imgs;

      for(var j = 0; j < ship_size; j ++){
        var image = new Image();
        image.src = imgs[j];
        image.className = ship + "_" + j;
        image.onmousedown = function(event){
          event.preventDefault();
          return false;
        };

        $('#' + linec + (column + j)).append(image);

        config_board[linec.charCodeAt(0) - 64][column + j] = i + 1;
      }
      
      ships_pos[ship] = 'H' + linec + column;
    }
  }

  return false;
}

document.addEventListener('dragend', function noDrop(event) {
  if(event.dataTransfer.dropEffect !== 'move'){
      $(dragObject).removeClass('used');
      $(dragObject).attr('draggable', 'true');
      dragObject.onmousedown = function(event){
        return true;
      };
  }
});

function dragEnd(e){
  e.preventDefault();
  
  for(var i = 0; i < last_size; i ++)
    $('#' + last_line + (last_column + i)).removeClass('over');
}
