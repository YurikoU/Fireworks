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


//Return a random integer between min and max
function randomInt ( min, max ) {
    return Math.floor( Math.random() * (max-min+1) + min );
}



class AfterImage {
    constructor ( x, y ) {
        this.x = x;
        this.y = y;
        this.counter = 10;
        this.isKillingItself = false;
    }

    update () {
        if ( this.isKillingItself ) {
            return;
        }

        if ( --this.counter == 0 ) {
            this.isKillingItself = true;
        }
    }

    draw () {
        if ( this.isKillingItself ) {
          return;
        }

        ctx.globalAlpha = 1.0 * this.counter / 10;
        ctx.fillStyle = "#FFEE88";
        ctx.fillRect( this.x>>8, this.y>>8, 2, 2 );

        afterImages.push(
            new AfterImage( this.x, this.y )
        );
    }
}


class Firework {
    constructor ( x, y, vx, vy, g, d ) {
        this.x               = x<<8;
        this.y               = y<<8;
        this.vectorX         = vx;
        this.vectorY         = vy;
        this.gravity         = g;
        this.isKillingItself = false;
        
        if ( d == undefined ) {
            this.duration = 200;//200 frames
            this.type     = 0;
          } else {
            this.duration = d;
            this.type     = 1;
        }
    }

    update () {
        if ( this.isKillingItself ) {
            return;
        }

        this.x       += this.vectorX;
        this.y       += this.vectorY;
        this.vectorY += this.gravity;

        //If Y is out of the screen
        if ( SCREEN_H < this.y>>8 ) {
            this.isKillingItself = true;
        }

        if ( this.type == 0 ) {
            //If the firework move downward
            if ( 0 < this.vectorY ) {
                this.isKillingItself = true;

                for ( let i = 0; i < 300; i++ ) {
                    let ranAngle = randomInt(  0, 360 );
                    let ranSpeed = randomInt( 10, 400 );

                    //Moving amount in the X-axis and Y-axis direction
                    let vx = Math.cos( ranAngle * MathPI / 180 ) * ranSpeed;
                    let vy = Math.sin( ranAngle * MathPI / 180 ) * ranSpeed;


                    fireworks.push( 
                      new Firework( this.x>>8, this.y>>8, vx, vy, 1, 200 )
                    );
                }
            }
        } else {
            if ( --this.duration == 0 ) {
                this.isKillingItself = true;
            }
        }
    }

    draw () {
        if ( this.isKillingItself ) {
            return;
        }

        ctx.globalAlpha = 1.0;//No opacity
        ctx.fillStyle   = "#FFEE88";
        ctx.fillRect( this.x>>8, this.y>>8, 2, 2 );
    }
}


//Array to store fireworks and it's afterimage
let fireworks   = [];
let afterImages = [];


function update () {
    //Update fireworks
    for ( let i = (fireworks.length-1); 0 <= i; i-- ) {
        fireworks[ i ].update();

        //Once the flag is true, erase the element from the array
        if ( fireworks[ i ].isKillingItself ) {
            fireworks.splice( i, 1 );
        }
    }

    //Update afterimages
    for ( let i = (afterImages.length-1); 0 <= i; i-- ) {
        afterImages[ i ].update();

        //Once the flag is true, erase the element from the array
        if ( afterImages[ i ].isKillingItself ) {
            afterImages.splice( i, 1 );
        }
    }
}


function draw () {
    //Draw the night sky
    ctx.fillStyle = "#222222";
    ctx.fillRect( 0, 0, SCREEN_W, SCREEN_H );

    //Draw afterimages    
    for ( let i = 0; (afterImages.length-1); i-- ) {
        afterImages[ i ].draw();
    }

    //Draw fireworks    
    for ( let i = 0; (fireworks.length-1); i-- ) {
        fireworks[ i ].draw();
    }
}


function mainLoop () {
    update();
    draw();
}



document.onkeydown = function ( e ) {

    //Press a space key to launch a firework 
    if ( e.code == 'Space' ) {
        fireworks.push( 
            new Firework( SCREEN_W/2, SCREEN_H/2, 0, -1000, 4 )
        );
    }
}