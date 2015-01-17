var session_username = null;
var session_password = null;

function setCookie(cname, cvalue, exdays){
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
} 

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
} 

function login(un, pw, se){
	var params = JSON.stringify({
		name: un,
		pass: pw
	});

	var req = new XMLHttpRequest();
	req.open("post", SERVER_URL() + "/register", true);
	req.setRequestHeader("Content-type", "application/json");
	req.onreadystatechange = function(){
		if(req.readyState != 4){ return; }
		if(req.status != 200){ 
			if(se)
				alert("There was an error communicating with the server!");
			return;
		}

		var rsp = JSON.parse(req.responseText);
		if(rsp.error === undefined){
			session_username = un;
			session_password = pw;
			var ll = document.createElement('a');
			var bs = document.createElement('strong');
			var tt = document.createTextNode(session_username);
			bs.appendChild(tt);
			ll.appendChild(bs);
			$('#signin-place').html(ll);
			if(se){
				setCookie('username', session_username, 2);
				setCookie('password', session_password, 2);
				$('#go-home').click();
			}
		}
		else{
			if(se){
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
	}
	req.send(params);
}

function sign_in(){
	var un = $('#username').val();
	var pw = $('#password').val();
	login(un, pw, true);
	return false;
}

$(document).ready(function(){
	var un = getCookie('username');
	var pw = getCookie('password');
	if(un !== "" && pw !== "")
		login(un, pw, false);
});