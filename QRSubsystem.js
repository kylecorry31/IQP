var QRCodeManager = function(domElement, text = "", size = 200){
	this.qr = new QRCode(domElement, {
          text: text,
          width: size,
          height: size,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
    });

    this.setText = function(text){
    	this.qr.clear();
    	this.qr.makeCode(text);
    };

    EventBus.subscribe("qr-code", this.setText.bind(this));
    EventBus.subscribe("qr-code-visible", function(visible){
      if(visible){
        domElement.classList.remove("hidden");
      } else {
        domElement.classList.add("hidden");
      }
    });
};