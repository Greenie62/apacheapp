
var canvas = document.querySelector("canvas");

canvas.width=innerWidth;
canvas.height=innerHeight;

var ctx = canvas.getContext('2d');

ctx.fillStyle='black'
ctx.fillRect(0,0,canvas.width,canvas.height);




class Player{
    constructor(x,y,r,color){
        this.x=x;
        this.y=y;
        this.r=r;
        this.color=color;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.x,this.y,this.r,Math.PI * 2,false)
        ctx.fill()
    }

    takeDamage(){
        this.r-=4;
    }
}


class Bullet{
    constructor(x,y,r,color,vel){
        this.x=x;
        this.y=y;
        this.r=r;
        this.vel=vel;
        this.color=color;
        this.toDelete=false;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.x,this.y,this.r,Math.PI * 2,false)
        ctx.fill()
    }

    update(){
        this.draw()
        this.x += this.vel.x;
        this.y += this.vel.y;


        if(this.x > canvas.width + 100 ||
           this.x < -100 || 
           this.y > canvas.height + 100 || 
           this.y < -100)
            {
                this.toDelete=true;
            }
    }

    hit(enemy){
        let dist = Math.hypot(enemy.x - this.x,enemy.y - this.y);

        if(dist < enemy.r){
            this.toDelete=true;
            return true;
        }
    }

   
}


class Enemy{
    constructor(x,y,r,color,vel){
        this.x=x;
        this.y=y;
        this.r=r;
        this.vel=vel;
        this.color=color;
        this.toDelete=false;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.x,this.y,this.r,Math.PI * 2,false)
        ctx.fill()
    }

    update(){
        this.draw()
        this.x += this.vel.x;
        this.y += this.vel.y;


        if(this.x > canvas.width + 100 ||
           this.x < -100 || 
           this.y > canvas.height + 100 || 
           this.y < -100)
            {
                this.toDelete=true;
            }
    }

    takeDamage(){
        this.r -= 5;

        if(this.r < 15){
            this.toDelete = true
        }
    }

    hit(player){
        let dist = Math.hypot(player.x - this.x,player.y - this.y);

        if(dist < player.r){
            this.toDelete=true;
            return true;
        }
    }

   
}

let playerX = innerWidth/2;
let playerY = innerHeight/2;

let player= new Player(playerX,playerY,50,'white')
let enemies=[];
let bullets=[];


let enemyInterval = setInterval(spawnEnemy,1500)


function gameLoop(){

    let gameloopFx = requestAnimationFrame(gameLoop)


    ctx.fillStyle='black'
    ctx.fillRect(0,0,canvas.width,canvas.height);


    player.draw();

    bullets.forEach((bullet,idx)=>{
        bullet.update()

        if(bullet.toDelete){
            bullets.splice(idx,1)
        }
            enemies.forEach(e=>{
                if(bullet.hit(e)){
                    e.takeDamage()
                }
            })
        
    })

    enemies.forEach((enemy,idx)=>{
        enemy.update();

        if(enemy.toDelete){
            enemies.splice(idx,1)
        }
        if(enemy.hit(player)){
            player.takeDamage()
            if(player.r < 20){
                clearInterval(enemyInterval);
                cancelAnimationFrame(gameloopFx)
            }
        }
    })


}


gameLoop()


onclick=(e)=>{
    let {clientX,clientY} = e;

    console.log(clientX,clientY)

    let angle= Math.atan2(clientY - playerY,
                          clientX - playerX )

    let vel={x:Math.cos(angle) * 3,
             y:Math.sin(angle) * 3};

             bullets.push(new Bullet(playerX,playerY,4,'white',vel))

             console.log(bullets)

}


function spawnEnemy(){
    let enemyY =Math.random() *  innerHeight | 0;
    let enemyX =Math.random() *  innerWidth | 0;

    if(enemyX > playerX){
        enemyX = canvas.width + 50;
    }
    else{
        enemyX = - 50;
    }

    let angle = Math.atan2(playerY - enemyY,
                           playerX - enemyX)

        let vel ={x:Math.cos(angle), y:Math.sin(angle)}

        enemies.push(new Enemy(enemyX, enemyY, ((Math.random() * 25 | 0) + 15),'orange',vel))
}