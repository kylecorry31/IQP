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
}];

var Globe = function(containerID, center, zoom) {

  var options = {
    atmosphere: true,
    center: center,
    zoom: zoom
  };

  var markers = {};

  var earth = new WE.map(containerID, options);
  // Several different tile servers, maybe find a better one

  WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
    minZoom: 0,
    maxZoom: 6,
    attribution: 'NASA'
  }).addTo(earth);
  // WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  //       attribution: '© OpenStreetMap contributors'
  //     }).addTo(earth);
  // WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
  //       tileSize: 256,
  //       // bounds: [[-85, -180], [85, 180]],
  //       // minZoom: 0,
  //       // maxZoom: 16,
  //       attribution: 'WebGLEarth example',
  //       tms: true
  //     }).addTo(earth);
  var container = document.getElementById(containerID);

  EventBus.subscribe("globe-visible", function(visible) {
    if (visible) {
      container.classList.remove("hidden");
    } else {
      container.classList.add("hidden");
    }
  });

  this.addPoint = function(id, location, html) {
    var marker = WE.marker(location).addTo(earth);
    marker.bindPopup(html, {
      maxWidth: 150,
      closeButton: true
    });
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

  var details = new DetailsPanel(document.getElementById("iqp-details"));

  document.getElementById("globeToggle").checked = true;
  document.getElementById("kioskToggle").checked = false;

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

  EventBus.publish("kiosk", false);

  showIQPList(iqps);

});

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
    this.globe = new Globe(elementID, [42, -71], 4);
    EventBus.subscribe("iqp-added", function(iqp) {
      this.globe.addPoint(iqp.id, [iqp.location.latitude, iqp.location.longitude], "<b>" + iqp.project + "</b><br>" + iqp.location.name);
    }.bind(this));

    EventBus.subscribe("iqp", function(iqp) {
      this.globe.goTo(iqp.location);
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
