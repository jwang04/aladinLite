/**
 * Controller handling the user actions in connection with the model 
 * 
 *  params = {canvas,canvaso, aladin}
 * 
 * Author Gerardo Irvin Campos yah
 */
function /**
 * @author michel
 *
 */
RegionEditor_mvC(params){

	this.poligone =  new RegionEditor_Mvc(params.points, params.handler, params.canvas, params.canvaso, params.aladinView);
	this.canvas = params.canvas; 	
	this.clientHandler = params.handler;
	this.startingNode= -1; 
	this.buttondown = false; 
	this.closed = false;	
	this.movestart = false;
	this.startdrag = false;
	this.drag = null;
	this.result = -1;
	this.stokeNode;
	var that = this;
}

RegionEditor_mvC.prototype = {
		getStatus: function() {
			 return "startingNode=" 
			        +this.startingNode + " buttondown=" 
			  		+ this.buttondown+ " closed=" 
			  		+ this.closed+ " movestart=" 
			  		+ this.movestart + " startdrag=" 
			  		+ this.startdrag + " drag=" 
			  		+ this.drag  + " result=" 
			  		+ this.result + " stokeNode=" 
			  		+ this.stokeNode
			  		;
		},
		/**
		 * TODO to be implemented
		 */
		checkPolygon : function(points) {
			return true;
		},
		/**
		 * 
		 */
		mouseDown : function(event) {
			var clickedNode = -1;
			var clickedSegment = -1;
			var x = parseInt(event.pageX) - parseInt( this.canvas.offset().left).toFixed(1);
			var y = parseInt(event.pageY) - parseInt( this.canvas.offset().top).toFixed(1);
					
			//pregunta si el pologono esta vacio
			if( this.poligone.isEmpty()) 
			{
				this.poligone.addNode(x,y);			 
			}
			//obtener segmento
			
			//comenzar el this.drag del nodo		
			else if(this.closed == true && (clickedNode = this.poligone.getNode(x,y)) != -1)
			{
				//console.log('start this.drag');
				//console.log('clickedNode: ' + clickedNode);
				this.result = this.poligone.getSegment(clickedNode);
				this.stokeNode = this.poligone.stokeNode(clickedNode);
				this.startdrag = true;		
				this.drag = clickedNode;
				this.startingNode = clickedNode;		
				this.canvas.css('cursor','move');
			}
			//pregunta si el espacio presionado es un nodo 
			else if((clickedNode = this.poligone.getNode(x,y)) != -1 )
			{
				//pregunta si es una extremidad
				if(this.poligone.isExtremity(clickedNode) /*poligono abierto*/) 
				{			
					//pregunta estas abierto
					if(this.closed == true)
					{
						this.startingNode = -1;
						this.buttondown = false;	
					}
					else
					{
						this.startingNode = clickedNode;
						this.buttondown = true;					
						this.closed = false;
					}
				}							
			} 		
			
			//saber si estoy sobre un segmento
			if(this.closed && clickedNode == -1)
			{						
				var node = this.poligone.GetNodelength();	
						
				var Segmentos = new Segment(node);	
				var option = Segmentos.IsCursorOn(x,y);
				
				if(option != undefined)
				{
					if(option.flag == "vertical")
					{
						//console.log("option: " + option.flag);
						this.poligone.addNode(x, y, option);
					}
					else if(option.flag == "horizontal")
					{
						//console.log("option: " + option.flag);
						this.poligone.addNode(x, y, option);
					}
					else if(option.flag == "distancia")
					{
						//console.log("option: " + option.flag);
						this.poligone.addNode(x, y, option);
					}
				}						
			
			}
			
		},
		/**
		 * 
		 */
		mouseMove : function(event) {
			var x = parseInt(event.pageX) - parseInt( this.canvas.offset().left).toFixed(1);
			var y = parseInt(event.pageY) - parseInt( this.canvas.offset().top).toFixed(1);
			//console.log("mouse move " + this.getStatus());
			//pregunta si el nodo fue presionado y si es un nodo
			if(this.buttondown == true  && this.startingNode != -1 )
			{
				//console.log ('this.drag');
				//console.log ('this.startingNode' + this.startingNode);
				this.movestart = true;
				this.poligone.drawHashline(this.startingNode,x,y,this.result);		
			}		
			else if(this.startdrag)
			{
				this.poligone.Drag(this.drag, x, y , this.result);
				
				//console.log('this.startdrag move');		
			}
			
//			var h2x = document.getElementById("idcoor");
//			h2x.innerHTML = 'X coords: '+x+', Y coords: '+y;
		},
		
		mouseUp: function(event) {
			var clickedNode = -1;
			var x = parseInt(event.pageX) - parseInt( this.canvas.offset().left).toFixed(1);
			var y = parseInt(event.pageY) - parseInt( this.canvas.offset().top).toFixed(1);		
		//pregunta nodo es presionado y es si es un nodo
			if(this.buttondown == true && (clickedNode = this.poligone.getNode(x,y)) != -1 )
			{		
				//pregunta si es un extremo
				if( this.poligone.isExtremity(clickedNode) == false) 
				{				
					this.poligone.CleanLine();				
					this.buttondown = false;
				}	
				
				//console.log('clickedNode: ' + clickedNode + ' this.startingNode: ' +  this.startingNode);
				if(this.poligone.closePolygone(clickedNode , this.startingNode) == true)
				{
					//console.log('this.closed polygon');					
					this.buttondown = false;	
					this.closed = true;
					//this.invokeHandler(false); if add this the length of skyPosition[] will be null
				
					//console.log('clickedNode: ' + clickedNode + ' this.startingNode: ' +  this.startingNode);							
				}
			} 
			
			if(this.closed == true && (finalnode = this.poligone.GetXYNode(x, y) ) != null)			
			{
				if(finalnode.a != undefined && finalnode.b != undefined)
				{
					//console.log('finalnode a: ' + finalnode.a + ' finalnode b: ' + finalnode.b);
					
					if(this.startingNode ==  finalnode.a)
						this.poligone.RemoveNode(finalnode.a,false);
					else if(this.startingNode ==  finalnode.b)
						this.poligone.RemoveNode(finalnode.b,false);
				}			
			}
					
			if(this.buttondown == true && this.movestart == true)
			{		
				if( clickedNode == this.startingNode && (clickedNode = this.poligone.getNode(x,y) != -1) )
				//if((clickedNode = this.poligone.getNode(x,y)) != -1)
				{											
					this.buttondown = false;		
					this.movestart = false;	
					this.poligone.CleanLine();							
				}				
				else
				{						
						this.poligone.addNode(x,y,this.startingNode);
						this.buttondown = false;		
						this.movestart = false;	
						
						var nodos = this.poligone.GetNodelength();					
						var Segmentos = new Segment(nodos);	
						var temp;
						
						var inter = Segmentos.Itersection(this.startingNode,false);
						
						if(inter != -1 && inter != undefined)
						{			
							//poligono abierto = true
							if(this.startingNode != 0)
								this.poligone.RemoveNode(inter.nB,true);
							else
								this.poligone.RemoveNode(inter.nA,true);
							
							this.poligone.CleanLine();
						}												
				}			
				
			}
			else if(this.buttondown == true && this.movestart == false)
			{			
				this.buttondown = false;		
				this.movestart = false;	
			}
			
			if(this.startdrag == true)
			{
				//console.log('this.startdrag fin');
				this.startdrag = false;
				this.canvas.css('cursor','default');
				
				//stoke le numero de noeud appuyer
				//this.startingNode;			
				
				var nodos = this.poligone.GetNodelength();					
				var Segmentos = new Segment(nodos);	
				var inter = Segmentos.Itersection(this.startingNode,true);			
				if(inter != -1 && inter != undefined)
				{						
					this.poligone.RemoveNode(this.startingNode, false);
					this.poligone.addNode(x, y, this.stokeNode,true);
					//console.log(inter.length);
				}
			}
			this.poligone.canvasUpdate();
		},
		
		almacenar : function()
		{
			this.poligone.almacenar();
		},
		
		recuperar : function()
		{
			this.poligone.recuperar();
		},
		
		DeleteOverlay : function() {
			this.poligone.DeleteOverlay();
		},
		
		CleanPoligon : function(){
			this.poligone.CleanPoligon();
			this.closed = false;
		},
		
		PolygonCenter : function(){
			this.poligone.PolygonCenter();
		},
	
		CreateGrafic : function(canvas){
			this.poligone.createGrafic(this.canvas);
		},
		
		show : function() {
			console.log(this.poligone.getSkyPositions());
			alert(this.poligone.getSkyPositions());
		},
		/**
		 * Set the polygone with points. Points is a simple array. It must have at 
		 * least 6 values (3pts) and an even number of points
		 * @param points  [a,b,c,.....]
		 * @returns {Boolean} true if the polygone is OK
		 */
		setPoligon : function(points) {
			this.poligone.setPolygon(points);
			this.closed = true;
			this.invokeHandler(false);
			return true;
		},
		/**
		 * Call the client handler when the polygine is close or when the user click on accept
		 * The data passed to the user handler look like that:
		    {isReady: true,             // true if the polygone is closed
		    userAction: userAction,     // handler called after the user have clicked on Accept
		    region : {
		        format: "array2dim",    // The only one suported yet [[x, y]....]
		        points: this.poligone.skyPositions  // array with structire matching the format
		        size: {x: , y:} // regiosn size in deg
		        }
		 */
		invokeHandler : function(userAction){
			if( this.closed || ( this.poligone.node == undefined || this.poligone.node.length == 0) ){
				/*
				 * Compute the region size in degrees
				 */
				for( var p=0 ; p< this.poligone.skyPositions.length ; p++ ) {
					for( var q=(p+1) ; q<length ; q++ ) {
						var x = Math.abs(this.poligone.skyPositions[p][0] - this.poligone.skyPositions[q][0]);
						if( x > 180 )x = 360 - x; 
						var y = Math.abs(this.poligone.skyPositions[p][1] - this.poligone.skyPositions[q][1]);
						if( y > 180 )y = 360 - y; 
					}
				}
				this.clientHandler({isReady: true
					, userAction: userAction
					, region : {format: "array2dim"
						       , points: this.poligone.skyPositions
							   , size: {x: x, y: y}}});
			} else {
				alert("Polygon not closed");
			}
		}
}
