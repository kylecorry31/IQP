var iqps = [
  {
    project: "Sustainability Compilation",
    location: {
      name: "Worcester Polytechnic Institute, Worcester, MA, USA",
      latitude: 42.2746,
      longitude: -71.8063
    },
    authors: ["Ema Mehuljic", "Kyle Corry"],
    advisors: ["Prof. Shockey", "Prof. Rosenstock", "Prof. Mathisen"],
    type: "IQP",
    year: "2018 - 2019",
    description: "Creating a way for students to learn more and become part of the sustainability community of Worcester and WPI's IQPs.",
    url: "https://www.wpi.edu"
  },
  {
    project: "Something Else",
    location: {
      name: "Chepachet, RI, USA",
      latitude: 41.9152,
      longitude: -71.6714
    },
    authors: ["Kyle Corry"],
    advisors: ["Nobody"],
    type: "IQP",
    year: "2017 - 2018",
    description: "Description here",
    url: "https://kylecorry31.github.io"
  }
];

var Globe = function(ArcGIS, containerID, center, zoom){

  var container = document.getElementById(containerID);

  EventBus.subscribe("globe-visible", function(visible){
    if(visible){
      container.style.display = "inherit";
    } else {
      container.style.display = "none";
    }
  });

	var map = new ArcGIS.Map({
        basemap: "hybrid",
        layers: []
    });

	this.addLayer = function(layer){
		map.layers.push(layer);
	}

	this.view = new ArcGIS.SceneView({
		container: containerID,
	    center: center,
	    zoom: zoom,
	    map: map
	});

  this.goTo = function(coords){
    this.view.goTo({
        center: [coords.longitude, coords.latitude],
        zoom: coords.zoom,
        heading: 0,
        tilt: 0
      });
  };

  EventBus.subscribe("globe-center", this.goTo.bind(this));
};

require([
      "esri/Map",
      "esri/layers/CSVLayer",
      "esri/views/SceneView",
      "esri/config",
      "esri/core/urlUtils",
      "dojo/domReady!"
    ], function(
      Map,
      CSVLayer,
      SceneView,
      esriConfig,
      urlUtils
    ) {

    /*
      Default options:
        popupTemplate: {title: "Point", content: "A point"}
        copyright: "None"
        color: [255, 0, 0, 1]
        outline: {width: 0.5, color: "white"}
        size: "20px"
    */
    function createCSVLayer(url, options){
      var defaultTemplate = {
        title: "Point",
        content: "A point"
      };
      var defaultCopyright = "None";
      var defaultColor = [255, 0, 0, 0.75];
      var defaultOutline = {
        width: 0.5, 
        color: "white"
      };
      var defaultSize = "20px";
      var userOptions = {
        popupTemplate: defaultTemplate,
        copyright: defaultCopyright,
        color: defaultColor,
        outline: defaultOutline,
        size: defaultSize
      };

      if(options){
        for(var i in options){
          userOptions[i] = options[i];
        }
      }

      options = userOptions;

      esriConfig.request.corsEnabledServers.push(url);

      var csvLayer = new CSVLayer({
        url: url,
        copyright: options.copyright,
        popupTemplate: options.popupTemplate,
        elevationInfo: {
          mode: "on-the-ground"
        }
      });

      csvLayer.renderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
          type: "point-3d", // autocasts as new PointSymbol3D()
          symbolLayers: [{
            type: "icon", // autocasts as new IconSymbol3DLayer()
            material: {
              color: options.color
            },
            outline: options.outline,
            size: options.size
          }]
        }
      };

      return csvLayer;
    }

      var url = "iqps.csv";

      var template = {
        title: "{place}",
        content: "IQP by {authors}"
      };

      var csvLayer = createCSVLayer(url, {
        copyright: "WPI",
        popupTemplate: template,
        color: [172, 43, 55, 0.75],
        outline: {
          width: 0.5,
          color: "white"
        },
        size: "20px"
      });

      var ArcGIS = {
        Map: Map,
        SceneView: SceneView
      };

      var globe = new Globe(ArcGIS, "viewDiv", [-70, 42], 4);

      globe.addLayer(csvLayer);

    });


document.addEventListener("DOMContentLoaded", function () {
        var qrcode = new QRCodeManager(document.getElementById("detail-qrcode"), "http://www.wpi.edu");

      document.getElementById("globeToggle").checked = true;
      document.getElementById("kioskToggle").checked = false;

      EventBus.subscribe("kiosk", function(isKiosk){
        var iqpURL = document.getElementById("iqp-url");
        if(isKiosk){
          EventBus.publish("qr-code", "http://www.wpi.edu");
          iqpURL.style.display = "none";
        } else {
          EventBus.publish("qr-code", false);
          iqpURL.style.display = "inline";
        }
      });

      EventBus.publish("kiosk", false);

      EventBus.subscribe("iqp-url", function(url){
        // TODO: fix this
        EventBus.publish("qr-code", url);
        document.getElementById("iqp-url").innerHTML = url;
      });

      EventBus.subscribe("iqp", displayIQP);


      var iqpList = document.getElementById("iqp-list");
      var iqpString = "";
      var count = 0;
      iqps.forEach(function(iqp){
        var li = '<li class="mdl-list__item mdl-js-ripple-effect mdl-list__item--three-line" onclick="displayIQP(iqps['+count+']);">\
          <span class="mdl-ripple"></span>\
          <span class="mdl-list__item-primary-content">\
            <span>' + iqp.project +'</span>\
          <span class="mdl-list__item-text-body">' +
          iqp.location.name +
          '</span>\
          </span>\
        </li>';
        iqpString += li;
        count++;
      });

      iqpList.innerHTML = iqpString;
    });

function kioskStateChanged(){
    var sw = document.getElementById("kioskToggle");
    EventBus.publish("kiosk", sw.checked);
}

function displayGlobeStateChanged(){
  var sw = document.getElementById("globeToggle");
  EventBus.publish("globe-visible", sw.checked);
}

function displayIQP(iqp){

  var coords = {
    latitude: iqp.location.latitude,
    longitude: iqp.location.longitude,
    zoom: 8
  };

  EventBus.publish("globe-center", coords);
  EventBus.publish("iqp-url", iqp.url);
  document.getElementById("detail-table").classList.remove("hidden");
  document.getElementById("iqp-list").classList.add("hidden");
  document.getElementById("detail-title").innerHTML = iqp.project;

  var table = document.getElementById("detail-table");

  table.rows[0].cells[1].innerHTML = iqp.location.name;
  table.rows[1].cells[1].innerHTML = iqp.authors.join(", ");
  table.rows[2].cells[1].innerHTML = iqp.advisors.join(", ");
  table.rows[3].cells[1].innerHTML = iqp.type;
  table.rows[4].cells[1].innerHTML = iqp.year;
  table.rows[5].cells[1].innerHTML = iqp.description;

}