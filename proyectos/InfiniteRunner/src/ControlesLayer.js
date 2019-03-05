var ControlesLayer = cc.Layer.extend({
    spriteBotonSaltar:null,
    spriteBotonDisparar:null,
    spriteBotonTurbo:null,
    etiquetaMonedas:null,
        monedas:0,
    etiquetaVidas:null,
    vidas:3,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Contador Monedas
            this.etiquetaMonedas = new cc.LabelTTF("Monedas: 0", "Helvetica", 20);
            this.etiquetaMonedas.setPosition(cc.p(size.width - 90, size.height - 20));
            this.etiquetaMonedas.fillStyle = new cc.Color(0, 0, 0, 0);
            this.addChild(this.etiquetaMonedas);

            // Contador vidas
                this.etiquetaVidas = new cc.LabelTTF("Vidas: 3", "Helvetica", 20);
                this.etiquetaVidas.setPosition(cc.p(size.width*0.1, size.height - 20));
                this.etiquetaVidas.fillStyle = new cc.Color(0, 0, 0, 0);
                this.addChild(this.etiquetaVidas);


        // BotonSaltar
        this.spriteBotonSaltar = cc.Sprite.create(res.boton_saltar_png);
        this.spriteBotonSaltar.setPosition(
            cc.p(size.width*0.8, size.height*0.5));

        this.addChild(this.spriteBotonSaltar);
        // BotonDisparar
                this.spriteBotonDisparar = cc.Sprite.create(res.boton_disparar_png);
                this.spriteBotonDisparar.setPosition(
                    cc.p(size.width*0.8, size.height*0.8));

                this.addChild(this.spriteBotonDisparar);
        // BotonTurbo
                        this.spriteBotonTurbo = cc.Sprite.create(res.boton_turbo_png);
                        this.spriteBotonTurbo.setPosition(
                            cc.p(size.width*0.8, size.height*0.3));

                        this.addChild(this.spriteBotonTurbo);


        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown.bind(this)
        }, this)

        this.scheduleUpdate();
        return true;
    },
    update:function (dt) {

    },
    procesarMouseDown:function(event) {
        var areaBoton = this.spriteBotonSaltar.getBoundingBox();

        // La pulsación cae dentro del botón
        if (cc.rectContainsPoint(areaBoton,
            cc.p(event.getLocationX(), event.getLocationY()) )){

            // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
                    var gameLayer = this.getParent().getChildByTag(idCapaJuego);
                    // tenemos el objeto GameLayer
                    gameLayer.jugador.saltar();


        }

        var areaBoton = this.spriteBotonDisparar.getBoundingBox();

                // La pulsación cae dentro del botón
                if (cc.rectContainsPoint(areaBoton,
                    cc.p(event.getLocationX(), event.getLocationY()) )){

                    // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
                            var gameLayer = this.getParent().getChildByTag(idCapaJuego);
                            // tenemos el objeto GameLayer
                            gameLayer.jugador.disparar();


                }
                var areaBoton = this.spriteBotonTurbo.getBoundingBox();

                                // La pulsación cae dentro del botón
                                if (cc.rectContainsPoint(areaBoton,
                                    cc.p(event.getLocationX(), event.getLocationY()) )){

                                    // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
                                            var gameLayer = this.getParent().getChildByTag(idCapaJuego);
                                            // tenemos el objeto GameLayer
                                            gameLayer.jugador.turbo();


                                }
    },
      agregarMoneda:function(){
          this.monedas++;
          this.etiquetaMonedas.setString("Monedas: " + this.monedas);
      },
       reducirVida:function(){
           this.vidas--;
           this.etiquetaVidas.setString("Vidas: " + this.vidas);
           if(this.vidas<=0){
                this.vidas=3;
                this.etiquetaVidas.setString("Vidas: " + this.vidas);
                this.getParent().getChildByTag(idCapaJuego).reiniciarPartida();
            }
       }


});
