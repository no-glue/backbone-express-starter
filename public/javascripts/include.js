var controlPanel=function(){var n=function(){var n=this;n.setEvents=function(e,t){return e||(e=_.extend),t||(t=Backbone.Events),n.events=e({},t),n},n.getEvents=function(){return"undefined"==typeof n.events&&n.setEvents(),n.events}};return new n}();
var Tip=Backbone.Model.extend({url:"/tips",idAttribute:"_id"});
var TipsCollection=Backbone.Collection.extend({model:Tip,url:"/tips",reset:function(e,o){return Backbone.Collection.prototype.reset.call(this,e,o)}});
var View=Backbone.View.extend({set:function(n){for(var r in n)this[r]=n[r];return this},date:function(n){var r=n.toString().substring(0,8);return new Date(1e3*parseInt(r,16))},clear:function(){this.$el.html("")},unique:function(n,r){var t=n.toJSON(),e=_.property(r);return _.uniq(t,e)},formJson:function(n){for(var r={},t=0,e=n.length;e>t;t++){var i=n[t];r[i.name]=i.value}return r},trigger:function(n,r,t){t||(t=controlPanel),t.getEvents().trigger(n,r)},sortCid:function(n,r){return r||(r=1),_.sortBy(this.models,function(n){return r*parseInt(n.cid.substring(1,n.cid.length))})},sortCidReverse:function(n){return this.sortCid(n,-1)},markdown:function(n){return markdown.parse(n)},replace:function(n,r){return n.replace(/{{(.*?)}}/,r)}});
var LatestTipView=View.extend({tagName:"div",className:"centre",render:function(){this.clear();var e=this.collection.shift(),t=new LatestTipContentView;this.$el.append(t.set({model:e}).render().el);var i=new LatestTipTimeView;this.$el.append(i.set({model:e}).render().el);var n=new LatestTipButtonsView;this.$el.append(n.set({model:e}).render().el),this.collection.unshift(e);var s=new TagNamesView,a=this.unique(this.collection,"tag");this.$el.append(s.set({models:a}).render().el);var r=new TagCreateLinkView;return this.$el.append(r.render().el),this}});
var LatestTipButtonsView=View.extend({tagName:"div",className:"line margin-top-64px",render:function(){var e=new LatestTipTagView;this.$el.append(e.set({model:this.model}).render().el);var t=new LatestTipReportView;return this.$el.append(t.set({model:this.model}).render().el),this}});
var LatestTipContentView=View.extend({tagName:"div",className:"line margin-top-64px",render:function(){var t=$("#latestTipContentTemplate").html();return this.$el.html(this.replace(t,this.markdown(this.model.attributes.content))),this}});
var LatestTipReportView=View.extend({tagName:"span",className:"stripButton",events:{"click a":"report"},render:function(){var t=$("#latestTipReportTemplate").html();return this.$el.html(t),this.$el.attr("data-id",this.model.attributes._id),this},report:function(t){t.preventDefault(),this.trigger("tip:report",this.$el.attr("data-id"))}});
var LatestTipTagView=View.extend({tagName:"span",className:"stripButton",render:function(){var t=$("#latestTipTagTemplate").html(),e=Handlebars.compile(t),a=e(this.model.attributes);return this.$el.html(a),this}});
var LatestTipTimeView=View.extend({tagName:"div",className:"line margin-top-64px",render:function(){var e=$("#latestTipTimeTemplate").html(),t=Handlebars.compile(e),i=t({date:this.date(this.model.attributes._id)});return this.$el.html(i),this}});
var TagCreateFormView=View.extend({tagName:"form",className:"centre",events:{submit:"submit"},render:function(){return this.clear(),this.$el.html($("#tagCreateFormTemplate").html()),this},submit:function(e){e.preventDefault(),this.trigger("tag:create",this.formJson(this.$el.serializeArray()))}});
var TagCreateLinkView=View.extend({tagName:"div",className:"centre margin-top-64px",render:function(){return this.clear(),this.$el.html($("#tagCreateLinkTemplate").html()),this}});
var TagNameView=View.extend({tagName:"li",className:"lineList",render:function(){var e=$("#latestTipTagTemplate").html(),a=Handlebars.compile(e),t=a(this.model);return this.$el.html(t),this}});
var TagNamesView=View.extend({tagName:"ul",className:"margin-top-64px",render:function(){return _.each(this.models,function(e){tagNameView=new TagNameView,this.$el.append(tagNameView.set({model:e}).render().el)},this),this}});
var TagTipsView=View.extend({tagName:"div",className:"centre",render:function(){this.clear();for(var e=this.sortCidReverse(this.models),r=0,i=e.length;i>r;r++){var t=new TipView;this.$el.append(t.set({model:e[r]}).render().el)}return this}});
var TipView=View.extend({tagName:"div",className:"centre",render:function(){this.clear();var e=new LatestTipContentView;this.$el.append(e.set({model:this.model}).render().el);var t=new LatestTipTimeView;this.$el.append(t.set({model:this.model}).render().el);var i=new LatestTipButtonsView;return this.$el.append(i.set({model:this.model}).render().el),this}});
var options=function(n){return n||(n={assure:assure,selector:$,navigate:function(n,t,e,r,a){if(e||(e="/"),t&&t.length){n+=e;for(var s=0,i=t.length;i>s;s++)n+=t[s]+e;n=n.substring(0,n.length-1)}r||(r=!0),a||(a=Backbone.history),a.navigate(n,r)}}),n};
var tipsControllerOptions=function(e){return e||(e={collection:new TipsCollection,latestTipView:new LatestTipView,tagTipsView:new TagTipsView,tagCreateFormView:new TagCreateFormView,element:"#app"}),e};
var TipsController=function(){var e=this;e.initialize=function(){return e.react("tag:create",e.created),e.react("tip:report",e.reported),e},e.set=function(t){for(var n in t)e[n]=t[n];return e},e.get=function(t){return e[t]},e.fetch=function(){var t=e.assure();return e.get("collection").fetch({reset:!0,success:function(e){t.resolve(e.lenght)}}),t},e.saveModel=function(t,n){var r=e.get("collection").get(t),c=e.assure();return r.save(n,{wait:!0,success:function(e){c.resolve(e)}}),c},e.react=function(t,n,r,c){r||(r=e.get("root")),c||(c=controlPanel),c.getEvents().bind(t,n,r)},e.created=function(t){e.get("collection").create(t,{wait:!0,success:function(){e.navigate("home")}})},e.reported=function(t){var n=e.saveModel(t,{reported:!0});n.then(function(){})},e.latestTip=function(){var t=e.fetch();t.then(function(){e.get("selector")(e.get("element")).html(e.get("latestTipView").set({collection:e.get("collection")}).render().el)})},e.create=function(){var t=e.fetch();t.then(function(){e.get("selector")(e.get("element")).html(e.get("tagCreateFormView").render().el)})},e.tag=function(t){var n=e.get("collection").where({tag:t});if(n&&n.length)e.get("selector")(e.get("element")).html(e.get("tagTipsView").set({models:n}).render().el);else{var r=e.fetch();r.then(function(){var n=e.get("collection").where({tag:t});e.get("selector")(e.get("element")).html(e.get("tagTipsView").set({models:n}).render().el)})}}};
var Router=Backbone.Router.extend({initialize:function(t){_.extend(this,t)},routes:{"":"latestTip",home:"latestTip","tags/create":"create","tags/:tag":"tag"},latestTip:function(){this.controllers[this.urls.indexRoute].latestTip()},create:function(){this.controllers[this.urls.createRoute].create()},tag:function(t){this.controllers[this.urls.tagRoute].tag(t)}});
!function(t){new Router(t);Backbone.history.start()}({urls:{indexRoute:"tipsController",createRoute:"tipsController",tagRoute:"tipsController"},controllers:{tipsController:(new TipsController).set(_.extend(options(),tipsControllerOptions())).initialize()}});