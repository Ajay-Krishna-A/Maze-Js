let maze    = document.querySelector(".maze");
let ctx     = maze.getContext("2d");

let generationComplete = false;
let crawler;
let goal;


class Maze
{
    constructor( space, rows, columns )
    {
        this.space   =   space;
        this.rows    =   rows;
        this.columns =   columns;
        this.grid    =   [];       // Produces Maze.
        this.stack   =   [];
    }

    setGrid()
    {
        for ( let row = 0; row < this.rows; row++)
        {
            let rowStack = [];
            for ( let column = 0; column < this.columns; column++)
            {
                let cell = new Cell( row, column, this.grid, this.space );
                rowStack.push(cell);
            }
            this.grid.push(rowStack);
        }

        crawler = this.grid[0][0];
        this.grid[this.rows - 1][this.columns - 1].goal = true;
    
    }

    draw()
    {
        maze.width  = this.space;
        maze.height = this.space;
        maze.style.background = "#1f1f1f";
        crawler.visited       = true;
        
        for ( let row = 0; row < this.rows; row++)
        {
            for ( let column = 0; column < this.columns; column++)
            {
                this.grid[row][column].show( this.space, this.rows, this.columns )
            }
        }

        let nextCell = crawler.checkNeighbours();

        if( nextCell )
        {
            nextCell.visited = true;
            this.stack.push(crawler);
            crawler.highlight( this.columns );
            crawler.removeWalls( crawler, nextCell );
            crawler = nextCell;
        }
        else if( this.stack.length > 0 )
        {
            let cell = this.stack.pop();
            crawler = cell;
            crawler.highlight( this.columns );
        }

        if ( this.stack.length === 0 ) 
        {
            generationComplete = true;
            return;
        }

        setTimeout( () => this.draw(), 10 );
    }
}


class Cell
{
    constructor( row, column, grid, space )
    {
        this.row     = row;
        this.column  = column;
        this.grid    = grid;
        this.space   = space;
        this.visited = false;
        this.goal    = false;
        this.walls   =
        {
            topWall      :       true,
            rightWall    :       true,
            bottomWall   :       true,
            leftWall     :       true,

        }
    }


    checkNeighbours()
    {
        let grid    = this.grid;
        let row     = this.row;
        let column  = this.column;

        let neighbours = [];

        let top    = row    !== 0                ? grid[row - 1][column] : undefined;
        let right  = column !== grid.length - 1  ? grid[row][column + 1] : undefined;
        let bottom = row    !== grid.length - 1  ? grid[row + 1][column] : undefined;
        let left   = column !== 0                ? grid[row][column - 1] : undefined;

        if ( top    && !top.visited    ) neighbours.push(top);
        if ( right  && !right.visited  ) neighbours.push(right);
        if ( bottom && !bottom.visited ) neighbours.push(bottom);
        if ( left   && !left.visited  ) neighbours.push(left);

        if (neighbours.length !== 0) 
            return neighbours[Math.floor(Math.random() * neighbours.length)];
        else                         
            return undefined;
    }


    drawTopWall( x, y, space, rows, columns )
    {
        ctx.beginPath();
        ctx.moveTo( x, y );
        ctx.lineTo( x + space/columns, y );
        ctx.stroke();
    }


    drawRightWall( x, y, space, rows, columns )
    {
        ctx.beginPath();
        ctx.moveTo( x + space/columns, y);
        ctx.lineTo( x + space/columns, y + space/rows )
        ctx.stroke();
    }

    
    drawBottomWall( x, y, space, rows, columns )
    {
        ctx.beginPath();
        ctx.moveTo( x + space/columns, y + space/columns );
        ctx.lineTo( x, y + space/rows )
        ctx.stroke();
    }


    drawLeftWall( x, y, space, rows, columns )
    {
        ctx.beginPath();
        ctx.moveTo( x, y + space/rows );
        ctx.lineTo( x, y )
        ctx.stroke();
    }


    highlight( columns )
    {
        let x = (this.column * this.space) / columns ;
        let y = (this.row    * this.space) / columns ;

        ctx.fillStyle = "green";
        ctx.fillRect( x + 1, y + 1, this.space/columns - 2, this.space/columns - 2 );

    }


    removeWalls( cellOne, cellTwo )
    {
        let x = cellOne.column - cellTwo.column;

        if ( x === 1 )
        {
            cellOne.walls.leftWall = false;
            cellTwo.walls.rightWall= false; 
        }
        else if( x === -1 )
        {
            cellOne.walls.rightWall = false;
            cellTwo.walls.leftWall  = false;

        }
        
        let y = cellOne.row - cellTwo.row;

        if ( y === 1 )
        {
            cellOne.walls.topWall = false;
            cellTwo.walls.bottomWall    = false;
        }
        else if( y === -1 )
        {
            cellOne.walls.bottomWall    = false;
            cellTwo.walls.topWall = false;
        }

    }


    show( space, rows, columns )
    {
        let x = ( this.column * space ) / columns;
        let y = ( this.row    * space ) / rows;

        ctx.fillStyle   = "#1f1f1f";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth   = 1;

        if (this.walls.topWall)     this.drawTopWall( x, y, space, rows, columns );
        if (this.walls.rightWall)   this.drawRightWall( x, y, space, rows, columns );
        if (this.walls.bottomWall)  this.drawBottomWall( x, y, space, rows, columns );
        if (this.walls.leftWall)    this.drawLeftWall( x, y, space, rows, columns );

        if (this.visited)  ctx.fillRect( x, y, space/rows, space/columns );

        if (this.goal)
        {
            ctx.fillStyle = "red";
            ctx.fillRect( x, y, space/rows, space/columns );
        }
    }
    
}


