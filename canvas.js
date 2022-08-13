import platformm from '../images/platform.png'
import hills from '../images/hills.png'
import backgound from '../images/background.png'
import platformSmallTall from '../images/platformSmallTall.png'
import spriteRunLeft from '../images/spriteRunLeft.png'
import spriteRunRight from '../images/spriteRunRight.png'
import spriteStandLeft from '../images/spriteStandLeft.png'
import spriteStandRight from '../images/spriteStandRight.png'


console.log(platformm)
const canvas = document.querySelector('canvas')

const c= canvas.getContext('2d')

console.log(c)
canvas.width = 1024
canvas.height = 576

 const gravity = 1.5

class Player {
   constructor(){
    this.speed = 10
     this.position = {
        x : 100,
        y : 100,
     }
     this.velocity = {
        x:0,
        y:0
     }
     this.width = 66
     this.height = 150
     this.image = createImage(spriteStandRight)
     this.frames = 0
     this.sprites ={
      stand: {
        left : createImage(spriteStandLeft),
        right : createImage(spriteStandRight),
        cropWidth : 177,
        width : 66
      },
      run:{
        left : createImage(spriteRunLeft),
        right : createImage(spriteRunRight),
        cropWidth :341,
        width:127.875
      }
     }

     this.currentsprite = this.sprites.stand.right
     this.currentcropwidth = 177
    }

    draw(){
       
      c.drawImage(
        this.currentsprite,
        this.currentcropwidth * this.frames
        ,0,
        this.currentcropwidth,400, this.position.x, this.position.y, this.width, this.height)

    }
    update() {
        this.frames++
        if(this.frames > 59 && (this.currentsprite === this.sprites.stand.right 
          || this.currentsprite === this.sprites.stand.left))
        {
          this.frames =0
        }
        else if(this.frames > 29 && (this.currentsprite === this.sprites.run.right  
          || this.currentsprite === this.sprites.run.left) )
        this.frames =0
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y <= canvas.height)
        {
            this.velocity.y += gravity    
        }
       
          
    }
}

class Platform{
    constructor({x,y,image}) {
      
        this.position = {
            x: x,
            y: y,
           
        }
        this.image = image
        this.width = image.width
        this.height = image.height
        
    }

    draw() {
       c.drawImage(this.image,this.position.x,this.position.y)
    }
}
class SecenaryGeneric{
  constructor({x,y,image}) {
      this.position = {
          x: x,
          y: y,
         
      }
      this.image = image
      this.width = image.width
      this.height = image.height
      
  }

  draw() {
     c.drawImage(this.image,this.position.x,this.position.y)
  }
}

function createImage(imageSrc ) {
  const image = new Image()
   image.src = imageSrc
   return image

}
let platformImage = createImage(platformm)
let platformSmallTallImage = createImage(platformSmallTall)
 let  player = new Player()
 let platforms = []
      let genricObjects = [ ]
      let currentKey
  const keys = {
    right: {
        pressed : false
    },
    left : {
        pressed : false
    }
}
let scrollOffset =0;



function init() {
platformImage = createImage(platformm)
player = new Player()
platforms = [
  new Platform({
    x:platformImage.width *4 + 300 -2 +platformImage.width - platformSmallTallImage.width
     ,y: 270,
     image: createImage(platformSmallTall)
    }),
  new Platform({
   x:-1,
   y:470,
   image: platformImage
}),
  new Platform({
    x:platformImage.width-3
     ,y:470,
     image:platformImage
    }),

    new Platform({
      x:platformImage.width *2 +100
       ,y:470,
       image:platformImage
      }),
      
      new Platform({
        x:platformImage.width *3 + 300
         ,y:470,
         image:platformImage
        }), new Platform({
          x:platformImage.width *4 + 300 -2
           ,y:470,
           image:platformImage
          }),
          new Platform({
            x:platformImage.width *5 + 700 -2
             ,y:470,
             image:platformImage
            })
         ]
  genricObjects = [ new SecenaryGeneric({
     x:-1,
      y:-1,
      image :createImage(backgound)
  }),
  new SecenaryGeneric({
    x:-1, 
    y:-1,
    image :createImage(hills)
  })]

 scrollOffset =0;
}





function animate() {
    requestAnimationFrame(animate) 
    c.fillStyle = 'white'
    c.fillRect(0,0,canvas.width,canvas.height)

    genricObjects.forEach((genricObjects) => {
      genricObjects.draw();
    })
     
     platforms.forEach((platform) => {
        platform.draw();
     })
     player.update();
    

     if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = player.speed
     }
     else if((keys.left.pressed && player.position.x > 100)
           || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0 )) {
        player.velocity.x= -player.speed
     }
     else{
        player.velocity.x = 0

        if(keys.right.pressed){
            scrollOffset +=player.speed;
            platforms.forEach(platform => {
                platform.position.x -= player.speed
             })
            genricObjects.forEach((genricObjects) => {
              genricObjects.position.x -= player.speed * .66
            })
            
        }
        else if(keys.left.pressed && scrollOffset > 0){
            scrollOffset -= player.speed;
            platforms.forEach(platform => {
                platform.position.x += player.speed
             })
             genricObjects.forEach((genricObjects) => {
              genricObjects.position.x += player.speed *.66
            })
            
        }
     }
 
     //Platform COLLISION DETECTION - RECTANGLE COLLISION DETECTION
     platforms.forEach(platform => {
     
     if(player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >=
        platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width ){
        player.velocity.y = 0
     }
    })

    if( keys.right.pressed && currentKey ==='right' && player.currentsprite !==
        player.sprites.run.right){
          player.frames = 1;
          player.currentsprite = player.sprites.run.right
          player.currentcropwidth = player.sprites.run.cropWidth
          player.width = player.sprites.run.width 
          
        }
        else if(keys.left.pressed && currentKey ==='left' && player.currentsprite !==
        player.sprites.run.left)
        {
          player.currentsprite = player.sprites.run.left
          player.currentcropwidth = player.sprites.run.cropWidth
          player.width = player.sprites.run.width 
        }

        else if(! keys.left.pressed && currentKey ==='left' && player.currentsprite !==
        player.sprites.stand.left)
        {
          player.currentsprite = player.sprites.stand.left
          player.currentcropwidth = player.sprites.stand.cropWidth
          player.width = player.sprites.stand.width 
        }
        else if(!keys.right.pressed && currentKey ==='right' && player.currentsprite !==
        player.sprites.stand.right)
        {
          player.currentsprite = player.sprites.stand.right
          player.currentcropwidth = player.sprites.stand.cropWidth
          player.width = player.sprites.stand.width 
        }
    //win condition
    if(scrollOffset > platformImage.width *5 + 400 -2)
    {
        console.log('you winnnnnn')
    }

    //lose condition
    if(player.position.y > canvas.height)
    {
          init()     
    }
}

init()
animate()

window.addEventListener('keydown', ({keyCode}) => {
    
    switch(keyCode)
    {
       case 37:  // arrows key left (back)
          console.log('left')
          keys.left.pressed=true
          currentKey ='left'
          break 
        
          
       case 39:  // arrows key right (front)
          console.log('right')
          keys.right.pressed=true
          currentKey = 'right'
          break 

       case 32:  // arrows key up 
          console.log('up')
          player.velocity.y -= 25
          break 

       case 40:  //arrows key down
          console.log('down')
          break 

       
    }
})

window.addEventListener('keyup', ({ keyCode }) => {
    
    switch(keyCode)
    {
       case 37:  // arrows key left (back)
          console.log('left')
          keys.left.pressed= false
          break 
          
       case 39:  // arrows key right (front)
          console.log('right')
          keys.right.pressed= false
    
          
          break 

       case 38:  // arrows key up 
          console.log('up')
          
          break 

       case 40:  //arrows key down
          console.log('down')
          break 

       
    }
})