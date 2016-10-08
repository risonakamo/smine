$(document).ready(main);

function main()
{
    genMines(5,4);
    genGrid(5,10);
}

function genGrid(width,mines)
{
    var field=[];
    var mines=genMines(width,mines);    

    for (var x=0;x<Math.pow(width,2);x++)
    {
        field.push(x);

        if (x==mines[0])
        {
            mines.shift();
            console.log(mines);
            field[x]="x";
        }
    }

    console.log(field);
}

function genMines(width,mines)
{
    var mineList=[];
    
    var currMine;
    for (var x=0;x<mines;x++)
    {
        currMine=Math.floor(Math.random()*Math.pow(width,2));

        if (checkMines(currMine,mineList))
        {
            x--;
        }

        else
        {
            mineList.push(currMine);
        }
    }

    mineList.sort(function(a,b){return a-b});

    return mineList;
}

function checkMines(currMine,mineList)
{
    for (var x=0;x<mineList.length;x++)
    {
        if (currMine==mineList[x])
        {
            return 1;
        }
    }

    return 0;
}
