$(document).ready(main);

//image array: [0%,50%,80%,100%]
var images=["1.png","2.png","2.png","3.png"];

function main()
{
    genBoxes(16,10);
}

var dataFields;
function genBoxes(width,mines)
{
    var box=$(".construction-items .box").clone(true,true);
    var field=$(".field");

    field.css("width",width*50+"px")
        .css("height",width*50+"px");

    dataFields=genGrid(width,mines); //0: grid field, 1: single row

    var newBox;
    for (var x=0;x<Math.pow(width,2);x++)
    {
        newBox=box.clone();
        newBox.find("a").text(0)
        .attr("href",dataFields[1][x][0]+" "+dataFields[1][x][1]);

        newBox.on("click",function(e){
            e.preventDefault();

            var coords=($(this).find("a").attr("href")).split(" ");
            coords[0]=parseInt(coords[0]);
            coords[1]=parseInt(coords[1]);
            
            checkAround($(this),coords,dataFields[0]);
            //console.log(coords);
        });

        field.append(newBox);
    }        
}

//field: grid field
var win;
var found=0;
var checkIndex=[[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]];
var fieldStatus=0;
function checkAround(thisBox,coords,field)
{
    if (field[coords[0]][coords[1]]==-1)
    {
        thisBox.find("a").text("x").addClass("opened");
        thisBox.addClass("opened");
        lose();
        return;
    }

    var mineCount=0;
    var surroundList=[];

    var boxes=$(".field .box");

    for (var x=0;x<checkIndex.length;x++)
    {
        var checkCoord=coords.slice();
        checkCoord[0]+=checkIndex[x][0];
        checkCoord[1]+=checkIndex[x][1];

        if (checkCoord[0]>=field.length || checkCoord[1]>=field.length 
            || checkCoord[0]<0 || checkCoord[1]<0 
            || field[checkCoord[0]][checkCoord[1]]==1)
        {
            continue;
        }

        surroundList.push(checkCoord);
        
        if (field[checkCoord[0]][checkCoord[1]]<0)
        {
            mineCount++;
        }
    }

    thisBox.on("click",function(e){
        e.preventDefault();
    });

    if (field[coords[0]][coords[1]]!=1)
    {
        found++;       

        if (found==win)
        {
            won();
        }

        else if (found>Math.floor(win*.8) && fieldStatus!=2)
        {
            fieldStatus=2;
            console.log("80% complete");

            $(".field").css("background-image","url('"+images[2]+"')");
        }

        else if (found>Math.floor(win*.5) && fieldStatus==0)
        {
            fieldStatus=1;
            console.log("50% complete");

            $(".field").css("background-image","url('"+images[1]+"')");
        }
    }

    field[coords[0]][coords[1]]=1;

    thisBox.find("a").text(mineCount).addClass("opened");
    thisBox.addClass("opened");

    if (mineCount==0)
    {
        var surroundList2=surroundList.slice();
        for (var y=0,count=surroundList2.length;y<count;y++)
        {
            // var numCoord2=((surroundList2[y][0]*field.length)+surroundList2[y][1]);
            // console.log(numCoord2);
            // $(".field .box a").eq(numCoord2).css("color","blue");
            
            var numCoord2=(surroundList2[y][0]*field.length)+surroundList2[y][1];        
            
            checkAround(boxes.eq(numCoord2),surroundList2[y],field);
        }
    }



    // console.log(numCoord);
    //console.log(surroundList);
    // console.log(mineCount);
}

function genGrid(width,mines)
{
    win=Math.pow(width,2)-mines;
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

function won()
{
    var boxes=$(".field .box");

    boxes.addClass("opened");  
    boxes.find("a").addClass("opened");
    boxes.on("click",function(e){
        e.preventDefault();
    });

    $(".field").css("background-image","url('"+images[3]+"')");
}

function lose()
{
    var boxes=$(".field .box");

    boxes.removeClass("opened").addClass("lose");
    boxes.find("a").removeClass("opened");
    boxes.off("click");
    boxes.on("click",function(e){
        e.preventDefault();
    });

    boxes.each(function(x,e){
        if (dataFields[1][x][2]==-1)
        {
            boxes.eq(x).addClass("opened");
            boxes.find("a").eq(x).text("x").addClass("opened lose");
        }
    });
}

function reveal()
{
    var boxes=$(".field .box");

    boxes.each(function(x,e){
        boxes.eq(x).text(dataFields[1][x][2]);
    })
}
