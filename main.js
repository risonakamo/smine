$(document).ready(main);

//image array: [0%,50%,80%,100%]
var images;

function main()
{
    // loadImg();
    // genBoxes(16,16,40);

    init();
}

function init()
{
    $.get("board.json",function(d){
        var boardSelect=window.location.hash;
        boardSelect=boardSelect.split("#");

        var board=0;

        if (boardSelect.length>1)
        {
            board=parseInt(boardSelect[1]);

            if (board<0 || board>boardSelect.length)
            {
                board=0;
            }            
        }

        var d2=d.data[board];

        images=d2.imgset;
        $(".field img").eq(0).attr("src",images[0]);

        genBoxes(d2.width,d2.height,d2.mines,d2.tile);
    },"json");
}

var fboxes;
var fwidth;
var fheight;
var dataFields;
function genBoxes(width,height,mines,tile)
{
    fwidth=width;
    fheight=height;

    var box=$(".construction-items .box");
    var field=$(".field");

    $(".construction-items").remove();

    field.css("width",width*tile+"px")
        .css("height",height*tile+"px");

    $(".wrap").css("width",width*tile+"px")
        .css("height",height*tile+"px");

    infoSet(width,height,mines);

    dataFields=genGrid(width,height,mines); //0: grid field, 1: single row

    var newBox;
    for (var x=0;x<width*height;x++)
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

        newBox.on("contextmenu",function(e){
            e.preventDefault();

            $(this).toggleClass("marked");
        });

        field.append(newBox);
    }      

    fboxes=$(".field .box");
}

function genGrid(width,height,mines)
{
    win=(width*height)-mines;
    var numField=[]; //[[],[],[],...], contains [x coord, y coord, contents]
    var field=[];
    var mines=genMines(width,height,mines);    

    var mineIndex=0;
    for (var x=0;x<height;x++)
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

function genMines(width,height,mines)
{
    var mineList=[];
    
    var currMine;
    for (var x=0;x<mines;x++)
    {
        currMine=Math.floor(Math.random()*(width*height));

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

    for (var x=0;x<checkIndex.length;x++)
    {
        var checkCoord=coords.slice();
        checkCoord[0]+=checkIndex[x][0];
        checkCoord[1]+=checkIndex[x][1];

        if (checkCoord[1]>=fwidth || checkCoord[0]>=fheight 
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

            ishift(images[2]);
        }

        else if (found>Math.floor(win*.5) && fieldStatus==0)
        {
            fieldStatus=1;
            console.log("50% complete");

            ishift(images[1]);
        }
    }

    field[coords[0]][coords[1]]=1;

    thisBox.find("a").text(mineCount).addClass("opened");
    thisBox.addClass("opened");

    if (mineCount==0)
    {
        thisBox.find("a").text(" ");

        var surroundList2=surroundList.slice();
        for (var y=0,count=surroundList2.length;y<count;y++)
        {
            // var numCoord2=((surroundList2[y][0]*field.length)+surroundList2[y][1]);
            // console.log(numCoord2);
            // $(".field .box a").eq(numCoord2).css("color","blue");
            
            var numCoord2=(surroundList2[y][0]*fwidth)+surroundList2[y][1];        
            
            checkAround(fboxes.eq(numCoord2),surroundList2[y],field);
        }
    }

    // console.log(numCoord);
    //console.log(surroundList);
    // console.log(mineCount);
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
    // var boxes=$(".field .box");

    // boxes.addClass("opened");  
    // boxes.find("a").addClass("opened");
    // boxes.on("click",function(e){
    //     e.preventDefault();
    // });
    
    $(".field .box").remove();

    ishift(images[3]);
}

function lose()
{
    var boxes=$(".field .box");

    boxes.removeClass("opened marked").addClass("lose");
    boxes.find("a").removeClass("opened");

    boxes.off("click");
    boxes.off("contextmenu");

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

function ishift(shiftImg)
{
    var imgs=$(".field img");
   
    imgs.eq(1).attr("src",shiftImg).css("opacity","0");

    var t=new TimelineMax({onComplete:function(){
        imgs.attr("src",shiftImg);
    }});

    t.to(imgs.eq(0),.2,{opacity:0},0)
        .to(imgs.eq(1),.2,{opacity:1},0);
}

function loadImg()
{
    $.get("board.json",function(d){
        images=d.imgset;
        $(".field img").eq(0).attr("src",images[0]);
    },"json")
}

function infoSet(width,height,mines)
{
    var mineRate=((mines/(width*height))*100).toFixed(2);
    var infoText="BETA PantsuSweeper v1.4 "+width+"x"+height+" "+mines+" mines ("+mineRate+"% mine rate)";
   
    var difficulty;

    if (mineRate>=20)
    {
        difficulty="expert";
    }

    else if (mineRate>10 && mineRate<20)
    {
        difficulty="intermediate";
    }

    else
    {
        difficulty="easy";
    }

    infoText=infoText+" -> "+difficulty;

    $(".info p").text(infoText);
}
