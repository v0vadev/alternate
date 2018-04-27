//technical
if(getCookie('lang') == undefined || getCookie('lang') == 'ru' || getCookie('lang') == 'en'){
	setCookie('lang', 'ru_RU');
}

if(getCookie('sn') == undefined){
	setCookie('sn', 'id'+getCookie('uid'));
}

var xhr = new XMLHttpRequest();
	xhr.open('GET', '/altvk/lang/'+getCookie('lang')+'.json', true);
xhr.send();
xhr.onreadystatechange = function(){
	if(this.readyState != 4) return;
	window.lang = JSON.parse(xhr.responseText);
}

function login(){
	var login = document.getElementById('user-login').value;
	var password = document.getElementById('user-password').value;
	var client = ae.find('.client-choose').options[ae.find('.client-choose').selectedIndex].value;
	var loginBtn = ae.find('.loginBtn');
	loginBtn.disabled = true;
	ae.html(loginBtn, '<i class="fa fa-circle-o-notch fa-spin"></i>');
	ae.authorize(login, password, client, loginErr);
}

function loginErr(d){
	var loginBtn = ae.find('.loginBtn');
	loginBtn.disabled = false;
	ae.html(loginBtn, lang.login_do);
	var login = document.getElementById('user-login').value;
	var password = document.getElementById('user-password').value;
	var capDiv = ae.find('.cap-div');
	if(d.error == 'need_captcha'){
		ae.closeModal('main');
		ae.html(capDiv, '<div class="modalDialog" data-modal="captcha"><div><div class="modal-header"><a href="#" class="close"><i class="aei-cross"></i></a><h3>'+lang.need_captcha+'</h3></div><div class="modal-body"><img src="'+d.captcha_img+'"><br><input type="text" placeholder="'+lang.captcha_input+'" id="captcha" class="input-text"></div><div class="modal-footer"><button class="button cancel" onclick="ae.closeModal(\'captcha\')">'+lang.cancel+'</button><button class="button accept captcha-ok">'+lang.accept+'</button></div></div></div>');
		var btn = ae.find('.captcha-ok');
		btn.onclick = function(){
			ae.closeModal('captcha');
			var key = ae.find('#captcha').value;
			ae.authorize(login, password, loginErr, d.captcha_sid, key);
		}
		ae.openModal('captcha');
	}
	if(d.error == 'invalid_client'){
		ae.closeModal('main');
		ae.html(capDiv, '<div class="modalDialog" data-modal="invalid_user"><div><div class="modal-header"><a href="#" class="close"><i class="aei-cross"></i></a><h4>'+lang.login_invalid_client+'</h4></div><div class="modal-body"><p>'+lang.login_invalid_client+'</p></div><div class="modal-footer"><button class="button accept invalid-user-btn">'+lang.accept+'</button></div></div></div>');
		ae.openModal('invalid_user');
		var btn = ae.find('.invalid-user-btn');
		btn.onclick = function(){
			ae.closeModal('invalid_user');
			ae.openModal('main');
		}
	}
}

/*$('body').swipe({
	swipe: function(e, dir){
		if(dir == 'right'){
			var pc = ae.pageContent();
			//ae.attr(pc, 'style', 'display: none;');
			ae.showMenu();
		}
		if(dir == 'left'){
			ae.closeMenu();
		}
	}
});*/

if(getCookie('token') == undefined){
if(document.documentElement.scrollWidth > 720){
	var title = ae.find('.unlogged');
	title.remove();
	var header = ae.find('.navbar');
	header.innerHTML = '<a href="id'+getCookie('uid')+'" class="title"><i class="aei-logo"></i> Alternate</a>';
}
}

setTimeout(function(){
var cont = ae.pageContent();
var pre = ae.find('.preloader');
if(getCookie('token') != undefined){
	loadMenu();
	$(document).ready(loadPageFromHash);
		pre.remove();
} else{
	window.location.hash = '';
	var menu = ae.getMenu();
	ae.html(menu, '<button class="button accept w90" onclick="ae.openModal(\'main\')">'+lang.login_do+'</button>');
	ae.append(cont, '<button onclick="ae.setLanguage(true)">'+lang.info.title+'</button><a onclick="ae.openModal(\'main\')">'+lang.login_do+'</a></div><div class="modalDialog" data-modal="main"><div><div class="modal-header"><a class="close"><i class="aei-cross"></i></a><h3>'+lang.login_title+'</h3></div><div class="modal-body"><p>'+lang.login_text+'</p><p><input type="text" placeholder="'+lang.login_login+'" class="input-text" id="user-login"><br><input type="password" placeholder="'+lang.login_password+'" class="input-text" id="user-password"><p class="annotation">'+lang.login_demo_about+'<br><select class="client-choose"><optgroup label="'+lang.login_client+':"><option value="1">Android</option>><option value="2">Kate Mobile</option></optgroup></select></p></div><div class="modal-footer"><button class="button cancel" onclick="ae.closeModal(\'main\')">'+lang.cancel+'</button><a href="https://oauth.vk.com/authorize?client_id=6376423&display=page&redirect_uri=https://vkrot.xyz/altvk/&callback&scope=135204062&response_type=code&revoke=1&v=5.73"><button class="button cancel">'+lang.login_demo+'</button></a><button class="button accept loginBtn" onclick="login()">'+lang.login_do+'</button></div></div></div>');
	pre.remove();
}
}, 2000);

function loadMenu(){
	var menu = ae.getMenu();
ae.html(menu, '<ul><li><a href="#'+getCookie('sn')+'">'+lang.menu.my_page+'</a></li><li><a href="#feed">'+lang.menu.feed+'</a></li><li><a href="#notify">'+lang.menu.notifications+'</a></li><li><a href="#friends">'+lang.menu.friends+'</a></li><li><a href="#mail">'+lang.menu.mail+'</a></li><li><a href="#groups">'+lang.menu.groups+'</a></li><li><a href="#audio">'+lang.menu.audio+'</a></li></ul><button class="button cancel w40" onclick="ae.setLanguage(true)">'+lang.info.title+'</button><button onclick="ae.logout()" class="button cancel w40">'+lang.logout+'</button>');
//ae.html(menu, '<ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li><li><a href="#">Item 3</a></li><li><a href="#">Item 4</a></li></ul>');
}

function loadPageFromHash(){
	//i didnt want to use jquery, but i have to do that. sorry
	var cont = ae.pageContent();
	var hash = window.location.hash.substr(1);
	hash = hash.split('?')[0];
	var load = '/altvk/pages/'+hash+'/#cont';
	if(window.location.hash.contains('#wall')){
		var id = hash.substr(4);
		load = '/altvk/pages/wall/?id='+id+'#cont';
	}
	$(cont).load(load, function(r,s,xhr){
		if(xhr.status == 404){
			ae.VKapi('users.get', 'user_ids|v', hash+'|5.73', function(d){
				var d = JSON.parse(d);
				if(d.error != undefined){
					if(d.error.error_code == 113){
						ae.VKapi('groups.getById', 'group_ids|v', hash+'|5.73', function(da){
							var da = JSON.parse(da);
							if(da.error != undefined){
								if(da.error.error_code == 100){
									var load = '/altvk/pages/404.html';
									$(cont).load(load);
								}
							} else{
								var load = '/altvk/pages/group/?id='+hash+'#cont';
								$(cont).load(load);
							}
						});
					}
				} else{
					var load = '/altvk/pages/id/?id='+hash+'#cont';
					$(cont).load(load);
				}
			});
		}
	});
}

window.onhashchange = loadPageFromHash;

function openChangeStatus(){
	if(getCookie('demo') == '1'){
	var cont = ae.pageContent();
	var status = ae.find('.statusSpan');
	if(status.textContent == lang.status_change){
		var st = '';
	} else{
		var st = status.textContent;
	}
	ae.append(cont, '<div class="modalDialog" data-modal="changeStatus"><div><div class="modal-header"><a class="close"><i class="aei-cross"></i></a><h3>'+lang.status_change+'</h3></div><div class="modal-body"><p>'+lang.status_about+'</p><input type="text" id="status" class="input-text" placeholder="'+lang.status_placeholder+'"></div><div class="modal-footer"><button class="button cancel" onclick="ae.closeModal(\'changeStatus\')">'+lang.cancel+'</button><button class="button accept" onclick="saveStatus()">'+lang.save+'</button></div></div></div>');
	var stsp = ae.find('#status');
	stsp.value = st;
	ae.openModal('changeStatus');
	}
}

function saveStatus(){
	var status = ae.find('#status');
	var stsp = ae.find('.statusSpan');
	ae.VKapi('status.set', 'text|access_token|v', status.value+'|'+getCookie('token')+'|5.73', function(d){
		var d = JSON.parse(d);
		if(d.response == 1){
			if(status.value != ''){
			stsp.textContent = status.value;
			} else{
				stsp.textContent = lang.status_change;
			}
		ae.closeModal('changeStatus');
		} else{
			ae.VKapierr(d.error.error_code, d.error.error_msg);
		}
	});
}

function goOffline(){
	ae.VKapi('account.setOffline', 'access_token|v', getCookie('token')+'|5.73', function(d){
		var d = JSON.parse(d);
		if(d.response == 1){
			var onlineDot = ae.find('.online');
			onlineDot.remove();
		} else{
			ae.VKapierr(d.error.error_code, d.error_error_msg);
		}
	});
}

function createGroup(){
	var name = ae.find('#group-name').value;
	var type = ae.find('.groupType');
	type = type.options[type.options.selectedIndex].value;
	ae.VKapi('groups.create', 'title|type|subtype|access_token|v', name+'|'+type+'|1|'+getCookie('token')+'|5.73', function(d){
		var d = JSON.parse(d);
		if(d.response != undefined){
			ae.closeModal('createGroup');
			window.location.hash = '#'+d.response.screen_name;
		} else{
			ae.VKapierr(d.error.error_code, d.error.error_msg);
		}
	});
}

function jlGroup(id,joinOrLeave){
	var btn = ae.find('.jlbtn');
	if(joinOrLeave){
		ae.VKapi('groups.join','group_id|access_token|v',id+'|'+getCookie('token')+'|5.74',function(d){
			var d = JSON.parse(d);
			if(d.response != undefined){
				ae.attr(btn,'class','button cancel w90 jlbtn');
				ae.attr(btn,'onclick','jlGroup('+id+',false)');
				ae.html(btn,lang.group_leave);
			} else{
				ae.VKapierr(d.error.error_code,d.error.error_msg);
			}
		});
	} else{
		ae.VKapi('groups.leave','group_id|access_token|v',id+'|'+getCookie('token')+'|5.74',function(d){
			var d = JSON.parse(d);
			if(d.response != undefined){
				ae.attr(btn,'class','button accept w90 jlbtn');
				ae.attr(btn,'onclick','jlGroup('+id+',true)');
				ae.html(btn,lang.group_join);
			} else{
				ae.VKapierr(d.error.error_code,d.error.error_msg);
			}
		});
	}
}

function groupSave(id){
	var name = ae.find('#group-name').value;
	var sn = ae.find('#group-sn').value;
	ae.VKapi('groups.edit', 'group_id|title|screen_name|access_token|v', id+'|'+name+'|'+sn+'|'+getCookie('token')+'|5.73', function(d){
		var d = JSON.parse(d);
		if(d.response != undefined){
			alert('ok');
		} else{
			ae.VKapierr(d.error.error_code, d.error.error_msg);
		}
	});
}

function clearGroups(){
	var groups = [];
	ae.VKapi('groups.get','user_id|count|access_token|v',getCookie('uid')+'|1000|'+getCookie('token')+'|5.74',function(d){
		var d = JSON.parse(d);
		for(i=0;i<d.response.items.length;i++){
			leaveGroup(d.response.items[i]);
		}
	});
}

function leaveGroup(id,cid){
	if(cid == undefined){
		var par = 'group_id|access_token|v';
		var p = id+'|'+getCookie('token')+'|5.74';
	} else{
		var ckey = ae.find('.ckey').value;
		var par = 'group_id|captcha_sid|captcha_key|access_token|v';
		var p = id+'|'+cid+'|'+ckey+'|'+getCookie('token')+'|5.74';
		ae.closeModal('captcha');
	}
	ae.VKapi('groups.leave',par,p,function(da){
				var da = JSON.parse(da);
				if(da.response == undefined){
					if(da.error.error_code == 14){
						ae.append(ae.pageContent(),'<div class="modalDialog" data-modal="captcha"><div><div class="modal-header"><a class="close"><i class="fa fa-times"></i></a><h3>'+lang.need_captcha+'</h3></div><div class="modal-body"><img src="'+da.error.captcha_img+'"><input type="text" class="input-text ckey" placeholder="'+lang.captcha_input+'"></div><div class="modal-footer"><button class="button cancel" onclick="ae.closeModal(\'captcha\',true)">'+lang.cancel+'</button><button class="button accept" onclick="leaveGroup('+id+','+da.error.captcha_sid+')">'+lang.accept+'</button></div></div></div>');
						ae.openModal('captcha');
					} else{
						ae.VKapierr(da.error.error_code,da.error.error_msg);
					}
				}
			});
}