var GLOBE_TYPES = Object.freeze(
  {
    NASA: 1,
    GLOBE: 2,
    WATER_COLOR: 3,
    TERRAIN: 4,
    OSM: 5,
    NATURAL: 6
  });

var Globe = function(containerID, center, zoom, globe_type = GLOBE_TYPES.GLOBE) {
  var options = {
    atmosphere: false,
    center: center,
    zoom: zoom,
    dragging: true
  };

  var markers = {};

  var earth = new WE.map(containerID, options);
  // Several different tile servers, maybe find a better one

  switch (globe_type){
    case GLOBE_TYPES.NASA:
      WE.tileLayer('https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
          minZoom: 0,
          maxZoom: 5,
          attribution: 'NASA'
      }).addTo(earth);
      break;
    case GLOBE_TYPES.GLOBE:
      WE.tileLayer('https://tileserver.maptiler.com/cassini-terrestrial/{z}/{x}/{y}.jpg', {
            attribution: 'undefined'
      }).addTo(earth);
      break;
    case GLOBE_TYPES.WATER_COLOR:
      WE.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
      }).addTo(earth);
      break;
    case GLOBE_TYPES.TERRAIN:
      WE.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
      }).addTo(earth);
      break;
    case GLOBE_TYPES.OSM:
      WE.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '© OpenStreetMap contributors'
      }).addTo(earth);
      break;
    case GLOBE_TYPES.NATURAL:
      WE.tileLayer('https://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
          tileSize: 256,
          attribution: 'WebGLEarth example',
          tms: true
        }).addTo(earth);
        break;
  }

  var container = document.getElementById(containerID);

  EventBus.subscribe("globe-visible", function(visible) {
    if (visible) {
      container.classList.remove("hidden");
    } else {
      container.classList.add("hidden");
    }
  });

  this.addPoint = function(id, location, onClickFn, optURL) {
    var marker = WE.marker(location, optURL ? optURL : 'iqp-marker.png', 34, 48).addTo(earth);
    if(onClickFn){
      marker.on('click', function(data){
        onClickFn(data);

      });
    }
    markers[id] = marker;
  };

  this.removePoint = function(id) {
    if (markers[id]) {
      markers[id].removeFrom(earth);
      delete markers[id];
    }
  };

  this.removeAllPoints = function() {
    for (var key in markers) {
      this.removePoint(key);
    }
  };

  this.goTo = function(coords) {
    // TODO: zoom
    // earth.zoomIn(coords.zoom);
    earth.panTo(
      [coords.latitude, coords.longitude]
    );

    // earth.zoomIn(coords.zoom)
  };

  this.setCenter = function(center){
    earth.setCenter(center);
  };

  this.getPosition = function(){
    return earth.getPosition();
  };

  // EventBus.subscribe("globe-center", this.goTo.bind(this));
};

document.addEventListener("DOMContentLoaded", function() {
  var app = new Application();
});

function goHome(){
  location.reload();
}

function kioskStateChanged() {
  var sw = document.getElementById("kioskToggle");
  EventBus.publish("kiosk", sw.checked);
}

function displayGlobeStateChanged() {
  var sw = document.getElementById("globeToggle");
  EventBus.publish("globe-visible", sw.checked);
}

class Application {
  constructor(){
    document.body.addEventListener('keypress', function(event){
      if (event.key == 'q'){
        window.history.back();
      }  
    });
    var globe = new IQPGlobe("viewDiv");

    var iqpLoader = new IQPLoader('locations.csv');
  }
}

/*******************************************************************************
 GLOBE SUBSYSTEM
*******************************************************************************/

class IQPGlobe {
  constructor(elementID) {
    this.selectedIQP = null;
    this.globe = new Globe(elementID, [42.2745793,-71.8084611], 2, GLOBE_TYPES.WATER_COLOR);
    EventBus.subscribe("iqp-added", function(iqp) {
      if (iqp.location.name === 'WPI'){
        this.globe.addPoint(iqp.id, [iqp.location.latitude, iqp.location.longitude], function(){
          EventBus.publish("iqp", iqp);
        }, 'iqp-marker-selected.png');
      } else {
        this.globe.addPoint(iqp.id, [iqp.location.latitude, iqp.location.longitude], function(){
          EventBus.publish("iqp", iqp);
        }, 'iqp-marker.png');
      }

    }.bind(this));

    EventBus.subscribe("iqp", function(iqp) {
      this.globe.removePoint(-1);
      this.globe.goTo(iqp.location);
      this.globe.addPoint(-1, [iqp.location.latitude, iqp.location.longitude], undefined, 'iqp-marker-selected.png');
    }.bind(this));

    // From http://examples.webglearth.com/#animation
    var before = null;
    var earth = this.globe;
    requestAnimationFrame(function animate(now) {
        var c = earth.getPosition();
        var elapsed = before ? now - before: 0;
        before = now;
        earth.setCenter([c[0], c[1] + 0.1*(elapsed/80)]);
        requestAnimationFrame(animate);
    }.bind(this));

    // document.getElementById("globeToggle").checked = true;

    // EventBus.subscribe("kiosk", function(isKiosk){
    //   if(isKiosk){
    //     document.getElementById("show-globe-toggle").classList.add("hidden");
    //   } else {
    //     document.getElementById("show-globe-toggle").classList.remove("hidden");
    //   }
    // }.bind(this));


  }
}

/*******************************************************************************
DETAILS SUBSYSTEM
*******************************************************************************/

class DetailsPanel {
  constructor(element) {
    this.element = element;
    EventBus.subscribe("iqp", this.showIQP.bind(this));
    // this.qrcode = new QRCodeManager(document.getElementById("detail-qrcode"), "");

    // EventBus.subscribe("kiosk", function(isKiosk){
    //   var iqpURL = document.getElementById("iqp-url");
    //   if (isKiosk) {
    //     EventBus.publish("qr-code-visible", true);
    //     iqpURL.classList.add("hidden");
    //   } else {
    //     EventBus.publish("qr-code-visible", false);
    //     iqpURL.classList.remove("hidden");
    //   }
    // }.bind(this));
  }

  showIQP(iqp) {
    EventBus.publish("qr-code", iqp.url);
    // document.getElementById("iqp-url").innerHTML = iqp.url;
    document.getElementById("iqp-details").classList.remove("hidden");
    document.getElementById("iqp-list").classList.add("hidden");
    document.getElementById("detail-title").innerHTML = iqp.project;

    var table = document.getElementById("detail-table");

    table.rows[0].cells[1].innerHTML = iqp.location.name;
    table.rows[1].cells[1].innerHTML = iqp.authors;
    table.rows[2].cells[1].innerHTML = iqp.advisors;
    table.rows[3].cells[1].innerHTML = iqp.sponsor;
    table.rows[4].cells[1].innerHTML = iqp.type;
    table.rows[5].cells[1].innerHTML = iqp.date;
    table.rows[6].cells[1].innerHTML = iqp.description;
  }
}

/*******************************************************************************
IDLE TIMER SUBSYSTEM
*******************************************************************************/

class IdleTimer {
  constructor(timeout, onTimeOutFn){
    this.t = undefined;
    document.onload = this.resetTimer.bind(this);
    document.onmousemove = this.resetTimer.bind(this);
    document.onmousedown = this.resetTimer.bind(this); // touchscreen presses
    document.ontouchstart = this.resetTimer.bind(this);
    document.onclick = this.resetTimer.bind(this);     // touchpad clicks
    document.onscroll = this.resetTimer.bind(this);    // scrolling with arrow keys
    document.onkeypress = this.resetTimer.bind(this);
    this.resetTimer();
    this.timeout = timeout;
    this.onTimeOutFn = onTimeOutFn;
  }

    resetTimer() {
        clearTimeout(this.t);
        this.t = setTimeout(this.onTimeOutFn, this.timeout);
    }
  }

/*******************************************************************************
LIST DISPLAY SUBSYSTEM
*******************************************************************************/

class IQPList {
  constructor(element){
    this.element = element
    this.clear();
    EventBus.subscribe('iqp-added', function(iqp){
      var li = document.createElement('li');
      li.classList.add('mdl-list__item', 'mdl-js-ripple-effect', 'mdl-list__item--three-line')
      li.addEventListener("click", function(){
        EventBus.publish('iqp', iqp);
      });
      var ripple = document.createElement('span');
      ripple.classList.add('mdl-ripple');
      var listContent = document.createElement('span');
      listContent.classList.add('mdl-list__item-primary-content');
      var projectName = document.createElement('span');
      projectName.innerText = iqp.project;
      var locationName = document.createElement('span');
      locationName.classList.add("mdl-list__item-text-body")
      locationName.innerText = iqp.location.name;

      listContent.appendChild(projectName);
      listContent.appendChild(locationName);
      li.appendChild(ripple);
      li.appendChild(listContent);
      this.element.appendChild(li);
    }.bind(this));

    EventBus.subscribe("kiosk", function(isKiosk){}.bind(this));
  }

  clear(){
    this.element.innerHTML = "";
  }
}

/*******************************************************************************
LOADER SUBSYSTEM
*******************************************************************************/
class IQPLoader {
  constructor(iqpFile){
    this.iqps = [];
    Papa.parse(iqpFile, {
	       download: true,
         header: true,
         dynamicTyping: true,
         quotes: true,
         quoteChar: "'",
         delimeter: ',',
        	complete: function(results) {
        		for (var i = 0; i < results.data.length; i++) {
        		  var iqpInfo = results.data[i];
              var iqp = {
                location: {
                  name: iqpInfo.place,
                  latitude: iqpInfo.latitude,
                  longitude: iqpInfo.longitude
                },
                id: i
              };
              this.iqps.push(iqp);
              EventBus.publish("iqp-added", iqp);
        		}
        	}.bind(this)
    });
  }
}
