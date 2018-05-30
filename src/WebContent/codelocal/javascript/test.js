function ModalAladin (){
	/**
	 * Resources used by 
	 */
	this.aladin = null;
	this.divAladinContainer = "aladin-lite-container";
	this.divAladin          = "aladin-lite-catdiv";
	this.divInfoAladin      = "aladin-lite-catdiv-info";
	this.divInfoSider       = "aladin-lite-sider";
	this.jqAladinContainer;
	this.jqAladin;
	this.divInfoAladin;
	this.colorMap = new Object();
	this.colorMap["Vizier"] = {bg: "green", fg : "white"};
	this.colorMap["Simbad"] = {bg:"blue", fg : "white"};
	this.colorMap["NED"]    = {bg:"orange", fg : "black"};
	this.colorMap["target"] = {bg:"red", fg : "white"};
	this.colorMap["service_0"] = {bg:"#00ffff", fg : "black"};// Aqua 
	this.colorMap["service_1"] = {bg:"#66ff33", fg : "black"}; // vert pomme
	this.colorMap["service_2"] = {bg:"#ff9966", fg : "black"}; //salmon
	this.colorMap["service_3"] = {bg:"yellow", fg : "black"}; 
	this.initialTarget;
	this.initialFoV;
	this.initialSwarm=null;
}

	/**
	 * Starts Aladin in an hidden panel
	 */
	
ModalAladin.prototype = {	
		

	init : function (){
		if( this.aladin == null ){
			/*
			 * Attach the panel components to the body.
			 */
			$('body').append("<div id=" + this.divAladinContainer + " style='visibility: hidden;padding-top: 140px;padding-left:200px;'>"
					+ "<div  id=" + this.divInfoSider + " style='display: block;float: left;width: 200px; height: 100%; padding-right: 5px;'></div>"
					+ "<div style='position: relative; display: block;float:left;width: 400px'>"
					+ "   <div id='" + this.divAladin + "' style='width: 400px; height: 400px'></div>"
					+ "   <div id='itemList' style='background-color: #f2f2f2; border-radius: 5px; padding: 5px; margin: 5px; display: none; overflow:auto;position: absolute; left: 0px; top: 0px; width: 390px; height: 90%;'></div>"
					+ "</div></div>");
			
			
			/*
			 * Starts Aladin without target or survey to make sure it can immedialtely handle API callbacks
			 */
			this.aladin = A.aladin('#' + this.divAladin , {
				showLayersControl : true,
				showGotoControl: true,
				showZoomControl: true,
				showFullscreenControl: false,
				showReticle: true,
				showFrame: true,
				cooFrame : "ICRS"}
			);		
			this.jqAladinContainer = $("#" + this.divAladinContainer);
			this.jqAladin          = $("#" + this.jqAladin);
			this.jqInfoAladin      = $("#" + this.divInfoAladin);
		}
	},
	/**
	 * Hide info panel on the top o AL
	 */
	hideInfo : function() {
		this.jqInfoAladin.text("").attr("rows", 1).css("visibility", "hidden");
	},
	/**
	 * Show info panel on the top o AL
	 */
	showInfo : function() {
		this.jqInfoAladin.text("Click to get source info").attr("rows", 6).css("visibility", "visible");
	},
	/**
	 * 
	 */
	hideSidePanel : function(){
		$("#" + this.divInfoSider).css("visibility", "hidden");
	},
	/**
	 * 
	 */
	showSidePanel : function(){
		$("#" + this.divInfoSider).css("visibility", "visible");
	},

	/**
	 * Display the message into the info panel.
	 * Mesage can be either an objct (then dumped) or an atomic value
	 */
	displayInfo : function(message){
		if( message instanceof Object ) {
			this.jqInfoAladin.text(Modalinfo.dumpAscii(message, '   '));
		} else {
			this.jqInfoAladin.text(message);
		}
	},
	/**
	 * Set the black shadow for a dialog
	 * The same is used by modalinfo
	 * @id: id of the dialog
	 */
//	setShadow : function(id){
//		var z_modal = $("#"+id).parent(".ui-dialog").zIndex();
//		if($("#shadow").length == 0) {
//			$('body').append('<div id="shadow" pos="'+id+'"></div>');
//			$('#shadow').zIndex(z_modal-1);
//		}
//		else {
//			$('body').append('<div class="shadow" pos="'+id+'"></div>');
//			$('div[pos="'+id+'"]').zIndex(z_modal-1);
//		}
//		jqShadow = $('div[pos="'+this.divAladinContainer+'"]')
//
//	},

	/**
	 * Make te dialog component no longer visible
	 */
	closeHandler : function() {
		/*
		 * Class all Aladin popup 
		 */
		$('#' + divAladin + ' .aladin-popup-container').hide();
		/*
		 * Make sure Aladin won't be displayed on the page bottom
		 */
		jqAladinContainer.css("visibility", "hidden")
		jqAladinContainer.dialog('destroy');
		jqShadow.remove();
	},
	/**
	 * Open the dialog windows with Aladin and setup the close prcoedure 
	 */
	buildAladinDialog : function (title){ 
		ModalAladin.init();	
		aladin.removeLayers();
		var theA=$("#" + divAladinContainer);
		jqAladinContainer.css("visibility", "visible")
		jqAladinContainer.dialog();
		jqAladinContainer.dialog({resizable: false
			, width: 'auto'
				, title: title
				, close: function(event,obj){
					closeHandler();
				}
		});
		setShadow(divAladinContainer);
		jqShadow.click(function() {
			closeHandler();
		});
		jqAladinContainer.prev("div").find("a.ui-dialog-titlebar-close.ui-corner-all").click(function() {
			closeHandler();
		});
	},

	/**
	 * Open a modal panel with AL. The image is overlayed with a catalogue given either as an URL or as an array of points
	 * A handler can, be given to process mousover events
	 * data:
	 * {
	 * label: ....
	 * target:
	 * fov: 
	 * url: ....
	 * (or) points : [{ra, dec, name, description}..]
	 * }
	 */
	showSourcesInAladinLite : function (data) {	
		buildAladinDialog(data.label);
		showInfo();
		hideSidePanel();
		if( aladin.view.imageSurvey == null ||  aladin.view.imageSurvey.id == null ) {
			aladin.setImageSurvey('P/XMM/PN/color');
			aladin.gotoObject(data.target);
			aladin.setZoom(data.fov);
		}
		var objClicked;
		if( data.url ) {
			var cat = A.catalogFromURL(data.url, {sourceSize:8, color: 'red', onClick:"showTable"});
			aladin.addCatalog(cat);
			/*
			aladin.on('objectClicked', function(object) {
				var msg;
				if( objClicked ) {
					objClicked.deselect();
				}
				if (object) {
					objClicked = object;
					object.select();
					msg = "Position: " + object.ra + ', ' + object.dec +  Modalinfo.dumpAscii(object.data, '  ');
				} else {
					msg = "Click to get source info";
				}
				$('#' + divInfoAladin).text(msg);
			});
			 */
		} else if( data.points ) {
			var cat = A.catalog({name: 'Source List', sourceSize: 8});
			aladin.addCatalog(cat);
			for( var i=0 ; i<data.points.length ; i++ ){
				var point =  data.points[i];
				cat.addSources([A.marker(point.ra, point.dec, {popupTitle: point.name, popupDesc: point.description})]);
			}
		}
	},


	/** 
	 * Open aladin lite and marks the position given in params
	 * A popup is displayed on the Aladin Screen when th mark is clicked
	 * params:{
	 * ra 
	 * dec 
	 * name 
	 * description }
	 * */
	showSourceInAladinLite : function (params) {
		showSourcesInAladinLite({target: params.ra + " " + params.dec
			, label: params.name
			, fov: ((params.fov)? patrams.fov: 0.5)
			, points: [{ra: params.ra, dec: params.dec, name: params.name, description: params.description}]});
		hideInfo();
		hideSidePanel();
	},

	/**	
	 * Get a list of points through and AJAX call and display it in Aladin  Lite
	 * data:
	 * {
	 * label: ... panel titke
	 * target: .. central position (can be a name)
	 * fov: .. fov size in deg
	 * url: .. must return an array point points like;  [{ra, dec, name, description}..]
	 * }
	 */
	showAsyncSourcesInAladinLite : function (data) {				
		Processing.show("Fetching data");
		$.getJSON(data.url, function(jsondata) {
			Processing.hide();
			if( Processing.jsonError(jsondata, data.url) ) {
				return;
			} else {
				showSourcesInAladinLite({
					label: data.label,
					target: data.target,
					fov: data.fov,
					points : jsondata
				})
			}
		});
	},

	center : function() {
		aladin.setZoom(initialFov);
		aladin.gotoObject(initialTarget);
	},
	/**
	 * position { target: '13:05:44.90+17:53:28.9', fov: 0.016, title:'3XMM J130544.8+175328'} or
	 *          { swarm: 'http:/something....',title:'3XMM J130544.8+175328'}
	 *          { region: stcregion title:'3XMM J130544.8+175328'}
	 * stcregion: {"stcString":"Polygon ICRS UNKNOWNREFPOS SPHERICAL2 48.08864682613741 -43.34294001968425 48.04499151548045 -45.25890768286587 50.76739411109153 -45.25886082596674 50.72361221832557 -43.34289619542031"
	 *            ,"size":2.7224025956110793
	 *            ,"raCenter":49.40619281328598,"decCenter":-44.30090193914309
	 *            ,"points":[[48.08864682613741,-43.34294001968425],[48.04499151548045,-45.25890768286587],[50.76739411109153,-45.25886082596674],[50.72361221832557,-43.34289619542031],[48.08864682613741,-43.34294001968425]]}
	 * services : [{type: 'json', name: 'ACDS', url: 'http://xcatdb.unistra.fr/3xmmdr5//getarchesdetail/acdslinks?oid=581249378845461815&mode=aladinlite'}, {type: 'json', name: 'Photometric points', url: 'http://xcatdb.unistra.fr/3xmmdr5/getarchesxmatchpoints?oid=581249378845461815'}, {type: 'votable', name: 'Cluster components', url: 'http://xcatdb.unistra.fr/3xmmdr5/download?oid=294989349005558113'}]
	 * 
	 */
	aladinExplorer : function(position, services) {
		initialSwarm=null;
		if( position == undefined || (position.swarm != null && position.swarm.indexOf("localhost") != -1) ){
			Modalinfo.info("Aladin Lite cannot operate services running on localhost<br>It can only work with services accessible from the CDS server", "Access denied");
			return;
		} 
		if( services != null ){
			for(var s=0 ; s<services.length ; s++ ){
				if( services[s].url.indexOf("localhost") != -1 ){
					Modalinfo.info("Aladin Lite cannot operate services running on localhost<br>It can only work with services accessible from the CDS server", "Access denied");
					return;
				} 			
			}
		}
		this.init();	
		this.showSidePanel();
		this.aladin.removeLayers();
		var theA=$("#" + this.divAladinContainer);
		var theS=$("#" + this.divInfoSider);
		theS.html("");
		this.jqAladinContainer.css("visibility", "visible")
		this.jqAladinContainer.dialog();
		this.jqAladinContainer.dialog({
			resizable: false
			, width: 'auto'
				, title: ((position.title)? position.title: 'Aladin Explorer')
				, close: function(event,obj){
					closeHandler();
				}
		});
		var RaDec ;
		this.aladin.setImageSurvey('http://alasky.u-strasbg.fr/2MASS/J');
		/*
		 * Insert target anchor
		 */
		theS.html("");
		theS.append("<p id='service_target' title='Show&center/hide the target' class='datahelp' style='cursor: pointer;'>Target</p>");
		/*
		 * The ref prosition is given as a simple position
		 */
		if( position.target != undefined ) {
			this.aladin.gotoObject(position.target);
			this.aladin.setZoom(position.fov);
			initialTarget = position.target;
			initialFov = position.fov;
			RaDec = this.aladin.getRaDec();
			this.addServices(position, services, theS, RaDec);
		} else if( position.region != undefined ) {
			aladin.gotoObject(position.region.raCenter + ' ' + position.region.decCenter);
			aladin.setZoom(2*position.region.size);
			var overlay = A.graphicOverlay({color: 'red', lineWidth: 2});
			aladin.addOverlay(overlay);
			overlay.addFootprints(A.polygon(position.region.points));             
			RaDec = aladin.getRaDec();
			this.addServices(position, services, theS, RaDec);		
		} else if( position.swarm != undefined ) {
			Processing.showWithTO("Fetching Data", 5000);
			var cat = A.catalogFromURL(position.swarm, {name: 'Swarm', sourceSize:8, shape: 'plus', color: 'red', onClick:"showTable", }
			, function(sources) {
				/*
				 * Defines the field enclosing the data selection
				 * which is supposed to be smaller that 180deg along RA
				 */
				var raMin = 1000 ; raMax = -1;
				var decMin = 90 ; decMax = -90;
				for( var s=0 ; s<sources.length ; s++){
					source = sources[s];
					if( source.ra > raMax)  raMax = source.ra;
					if( source.ra < raMin) raMin = source.ra;
					if( source.dec > decMax) decMax = source.dec;
					if( source.dec < decMin) decMin = source.dec;
				}
				var decFov = decMax - decMin
				var decCenter = (decMax + decMin)/2;
				
				/*
				 * Takes the smallest fov along of RA
				 */
				var raFov = Math.abs(raMin - raMax);
				if( raFov > 180 ) raFov = 360 - raFov;
				var raCenter = (raMax + raMin)/2;
				if( Math.abs(raMax - raCenter) > 90 ) raCenter += 180;
				if( raCenter > 360 ) raCenter -= 360;
				var fov = (decFov > raFov)? decFov: raFov;
				
				console.log(raFov + " " + raCenter);
			
				aladin.gotoRaDec(raCenter , decCenter);
				aladin.setZoom(fov);
				RaDec = aladin.getRaDec();
				initialTarget = (decCenter > 0)? (raCenter + " +" +  decCenter): (raCenter + " -" +  decCenter);
				initialFov = fov;
				initialSwarm = position.swarm
				Processing.hide();
				addServices(position, services, theS, RaDec);		
				});
			aladin.addCatalog(cat);
			var caller = $("#service_target");
			caller.attr("class", "selecteddatahelp");
			caller.css("color", colorMap['target'].fg);
			caller.css("background-color", colorMap['target'].bg);
		}
	},
	/**
	 * Add all service but the targer (internal use)
	 */
	addServices : function(position, services, theS, RaDec) {
		/*
		 * Insert user services
		 */
		for( var s=0 ; s<services.length; s++){
			var id = "service_" + s;
			theS.append("<p id='" + id + "' title='Show/hide data overlay' class='datahelp' style='cursor: pointer;'>" + services[s].name + "</p>");
			services[s].color = this.colorMap['service_' + s];
			$("#" + id).data(services[s]);
		}
		/*
		 * Activate user services. Must be done before inserting standards services
		 * which are served by specific methods
		 */
		$("#" + this.divInfoSider + " p").click(function(){
			var caller = $(this);
			var data = $(this).data(); 
			if( caller.attr("class") == "selecteddatahelp"){
				caller.css("color", "");
				caller.css("background-color", "white");
				caller.attr("class", "datahelp");
				for( var c=0 ; c<aladin.view.catalogs.length ; c++) {
					// a surveiller console.log(c + " " + aladin.view.catalogs[c].name + " "  + data.name)
					if( aladin.view.catalogs[c].name == "Target" || aladin.view.catalogs[c].name == "Swarm" ||aladin.view.catalogs[c].name.startsWith(data.name))  {
						aladin.view.catalogs.splice(c, 1);
						aladin.view.mustClearCatalog = true;
						aladin.view.requestRedraw(); 
						break;
					}
				}
				return;
			} else {
				var color = (caller.attr("id") == 'service_target')? this.colorMap['target']: data.color;
				caller.attr("class", "selecteddatahelp");
				caller.css("color", color.fg);
				caller.css("background-color", color.bg);
				/*
				 *  popup target
				 */
				if( caller.attr("id") == 'service_target'){
					caller.css("color", color.fg);
					caller.css("background-color", color.bg);
					/*
					 * target is an URL: reload the catalog
					 */
					if( initialSwarm != null ){
						Processing.showWithTO("Fetching Data", 5000);
						aladin.gotoObject(initialTarget);
						var cat = A.catalogFromURL(position.swarm
								, {name: 'Swarm', sourceSize:8, shape: 'plus', color: 'red', onClick:"showTable", }
								, function(){Processing.hide();});
						aladin.addCatalog(cat);
					/*
					 * Otherewise, juste show the position 
					 */
					} else {
						var cat = A.catalog({name: "Target"});
						aladin.gotoObject(initialTarget);
						aladin.addCatalog(cat);
						cat.addSources([A.marker(RaDec[0], RaDec[1], {popupTitle: position.title, /*popupDesc: ''*/})]);
					}
				/*
				 *  Other user service: consider fisrt the VOTable which can be read by AL
				 */
				} else	if( data.type == 'votable') {
					Processing.showWithTO("Fetching Data", 5000);
					var cat = A.catalogFromURL(data.url
							, {name: data.name, sourceSize:8, shape: 'plus', color: data.color.bg, onClick:"showTable"}
							, function(){Processing.hide();});
					aladin.addCatalog(cat);
				/*
				 * Then consider JSON files for which the catalog point mustr be created one by one to feed AL
				 */
				} else {
					$.getJSON(data.url, function(jsondata) {
						Processing.hide();
						if( Processing.jsonError(jsondata, data.url) ) {
							return;
						} else {
							var objClicked;
							var cat = A.catalog({name: data.name, sourceSize: 8, color: data.color.bg, shape: 'plus', onClick:"showTable"});
							aladin.addCatalog(cat);
							for( var i=0 ; i<jsondata.length ; i++ ){
								var point =  jsondata[i];
								cat.addSources([A.source(point.ra, point.dec, {ra: Numbers.toSexagesimal(point.ra/15, 7, false), dec:  Numbers.toSexagesimal(point.dec, 7, true), Name: point.name, Description: point.description})]);
							}
						}
					});
				}
			}
		});
		/*
		 * Adding simbad selector
		 */
		var s=services.length;
		id = "service_simbad";
		theS.append("<hr><p id='" + id + "' title='Show/hide Simbad sources' class='datahelp' style='cursor: pointer;' "
				+ "onclick='ModalAladin.displaySimbadCatalog();'>Simbad</p>");
		$("#" + id).data({name: 'Simbad'});
		/*
		 * Adding NED selector
		 */
		s++;
		id = "service_ned";
		theS.append("<p id='" + id + "' title='Show/hide NED sources' class='datahelp' style='cursor: pointer;' "
				+ "onclick='ModalAladin.displayNedCatalog();'>NED</p>");
		$("#" + id).data({name: 'NED'});

		/*
		 * Adding Vizier selector
		 */
		s++;
		id = "service_vizier";
		theS.append("<p id='" + id + "' title='Show/hide selected catalog sources' class='datahelp' style='cursor: pointer;' onclick='ModalAladin.toggleSelectedVizierCatalog();'>Vizier...</p><div id='AladinHipsCatalogs'></div>");
		$("#" + id).data({name: 'VizieR'});
		var he = new HipsExplorer_mVc({
			aladinInstance: this.aladin,
			parentDivId: "AladinHipsCatalogs", 
			formName   : "AladinHipsCatalogsExplorer", 
			target     : {ra: RaDec[0], dec : RaDec[1], fov: position.fov},
			productType: "catalog",
			handler    : function(jsondata){
				var itemList = $("#itemList");
				if( itemList.css("display") == "none"){
					itemList.css("display", "block");
					itemList.css("z-index", "10000");
				}
				itemList.html("<span class=strong>" + jsondata.length + " matching Catalogues</span>"
						+ '<a href="#" onclick="$(&quot;#itemList&quot;).css(&quot;display&quot;, &quot;none&quot;);" style="top: 18px;" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick">close</span></a><br>');
				for(var i=0 ; i<jsondata.length ; i++){
					itemList.append("<br><span class=datahelp style='cursor: pointer' "
							+ "onclick='ModalAladin.displaySelectedVizierCatalog(&quot;" + jsondata[i].obs_id + "&quot);'>"  
							+ jsondata[i].obs_title + "</span><br>"
							+ "<span class=blackhelp>"
							+ jsondata[i]. obs_regime + "</span><br>"
							+ "<span class=blackhelp>"
							+ jsondata[i].obs_description + "</span>");
				}
			}
		});
		he.draw();
		/*
		 * Adding Hips survey selector
		 */
		id = "service_aladin";
		theS.append("<hr><p id='" + id + "' title='Change image survey' class='datahelp' style='cursor: pointer;'>Images...</p><div id='AladinHipsImages'></div>");
		var he = new HipsExplorer_mVc({
			aladinInstance: this.aladin,
			parentDivId: "AladinHipsImages", 
			formName   : "AladinHipsImagesExplorer", 
			target     : {ra: RaDec[0], dec : RaDec[1], fov: position.fov},
			productType: "image",
			handler    : function(jsondata){
				var itemList = $("#itemList");
				if( itemList.css("display") == "none"){
					itemList.css("display", "block");
					itemList.css("z-index", "10000");
				}
				itemList.html("<span class=strong>" + jsondata.length + " matching Hips images</span>\n"
				+ '<a href="#" onclick="$(&quot;#itemList&quot;).css(&quot;display&quot;, &quot;none&quot;);" style="top: 18px;" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick">close</span></a><br>');
				for(var i=0 ; i<jsondata.length ; i++){
					itemList.append("<br><span class=datahelp style='cursor: pointer' onclick='ModalAladin.displaySelectedHips(&quot;" + jsondata[i].obs_title 
							+ "&quot;, &quot;" + jsondata[i].hips_service_url
							+ "&quot;, &quot;" + jsondata[i].hips_frame
							+ "&quot;, &quot;" + jsondata[i].hips_order
							+ "&quot;, &quot;" + jsondata[i].hips_tile_format
							+ "&quot;)'>"  + jsondata[i].obs_title + "</span><br>"
							+ "<span class=blackhelp>"
							+ jsondata[i].publisher_did + "</span><br>"
							+ "<span class=blackhelp>"
							+ jsondata[i]. obs_regime + "</span><br>"
							+ "<span class=blackhelp>"
							+ jsondata[i].obs_description + "</span>");
				}
			}
		});
		he.draw();
		/*
		 * Popup setup
		 */
		//this.setShadow(this.divAladinContainer);
//		this.jqShadow.click(function() {
//			closeHandler();
//		});
//		jqAladinContainer.prev("div").find("a.ui-dialog-titlebar-close.ui-corner-all").click(function() {
//			closeHandler();
//		});
		/*
		 * Display DSS color by default
		 */
		this.displaySelectedHips("DSS2 optical HEALPix survey, color (R=red[~0.6um]/G=average/B=blue[~0.4um])"
				, "http://alasky.u-strasbg.fr/DSS/DSSColor"
				, "equatorial"
				, 9
				, "jpeg");
	},
	/**
	 * 
	 */
	displaySelectedHips : function (obs_title, hips_service_url, hips_frame, moc_order, hips_tile_format) {	
		var cmdNode = $("#service_aladin");
		$("#itemList").css("display", "none");
		cmdNode.html(obs_title);
		var fmt = "";
		if(hips_tile_format.indexOf("png") >=0  ){
			fmt = "png";
		} else {
			fmt = "jpg";
		}
		if( fmt != "")
			this.aladin.setImageSurvey(this.aladin.createImageSurvey(obs_title, obs_title, hips_service_url, hips_frame, moc_order, {imgFormat: fmt})  );
		else 
			this.aladin.setImageSurvey(this.aladin.createImageSurvey(obs_title, obs_title, hips_service_url, hips_frame, moc_order)  );
	},
	displaySelectedVizierCatalog : function (obs_id) {	
		if( obs_id == undefined ||  obs_id == "" || obs_id.startsWith("Vizier...")) {
			Modalinfo.info("you must first select a catalogue");
			var cmdNode = $("#service_vizier");
			cmdNode.css("color", "");
			cmdNode.css("background-color", "white");
			return;
		}
		var cmdNode = $("#service_vizier");
		for( var c=0 ; c<aladin.view.catalogs.length ; c++) {
			if( aladin.view.catalogs[c].name.startsWith("VizieR"))  {
				aladin.view.catalogs.splice(c, 1);
				aladin.view.mustClearCatalog = true;
				aladin.view.requestRedraw(); 
				break;
			}
		}
		$("#itemList").css("display", "none");
		cmdNode.attr("class", "selecteddatahelp");
		cmdNode.css("color", colorMap['Vizier'].fg);
		cmdNode.css("background-color", colorMap['Vizier'].bg);
		cmdNode.html(obs_id);
		var fov =  limitFov();
		Processing.show("Fetching Vizier data");
		aladin.addCatalog(A.catalogFromVizieR(obs_id
				, aladin.getRaDec()[0] + " " + aladin.getRaDec()[1]
				, fov
				, {onClick: 'showTable', color: colorMap['Vizier'].bg}
				, function() {Processing.hide(); }
		));
	},
	toggleSelectedVizierCatalog : function () {	
		var cmdNode = $("#service_vizier");
		$("#itemList").css("display", "none");
		if( cmdNode.attr("class") == "selecteddatahelp" ) {
			cmdNode.css("color", "");
			cmdNode.css("background-color", "white");
			cmdNode.attr("class", "datahelp");
			for( var c=0 ; c<aladin.view.catalogs.length ; c++) {
				if( aladin.view.catalogs[c].name.startsWith("VizieR"))  {
					aladin.view.catalogs.splice(c, 1);
					aladin.view.mustClearCatalog = true;
					aladin.view.requestRedraw(); 
					break;
				}
			}

		} else {
			cmdNode.attr("class", "selecteddatahelp");
			displaySelectedVizierCatalog($("#service_vizier").html());
		}
	},
	displaySimbadCatalog : function () {	
		var cmdNode = $("#service_simbad");
		if( cmdNode.attr("class") == "selecteddatahelp" ) {
			cmdNode.css("color", "");
			cmdNode.css("background-color", "white");
			cmdNode.attr("class", "datahelp");
			for( var c=0 ; c<aladin.view.catalogs.length ; c++) {
				if( aladin.view.catalogs[c].name.startsWith("Simbad"))  {
					aladin.view.catalogs.splice(c, 1);
					aladin.view.mustClearCatalog = true;
					aladin.view.requestRedraw(); 
					break;
				}
			}
		} else {
			var fov =  limitFov();
			cmdNode.attr("class", "selecteddatahelp");
			cmdNode.css("color", colorMap['Simbad'].fg);
			cmdNode.css("background-color", colorMap['Simbad'].bg);
			Processing.show("Fetching Simbad data");
			aladin.addCatalog(A.catalogFromSimbad(aladin.getRaDec()[0] + " " + aladin.getRaDec()[1]
			, fov
			, {onClick: 'showTable', color: colorMap['Simbad'].bg}
			, function() {Processing.hide(); }
			));
		}
	},
	displayNedCatalog : function () {	
		var cmdNode = $("#service_ned");
		if( cmdNode.attr("class") == "selecteddatahelp" ) {
			cmdNode.css("color", "");
			cmdNode.css("background-color", "white");
			cmdNode.attr("class", "datahelp");
			for( var c=0 ; c<aladin.view.catalogs.length ; c++) {
				if( aladin.view.catalogs[c].name.startsWith("NED"))  {
					aladin.view.catalogs.splice(c, 1);
					aladin.view.mustClearCatalog = true;
					aladin.view.requestRedraw(); 
					break;
				}
			}
		} else {
			cmdNode.attr("class", "selecteddatahelp");
			cmdNode.css("color", colorMap['NED'].fg);
			cmdNode.css("background-color", colorMap['NED'].bg);
			var fov =  limitFov();
			Processing.show("Fetching Ned data");
			aladin.addCatalog(A.catalogFromNED(aladin.getRaDec()[0] + " " + aladin.getRaDec()[1]
			, fov
			, {onClick: 'showTable', color: colorMap['NED'].bg}
			, function() {Processing.hide(); }
			));
		}
	},
	limitFov : function () {
		var fov = aladin.getFov()[0];
		if( fov > 0.5 ) {
			Modalinfo.info("Search radius limted to 1/4deg", "Warning")
			fov = 0.25;
		}
		return fov;
	},

	/**
	 * Create a STC Region dialog
	 * data format
	 * stcString: "POLYGON ICRS 213.8925 44.575 213.8925 45.295 214.6125 45.295 214.6125 44.575"
   		size: 0.7199999999999989
   		raCenter: 214.2525
   		decCenter: 44.935
   		points: [[..., ...] .... ]
	 */
	showSTCRegion : function (stcRegion) {	
		ModalAladin.init();	
		buildAladinDialog("STC Region Viewer");
		aladin.setImageSurvey("P/DSS2/color");
		aladin.gotoObject(stcRegion.raCenter + ' ' + stcRegion.decCenter);
		aladin.setZoom(2*stcRegion.size);
		displayInfo(stcRegion.stcString);
		var overlay = A.graphicOverlay({color: 'red', lineWidth: 2});
		aladin.addOverlay(overlay);
		overlay.addFootprints(A.polygon(stcRegion.points));             
	},

	/**
	 * Public part of the object
	 */ 
}
/*****************************************************
 * Some global variables
 */

var rootUrl = "http://" + window.location.hostname +  (location.port?":"+location.port:"") + window.location.pathname;

/*
 * make sure that Modalinfo are on top of modals
 * and that Processing widows are on top of Modalinfo
 */
var zIndexModalinfo = 3000;
var zIndexProcessing = 4000;

/*
 * Types supported by the previewer based on iframes
 */
var previewTypes = ['text', 'ascii', 'html', 'gif', 'png', 'jpeg', 'jpg', 'pdf'];
var imageTypes = ['gif', 'png', 'jpeg', 'jpg'];

