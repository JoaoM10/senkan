
function Ship(id, name, imgs, url){
  this.id = id;
  this.name = name;
  this.imgs = imgs
  this.url = url;
}

var ship5Images = [
  'media/ships/ship5_1.png',
  'media/ships/ship5_2.png',
  'media/ships/ship5_3.png',
  'media/ships/ship5_4.png',
  'media/ships/ship5_5.png'
]
var ship4Images = [
  'media/ships/ship4_1.png',
  'media/ships/ship4_2.png',
  'media/ships/ship4_3.png',
  'media/ships/ship4_4.png'
]
var ship3Images = [
  'media/ships/ship3_1.png',
  'media/ships/ship3_2.png',
  'media/ships/ship3_3.png'
]
var ship2Images = [
  'media/ships/ship2_1.png',
  'media/ships/ship2_2.png'
]

var ship5   = new Ship('ship5', 'Aircraft carrier', ship5Images, 'media/ships/ship5.png');
var ship4   = new Ship('ship4', 'Battleship', ship4Images, 'media/ships/ship4.png');
var ship3_1 = new Ship('ship3_1', 'Submarine', ship3Images, 'media/ships/ship3.png');
var ship3_2 = new Ship('ship3_2', 'Destroyer', ship3Images, 'media/ships/ship3.png');
var ship_2  = new Ship('ship2', 'Patrol boat', ship2Images, 'media/ships/ship2.png');
var ships_list = [ship5, ship4, ship3_1, ship3_2, ship_2];

function create_ships(){
  var ship_out = [];
  for(var i = 0; i < ships_list.length; i ++){
    var ship = ships_list[i];
    var div = document.createElement('div');
    div.className = 'text-left ship-area';
    div.appendChild(document.createTextNode(ship.name + ':'));
    div.appendChild(document.createElement('br'));
    var image = new Image();
    image.src = ships_list[i].url;
    image.className = ship.id;
    image.setAttribute('draggable', 'true');

    image.addEventListener('dragstart', dragStart, false);
    image.addEventListener('dblclick', rotateShip, false);
    
    div.appendChild(image);
    ship_out.push(div);
  }
  return ship_out;
}

