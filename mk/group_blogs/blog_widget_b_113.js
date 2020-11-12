epw_stories = [{"eid":"82565", "title":"I Hate Water Wasters", "content":"our country is in a water shortage crisis and we still have to  suffer ignorant people who don't give a damn for future "},{"eid":"250863", "title":"Enough Is Enough", "content":"News break today:  For the first time in history the polar ice caps are melting.  The north pole to be exact. "}];epw_ht = "Put Yourself to Bedlam";epw_hc = "Gad! I hope not. They didn't even spell my name right... Here's some press coverage on the Sculptcycle exhibition: Sculptcycl";var epw_animating = false;
var epw_enabled = true;
var epw_right = false;
var epw_width;
var epw_img_location = 'http://img.experienceproject.com/images/mk/group_blogs/';
var is_ie = (document.all || (typeof document.body.style.maxHeight != "undefined")) ? true : false;

function epw_e(id) {
	if (document.getElementById != null) {
        return document.getElementById(id);
    }
    
    if (document.all != null) {
        return document.all[id];
    }

    if (document.layers != null) {
        return document.layers[id];
    }
    return null;
}

function epw_width() {
	var parent = epw_e('epw').parentNode;
	if (parent) {
		epw_width = parent.offsetWidth;
	}
}

function epw_gpos() {
	var curleft = 0;
	var obj = epw_e('epw_widget_frame');
	
	if (obj.offsetParent) {
		curleft = obj.offsetLeft;
		
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft;
		}
	}
	return curleft;
}

function epw_c(child, parent) {
    var temp = child;
    if (!temp) return;
    
    var pcc = 0;
    if (temp.parentNode) {
        while (temp.parentNode) { 
            if (pcc > 10) break;
            pcc++;
            if (temp.parentNode == parent) {
                return true;
            }
            temp = temp.parentNode;
        }
    }
    return false;    
}

function epw_popout_check(evt) {
    var event = evt || window.event;
    var tgt = event.target || event.srcElement; 
    
    if (tgt.className && tgt.className.indexOf('epw') != -1) return;
    if (tgt.id == 'epw_widget_popout') return;
    if (epw_c(tgt, epw_e('epw_widget_frame')) || epw_c(tgt, epw_e('epw_widget_popout'))) return;

    epw_toggle_popout(false);
}

function epw_check() {
	epw_e('epw_r2_1').innerHTML = '&nbsp;';
	epw_e('epw_r2_2').innerHTML = '&nbsp;';
    for (var i = 1; i <= epw_stories.length; i++) {
    	var e = epw_e('epw_a'+i);
    	e.innerHTML = '&ldquo;' + epw_stories[i-1]['title'] + '&rdquo;';
    }
    if (epw_e('epwh_a')) epw_e('epwh_a').innerHTML = epw_ht;
	epw_e('epw_b1').innerHTML = '&nbsp;';
	epw_e('epw_b2').innerHTML = '&nbsp;';
}

function epw_tog(id, val) {
    epw_animating = false;
    epw_e(id).style.display = val;
}

function epw_changeopac(opacity, id, opacEnd, display) {
    var style = epw_e(id).style; 
    style.opacity = (opacity / 100);
    style.MozOpacity = (opacity / 100);
    style.KhtmlOpacity = (opacity / 100);
    style.filter = "alpha(opacity=" + opacity + ")";
    
    if (opacity == opacEnd) epw_tog(id, display);
}

function epw_opacity(id, opacStart, opacEnd, millisec, display) {
    if (/Firefox/i.test(navigator.userAgent) && /Macintosh/i.test(navigator.appVersion)) {
        epw_e(id).style.display = display;
        return;
    }

    if (opacStart == 0) epw_changeopac(0, id, opacEnd, display);
    
    var speed = Math.round(millisec / 100);
    var timer = 0;
    
    epw_animating = true;
    
    if (display == 'block' && epw_e(id).style.display != display) epw_e(id).style.display = 'block';
    
    if (opacStart > opacEnd) {
        for (i = opacStart; i >= opacEnd; i--) {
            setTimeout("epw_changeopac(" + i + ",'" + id + "','" + opacEnd + "','" + display + "')",(timer * speed));
            timer++;
        }
    } else if (opacStart < opacEnd) {
        for (i = opacStart; i <= opacEnd; i++) {
            setTimeout("epw_changeopac(" + i + ",'" + id + "','" + opacEnd + "','" + display + "')",(timer * speed));
            timer++;
        }
    }
}

function epw_toggle_popout(vis, row, blog) {
    var popout = epw_e('epw_widget_popout');

    if (row) {
        row = row - 1;
        var offset = 0;
        if (blog) {
        	offset = row * 32;
        	popout.style.marginTop = (35 + offset)+'px';
        } else {
        	offset = row * 35;
        	popout.style.marginTop = (25 + offset)+'px';
        }
        
        if (epw_right) {
        	popout.style.marginLeft = epw_width + 'px';
        } else {
        	popout.style.marginLeft = '-152px';
        }
    }
    
    if (epw_animating) return;
    if (vis && popout.style.display == 'block') return;
    if (!vis && !popout.style.display == 'block') return;
    
    switch (vis) {
        case true:
            if (popout.style.display != 'block') {
                epw_opacity('epw_widget_popout', 0, 99, 300, 'block');
            }
            break;
        case false:
            if (popout.style.display == 'block') {
                epw_opacity('epw_widget_popout', 99, 0, 300, 'none');
            }
            break;
    }
}

function epw_popout(row, blog) {
    if (!epw_enabled) return;

	var story = epw_stories[row-1];
	epw_e('epw_popout_content').innerHTML = '<b>&ldquo;</b>' + story['content'] + '...<b>&rdquo;</b> ';
	epw_e('epw_popout_content').innerHTML += '<a href=' + epw_e('epw_a'+row).href + ' style="font-style:normal;color:rgb(0,51,153);text-decoration:underline;">Read More</a>';

    epw_toggle_popout(true, row, blog);
}

function epwh_popout(blog) {
    if (!epw_enabled) return;

	epw_e('epw_popout_content').innerHTML = '<b>&ldquo;</b>' + epw_hc + '...<b>&rdquo;</b> ';
	epw_e('epw_popout_content').innerHTML += '<a href=' + epw_e('epwh_a').href + ' style="font-style:normal;color:rgb(0,51,153);text-decoration:underline;">Read More</a>';

    epw_toggle_popout(true, 3, blog);
}

function epw_div(row, vis) {
	var style = epw_e(row).style;
	if (vis) {
		style.background = '#FFF8C6';
	    style.opacity = '.50';
	    style.MozOpacity = '.50';
	    style.KhtmlOpacity = '.50';
	    style.filter = "alpha(opacity=" + 50 + ")";
    } else {
		style.background = 'transparent';
	    style.opacity = '0.99';
	    style.MozOpacity = '0.99';
	    style.KhtmlOpacity = '0.99';
	    style.filter = "alpha(opacity=" + 99 + ")";
    }
}

function epw_help(vis) {
    if (!epw_enabled) return;
    epw_toggle_popout(false);
    
	var help = epw_e('epw_widget_help');
    help.style.marginTop = '0px';
    if (epw_right) {
    	help.style.marginLeft = epw_width + 'px';
    } else {
    	help.style.marginLeft = -152 + 'px';
    }
    if (vis) {
		help.style.display = 'block';
	    help.style.opacity = '.99';
	    help.style.MozOpacity = '.99';
	    help.style.KhtmlOpacity = '.99';
	    help.style.filter = "alpha(opacity=" + 99 + ")";
	    epw_animating = true;
    } else {
		epw_opacity('epw_widget_help', 99, 0, 300, 'none');
		epw_animating = false;
    }
}

function epw_format(element, text, width, lines) {
   	element.innerHTML = '<span id="temp" style="white-space:nowrap;">' + text + '</span>';
   	var temp = epw_e('temp');
   	if (temp.offsetWidth > width) {
   		var start = 0;
   		var j = 0;
   		var space = 1;
   		var line = '';
   		for (var i = 1; i <= lines; i++) {
		   	temp.innerHTML = '';
		   	j = start + 1;
   			if (i < lines) {
		   		while (temp.offsetWidth < width && j < text.length) {
		   			temp.innerHTML = text.substring(start,j);
		   			if (text.substring(j,j+1) == ' ') space = j;
		   			j++;
		   		}
		   		line += text.substr(start,space) + '<br>';
		   		start = space + 1;
   			} else {
		   		while (temp.offsetWidth < width && j < text.length) {
		   			temp.innerHTML = text.substring(start,j) + '...';
		   			j++;
		   		}
   			}
   		}
   		if (!temp.innerHTML) lines = 1;
  		if (j == text.length) {
  			temp.innerHTML = text.substring(start,j);
   		}
   		return [line + temp.innerHTML, lines];
   	} else {
   		lines = 1;
   		if (temp.offsetWidth == 0) {
   			var trunc = text.substring(0, 28);
   			if (trunc.length < text.length) text = trunc + '...';
   			lines = 2;
   		}
   		return [text, lines];
   	}
}

function epw_format_titles(width) {
    for (var i = 1; i <= epw_stories.length; i++) {
    	var e = epw_e('epw_t'+i);
    	var title = epw_format(e, epw_stories[i-1]['title'], width, 2);
    	if (title[0] == epw_stories[i-1]['title'] && title[1] == 1) {
	   		epw_e('epw_'+i).style.paddingTop = '8px';
	   		epw_e('epw_'+i).style.paddingBottom = '5px';
	   		epw_e('epw_'+i).style.height = '23px';
    	}
    	epw_stories[i-1]['title'] = e.innerHTML = title[0];
    }
   	var e = epw_e('epwh_t');
   	if (e) {
	   	var title = epw_format(e, epw_ht, width, 2);
	   	if (title[0] == epw_ht && title[1] == 1) {
	   		epw_e('epwh').style.paddingTop = '8px';
	   		epw_e('epwh').style.paddingBottom = '5px';
	   		epw_e('epwh').style.height = '23px';
	   	}
	   	epw_ht = e.innerHTML = title[0];
   	}
}

function epw_check_overflow() {
	var obj = epw_e('epw').parentNode;

	while (obj) {
		if ((obj.className && obj.className.indexOf('module') != -1) || (obj.id && obj.id.indexOf('alpha') != -1)) {
			obj.style.position = 'static';
			obj.style.overflow = 'visible';
		}
		obj = obj.parentNode;
	}
}

function epw_widget_setup(blog) {   
    epw_e('epw_widget_popout').style.display = 'none';

    var wm = 'mousemove';
    
    if (window.addEventListener) {
        document.addEventListener(wm, function(event) { epw_popout_check(event);epw_check(); },false);
    } else if (window.attachEvent) {
        document.attachEvent('on'+wm, function(event) { epw_popout_check(event);epw_check(); });
    }
    
	epw_width();
	if (epw_width >= 220)  {
    	epw_width = 220;
    	epw_e('epw_r1').style.paddingLeft = '200px';
    	epw_e('epw_r1').style.paddingTop = epw_e('epw_r1').style.paddingBottom = epw_e('epw_r1').style.paddingRight = '0px';
    	epw_e('epw_r2_1').style.paddingLeft = '100px';
    	epw_e('epw_r2_1').style.paddingTop = epw_e('epw_r2_1').style.paddingBottom = epw_e('epw_r2_1').style.paddingRight = '0px';
    	epw_e('epw_r2_2').style.paddingLeft = '90px';
    	epw_e('epw_r2_2').style.paddingTop = epw_e('epw_r2_2').style.paddingBottom = epw_e('epw_r2_2').style.paddingRight = '0px';
    	epw_e('epw_b1').style.paddingLeft = epw_e('epw_b2').style.paddingLeft = '100px';
    	w = 180;
    } else if (epw_width >= 200 && epw_width < 220) {
    	epw_width = 200;
    	epw_e('epw_r1').style.paddingLeft = '180px';
    	epw_e('epw_r1').style.paddingTop = epw_e('epw_r1').style.paddingBottom = epw_e('epw_r1').style.paddingRight = '0px';
    	epw_e('epw_r2_1').style.paddingLeft = '100px';
    	epw_e('epw_r2_1').style.paddingTop = epw_e('epw_r2_1').style.paddingBottom = epw_e('epw_r2_1').style.paddingRight = '0px';
    	epw_e('epw_r2_2').style.paddingLeft = '75px';
    	epw_e('epw_r2_2').style.paddingTop = epw_e('epw_r2_2').style.paddingBottom = epw_e('epw_r2_2').style.paddingRight = '0px';
    	epw_e('epw_b1').style.paddingLeft = epw_e('epw_b2').style.paddingLeft = '85px';
	    w = 165;
    } else {
    	epw_width = 160;
    	epw_e('epw_r1').style.paddingLeft = '140px';
    	epw_e('epw_r1').style.paddingTop = epw_e('epw_r1').style.paddingBottom = epw_e('epw_r1').style.paddingRight = '0px';
    	epw_e('epw_r2_1').style.paddingLeft = '85px';
    	epw_e('epw_r2_1').style.paddingTop = epw_e('epw_r2_1').style.paddingBottom = epw_e('epw_r2_1').style.paddingRight = '0px';
    	epw_e('epw_r2_2').style.paddingLeft = '50px';
    	epw_e('epw_r2_2').style.paddingTop = epw_e('epw_r2_2').style.paddingBottom = epw_e('epw_r2_2').style.paddingRight = '0px';
    	epw_e('epw_b1').style.paddingLeft = epw_e('epw_b2').style.paddingLeft = '68px';
	    w = 128;
    }
    
    var frame = epw_e('epw_widget_frame');
    if (blog) {
    	frame.style.backgroundImage = 'url(\'' + epw_img_location + 'epbw_'+epw_width+'.gif\')';
    } else {
    	frame.style.backgroundImage = 'url(\'' + epw_img_location + 'epgw_'+epw_width+'.gif\')';
    }
    frame.width = frame.style.width = epw_width + 'px';
    epw_e('epw_content').style.width = epw_width + 'px';
    if (epw_e('ep2')) epw_e('ep2').style.width = epw_width + 'px';
    
    var gpos = epw_gpos();
    if (gpos < 155) {
    	var popout = epw_e('epw_widget_popout');
    	popout.style.backgroundImage = 'url(\'' + epw_img_location + 'epw_pop_right.gif\')';
    	epw_e('epw_popout_content').style.margin = '5px 0px 5px 20px';
    	var help = epw_e('epw_widget_help');
    	help.style.backgroundImage = 'url(\'' + epw_img_location + 'epbw_help_right.gif\')';
    	help.style.width = '165px';
    	epw_right = true;
    }
    
    for (var i = 1; i <= epw_stories.length; i++) {
    	var e = epw_e('epw_t'+i);
    	var title = epw_format(e, epw_stories[i-1]['title'], w, 2);
    	if (title[0] == epw_stories[i-1]['title'] && title[1] == 1) {
	   		epw_e('epw_'+i).style.paddingTop = '8px';
	   		epw_e('epw_'+i).style.paddingBottom = '5px';
	   		epw_e('epw_'+i).style.height = '23px';
    	}
    	epw_stories[i-1]['title'] = e.innerHTML = title[0];
    }
   	var e = epw_e('epwh_t');
   	if (e) {
	   	var title = epw_format(e, epw_ht, w, 2);
	   	if (title[0] == epw_ht && title[1] == 1) {
	   		epw_e('epwh').style.paddingTop = '8px';
	   		epw_e('epwh').style.paddingBottom = '5px';
	   		epw_e('epwh').style.height = '23px';
	   	}
	   	epw_ht = e.innerHTML = title[0];
   	}
   	
    epw_check_overflow();
    
    return;
}

if (is_ie) {
    window.onload = function() {
        epw_enabled = true;
    }
} else { 
	epw_enabled = true; 
}document.write('<style type="text/css">#epw_widget_frame { background-image:url("http://img.experienceproject.com/images/mk/group_blogs/epbw_160.gif");background-repeat:no-repeat;width:160px;height:176px;padding:0px;margin:0px;text-align:left;float:none;overflow:visible;left:0px; } #epw_widget_frame a:hover { background-color:transparent;text-decoration:none;border:0px none; } #epw_content a { text-decoration:none;color:#4E4848;background-color:transparent;line-height:normal;text-indent:0;overflow:visible; } #epw_content a:hover { text-decoration:none;border:0px none;padding:0px; } #epw_content a:visited { text-decoration:none;border:0px none;padding:0px; } #epw_widget_popout { background-image:url("http://img.experienceproject.com/images/mk/group_blogs/epw_pop_left.gif");background-repeat:no-repeat;position:absolute;color:#000;font-family:verdana;display:none;padding:0px;margin:0px;text-align:left;height:135px;width:155px;background-color:transparent;line-height:normal;word-spacing:normal;letter-spacing:normal;text-decoration:none;text-align:left;text-indent:0;overflow:visible; } #epw_popout_content { font-size:8pt;margin:5px;padding:2px;width:125px;font-style:italic;background-color:transparent;line-height:normal;word-spacing:normal;letter-spacing:normal;text-decoration:none;text-align:left;text-indent:0; } #epw_popout_content b { font-size:11pt; } #epw_widget_help { background-image:url("http://img.experienceproject.com/images/mk/group_blogs/epbw_help_left.gif");background-repeat:no-repeat;position:absolute;display:none;padding:0px;margin:0px;height:150px;width:150px;overflow:visible; } #epw_widget_help img { float:right; }#ep2 { font-size:8pt;font-family:verdana;text-align:left;color:#000000;width:160px; } #ep2 a { color:#003399; background-color:transparent; text-decoration:none; } #ep2 a:hover { color:#FFF; background-color: #6699CC; } </style><div id="epw" align="left" style=";"><div id="epw_widget_help" align="left" style="z-index:999;padding:0px;margin:0px;" onmouseover=\"this.style.cursor=\'pointer\';\" onclick=\"if (epw_animating) document.location.href=\'http://www.experienceproject.com?ref=bw_t8_b113\';\"><img src="http://img.experienceproject.com/images/mk/group_blogs/epw_close.gif" width="12" height="12" title="Close" border="0" onclick="epw_help(false);"></div><div id="epw_widget_popout" align="left" style="z-index:998;"><div id="epw_popout_content" style="font-size:8pt;font-style:italic;background-color:transparent;font-family:verdana;font-stretch:normal;font-variant:normal;font-weight:normal;text-transform:none;text-align:left;white-space:normal;text-decoration:none;line-height:normal;"></div></div><div id="epw_widget_frame" align="left" style="left:0px;"><a id="epw_r1" href="javascript:void(0)" onclick="epw_help(true);" onmouseover="epw_toggle_popout(false);" style="margin:5px;padding-left:140px;line-height:15px;text-decoration:none;display:block;border:0px none;" title="Find Out More about Experience Project">&nbsp;</a><a id="epw_r2_1" href="http://www.experienceproject.com/mk/group_blogs/blog_feeds.php?b=113&v=t&ref=bw_t8_b113" onmouseover="epw_toggle_popout(false);" style="margin-left:5px;padding-left:85px;line-height:20px;text-decoration:none;display:inline;border:0px none;" title="Voted Best of Blogs on Experience Project">&nbsp;</a><a id="epw_r2_2" href="http://www.experienceproject.com/mk/group_blogs/blog_feeds.php?b=113&v=t&ref=bw_t8_b113" onmouseover="epw_toggle_popout(false);" style="margin:0px;padding-left:50px;line-height:20px;text-decoration:none;display:inline;border:0px none;" title="Vote Now - Make Your Voice Count!">&nbsp;</a><div id="epw_content" style="background-color:transparent;height:108px;width:160px;" align="left"><div id="epw_1" style="font-size:10pt;color:#4E4848;font-family:verdana;font-stretch:normal;font-style:normal;font-variant:normal;font-weight:normal;text-transform:none;letter-spacing:normal;text-align:left;white-space:normal;word-spacing:normal;text-decoration:none;line-height:normal;vertical-align:middle;border:0px none; padding:2px 5px 2px 5px;margin:0px;height:34px;" onmouseover="epw_popout(1,true);epw_div(this.id,true);" onmouseout="epw_div(this.id,false);"><a id="epw_a1" href="http://www.experienceproject.com/uw.php?e=82565&ref=bw_t8_b113" title="I Hate Water Wasters" style="font-size:10pt;color:#4E4848;font-family:verdana;font-stretch:normal;font-style:normal;font-variant:normal;font-weight:normal;text-transform:none;letter-spacing:normal;text-align:left;white-space:normal;word-spacing:normal;text-decoration:none;line-height:normal;vertical-align:middle;border:0px none; padding:0px;margin:0px;">&ldquo;<span id="epw_t1" style="padding:0px;margin:0px;">I Hate Water Wasters</span>&rdquo;</a></div><div id="epw_2" style="font-size:10pt;color:#4E4848;font-family:verdana;font-stretch:normal;font-style:normal;font-variant:normal;font-weight:normal;text-transform:none;letter-spacing:normal;text-align:left;white-space:normal;word-spacing:normal;text-decoration:none;line-height:normal;vertical-align:middle;border:0px none; padding:2px 5px 2px 5px;margin:0px;height:34px;" onmouseover="epw_popout(2,true);epw_div(this.id,true);" onmouseout="epw_div(this.id,false);"><a id="epw_a2" href="http://www.experienceproject.com/uw.php?e=250863&ref=bw_t8_b113" title="Enough Is Enough" style="font-size:10pt;color:#4E4848;font-family:verdana;font-stretch:normal;font-style:normal;font-variant:normal;font-weight:normal;text-transform:none;letter-spacing:normal;text-align:left;white-space:normal;word-spacing:normal;text-decoration:none;line-height:normal;vertical-align:middle;border:0px none; padding:0px;margin:0px;">&ldquo;<span id="epw_t2" style="padding:0px;margin:0px;">Enough Is Enough</span>&rdquo;</a></div><div id="epwh" style="font-size:10pt;color:#4E4848;font-family:verdana;font-stretch:normal;font-style:normal;font-variant:normal;font-weight:normal;text-transform:none;letter-spacing:normal;text-align:left;white-space:normal;word-spacing:normal;text-decoration:none;line-height:normal;vertical-align:middle;border:0px none; padding:2px 5px 2px 5px;margin:0px;height:34px;" onmouseover="epwh_popout(true);epw_div(this.id,true);" onmouseout="epw_div(this.id,false);"><a id="epwh_a" href="http://www.experienceproject.com/mk/group_blogs/bw_redirect.php?ref=bw_t8_b113&r=http%3A%2F%2Fartiface.typepad.com%2Fmy_weblog%2F" title="Put Yourself to Bedlam" style="font-size:10pt;color:#4E4848;font-family:verdana;font-stretch:normal;font-style:normal;font-variant:normal;font-weight:normal;text-transform:none;letter-spacing:normal;text-align:left;white-space:normal;word-spacing:normal;text-decoration:none;line-height:normal;vertical-align:middle;border:0px none; padding:0px;margin:0px;"><span id="epwh_t" style="padding:0px;margin:0px;">Put Yourself to Bedlam</span></a></div></div><a id="epw_b1" href="http://www.experienceproject.com/topics/green.php?ref=bw_t8_b113" onmouseover="epw_toggle_popout(false);" style="padding-left:68px;margin:0px;line-height:25px;text-decoration:none;display:inline;border:0px none;" title="Read More Stories Like These...">&nbsp;</a><a id="epw_b2" href="http://www.experienceproject.com/mk/group_blogs/blog_promotion_tool.php?ref=bw_t8_b113" onmouseover="epw_toggle_popout(false);" style="padding-left:68px;margin:0px;line-height:25px;text-decoration:none;display:inline;border:0px none;" title="Add This Widget to Your Blog!">&nbsp;</a></div></div>');epw_widget_setup(true);