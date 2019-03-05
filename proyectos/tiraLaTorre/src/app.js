var tipoMuro = 2;
var tipoBloque = 3;
var tipoObjetivo = 4;
var tipoPelota = 5;

var GameLayer = cc.Layer.extend({
    mundoActivo: false,
    tiempoTiro: 0,
    intentos: 3,
    arrayBloques:[],
    spriteFondo: null,
    space: null,
    spritePelota:null,
    shapePelota:null,
    formasEliminar: [],
    intentos:2,
    objetivoEliminado:false,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Inicializar Space
            this.space = new cp.Space();
            this.space.gravity = cp.v(0, -350);

            this.depuracion = new cc.PhysicsDebugNode(this.space);
            this.addChild(this.depuracion, 10);

            // Muros
            var muroIzquierdaShape = new cp.SegmentShape(this.space.staticBody,
                cp.v(0, 0),// Punto de Inicio
                cp.v(0, size.height),// Punto final
                10);// Ancho del muro
            this.space.addStaticShape(muroIzquierdaShape);

            var muroArribaShape = new cp.SegmentShape(this.space.staticBody,
                cp.v(0, size.height),// Punto de Inicio
                cp.v(size.width, size.height),// Punto final
                10);// Ancho del muro
            this.space.addStaticShape(muroArribaShape);

            var muroDerechaShape = new cp.SegmentShape(this.space.staticBody,
                cp.v(size.width, 0),// Punto de Inicio
                cp.v(size.width, size.height),// Punto final
                10);// Ancho del muro
            this.space.addStaticShape(muroDerechaShape);

            var muroAbajoShape = new cp.SegmentShape(this.space.staticBody,
                cp.v(0, 0),// Punto de Inicio
                cp.v(size.width, 0),// Punto final
                10);// Ancho del muro
            muroAbajoShape.setFriction(1);
            muroAbajoShape.setCollisionType(tipoMuro);
            this.space.addStaticShape(muroAbajoShape);

        // muro y bloque
        this.space.addCollisionHandler(tipoMuro, tipoBloque, null, null, this.collisionBloqueConMuro.bind(this), null);

        // muro y objetivo
        this.space.addCollisionHandler(tipoMuro, tipoObjetivo, null, null, this.collisionObjetivoConMuro.bind(this), null);

        // pelota y bloque
        this.space.addCollisionHandler(tipoPelota, tipoBloque, null, null, this.collisionPelotaConBloque.bind(this), null);

        // pelota y objetivo
        this.space.addCollisionHandler(tipoPelota, tipoObjetivo, null, null, this.collisionPelotaConObjetivo.bind(this), null);

        // bloque con bloque
        this.space.addCollisionHandler(tipoBloque, tipoBloque, null, null, this.collisionBloqueConBloque.bind(this), null);
        // bloque con objetivo
        this.space.addCollisionHandler(tipoBloque, tipoObjetivo, null, null, this.collisionBloqueConObjetivo.bind(this), null);


        // Fondo
        this.spriteFondo = cc.Sprite.create(res.fondo_png);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        // cache
        cc.spriteFrameCache.addSpriteFrames(res.animacion_bola_plist);
        cc.spriteFrameCache.addSpriteFrames(res.barra_3_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacioncocodrilo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacionpanda_plist);


        this.spritePelota = new cc.PhysicsSprite("#animacion_bola1.png");

        var body = new cp.Body(1, cp.momentForCircle(1, 0, this.spritePelota.width/2, cp.vzero));
        body.p = cc.p(size.width*0.1 , size.height*0.5);
        this.spritePelota.setBody(body);
        this.space.addBody(body);
        this.shapePelota = new cp.CircleShape(body, this.spritePelota.width/2, cp.vzero);
        this.shapePelota.setCollisionType(tipoPelota);
        this.space.addShape(this.shapePelota);
        this.addChild(this.spritePelota);

        // Evento Touch
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.procesarTouch.bind(this)
        }, this);

        // Evento MOUSE
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown.bind(this)
        }, this);

        this.inicializarPlataformas();
        this.inicializarBloques();

        this.scheduleUpdate();
        return true;

    },procesarMouseDown:function(event) {

     },update:function (dt) {
         if ( this.tiempoTiro != 0){
             this.tiempoTiro++;
         }

        if(this.mundoActivo){
            this.space.step(dt);
        }
        for(var i = 0; i < this.formasEliminar.length; i++) {
                var shape = this.formasEliminar[i];

                for (var j = 0; j < this.arrayBloques.length; j++) {
                  if (this.arrayBloques[j] != null &&
                    this.arrayBloques[j].shape == shape) {

                      this.arrayBloques[j].eliminar();
                      // Borrar tambien de ArrayBloques
                      this.arrayBloques.splice(j, 1);

                  }
                }
            }
            this.formasEliminar = [];
            if( this.arrayBloques.length == 0 || this.objetivoEliminado){
                    // Ganaste no quedan bloques
                    cc.director.pause();
                    cc.audioEngine.stopMusic();
                    this.getParent().addChild(new GameOverLayer());

                } else {
                   // ¿Has perdido, o aun no has tirado?
                       var todosQuietos = true;
                       for(var i = 0; i < this.arrayBloques.length; i++) {
                           var velocidadBloque = this.arrayBloques[i].sprite.body.getVel();
                           if( velocidadBloque.x < -15|| velocidadBloque.x > 15 ){
                               // Este se mueve
                               todosQuietos = false;
                               console.log("i :"+i+" : "+velocidadBloque.x);
                           }
                       }

                       if ( this.tiempoTiro > 60*10 && todosQuietos && this.intentos<=0){
                           cc.director.pause();
                           cc.audioEngine.stopMusic();
                           this.getParent().addChild(new GameOverLayer());
                       }
                       else if(this.intentos>0 && this.tiempoTiro > 60*10 && todosQuietos){
                            this.tiempoTiro=0;
                            this.intentos--;
                            this.mundoActivo=false;
                            this.space.removeShape(this.shapePelota);
                            this.space.removeBody(this.spritePelota.getBody());
                            this.removeChild(this.spritePelota);
                            this.spritePelota = new cc.PhysicsSprite("#animacion_bola1.png");
                            var size =cc.winSize;
                                    var body = new cp.Body(1, cp.momentForCircle(1, 0, this.spritePelota.width/2, cp.vzero));
                                    body.p = cc.p(size.width*0.1 , size.height*0.5);
                                    this.spritePelota.setBody(body);
                                    this.space.addBody(body);

                                    this.shapePelota = new cp.CircleShape(body, this.spritePelota.width/2, cp.vzero);
                                    this.shapePelota.setCollisionType(tipoPelota);
                                    this.space.addShape(this.shapePelota);
                                    this.addChild(this.spritePelota);
                       }


                }

     },
     procesarMouseDown:function(event) {

              this.mundoActivo = true;
              if (this.tiempoTiro == 0){
                    this.tiempoTiro = 1;
                    var body = this.spritePelota.body;
                    body.applyImpulse(cp.v( event.getLocationX() - body.p.x, event.getLocationY() - body.p.y), cp.v(0,0));
              }

     },
     inicializarPlataformas:function () {

        var spritePlataforma = new cc.PhysicsSprite("#barra_3.png");

        var body = new cp.StaticBody();
        body.p = cc.p(cc.winSize.width*0.7 , cc.winSize.height*0.4);
        spritePlataforma.setBody(body);
        // Los cuerpos estáticos no se añaden al espacio
        //this.space.addBody(body);

        var shape = new cp.BoxShape(body, spritePlataforma.width, spritePlataforma.height);
        shape.setFriction(1);
        // addStaticShape en lugar de addShape
        this.space.addStaticShape(shape);

        this.addChild(spritePlataforma);

     },
     inicializarBloques:function () {
     var altoTorre = 0;
     var objetivoCreado = false;

           while(altoTorre < 4){

            if(Math.random()>0.7 || objetivoCreado)
                var spriteBloque = new Bloque(this,cc.p(cc.winSize.width*0.7 , cc.winSize.height*0.4 + 10 + 20 + 40*altoTorre));
            else{
                var spriteBloque = new BloqueObjetivo(this,cc.p(cc.winSize.width*0.7 , cc.winSize.height*0.4 + 10 + 20 + 40*altoTorre));
                objetivoCreado=true;
                }

            // agregar el Sprite al array Bloques
            this.arrayBloques.push(spriteBloque);
            altoTorre++;
            if(altoTorre>=4 && !objetivoCreado){
                altoTorre=0;
                this.arrayBloques=[];
            }

         }

      },
      collisionBloqueConMuro:function (arbiter, space) {
                 var shapes = arbiter.getShapes();
                 // shapes[0] es el muro
                 this.formasEliminar.push(shapes[1]);
      },
        collisionObjetivoConMuro:function (arbiter, space) {
                   var shapes = arbiter.getShapes();
                   // shapes[0] es el muro
                   this.formasEliminar.push(shapes[1]);
                   this.objetivoEliminado=true;
        },
       collisionPelotaConBloque:function (arbiter, space) {
                var velocidad = this.spritePelota.body.getVel();
                if( velocidad.x < -120|| velocidad.x > 120 ){
                  var shapes = arbiter.getShapes();
                  // shapes[0] es la pelota
                  this.formasEliminar.push(shapes[1]);
                 }
       },
         collisionPelotaConObjetivo:function (arbiter, space) {
         var velocidad = this.spritePelota.body.getVel();
                  if( velocidad.x < -120|| velocidad.x > 120 ){
                    var shapes = arbiter.getShapes();
                    // shapes[0] es la pelota
                    this.formasEliminar.push(shapes[1]);
                    this.objetivoEliminado=true;
                  }
         },
         collisionBloqueConBloque:function (arbiter, space) {
                                 var shapes = arbiter.getShapes();
                                 var velocidad = shapes[0].body.getVel();
                                 if( velocidad.x < -120|| velocidad.x > 120 ){
                                   this.formasEliminar.push(shapes[0]);
                                   this.formasEliminar.push(shapes[1]);
                                  }
        },
        collisionBloqueConObjetivo:function (arbiter, space) {
                                var shapes = arbiter.getShapes();
                                var velocidad = shapes[0].body.getVel();
                                if( velocidad.x < -120|| velocidad.x > 120 ){
                                  var shapes = arbiter.getShapes();
                                  this.formasEliminar.push(shapes[0]);
                                  this.formasEliminar.push(shapes[1]);
                                  this.objetivoEliminado=true;
                                 }
                       },
      procesarTouch:function(touch, event) {
           // touch.getLocationX()
           // touch.getLocationY()

           return true;
      }





});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

