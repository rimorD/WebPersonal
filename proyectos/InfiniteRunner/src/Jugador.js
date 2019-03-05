var estadoCaminando = 1;
var estadoSaltando = 2;
var estadoImpactado = 3;
var Jugador = cc.Class.extend({
    estado: estadoCaminando,
    animacion:null,
    aSaltar:null,
    aCaminar:null,
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
    tiempoInvulnerable:0,
    tiempoDisparo:0,
    cadenciaDisparo:50,
    turbos:3,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#jugador_caminar1.png");
    // Cuerpo dinámico, SI le afectan las fuerzas
    this.body = new cp.Body(5, cp.momentForBox(1,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height));
    this.body.setPos(posicion);
    //body.w_limit = 0.02;
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);

    // forma 16px más pequeña que la imagen original
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);
    this.shape.setCollisionType(tipoJugador);
    // forma dinamica
    gameLayer.space.addShape(this.shape);
    // añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);


    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 4; i++) {
        var str = "jugador_caminar" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));

        this.aCaminar = actionAnimacionBucle;
        this.aCaminar.retain();

    var framesAnimacionSaltar = [];
        for (var i = 1; i <= 4; i++) {
            var str = "jugador_saltar" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionSaltar.push(frame);
        }
     var animacionSaltar = new cc.Animation(framesAnimacionSaltar, 0.2);
     this.aSaltar  =
            new cc.RepeatForever(new cc.Animate(animacionSaltar));

     this.aSaltar.retain();
     var framesAnimacionImpactado = [];
     for (var i = 1; i <= 4; i++) {
         var str = "jugador_impactado" + i + ".png";
         var frame = cc.spriteFrameCache.getSpriteFrame(str);
         framesAnimacionImpactado.push(frame);
     }
      var animacionImpactado = new cc.Animation(framesAnimacionImpactado, 0.2);
      this.aImpactado =
         new cc.Repeat( new cc.Animate(animacionImpactado) , 2  );
      this.aImpactado.retain();



    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);

    // Impulso inicial
    this.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));

},
saltar: function(){
      // solo salta si está caminando
       if(this.estado == estadoCaminando){
           this.estado = estadoSaltando;
           this.body.applyImpulse(cp.v(0, 1800), cp.v(0, 0));
       }
},
turbo: function(){
        if(this.turbos>0){
           this.body.applyImpulse(cp.v(4000, 0), cp.v(0, 0));
           this.turbos--;
           }
},

 disparar: function(){
        if(this.tiempoDisparo<=0){
            this.tiempoDisparo=this.cadenciaDisparo;
            this.gameLayer.añadirDisparo();
        }
 },
actualizar: function (){
    switch ( this.estado ){
        case estadoImpactado:
                if (this.animacion != this.aImpactado){
                    this.animacion = this.aImpactado;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(
                        cc.sequence(
                            this.animacion,
                            cc.callFunc(this.finAnimacionImpactado(), this) )
                    );
                }
        break;

        case estadoSaltando:
            if (this.animacion != this.aSaltar){
                this.animacion = this.aSaltar;
                this.sprite.stopAllActions();
                this.sprite.runAction(this.animacion);
            }
        break;
        case estadoCaminando:
            if (this.animacion != this.aCaminar){
                this.animacion = this.aCaminar;
                this.sprite.stopAllActions();
                this.sprite.runAction(this.animacion);
            }
        break;
    }
    if(this.tiempoInvulnerable>0)
        this.tiempoInvulnerable--;
    if(this.tiempoDisparo>0)
        this.tiempoDisparo--;
},
 tocaSuelo: function(){
      if(this.estado != estadoCaminando){
          this.estado = estadoCaminando;
      }
 },
  impactado: function(){
  if(this.tiempoInvulnerable<=0){
       if(this.estado != estadoImpactado){
           this.estado = estadoImpactado;
       }
       this.tiempoInvulnerable=150;
       this.gameLayer.reducirVida();
    }
  }
  ,
  finAnimacionImpactado: function(){
       if(this.estado == estadoImpactado){
           this.estado = estadoCaminando;
       }
  }




});
