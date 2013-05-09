define(["lib/jquery","lib/underscore","lib/backbone","./grid-m","./selection-m","./window-v"],function(e,t,n,r,i,s){var o=n.View.extend({el:"#grid",model:r,selectedViews:[],lastTouch:0,lastBg:"",events:{mousedown:"onTouch"},initialize:function(){this.listenTo(r,"change",this.render),this.listenTo(s,"resize",this.setFrame),this.listenTo(i,"update",this.setSelection),this.setFrame()},getPathForNodes:function(e){var n="";return t.each(e,function(e,t){n+=(t<=0?"M":"L")+e.x+" "+e.y+" "}),n+"Z"},render:function(){var n=this,i={},s={},o=r.nodes,u,a;t.each(r.polys,function(e,t){s[e.id]={id:e.id,nodes:e.nodes.join(" "),d:n.getPathForNodes(r.getNodesForPolygon(e.id))}}),t.each(o,function(e,t){for(a in e.to)e.to.hasOwnProperty(a)&&o.hasOwnProperty(a)&&(u=o[a],i.hasOwnProperty(u.id+" "+e.id)||(i[e.id+" "+u.id]={id:e.id+" "+u.id,x1:e.x,y1:e.y,x2:u.x,y2:u.y}))}),this.tmpl=this.tmpl||t.template(e("#grid-view").html()),this.$el.html(this.tmpl({nodes:o,lines:i,polys:s})),this.selectedViews.length=0,this.setSelection(),this.lastBg!==r.bg&&(this.$el.css("background",r.bg?"url("+r.bg+") no-repeat":""),this.lastBg=r.bg)},setFrame:function(){this.x=this.x||parseInt(this.$el.css("margin-left").slice(0,-2),10),this.y=this.y||e(".header").outerHeight(),this.$el.width(s.width-this.x).height(s.height-this.y)},clearSelection:function(){t.each(this.selectedViews,function(t){t=e(t),t.is("li")?t.removeClass("select").children(":first-child").text(""):t[0].setAttribute("class",t[0].getAttribute("class").replace(/[\s]?select[\s]?/g,""))}),this.selectedViews.length=0},setSelection:function(){var n=this;this.clearSelection(),t.each(i.items,function(t,r){t=document.getElementById(t);if(!t)return;t.tagName.toLowerCase()==="li"?e(t).addClass("select").children(":first").text(r+1):t.setAttribute("class",t.getAttribute("class")+" select"),n.selectedViews.push(t)});if(i.path.length){var r=[];for(var s=0,o=i.path.length-1;s<o;s++)r.push("line."+i.path[s]+"."+i.path[s+1]);e(r.join(",")).each(function(){this.setAttribute("class",this.getAttribute("class")+" select"),n.selectedViews.push(this)})}},localizeEventOffset:function(e){var t=this.$el.offset();return t.left=e.pageX-t.left,t.top=e.pageY-t.top,t},drag:function(t,n,r){var i=this,s=!1;e(document).on("mouseup",function(t){return e(document).off("mouseup mousemove"),typeof n=="function"&&n(i.localizeEventOffset(t)),typeof r=="function"&&r(s),!1}).on("mousemove",function(e){return s=!0,t(i.localizeEventOffset(e)),!1})},dragGeom:function(t,n,i){var s=this,o=this.$el.find("#"+t.join(",#")),u=this.$el.find("line."+t.join(",line.")),a=this.$el.find("path."+t.join(",path."));this.drag(function(t){n.left-=t.left,n.top-=t.top,o.each(function(){var t=e(this),i=r.getNodeById(t.attr("id"));t.css({left:i.x-=n.left,top:i.y-=n.top})}),u.each(function(){var e=this.getAttribute("class").split(" "),t=r.getNodeById(e[0]),n=r.getNodeById(e[1]);this.setAttribute("x1",t.x),this.setAttribute("y1",t.y),this.setAttribute("x2",n.x),this.setAttribute("y2",n.y)}),a.each(function(){var e=this.getAttribute("id"),t=r.getNodesForPolygon(e);this.setAttribute("d",s.getPathForNodes(t))}),n=t},function(){r.save()},i)},dragMarquee:function(n){function o(e,t){var n=Math.min(e.left,t.left),r=Math.max(e.left,t.left),i=Math.min(e.top,t.top),o=Math.max(e.top,t.top),u={x:n,y:i,left:n,top:i,width:r-n,height:o-i};return s.css(u),u}var s=e("#marquee").show();o(n,n),this.drag(function(e){o(n,e)},function(e){t.each(r.getNodesInRect(o(n,e)),function(e){i.select(e)}),s.hide()})},touchNode:function(e,t,n,r){var s=i.contains(e),o=!1;n?(s=i.toggle(e),o=!0):s||(i.deselectAll(),i.select(e),s=!0),s&&this.dragGeom(i.items,t,function(t){!t&&!o&&(i.deselectAll(),i.select(e))})},touchPoly:function(e,t,n,s){if(s){var o=r.getPolygonById(e).nodes;i.setSelection(o)}else n||i.deselectAll(),i.toggle(e)&&this.dragGeom(r.getPolygonById(e).nodes,t)},touchCanvas:function(e,t,n){n?r.addNode(e.left,e.top):(t||i.deselectAll(),this.dragMarquee(e))},onTouch:function(t){var n=e(t.target),r=t.timeStamp-this.lastTouch<250,i=this.localizeEventOffset(t),s;return n=n.is("li > span")?n.parent():n,s=n.attr("id"),this.lastTouch=t.timeStamp,n.is("li")?this.touchNode(s,i,t.shiftKey,r):n.is("path")?this.touchPoly(s,i,t.shiftKey,r):this.touchCanvas(i,t.shiftKey,r),!1}});return new o});