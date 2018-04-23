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
        center: [coords.latitude, coords.longitude],
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

      var qrcode = new QRCodeManager(document.getElementById("detail-qrcode"), "http://www.wpi.edu");

      document.getElementById("globeToggle").checked = true;
    });

function displayGlobeStateChanged(){
  var sw = document.getElementById("globeToggle");
  EventBus.publish("globe-visible", sw.checked);
}