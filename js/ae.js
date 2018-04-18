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
		this.append(cont, '<div class="modalDialog" data-modal="vae"><div><div class="modal-header"><a class="close"><i class="aei-cross"></i></a><h3>'+lang.vkapi_error+'</h3></div><div class="modal-body">'+lang.vkapi_error+': '+code+' - '+text+'</div><div class="modal-footer"><button class="button accept" onclick="ae.closeModal(\'vae\', true)">'+lang.accept+'</button></div></div></div>');
		ae.openModal('vae');
	},
	getWall: function(oid, lang, today, yesterday, months, offset, next){
		var months = months.split('|');
		var wall = this.find('.wall');
		this.VKapi('wall.get', 'owner_id|offset|count|extended|lang|access_token|v', oid+'|'+offset+'|10|1|'+lang+'|'+getCookie('token')+'|5.73', function(d){
			var d = JSON.parse(d);
			var html = '';
			if(offset == 0) ae.html(wall,'');
			for(i=0;i<d.response.items.length;i++){
				var item = d.response.items[i];
				if(item.marked_as_ads == 1){
					//no ads
					//we dont need them
					delete d.response.items[i];
					continue;
				}
				var author = ae.getOwner(item.from_id,d.response.profiles,d.response.groups);
				html += '<div class="post"><a href="#'+author.sn+'"><div class="post-header"><span>'+author.title+'</span><img src="'+author.photo+'"></div></a><div class="post-content">';
				html += item.text+'<br>';
				//post attachments
				if(item.attachments != undefined){
					for(o=0;o<item.attachments.length;o++){
						html += ae.getAttachment(item.attachments[o]);
					}
				}
				//repost
				if(item.copy_history != undefined){
					var rep = item.copy_history[0];
					var repAuthor = ae.getOwner(rep.from_id,d.response.profiles,d.response.groups);
					html += '<div class="post"><a href="#'+repAuthor.sn+'"><div class="post-header"><span>'+repAuthor.title+'</span><img src="'+repAuthor.photo+'" class="repostAvatar"></div></a><div class="post-content">'+rep.text+'<br>';
					//repost attachments
					if(rep.attachments != undefined){
						for(p=0;p<rep.attachments.length;p++){
							html += ae.getAttachment(rep.attachments[p]);
						}
					}
					html += '</div></div>';
				}
				if(!item.likes.user_likes){
					var likes = '<a onclick="ae.addLike('+item.owner_id+', '+item.id+', \'post\')" pid="'+item.owner_id+'_'+item.id+'">'+item.likes.count+' <i class="fa fa-heart-o"></i></a>';
				} else{
				 var likes = '<a onclick="ae.remLike('+item.owner_id+', '+item.id+', \'post\')" style="font-weight: 800;" pid="'+item.owner_id+'_'+item.id+'">'+item.likes.count+' <i class="fa fa-heart"></i></a>';
				}
				html += '</div><div class="post-footer"><div class="post-date">'+ae.getDate(item.date,today,yesterday,months)+'</div><div class="post-info">'+likes;
				if(item.views != undefined) html +=' <i class="fa fa-eye"></i> '+ae.shortNum(item.views.count);
				html += '</div></div></div>';
				var nbd = ae.find('.next-btn');
				var op = offset+10;
				if(op < d.response.count) ae.html(nbd,'<button class="button cancel w100" onclick="ae.getWall('+oid+',\''+lang+'\',\''+today+'\',\''+yesterday+'\',\''+months.join('|')+'\', '+op+',\''+next+'\')">'+next+'</button>');
			}
			ae.append(wall,html);
		});
	},
	getAttachment: function(object,type){
		switch(object.type || type){
			case 'photo':
			 return '<img src="'+object.photo.photo_604+'">';
			 break;
			case 'video':
			 var v = object.video;
			 return '<a href="#video'+v.owner_id+'_'+v.id+'"><div class="video"><img src="'+v.photo_320+'"><span>'+v.title+'</span><br><span class="views"><i class="fa fa-eye"></i> '+v.views+'</span></div></a>';
			 break;
			case 'link':
			 var l = object.link;
			 return '<br><a href="'+l.url+'" class="link"><i class="fa fa-link"></i> '+l.caption+'</a>'
			 break;
			case 'poll':
			 var p = object.poll;
			 var html = '';
			 if(type == undefined) html += '<div class="poll" data-poll="poll'+p.id+'">';
			 html += '<span>'+p.question+'</span><p class="annotation" style="font-size:12px;"><i class="fa fa-bar-chart"></i> '+p.votes+'</p>';
			 for(pa=0;pa<p.answers.length;pa++){
			  	var a = p.answers[pa];
			 	 var an = '<div onclick="ae.addVote('+p.id+','+p.owner_id+','+a.id+')">'+a.text+' - '+a.votes+' ('+a.rate+'%)<div class="scale"><div class="scale-filler" style="width:'+a.rate+'%;"></div></div></div>';
			 	 if(p.answer_id == a.id) an = '<b>'+an+'</b>';
			 	 html += an;
			 }
			 if(p.answer_id != 0) html += '<a onclick="ae.deleteVote('+p.owner_id+','+p.id+','+p.answer_id+')">'+lang.poll_vote_delete+'</a>';
			 if(type == undefined) html += '</div>';
			 return html;
			 break;
			default:
			 return 'Unknown attachment';
			 break;
		}
	},
	addVote: function(pid,oid,aid){
		this.VKapi('polls.addVote','owner_id|poll_id|answer_id|access_token|v',oid+'|'+pid+'|'+aid+'|'+getCookie('token')+'|5.73', function(d){
			var d = JSON.parse(d);
			if(d.response != undefined){
				if(d.response == 1){
					ae.VKapi('polls.getById','owner_id|poll_id|access_token|v',oid+'|'+pid+'|'+getCookie('token')+'|5.73',function(da){
						var da = JSON.parse(da);
						if(da.response != undefined){
							var p = da.response;
							var pDiv = ae.find('div[data-poll="poll'+p.id+'"]');
							var obj = {
								poll: p
							};
							var html = ae.getAttachment(obj,'poll');
							ae.html(pDiv,html);
						} else{
							ae.VKapierr(da.error.error_code,da.error.error_msg);
						}
					});
				}
			} else{
				ae.VKapierr(d.error.error_code,d.error.error_msg);
			}
		});
	},
	deleteVote: function(oid,pid,aid){
		this.VKapi('polls.deleteVote','owner_id|poll_id|answer_id|access_token|v',oid+'|'+pid+'|'+aid+'|'+getCookie('token')+'|5.73',function(d){
			var d = JSON.parse(d);
			if(d.response != undefined){
				if(d.response == 1){
					ae.VKapi('polls.getById','owner_id|poll_id|access_token|v',oid+'|'+pid+'|'+getCookie('token')+'|5.73',function(da){
						var da = JSON.parse(da);
						if(da.response != undefined){
							var obj = {
							 poll: da.response
						 };
						 ae.html(ae.find('div[data-poll="poll'+da.response.id+'"]'),ae.getAttachment(obj,'poll'));
						} else{
							ae.VKapierr(d.error.error_code,d.error.error_msg);
						}
					});
				}
			} else{
				ae.VKapierr(d.error.error_code,d.error.error_msg);
			}
		});
	},
	formatText: function(str){
		//todo
		return str.replace(symbols, function(url){
			return '<a href="'+url+'">'+url+'</a>';
			});
	},
	getOwner: function(id,userObject,groupObject){
		if(id > 0){
			var find = userObject.findEl(id,'id');
			var res = {
				title: userObject[find].first_name+' '+userObject[find].last_name,
				photo: userObject[find].photo_100,
				sn: userObject[find].screen_name
			};
		} else if(id < 0){
			var find = groupObject.findEl(id*-1,'id');
			var res = {
				title: groupObject[find].name,
				photo: groupObject[find].photo_100,
				sn: groupObject[find].screen_name
			};
		}
		return res;
	},
	newPostModal: function(oid){
		var pc = this.find('.new-post-block');
		var prev = this.html(pc);
		this.html(pc,'<textarea class="textarea new-post-area" placeholder="'+lang.new_post+'"></textarea><br><div class="atDiv"></div><br><div style="text-align:right;"><span style="letter-spacing:5px;"><a onclick="ae.newPhotoModal(\'wall\')"><i class="fa fa-camera"></i></a> <a onclick="ae.newPollModal('+oid+')"><i class="fa fa-bar-chart"></i></a></span><input type="hidden" class="attachs"><button class="button accept" onclick="ae.sendPost('+oid+')" style="margin-left:20px;">'+lang.send+'</button></div>');
	},
	sendPost: function(oid){
		var msg = this.find('.new-post-area').value;
		var at = ae.find('.attachs').value;
		if(msg == '' && at == ''){
			alert(lang.empty_post_err);
			return;
		}
		this.VKapi('wall.post','owner_id|message|attachments|access_token|v',oid+'|'+msg+'|'+at+'|'+getCookie('token')+'|5.73',function(d){
			var d = JSON.parse(d);
			if(d.response != undefined){
			 window.location.reload();
			} else{
				ae.VKapierr(d.error.error_code,d.error.error_msg);
			}
		});
	},
	newPhotoModal: function(type){
		this.append(this.pageContent(),'<div class="modalDialog" data-modal="new-photo"><div><div class="modal-header"><a class="close"><i class="fa fa-times"></i></a><h3>'+lang.load_photo+'</h3></div><div class="modal-body" data-up="new-photo"><p>'+lang.load_photo_desc+'</p><br><input type="file" class="photo" multiple></div><div class="modal-footer"><button class="button cancel" onclick="ae.closeModal(\'new-photo\')">'+lang.cancel+'</button></div></div></div>');
		var file = this.find('.photo');
		file.addEventListener('change', function(e){
			ae.html(ae.find('div[data-up="new-photo"]'),'<i class="fa fa-circle-o-notch fa-spin"></i>');
			var at = ae.find('.attachs');
			if(at.value.split(',').length == 11){
					 alert(lang.photo10_err);
					 ae.closeModal('new-photo',true);
						return;
					}
		for(i=0;i<e.target.files.length;i++){	ae.uploadPhoto('wall',e.target.files[i],function(da){
				if(da.er == undefined){
					var at = ae.find('.attachs');
					var div = ae.find('.atDiv');
					at.value += 'photo'+da.response[0].owner_id+'_'+da.response[0].id+',';
					ae.closeModal('new-photo',true);
					ae.append(div,'<img src="'+da.response[0].photo_75+'" onclick="ae.removeAttach(\'photo'+da.response[0].owner_id+'_'+da.response[0].id+'\')" data-attach="photo'+da.response[0].owner_id+'_'+da.response[0].id+'">');
				} else{
					ae.closeModal('new-photo',true);
					alert('Error: '+da.er);
				}
			});
			}
		});
		this.openModal('new-photo');
	},
	newPollModal: function(oid){
		var pc = this.pageContent();
		this.append(pc,'<div class="modalDialog" data-modal="new-poll"><div><div class="modal-header"><a class="close"><i class="fa fa-times"></i></a><h3>'+lang.poll_new+'</h3></div><div class="modal-body newPollModal"><input type="text" class="input-text pollQ" placeholder="'+lang.poll_question+'"><div class="ansList"><div class="pollA pollA0"><input type="text" class="input-text" placeholder="'+lang.poll_answer+'"></div><div class="pollA pollA1"><input type="text" class="input-text" placeholder="'+lang.poll_answer+'"> <a onclick="ae.remPollAnswer(1)" style="color:#96989B;" class="remPollA1"><i class="fa fa-times"></i></a></div></div><a onclick="ae.addPollAnswer()" class="addPollA">'+lang.add+'</a></div><div class="modal-footer"><button class="button cancel" onclick="ae.closeModal(\'new-poll\',true)">'+lang.cancel+'</button><button class="button accept" onclick="ae.createPoll('+oid+')">'+lang.accept+'</button></div></div></div>');
		this.openModal('new-poll');
	},
	createPoll: function(oid){
		var q = ae.find('.pollQ').value;
		var bl = ae.find('.ansList');
		var ans = [];
		for(i=0;i<bl.querySelectorAll('.pollA').length;i++){
			ans.push(bl.querySelectorAll('.pollA')[i].childNodes[0].value);
		}
		if(question == ''){
			alert('Question cant be empty');
			return;
		}
		ans = JSON.stringify(ans);
		ae.VKapi('polls.create','owner_id|question|add_answers|access_token|v',oid+'|'+q+'|'+ans+'|'+getCookie('token')+'|5.73',function(d){
			var d = JSON.parse(d);
			if(d.response != undefined){
				var at = ae.find('.attachs');
				var ad = ae.find('.atDiv');
				at.value += 'poll'+d.response.owner_id+'_'+d.response.id+',';
				ae.closeModal('new-poll',true);
				ae.append(ad,lang.poll);
			} else{
				ae.VKapierr(d.error.error_code,d.error.error_msg);
			}
		});
	},
	addPollAnswer: function(){
		var bl = ae.find('.ansList');
		var all = bl.querySelectorAll('.pollA');
		ae.append(bl,'<div class="pollA pollA'+all.length+'"><input type="text" class="input-text" placeholder="'+lang.poll_answer+'"> <a onclick="ae.remPollAnswer('+all.length+')" class="remPollA'+all.length+'" style="color: #96989B;"><i class="fa fa-times"></i></a></div>');
		if(all.length == 9){
			ae.find('.addPollA').remove();
			return;
		}
	},
	remPollAnswer: function(i){
		if(ae.find('.ansList').querySelectorAll('.pollA').length == 10) ae.append(ae.find('.newPollModal'),'<a onclick="ae.addPollAnswer()" class="addPollA">'+lang.add+'</a>');
		ae.find('.pollA'+i).remove();
	},
	removeAttach: function(name){
		var at = ae.find('.attachs');
		at = at.value.split(',');
		at.splice(at.indexOf(name),1);
		at = at.join(',')+',';
		ae.find('.attachs').value = at;
		ae.find('img[data-attach="'+name+'"]').remove();
	},
	uploadPhoto: function(type,file,callback){
		var data = new FormData();
		data.append('file',file);
		var xhr = new XMLHttpRequest();
		xhr.open('POST','/altvk/methods.php?method='+type+'.photo&client='+getCookie('client'));
		xhr.send(data);
		xhr.onreadystatechange = function(){
			if(this.readyState != 4) return;
			if(this.readyState == 4){
				callback(JSON.parse(xhr.responseText));
			}
		}
	},
	getGroupList: function (oid, s, offset, next){
		//using lang because in some languages (like soviet) default profile pictures are different
			ae.VKapi('groups.get', 'user_id|offset|extended|count|fields|access_token|lang|v', oid+'|'+offset+'|1|10|members_count|'+getCookie('token')+'|ru|5.73', function(d){
				var d = JSON.parse(d);
				if(d.response != undefined){
					var se = ae.find(s);
					if(offset == 0) ae.html(se,'');
					for(i=0;i<d.response.items.length;i++){
						var res = d.response.items[i];
					ae.append(se, '<div class="list-item"><img src="'+res.photo_50+'"> <a href="#'+res.screen_name+'">'+res.name+'</a></div>');
					}
					var o = offset+10;
					if(o < d.response.count){
					ae.html(ae.find('.next-btn'), '<button class="button cancel w100" onclick="ae.getGroupList('+oid+', \''+s+'\', '+o+', \''+next+'\')">'+next+'</button>');
					} else{
						ae.html(ae.find('.next-btn'), '');
					}
				} else{
					ae.VKapierr(d.error.error_code, d.error.error_msg);
				}
			});
			},
			showMore: function(text){
				ae.html(ae.find('.post-text'), text);
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
				prompt('',res.access_token);
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
},
shortNum: function(num){
	if(num > 999){
		var res = num/1000;
		return res.toString().substr(0,3)+'K';
	} else{
		return num;
	}
},
addLike: function(oid,iid,type){
	this.VKapi('likes.add', 'type|owner_id|item_id|access_token|v', type+'|'+oid+'|'+iid+'|'+getCookie('token')+'|5.73', function(d){
		var d = JSON.parse(d);
		if(d.response != undefined){
			var likesBtn = ae.find('a[pid="'+oid+'_'+iid+'"]');
			ae.html(likesBtn, d.response.likes+' <i class="fa fa-heart"></i>');
			ae.attr(likesBtn, 'style', 'font-weight: 800;');
			ae.attr(likesBtn, 'onclick', 'ae.remLike('+oid+', '+iid+', \''+type+'\')');
		} else{
			ae.VKapierr(d.error.error_code, d.error.error_msg);
		}
	});
},
remLike: function(oid,iid,type){
	this.VKapi('likes.delete', 'type|owner_id|item_id|access_token|v', type+'|'+oid+'|'+iid+'|'+getCookie('token')+'|5.73', function(d){
		var d = JSON.parse(d);
		if(d.response != undefined){
			var likesBtn = ae.find('a[pid="'+oid+'_'+iid+'"]');
			ae.html(likesBtn, d.response.likes+' <i class="fa fa-heart-o"></i>');
			ae.attr(likesBtn, 'style', '');
			ae.attr(likesBtn, 'onclick', 'ae.addLike('+oid+', '+iid+', \''+type+'\')');
		} else{
			ae.VKapierr(d.error.error_code, d.error.error_msg);
		}
	});
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