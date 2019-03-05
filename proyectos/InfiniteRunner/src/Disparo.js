var Disparo = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite
    this.sprite = new cc.PhysicsSprite("#disparo1.png");
    this.body = new cp.Body(5,Infinity);
    this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

    // Crear forma circular
    var radio = this.sprite.getContentSize().width / 2;
    this.shape = new cp.CircleShape(body, radio , cp.vzero);
    this.shape.setCollisionType(tipoDisparo);
    // Nunca setSensor(true) no genera choques es como un “fantasma”
    this.shape.setSensor(true);
    // Añadir forma estática al Space
    gameLayer.space.addShape(this.shape);
    // Añadir sprite a la capa
    gameLayer.addChild(this.sprite,10);

},
  actualizar: function(){

      if ( this.body.vx < 0.005 && this.body.vx > -0.005){
          this.eliminar();
      }
          if (this.body.vx < 100){
              this.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
          } else { // vx mayor más de 100
              this.body.vx = 100;
          }
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
