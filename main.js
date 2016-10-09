$(document).ready(main);

function main()
{
    genBoxes(10,10);
}

function genBoxes(width,mines)
{
    var box=$(".construction-items .box").clone(true,true);
    var field=$(".field");

    field.css("width",width*50+"px")
        .css("height",width*50+"px");

    var dataFields=genGrid(width,mines); //0: grid field, 1: single row

    var newBox;
    for (var x=0;x<Math.pow(width,2);x++)
    {
        newBox=box.clone();
        newBox.find("a").text(dataFields[1][x][2])
        .attr("href",dataFields[1][x][0]+" "+dataFields[1][x][1]);

        newBox.on("click",function(e){
            e.preventDefault();

            var coords=($(this).find("a").attr("href")).split(" ");
            coords[0]=parseInt(coords[0]);
            coords[1]=parseInt(coords[1]);
            
            checkAround(coords,dataFields[0]);
            //console.log(coords);
        });

        field.append(newBox);
    }        
}

//field: grid field
var checkIndex=[[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]];
function checkAround(coords,field)
{
    var mineCount=0;
    var surroundList=[];

    for (var x=0;x<checkIndex.length;x++)
    {
        var checkCoord=coords.slice();
        checkCoord[0]+=checkIndex[x][0];
        checkCoord[1]+=checkIndex[x][1];

        if (checkCoord[0]>=field.length || checkCoord[1]>=field.length 
            || checkCoord[0]<0 || checkCoord[1]<0)
        {
            continue;
        }

        surroundList.push(checkCoord);
        
        if (field[checkCoord[0]][checkCoord[1]]<0)
        {
            mineCount++;
        }
    }

    var numCoord=((coords[0]*field.length)+coords[1]);

    $(".field .box a").eq(numCoord).text(mineCount).css("color","blue");

    if (mineCount==0)
    {
        console.log("mine 0");
        var surroundList2=surroundList.slice();
        for (var y=0;y<surroundList2.length;y++)
        {
            var numCoord2=((surroundList2[y][0]*field.length)+surroundList2[y][1]);
            console.log(numCoord2);
            $(".field .box a").eq(numCoord2).css("color","blue");
        }
    }

    console.log(numCoord);
    console.log(surroundList);
    console.log(mineCount);
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
