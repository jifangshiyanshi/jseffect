
var moveInterId;
var angle = 0;
//旋转运动函数speed决定了速度和运动方向 
function moveCircle(speed){
   if(!(typeof moveInterId === 'undefined')){
      clearInterval(moveInterId);  
   }
   moveInterId = setInterval(function(){
      angle+= speed;
      $("#the-circle").rotate(angle);
   },50);
}

moveCircle(0.2);
//往一个方向运动一段时间又恢复原来的运动
function moveBack(speed){
   moveCircle(speed);
   setTimeout("moveCircle(0.2)",1000);
}


    


//以下是飞出线条的效果函数实现
function effect(param){
        /*
	var firstball = {x:100,y:100};//球位置  起始半径  结束半径 
	var firstline = {x1:100,y1:100,x2:200,y2:200};//起始位置 结束位置
	var secondline = {x1:200,y1:200,x2:300,y2:200};
	var secondball = {x:300,y:200};
	var textsit = {x:200,y:200,text:'helloword',color:'blue'};
	*/
       var data = {
		   begin:{x:0,y:0},
		   middle:{x:10,y:10},
		   end:{x:20,y:10},
		   text:'hello',
		   dom:document.body,
		   bgcolor:'black',
		   lineweight:1,
		   wordsize:20,
		   wordmove:25,
		   wordshadowcolor:'#ffffff',
		   circleborder:1,
		   circlebordercolor:'white',
		   linespeed:6,
       };
	   
       for(s in data){
		data[s] = (typeof param[s] == 'undefined')?data[s]:param[s];
		}
        var color = (typeof bgcolor == 'undefined')?'black':bgcolor;
		if(typeof data.dom.hasrun == 'undefined'){
		
        	var firstball = {
				x:data.begin.x,y:data.begin.y,dom:data.dom,bgcolor:data.bgcolor,border:data.circleborder,bordercolor:data.circlebordercolor
			};//球位置  起始半径  结束半径 
			
	        var firstline = {
				x1:data.begin.x,y1:data.begin.y,x2:data.middle.x,y2:data.middle.y,dom:data.dom,bgcolor:data.bgcolor,height:data.lineweight,
				speed:data.linespeed
			};//起始位置 结束位置
			
          	var secondline = {  //3 和 5 为了修改小bug
				x1:data.middle.x + 3,y1:data.middle.y-5,x2:data.end.x,y2:data.end.y,dom:data.dom,bgcolor:data.bgcolor,height:data.lineweight,
				speed:data.linespeed
			};
			
        	var secondball = {
				x:data.end.x,y:data.end.y,dom:data.dom,bgcolor:data.bgcolor,border:data.circleborder,bordercolor:data.circlebordercolor
			};
			
            //计算文字的倾斜
			var deg = calrotate(secondline.x1,secondline.y1,secondline.x2,secondline.y2);
			
			var textsit = {
				x:data.middle.x,y:data.middle.y-data.wordmove,text:data.text,color:data.bgcolor,dom:data.dom,deg:deg,size:data.wordsize,
				shadowcolor:data.wordshadowcolor
			};

		    totalanimate(firstball,firstline,secondline,secondball,textsit);
			
		    //data.dom.hasrun = true;
        } 

}



//一个统一的动画
function totalanimate(firstball,firstline,secondline,secondball,textsit){
	//firstball = {x:100,y:100};//球位置  起始半径  结束半径 
	//firstline = {x1:100,y1:100,x2:200,y2:200};//起始位置 结束位置
	//secondline = {x1:200,y1:200,x2:300,y2:200};
	//secondball = {x:300,y:200};
	//textsit = {x:200,y:200,text:'helloword',color:'blue'};
	var div = [];
	var fb1 = new circleanimate();
	var fb2 = new circleanimate();
	var fl1 = new lineanimate();
	var fl2 = new lineanimate();
	div.push(fb1.run(firstball));
	fb1.onend = function(){
		div.push(fl1.run(firstline));
	}
	fl1.onend = function(){
		div.push(fl2.run(secondline));
	}
	fl2.onend = function(){
		div.push(fb2.run(secondball));
	}
	fb2.onend = function(){  
		div.push(new wordanimate(textsit));
		//动画结束后 添加一个消除的功能
		setTimeout(function(){
			for(var i = 0;i< div.length; i++ ){
			    div[i].parentNode.removeChild(div[i]);
			}
		},3000);
	}
	
}


//画折线的函数   
var lineanimate = function(){ 
//构造函数为空是为了方便onend时间的编写 不需要嵌套编写
}
lineanimate.prototype.run = function(param){
    //参数
    var data = {x1:0,y1:0,x2:100,y2:100,width:0,height:1,bgcolor:'#000000',dom:document.body,speed:3};//width 起始长度 x1,y1 起点 x2,y2 终点
	for(s in data){
	  data[s] = (typeof param[s] == 'undefined')?data[s]:param[s];
	} 
	
	var maxWidth = 0;//达到最大的时候 调用函数
	var that = this;
	var cssText = '';
	maxWidth = Math.sqrt((data.y2-data.y1)*(data.y2-data.y1) + (data.x2 - data.x1)*(data.x2-data.x1));
	
	var div = document.createElement('div');
	data.dom.appendChild(div);
	
	var deg = calrotate(data.x1,data.y1,data.x2,data.y2);
	cssText += 'width:'+data.width+'px;height:'+data.height+'px;position:absolute;-webkit-transform-origin:0 0;-webkit-transform:rotate('+deg+'deg);';
	cssText += '-webkit-transform-origin:0 0;-webkit-transform:rotate('+deg+'deg);-moz-transform-origin:0 0;-moz-transform:rotate('+deg+'deg);';
	cssText += '-ms-transform-origin:0 0;-ms-transform:rotate('+deg+'deg);-os-transform-origin:0 0;-os-transform:rotate('+deg+'deg);'
	cssText += 'left:'+data.x1+'px;top:'+data.y1+'px;background-color:'+data.bgcolor;
	div.style.cssText += cssText;
	
	linemove();
	function linemove(){
	    data.width += data.speed;
	    div.style.width = data.width + 'px';
		if(data.width >= maxWidth) {
		   that.onend();
		}
		else
		  requestAnimFrame(linemove);
	}
	
	//用于删除 其实可以返回这个对象本身  然后div作为这个对象的属性 依然可以找到 
	return div;
}

lineanimate.prototype.onend = function(){}


//画圆的函数
//br初始半径 er结束半径
var circleanimate = function(){};
circleanimate.prototype.run = function(param){
	//参数处理
        var data = {x:0,y:0,br:0,er:10,bgcolor:'#000000',dom:document.body,border:1,bordercolor:'black'}
       	for(s in data){
	  data[s] = (typeof param[s] == 'undefined')?data[s]:param[s];
	}
    var r = data.br;
	var that = this;
	
	//css设置
	var cssText = '';
	var div = document.createElement('div');
	cssText += 'border:'+data.border+'px solid '+data.bordercolor+';';
	cssText += 'position:absolute;left:'+data.x+'px;'+'top:'+data.y+'px;width:'+r+'px;height:'+r+'px;';
	cssText += 'background-color:'+data.bgcolor+';border-radius:'+r+'px;margin-left:-'+(r/2)+'px;margin-top:-'+(r/2)+'px;';
	div.style.cssText += cssText;
	
	data.dom.appendChild(div);
	
	//动画处理
	circlemove();
	function circlemove(){
		if(r >= data.er){
			that.onend();
		}else{
			r++;
			div.style.width = r + 'px';
			div.style.height = r + 'px';
			div.style.marginLeft = -(r/2) + 'px';
			div.style.marginTop = -(r/2) + 'px';
			div.style.borderRadius = r+'px';
			requestAnimFrame(circlemove);
		}
	}
	return div;
	
}
circleanimate.prototype.onend = function(){}


//显示文字动画
var wordanimate = function(param){

	var data = {x:0,y:0,text:'hello world',color:'#000000',dom:document.body,deg:0,weight:700,size:30,shadowcolor:'#000000'};
	for(s in data){
	  data[s] = (typeof param[s] == 'undefined')?data[s]:param[s];
	}
	
	var div = document.createElement('div');
	div.innerHTML = data.text;
	data.dom.appendChild(div);
	
        var cssText = '';
	cssText += 'white-space:nowrap;text-shadow:1px 1px 1px '+data.shadowcolor+';';
	cssText += '-ms-transform-origin:0 0;-ms-transform:rotate('+data.deg+'deg);-moz-transform-origin:0 0;-moz-transform:rotate('+data.deg+'deg);';
	cssText += '-webkit-transform-origin:0 0;-webkit-transform:rotate('+data.deg+'deg);-o-transform-origin:0 0;-o-transform:rotate('+data.deg+'deg);';
	cssText += 'position:absolute;left:'+data.x+'px;top:'+data.y+'px;color:'+param.color+';font-weight:'+data.weight+';font-size:'+data.size+'px;';
	div.style.cssText = cssText;
	return div;
}



function calrotate(x1,y1,x2,y2){
	var x;
	if( x2 > x1 ){
	   x = Math.atan( (y2 - y1) / (x2 - x1) );
	   return x / (2 * (Math.PI))* 360;
	}else if( x2 == x1 ){
	   if( y1 > y2 ) return -90;
	   else return 90;
	}else if( x2 < x1 ){
		x = Math.atan( (y1 - y2) / (x1 - x2) );
	    var tmp =  Math.abs(x / (2 * (Math.PI))* 360);
		tmp = 180 - tmp;
		if( y1 > y2 ) return -tmp;
		else return tmp;
	}
  }
  
  
  //统一IE与其他浏览器的设置cssText的方式 主要是ie最后返回的cssText没有分号
  function addCssText(dom,cssText){
     var oldCssText = dom.style.cssText;
	 if(oldCssText.substring(oldCssText.length-2,oldCssText.length-1) == ';'){
		oldCssText = oldCssText.substr(0,oldCssText.length-1);
	 }
	 dom.style.cssText = oldCssText + ';'+cssText;
  }
  
  
  window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame   || 
		window.mozRequestAnimationFrame      || 
		window.oRequestAnimationFrame        || 
		window.msRequestAnimationFrame       || 
		function( run ){
			window.setTimeout(run, 16);
		};
})();

