let script    =   document.querySelector("#script");
let space     =   document.querySelector("#space");
let rowsCols  =   document.querySelector("#rowsCols");
let completed =   document.querySelector(".completed");
let replay    =   document.querySelector(".replay");
let close     =   document.querySelector(".close");


let newMaze;

script.addEventListener( "submit", generateMaze );

document.addEventListener( "keydown", moveCrawler );

replay.addEventListener( "click", () => location.reload());

close.addEventListener( "click", () => completed.style.display = "none" );


function generateMaze( err )
{
    err.preventDefault();

    if ( rowsCols.value === "" || space.value === "") return alert("Please enter all the fields.");

    let mazeDimension = space.value;
    let rows          = rowsCols.value;
    let columns       = rowsCols.value;

    let extentRestrict = ( window.screen.width > 360 ) ? 500 : 350;
    let rowRestrict    = ( window.screen.width > 360 ) ? 50   : 15;

    if ( mazeDimension > extentRestrict || rows > rowRestrict ) return alert("Maze is too large.");

    script.style.display  = "none";

    newMaze = new Maze( mazeDimension, rows, columns );
    newMaze.setGrid();
    newMaze.draw();
}


function moveCrawler( e )
{
    if ( !generationComplete)   return;
    let key  =  e.key;
    let row  =  crawler.row;
    let col  =  crawler.column;

    switch ( key )
    {
        case "ArrowUp":

            if ( !crawler.walls.topWall )
            {
                let nextCell = newMaze.grid[ row - 1 ][col];
                crawler      = nextCell;
                newMaze.draw();
                crawler.highlight( newMaze.columns );
                if ( crawler.goal ) completed.style.display = "block";
            }
            break;
         
        case "ArrowRight":

            if ( !crawler.walls.rightWall )
            {
                let nextCell = newMaze.grid[ row ][col + 1];
                crawler      = nextCell;
                newMaze.draw();
                crawler.highlight( newMaze.columns );
                if ( crawler.goal ) completed.style.display = "block";
            }
            break;  

        case "ArrowDown":

            if ( !crawler.walls.bottomWall )
            {
                let nextCell = newMaze.grid[ row + 1][col];
                crawler      = nextCell;
                newMaze.draw();
                crawler.highlight( newMaze.columns );
                if ( crawler.goal ) completed.style.display = "block";
            } 
            break;

        case "ArrowRight":

            if ( !crawler.walls.rightWall )
            {
                let nextCell = newMaze.grid[ row ][col + 1];
                crawler      = nextCell;
                newMaze.draw();
                crawler.highlight( newMaze.columns );
                if ( crawler.goal ) completed.style.display = "block";
            }
            break;  
        
        case "ArrowLeft":

            if ( !crawler.walls.leftWall )
            {
                let nextCell = newMaze.grid[ row ][col - 1];
                crawler      = nextCell;
                newMaze.draw();
                crawler.highlight( newMaze.columns );
                if ( crawler.goal ) completed.style.display = "block";
            }
            break; 

            
            

                
                
    }

}

