var iqps = [{
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
  url: "https://www.wpi.edu",
  id: 0
}, {
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
  url: "https://kylecorry31.github.io",
  id: 1
}, {
  project: "Project",
  location: {
    name: "Acadia, ME, USA",
    latitude: 44.3386,
    longitude: -68.2733
  },
  authors: ["Kyle Corry"],
  advisors: ["Nobody"],
  type: "IQP",
  year: "2017 - 2018",
  description: "Description",
  url: "https://www.nps.gov/acad/index.htm",
  id: 2
}, {
  project: "Ice Project",
  location: {
    name: "Antarctica",
    latitude: -82.8628,
    longitude: 135
  },
  authors: ["Kyle Corry"],
  advisors: ["Nobody"],
  type: "IQP",
  year: "2017 - 2018",
  description: "Description",
  url: "https://en.wikipedia.org/wiki/Antarctica",
  id: 3
}, {
  project: "Amazon Search",
  location: {
    name: "Amazon River, Brazil",
    latitude: -2.163106,
    longitude: -55.126648
  },
  authors: ["Kyle Corry"],
  advisors: ["Nobody"],
  type: "IQP",
  year: "2017 - 2018",
  description: "Description",
  url: "https://en.wikipedia.org/wiki/Amazon_River",
  id: 4
}];

var GLOBE_TYPES = Object.freeze(
  {
    NASA: 1,
    GLOBE: 2,
    WATER_COLOR: 3,
    TERRAIN: 4,
    OSM: 5,
    NATURAL: 6
  });

var Globe = function(containerID, center, zoom, globe_type = GLOBE_TYPES.NASA) {

  var options = {
    atmosphere: true,
    center: center,
    zoom: zoom
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
      WE.tileLayer('http://tileserver.maptiler.com/cassini-terrestrial/{z}/{x}/{y}.jpg', {
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
      WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '© OpenStreetMap contributors'
      }).addTo(earth);
      break;
    case GLOBE_TYPES.NATURAL:
      WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
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

  EventBus.subscribe("globe-center", this.goTo.bind(this));
};

document.addEventListener("DOMContentLoaded", function() {
  var globe = new IQPGlobe("viewDiv");

  iqps.forEach(function(iqp) {
    EventBus.publish("iqp-added", iqp);
  });

  var idleTimer = new IdleTimer(1000 * 60, goHome);

  var details = new DetailsPanel(document.getElementById("iqp-details"));

  document.getElementById("globeToggle").checked = true;

  EventBus.subscribe("kiosk", function(isKiosk) {
    var iqpURL = document.getElementById("iqp-url");
    if (isKiosk) {
      EventBus.publish("qr-code-visible", true);
      iqpURL.classList.add("hidden");
    } else {
      EventBus.publish("qr-code-visible", false);
      iqpURL.classList.remove("hidden");
    }
  });

  var url = window.location.search.substr(1);

  if (url.indexOf("kiosk") !== -1) {
      EventBus.publish("kiosk", true);
  } else {
    EventBus.publish("kiosk", false);
  }

  showIQPList(iqps);

});

function goHome(){
  location.reload();
}

function showIQPList(iqps) {
  var iqpList = document.getElementById("iqp-list");
  var iqpString = "";
  var count = 0;
  iqps.forEach(function(iqp) { // TODO: Make actual elements
    var li = '<li class="mdl-list__item mdl-js-ripple-effect mdl-list__item--three-line" onclick="EventBus.publish(\'iqp\', iqps[' + count + ']);">\
          <span class="mdl-ripple"></span>\
          <span class="mdl-list__item-primary-content">\
            <span>' + iqp.project + '</span>\
          <span class="mdl-list__item-text-body">' +
      iqp.location.name +
      '</span>\
          </span>\
        </li>';
    iqpString += li;
    count++;
  });

  iqpList.innerHTML = iqpString;
}

function kioskStateChanged() {
  var sw = document.getElementById("kioskToggle");
  EventBus.publish("kiosk", sw.checked);
}

function displayGlobeStateChanged() {
  var sw = document.getElementById("globeToggle");
  EventBus.publish("globe-visible", sw.checked);
}

class IQPGlobe {
  constructor(elementID) {
    this.selectedIQP = null;
    this.globe = new Globe(elementID, [42, -71], 4, GLOBE_TYPES.NATURAL);
    EventBus.subscribe("iqp-added", function(iqp) {
      this.globe.addPoint(iqp.id, [iqp.location.latitude, iqp.location.longitude], function(){
        EventBus.publish("iqp", iqp);
      }, 'iqp-marker.png');
    }.bind(this));

    EventBus.subscribe("iqp", function(iqp) {
      this.globe.removePoint(-1);
      this.globe.goTo(iqp.location);
      this.globe.addPoint(-1, [iqp.location.latitude, iqp.location.longitude], undefined, 'iqp-marker-selected.png');
    }.bind(this));
  }
}

class DetailsPanel {
  constructor(element) {
    this.element = element;
    EventBus.subscribe("iqp", this.showIQP.bind(this));
    this.qrcode = new QRCodeManager(document.getElementById("detail-qrcode"), "");
  }

  showIQP(iqp) {
    EventBus.publish("qr-code", iqp.url);
    document.getElementById("iqp-url").innerHTML = iqp.url;
    document.getElementById("iqp-details").classList.remove("hidden");
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

}

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
