var Moneda = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite
    this.sprite = new cc.PhysicsSprite("#moneda1.png");
    // Cuerpo estatico, no le afectan las fuerzas, gravedad, etc.
    var body = new cp.StaticBody();
    body.setPos(posicion);
    this.sprite.setBody(body);
    // Los cuerpos estáticos nunca se añaden al Space

    // Crear forma circular
    var radio = this.sprite.getContentSize().width / 2;
    this.shape = new cp.CircleShape(body, radio , cp.vzero);
    this.shape.setCollisionType(tipoMoneda);
    // Nunca setSensor(true) no genera choques es como un “fantasma”
    this.shape.setSensor(true);
    // Añadir forma estática al Space
    gameLayer.space.addStaticShape(this.shape);
    // Añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);


    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 6; i++) {
        var str = "moneda" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));
    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);
},
 eliminar: function (){
     // quita la forma
     this.gameLayer.space.removeShape(this.shape);

     // quita el cuerpo *opcional, funciona igual
     // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
     // this.gameLayer.space.removeBody(shape.getBody());

     // quita el sprite
     this.gameLayer.removeChild(this.sprite);
 }



});
