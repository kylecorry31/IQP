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
    url: "https://www.wpi.edu"
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
    url: "https://kylecorry31.github.io"
}];

var Globe = function(containerID, center, zoom) {

    var options = {
        atmosphere: true,
        center: center,
        zoom: zoom
    };
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

    this.addPoint = function(location, html) {
      var marker = WE.marker(location).addTo(earth);
      marker.bindPopup(html, {
          maxWidth: 150,
          closeButton: true
      });
    }

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
    var globe = new Globe("viewDiv", [42, -71], 4);

    iqps.forEach(function(iqp){
      globe.addPoint([iqp.location.latitude, iqp.location.longitude], iqp.project);
    });

    var qrcode = new QRCodeManager(document.getElementById("detail-qrcode"), "http://www.wpi.edu");

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

    EventBus.subscribe("iqp-url", function(url) {
        EventBus.publish("qr-code", url);
        document.getElementById("iqp-url").innerHTML = url;
    });

    EventBus.subscribe("iqp", displayIQP);

    showIQPList(iqps);

});

function showIQPList(iqps) {
    var iqpList = document.getElementById("iqp-list");
    var iqpString = "";
    var count = 0;
    iqps.forEach(function(iqp) {
        var li = '<li class="mdl-list__item mdl-js-ripple-effect mdl-list__item--three-line" onclick="displayIQP(iqps[' + count + ']);">\
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

function displayIQP(iqp) {

    var coords = {
        latitude: iqp.location.latitude,
        longitude: iqp.location.longitude,
        zoom: 8
    };

    EventBus.publish("globe-center", coords);
    EventBus.publish("iqp-url", iqp.url);
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