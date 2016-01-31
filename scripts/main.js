"use strict";function uuid(){var e="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,o="x"===e?t:3&t|8;return o.toString(16)});return e}function addMap(){var e="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA";map=L.map("map"),map.setView([52.505,5.09],8),L.tileLayer("https://api.mapbox.com/v4/{mapid}/{z}/{x}/{y}.{format}?access_token={token}",{attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OSM</a>, &copy; <a href="http://cartodb.com/attributions">mapbox</a>',token:e,format:"png",mapid:"mapbox.dark"}).addTo(map),map.properties={editing:!1,deleting:!1};var t=new L.FeatureGroup;map.addLayer(t);var o={position:"topright",draw:{polyline:!1,polygon:!1,circle:!1,rectangle:{},marker:!1},edit:{featureGroup:t,edit:{selectedPathOptions:{maintainColor:!0,opacity:.3}},remove:{}}},a=new L.Control.Draw(o);map.addControl(a),map.on("draw:created",function(e){var o=(e.layerType,e.layer);o.feature={type:"Feature",properties:{startDate:moment().add(-1,"weeks").toJSON(),endDate:moment().add(1,"weeks").toJSON(),incidentId:uuid()}};var a=o.toGeoJSON();console.log("created",a),o.on("click",function(e){console.log("click",e),map.properties.editing||map.properties.deleting||($("#startDate").data("DateTimePicker").date(moment(o.feature.properties.startDate)),$("#endDate").data("DateTimePicker").date(moment(o.feature.properties.endDate)),$("#modal-form").data(o),$("#modal-form").modal({}))}),t.addLayer(o)}),map.on("draw:edited",function(e){var t=e.layers;t.eachLayer(function(e){var t=e.toGeoJSON();console.log("edited",t)})}),map.on("draw:deletestart",function(e){console.log("about to delete",e),map.properties.deleting=!0}),map.on("draw:editstart",function(e){console.log("about to edit"),map.properties.editing=!0}),map.on("draw:deletestop",function(e){console.log("no more deletes",e),map.properties.deleting=!1}),map.on("draw:editstop",function(e){console.log("no more edits"),map.properties.editing=!1}),map.on("draw:deleted",function(e){var t=e.layers;t.eachLayer(function(e){var t=e.toGeoJSON();console.log("deleted",t)})})}var map;!function(){function e(e){return _.any(_.map(e._latlngs,function(e){return e.lng<-0}))&&(e._latlngs=_.map(e._latlngs,function(e,t){if(t>0){var o;if(e.lng-this[t-1].lng<-180)return o=new L.latLng(e.lat,e.lng+360,!0),this[t]=o,o;if(e.lng-this[t-1].lng>180)return o=new L.latLng(e.lat,e.lng-360,!0),this[t]=o,o}return e},e._latlngs)),e}var t="54.76.43.47",o=new SockJS("http://"+t+"/stomp"),a=Stomp.over(o);a.debug=null,a.heartbeat.outgoing=0,a.heartbeat.incoming=0;var n=function(){console.log("connected"),a.subscribe("/exchange/crisis_crawl",function(t){var o=JSON.parse(t.body),a=o.footprint,n=omnivore.wkt.parse(a);n.setStyle({fillColor:"blue"});var r=_.values(n._layers)[0];r=e(r),n.addTo(map),_.each(_.values(n._layers),function(e){$(e._path).hide().fadeIn().delay(3e3).fadeOut({duration:"slow",complete:function(){map.removeLayer(n)}})}),n.on("click",function(){console.log(this)})}),a.subscribe("/queue/crisis_download",function(t){var o=JSON.parse(t.body),a=o.footprint,n=omnivore.wkt.parse(a);n.setStyle({fillColor:"green"});var r=_.values(n._layers)[0];r=e(r),n.addTo(map),_.each(_.values(n._layers),function(e){$(e._path).hide().fadeIn().delay(1e4).fadeOut({duration:"slow",complete:function(){map.removeLayer(n)}})}),n.on("click",function(){console.log(this)})}),document.addEventListener("incident",function(e){console.log("send to rabbitmq",e.detail),a.send("/exchange/crisis_incident",{"content-type":"application/json"},JSON.stringify(e.detail))})},r=function(e){console.log("error",e)};a.connect("public","public",n,r,"/")}(),function(){window.twttr=function(e,t,o){var a=e.getElementsByTagName(t)[0];if(e.getElementById(o))return window.twttr;var n=e.createElement(t);n.id=o,n.src="https://platform.twitter.com/widgets.js",a.parentNode.insertBefore(n,a);var r={_e:[],ready:function(e){r._e.push(e)}};return window.twttr||r}(document,"script","twitter-wjs")}();var addTweets;!function(){var e=function(e){function t(e,t){e.properties&&e.properties.oembed.html?t.bindPopup(e.properties.oembed.html):t.bindPopup(e.properties.text)}var o=L.geoJson(e,{onEachFeature:t,style:{stroke:!0,color:"white",fill:!1}});o.addTo(map),_.each(_.values(o._layers),function(e){$(e._path).hide().fadeIn({duration:"slow"}).delay(15e3).fadeOut({duration:"slow",complete:function(){map.removeLayer(o)}})})};addTweets=function(){fetch("data/tweets.json").then(function(e){return e.json()}).then(function(t){_.each(t,function(t){e(t)})}),map.on("popupopen",function(e){var t=e.popup._contentNode;twttr.widgets.load(t)})}}(),addMap(),addTweets(),$(function(){$("#startDate").datetimepicker(),$("#endDate").datetimepicker(),$("#save").click(function(){$("#modal-form").modal("hide");var e=$("#modal-form").data(),t=e.feature.properties;t.startDate=$("#startDate").data("DateTimePicker").date().toJSON(),t.endDate=$("#endDate").data("DateTimePicker").date().toJSON(),t.tags=$("#tags").val();var o=e.toGeoJSON();console.log("geojson",o);var a=new CustomEvent("incident",{detail:o});document.dispatchEvent(a)})});