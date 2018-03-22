//AlternateEngine since 07.03.18

var ae = {
	createEl: function(el){
		return document.createElement(el);
	},
	attr: function(el, attr, value){
		if(value == undefined){
			return el.getAttribute(attr);
		} else{
			el.setAttribute(attr, value);
		}
		return;
	},
	find: function(el){
		return document.querySelector(el);
	},
	html: function(el, html){
		if(html != undefined){
			el.innerHTML = html;
			return;
		} else{
			return el.innerHTML;
		}
	},
	append: function(el, html){
		el.innerHTML += html;
	},
	pageContent: function(){
		return this.find('.page-content');
	},
	getMenu: function(){
		return this.find('.menu');
	},
	openModal: function(name){
		var modal = this.find('.modalDialog[data-modal="'+name+'"]');
		this.attr(modal, 'style', 'display: block;');
		var closeBtn = this.find('.close');
		this.attr(closeBtn, 'onclick', 'ae.closeModal(\''+name+'\')');
		var backDiv = this.find('.modalDialog[data-modal="'+name+'"]');
		backDiv.onclick = function(e){
			var e = e || window.event;
			var target = e.target || e.srcElement;
			if(this == target) ae.closeModal(name);
		}
		//alert(this.VKapi('users.get', 'user_ids|v', '1|5.73').response[0].first_name);
	},
	closeModal: function(name, remove){
		var modal = this.find('.modalDialog[data-modal="'+name+'"]');
		this.attr(modal, 'style', 'display: none;');
		if(remove){
			modal.remove();
		}
	},
	showMenu: function(){	if(document.documentElement.scrollWidth < 721){
		var menu = this.find('.menu');
		this.attr(menu, 'style', 'display: inline-block; animation: fromleft 0.5s;');
		var menuBtn = this.find('.menu-btn');
		this.attr(menuBtn, 'onclick', 'ae.closeMenu()');
		}
	},
	closeMenu: function(){
		if(document.documentElement.scrollWidth < 721){
		var menu = this.find('.menu');
		var menuBtn = this.find('.menu-btn');
		this.attr(menu, 'style', 'display: none;');
		this.attr(menuBtn, 'onclick', 'ae.showMenu()');
		}
	},
	VKapi: function(method, params, values, callback){
				var xhr = new XMLHttpRequest();
				xhr.open('GET', "/altvk/vkapi.php?method="+method+"&params="+params+"&values="+values+'&client='+getCookie('client'), true);
				xhr.send();
				xhr.onreadystatechange = function(){
					if(this.readyState != 4) return;
					if(this.readyState == 4) window.resp = this.responseText;
					callback(this.responseText, this.status);
				}; 
	},
	VKapierr: function(code, text){
		var cont = this.pageContent();
		this.append(cont, '<div class="modalDialog" data-modal="vae"><div class="modal-header"><a class="close"><i class="aei-cross"></i></a><h3>'+lang.vkapi_error+'</h3></div><div class="modal-body">'+lang.vkapi_error+': '+code+' - '+text+'</div><div class="modal-footer"><button class="button accept" onclick="ae.closeModal(\'vae\', true)">'+lang.accept+'</button></div></div>');
		ae.openModal('vae');
	},
	getWall: function(oid){
		this.VKapi('wall.get', 'owner_id|offset|count|extended|access_token|v', oid+'|0|10|1|'+getCookie('token')+'|5.73', function(da){
							var da = JSON.parse(da);
							if(da.error == undefined){
								var wall = ae.find('.wall');
								ae.html(wall, '');
								for(i=0;i<da.response.items.length;i++){
									var item = da.response.items[i];
									if(item.from_id > 0){
										var p = da.response.profiles.findEl(item.from_id,'id');
										var author = da.response.profiles[p].first_name+' '+da.response.profiles[p].last_name;
										var avatar = da.response.profiles[p].photo_100;
										var sn = da.response.profiles[p].screen_name;
									}
									if(item.from_id < 0){
										var p = da.response.groups.findEl(item.from_id,'id');
										var author = da.response.groups[p].name;
										var avatar = da.response.groups[p].photo_100;
										var sn = da.response.groups[p].screen_name;
									}
									var wallinner = '<div class="post"><a href="#'+sn+'"><div class="post-header"><span>'+author+'</span> <img src="'+avatar+'"></div></a><div class="post-content">'+item.text;
									if(item.text != '') wallinner += '<br>';
									if(item.attachments != undefined){
										for(a=0;a<item.attachments.length;a++){
											var at = item.attachments[a];
											if(at.type == 'photo'){
												wallinner += '<img src="'+at.photo.photo_604+'">';
											}
											if(at.type == 'audio'){
												wallinner += at.audio.artist+' — '+at.audio.title+'<audio src="'+at.audio.url+'" controls></audio>';
											}
										}
									}
									wallinner += '</div></div>';
									ae.append(wall,wallinner);
								}
							} else{
								ae.VKapierr(da.error.error_code, da.error.error_msg);
							}
						});
	},
	authorize: function(username, password, client, onError, sid, key){
		var xhr = new XMLHttpRequest();
		if(sid == undefined && key == undefined){
			xhr.open('GET', '/altvk/methods.php?method=auth&params='+username+'|'+password+'&client='+client, true);
		} else{
			xhr.open('GET', '/altvk/methods.php?method=auth&params='+username+'|'+password+'|'+sid+'|'+key+'&client='+client, true);
		}
		xhr.send();
		xhr.onreadystatechange = function(){
			if(this.readyState != 4) return;
			var res = JSON.parse(this.responseText);
			if(res.error == undefined){
				setCookie('token', res.access_token);
				setCookie('uid', res.user_id);
				setCookie('client', client);
				ae.VKapi('users.get', 'user_ids|fields|v', res.user_id+'|screen_name|5.73', function(d){
					var d = JSON.parse(d);
					setCookie('sn', d.response[0].screen_name);
					window.location.hash = '#'+d.response[0].screen_name;
					window.location.reload();
				});
			} else{
				onError(res);
			}
		}
	},
	logout: function(){
		deleteCookie('token');
		deleteCookie('uid');
		deleteCookie('demo');
		deleteCookie('sn');
		window.location.reload();
	},
	setLanguage: function(lang){
		var langs = ['ru_RU', 'en_US'];
		if(lang == true){
			var cur = langs.indexOf(getCookie('lang'));
			if(cur == langs.length-1){
				i = 0;
			} else{
				i = cur+1;
			}
			setCookie('lang', langs[i]);
		} else{
		setCookie('lang', lang, {
			expires: 999999999
		});
		}
		window.location.reload();
	},
	getDate: function(timestamp, today, yesterday, months){
var a = new Date(timestamp * 1000);
var now = new Date();
var yest = new Date();
yest.setDate(yest.getDate()-1);
if(today == undefined){
	var today = 'today at';
}
if(yesterday == undefined){
	var yesterday = 'yesterday at';
}
if(months == undefined){
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
}
var year = a.getFullYear();
var month = months[a.getMonth()];
var date = a.getDate();
if(date < 10){
date = 0+date.toString();
}
var hour = a.getHours();
if(hour < 10){
hour = 0+hour.toString();
}
var min = a.getMinutes();
if(min < 10){
min = 0+min.toString();
}
var sec = a.getSeconds();
if(sec < 10){
sec = 0+sec.toString();
}
if(now.getDate() == a.getDate() && now.getMonth() == a.getMonth() && now.getFullYear() == a.getFullYear()){
var time = today+' '+hour+':'+min;
} else if(yest.getDate() == a.getDate() && yest.getMonth() == a.getMonth() && yest.getFullYear() == a.getFullYear()){
var time = yesterday+' '+hour+':'+min;
} else if(now.getFullYear() == a.getFullYear()){
	var time = date+' '+month+' '+hour+':'+min;
	} else{
var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
}
return time;
},
isset: function(str){
	if(str != undefined && str != ''){
		return true;
	} else{
		return false;
	}
}
};

var content = ae.find('.page-content');
ae.attr(content, 'onclick', 'ae.closeMenu()');

String.prototype.contains = function(find){
	if(this.indexOf(find) == -1){
		return false;
	} else{
		return true;
	}
}

Array.prototype.findEl = function(find,findName){
for(p=0;p<this.length;p++){
if(this[p][findName] == find){
return p;
}
}
}



function getCookie(name) { var matches = document.cookie.match(new RegExp( "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)" )); return matches ? decodeURIComponent(matches[1]) : undefined; }
function deleteCookie(name) { setCookie(name, "", { expires: -1 }) }
function setCookie(name, value, options) { options = options || {}; var expires = options.expires; if (typeof expires == "number" && expires) { var d = new Date(); d.setTime(d.getTime() + expires * 1000); expires = options.expires = d; } if (expires && expires.toUTCString) { options.expires = expires.toUTCString(); } value = encodeURIComponent(value); var updatedCookie = name + "=" + value; for (var propName in options) { updatedCookie += "; " + propName; var propValue = options[propName]; if (propValue !== true) { updatedCookie += "=" + propValue; } } document.cookie = updatedCookie; }