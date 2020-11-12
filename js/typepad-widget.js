var i=0;
var v=window.document.childNodes[0].childNodes[0]; 
while(i<window.document.childNodes.length && (v==undefined || v.nodeName.toLowerCase()!="head"))
{
	i++;
	v=window.document.childNodes[i].childNodes[0]; // find the "head" element
}
var child=v.firstChild;
var u="";
var notdone=1;
while(child!=v.lastChild && notdone)
{
	if(child.nodeName.toLowerCase()=="link")
	{
		var t=child.attributes["type"].nodeValue;
		var h=child.attributes["href"].nodeValue;
		var r=child.attributes["rel"].nodeValue;

		if(r.toLowerCase()=="alternate")
		{
			if(t.toLowerCase()=="application/atom+xml") // preferentually select Atom as the best format if available
			{
				u=h;
				notdone=0;
			} else {
				u=h;
			}
		}
	}
	child=child.nextSibling;
}
if(u>"")
{
document.feedblitz.FEEDID.value=u;
}