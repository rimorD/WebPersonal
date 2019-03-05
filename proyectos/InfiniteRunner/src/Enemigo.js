var Enemigo = cc.Class.extend({
orientacion:1,
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#cuervo1.png");
    // Cuerpo estática , no le afectan las fuerzas
    // Cuerpo dinámico, SI le afectan las fuerzas
    this.body = new cp.Body(5,Infinity);


    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);

    this.shape.setCollisionType(tipoEnemigo);

    // agregar forma dinamica
    gameLayer.space.addShape(this.shape);
    var mitadAncho = this.sprite.getContentSize().width/2;
    var mitadAlto = this.sprite.getContentSize().height/2;
    // más pequeño

    this.shapeIzquierda = new cp.PolyShape(this.body,
        [ -mitadAncho, 0, -mitadAncho, -mitadAlto - 10] ,
        cp.v(0,0) );

    this.shapeIzquierda.setSensor(true);
    this.shapeIzquierda.setCollisionType(tipoEnemigoIzquierda);
    // agregar forma dinamica
    gameLayer.space.addShape(this.shapeIzquierda);

    this.shapeDercha = new cp.PolyShape(this.body,
        [ mitadAncho, 0, mitadAncho, -mitadAlto - 10] ,
        cp.v(0,0) );

    this.shapeDercha.setSensor(true);
    this.shapeDercha.setCollisionType(tipoEnemigoDerecha);
    // agregar forma dinamica
    gameLayer.space.addShape(this.shapeDercha);

    // añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);

    // Crear animaciones
    var framesAnimacion = [];
    for (var i = 1; i <= 8; i++) {
        var str = "cuervo" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);
    gameLayer.space.addCollisionHandler(tipoSuelo, tipoEnemigoIzquierda,
              null, null, null, this.noSueloIzquierda.bind(this));

        gameLayer.space.addCollisionHandler(tipoSuelo, tipoEnemigoDerecha,
              null, null, null, this.noSueloDerecha.bind(this));

},
 actualizar: function(){

     if ( this.body.vx < 0.005 && this.body.vx > -0.005){
         this.orientacion = this.orientacion *-1;
     }

     if ( this.orientacion > 0){
         this.sprite.flippedX = true; // Invertir Sprite
         if (this.body.vx < 100){
             this.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
         } else { // vx mayor más de 100
             this.body.vx = 100;
         }
     }

     if ( this.orientacion < 0) {
         this.sprite.flippedX = false; // No invertir Sprite
         if (this.body.vx > -100){
             this.body.applyImpulse(cp.v(-300, 0), cp.v(0, 0));
         } else { // vx nunca menor que -100
             this.body.vx = -100; //limitado
         }
     }
 },
noSueloDerecha : function(){
    this.orientacion = -1;
},
noSueloIzquierda: function(){
    this.orientacion = 1;
},
eliminar: function (){
       // quita la forma
       this.gameLayer.space.removeShape(this.shape);

       // quita el cuerpo *opcional, funciona igual
       this.gameLayer.space.removeBody(shape.getBody());

       // quita el sprite
       this.gameLayer.removeChild(this.sprite);
   }


});
