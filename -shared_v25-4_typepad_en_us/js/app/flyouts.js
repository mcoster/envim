function refreshFlyouts( ev ) {
    var flyouts = [
        { id: 'global-user-blogs', parent: 'nav-group' },
        { id: 'global-user-library', parent: 'nav-group' },
        { id: 'blog-compose', parent: 'blog-nav-compose' },
        { id: 'user-blogs', parent: 'flyout-parent' },
        { id: 'blog-actions', parent: 'blog' },
        { id: 'album-actions', parent: 'album' },
        { id: 'typelist-actions', parent: 'typelist' },
        { id: 'post-actions', parent: 'post' },
        { id: 'page-actions', parent: 'page' },
        { id: 'comment-author', parent: 'comment' },
        { id: 'comment-entry', parent: 'comment' },
        { id: 'comment-actions', parent: 'comment' },
        { id: 'contact', parent: 'contact-list' },
        { id: 'trackback-source', parent: 'trackback' },
        { id: 'trackback-entry', parent: 'trackback' },
        { id: 'trackback-actions', parent: 'trackback' },
        { id: 'design-settings', parent: 'tp-button-status' },
        { id: 'design-actions', parent: 'tp-button-status' },
        { id: 'dbcompose-share-accounts', parent: 'share-post' }
    ];
    
    var flyout_parents,
        flyout_target,
        flyout_info,
        flyout_parent;

    // remove all "flyout-focus" classes
    flyout_parents = YAHOO.util.Dom.getElementsByClassName( 'flyout-focus', null, null, function( el ) {
        YAHOO.util.Dom.removeClass( el, 'flyout-focus' );
        for( var i = 0; i < flyouts.length; i++ ) {
            YAHOO.util.Dom.removeClass( el, 'flyout-focus-' + flyouts[ i ].id );
        }
    } );

    // check whether the click reveals a flyout
    flyout_target = getFlyoutTarget(ev);
    if(!flyout_target) {
        return;
    }
    // stop event from completing
    YAHOO.util.Event.stopEvent( ev );

    // get the target's intended flyout
    for( var i = 0; i < flyouts.length; i++ ) {
        if( YAHOO.util.Dom.hasClass( flyout_target, 'flyout-init-' + flyouts[ i ].id ) ) {
            flyout_info = flyouts[ i ];
        }
    }
    if( !flyout_info ) {
        return;
    }

    // get the intended flyout's parent
    flyout_parent = YAHOO.util.Dom.getAncestorByClassName( flyout_target, flyout_info.parent );
    if( !flyout_parent ) {
        return;
    }

    // set the focus class for the flyout on the parent
    YAHOO.util.Dom.addClass( flyout_parent, 'flyout-focus' );
    YAHOO.util.Dom.addClass( flyout_parent, 'flyout-focus-' + flyout_info.id );

}

function getFlyoutTarget(ev) {
    // check whether the click reveals a flyout
    flyout_target = YAHOO.util.Event.getTarget( ev );
    if( !YAHOO.util.Dom.hasClass( flyout_target, 'flyout-init' ) ) {
        flyout_target = YAHOO.util.Dom.getAncestorByClassName( flyout_target, 'flyout-init' );
    }
    if( !flyout_target ) {
        return null;
    }
    
    return flyout_target;
}

/* 
    Searche the dom tree for elements with attribute "at:flyout-enabled"
    If any elements are found with that attribute:
        Append the tpc-flyout iframe to the page
        Setup event handlers for flyout appear/disappear
    Else
        do nothing
*/
function prepareTPCFlyouts(tag) {
    var flyoutEls, timeoutID;
    // Check for any elements with "at:flyout-enabled" on them
    flyoutEls = YAHOO.util.Dom.getElementsBy( 
        // Method to find the elements
        function ( el ) {
            if(el.getAttribute("at:flyout-enabled")) {
                return true;
            }
        }, 
        // tag name to look for
        tag, 
        // Root node to start from (null is body)
        null, 
        // Method to apply to these elements
        function ( el ) {
            YAHOO.util.Event.on( el, 'mouseover', function() {
                // set a timeout, keep track of the element that was moused over. if the timeout completes, show the flyout
                timeoutID = setTimeout( function() {
                    
                    // get flyout parameters
                    var paramArray = getFlyoutParameters(el);
                    
                    // if we have the right parameters, show flyout
                    if((paramArray[0] || paramArray[1]) && paramArray[3]) {
                        //console.log("(will be) showing flyout with these parameters: ", paramArray);
                        showTPCFlyout(paramArray, el );
                        //showFlyout( paramArray, el );
                    } else {
                        // Debug messaging:
                        // console.log("Missing parameters, cannot show flyout.");
                    }
                }, 300);

                // add a listener to the element to abort showing flyout on mouseout
                YAHOO.util.Event.on( el, 'mouseout', function() { 

                    // ensure the flyout never appears
                    clearTimeout( timeoutID );
                    // remove event listener on element
                    YAHOO.util.Event.removeListener(el, 'mouseout');

                });                
                    
            });
            

        }
    );
    
    YAHOO.util.Dom.getElementsBy( 
        function ( el ){
            if(el.getAttribute("at:flyout-click")) {
                return true;
            }
        }, "A", null,
        function ( el ){
            YAHOO.util.Event.on( el, 'click', function(){
                var altEl;
                
                var paramArray = getFlyoutParameters(el);

                if((paramArray[0] || paramArray[1]) && paramArray[3]) {
                    // console.log("(will be) showing flyout with these parameters: ", paramArray);
                    showTPCFlyout(paramArray, el, 60);
                } else {
                    // Debug messaging:
                    // console.log("Missing parameters, cannot show flyout.");
                }                
            });
        }
    );
   
    // Array will have length if elements with correct attribute were found
    // Append the tpc-flyout iframe to the end of the page
    if(flyoutEls.length) {
        // <iframe id="tpc-flyout" src="null"></iframe>
        var tpc_flyout = createIframe("");
        appendIframe(tpc_flyout);
    }
}

/* Create an iframe element and return it */
function createIframe(src, flyoutType, id) {
    var tpc_flyout = document.createElement('iframe');
    var classNames = "hiddenBox tpc-flyout tpc-flyout-" + (flyoutType || "appside-default");
    tpc_flyout.id = id || "tpc-flyout";
    tpc_flyout.src = src;
    tpc_flyout.className = classNames;
    tpc_flyout.scrolling = "no";
    tpc_flyout.frameBorder = "0";
    tpc_flyout.border = "0";
    tpc_flyout.allowtransparency = "true";
    return tpc_flyout;
}

/* Append an iframe element to the right location in the file */
function appendIframe(tpc_flyout) {
    if(document.getElementById("content-inner"))
        document.getElementById("content-inner").appendChild(tpc_flyout);
    else
        document.body.appendChild(tpc_flyout);  
          
}

function replaceIframe(tpc_flyout) {
    
    var oldFlyoutID = tpc_oldID || 'tpc-flyout';
    
    if(document.getElementById(oldFlyoutID).parentNode == document.getElementById("content-inner"))
        document.getElementById("content-inner").replaceChild(tpc_flyout, document.getElementById(oldFlyoutID));
    else
        document.body.replaceChild(tpc_flyout, document.getElementById(oldFlyoutID));
        
    tpc_oldID = tpc_flyout.id;

}

/*  
    Flyouts expect three parameters:
    1) Either user's xid (user_xid) or the asset's xid (asset_xid (anonymous user case))
    2) The blog xid (for use in blogside flyouts where comment counts are needed)
    3) The flyout type
*/
function getFlyoutParameters (el) {
    var paramArray = new Array;
    if(el.getAttribute("at:flyout-userxid")) {
        paramArray[0] = el.getAttribute("at:flyout-userxid");
    } 
    if(el.getAttribute("at:flyout-assetxid")) {
        paramArray[1] = el.getAttribute("at:flyout-assetxid");
    } 
    
    if(!(paramArray[0] || paramArray[1])) {
        //console.log("Missing parameter for flyout. Failing");
        return 0;
    }
    
    if(el.getAttribute("at:flyout-blogxid")) {
        paramArray[2] = el.getAttribute("at:flyout-blogxid");
    }
    
    if(el.getAttribute("at:flyout-type")) {
        paramArray[3] = el.getAttribute("at:flyout-type");
    } else if(document.body.getAttribute("at:flyout-type")) {
        paramArray[3] = document.body.getAttribute("at:flyout-type");
    } else {
        paramArray[3] = "appside-default";
    }

    if(el.getAttribute("at:flyout-params")) {
        paramArray[4] = el.getAttribute("at:flyout-params");
    } else if(document.body.getAttribute("at:flyout-params")) {
        paramArray[4] = document.body.getAttribute("at:flyout-params");
    }
    
    return paramArray;
}

/* Show TPC Flyout */
function showTPCFlyout( paramArray, el, leftPos ){

    var iframeSrc = null;
    var iframeID = null;

    // if not cached
    if(!seenIt[paramArray]) {
    
        var userXid = paramArray[0];
        var assetXid = paramArray[1];
        var blogXid = paramArray[2];
        var flyoutType = paramArray[3];
        var optQueryString = paramArray[4];
        var queryString = "?";
    
        if(userXid)
            queryString += "user_id=" + userXid + "&";
        
        if(blogXid)
            queryString += "blog_id=" + blogXid + "&";
        
        if(assetXid) 
            queryString += "asset_id=" + assetXid + "&";
        
        if(flyoutType)
            queryString += "flyout_type=" + flyoutType + "&";
            
        // Optional global variable configured by the embedding page.
        if(window.profileUrlTemplate)
            queryString += "profile_url_template=" + encodeURIComponent(profileUrlTemplate) + "&";

        // Optional global variable configured by the embedding page.
        if(window.TPViewGroupXID)
            queryString += "group_id=" + encodeURIComponent(TPViewGroupXID) + "&";

        if (optQueryString)
            queryString += optQueryString + "&";

        iframeSrc = TPApp.app_uri + 'services/connect/flyout' + queryString;
        
        // unique ID to ensure no iframe source caching by Safari
        iframeID = 'tpc-flyout-'+ new Date().getTime(); 
    
        // create iframe element and cache it
        seenIt[paramArray] = createIframe(iframeSrc, flyoutType, iframeID);
    } else { 
        iframeID = seenIt[paramArray].id;    
    }

    // Replacing old iframe node with new iframe node
    replaceIframe(seenIt[paramArray]);
    
    // Attach mouseout handler to iframe
    YAHOO.util.Event.on(iframeID, 'mouseout', function(e) { hideTPCFlyout(e, iframeID); } ); 
     
    // remove mouse out handler to abort flyout from showing
    YAHOO.util.Event.removeListener(el, 'mouseout');
    
    // unhide flyout
    YAHOO.util.Dom.removeClass(iframeID, 'hiddenBox');

    // set the flyout width
    YAHOO.util.Dom.setStyle( iframeID, 'width', '255px');
    
    // set the flyout's position, use the alternate position if it's passed
    var pos = YAHOO.util.Dom.getXY(el);
    if( leftPos ){
        pos[0] = pos[0]-leftPos;
    }
    pos[0] = pos[0]-15;
    pos[1] = pos[1]-15;
    YAHOO.util.Dom.setXY(iframeID, pos);    
}

function hideTPCFlyout ( e, iframeID ){
        
    if( !YAHOO.util.Dom.isAncestor( iframeID, YAHOO.util.Event.getRelatedTarget( e ) ) ){
        window.focus();
        YAHOO.util.Dom.addClass(iframeID, 'hiddenBox');
    }
    
}

var seenIt = new Object;
var tpc_oldID = null;
seenIt[ '0' ] = {name: 'empty element'};

YAHOO.util.Event.on( document, 'click', refreshFlyouts );
YAHOO.util.Event.onDOMReady( function() {
    // show flyouts for both DIV and IMG tags
    prepareTPCFlyouts("div");
    prepareTPCFlyouts("img");
});