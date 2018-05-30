/**
 * Manager of the view of the region editor
 * 
 * Author Gerardo Irvin Campos yah
 */ 
function RegionEditor_mVc(aladinLite_V, parentDivId, contextDivId, handler, points,defaultRegion){
	this.parentDivId = parentDivId;
	this.drawCanvas = null; // canvas where the polygon is drawn
	this.drawContext = null;
	this.lineCanvas = null; // canvas where the moving lines are drawn
	this.lineContext = null;
	this.controller = null;
	this.points = points; // Initial values
	this.clientHandler = (handler == null) ? function(){alert("No client handler registered");}: handler;
	this.contextDivId = contextDivId;
	this.contextDiv  = null;
	this.parentDiv  = null;
	this.aladinLite_V = aladinLite_V;
	this.defaultRegion = defaultRegion;
} 

RegionEditor_mVc.prototype = {
		init: function (){			
			var self = this;
			if( this.parentDiv == null )
				this.parentDiv = $('#' + this.parentDivId);
			if( this.contextDiv == null )
				this.contextDiv  = $('#' + this.contextDivId);
			//this.parentDiv.css("position", "relative");
			// création du canvas pour éditeur régions
			/*
			 * Be cautious: the canvas context must be taken before the canvas is appended to the parent div, otherwise the geometry is wrong. 
			 */
			this.lineCanvas = $("<canvas id='RegionCanvasTemp' class='editor-canvas'></canvas>");
			this.lineCanvas[0].width = this.parentDiv.width();
			this.lineCanvas[0].height = this.parentDiv.height();
			this.lineContext = this.lineCanvas[0].getContext('2d');	        
			this.parentDiv.append(this.lineCanvas);
			this.lineCanvas.css('z-index', '100');
			this.lineCanvas.css('position', 'absolute');
			this.lineCanvas.hide(); 

			/*
			 * Canvas pour les traces temporaires
			 */
			this.drawCanvas = $("<canvas id='RegionCanvas' class='editor-canvas' ></canvas>");
			this.drawCanvas[0].width = this.parentDiv.width();
			this.drawCanvas[0].height = this.parentDiv.height();
			this.drawContext = this.drawCanvas[0].getContext('2d');
			this.parentDiv.append(this.drawCanvas);
			this.drawCanvas.css('z-index', '101');
			this.drawCanvas.css('position', 'absolute');
			this.drawCanvas.hide(); 


			this.controller = new RegionEditor_mvC({ "points": this.points, "handler": this.clientHandler, "canvas": this.drawCanvas, "canvaso": this.lineCanvas, "aladinView": this.aladinLite_V});
			/*
			 * The controller function is wrapped in a function in order to make it working in the context of the controller object
			 * and not of he HTML widget
			 */
			var that = this;
			this.drawCanvas[0].addEventListener('mousedown', function(event) {/*console.log("down");*/ that.controller.mouseDown(event);}, false);
			this.drawCanvas[0].addEventListener('mousemove',  function(event) {that.controller.mouseMove(event);}, false);
			this.drawCanvas[0].addEventListener('mouseup', function(event) {/*console.log("up");*/ that.controller.mouseUp(event);}, false);

			/*----crear botones con jquery----*/
			/*var divButtons = $("<div id='RegionButtons' style=' width:"+ this.parentDiv.width() +'px' +" ';' '><div/>").appendTo("#" + this.parentDivId + "_button");        
			divButtons.css('background', 'gray');//'height:' "+ 200 +'px' +"';'
			divButtons.css('height', '70px');*/
			this.contextDiv.append('<p style="color:#1f252b;text-align:center">Region Editor Mode</p>')
			this.browseBtn = $("<button id='regionEditor_b' class='browse_btn btn'>Browse&nbsp;<i class='glyphicon glyphicon-check'></i></button>");
			this.contextDiv.append(this.browseBtn);
			this.browseBtn.css('margin-top','10px');
			this.browseBtn.css('margin-left','5px');
			this.browseBtn.css('font-weight',' bold');
			this.browseBtn.attr('disabled', 'disabled');
			this.browseBtn.click(function(event) {        	 
				that.controller.recuperar();   
				that.setBrowseMode();
				event.stopPropagation();
				that.aladinLite_V.reabledButton();

			});

			this.editBtn = $("<button id='regionEditor_e' class='edt_btn btn'>Edit&nbsp;<i class='glyphicon glyphicon-pencil'></i></button>");
			this.contextDiv.append(this.editBtn);
			this.editBtn.css('margin-top','10px');
			this.editBtn.css('margin-left','5px');
			this.editBtn.css('font-weight',' bold');
			this.editBtn.click(function(event) { 
				that.setEditMode();
				that.controller.DeleteOverlay()
				that.lineContext.clearRect(0, 0, that.lineCanvas[0].width, that.lineCanvas[0].height);            
				that.drawContext.clearRect(0, 0, that.drawCanvas[0].width, that.drawCanvas[0].height);
				that.controller.almacenar();
				that.aladinLite_V.disabledButton();
				event.stopPropagation();
			});


			/*this.centerBtn = $("<input type='button' id='edit' value='Center' />");
			this.contextDiv.append(this.centerBtn);
			this.centerBtn.css('margin-top','10px');
			this.centerBtn.css('margin-left','5px');
			this.centerBtn.click(function(event) {        	 
				that.controller.PolygonCenter();
				event.stopPropagation();
			});*/

			this.effacerBtn = $("<button id='regionEditor_c' class='clear_btn btn'>Clear&nbsp;<i class='glyphicon glyphicon-trash'></i></button>");
			this.contextDiv.append(this.effacerBtn);
			this.effacerBtn.css('margin-top','10px');
			this.effacerBtn.css('margin-left','5px');
			this.effacerBtn.css('font-weight',' bold');
			this.effacerBtn.click(function(event) {        	 
				that.controller.CleanPoligon();
				event.stopPropagation();
			});
			this.setBrowseMode();

			var buttonSet = $("<button id='regionEditor_a' class='accept_btn btn'>Accept&nbsp;<i class='glyphicon glyphicon-share'></i></button>");
			this.contextDiv.append(buttonSet);
			buttonSet.css('margin-top','10px');
			buttonSet.css('margin-left','5px');
			buttonSet.css('font-weight',' bold');
			buttonSet.click(function(event) {
				that.controller.recuperar();  
				that.setBrowseMode();
				that.controller.invokeHandler(true);
				that.aladinLite_V.reabledButton();
//				if(that.contextDiv.height() > 100 ){
//					that.contextDiv.animate({height:'-=200px'},"fast");
//				}
				document.getElementById("region").disabled=false;
				event.stopPropagation();
			});
			
			this.setInitialValue(self.defaultRegion);

		},
		/**
		 * Operate the drawing removal from outside 
		 */
		clean: function() {
			this.controller.CleanPoligon();				
			this.setEditMode();
			this.controller.DeleteOverlay()
			this.lineContext.clearRect(0, 0, this.lineCanvas[0].width, this.lineCanvas[0].height);            
			this.drawContext.clearRect(0, 0, this.drawCanvas[0].width, this.drawCanvas[0].height);
			this.controller.almacenar();	       
			this.controller.recuperar();   
			this.setBrowseMode();

		},
		/**
		 * Initalize the darw with the default parameter. If points contains a region, it is drawn, 
		 * if it just contain a position, AladinLite is centered on that position
		 * @param points  object denoting the initial value of the polygone : {type: ... value:} type is format of the 
		 * value (saadaql or array) and value is the data string wich will be parsed
		 */
		setInitialValue: function (points){
			/*
			 * Set the region passed by the client if it exists
			 */
			console.log(points)
			this.points = points;
			//this.controller.CleanPoligon();
			if( this.points ){
				var pts = [];
				/*
				 * Extract region or position from SaadaQL statement
				 */
				if( this.points.type == "saadaql") {
					var s = /"(.*)"/.exec(this.points.value);
					if( s.length != 2 ) {
						Modalinfo.error(this.points.value + " does not look like a SaadaQL statment");
						return;
					} else {
						if( this.points.value.startsWith("isInRegion")) {
							var ss = s[1].split(/[\s,;]/);
							for( var i=0 ; i<ss.length ; i++ ) {
								pts.push(parseFloat(ss[i]));
							}
						} else {
							var pos = s[1].replace(/:/g , " ");
							this.posField.val(pos);
							this.aladin.setZoom(0.55);
							this.aladin.gotoObject(pos);
						}
					}
				} else if (this.points.type == "array2dim") {
					pts = this.points.value;
				} else {
					alert("Polygone format " + points.type + " not understood");
					return;
				}

				this.setBrowseMode();
				this.controller.DeleteOverlay()
				this.controller.setPoligon(pts);
			}
			/*
			 * Fix for the errors when we open a new region editor
			 */
//			var that = this;
//	           setTimeout(function() {
//                   that.aladin.increaseZoom();
//                   that.aladin.decreaseZoom();
//                   }, 500);

		},
		setBrowseMode: function() {
			this.editBtn.removeAttr('disabled');
			this.browseBtn.attr('disabled', 'disabled');   
			this.effacerBtn.attr('disabled', 'disabled');                      
			this.lineCanvas.hide();
			this.drawCanvas.hide();
		},
		setEditMode: function() {
			this.browseBtn.removeAttr('disabled');
			this.editBtn.attr('disabled', 'disabled');   
			this.effacerBtn.removeAttr('disabled');                
			this.lineCanvas.show();
			this.drawCanvas.show();
		},

}

