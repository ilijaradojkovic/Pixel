window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = x;
      this.y = y;
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap;
      this.velocityX = 0;
      this.velocityY = 0;
      this.ease = 0.02;
      this.dx=0;
      this.dy=0;
      this.distance=0;
      this.force=0;
      this.angle=0;
      this.friction=0.95;
    }
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {

        this.dx=this.effect.mouse.x-this.x;
        this.dy=this.effect.mouse.y-this.y;
        //sqry je skupa operacija pa cemo da je izbacimo
        //ostavicemo ovako pa cemo da radius promenimo da bi ovo bilo dobro
        this.distance=this.dx*this.dx+this.dy*this.dy;
       //stavili smo - da bi se odbila particle
        this.force= -this.effect.mouse.radius / this.distance;

        if(this.distance<this.effect.mouse.radius){
            // atan2(y,x)
             this.angle=Math.atan2(this.dy,this.dx);

             //pomeraj particle
             this.velocityX+=this.force * Math.cos(this.angle);
             this.velocityY+=this.force * Math.sin(this.angle);

        }

      this.x += (this.velocityX*=this.friction)+(this.originX - this.x) * this.ease;
      this.y += (this.velocityY*=this.friction)+(this.originY - this.y) * this.ease;


    }
    warp() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.image = document.getElementById("image1");
      this.centerX = this.width / 2 - this.image.width / 2;
      this.centerY = this.height / 2 - this.image.height / 2;
      //gap je 5 jer imamo r g b a
      //gap je sto je manji broj to je slika boljeg kvaliteta,
      //tj partices su bolje rasporedjene
      this.gap = 2;
      this.mouse={
        radius: 3000,
        x: undefined,
        y: undefined
      }
      window.addEventListener('mousemove',(event)=>{
            this.mouse.x=event.x;
            this.mouse.y=event.y;
      });
    }
    init(context) {
      context.drawImage(this.image, this.centerX, this.centerY);
      //Analizra sliku i vraca pixel data
      //Nama ovo vraca sve piksele na ekranu i mi vidimo koji
      //su obojeni i onda ce ti biti pikseli (particle) za sliku
      const pixels = context.getImageData(0, 0, this.width, this.height).data;

      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          //* 4 jer imamo r g b a
          const index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const color = `rgb(${red},${green},${blue},${alpha})`;

          //ako imamo alpha da nije 0 tj da nije providno,znaci sika je tu,dodaj particle
          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }

    draw(context) {
      this.particlesArray.forEach((particle) => {
        particle.draw(context);
      });
    }

    update() {
      this.particlesArray.forEach((particle) => {
        particle.update();
      });
    }
    warp() {
      this.particlesArray.forEach((particle) => {
        particle.warp();
      });
    }
  }

  const effect = new Effect(canvas.width, canvas.height);
  effect.init(ctx);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    window.requestAnimationFrame(animate);
  }
  animate();

  //warp button
  const warpButton = this.document.getElementById("warpButton");
  warpButton.addEventListener("click", function () {

    effect.warp();
  });

  //Nacrtaj pravougaonik
  //ctx.fillReact(x,y,width,height)
  // ctx.fillRect(120,150,100,200);
  // //Nacrtaj sliku na ekranu drawImage(slika,x,y)
  // ctx.drawImage(image,0,0);
});


// //OVDE VIDI THIS
// window.addEventListener('mousemove',()=>{
        
// });
// //OVDE NE VIDI THIS
// window.addEventListener('mousemove',function(){
//         this.
// });