var tempArray =[];
var temp2Array = [];
var neworiginalData;
var zoneArray = [];
$(document).ready(function(){
    getDisplays();   
    setInterval(function(){
        getOriginalData();
    },30000);     
});

function getDisplays() {
    $.ajax({
        url: listdisplays,
        "headers":{
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*",
          },
        type: "POST",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            var originalData = response;
                mapedLayout(originalData);
        },
        error: function (error, sts) {
           
        }
    });
}

function mapedLayout(scope) {
    $('.contentRow').empty();
    $('.mainRow').empty();
    let displayRow='';
    let temp1String;
    let temp2String;
    //if(tempArray ==''){
        let layoutName ;
        var sourceNames=[];
        let sourceNames1 = [];
        let zonName;
        for (var display of scope) {
            var displayId = display.id;
            var uniquedisplayId = displayId.replace(/ /g,"-");
            displayRow = "<div class='row mainRow border'>"+
                "<div class='col-md-2 border-right bg-white p-2'>"+
                       "<div class='roundDisplay rounded'>"+displayId+"</div>"+
                "</div>"+
                "<div class='col-md-10 bg-light zones zonetoggle-"+uniquedisplayId+"' id='zonetoggle-"+uniquedisplayId+"'>"+
                "</div>"+
            "</div>"        
            $('#contentRow').append(displayRow);
            
            for(var zone of display.zones){
            
               for(var cord of zone.zonecoordinates){
                     zonName = cord.name; 
                    //localZoneArray.push(zonName);
                    
                    var zonID = zonName.replace(/ /g, '-');
                    var zoneRows = "<div class='row m-1 rounded'>"+
                                        '<div data-role="accordion" data-one-frame="false" data-show-active="true">'+
                                            '<div class="frame">'+
                                                '<div class="heading border-bottom">'+cord.name+'</div>'+
                                                    '<div class="content bg-white">'+
                                                        '<div class="row pl-1 pr-1 layout" id="layout'+uniquedisplayId+zonID +'">'+
                                                    '</div>' +
                                                '</div>'+
                                            '</div>'+  
                                        '</div>'+
                                    '</div>' +
                                "</div>"
                    $('#zonetoggle-'+uniquedisplayId).append(zoneRows);
            for(var layout of cord.layouts){
                let lName = layout.name;
                var key = uniquedisplayId+cord.name+lName;
                let rows = layout.rows;
                let cols = layout.columns;
                if(layout.active){
                    layoutName = layout.name;
                    if(cols !=-1 && rows !=-1){
                        var map = new Map();
                        var references = layout.references;
                        var data;
                        
                        for (var reference of references) {
                            var sourcename = reference.source.name;
                           
                            sourceNames.push(sourcename);
                            temp1String =displayId+','+zonName+','+layoutName+','+sourceNames;
                            var sourceType = reference.source.type;
                            var applabel = reference.applicationLabel;
                            var location = reference.applicationLabel.location;
                            var size = reference.applicationLabel.size;
                            var x = applabel.rectanglePoint.x;
                            var y = applabel.rectanglePoint.y;
                            
                                data = {
                                    'zone': zonName,
                                    'applabel': applabel,
                                    'location':location,
                                    'layoutname':layoutName,
                                    'size':size,
                                    'id':displayId,
                                    'type':sourceType,
                                    'sourcename': sourcename,
                                    'x': x,
                                    'y': y,
                                    'rows': rows,
                                    'columns': cols
                                };
                                
                                if (zonName) {
                                    if (map.has(key)) {
                                        map.get(key).push(data);
                                    } else {
                                        var arr = [data];
                                        map.set(key, arr);
                                    }
                                }
                            
                            
                        }
                        
                        for(let key of map.keys()){
                            var s = 0;
                            var data = map.get(key);
                            var cID = key.replace(/ /g,'-');
                            var zn = data[0].zone;
                            let layName = data[0].layoutname;
                            
                        if(typeof layName !=="undefined"){
                            var znID = zn.replace(/ /g,'-');
                            
                            var uniquedisplayId = data[0].id.replace(/ /g,"-");
                            
                            $('#layout'+uniquedisplayId+znID).html(
                                '<div class="activeLayout">' +
                                    '<div class="text-justify-content bg-dark rounded text-info border newlayout p-2" id="layout">' + layoutName +    
                                    '</div>' +
                                    '<div class="row m-1 newBox" id="box'+cID+'" name="'+zn+'">'+
                                    '</div>'+
                                '</div>'
                            );
                            
            
                            for (var i = 0; i < data.length; i++) {
                                let sName = data[i].sourcename;
                                let lnames = data[i].layoutname;
                                let rows = data[i].rows;
                                let cols = data[i].columns;
                                let lname = lnames.replace(/ /g,"-");
                                let xd = data[i].x;
                                let yd = data[i].y;
                                var drawx = data[i].applabel.location.x;
                                var drawy = data[i].applabel.location.y;
                                var drawwidth =data[i].applabel.size.width;
                                var drawheight =data[i].applabel.size.height;
                                
                                if(data[i].type !='Video'){
                                    continue;
                                }else{

                                    var flexBox ="<script type=\"text/javascript\" src=\"paint/lib/wColorPicker.min.js\"></script>"+
                                    "<script type=\"text/javascript\" src=\"paint/wPaint.min.js\"></script>"+
                                    "<script type=\"text/javascript\" src=\"paint/src/wPaint.js\"></script>"+
                                    "<script type=\"text/javascript\" src=\"paint/plugins/main/src/wPaint.menu.main.js\"></script>"+
                                    "<script type=\"text/javascript\" src=\"paint/plugins/text/src/wPaint.menu.text.js\"></script>"+
                                    "<script type=\"text/javascript\" src=\"paint/plugins/shapes/src/wPaint.menu.main.shapes.js\"></script>"+
                                    "<script type=\"text/javascript\" src=\"paint/plugins/shapes/src/shapes.min.js\"></script>"+
                                    
                                    "<div id='wPaint"+zn+sName+xd+yd+"' class='border text-black flexbox 100-vh' style='width:"+drawwidth+"px; height:"+drawheight+"px; left:"+drawx+"px; top:"+drawy+"px;position:absolute;'>"+
                                    "<span class='right-text'>"+data[i].sourcename+"</span>"+
                                        "<span id='apply"+zn+sName+xd+yd+"' zone='"+data[i].zone+"' layout='"+data[i].layoutname+"' display='"+data[i].id+"' data='"+JSON.stringify(data[i].applabel.location.x)+','+JSON.stringify(data[i].applabel.location.y)+"' name='"+data[i].sourcename+"' class=' apply btn btn-white border' data='"+JSON.stringify(data)+"'>A</span>"+
                                        "<span id='clear"+zn+sName+xd+yd+lname+"' name='"+data[i].sourcename+"' aria-hidden='true' class='close  clear btn btn-white border'>&times;</span>"+
                                    "</div>"
                                    
                      
                                   
                                 
                                $('#box'+cID).append(flexBox);
                    
                                $('#wPaint'+zn+sName+xd+yd).wPaint({
                                    menuOffsetLeft:0,
                                    menuOffsetTop:0,
                                    menuOrientation:'vertical',
                                    onShapeUp: createCallback('onShapeUp'),
                                            
                                });
                               
                                let flag=false;
                                let strokColor;
                                let fillColor;
                                let circlesArray = [];
                                let rectArray = [];
                                let ellipseArray = [];
                                let stringArray =[];
                                var arrayData='';
                                let px,py;
                                let radius;
                                let _this;
                                let itemWidth,itemHeight;
                                let mode;
                                let allData='';
                                let fontSize;
                                let fontFamily;
                        
                            
                            function createCallback(cbName){
                                return function(e){
                                
                                    px = this.canvasTempLeftOriginal;
                                    py = this.canvasTempTopOriginal;
                                    
                                    moveX = this.canvasWidth ;
                                    moveY = this.canvasHeight;

                                    
                                    
                                    itemWidth = this.iWidth;
                                    itemHeight = this.iHeight;
                                    let radiusDecimalValue = (0.5 * Math.sqrt(itemWidth * itemWidth + itemHeight * itemHeight));
                                    radius = Math.trunc(radiusDecimalValue);

                                    var w = this.width;
                                    var h = this.height;
                                    
                                    width = Math.trunc(w);
                                    height = Math.trunc(h);
                                    
                                    mode = this.options.mode;
                                    fontSize = this.options.fontSize;
                                    fontFamily = this.options.fontFamily;
                                    
                                    strokColor = hexToRgbA(this.options.strokeStyle,px,py);
                                    fillColor = hexToRgbABackground(this.options.fillStyle,px,py,itemWidth,itemHeight);

                                    if(this.options.fillStyle =='#FFFFFF'){
                                        flag = false;
                                    }else{
                                        flag = true;
                                    }
                                    arrayData = "{"
    
                                    if(mode =='circle'){
                                        
                                        const circleJson ="{"+'"color"'+":"+'{'+strokColor+','+fillColor+'},"x":"'+px+'","y":"'+py+'","fill":"'+flag+'","radius":"'+radius+'"}';
                                        circlesArray.push(circleJson);
                                        const circ = '"circles"'+":["+circlesArray+"],";
                                        allData +=circ;
                                    }else if(mode =='rectangle'){
                                        const rectJson = "{"+'"color"'+":"+'{'+strokColor+','+fillColor+'},"x":"'+px+'","y":"'+py+'","width":"'+itemWidth+'","height":"'+itemHeight+'","fill":"'+flag+'"}';
                                        rectArray.push(rectJson); 
                                        const rect = '"rectangles"'+":["+rectArray+"],";
                                        allData +=rect;
                                    }else if(mode =='ellipse'){
                                        const ellipseJson = "{"+'"color"'+":"+'{'+strokColor+','+fillColor+'}, "x":"'+px+'","y":"'+py+'","width":"'+itemWidth+'","height":"'+itemHeight+'","fill":"'+flag+'"}';
                                        ellipseArray.push(ellipseJson);
                                        const ovals ='"ovals"'+":["+ellipseArray+"],";
                                        allData +=ovals;
                                    }else if(mode =='text'){
                                        let font=0;
                                        if(typeof this.fonts !=='undefined'){
                                            font = this.fonts;
                                        }
                                        
                                        if(typeof this.lines !=='undefined'){
                                            let sx = this.sx;
                                            let sy = this.sy;
                                            let smoveX,smoveY;
                                            smoveX = this.smoveX;
                                            smoveY = this.smoveY;
                                            
                                            let strokColorsForString = hexToRgbA(this.options.strokeStyle,px,py);
                                            let  fillColorsForString = hexToRgbABackground(this.options.fillStyle,sx,sy,smoveX,smoveY,mode);
                                            let textStrings = this.lines;
                                            let stringJson = "{"+'"color"'+":"+'{'+strokColorsForString+','+fillColorsForString+'}, "x":"'+sx+'","y":"'+sy+'","width":"'+smoveX+'","height":"'+smoveY+'","fill":"'+flag+'","string":"'+textStrings+'","name":"'+fontFamily+'","style":"'+font+'","size":"'+fontSize+'"}';
                                            stringArray.push(stringJson);
                                            const string = '"strings"'+":["+stringArray+"],";
                                            allData += string;
                                            
                                        }
                                       
                                    }
                                    this.lines ='';
                                    _this = this;
                                }
                                
                            }  
                           
                            $('#clear'+zn+sName+xd+yd+lname).on('click', function(e){
                                     _this.clear();
                                    circlesArray = [];
                                    rectArray = [];
                                    ellipseArray = [];
                                    stringArray = [];
                                    allData='';
                                   e.preventDefault();

                            });
                   
                            $('#apply'+zn+sName+xd+yd).on('click', function(e){
                            
                                let source = $(this).attr('name');
                                let display = $(this).attr('display');
                                let layout = $(this).attr('layout');
                                let zone = $(this).attr('zone');
                                let location = $(this).attr('data').split(',');
                                let xcord = location[0];
                                let ycord = location[1];
                            
                                let frameWidth = $(this).parent().width();
                                let frameHeight = $(this).parent().height();
                                
                                if(mode !='' && mode !='undefined'){
                                    getCordinates(arrayData,allData,zone,layout,source,xcord,ycord,frameWidth,frameHeight);
                                    mode='';
                                }else{
                                    allData='';
                                    circlesArray=[];
                                    rectArray =[];
                                    ellipseArray = [];
                                    stringArray = [];
                                    getCordinates(arrayData,allData,zone,layout,source,xcord,ycord,frameWidth,frameHeight);
                                }
                               
                               
                                });
                                //console.log('rows >'+rows+' cols >'+cols)
                                    
                                }   
                                    
                            }         
                        }
                     } 
                     break;
                    
                    }else if(cols == -1 && rows == -1){
                        for(let refs of layout.references){
                            let sn = refs.source.name;
                            sourceNames1.push(sn);
                        }
                        temp2String =displayId+','+zonName+','+layoutName+','+sourceNames1;
                        getNoTilesLayout(layout,zonName,displayId,lName);
                    }
                }
            }
           }
           
          } 
        
    }
    
}



function getNoTilesLayout(layout,zone,displayId,layoutName){
    
        var uniquedisplayId = displayId.replace(/ /g,"-");
        var layoutNs = layout.name;
        var layoutN = layoutNs.replace(/ /g,'-');
        var ntZone = zone.replace(/ /g,'-');

        
        $('#layout'+uniquedisplayId+ntZone).append(
            '<div class="activeLayout">' +
                '<div class="text-justify-content bg-dark rounded text-info border newlayout p-2" id="layout">' + layoutNs +    
                '</div>' +
                '<div class="row m-1 newBox " id="box'+uniquedisplayId+layoutN+'" name="'+ntZone+'">'+'</div>'+
            '</div>'
        );

        var map = new Map();
        var references = layout.references;
        var data;       
        var splitComma=',';
        for(let reference of references){
            var sourceType = reference.source;
            var sourceN = sourceType.name;
            var types = sourceType.type;
           
            var rectangle = reference.rectangle;
            var text = rectangle.text;
            var replaceData = text.replace(/[/(/)]/g,',');
            var splitData = replaceData.split(splitComma);
           
            const oXvalue = rectangle.x;
            const oYvalue = rectangle.y;
            const oWvalue = rectangle.width;
            const oHvalue = rectangle.height;

            const xValue = splitData[1];
            const yValue = splitData[2];
            const wValue = splitData[3];
            const hValue = splitData[4];
            
            if(types !='Video'){
                continue;
            }else{
            	let flexBox ="<script type=\"text/javascript\" src=\"paint/lib/wColorPicker.min.js\"></script>"+
                 "<script type=\"text/javascript\" src=\"paint/wPaint.min.js\"></script>"+
                 "<script type=\"text/javascript\" src=\"paint/src/wPaint.js\"></script>"+
                 "<script type=\"text/javascript\" src=\"paint/plugins/main/src/wPaint.menu.main.js\"></script>"+
                 "<script type=\"text/javascript\" src=\"paint/plugins/text/src/wPaint.menu.text.js\"></script>"+
                 "<script type=\"text/javascript\" src=\"paint/plugins/shapes/src/wPaint.menu.main.shapes.js\"></script>"+
                 "<script type=\"text/javascript\" src=\"paint/plugins/shapes/src/shapes.min.js\"></script>"+
                
                "<div id='wPaint"+ntZone+sourceN+oXvalue+oYvalue+"' class='border text-black flexbox' style='width:"+wValue+"px; height:"+hValue+"px; left:"+xValue+"px; top:"+yValue+"px; position:absolute;'>"+
                "<span class='right-text'>"+sourceN+"</span>"+
                   "<span id='apply"+ntZone+sourceN+oXvalue+oYvalue+"' zone='"+ntZone+"' layout='"+layoutNs+"' display='"+displayId+"' data='"+oXvalue+','+oYvalue+"' name='"+sourceN+"' class=' apply btn btn-white border' data='"+rectangle+"'>A</span>"+
                   "<span id='clear"+ntZone+sourceN+oXvalue+oYvalue+layoutN+"'  name='"+sourceN+"' aria-hidden='true' class='close clear btn btn-white border'>&times;</span>"+
                "</div>"

           $('#box'+uniquedisplayId+layoutN).append(flexBox);

           $('#wPaint'+ntZone+sourceN+oXvalue+oYvalue).wPaint({
                menuOffsetLeft:0,
                menuOffsetTop:0,
                menuOrientation:'vertical',
                onShapeUp: createCallback('onShapeUp'),
           });
           
           let flag = false;
           let strokColor;
           let fillColor;
           let circlesArray = [];
           let rectArray = [];
           let ellipseArray = [];
           let stringArray =[];
           var arrayData='';
           let px,py;
           let radius;
           let _this;
           let width,height;
           let itemWidth,itemHeight;
           let mode;
           let allData='';
           let fontSize;
           let fontFamily;
           let fontStyle;
           function createCallback(cbName){
               return function(e){
                    px = this.canvasTempLeftOriginal;
                    py = this.canvasTempTopOriginal;
                   moveX = this.canvasWidth ;
                   moveY = this.canvasHeight;
                   itemWidth = this.iWidth;
                   itemHeight = this.iHeight;

                   let radiusDecimalValue = (0.5 * Math.sqrt(itemWidth * itemWidth + itemHeight * itemHeight));
                    radius = Math.trunc(radiusDecimalValue);
                   var w = this.width;
                   var h = this.height;
                   
                  
                   width = Math.trunc(w);
                   height = Math.trunc(h);
                   
                   mode = this.options.mode;
                   fontSize = this.options.fontSize;
                   fontFamily = this.options.fontFamily;
                   fontStyle =  this.options.fontStyle;
                   
                   strokColor = hexToRgbA(this.options.strokeStyle,px,py);
                   fillColor = hexToRgbABackground(this.options.fillStyle,px,py,itemWidth,itemHeight,mode);
                        if(this.options.fillStyle =='#FFFFFF'){
                            flag = false;
                        }else{
                            flag = true;
                        }
                        
                    arrayData = "{"
                       
                   if(mode =='circle'){
                       var circleJson ="{"+'"color"'+":"+'{'+strokColor+','+fillColor+'},"x":"'+px+'","y":"'+py+'","fill":"'+flag+'","radius":"'+radius+'"}';
                       circlesArray.push(circleJson);
                       var circ = '"circles"'+":["+circlesArray+"],";
                       allData +=circ;
                   }else if(mode =='rectangle'){
                       var rectJson = "{"+'"color"'+":"+'{'+strokColor+','+fillColor+'},"x":"'+px+'","y":"'+py+'","width":"'+itemWidth+'","height":"'+itemHeight+'","fill":"'+flag+'"}';
                       rectArray.push(rectJson); 
                       var rect = '"rectangles"'+":["+rectArray+"],";
                       allData +=rect;
                   }else if(mode =='ellipse'){
                       var ellipseJson = "{"+'"color"'+":"+'{'+strokColor+','+fillColor+'}, "x":"'+px+'","y":"'+py+'","width":"'+itemWidth+'","height":"'+itemHeight+'","fill":"'+flag+'"}';
                       ellipseArray.push(ellipseJson);
                       var ovals ='"ovals"'+":["+ellipseArray+"],";
                       allData += ovals;
                   }else if(mode =='text'){
                       let font = 0;
                       if(typeof this.fonts !=='undefined'){
                           font = this.fonts;
                       }
                       if(typeof this.lines !=='undefined'){
                            let sx = this.sx;
                            let sy = this.sy;
                            let smoveX,smoveY;
                            smoveX = this.smoveX;
                            smoveY = this.smoveY;
                            
                            let strokColorsForString = hexToRgbA(this.options.strokeStyle,sx,sy);
                            let  fillColorsForString = hexToRgbABackground(this.options.fillStyle,sx,sy,smoveX,smoveY,mode);
                            let textStrings = this.lines;
                            let stringJson = "{"+'"color"'+":"+'{'+strokColorsForString+','+fillColorsForString+'}, "x":"'+sx+'","y":"'+sy+'","width":"'+smoveX+'","height":"'+smoveY+'","fill":"'+flag+'","string":"'+textStrings+'","name":"'+fontFamily+'","style":"'+font+'","size":"'+fontSize+'"}';
                            stringArray.push(stringJson);
                            const string = '"strings"'+":["+stringArray+"],";
                            allData += string;
                       }
                   }
                  
                   this.lines ='';
                   _this = this;
               }
              
           } 
           $('#clear'+ntZone+sourceN+oXvalue+oYvalue+layoutN).on('click', function(e){
                    _this.clear();
                    circlesArray = [];
                    rectArray = [];
                    ellipseArray = [];
                    stringArray = [];
                    allData='';
                e.preventDefault();
             });
           
           $('#apply'+ntZone+sourceN+oXvalue+oYvalue).on('click', function(e){
               
                let source = $(this).attr('name');
                let display = $(this).attr('display');
                let layout = $(this).attr('layout');
                let zone = $(this).attr('zone');
                let location = $(this).attr('data').split(',');
                let xcord = location[0];
                let ycord = location[1];
                if(mode !='' && mode !='undefined'){
                   getCordinates(arrayData,allData,zone,layout,source,xcord,ycord,width,height);
                   mode='';
                   
               }else{
                   allData ='';
                   circlesArray=[];
                   rectArray =[];
                   ellipseArray = [];
                   stringArray = [];
                   getCordinates(arrayData,allData,zone,layout,source,xcord,ycord,width,height);
               }
               
             });
            }
            allData ='';
            circlesArray=[];
            rectArray =[];
            ellipseArray = [];
            stringArray = [];
            
        }
    
}

function hexToRgbA(hex,x,y){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        var rgba = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',255)';
        var rgba1 = rgba.replace(/[rgba(/\ )]/g,'').split(',');
        
        var string1 ='"x1":"'+x+'","y1":"'+y+'","red1":"'+rgba1[0]+'","green1":"'+rgba1[1]+'","blue1":"'+rgba1[2]+'","alpha1":"'+rgba1[3]+'"';
        return string1;
    }
    throw new Error('Bad Hex');
}

function hexToRgbABackground(hex,x,y,w,h,md){
    var c;
  
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
       
         if(md =='text'){
            var rgba = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',255)';
            var rgba1 = rgba.replace(/[rgba(/\ )]/g,'').split(',');
            var string2 ='"x2":"'+(x+w)+'","y2":"'+(y+h)+'","red2":"'+rgba1[0]+'","green2":"'+rgba1[1]+'","blue2":"'+rgba1[2]+'","alpha2":"'+rgba1[3]+'"';
        }else{
            
            var rgba = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',255)';
            var rgba1 = rgba.replace(/[rgba(/\ )]/g,'').split(',');
            var string2 ='"x2":"'+(x+w)+'","y2":"'+(y+h)+'","red2":"'+rgba1[0]+'","green2":"'+rgba1[1]+'","blue2":"'+rgba1[2]+'","alpha2":"'+rgba1[3]+'"';
        }
        
        return string2;
    }
    throw new Error('Bad Hex');
}

function apply(dData,alld,source,x,y,w,h){
    dData +=alld+ '"webframetotalwidth":"'+w+'","webframetotalheight":"'+h+'"}';
    
    $.ajax({
        type:"post",
        url: overlayurl+'source='+source+'&x='+x+'&y='+y+'',
        data:dData,
        success:function(res){
           
            Fnon.Hint.Success("The drawing has been successfuly created!", {
                callback:function(){
                }
              });
        },
        error:function(e){
            Fnon.Hint.Danger("Oops, something  went wrong!", {
                callback:function(){
                }
              });
        }
    });
}

function getCordinates(circles,alldata,zone,layout,source,cordx,cordy,width,height){
    
    $.ajax({
        type:"POST",
        url:'overlay/coordinates?zone='+zone+'&layout='+layout+'&source='+source+'&x='+cordx+'&y='+cordy+'',
        processData:false,
        contentType:false,
        cache:false,
        timeout:6000000,
        success:function(res){
           
           var newdata = JSON.parse(res);
           const cordX = newdata[0];
           const cordY = newdata[1];
          apply(circles,alldata,source,cordX,cordY,width,height);
           
        },
        error:function(e){
            Fnon.Hint.Danger("Oops, something  went wrong!", {
                callback:function(){
                }
              });
        }
    });
}

function getOriginalData(){
    $.ajax({
        url: listdisplays,
        "headers":{
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*",
          },
        type: "POST",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            temp2Array =[];
            tempZoneArray = [];
            var zoneN ='';
            var scope = response;
                let temp1String;
                let temp2String;
                var sourceNames=[];
                var sourceNames1 = [];
                for (var display of scope) {
                    var displayId = display.id;
                    var uniquedisplayId = displayId.replace(/ /g,"-");
                    for(var zone of display.zones){
                    
                       for(var cord of zone.zonecoordinates){
                             zonName = cord.name;
                             zoneN = cord.name; 
                             var data='';
                         for(var layout of cord.layouts){
                            let lName = layout.name;
                            
                            var key = uniquedisplayId+cord.name+lName;
                            
                            let rows = layout.rows;
                            let cols = layout.columns;
                        
                            if(layout.active){
                                layoutName = layout.name;
                                if(cols !=-1 && rows !=-1){
                                    var map = new Map();
                                    var references = layout.references;
                                    
                                    for (var reference of references) {
                                        var sourcename = reference.source.name;
                                    
                                        sourceNames.push(sourcename);
                                        temp1String =displayId+','+zonName+','+layoutName+','+sourceNames;
                                    
                                   
                                    
                                        data = {
                                        'zone': zonName,
                                        'layoutname':layoutName,
                                        'id':displayId,
                                        'sourcename': sourcename,
                                        'rows': rows,
                                        'columns': cols
                                        };
                                    
                                    if (zonName) {
                                        if (map.has(key)) {
                                            map.get(key).push(data);
                                        } else {
                                            var arr = [data];
                                            map.set(key, arr);
                                        }
                                    }
                                }
                                
                                for(let key of map.keys()){
                                     data = map.get(key);
                                    
                                } 

                               
                            
                            }else if(cols == -1 && rows == -1){
                                
                                for(let refs of layout.references){
                                    var sn = refs.source.name;
                                     sourceNames1.push(sn);
                                }
                                
                                temp2String =displayId+','+zonName+','+layoutName+','+sourceNames1;
                                
                            }
                            var sA = [];
                            var nsA = [];
                            var rs,cls;
                           
                            for(let i=0; i<data.length;i++){
                                var zn1 = data[i].zone;
                                var lytn = data[i].layoutname;
                                var ids = data[i].id;
                                var sname = data[i].sourcename;
                                sA.push(sname);
                                     rs = data[i].rows;
                                    cls = data[i].columns;
                                if(rs !=-1 && cls !=-1){
                                    temp1String =ids+','+zn1+','+lytn+','+sA;
                                    temp2Array.push(temp1String);
                                }else if(rs==-1 && cls==-1){
                                    nsA.push(sname);
                                    temp2String =ids+','+zn1+','+lytn+','+nsA;
                                    
                                }
                            }
                            
                        }
                        
                        }
                        
    
                    }
                    
                  } 
                    temp2Array.push(temp1String);
                    temp2Array.push(temp2String);
                    tempZoneArray.push(zoneN);
                  if(tempArray=='' || tempArray==null && zoneArray=='' || zoneArray==null){
                        tempArray = temp2Array;
                        zoneArray = tempZoneArray;
                  }

                  if(JSON.stringify(tempArray) !=JSON.stringify(temp2Array) || JSON.stringify(zoneArray) !=JSON.stringify(tempZoneArray)){
                      getDisplays();
                      tempArray = temp2Array;
                      zoneArray = tempZoneArray;
                  }
                  
            }
        },
        error: function (error, sts) {
           
        }
    });
}

function flexBoxRowsAndColumnMapped(rows,cols){

   
}

