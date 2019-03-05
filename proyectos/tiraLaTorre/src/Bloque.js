var Bloque = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function(gameLayer,posicion){
    this.gameLayer=gameLayer;
        // Masa 1
        this.sprite = new cc.PhysicsSprite("#cocodrilo1.png");
        var body = new cp.Body(1, cp.momentForBox(1, this.sprite.width, this.sprite.height));

        body.setPos(posicion);
        this.sprite.setBody(body);
        // Este si hay que añadirlo
        this.gameLayer.space.addBody(body);

        this.shape = new cp.BoxShape(body, this.sprite.width, this.sprite.height);
        this.shape.setFriction(1);
        this.shape.setCollisionType(tipoBloque);
        this.gameLayer.space.addShape(this.shape);
        this.gameLayer.addChild(this.sprite,10);

    },
    eliminar: function (){
         // quita la forma
         this.gameLayer.space.removeShape(this.shape);

         // quita el cuerpo *opcional, funciona igual
         this.gameLayer.space.removeBody(this.shape.getBody());

         // quita el sprite
         this.gameLayer.removeChild(this.sprite);
     }
})