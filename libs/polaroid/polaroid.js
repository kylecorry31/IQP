class PolaroidPhoto extends HTMLElement {
  constructor(){
    super();
    this._shadow = this.attachShadow({"mode": "open"});
  }


  connectedCallback(){
    this._shadow.innerHTML = `
    <style>
    @import url('libs/polaroid/polaroid.css');
    </style>

    <div class="polaroid">
      <div class="polaroid-image" style="background-image: url(${this.getAttribute('src') || ''});"></div>
    </div>
    `;
  }

}

customElements.define('polaroid-photo', PolaroidPhoto);
