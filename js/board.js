
var dragObject = null;

var last_line = 'A';
var last_column = 1;
var last_size = 0;
var last_orientation = 'H';

var config_board;
var ships_pos;

function create_board(id, wl){
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
  if(wl === 1){
    config_board = new Array(11);
    for(var i = 1; i <= 10; i++){
      config_board[i] = new Array(11);
      for(var j = 1; j <= 10; j ++)
        config_board[i][j] = 0;
    }
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
      if(wl !== 1)
        td.id += id;
      td.setAttribute('data-coord', String.fromCharCode(i + 64) + j);
      if(wl === 1){
        td.addEventListener('dragenter', dragEnter, false);
        td.addEventListener('dragover', dragOver, false);
        td.addEventListener('dragleave', dragLeave, false);
        td.addEventListener('drop', drop, false);
        td.addEventListener('drop', dragEnd, false);
        config_board[i][j] = 0;
      }
      else if(wl === 2){
        td.className = 'can-hit';
        td.addEventListener('click', hit, false);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function check_config_board(){
  for(var i = 0; i < ships_list.length; i ++)
    if(ships_pos[ships_list[i].id] === null)
      return false;
  return true;
}

function rotateShip(e){
  if($(this).hasClass('rot_ship')){
    var ss = $(this).attr('src');
    var ns = ss.substring(0, 17) + '.png';
    $(this).attr("src", ns);
    $(this).removeClass('rot_ship');
  }
  else{
    var ss = $(this).attr('src');
    var ns = ss.substring(0, 17) + '_v.png';
    $(this).attr("src", ns);
    $(this).addClass('rot_ship');
  }
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
  var ifrot = '';
  if($(this).hasClass('rot_ship'))
    ifrot = '_v';
  if($(this).hasClass('ship3_1') || $(this).hasClass('ship3_2'))
    dragIcon.src = 'media/ships/ship3' + ifrot + '.png';
  else  
    dragIcon.src = 'media/ships/' + $(this).attr('class').substring(0, 5) + ifrot + '.png';
  e.dataTransfer.setDragImage(dragIcon, 15, 15);
  return true;
}

function check_ship_place(linec, column, ship_size, orient){
  if(orient === 'H'){
    if(column + ship_size - 1 <= 10){
      for(var i = 0; i < ship_size; i ++)
        if(config_board[linec.charCodeAt(0) - 64][column + i] !== 0)
          return false;
    }
    else
      return false;
  }
  else{
    if(linec.charCodeAt(0) - 64 + ship_size - 1 <= 10){
      for(var i = 0; i < ship_size; i ++)
        if(config_board[linec.charCodeAt(0) - 64 + i][column] !== 0)
          return false;
    }
    else
      return false;
  }
  return true;
}

function dragEnter(e){
  e.preventDefault();

  for(var i = 0; i < last_size; i ++)
    if(last_orientation === 'H')
      $('#' + last_line + (last_column + i)).removeClass('over');
    else
      $('#' + String.fromCharCode(last_line.charCodeAt(0) + i) + last_column).removeClass('over');

  var coord = $(this).attr('data-coord');
  var linec = coord.substring(0, 1);
  var line = linec.charCodeAt(0) - 64;
  var column = parseInt(coord.substring(1));
  var ship = $(dragObject).attr('class').substring(0,5);
  var ship_size = parseInt(ship.substring(4, 5));
  if(ship_size == 3)
    ship = $(dragObject).attr('class').substring(0,7);
  var orient = 'H';
  if($(dragObject).hasClass('rot_ship'))
    orient = 'V';

  if(check_ship_place(linec, column, ship_size, orient)){
    for(var i = 0; i < ship_size; i ++)
      if(orient === 'H')
        $('#' + linec + (column + i)).addClass('over');
      else
        $('#' + String.fromCharCode(line + i + 64) + column).addClass('over');

    last_line = linec;
    last_column = column;
    last_size = ship_size;
    last_orientation = orient;
  }
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
  var orient = 'H';
  if($(dragObject).hasClass('rot_ship'))
    orient = 'V';

  if(check_ship_place(linec, column, ship_size, orient))
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
  var orient = 'H';
  if($(dragObject).hasClass('rot_ship'))
    orient = 'V';

  for(var i = 0; i < ships_list.length; i ++){
    if(ship === ships_list[i].id){
      ships_pos[ship] = orient + linec + column;
      place_ship('', config_board, ships_pos[ships_list[i].id], ships_list[i], true);
      var ss = $(dragObject).attr('src');
      var ns = ss.substring(0, 17) + '.png';
      $(dragObject).attr("src", ns);
      $(dragObject).removeClass('rot_ship');
      dragObject.removeEventListener('dblclick', rotateShip, false);
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
    if(last_orientation === 'H')
      $('#' + last_line + (last_column + i)).removeClass('over');
    else
      $('#' + String.fromCharCode(last_line.charCodeAt(0) + i) + last_column).removeClass('over');
}

function random_config_board(){
  ships_pos = generate_ship_positions();
  config_board = new Array(11);
  for(var i = 1; i <= 10; i++){
    config_board[i] = new Array(11);
    for(var j = 1; j <= 10; j ++)
      config_board[i][j] = 0;
  }
  for(var i = 0; i < ships_list.length; i ++)
    place_ship('', config_board, ships_pos[ships_list[i].id], ships_list[i], false);
}