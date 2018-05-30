function AladinLite_mvC(aladinView, controllers){
	this.modules = {};
	this.aladinView = aladinView;
	if (controllers.historic != undefined ){
		this.modules.historic = controllers.historic.model;
	}
    if (controllers.regionEditor != undefined ){
	    this.modules.regionEditor = controllers.regionEditor.view;
    }
    if (controllers.hipsSelector != undefined ){
	    this.modules.hipsSelector = controllers.hipsSelector.model;
    }


}

AladinLite_mvC.prototype = {
		
		bookMark: function(aladinLiteView){
			if( this.modules.historic != undefined )
				return this.modules.historic.bookMark(aladinLiteView);
			else 
				return null;
		},
		
		deleteHistory : function(id){
			if(this.modules.historic != undefined)
				return this.modules.historic.deleteHistory(id );
			else
				return null;
		},
		
		getHistory: function(aladinLiteView){
			if( this.modules.historic != undefined )
				return this.modules.historic.getHistory(aladinLiteView);
			else 
				return null;
		},

		
		editRegion: function(){
			if(this.modules.regionEditor != undefined)
				return this.modules.regionEditor.init();
			else
				return null;
		},
		
		setInitialValue: function(points){
			if(this.modules.regionEditor != undefined)
				return this.modules.regionEditor.setInitialValue(points);
			else
				return null;
		},
		
		cleanPolygon: function(){
			if(this.modules.regionEditor != undefined)
				return this.modules.regionEditor.clean();
			else
				return null;
		},
		
		setPoligon: function(region){
			if(this.modules.regionEditor != undefined)
				return this.modules.regionEditor.setPoligon(region);
			else
				return null;
		},
		
		restoreViewById: function(viewId){
			if(this.modules.historic != undefined)
				return this.modules.historic.restoreViewById(viewId);
			else
				return null;
		},
		
		searchHips: function(mask, aladinLiteView){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.searchHips(mask, aladinLiteView);
			else
				return null;			
		},
		
		getSelectedHips: function(ID){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.getSelectedHips(ID);
			else
				return null;
		},

		searchCataloge: function(mask, aladinLiteView){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.searchCataloge(mask, aladinLiteView);
			else
				return null;
		},
		
		getSelectedCatalog: function(obs_id){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.getSelectedCatalog(obs_id);
			else
				return null;
		},
		storeCurrentCatalog: function(obs_id){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.storeCurrentCatalog(obs_id);
			else
				return null;
		},

		deleteCatalogInTab: function(i){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.deleteCatalogInTab(i);
			else
				return null;
		},
		createCatalogSelect: function(){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.createCatalogSelect();
			else
				return null;
		},
		
		displaySimbadCatalog: function(){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.displaySimbadCatalog();
			else
				return null;
		},
		
		displayNedCatalog: function(aladinLiteView){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.displayNedCatalog(aladinLiteView);
			else
				return null;
		},
		
		restoreCatalog: function(aladinLiteView){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.restoreCatalog(aladinLiteView);
			else
				return null;
		},
		
		currentCatalogTab: function(){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.currentCatalogTab();
			else
				return null;
		},
		
		displayDataXml: function(aladinLiteView){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.displayDataXml(aladinLiteView);
			else
				return null;
		},
		
		
		updateCatalogs: function(aladinLiteView, state){
			if(this.modules.hipsSelector != undefined)
				return this.modules.hipsSelector.updateCatalogs(aladinLiteView,state);
			else
				return null;
		}
		
		
}