// https://youtu.be/f80D5GRbGOs





//Screen size (px)
const SCREEN_W = 800;
const SCREEN_H = 600;

let $canvas = document.getElementById("canvas");
let ctx     = $canvas.getContext("2d");

$canvas.width  = SCREEN_W;
$canvas.height = SCREEN_H;

//Keep mainLoop() performing by a certain period
setInterval( mainLoop, 1000/60 );

class Firework {
    constructor ( x, y, vx, vy, g ) {
        this.x          = x<<8;
        this.y          = y<<8;
        this.vectorX    = vx;
        this.vectorY    = vy;
        this.gravity    = g;
        this.killItself = false;
    }

    update () {
        if ( this.killItself ) {
            return;
        }

        this.x       += this.vectorX;
        this.y       += this.vectorY;
        this.vectorY += this.gravity;

        //If Y is out of the screen
        if ( SCREEN_H< this.y>>8 ) {
            this.killItself = true;
        }
    }

    draw () {
        if ( this.killItself ) {
            return;
        }

        ctx.fillStyle = "#FFEE88";
        ctx.fillRect( this.x>>8, this.y>>8, 2, 2 );
    }
}


//Array to store fireworks
let fireworks = [];


function update () {
    for ( let i = (fireworks.length-1); 0 <= i; i-- ) {
        fireworks[ i ].update();

        //Once the flag is true, erase the element from the array
        if ( fireworks[ i ].killItself ) {
            fireworks.splice( i, 1 );
        }
    }
}

function draw () {
    ctx.fillStyle = "#222222";
    ctx.fillRect( 0, 0, SCREEN_W, SCREEN_H );

    for ( let i = 0; (fireworks.length-1); i-- ) {
        fireworks[ i ].draw();
    }

}


function mainLoop () {
    update();
    draw();
}



document.onkeydown = function ( e ) {
    if ( e.code == 'Space' ) {
        fireworks.push( 
            new Firework( SCREEN_W/2, SCREEN_H/2, 0, -1000, 4 )
        );
    }
}