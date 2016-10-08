$(document).ready(main);

function main()
{
    genBoxes(10,10);
}

function genBoxes(width,mines)
{
    var box=$(".construction-items .box").clone();
    var field=$(".field");

    field.css("width",width*50+"px")
        .css("height",width*50+"px");

    var dataFields=genGrid(width,mines);

    var newBox;
    for (var x=0;x<Math.pow(width,2);x++)
    {
        newBox=box.clone();
        newBox.find("p").text(dataFields[1][x][2]);

        field.append(newBox);
    }
        
}

function genGrid(width,mines)
{
    var numField=[]; //[[],[],[],...], contains [x coord, y coord, contents]
    var field=[];
    var mines=genMines(width,mines);    

    var mineIndex=0;
    for (var x=0;x<width;x++)
    {
        field.push([]);
        for (var y=0;y<width;y++)
        {
            numField[mineIndex]=[x,y,0];
            field[x][y]=0;

            if (mineIndex==mines[0])
            {
                numField[mineIndex][2]=-1;
                field[x][y]=-1;
                mines.shift();
            }

            mineIndex++;                       
        }
    }

    return [field,numField];
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
