/**
 * 
 * parentDivId="aladin-lite-div"
 * 
 */
function HipsSelector_Mvc (parentDivId, aladinLite_V){
	this.productType = null;
	this.baseUrl = null
	this.imageIdPattern 	= new RegExp(/.*\/C\/.*/);
	this.imageTilePattern 	= new RegExp(/.*((jpeg)|(png)).*/);
	this.view = new HipsSelector_mVc(parentDivId, this);
	this.hips_dict = {};
	this.cata_dict = {};// les catalog trouveés 
	this.cata_tab = [];//pour stoker obs_id et afficher dans le panneau
	this.cata_created = {}; //tous les catalog qui a été crée par A.cata... et afficher dans aladin sont stoker comme objet cata 
	this.color = {};
	this.aladinLite_V = aladinLite_V;
}

HipsSelector_Mvc.prototype = {	
		searchHips : function(mask,aladinLiteView){
			var that = this;
			
			/**
			 * créer le lien url pour acces au serveur
			 */
			this.baseUrl ="http://alasky.unistra.fr/MocServer/query?RA=" 
				+ aladinLiteView.ra + "&DEC=" + aladinLiteView.dec 
				+ "&SR=" + aladinLiteView.fov + "&fmt=json&get=record&casesensitive=false";
			
			/**
			 * afficher le panel de la liste
			 */
			that.view.displaylistepanel();
			that.productType = "image";
			var url = this.baseUrl;
			if( mask != "" ){
				url += "&publisher_id,publisher_did,obs_id,obs_title,obs_regime=*"  + mask + "*";
			}
			$.getJSON(url, function(jsondata) {
					if( that.productType != undefined ){
						for(var i = jsondata.length - 1; i >= 0; i--) {
							if(jsondata[i].dataproduct_type != that.productType ) {
								jsondata.splice(i, 1);
							}
						}
						if( that.productType == "image" ){
							for(var i = jsondata.length - 1; i >= 0; i--) {
								var keepIt = 0;
									if(  $.isArray(jsondata[i].hips_tile_format)) {
										for( var j=0 ; j<jsondata[i].hips_tile_format.length ; j++){
											if( that.imageTilePattern.test(jsondata[i].hips_tile_format[j]) ){
												keepIt = 1;
												break;
											}
										}
									} else if(  that.imageTilePattern.test(jsondata[i].hips_tile_format) ){
										keepIt = 1;
									}
								if( keepIt == 0 ){
									jsondata.splice(i, 1);
								}
							}
						}
					}
					that.storeHips(jsondata);
					that.view.displayHipsList(jsondata);
			});
		},
		
		storeHips : function(jsondata){
			var self = this;
			for(var i=0 ; i<jsondata.length ; i++){
				self.hips_dict[jsondata[i].ID]= jsondata[i];
			}
		},
		
		getSelectedHips: function(ID){
			return this.hips_dict[ID];
		},
		
		/**
		 * la différence entre le cataloge et le hips est le 'productType'
		 */
		searchCataloge: function(mask,aladinLiteView){
			var that = this;

			this.baseUrl ="http://alasky.unistra.fr/MocServer/query?RA=" 
				+ aladinLiteView.ra + "&DEC=" + aladinLiteView.dec 
				+ "&SR=" + aladinLiteView.fov + "&fmt=json&get=record&casesensitive=false&MAXREC=100";

			that.view.displaylistepanel();
			that.productType = "catalog";
			var url = this.baseUrl;
			if( mask != "" ){
				url += "&publisher_id,publisher_did,obs_id,obs_title,obs_regime=*"  + mask + "*";
			}
			$.getJSON(url, function(jsondata) {
					if( that.productType != undefined ){
						for(var i = jsondata.length - 1; i >= 0; i--) {
							if(jsondata[i].dataproduct_type != that.productType ) {
								jsondata.splice(i, 1);
							}
						}
					}
					that.storeCatalog(jsondata);
					that.view.displayCatalogeList(jsondata);
			});
		},
		
		storeCatalog : function(jsondata){
			var self = this;
			for(var i=0 ; i<jsondata.length ; i++){
				self.cata_dict[jsondata[i].obs_id]= jsondata[i];
			}
		},
		
		getSelectedCatalog: function(obs_id){
			return this.cata_dict[obs_id];
		},
		
		storeCurrentCatalog:function(obs_id){
			var state=false;
			for(var i=0;i<this.cata_tab.length;i++){
				if(this.cata_tab[i]==obs_id){
					state = true
					break;
				}
			}
			if(state==false){
				this.cata_tab.push(obs_id);
			}
		},
		
		deleteCatalogInTab: function(i){
			this.cata_tab.splice(i, 1);			
		},
		
		createCatalogSelect: function(){
			var self=this;
			return this.view.createCatalogSelect(self.cata_tab,self.cata_dict);
		},
		
		displaySimbadCatalog: function(){
			return this.view.displaySimbadCatalog();
		},
		
		displayNedCatalog: function(aladinLiteView){
			return this.view.displayNedCatalog(aladinLiteView);
		},
		
		currentCatalogTab: function(){

			var self = this;
			var tab = [];
			for(var i=0;i<self.cata_tab.length;i++){
				var element = {catalog:null, color: null};
				element.catalog = self.cata_tab[i];
				element.color = self.view.libraryMap.getColorByCatalog(self.cata_tab[i]).color;
				tab.push(element);
			}

			return tab;			
		},
		
		restoreCatalog: function(aladinLiteView){
			var self =this;
			var map = {};
			for(var i=0; i<aladinLiteView.catalogTab.length; i++){
				var x;
				self.view.libraryMap.setCatalogByColor(aladinLiteView.catalogTab[i]);
				if(self.cata_dict[aladinLiteView.catalogTab[i].catalog].hips_service_url==undefined){
					x = self.aladinLite_V.displayVizierCatalog(self.view, aladinLiteView.catalogTab[i].catalog, aladinLiteView.catalogTab[i].color, 'showTable');
				}else{
					x = self.aladinLite_V.displayVizierCatalog(self.view, aladinLiteView.catalogTab[i].catalog, aladinLiteView.catalogTab[i].color, 'showTable', self.cata_dict[aladinLiteView.catalogTab[i].catalog].hips_service_url);
				}
				self.storeCurrentCatalog(aladinLiteView.catalogTab[i].catalog);
				map[aladinLiteView.catalogTab[i].catalog] = x;
			}
			this.view.redrawCatalogSelector(aladinLiteView,map);
		},
		
		displayDataXml: function(aladinLiteView){
			var self = this;
			var url = aladinLiteView.masterResource.setParamsInUrl(aladinLiteView);
			return this.view.displayDataXml(aladinLiteView,url);
		},
		
		updateCatalogs: function(aladinLiteView,state){
			var self = this;
			var url = aladinLiteView.masterResource.setParamsInUrl(aladinLiteView);
			return this.view.updateCatalogs(aladinLiteView,url,state);
		}
}