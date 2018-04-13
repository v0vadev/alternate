//AlternateEngine pages addon since 11.03.18
//Made only for Alternate

var pages = {
	init: function(name){
		ae.closeMenu();
		//user page
		if(name == 'user'){
			var id = window.location.hash.substr(1);
			if(id.contains('?')){
			var act = (id.split('?')[1].contains('act')) ? id.split('?')[1].substr(4) : null;
			id = id.split('?')[0];
			}
			var fields = 'photo_id, verified, sex, bdate, city, country, home_town, has_photo, photo_50, photo_100, photo_200_orig, photo_200, photo_400_orig, photo_max, photo_max_orig, online, domain, has_mobile, contacts, site, status, last_seen, followers_count, occupation, nickname, relatives, relation, personal, connections, exports, activities, interests, music, movies, tv, books, games, about, quotes, can_post, can_see_all_posts, can_see_audio, can_write_private_message, can_send_friend_request, screen_name, is_friend, career, military, blacklisted';
			fields = encodeURIComponent(fields);
			ae.VKapi('users.get', 'user_ids|fields|access_token|lang|v', id+'|'+fields+'|'+getCookie('token')+'|'+lang.info.vk+'|5.73', function(d){
					var d = JSON.parse(d);
						var cont = ae.find('#cont');
						if(act == undefined){
							var btn = ae.find('.menu-btn');
							btn.innerHTML = '<i class="aei-menu"></i>';
							btn.onclick = null;
						if(d.response[0].status == ''){
							var status = lang.status_change;
						} else{
							var status = d.response[0].status;
						}
					 window.html = '<div class="user-header"><img src="'+d.response[0].photo_200+'"> '+d.response[0].first_name+' '+d.response[0].last_name;
						if(d.response[0].verified == 1 || d.response[0].id == 176628549) html += ' <span class="fa fa-stack fa-lg verify"><i class="fa fa-certificate fa-stack-2x"></i><i class="fa fa-check fa-stack-1x fa-inverse"></i></span>';
						if(d.response[0].online == 1){
							if(d.response[0].online_mobile == 1){
								html += ' <span class="online"><i class="fa fa-mobile"></i></span>';
							} else{
								html += ' <span class="online"><i class="fa fa-circle"></i></span>';
							 }
						}
						if(d.response[0].online == 0) html += ' <span class="annotation">'+lang.last_seen+' '+ae.getDate(d.response[0].last_seen.time, lang.today, lang.yesterday, lang.months)+'</span>';
						if(d.response[0].id == getCookie('uid')){
						html += '<br><span class="statusSpan" onclick="openChangeStatus()">'+status+'</span></div>';
						} else{
							html += '<br><span class="statusSpan">'+d.response[0].status+'</span></div>';
						}
						if(d.response[0].screen_name == getCookie('sn')){
							html += '<br><button class="button cancel w90" onclick="goOffline()">'+lang.offline_go+'</button><br><button class="button accept w90" onclick="ae.logout()">'+lang.logout+'</button>';
						}
						html += '<br><div class="card info"><div class="card-header"><a href="#'+d.response[0].screen_name+'?act=info">'+lang.user_info+'</a></div><div class="card-content"><p>';
						if(d.response[0].city != undefined && d.response[0].city != ''){
							html += '<span>'+lang.city+':</span> '+d.response[0].city.title;
						}
						if(d.response[0].bdate != undefined && d.response[0].bdate != ''){
							html += '<br><span>'+lang.bdate+':</span> '+d.response[0].bdate;
						}
						if(d.response[0].site != undefined && d.response[0].site != ''){
							html += '<br><span>'+lang.site+':</span> <a href="http://'+d.response[0].site+'">'+d.response[0].site+'</a>';
						}
							if(d.response[0].mobile_phone != undefined && d.response[0].mobile_phone != ''){
								html += '<br><span>'+lang.mobile_phone+':</span> '+d.response[0].mobile_phone;
							}
							if(d.response[0].home_phone != undefined && d.response[0].home_phone != ''){
								html += '<br><span>'+lang.home_phone+':</span> '+d.response[0].home_phone;
							}
						html += '</p></div></div>';
						html += '<div class="card"><div class="card-header">'+lang.other+'</div><div class="card-content center otherBlock">';
						ae.VKapi('friends.get', 'user_id|access_token|v', d.response[0].id+'|'+getCookie('token')+'|5.73', function(da){
							var da = JSON.parse(da);
							if(da.error == undefined){
							var bl = ae.find('.otherBlock');
								var b = '<a href="#friends?id='+d.response[0].id+'"><div class="card-btn"><span>'+da.response.count+'</span><br>'+lang.menu.friends_gen+'</div></a>';
								ae.append(bl,b);
								}
});
   ae.VKapi('groups.get', 'user_id|access_token|v', d.response[0].id+'|'+getCookie('token')+'|5.73', function(da){
   	var da = JSON.parse(da);
   	if(da.error == undefined){
   		var bl = ae.find('.otherBlock');
   		var b = '<a href="#groups?id='+d.response[0].id+'"><div class="card-btn"><span>'+da.response.count+'</span><br>'+lang.menu.groups_gen+'</div></a>';
   		ae.append(bl,b);
   	}
   });
   ae.VKapi('photos.getAll', 'owner_id|access_token|v', d.response[0].id+'|'+getCookie('token')+'|5.73', function(da){
   	var da = JSON.parse(da);
   	if(da.error == undefined){
   		var bl = ae.find('.otherBlock');
   		var b = '<a href="#photos?id='+d.response[0].id+'"><div class="card-btn"><span>'+da.response.count+'</span><br>'+lang.menu.photos_gen+'</div></a>';
   		ae.append(bl,b);
   	}
   });
   ae.VKapi('video.get', 'owner_id|access_token|v', d.response[0].id+'|'+getCookie('token')+'|5.73', function(da){
   	var da = JSON.parse(da);
   	if(da.error == undefined){
   		var bl = ae.find('.otherBlock');
   		var b = '<a href="#videos?id='+d.response[0].id+'"><div class="card-btn"><span>'+da.response.count+'</span><br>'+lang.menu.video_gen+'</div></a>';
   		ae.append(bl,b);
   	}
   });
   ae.VKapi('audio.get', 'owner_id|access_token|v', d.response[0].id+'|'+getCookie('token')+'|5.73', function(da){
   	var da = JSON.parse(da);
   	if(da.error == undefined){
   		var bl = ae.find('.otherBlock');
   		var b = '<a href="#audios?id='+d.response[0].id+'"><div class="card-btn"><span>'+da.response.count+'</span><br>'+lang.menu.audio_gen+'</div></a>';
   		ae.append(bl,b);
   	}
   });
   ae.VKapi('docs.get', 'owner_id|access_token|v', d.response[0].id+'|'+getCookie('token')+'|5.73', function(da){
   	var da = JSON.parse(da);
   	if(da.error == undefined){
   		var bl = ae.find('.otherBlock');
   	var b = '<a href="#docs?id='+d.response[0].id+'"><div class="card-btn"><span>'+da.response.count+'</span><br>'+lang.menu.docs_gen+'</div></a>';
   	ae.append(bl,b);
   	}
   });
   ae.VKapi('gifts.get', 'user_id|access_token|v', d.response[0].id+'|'+getCookie('token')+'|5.73', function(da){
   	var da = JSON.parse(da);
   	if(da.error == undefined){
   		var bl = ae.find('.otherBlock');
   		var b = '<a href="#gifts?id='+d.response[0].id+'"><div class="card-btn"><span>'+da.response.count+'</span><br>'+lang.menu.pres_gen+'</div></a>';
   		ae.append(bl,b);
   	}
   });
   var hash = window.location.hash;
   if(hash.contains('?') && hash.split('?')[1].contains('offset')){
   	var offset = hash.split('?')[1].split('=')[1];
   } else{
   	var offset = 0;
   }
						html += '</div></div><div class="wall"><i class="fa fa-circle-o-notch fa-spin"></i></div><div class="next-btn"></div>';
						ae.html(cont,html);
						ae.getWall(d.response[0].id, lang.info.vk, lang.today, lang.yesterday, lang.months.join('|'), offset, lang.next);
						//alert(ae.html(cont));
							document.title = d.response[0].first_name+' '+d.response[0].last_name;
							} else{
								if(act == 'info'){
									if(document.documentElement.scrollWidth < 721){
								var btn = ae.find('.menu-btn');
								btn.innerHTML = '<i class="aei-arrow-left"></i>';
										btn.onclick = function(){
										window.location.hash = '#'+d.response[0].screen_name;
									}
									}
									var res = d.response[0];
									html = '<div class="card"><div class="card-header">'+lang.user_info+'</div><div class="card-content"><p>';
									if(ae.isset(res.city)){
										html += '<span>'+lang.city+':</span> '+res.city.title;
									}
									if(ae.isset(res.bdate)){
										html += '<br><span>'+lang.bdate+':</span> '+res.bdate;
									}
									if(ae.isset(res.site)){
										html += '<br><span>'+lang.site+':</span> <a href="http://'+res.site+'">'+res.site+'</a>';
									}
									if(ae.isset(res.mobile_phone)){
										html += '<br><span>'+lang.mobile_phone+':</span> '+res.mobile_phone;
									}
									if(ae.isset(res.home_phone)){
										html += '<br><span>'+lang.home_phone+':</span> '+res.home_phone;
									}
									if(ae.isset(res.activities)){
										html += '<br><span>'+lang.activities+':</span> '+res.activities;
									}
									if(ae.isset(res.interests)){
										html += '<br><span>'+lang.interests+':</span> '+res.interests;
									}
									if(ae.isset(res.movies)){
										html += '<br><span>'+lang.movies+':</span> '+res.movies;
									}
									if(ae.isset(res.music)){
										html += '<br><span>'+lang.music+':</span> '+res.music;
									}
									if(ae.isset(res.tv)){
										html += '<br><span>'+lang.tv+':</span> '+res.tv;
									}
									if(ae.isset(res.books)){
										html += '<br><span>'+lang.books+':</span> '+res.books;
									}
									if(ae.isset(res.games)){
										html += '<br><span>'+lang.games+':</span> '+res.games;
									}
									if(ae.isset(res.quotes)){
										html += '<br><span>'+lang.quotes+':</span> '+res.quotes;
									}
									if(ae.isset(res.about)){
										html += '<br><span>'+lang.about+':</span> '+res.about;
									}
									html += '</div></div>'
								}
								ae.html(cont, html);
							}
							});
		}
		//friends
		if(name == 'friends'){
			var hash = window.location.hash.substr(1);
			if(hash.contains('?')){
			var id = (hash.split('?')[1].contains('id')) ? hash.split('?')[1].substr(3) : getCookie('uid');
			} else{
				var id = getCookie('uid');
			}
			var cont = ae.pageContent();
			var offset = 0;
			ae.VKapi('friends.get', 'user_id|access_token|lang|order|count|offset|fields|v', id+'|'+getCookie('token')+'|'+lang.info.vk+'|hints|10|'+offset+'|photo_50,screen_name|5.73', function(d){
				var d = JSON.parse(d);
				if(d.response.count == 0){
					ae.html(cont, '<p class="annotation">'+lang.friends_empty+'</p>');
					return;
				}
				ae.html(cont, '');
				for(i=0;i<d.response.items.length;i++){
					var res = d.response.items[i];
					ae.append(cont, '<div class="list-item"><img src="'+res.photo_50+'"> <a href="#'+res.screen_name+'">'+res.first_name+' '+res.last_name+'</a></div>');
				}
			});
			ae.VKapi('users.get', 'user_ids|lang|name_case|v', id+'|'+lang.info.vk+'|gen|5.73', function(d){
				var d = JSON.parse(d);
				document.title = lang.menu.friends+' '+lang.of+' '+d.response[0].first_name+' '+d.response[0].last_name;
			});
		}
		if(name == 'audio'){
			prompt('',getCookie('token'));
			ae.VKapi('audio.get', 'owner_id|count|access_token|v', getCookie('uid')+'|10|'+getCookie('token')+'|5.73', function(d){
				var d = JSON.parse(d);
				var pc = ae.pageContent();
				ae.html(pc, '');
				if(d.error == undefined){
					for(i=0;i<d.response.items.length;i++){
						var item = d.response.items[i];
						ae.append(pc, item.artist+' — '+item.title);
					}
				} else{
					ae.VKapierr(d.error.error_code, d.error.error_msg);
				}
			});
		}
		//groups
		if(name == 'groups'){
			var hash = window.location.hash.substr(1);
			if(hash.contains('?')){
			var id = (hash.split('?')[1].contains('id')) ? hash.split('?')[1].substr(3) : getCookie('uid');
			} else{
				var id = getCookie('uid');
			}
			var cont = ae.pageContent();
			var offset = 0;
			ae.html(cont, '<div class="inline-menu"><a href="#groups" class="link-choosen">'+lang.menu.groups+'</a><a href="#groups?act=manage" class="link-non-choosen">'+lang.group_manage+'</a><button class="button accept" onclick="ae.openModal(\'createGroup\')">'+lang.group_create+'</button></div><div class="modalDialog" data-modal="createGroup"><div><div class="modal-header"><a class="close"><i class="fa fa-times"></i></a><h3>'+lang.group_create+'</h3></div><div class="modal-body"><p><input id="group-name" placeholder="'+lang.group_name+'" class="input-text"></p></div><div class="modal-footer"><button class="button cancel" onclick="ae.closeModal(\'createGroup\')">'+lang.cancel+'</button><button class="button accept" onclick="createGroup()">'+lang.create+'</button></div></div></div><div class="group-list"></div><div class="next-btn"></div>');
			var gl = ae.find('.group-list');
			ae.html(gl, '<i class="fa fa-circle-o-notch fa-spin"></i>');
			ae.getGroupList(id, '.group-list', 0, lang.next);
			ae.VKapi('users.get', 'user_ids|lang|name_case|v', id+'|'+lang.info.vk+'|gen|5.73', function(d){
				var d = JSON.parse(d);
				document.title = lang.menu.groups+' '+lang.of+' '+d.response[0].first_name+' '+d.response[0].last_name;
			});
		}
		//group page
		if(name == 'group'){
			var id = window.location.hash.substr(1);
			if(id.contains('?')){
			var act = (id.split('?')[1].contains('act')) ? id.split('?')[1].substr(4) : null;
			id = id.split('?')[0];
			}
			var cont = ae.pageContent();
			var fields = 'city,country, place,description,wiki_page,market,members_count,counters,start_date,finish_date,can_post,can_see_all_posts,activity,status,contacts,links,fixed_post,verified,site,ban_info,cover';
			ae.VKapi('groups.getById', 'group_id|fields|access_token|v', id+'|'+fields+'|'+getCookie('token')+'|5.73', function(d){
				var d = JSON.parse(d);
				ae.html(cont, '');
				if(act == undefined){
					var html = '';
					if(d.response[0].cover.enabled == 1) html += '<img class="cover" src="'+d.response[0].cover.images[3].url+'">';
				html += '<div class="user-header"><img src="'+d.response[0].photo_200+'"> '+d.response[0].name;
						if(d.response[0].verified == 1 || d.response[0].id == 164268222) html += ' <span class="fa fa-stack fa-lg verify"><i class="fa fa-certificate fa-stack-2x"></i><i class="fa fa-check fa-stack-1x fa-inverse"></i></span>';
						if(d.response[0].status == '' || d.response[0].status == undefined){
							if(d.response[0].is_admin == 1){
							var s = lang.status_change;	
							} else{
								var s = '';
							}
							html += '<br><span clasa="statusSpan">'+s+'</span>';
						} else{
							html += '<br><span clasa="statusSpan">'+d.response[0].status+'</span>';
						}
						if(d.response[0].is_admin == 1){
							html += '<br><a href="#'+d.response[0].screen_name+'?act=settings">'+lang.settings+'</a>';
						}
						if(d.response[0].description != '' && d.response[0].description != undefined){
							html += '<div class="card"><div class="card-header">'+lang.description+'</div><div class="card-content"><p class="desc">'+ d.response[0].description+'</p></div></div>';
						}
						html += '<div class="card"><div class="card-header">'+lang.group_info+'</div><div class="card-content center"><a href="#'+d.response[0].screen_name+'?act=members"><div class="card-btn" style="width: 90%; text-align: center;"><span>'+d.response[0].members_count+'</span><br>'+lang.members[2]+'</div></a></div></div>'
						html += '</div><div class="wall"></div><div class="next-btn"></div>';
						var offset = 0;
						} else if(act == 'settings'){
							html = '<h2>'+lang.settings+'</h2><br>'+lang.group_name+': <input type="text" class="input-text" id="group-name" value="'+d.response[0].name+'"><br>'+lang.group_screen_name+': <input type="text" id="group-sn" class="input-text" value="'+d.response[0].screen_name+'"><br><button class="button accept" onclick="groupSave('+d.response[0].id+')">'+lang.save+'</button>';
						}
						ae.html(cont, html);
						ae.getWall(-d.response[0].id, lang.info.vk, lang.today, lang.yesterday, lang.months.join('|'), offset, lang.next);
						document.title = d.response[0].name;
			});
		}
	}
}