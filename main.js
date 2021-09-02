// https://youtu.be/f80D5GRbGOs




//Screen size (px)
const SCREEN_W = 800;
const SCREEN_H = 600;

//Canvas setting
let $canvas    = document.getElementById("canvas");
let ctx        = $canvas.getContext("2d");
$canvas.width  = SCREEN_W;
$canvas.height = SCREEN_H;

//Array to store fireworks and it's afterimage
let fireworks   = [];
let afterImages = [];


//Keep mainLoop() performing by a certain FPS
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
        if ( this.isKillingItself ) { return; } //If the flag is true, exit if() loop
        if ( --this.counter == 0 )  { this.isKillingItself = true; }
    }

    draw () {
        if ( this.isKillingItself ) { return; } //If the flag is true, exit if() loop

        ctx.globalAlpha = 1.0 * this.counter / 10;
        ctx.fillStyle = "#FFEE88";
        ctx.fillRect( this.x>>8, this.y>>8, 2, 2 );
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
            this.type     = 0;//Moving direction is upward
        } else {
            this.duration = d;
            this.type     = 1;//Moving direction is downward
        }
    }

    update () {
        if ( this.isKillingItself ) { return; }//If the flag is true, exit if() loop

        this.x       += this.vectorX;
        this.y       += this.vectorY;
        this.vectorY += this.gravity;

        //If Y is out of the screen
        if ( SCREEN_H < (this.y>>8) ) { this.isKillingItself = true; }

        //While the moving direction is upward
        if ( this.type == 0 ) {
            //Once the firework starts falling down
            if ( 0 < this.vectorY ) {
                this.isKillingItself = true;

                for ( let i = 0; i < 300; i++ ) {
                    let ranAngle = randomInt(  0, 360 );
                    let ranSpeed = randomInt( 10, 400 );

                    //Moving amount in the X-axis and Y-axis direction
                    let vx = Math.cos( ranAngle * Math.PI / 180 ) * ranSpeed;
                    let vy = Math.sin( ranAngle * Math.PI / 180 ) * ranSpeed;

                    fireworks.push( 
                        new Firework( this.x>>8, this.y>>8, vx, vy, 1, 200 )
                    );
                }
            }
        } else { 
            //If this.type is 1
            //While the moving direction is downward
            if ( --this.duration == 0 ) { this.isKillingItself = true; }
        }
    }

    draw () {
        if ( this.isKillingItself ) { return; } //If the flag is true, exit if() loop

        ctx.globalAlpha = 1.0;//No opacity
        ctx.fillStyle   = "#FFEE88";
        ctx.fillRect( this.x>>8, this.y>>8, 2, 2 );
        
        afterImages.push(
            new AfterImage( this.x, this.y )
        );
    }
} 


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
    for ( let i = (afterImages.length-1); 0 <= i; i-- ) {
        afterImages[ i ].draw();
    }

    //Draw fireworks    
    for ( let i = (fireworks.length-1); 0 <= i; i-- ) {
        fireworks[ i ].draw();
    }
}


function mainLoop () {
    update();
    draw();
}



//Press a space key to launch a firework 
document.onkeydown = function ( e ) {
    if ( e.code == 'Space' ) {
        fireworks.push( 
            new Firework( SCREEN_W/2, SCREEN_H, 0, -800, 4 )
        );
    }
}