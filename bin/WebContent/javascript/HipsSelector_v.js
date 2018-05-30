/**
 * 
 * @param parentDivId:  "aladin-lite-div"
 * @param model: HipsSelector_Mvc()
 * @returns
 */
function HipsSelector_mVc(parentDivId, model){
	this.parentDivId = parentDivId;
	this.parentDiv = null;
	this.libraryMap = new LibraryMap();
	this.idCounter = 0;
	this.model = model;
}

HipsSelector_mVc.prototype = {
		/**
		 * afficher le panneau de la liste sur aladin
		 */
		displaylistepanel : function(){
			if( this.parentDiv == null )
				this.parentDiv = $('#' + this.parentDivId);
			this.parentDiv.append('<div id="itemList" class="hips_panel"></div>');
		},
		
		/**
		 * afficher la liste de surveys
		 */
		displayHipsList : function(jsondata){
				var itemList = $("#itemList");
				if( itemList.css("display") == "none"){
					itemList.css("display", "block");
					itemList.css("z-index", "10000");
				}
				itemList.html("<span class=strong style='color:#2e3436;'>" + jsondata.length + " matching Hips images</span>\n"
				+ '<a href="#" onclick="$(&quot;#itemList&quot;).css(&quot;display&quot;, &quot;none&quot;);"'
				+ 'style="top: 18px;float: right;" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
				+ '<span class="ui-icon ui-icon-closethick">close</span></a><br><br>');
				for(var i=0 ; i<jsondata.length ; i++){
					itemList.append("<div id = 'panel_"
							+ jsondata[i].ID + "' class='liste_item' ><bn class='title_in_liste'>"
							+ jsondata[i].obs_title +"</b></div><div id='" 
							+ jsondata[i].ID 
							+ "' class='description_panel'><span class=datahelp style='cursor: pointer;color:#4D36DC;font-size: medium;' onclick='AladinLiteX_mVc.hipsFunction(&quot;" + jsondata[i].ID
							+ "&quot;)'>"  + jsondata[i].obs_title + "</span><br><br>"
							+ "<span class=blackhelp style='font-size:small;'>"
							+ jsondata[i].obs_regime + "</span><br>"
							+ "<span class=blackhelp style='font-size:small;'>"
							+ jsondata[i].obs_description + "</span></div>");
					$(document.getElementById("panel_"+jsondata[i].ID)).click(function(){
						var id = $(this).attr('id')	.replace('panel_','').replace(/\//g, "\\/");
						$("#" + id).slideToggle();	
						$(this).toggleClass("liste_item_close");
					});
				}
		},
		
		displayCatalogeList : function(jsondata){
				var itemList = $("#itemList");
				if( itemList.css("display") == "none"){
					itemList.css("display", "block");
					itemList.css("z-index", "10000");
				}
				itemList.html("<span class=strong>" + jsondata.length + " matching Catalogues</span>\n"
				+ '<a href="#" onclick="$(&quot;#itemList&quot;).css(&quot;display&quot;, &quot;none&quot;);" '
				+ 'style="top: 18px;float: right;" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
				+ '<span class="ui-icon ui-icon-closethick">close</span></a><br><br>');
				for(var i=0 ; i<jsondata.length ; i++){
					if(jsondata[i].hips_service_url == undefined){
						itemList.append("<div id = 'catalog_"
								+ jsondata[i].ID + "' class='liste_item' ><bn class='title_in_liste'>"
								+ jsondata[i].obs_title +"</b></div><div id='cata_" 
								+ jsondata[i].ID 
								+ "' class='description_panel'><span class=datahelp style='cursor: pointer;color:#4D36DC;font-size: medium;' "
								+ "onclick='AladinLiteX_mVc.catalogFunction(&quot;" + jsondata[i].obs_id + "&quot);'>"  
								+ jsondata[i].obs_title + "</span><br>"
								+ "<span class=blackhelp style='font-size:small;'>"
								+ jsondata[i].obs_description + "</span></div>");
					}else{
						itemList.append("<div id = 'catalog_"
								+ jsondata[i].ID + "' class='liste_item' ><bn class='title_in_liste'>"
								+ jsondata[i].obs_title +"</b><i class='glyphicon glyphicon-asterisk' style='font-size:8px;'></i></div><div id='cata_" 
								+ jsondata[i].ID 
								+ "' class='description_panel'><span class=datahelp style='cursor: pointer;color:#4D36DC;font-size: medium;' "
								+ "onclick='AladinLiteX_mVc.catalogFunction(&quot;" + jsondata[i].obs_id + "&quot);'>"  
								+ jsondata[i].obs_title + "</span><br>"
								+ "<span class=blackhelp style='font-size:small;'>"
								+ jsondata[i].obs_description + "</span><br>"
								+ "<span style='font-size:small;'>"
								+ jsondata[i].hips_service_url+"</span></div>");
					}
					$(document.getElementById("catalog_"+jsondata[i].ID)).click(function(){
						var id = $(this).attr('id').replace('catalog_','cata_').replace(/\//g, "\\/").replace(/\+/g,"\\+");
						$("#" + id).slideToggle();	
						$(this).toggleClass("liste_item_close");
					});
				}
		},
		
		/**
		 * display the catalog list in panel
		 */
		createCatalogSelect : function(cata_tab, cata_dict){
			var self=this;
			var color = this.libraryMap.getNextFreeColor(cata_tab[self.idCounter]).color;
			
			
			/*
			 * draw the initial cata in AL
			 */
			
				
			$("#itemList").css("display", "none");
			
			var cataInit = null;
			this.show();
			if(cata_dict[cata_tab[self.idCounter]].hips_service_url!=undefined){
				cataInit = self.model.aladinLite_V.displayVizierCatalog(self, cata_dict[cata_tab[self.idCounter]].obs_id, color,'showTable', cata_dict[cata_tab[self.idCounter]].hips_service_url);
				self.model.cata_created[cata_dict[cata_tab[self.idCounter]].obs_id] = cataInit;
			}else{
				cataInit = self.model.aladinLite_V.displayVizierCatalog(self, cata_dict[cata_tab[self.idCounter]].obs_id, color, 'showTable');
				self.model.cata_created[cata_dict[cata_tab[self.idCounter]].obs_id] = cataInit;
			}
			
			
			
			/*
			 * draw the list of cata in panel 
			 */
			
			
			
			
			$("#vizier_list").append('<li style="list-style-type: none;height:24px;">'
						+'<div id="cata_operate_'+ self.idCounter +'" title="Show/hide Vizier sources" class="vizier_chosen menu_item" style="display:inline; cursor: pointer;color:'+color+';" >' + cata_dict[cata_tab[self.idCounter]].obs_id + '</div>&nbsp;'
						+'<i id="btn_detail_catalog_'+ self.idCounter +'" title="detail" class="glyphicon glyphicon-info-sign btn-operate-catalog" style="color:'+color+';cursor: pointer;" onclick="AladinLiteX_mVc.detailCatalogOperator('+ self.idCounter +')"></i>&nbsp;'
						+'<i id="btn_flash_catalog_'+ self.idCounter +'" title="flash" class="glyphicon glyphicon-flash btn-operate-catalog" style="color:'+color+';cursor: pointer;"></i>&nbsp;'
						+'<i id="btn_delete_catalog_'+ self.idCounter +'" title="delete" class="glyphicon glyphicon-trash btn-operate-catalog" style="color:'+color+';cursor: pointer;"></i></li>');
			

			var x = self.idCounter;
			
			$('#vizier').on('click','#cata_operate_'+self.idCounter,function(){
								
					event.stopPropagation();
					var catTab = cata_tab[x];
					var cataColor = self.libraryMap.getColorByCatalog(catTab);
					
					
					if($(this).attr("class") != "vizier_chosen menu_item"){					
						$(this).attr("class", "vizier_chosen menu_item");
						$(this).css("color", cataColor.color);
						
						self.show();

						$("#itemList").css("display", "none");
						if(cata_dict[catTab].hips_service_url != undefined){
							cataInit = self.model.aladinLite_V.displayVizierCatalog(self, cata_dict[catTab].obs_id, cataColor.color, 'showTable', cata_dict[catTab].hips_service_url)
							self.model.cata_created[cata_dict[catTab].obs_id] = cataInit;
						}else{
							cataInit = self.model.aladinLite_V.displayVizierCatalog(self, cata_dict[catTab].obs_id, cataColor.color, 'showTable');
							self.model.cata_created[cata_dict[catTab].obs_id] = cataInit;
						}
					}else{
						$(this).attr("class", "vizier_in_menu menu_item");
						$(this).css("color", "#888a85");
						self.model.aladinLite_V.cleanCatalog("VizieR:"+cata_dict[catTab].obs_id);
					}				
			});
			
			
			
			$('#vizier').on('click','#btn_delete_catalog_'+self.idCounter,function(){
				event.stopPropagation();
								

				if($("#cata_operate_"+ x).attr("class") == "vizier_chosen menu_item"){
					$("#cata_operate_"+ x).attr("class", "vizier_in_menu menu_item");
					self.model.aladinLite_V.cleanCatalog("VizieR:"+cata_dict[cata_tab[x]].obs_id);
				}
				
				self.libraryMap.freeColor(cata_dict[cata_tab[x]].obs_id);
				self.model.deleteCatalogInTab(x);
				
				var html='';
					
				if(cata_tab.length != 0){
								
					for(var j=0;j<cata_tab.length;j++){
					
						var p= self.libraryMap.getColorByCatalog(cata_tab[j]);
					
						html += '<li style="list-style-type: none;height:24px;">'
							+'<div id="cata_operate_'+ j +'" title="Show/hide Vizier sources" class="vizier_chosen menu_item" style="display:inline; cursor: pointer;color:'+p.color+';" >' + cata_tab[j] + '</div>&nbsp;'
							+'<i id="btn_detail_catalog_'+ j +'" title="detail" class="glyphicon glyphicon-info-sign btn-operate-catalog" style="color:'+p.color+';cursor: pointer;" onclick="AladinLiteX_mVc.detailCatalogOperator('+ j +')"></i>&nbsp;'
							+'<i id="btn_flash_catalog_'+ j +'" title="flash" class="glyphicon glyphicon-flash btn-operate-catalog" style="color:'+p.color+';cursor: pointer;"></i>&nbsp;'
							+'<i id="btn_delete_catalog_'+ j +'" title="delete" class="glyphicon glyphicon-trash btn-operate-catalog" style="color:'+p.color+';cursor: pointer;"></i></li>';
					}
				}
				$("#vizier_list").html(html);
				self.idCounter--;

			});
			
			$('#vizier').on('click','#btn_flash_catalog_'+self.idCounter,function(){
				event.stopPropagation();
				//cataInit.makeFlash();
				var catTab = cata_tab[x];
				self.model.cata_created[cata_dict[catTab].obs_id].makeFlash();
			});
			
			self.idCounter++;
	
		},
		
		

		displaySimbadCatalog : function(){
			var self=this;
			var name = 'Simbad';
			var cmdNode = $("#" + name);
			var color= this.libraryMap.colorMap[name].color;
			var url = 'http://axel.u-strasbg.fr/HiPSCatService/Simbad';
			var clickType = 'showTable';
			if(cmdNode.attr("class") == "simbad_in_menu menu_item datahelp" ){
				this.show();
				cmdNode.attr("class", "simbad_in_menu menu_item selecteddatahelp");
				cmdNode.css("color", color);
				self.model.aladinLite_V.displayCatalog(self, name, color, clickType, url);
			}else{
				cmdNode.attr("class", "simbad_in_menu menu_item datahelp");
				cmdNode.css("color", "#888a85");
				self.model.aladinLite_V.cleanCatalog(name);
			}
		},
		
		displayNedCatalog: function(aladinLiteView){
			var self= this;
			var name = 'NED';
			var cmdNode = $("#" + name);
			var color= this.libraryMap.colorMap[name].color;
			var clickType = 'showTable';
			if(cmdNode.attr("class") == "ned_in_menu menu_item datahelp" ){
				if(aladinLiteView.fov>=1){
					$("#alert").fadeIn(100);
					setTimeout("$('#alert').fadeOut('slow')",1300);
				}else{
					this.show();
					cmdNode.attr("class", "ned_in_menu menu_item selecteddatahelp");
					cmdNode.css("color", color);
					self.model.aladinLite_V.displayCatalog(self, name, color, clickType);
				}
			}else{
				cmdNode.attr("class", "ned_in_menu menu_item datahelp");
				cmdNode.css("color", "#888a85");
				self.model.aladinLite_V.cleanCatalog(name);
			}
		},
		
		/**
		 * aladinLiteView = {
			this.name = null;
			this.ra = null;
			this.dec = null; 
			this.fov = null;
			this.survey = null;
			this.region = null;
			this.id = null;
			this.img = null;
			this.XMM = false;
			this.catalogTab = null;
			}
		 */
		
		redrawCatalogSelector: function(aladinLiteView,map){
			//console.log(aladinLiteView.catalogTab)
			//console.log(map)
			var self = this;
			var html='';				
			if(aladinLiteView.catalogTab.length != 0){			
				for(var j=0;j<aladinLiteView.catalogTab.length;j++){
					html += '<li style="list-style-type: none;height:24px;">'
						+'<div id="cata_operate_'+ j +'" title="Show/hide Vizier sources" class="vizier_chosen menu_item" style="display:inline; cursor: pointer;color:'+aladinLiteView.catalogTab[j].color+';" >' + aladinLiteView.catalogTab[j].catalog + '</div>&nbsp;'
						+'<i id="btn_detail_catalog_'+ j +'" title="detail" class="glyphicon glyphicon-info-sign btn-operate-catalog" style="color:'+aladinLiteView.catalogTab[j].color+';cursor: pointer;" onclick="AladinLiteX_mVc.detailCatalogOperator('+ j +')"></i>&nbsp;'
						+'<i id="btn_flash_catalog_'+ j +'" title="flash" class="glyphicon glyphicon-flash btn-operate-catalog" style="color:'+aladinLiteView.catalogTab[j].color+';cursor: pointer;"></i>&nbsp;'
						+'<i id="btn_delete_catalog_'+ j +'" title="delete" class="glyphicon glyphicon-trash btn-operate-catalog" style="color:'+aladinLiteView.catalogTab[j].color+';cursor: pointer;"></i></li>';
				}
			}
			$("#vizier_list").html(html);
			
			for(var i=0;i<aladinLiteView.catalogTab.length;i++){
				//map[key];
				let x = i;
				$('#vizier').on('click','#btn_flash_catalog_'+i,function(){
							
					event.stopPropagation();
					
					map[aladinLiteView.catalogTab[x].catalog].makeFlash();
					
				});
//				$('#vizier').on('click','#cata_operate_'+i,function(){
//					event.stopPropagation();
//					
//					
//					
//					if($('#cata_operate_'+x).attr("class") != "vizier_chosen menu_item"){					
//						$('#cata_operate_'+x).attr("class", "vizier_chosen menu_item");
//						$('#cata_operate_'+x).css("color", aladinLiteView.catalogTab[x].color);
//						map[aladinLiteView.catalogTab[x].catalog].show();
//					}else{
//						console.log($('#cata_operate_'+x).attr("class"));
//						$('#cata_operate_'+x).attr("class", "vizier_in_menu menu_item");
//						$('#cata_operate_'+x).css("color", "#888a85");
//						map[aladinLiteView.catalogTab[x].catalog].hide();
//					}
//				});
			}
		},
		
		/**
		 * dataXML={position, service}
		 */
		
		displayDataXml: function(aladinLiteView,url){
			var self = this;
			var name = 'Swarm';
			var cmdNode = $("#XMM");
			var clickType = 'handler';
			if(cmdNode.attr("class") == "XMM_in_menu menu_item datahelp"){
				if(aladinLiteView.fov>=1){
					$("#alert").fadeIn(100);
					setTimeout("$('#alert').fadeOut('slow')",1300);
				}else{
					this.show();
					cmdNode.attr("class", "XMM_in_menu menu_item selecteddatahelp");
					cmdNode.css("color", "red");
					
					$("#btn-XMM-flash").css("color" , "red");
					self.model.aladinLite_V.displayCatalog(self, name, "#ff0000", clickType, url);
				}
			}else{
				cmdNode.attr("class", "XMM_in_menu menu_item datahelp");
				cmdNode.css("color", "#888a85");
				$("#btn-XMM-flash").css("color" , "#888a85");
				self.model.aladinLite_V.cleanCatalog(name);
				//$("#aladin-lite-div-context").html("");
				self.model.aladinLite_V.cleanCatalog("Target");
			}
		},
		
		
		show: function(){
			$("#waiting_interface").css("display","inline");	
		},
		hide: function(name){
			if(typeof(name)!='object' && $("#XMM").attr("class") == "XMM_in_menu menu_item selecteddatahelp"){
				setTimeout("$('#waiting_interface').css('display','none')",3500);
			}else{
				$("#waiting_interface").css("display","none");
			}
		},
		
		updateCatalogs: function(aladinLiteView,url,state){
			var self = this;
			if($(document.getElementById("XMM")).attr("class") == "XMM_in_menu menu_item selecteddatahelp"){
				self.model.aladinLite_V.storeCurrentState();
				if(state == 'zoom'){
					if(aladinLiteView.fov>=1){
						$("#alert").fadeIn(100);
						setTimeout("$('#alert').fadeOut('slow')",1300);
					}else{
						self.model.aladinLite_V.cleanCatalog('Swarm');
						self.show();
						self.model.aladinLite_V.displayCatalog(self, 'Swarm', "red", 'handler', url);
					}
				}else if(state == 'position'){
					if(aladinLiteView.fov>=1){
						$("#alert").fadeIn(100);
						setTimeout("$('#alert').fadeOut('slow')",1300);
					}
					self.model.aladinLite_V.cleanCatalog('Swarm');
					self.show();
					self.model.aladinLite_V.displayCatalog(self, 'Swarm', "red", 'handler', url);
				}
			}
			if(self.model.cata_tab.length != 0){
				self.model.aladinLite_V.storeCurrentState();
				var cata = null;
				if(state == 'zoom'){
					for(var i=0;i<self.model.cata_tab.length;i++){
						//console.log(self.model.cata_tab[i])
						var cataInit = null;
						if(self.model.cata_dict[self.model.cata_tab[i]].hips_service_url!=undefined){
							cataInit = self.model.aladinLite_V.displayVizierCatalog(self,self.model.cata_tab[i] , self.libraryMap.getColorByCatalog(self.model.cata_tab[i]).color, 'showTable', self.model.cata_dict[self.model.cata_tab[i]].hips_service_url);
							self.model.cata_created[self.model.cata_tab[i]] = cataInit;
						}else{
							if(aladinLiteView.fov>=1){
								$("#alert").fadeIn(100);
								setTimeout("$('#alert').fadeOut('slow')",1300);
							}else{
								if($(document.getElementById("cata_operate_"+i)).attr("class") == "vizier_chosen menu_item"){
									self.model.aladinLite_V.cleanCatalog("VizieR:"+self.model.cata_tab[i]);
									cataInit = self.model.aladinLite_V.displayVizierCatalog(self,self.model.cata_tab[i] , self.libraryMap.getColorByCatalog(self.model.cata_tab[i]).color, 'showTable');
									self.model.cata_created[self.model.cata_tab[i]] = cataInit;
								}
							}
						}
					}
				}else if(state == 'position'){
					for(var i=0;i<self.model.cata_tab.length;i++){
						if(aladinLiteView.fov>=1){
							$("#alert").fadeIn(100);
							setTimeout("$('#alert').fadeOut('slow')",1300);
						}
						var cataInit = null;
						if($(document.getElementById("cata_operate_"+i)).attr("class") == "vizier_chosen menu_item"){
							
							
							self.model.aladinLite_V.cleanCatalog("VizieR:"+self.model.cata_tab[i]);
							console.log(self.model.cata_dict[self.model.cata_tab[i]].hips_service_url)
							if(self.model.cata_dict[self.model.cata_tab[i]].hips_service_url==undefined){
								cataInit = self.model.aladinLite_V.displayVizierCatalog(self,self.model.cata_tab[i] , self.libraryMap.getColorByCatalog(self.model.cata_tab[i]).color, 'showTable');
								self.model.cata_created[self.model.cata_tab[i]] = cataInit;
							}else{
								cataInit = self.model.aladinLite_V.displayVizierCatalog(self,self.model.cata_tab[i] , self.libraryMap.getColorByCatalog(self.model.cata_tab[i]).color, 'showTable', self.model.cata_dict[self.model.cata_tab[i]].hips_service_url);
								self.model.cata_created[self.model.cata_tab[i]] = cataInit;
							}
						}
						
					}
				}
			}
		}
}