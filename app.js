var Globe = function(ArcGIS, containerID, center, zoom){
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

      var qrcode = new QRCode(document.getElementById("detail-qrcode"), {
          text: "https://www.wpi.edu",
          width: 250,
          height: 250,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
      });


    });