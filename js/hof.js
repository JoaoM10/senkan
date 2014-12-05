
function hof_update(){

  var req = new XMLHttpRequest();
  req.open("post", "http://twserver.alunos.dcc.fc.up.pt:8000/ranking", true);
  req.onreadystatechange = function(){
    if(req.readyState != 4){ return; }
    if(req.status != 200){ 
      alert("There was an error updating the hall of fame!");
      return;
    }
    var hof = JSON.parse(req.responseText);

    $('#hof-body').html('');
    for(var i = 0; i < 10; i ++){
      var tr = document.createElement('tr');
    
      var td_px = document.createElement('td');
      td_px.appendChild(document.createTextNode(i + 1));
      tr.appendChild(td_px);
    
      var td_un = document.createElement('td');
      td_un.appendChild(document.createTextNode(hof.ranking[i].name));
      tr.appendChild(td_un);
    
      var td_pt = document.createElement('td');
      td_pt.appendChild(document.createTextNode(100 - hof.ranking[i].shots));
      tr.appendChild(td_pt);

      $('#hof-body').append(tr);
    }
  }
  req.send("{}");
}
