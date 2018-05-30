Historique_mVc = function(model, contextDivId,aladinLite_V){
	this.that = this;
	this.model = model;
	this.contextDivId = contextDivId;
	this.contextDiv = null;
	this.aladinLite_V = aladinLite_V;
}

Historique_mVc.prototype = {
		drawContext : function(){
			var self = this;
			if( this.contextDiv == null ) {
				this.contextDiv  = $('#' + this.contextDivId);
			}
			
			var html = '<ul style="padding-left:18px;">';
			for (var k=0 ; k<this.model.mark_tab.length; k++) {
				html += "<li style='list-style-type: none;padding-top:5px;'>" + this.model.mark_tab[k].getHTMLTitle() + "</li>";
				html += "<div id='description_"+ this.model.mark_tab[k].id + "' style='display: none;'><span>Position: "
					  + this.model.mark_tab[k].ra + ", " 
					  + this.model.mark_tab[k].dec + "</span><br><span>Fov: " 
					  + this.model.mark_tab[k].fov + "</span><br><span>Survey: "
					  + this.model.mark_tab[k].survey.obs_title + "</span><p style='font-size:small;line-height: 1em;font-weight:100;color:#000000;'>"
					  + this.model.mark_tab[k].survey.obs_description + "</p>"
					  + this.displayCataDescription(self.model.mark_tab[k].catalogTab) +"</div>";

			}
			html += '</ul>';
			
			
			
			this.contextDiv.html(html);
			
//			this.contextDiv.find('ul').on('click', 'li', function(e) {
//				e.stopPropagation(); 
//				
//				var idx = $(this).index();
//				var aladinLiteView= new AladinLiteView();
//				aladinLiteView.name = self.model.mark_tab[idx].name;
//				aladinLiteView.ra = self.model.mark_tab[idx].ra;
//				aladinLiteView.dec = self.model.mark_tab[idx].dec;
//				aladinLiteView.fov = self.model.mark_tab[idx].fov;
//				aladinLiteView.survey = self.model.mark_tab[idx].survey;
//				aladinLiteView.region = self.model.mark_tab[idx].region;
//				self.model.restoreView(aladinLiteView);	
//				
//				
//			});
			
			for(var i=0; i<this.model.mark_tab.length; i++){
				this.model.mark_tab[i].setHandlers();
				$("#" + this.model.mark_tab[i].id +"_menu_show_description").click(function(e){
					$("#description_" + this.id.replace("_menu_show_description","")).slideToggle();
					e.stopPropagation();
				});
			}
			
		},
		
		displayCataDescription: function(catalogTab){
			var str = "";
			if(catalogTab.length > 0){
				str += "<span>Catalog: <br>"
				for(var i=0;i<catalogTab.length;i++){
					str+=catalogTab[i].catalog + ",  ";
				}
				str +="</span>";
			}
			return str;
		}
}

