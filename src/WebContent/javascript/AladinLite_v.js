AladinLiteX_mVc = function(){
	var that = this;
	var defaultSurvey ;
	var defaultFov ;
	var defaultPosition;
	var aladin;
	var aladinDivId;
	var parentDiv;
	var parentDivId;
	var menuDiv;
	var menuDivId;
	var targetDiv;
	var targetDivId;
	var contextDiv;
	var contextDivId;
	var selectDiv;
	var selectDivId;
	var maskId = "AladinHipsImagesExplorer_mask";
	var selectHipsDivId = "status-select";
	var catalogeId = "Aladin-Cataloge";
	var selectCataBtnId = "detail-cata";
	var vizierDivId = "vizier";
	var aladinLiteView = new AladinLiteView();
	var XMMcata = null;
	
	
	/**
	 * var params = {
	    parentDivId: "aladin-lite-div",
	    defaultView: {
	        defaultSurvey: "P/DSS2/color",
	        position: "",
	        defaultFov: "30"
	    },
	    controllers: {
	      historic: {
	      },
	      regionEdit:{
	      },
	      hipsSelector: {
	      }
	      catalogSelector: {
	      }
	  	}
	   }
	*/
	var init = function(params){
		/*
		 * Set ids for sub panels
		 */
		parentDivId = params.parentDivId;
		aladinDivId = params.parentDivId + "-main";
		menuDivId   = params.parentDivId + "-menu";
		contextDivId = params.parentDivId + "-context";
		targetDivId  = params.parentDivId + "-target";
		selectDivId  = params.parentDivId + "-select";
		
		if(params.masterResource != undefined){
			aladinLiteView.masterResource = new MasterResource(params.masterResource);
		}else{
			aladinLiteView.masterResource = null;
		}


		/*
		 * Test if historic model is required, if yes make an instance and give it to the controller
		 * draw the tool
		 */
		
		if(params.controllers.historic != undefined){
			params.controllers.historic.model = new Historique_Mvc(contextDivId, this);
		}
		if(params.controllers.regionEditor != undefined){
			params.controllers.regionEditor.view = new RegionEditor_mVc(this
					, parentDivId
					, contextDivId
					, function(data){ if( data.userAction ){ AladinLiteX_mVc.storePolygon(data.region) ;alert(JSON.stringify(data));}}
					, aladinLiteView.points
					, params.defaultView.defaultRegion); 
		}
		if(params.controllers.hipsSelector != undefined){
			params.controllers.hipsSelector.model = new HipsSelector_Mvc(parentDivId, this);
		}

		controller = new AladinLite_mvC(that, params.controllers);		
		draw(params.defaultView,params.controllers,params.masterResource);
	}

	
	
	var draw = function(defaultView, controllers, masterResource) {
		/*
		 * Draw sub panels
		 */
		var XMM;
		if(masterResource != undefined){
			XMM=masterResource.label;
		}else{
			XMM="";
		}
		parentDiv = $('#' + parentDivId);
		parentDiv.html('<div id="' + aladinDivId + '" class="aladin_div"></div>');
		parentDiv.append('<div id="' + menuDivId + '" class="menu_panel">'
				+'<input id="' + targetDivId + '" placeholder="target" class="target form-control menu_item"><span id="search" title="search" class="search menu_item glyphicon glyphicon-search" onclick="AladinLiteX_mVc.searchPosition();"></span>'
				+'<select  id ="' + selectDivId + '" class="menu_item select">'+
				'<option value="ICRS">ICRS</option>'+
				'<option value="Galactic">Galactic</option></select>'
				+'<div id="menuDiv"><button id="menu" type="menu" title="open menu" class="btn btn-color-menu menu_item btn_open" ><i id="icon_open" class="glyphicon glyphicon-list" style="font-size:18px;"></i></button>'
			    +'<button id="center" type="center" title="center" class="btn btn-circle btn-primary menu_item button_center" onclick="AladinLiteX_mVc.returnCenter();"><i class="glyphicon glyphicon-screenshot" style="font-size:15px;"></i></button>'
			    +'<button id="bookMark" type="bookMark" title="bookMark" class="btn btn-circle btn-danger menu_item button_bookMark" onclick="AladinLiteX_mVc.bookMark();"><i class="glyphicon glyphicon-heart" style="font-size:15px;"></i></button>'
			    +'<button id="history" type="history" title="history" class="btn btn-circle btn-green menu_item button_history unselected" onclick="AladinLiteX_mVc.getHistory();"><i class="glyphicon glyphicon-book" style="font-size:15px;"></i></button>'
			    +'<button id="region"  type="region" title="edit region" class="btn btn-circle btn-warning menu_item button_region unselected" onclick="AladinLiteX_mVc.regionEditor();"><i class="glyphicon glyphicon-edit" style="font-size:15px;"></i></button></div>'
			    +'<i class="titlle_image menu_item">Image</i>'
			    +'<div class="image_panel menu_item">'
			    +'<input type="text" id="'+ maskId + '"  placeholder="Survey" size=11 class="menu_item img_explorer form-control"></input>'
			    +'<select id="status-select" class ="selector_hips menu_item"></select>'
			    +'<button id="detail"  type="detail" class="menu_item button_detail" onclick="AladinLiteX_mVc.showDetail(selectHipsDiv.val());">Detail</button></div>'
			    +'<div class="titlle_catalog menu_item">Catalogs</div>'
			    +'<div class="catalog_panel menu_item" >'
			    +'<p id="XMM" title="Show/hide XMM sources" class="XMM_in_menu menu_item datahelp" style="cursor: pointer;" onclick="AladinLiteX_mVc.displayDataXml();">'+ XMM +'</p>'
			    + hideXMMFlash()
			    +'<p id="Simbad" title="Show/hide Simbad sources" class="simbad_in_menu menu_item datahelp" style="cursor: pointer;" onclick="AladinLiteX_mVc.displaySimbadCatalog();">Simbad</p>'
			    +'<p id="NED" title="Show/hide Ned sources" class="ned_in_menu menu_item datahelp" style="cursor: pointer;" onclick="AladinLiteX_mVc.displayNedCatalog();">NED</p>'
			    +'<p class="target_selecte unselected" style="display:none;">S&eacute;lections</p>'
			    +'<i id="fal" title="flash" class="glyphicon glyphicon-flash select_flash" style="cursor: pointer;display:none;"></i>'
			    +'<i id="del" title="delete" class="glyphicon glyphicon-trash select_trash" style="cursor: pointer;display:none;"></i>'
			    +'<input type="text" id="'+ catalogeId + '"  placeholder="Find other Catalog" size=11 class="menu_item cataloge_explorer form-control"></input>'
			    +'<select id="select_vizier" class="selector_vizier menu_item"></select>'
			    +'<div id="vizier" class="vizier">'
			    +'<ul id="vizier_list"></ul></div></div>'
			    +'<i id="credit" title="copyright-mark" class="credit menu_item glyphicon glyphicon-copyright-mark"></i></div>');		
		parentDiv.append('<div id="open_all" class="open_all glyphicon glyphicon-chevron-right"></div>');
		
		
		menuDiv   = $('#' + menuDivId);
		parentDiv.append('<div id="' + contextDivId + '" class="context_panel" >'
				+'<b class="context" style="display: none;"> context </b></div>');
		parentDiv.append('<div id="waiting_interface" class="waiting_interface" style="display:none;">'
				+'<div class="grey_bg"></div>'
				+'<div class="fetching_data">'
				+'<div class="fetching_img"></div>'
				+'<div class="fetching_message">fetching data...</div></div></div>');
		parentDiv.append('<div id="alert" class="alert_fov" style="display:none;">'
				+'<div class="alert_fov_img"><i class="glyphicon glyphicon-alert" style="font-size:16px;padding:3px;"></i></div>'
				+'<div class="alert_fov_msg">Search radius limited to 1&deg;</div>'
				+'</div>');
		parentDiv.append('<div class="tester" id="tester"><ul></ul></div>');
		
	
		contextDiv  = $('#' + contextDivId);
		targetDiv   = $('#' + targetDivId);
		selectDiv   = $('#' + selectDivId);
		maskDiv		= $('#' + maskId);
		selectHipsDiv=$('#' + selectHipsDivId);
		catalogeDiv = $('#' + catalogeId);
		selectCataBtn = $('#' + selectCataBtnId);
		vizierDiv = $('#' + vizierDivId);
		/*
		 * Parse config
		 */
		if( defaultView.defaultSurvey != undefined )
			defaultSurvey = defaultView.defaultSurvey;
		if( defaultView.defaultFov != undefined )
			defaultFov = defaultView.defaultFov;
		if( defaultView.position != undefined )
			defaultPosition = defaultView.position;
		parentDiv = $("#" + aladinDivId);
		/*
		 * Run aladin, set the initial states
		 */
		aladin = A.aladin(parentDiv
				, {survey: defaultSurvey, fov: defaultFov, showLayersControl: false, showFullscreenControl: false, showFrame: false, showGotoControl: false});
		parentDiv.append();
		
		gotoObject(defaultView.position);
		storeCurrentState();
		
		var lieu = aladin.getRaDec();
		var fil =  aladin.getFov();
		
		var baseUrl ="http://alasky.unistra.fr/MocServer/query?RA=" 
			+ lieu[0] + "&DEC=" + lieu[1] 
			+ "&SR=" + fil[0] 
			+ "&fmt=json&get=record&casesensitive=false"
			+ "&publisher_id,publisher_did,obs_id,obs_title,obs_regime=*DSS colored*";
		var productType = "image";
		var imageIdPattern 	= new RegExp(/.*\/C\/.*/);
		var imageTilePattern 	= new RegExp(/.*((jpeg)|(png)).*/);
		$.getJSON(baseUrl, function(jsondata) {
			if( productType != undefined ){
				for(var i = jsondata.length - 1; i >= 0; i--) {
					if(jsondata[i].dataproduct_type != productType ) {
						jsondata.splice(i, 1);
					}
				}
				if( productType == "image" ){
					for(var i = jsondata.length - 1; i >= 0; i--) {
						var keepIt = 0;
							if(  $.isArray(jsondata[i].hips_tile_format)) {
								for( var j=0 ; j<jsondata[i].hips_tile_format.length ; j++){
									if( imageTilePattern.test(jsondata[i].hips_tile_format[j]) ){
										keepIt = 1;
										break;
									}
								}
							} else if(  imageTilePattern.test(jsondata[i].hips_tile_format) ){
								keepIt = 1;
							}
						if( keepIt == 0 ){
							jsondata.splice(i, 1);
						}
					}
				}
				controller.modules.hipsSelector.storeHips(jsondata);
				displaySelectedHips(jsondata[0].ID);
				createHipsSelect(jsondata[0].ID);
			}
		});
		
		aladin.on('positionChanged', function(newPosition){
			if(newPosition.dragging==false){
				//storeCurrentState();
				targetDiv.val(newPosition.ra.toFixed(4) + "," + newPosition.dec.toFixed(4));
				if(aladinLiteView.masterResource != undefined){
					controller.updateCatalogs(aladinLiteView,'position');
				}
			}
		});

		aladin.on('zoomChanged', function(newFoV) {
			var fovValue = aladinLiteView.fov;
			storeCurrentState();
		    if(newFoV >= fovValue){
		    	if(aladinLiteView.masterResource != undefined){
		    		controller.updateCatalogs(aladinLiteView,'zoom');
		    	}
		    }	    
		});

		$("#open_all").click(function(event){
			event.stopPropagation();
			switchPanel();
			closeContext();
			
		})
		/*
		 * Set the default position
		 */	        
        targetDiv.val(defaultView.position);
		/*
		 * Set event handlers de la texte target
		 */
		targetDiv.click(function(event){
			event.stopPropagation();
		})
		targetDiv.bind("keypress", function(event) {
		    if(event.which == 13) {
		    	if(aladinLiteView.region != null){
					controller.cleanPolygon();
				}
		    	aladinLiteView.clean();
				event.preventDefault();
		        gotoObject(targetDiv.val());
		    }
		});
		$('#input_target').bind("keypress", function(event) {
			if(event.which == 13) {
				displayTarget();
			}
		});
		selectDiv.click(function(event){
			event.stopPropagation();
		});
		maskDiv.click(function(event){
			event.stopPropagation();
		});
		maskDiv.keyup(function(e) {
			if( $(this).val().length >= 2 || e.which == 13) {
				searchHips($(this).val());
			}
		});
		selectHipsDiv.change(function(){
			displaySelectedHips($(this).val());
		});
		selectHipsDiv.click(function(event){
			event.stopPropagation();
		});
		
		$("#select_vizier").change(function(){
			//console.log($(this).val())
			var oid = $(this).val();
			catalogFunction(oid);
		});
		
		catalogeDiv.keyup(function(e) {
			if( $(this).val().length >= 2 || e.which == 13) {
				searchCataloge($(this).val());
			}
		});
		
		$("#menuDiv").on("click",".btn_open", function(event){
			event.stopPropagation();
			$("#center").css("transition-timing-function","cubic-bezier(0.8,0.84,0.44,1.3)");
			$("#center").css("transform","translate3d(45px,0px,0px)");
			$("#center").css("transition-duration","100ms");
			
			$("#bookMark").css("transition-timing-function","cubic-bezier(0.8,0.84,0.44,1.3)");
			$("#bookMark").css("transform","translate3d(90px,0px,0px)");			
			$("#bookMark").css("transition-duration","200ms");
			
			$("#history").css("transition-timing-function","cubic-bezier(0.8,0.84,0.44,1.3)");
			$("#history").css("transform","translate3d(135px,0px,0px)");
			$("#history").css("transition-duration","300ms");
			
			$("#region").css("transition-timing-function","cubic-bezier(0.8,0.84,0.44,1.3)");
			$("#region").css("transform","translate3d(180px,0px,0px)");
			$("#region").css("transition-duration","400ms");
			
			$("#menu").addClass("btn_open_2");
			$("#menu").removeClass("btn_open");
			$("#icon_open").addClass("glyphicon-remove");
			$("#icon_open").removeClass("glyphicon-list");
			
			$("#credit").css("display","none");
		});
		$("#menuDiv").on("click",".btn_open_2", function(event){
			event.stopPropagation();
			$("#center").css("transition-timing-function","ease-out");
			$("#center").css("transform","translate3d(0px,0px,0px)");
			$("#center").css("transition-duration","100ms");
			
			$("#bookMark").css("transition-timing-function","ease-out");
			$("#bookMark").css("transform","translate3d(0px,0px,0px)");			
			$("#bookMark").css("transition-duration","200ms");
			
			$("#history").css("transition-timing-function","ease-out");
			$("#history").css("transform","translate3d(0px,0px,0px)");
			$("#history").css("transition-duration","300ms");
			
			$("#region").css("transition-timing-function","ease-out");
			$("#region").css("transform","translate3d(0px,0px,0px)");
			$("#region").css("transition-duration","400ms");
			
			$("#menu").addClass("btn_open");
			$("#menu").removeClass("btn_open_2");
			$("#icon_open").addClass("glyphicon-list");
			$("#icon_open").removeClass("glyphicon-remove")

			$("#credit").css("display","inline");
		});
		
		$("#vizier").click(function(event){
			event.stopPropagation();
		});
		$('.target_selecte').click(function(event){
			if($(this).attr("class")=="target_selecte unselected"){
				for(var i=0;i<aladinLiteView.target.length;i++){
					var data=i;
					var ct = aladinLiteView.target[i].ct;
					var ra = aladinLiteView.target[i].ra;
					var dec = aladinLiteView.target[i].dec;
					aladin.addCatalog(ct);
					ct.addSources([A.marker(ra, dec, {popupTitle:'target'}, data)]);
				}
				$(this).attr("class","target_selecte selected");
				$(this).css("color","#87F6FF");
			}else{
				cleanCatalog("tar");
				$(this).attr("class","target_selecte unselected");
				$(this).css("color","#888a85");
			}
			
		});
		$('.select_trash').click(function(event){
			$('.target_selecte').css("display","none");
			$(this).css("display","none");
			$('.select_flash').css("display","none");
			cleanCatalog("tar");
		});
		
		$('.select_flash').click(function(event){
			for(var i=0;i<aladinLiteView.target.length;i++){
				aladinLiteView.target[i].ct.makeFlash();
			}
		});
		
		$("#credit").click(function(event){
			if( contextDiv.height() < 100 ){
				contextDiv.animate({height:'+=200px'},"fast");
				contextDiv.css("border-width", "0.2px");
				$(".ui-dialog").animate({height:'+=200px'},"fast");
			}
			$.getJSON("licences/credit.json", function(jsondata) {
				console.log(jsondata)
				contextDiv.html(JSON.stringify(jsondata));
			});

//			var html = "<p style='padding-top:20px;padding-left:10px;color:#2f2f2f;font-size:14;'>Ce travail s'est appuy&eacute; sur ' Aladin Sky Atlas ' d&eacute;velopp&eacute; au CDS, Observatoire de Strasbourg, France</p>";
//			html += "<p style='padding-left:10px;padding-top:10px;color:#2f2f2f;font-size:14;'>Author :  Laurent Michel,  Thomas Boch,  Wang Jie</p>"
//			contextDiv.html(html);
		});
	}

	
	var popup = function(){
		if(menuDiv.width()<100){
			$("#aladin-lite-div").dialog({title:"AladinLiteX",height:450,width:440});
		}else{
			if(contextDiv.height()<100){
				$("#aladin-lite-div").dialog({title:"AladinLiteX",height:450,width:680});
			}else{
				$("#aladin-lite-div").dialog({title:"AladinLiteX",height:650,width:680});
			}
		}
		//$("#popup").css("display", "none");
		//$("#closeAll").css("display", "inline");
	}

	var refresh = function(){
		gotoObject(defaultPosition);
		aladin.setFov(defaultFov);
		$("#aladin-lite-div").dialog({title:"AladinLiteX",height:450,width:440});
	}
	
	var addOverlayer = function(overlay){
		aladin.addOverlay(overlay);
	}
	
	var gotoPosition = function(ra, dec){
		aladin.gotoPosition(ra,dec);
	}
	
	var world2pix = function(ra, dec){
		return aladin.world2pix(ra, dec);
	}
	
	var setZoom = function(zoom){
		aladin.setZoom(zoom);
	}
	
	var increaseZoom = function(){
		aladin.increaseZoom();
	}
	
	var decreaseZoom = function(){
		aladin.decreaseZoom();
	}
	
	var pix2world = function(cx,cy){
		return aladin.pix2world(cx,cy);
	}
	
	var setImageSurvey = function(imageSurvey, callback){
		return aladin.setImageSurvey(imageSurvey, callback);
	}
	
	var createImageSurvey = function(id, name, rootUrl, cooFrame, maxOrder, options){
		return aladin.createImageSurvey(id, name, rootUrl, cooFrame, maxOrder, options);
	}
	/**
	 * les interfaces pour acces à aladin.js
	 */
	
	
	
	
	var returnCenter = function(){
		aladin.gotoPosition(aladinLiteView.ra,aladinLiteView.dec);
        aladin.setFoV(aladinLiteView.fov);
		//event.stopPropagation();
	}
	
	var bookMark = function(){
		
		if( contextDiv.height() < 100 ){
			$(".ui-dialog").animate({height:'+=200px'},"fast");
			contextDiv.animate({height:'+=200px'},"fast");
			contextDiv.css("border-width", "0.2px");
		}
		for( var c=0 ; c<aladin.view.catalogs.length ; c++) {
			if( aladin.view.catalogs[c].name.startsWith("Swarm")) {
				aladinLiteView.XMM = true;
			}
		}
        storeCurrentState();
		controller.bookMark(aladinLiteView);
		
		
		//event.stopPropagation();
	}
	
	var getHistory = function(){
		controller.getHistory();
		if(contextDiv.height() < 100 && $("#history").attr("class")=="btn btn-circle btn-green menu_item button_history unselected"){
			contextDiv.animate({height:'+=200px'},"fast");
			contextDiv.css("border-width", "0.2px");
			$(".ui-dialog").animate({height:'+=200px'},"fast");
			$("#history").attr("class","btn btn-circle btn-green menu_item button_history selected");
			$("#region").attr("class","btn btn-circle btn-warning menu_item button_region unselected");
		}else if(contextDiv.height() > 100 && $("#history").attr("class")=="btn btn-circle btn-green menu_item button_history selected"){
			contextDiv.animate({height:'-=200px'},"fast");
			contextDiv.css("border-width", "0px");
			$(".ui-dialog").animate({height:'-=200px'},"fast");
			$("#history").attr("class","btn btn-circle btn-green menu_item button_history unselected");
		}else if(contextDiv.height() > 100 && $("#history").attr("class")=="btn btn-circle btn-green menu_item button_history unselected"){
			$("#history").attr("class","btn btn-circle btn-green menu_item button_history selected");
			$("#region").attr("class","btn btn-circle btn-warning menu_item button_region unselected");
		}
		//event.stopPropagation();
	}
	
	/**
	 * revenir dans la situation de l'historic
	 */
	var restoreView = function(storedView) {
		if(aladinLiteView.region != null){
			controller.cleanPolygon();
		}
		aladinLiteView = jQuery.extend(true, {}, storedView);
		targetDiv.val(aladinLiteView.name);
	    aladin.gotoRaDec(aladinLiteView.ra,aladinLiteView.dec);
        aladin.setFoV(aladinLiteView.fov);
        displaySelectedHips(aladinLiteView.survey.ID)
        selectHipsDiv.val(aladinLiteView.survey.ID);
        if(aladinLiteView.region != null){
        	var points = {type: null, value: []};
        	points.type = aladinLiteView.region.format;
        	points.value = aladinLiteView.region.points;
        	controller.setInitialValue(points);
        }
        
        //event.stopPropagation();
    }	
	
	var restoreViewById = function(viewId) {
		var storedView = controller.restoreViewById(viewId);
		restoreView(storedView);
		if(storedView.catalogTab != null){
			controller.restoreCatalog(storedView);
		}
		
		if(aladinLiteView.XMM == true){
			controller.displayDataXml(aladinLiteView);
		}
		//console.log(aladinLiteView.survey)
		var html_option = '<select id="status" class ="selector_hips menu_item">'
		html_option += "<option value='"+ aladinLiteView.survey.ID +"'>"+ aladinLiteView.survey.ID +"</option>";
			for(var s=0 ; s<controller.modules.historic.hips_tab.length; s++){
				if(controller.modules.historic.hips_tab[s]!=aladinLiteView.survey.ID){
					html_option += "<option value='" 
					+ controller.modules.historic.hips_tab[s] 
					+ "'>"
					+ controller.modules.historic.hips_tab[s] +"</option>"
				}
			}
		html_option += '</select>';
		selectHipsDiv.html(html_option);
		if(aladinLiteView.target.length > 0){
			for(var i = 0;i<aladinLiteView.target.length;i++){
				var ra = aladinLiteView.target[i].ra;
				var dec = aladinLiteView.target[i].dec;
				var ct = A.catalog({name: "tar", color:"green"});
				aladin.addCatalog(ct);
				ct.addSources([A.marker(ra, dec,  {popupTitle:'target'})]);
			}
        }
    }
	
	/**
	 * stoker le 'aladinLiteView' courant
	 */
	var storeCurrentState = function(){
		var radec = aladin.getRaDec();
		aladinLiteView.name = targetDiv.val();
		aladinLiteView.ra = radec[0];
		aladinLiteView.dec = radec[1];
		var l = aladin.getFov();
		aladinLiteView.fov = l[0];
		aladinLiteView.img = aladin.getViewDataURL({width: 100, height: 100});
		aladinLiteView.catalogTab = controller.currentCatalogTab();
	}
	
	/**
	 * stoker le region courant
	 */
	var storePolygon = function(region){
		aladinLiteView.region = region;
	}
	
	/**
	 * click function 'region'
	 */
	var regionEditor = function(){
		if(aladinLiteView.region != null){
			controller.cleanPolygon();
		}
		storeCurrentState();
		contextDiv.html("");
		controller.editRegion();
		/*
		 * la fermeture de div context
		 */
		if(contextDiv.height() < 100 && $("#region").attr("class")=="btn btn-circle btn-warning menu_item button_region unselected"){
			contextDiv.animate({height:'+=200px'},"fast");
			contextDiv.css("border-width", "0.2px");
			$(".ui-dialog").animate({height:'+=200px'},"fast");
			$("#region").attr("class","btn btn-circle btn-warning menu_item button_region selected");
			$("#history").attr("class","btn btn-circle btn-green menu_item button_history unselected");
		}else if(contextDiv.height() > 100 && $("#region").attr("class")=="btn btn-circle btn-warning menu_item button_region selected"){
			contextDiv.animate({height:'-=200px'},"fast");
			contextDiv.css("border-width", "0px");
			$(".ui-dialog").animate({height:'-=200px'},"fast");
			$("#region").attr("class","btn btn-circle btn-warning menu_item button_region unselected");
		}else if(contextDiv.height() > 100 && $("#region").attr("class")=="btn btn-circle btn-warning menu_item button_region unselected"){
			$("#region").attr("class","btn btn-circle btn-warning menu_item button_region selected");
			$("#history").attr("class","btn btn-circle btn-green menu_item button_history unselected");
		}
		//event.stopPropagation();
	}
	

	/**
	 * go to the object by enter its name 
	 */
	var gotoObject = function(pos){
        aladin.gotoObject(pos,{
        	success: function(pos){
        		aladinLiteView.name = targetDiv.val();
        		aladinLiteView.ra = pos[0];
        		aladinLiteView.dec = pos[1];
        		var l = aladin.getFov();
        		aladinLiteView.fov = l[0];
        		//console.log(targetDiv.val() +"  "+ 'position' +" : "+ pos[0] + " " + pos[1]);
        	},
        	error: function(){alert('pas connu');}});		        		
	}
	
	/**
	 * Change states of panel
	 */
	var switchPanel = function() {
		if( menuDiv.width() < 100 ){
			menuDiv.animate({width:'+=240px'},"fast");
			$(".menu_item").css("display", "inline");
			$("#open_all").animate({left:'+=240px'},"fast");
			$("#open_all").attr("class","open_all glyphicon glyphicon-chevron-left");
			$(".ui-dialog").animate({width:'+=240px'},"fast");
		} else {
			menuDiv.animate({width:'-=240px'},"fast");
			$(".menu_item").css("display", "none");
			//$("#vizier").css("display","none");
			$("#open_all").animate({left:'-=240px'},"fast");
			$("#open_all").attr("class","open_all glyphicon glyphicon-chevron-right");
			$(".ui-dialog").animate({width:'-=240px'},"fast");
		}
	}
	
	var closeContext = function() {
		if(contextDiv.height() > 100 ){
			contextDiv.animate({height:'-=200px'},"fast");
			contextDiv.css("border-width", "0px");
			$(".context").css("display", "none");
			contextDiv.html("");
			$(".ui-dialog").animate({height:'-=200px'},"fast");
			targetDiv.val(aladinLiteView.name);
		}
	}
	
	/**
	 * utiliser quand clique sur button edit , pour disable bookMark et history
	 */
	var disabledButton = function(){
		document.getElementById("bookMark").disabled=true;
		document.getElementById("history").disabled=true;
		document.getElementById("center").disabled=true;
	}
	
	/**
	 * utiliser quand clique sur button browse , pour reable bookMark et history
	 */
	var reabledButton = function(){
		document.getElementById("bookMark").disabled=false;
		document.getElementById("history").disabled=false;
		document.getElementById("center").disabled=false;
	}
	
	/**
	 * suprrimer l'élement dans l'historic, id se correspont à le id du croix et de la liste 
	 */
	var deleteHistory = function(id){
		controller.deleteHistory(id);
		//event.stopPropagation();
	}
		
	var searchHips = function(hips_mask){
		controller.searchHips(hips_mask,aladinLiteView);
	}
	
	var hipsFunction = function(ID){
		displaySelectedHips(ID);
		createHipsSelect(ID);
		displayDetailInContext(ID);
	}
	
	var catalogFunction = function(obs_id){
		if(controller.modules.hipsSelector.cata_tab.indexOf(obs_id)<0){
		controller.storeCurrentCatalog(obs_id);
		controller.createCatalogSelect();
		addCatalogInSelector(obs_id);
		}
		$("#itemList").css("display", "none");
	}

	var displaySelectedHips = function(ID) {
		var hips = controller.getSelectedHips(ID);
		aladinLiteView.survey = hips;
		if (hips === undefined) {
			console.error('unknown HiPS');
			return;
		}
		$("#itemList").css("display", "none");
		var fmt = "";
		if(hips.hips_tile_format.indexOf("png") >=0  ){
			fmt = "png";
		} else {
			fmt = "jpg";
		}
		if( fmt != ""){
			setImageSurvey(createImageSurvey(hips.obs_title, hips.obs_title, hips.hips_service_url, hips.hips_frame, hips.hips_order, {imgFormat: fmt})  );
		}else{ 
			setImageSurvey(createImageSurvey(hips.obs_title, hips.obs_title, hips.hips_service_url, hips.hips_frame, hips.hips_order)  );
		}
	}
	
	var createHipsSelect = function(ID){

		controller.modules.historic.hips_tab.push(ID);
		var html_option = '<select id="status" class ="selector_hips menu_item">'
			html_option += "<option value='"+ ID +"'>"+ ID +"</option>";
				for(var s=0 ; s<controller.modules.historic.hips_tab.length; s++){
					if(controller.modules.historic.hips_tab[s]!=ID){
						html_option += "<option value='" 
						+ controller.modules.historic.hips_tab[s] 
						+ "'>"
						+ controller.modules.historic.hips_tab[s] +"</option>"
					}
				}
		html_option += '</select>';
		selectHipsDiv.html(html_option);
	}
	
	var addCatalogInSelector = function(obs_id){
		var cata_select = '<option>'
			+obs_id
			+'</option>';
		$("#select_vizier").append(cata_select);
	}
	
	var displayDetailInContext = function(ID){
		
		var hips = controller.getSelectedHips(ID);
		if(hips != undefined){
			var html = '<p style="color:#4D36DC;margin:10px;" >';
			html +=  hips.obs_title + "</p><p style='font-size:small;margin:10px;font-weight:200;line-height:1.5;color:#000000;'>&nbsp;&nbsp;" + hips.obs_description + "<br>";
			html += '</p>';
			if(contextDiv.height() > 100){
				contextDiv.html(html);
			}else{
				contextDiv.animate({height:'+=200px'},"fast");
				contextDiv.css("border-width", "0.2px");
				contextDiv.html(html);
				$(".ui-dialog").animate({height:'+=200px'},"fast");
			}
		}else{
			alert("Please enter a survey ID");
		}
		//event.stopPropagation();
		
	}
	
	var showDetail = function(ID){
		if(contextDiv.height() > 100 ){
			contextDiv.animate({height:'-=200px'},"fast");
			contextDiv.css("border-width", "0px");
			$(".ui-dialog").animate({height:'-=200px'},"fast");
		}else{
			displayDetailInContext(ID);
		}
		//event.stopPropagation();
	}
	
	var displayCatalogDetailInContext = function(obs_id){
		if(contextDiv.height() > 100 ){
			contextDiv.animate({height:'-=200px'},"fast");
			contextDiv.css("border-width", "0px");
			$(".ui-dialog").animate({height:'-=200px'},"fast");
		}else{
			var cata = controller.getSelectedCatalog(obs_id);
			if(cata != undefined){
				var html = '<p style="color:#4D36DC;margin:10px;" >';
				html +=  cata.obs_title + "</p><p style='font-size:small;margin:10px;'>" + cata.obs_description + "<br>";
				html += '</p>';
				if(contextDiv.height() > 100){
					contextDiv.html(html);
				}else{
					contextDiv.animate({height:'+=200px'},"fast");
					contextDiv.css("border-width", "0.2px");
					contextDiv.html(html);
					$(".ui-dialog").animate({height:'+=200px'},"fast");
				}
			}else{
				alert("Please choose a catalog");
			}
		}
		//event.stopPropagation();
		
	}
	
	var findSurveyDescriptionById = function(id){
		var hips = controller.getSelectedHips(id);
		return hips.obs_description;
	}
	
	var searchCataloge = function(cataloge_mask){
		controller.searchCataloge(cataloge_mask,aladinLiteView)
	}
	
	var searchPosition= function(){
		if(aladinLiteView.region != null){
			controller.cleanPolygon();
		}
		aladinLiteView.clean();
		gotoObject(targetDiv.val());
		//event.stopPropagation();
	}
	
	
	var displaySimbadCatalog = function(){
		//event.stopPropagation();
		controller.displaySimbadCatalog();		
	}
	
	var displayNedCatalog = function () {
		//event.stopPropagation();
		storeCurrentState();
		controller.displayNedCatalog(aladinLiteView);
	}
		
	var detailCatalogOperator = function(i){
		//event.stopPropagation();
		var p_text=$("#cata_operate_"+ i).text();
		displayCatalogDetailInContext(p_text);
	}
	
	
	var displayDataXml = function(){		
		//event.stopPropagation();
		storeCurrentState();
		controller.displayDataXml(aladinLiteView);
	}
	
	var XMMFlash = function(){
		//event.stopPropagation();
		if(XMMcata != null){
			XMMcata.makeFlash();
		}
	}
	
	
	var displayCatalog = function(self, name, color, clickType, url){
		var catalog;
		if(name == 'Simbad'){
			catalog = A.catalogHiPS(url, {onClick: clickType,name: name,color: color},self.hide(name));
			//console.log(catalog)
		}else if(name == 'NED'){
				if(aladin.getFov()[0]>0.02){
					catalog = A.catalogFromNED(aladin.getRaDec()[0] + " " + aladin.getRaDec()[1]
					, 0.02
					, {onClick: clickType, color: color}
					, function() {self.hide(name)});
				}else{
					catalog = A.catalogFromNED(aladin.getRaDec()[0] + " " + aladin.getRaDec()[1]
					, aladin.getFov()[0]
					, {onClick: clickType, color: color}
					, function() {self.hide(name)});
				}
		}else if(name == 'Swarm'){
			aladinLiteView.masterResource.cleanTab();
			cleanCatalog("Target");
			cleanCatalog("Swarm");
			var currentColor=null; //XMM
			var currentColor2=null; //Vizier
			var currentColor3=null; //Simbad
			catalog = XMMcata = A.catalogFromURL(url, {name: name, sourceSize:8, shape: 'plus', color: color, onClick:function(params) {
					/*
					 * function click for the source in catalog XMM
					 */
					var data = params.data;
					console.log(data)
					aladinLiteView.masterResource.handler.callBack();
					
					/*
					 * draw the point target of the cata XMM chosen to large circle
					 */
					cleanCatalog("Target");
					cleanCatalog("oid");
					var ct = A.catalog({name: "Target"});
					aladin.addCatalog(ct);
					ct.addSources([A.marker(data.pos_ra_csa, data.pos_dec_csa,  {popupTitle:'oid: '+data.oidsaada})]);
					
					/*
					 * draw oid and url corresponded in context panel
					 */
					var lien = aladinLiteView.masterResource.associe_data.url.replace(/\{\$id\}/g,data.oidsaada);
					var html = '<p value="'+ data.oidsaada+'">&nbsp;&nbsp;'
							+aladinLiteView.masterResource.associe_data.label+'</p>'
//							+'<p style="color:#000000;font-weight:100;">url: '+ lien +'</p>'
							+'<button id="'+ data.oidsaada +'" class="resource_around dataunselected" title="show/hide resources">Resource</button>'
							+'<button id="label_init_btn" class="label_init_btn">'+ aladinLiteView.masterResource.handler.label +'</button>'
							+'<button id="plus" class="plus glyphicon glyphicon-plus"></button>'
							+'<p id="fade" style="position: absolute;left: 32px;top: 80;display:none;">fade</p>'
							+'<button id="minus" class="minus glyphicon glyphicon-minus"></button>'
							+'<div id="label_init_description" class="label_init_description" style="display:none;">'+ aladinLiteView.masterResource.handler.description +'</div>';
					
					
					if(contextDiv.height() > 100){
						contextDiv.html(html);
					}else{
						contextDiv.animate({height:'+=200px'},"fast");
						contextDiv.css("border-width", "0.2px");
						contextDiv.html(html);
						$(".ui-dialog").animate({height:'+=200px'},"fast");
					}
					
					/*
					 * if its the first time of choosing a cata XMM...
					 */
					if(aladinLiteView.masterResource.tab.indexOf(data.oidsaada)<0){		
						aladinLiteView.masterResource.tab.push(data.oidsaada);
						contextDiv.on('click','#'+ data.oidsaada, function(){
							if($(this).attr("class")=="resource_around dataunselected"){
								$("#plus").css("display","inline");
								$("#minus").css("display","inline");
								$("#fade").css("display","inline");
								
								$("#XMM").attr("class", "XMM_in_menu menu_item datahelp");
								$("#XMM").css("color", "#888a85");
								$("#btn-XMM-flash").css("color" , "#888a85");
								
								$(this).attr("class","resource_around dataselected");
								$(this).css("color","#32FFEC");
								$.getJSON(lien, function(jsondata) {
									var cat = A.catalog({name: "oid" + data.oidsaada, sourceSize: 8, color: '#32FFEC', shape: 'plus', onClick:"showTable"});
									aladin.addCatalog(cat);
									for( var i=0 ; i<jsondata.length ; i++ ){
										var point =  jsondata[i];
										cat.addSources([A.source(point.ra, point.dec, {ra: Numbers.toSexagesimal(point.ra/15, 7, false), dec:  Numbers.toSexagesimal(point.dec, 7, true), Name: point.name, Description: point.description})]);
									}
									
								});
							}else{
								$("#plus").css("display","none");
								$("#minus").css("display","none");
								$("#fade").css("display","none");
								catalog.updateShape({color:color});
								currentColor = null;
								for(var i=0;i<aladin.view.catalogs.length;i++){
									if(aladin.view.catalogs[i].name.startsWith('Simbad') || aladin.view.catalogs[i].name.startsWith('NED')){
										aladin.view.catalogs[i].show();
									}
									for(var j=0;j<controller.modules.hipsSelector.cata_tab.length;j++){
										var name = controller.modules.hipsSelector.cata_tab[j];
										if(aladin.view.catalogs[i].name.startsWith("VizieR:"+name)){
											aladin.view.catalogs[i].show();
										}
									}
								}
								
								$("#XMM").attr("class", "XMM_in_menu menu_item selecteddatahelp");
								$("#XMM").css("color", "red");
								$("#btn-XMM-flash").css("color" , "red");
								$(this).attr("class","resource_around dataunselected");
								$(this).css("color","");
								cleanCatalog("oid");
							}
						});
						
						contextDiv.on('click','#label_init_btn', function(){
							$('#label_init_description').css("display","inline");
						});
						
						contextDiv.on('click','#minus', function(){
							var str;
							if(currentColor != null){
								str=currentColor
							}
							else{
								str=color;
							}
							var hex = colorFadeOut(str);
							catalog.updateShape({color:hex});
							currentColor = hex;
							for(var i=0;i<aladin.view.catalogs.length;i++){
								if(aladin.view.catalogs[i].name.startsWith('Simbad') || aladin.view.catalogs[i].name.startsWith('NED')){
									var changeSimbadColor;
									if(currentColor3 == null){
										changeSimbadColor = controller.modules.hipsSelector.view.libraryMap.colorMap['Simbad'].color;
									}else{
										changeSimbadColor = currentColor3;
									}
									var hex_simbad = colorFadeOut(changeSimbadColor);
									aladin.view.catalogs[i].updateShape({color:hex_simbad});
									currentColor3 = hex_simbad;
								}
								
								for(var j=0;j<controller.modules.hipsSelector.cata_tab.length;j++){
									var name = controller.modules.hipsSelector.cata_tab[j];
									if(aladin.view.catalogs[i].name.startsWith("VizieR:"+name)){
										var changeColor;
										if(currentColor2 == null){
											changeColor = controller.modules.hipsSelector.view.libraryMap.getColorByCatalog(name).color;
										}else{
											changeColor = currentColor2;
										}
										var hex_vizier = colorFadeOut(changeColor);
										aladin.view.catalogs[i].updateShape({color:hex_vizier});
										currentColor2 = hex_vizier;
									}
								}
							}
						});
						
						contextDiv.on('click','#plus', function(){
							var str;
							if(currentColor != null){
								str=currentColor
							}
							else{
								str=color;
							}
							var hex = colorFadeIn(str,color);
							catalog.updateShape({color:hex});
							currentColor = hex;
							for(var i=0;i<aladin.view.catalogs.length;i++){
								if(aladin.view.catalogs[i].name.startsWith('Simbad') || aladin.view.catalogs[i].name.startsWith('NED')){
									var changeSimbadColor;
									if(currentColor3 == null){
										changeSimbadColor = controller.modules.hipsSelector.view.libraryMap.colorMap['Simbad'].color;
									}else{
										changeSimbadColor = currentColor3;
									}
									var hex_simbad = colorFadeIn(changeSimbadColor,controller.modules.hipsSelector.view.libraryMap.colorMap['Simbad'].color);
									aladin.view.catalogs[i].updateShape({color:hex_simbad});
									currentColor3 = hex_simbad;
								}
								
								for(var j=0;j<controller.modules.hipsSelector.cata_tab.length;j++){
									var name = controller.modules.hipsSelector.cata_tab[j];
									if(aladin.view.catalogs[i].name.startsWith("VizieR:"+name)){
										var changeColor;
										if(currentColor2 == null){
											changeColor = controller.modules.hipsSelector.view.libraryMap.getColorByCatalog(name).color;
										}else{
											changeColor = currentColor2;
										}
										var hex_vizier = colorFadeIn(changeColor,controller.modules.hipsSelector.view.libraryMap.getColorByCatalog(name).color);
										aladin.view.catalogs[i].updateShape({color:hex_vizier});
										currentColor2 = hex_vizier;
									}
								}
							}
						});
					}
				}},self.hide);
		}
		aladin.addCatalog(catalog);
		cleanCatalog("oid");
		//contextDiv.html("");
	}
	
	var displayVizierCatalog = function(self, obs_id, color, clickType, hips_service_url){
		var catalog;
		var fov;
		if(hips_service_url != undefined){
			catalog = A.catalogHiPS(hips_service_url, {onClick: clickType,name: 'VizieR:'+obs_id,color:color},self.hide(obs_id));
		}else{
			if(aladin.getFov()[0]>1){
				fov = 1;
			}else{
				fov = aladin.getFov()[0];
			}
			catalog = A.catalogFromVizieR(obs_id
					, aladin.getRaDec()[0] + " " + aladin.getRaDec()[1]
					, fov
					, {onClick: 'showTable', color: color}
					, function() {
						self.hide(obs_id);
					});
		}
		aladin.addCatalog(catalog);
		return catalog;
	}
	
	
	var cleanCatalog = function(name){
		for( var c=0 ; c<aladin.view.catalogs.length ; c++) {
			if( aladin.view.catalogs[c].name.startsWith(name))  {
				aladin.view.catalogs.splice(c, 1);
				aladin.view.mustClearCatalog = true;
				aladin.view.requestRedraw(); 
				//break;
				c--;
			}
		}
	}
	
	var colorFadeOut = function(str_color){
		var str_nb = str_color.replace(/\#/g,"");
		var tab_rgb_str = str_nb.match(/.{2}/g);
		
		var tab_rgb_int=[3];
		for(var j=0;j<tab_rgb_str.length;j++){
				if(parseInt(tab_rgb_str[j],16) > 1){
					tab_rgb_int[j] = parseInt(parseInt(tab_rgb_str[j],16)/2);
					
				}else{
					tab_rgb_int[j] = 1;
				}
		}

		var hex="#"
		for(var i=0;i<tab_rgb_int.length;i++){
			if(tab_rgb_int[i].toString(16).length == 1){
				hex += "0" + tab_rgb_int[i].toString(16);
			}else{
				hex += tab_rgb_int[i].toString(16);
			}
		}
		
		return hex;
	}
	
	var colorFadeIn = function(str_color, org_color){
		var str_nb = str_color.replace(/\#/g,"");
		var tab_rgb_str = str_nb.match(/.{2}/g);
		
		var tab_rgb_int=[3];
		
		tab_rgb_int[0] = parseInt(parseInt(tab_rgb_str[0],16)*2);
		tab_rgb_int[1] = parseInt(parseInt(tab_rgb_str[1],16)*2);
		tab_rgb_int[2] = parseInt(parseInt(tab_rgb_str[2],16)*2);
		
		var org_nb = org_color.replace(/\#/g,"");
		var tab_rgb_org = org_nb.match(/.{2}/g);
		
		var tab_org_int = [3];
		tab_org_int[0] = parseInt(tab_rgb_org[0],16);
		tab_org_int[1] = parseInt(tab_rgb_org[1],16);
		tab_org_int[2] = parseInt(tab_rgb_org[2],16);
		var hex="#";
		for(var i=0;i<tab_rgb_int.length;i++){
			if(tab_rgb_int[i]>tab_org_int[i]){
				tab_rgb_int[i] = tab_org_int[i];
			}
			if(tab_rgb_int[i].toString(16).length == 1){
				hex += "0" + tab_rgb_int[i].toString(16);
			}else{
				hex += tab_rgb_int[i].toString(16);
			}
		}
		return hex;
	}
	
	var displayTarget = function(){
		var pos = $('#input_target').val();
		gotoObject(pos);
		console.log(pos[1])
		var ct = A.catalog({name: "tar", color: "green"});
		aladin.addCatalog(ct);
		var radec = aladin.getRaDec();
		ct.addSources([A.marker(radec[0],radec[1],  {popupTitle:'target: '+radec[0]+ ', ' +radec[1]})]);
		aladinLiteView.target.push({ra:radec[0], dec:radec[1], ct:ct});
		$('.target_selecte').css("display","inline");
		$('.target_selecte').css("color","#87F6FF");
		$('.target_selecte').attr("class","target_selecte selected");
		$('.select_flash').css("display","inline");
		$('.select_trash').css("display","inline");
	}

	var hideXMMFlash = function(){
		if(aladinLiteView.masterResource != undefined){
			return '<i id="btn-XMM-flash" class="btn-XMM-flash menu_item glyphicon glyphicon-flash" onclick="AladinLiteX_mVc.XMMFlash();"></i>'
		}else{
			return '';
		}
	}
	
	retour = {
			popup : popup,
			refresh : refresh,
			init: init,
			draw : draw,
			switchPanel : switchPanel,
			closeContext : closeContext,
			returnCenter : returnCenter,
			bookMark : bookMark,
			getHistory : getHistory,
			restoreView: restoreView,
			regionEditor: regionEditor,
			addOverlayer : addOverlayer,
			gotoPosition : gotoPosition,
			world2pix : world2pix,
			setZoom : setZoom,
			increaseZoom : increaseZoom,
			decreaseZoom : decreaseZoom,
			pix2world : pix2world,
			disabledButton : disabledButton,
			reabledButton : reabledButton,
			storePolygon : storePolygon,
			deleteHistory : deleteHistory,
			restoreViewById :restoreViewById,
			searchHips :searchHips,
			displaySelectedHips : displaySelectedHips,
			createImageSurvey : createImageSurvey,
			setImageSurvey : setImageSurvey,
			displayDetailInContext : displayDetailInContext,
			hipsFunction : hipsFunction,
			findSurveyDescriptionById : findSurveyDescriptionById,
			createHipsSelect : createHipsSelect,
			searchCataloge : searchCataloge,
			searchPosition : searchPosition,
			catalogFunction : catalogFunction,
			displayCatalogDetailInContext : displayCatalogDetailInContext,
			displaySimbadCatalog : displaySimbadCatalog,
			displayNedCatalog : displayNedCatalog,
			detailCatalogOperator : detailCatalogOperator,
			displayDataXml : displayDataXml,
			XMMFlash : XMMFlash,
			displayCatalog : displayCatalog,
			cleanCatalog : cleanCatalog,
			displayVizierCatalog : displayVizierCatalog,
			showDetail : showDetail,
			storeCurrentState : storeCurrentState,
			colorFadeOut : colorFadeOut,
			colorFadeIn : colorFadeIn,
			displayTarget : displayTarget,
			addCatalogInSelector : addCatalogInSelector,
			hideXMMFlash : hideXMMFlash
	};
	return retour
}();
