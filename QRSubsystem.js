var QRCodeManager = function(domElement, text = "", size = 250){
	this.qr = new QRCode(domElement, {
          text: text,
          width: size,
          height: size,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
    });

    this.setText = function(text){
    	if(!text){
    		domElement.style.visibility = "hidden";
    	} else {
    		domElement.style.visibility = "visible";
    	}
    	this.qr.clear();
    	this.qr.makeCode(text);
    };

    EventBus.subscribe("qr-code", this.setText.bind(this));
};