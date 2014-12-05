var session_username = null;
var session_password = null;

function login(){
	var un = $('#username').val();
	var pw = $('#password').val();

	var params = JSON.stringify({
		name: un,
		pass: pw
	});

	var req = new XMLHttpRequest();
	req.open("post", "http://twserver.alunos.dcc.fc.up.pt:8000/register", true);
	req.onreadystatechange = function(){
		if(req.readyState != 4){ return; }
		if(req.status != 200){ 
			alert("There was an error communicating with the server!");
			return;
		}
		
		var rsp = JSON.parse(req.responseText);
		if(rsp.error === undefined){
			session_username = un;
			session_password = pw;
			$('#signin-place').html('<a><strong>' + session_username + '</strong></a>');
			$('#go-home').click();
		}
		else{
			var div = document.createElement('div');
    		div.className = 'alert alert-danger';
    		div.setAttribute('role', 'alert');
    		msg = document.createElement('strong');
    		msg.appendChild(document.createTextNode('There was an error in your login:'));
    		div.appendChild(msg);
    		div.appendChild(document.createElement('br'));
    		div.appendChild(document.createTextNode(rsp.error));
			$('#signin-feed').html(div);
		}
	}
	req.send(params);

	return false;
}