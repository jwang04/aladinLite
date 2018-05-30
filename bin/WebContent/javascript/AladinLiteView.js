AladinLiteView = function (){
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
	this.masterResource;
	this.target = [];
	this.comment = null;
}

AladinLiteView.prototype = {
	
		/*
		 * création de la vue de liste, si region existe, la liste affiche le logo R
		 */
	getHTMLTitle: function() {
		return '<div id="' + this.id + '" style="height:35px;"><img id="' + this.id + '_snapShot_img" src="' 
			+ this.img 
			+ '" onclick="AladinLiteX_mVc.restoreViewById(&quot;' + this.id + '&quot;);" '
			+ 'style= "height: 18px;width: 18px;">&nbsp;&nbsp;&nbsp;</img><i id="' + this.id + '_link"  style="vertical-align: top;font-weight:800;">'  //stoker le id dans la div
			+ this.name 
			+ ' | '
			+ this.survey.ID
			+ '</i>&nbsp;'
			+ this.regionIcon()
			+ '&nbsp;'
			+ this.targetIcon()
			+ '<button id="' + this.id + '_menu" type="edit list" title="menu" class="btn btn-color-his btn-edit"><i class="glyphicon glyphicon-record" style="font-size:19px;position:relative;top:-4px;"></i></button>'
			+ '<button id="' + this.id +'_menu_close_img" title="delete" class="btn btn-color-his btn-in-edit" ' 
			+ 'onclick="AladinLiteX_mVc.deleteHistory(&quot;' + this.id + '&quot;);"><i class="glyphicon glyphicon-remove-sign" style="font-size:15px;"></i></button>'
			+ '<button id="' + this.id +'_menu_commit" title="commit" class="btn btn-color-his btn-in-edit" style="position:relative;left:-35px;" ><i class="glyphicon glyphicon-pencil" style="font-size:15px;"></i></button>'
			+ '<button id="' + this.id +'_menu_show_description" title="description" class="btn btn-color-his btn-in-edit" style="position:relative;left:-57px;"><i class="glyphicon glyphicon-paperclip" style="font-size:15px;"></i></button>'
			+ '<textarea id="' + this.id +'_menu_commit_text" class="text-commit" style="display:none;"></textarea>'
			+ '<button id="' + this.id +'_menu_commit_text_confirm" class="btn bth-text-ok btn-color-ok" style="display:none;"><i class="glyphicon glyphicon-ok" style="font-size:11px;"></i></button>'
			+ '<button id="' + this.id +'_menu_commit_text_delete" class="btn bth-text-remove btn-color-remove" style="display:none;"><i class="glyphicon glyphicon-remove" style="font-size:11px;"></i></button>'
			+ '<div id="' + this.id +'_menu_commit_text_display" class="menu_commit_text_display" style="">'+ this.displayComment() +'</div></div>';
	},
	
	regionIcon: function(){
		if( this.region == null){
			return "";
		} else {
			return '<i class="glyphicon glyphicon-registration-mark" style="font-size:18;vertical-align: top;"></i>';
		}
	},
	
	targetIcon: function(){
		if( this.target.length == 0){
			return "";
		} else {
			return '<i class="glyphicon glyphicon-star" style="vertical-align: top;color:red"></i>';
		}
	},
	
	displayComment: function(){
		if( this.comment == null){
			return "";
		}else{
				return this.comment;
		}
	},

	
	/*
	 * actions of mouse change the states of img red cross
	 */
	setHandlers: function() {
		/*
		 * operation on button edit and his son buttons
		 */
		var self = this;
		var statue = false;
		/*
		 * operation on image
		 */
		$("#" + this.id+ "_snapShot_img").mouseover(function(event){
			$("#" + this.id).css("width", "100px");
			$("#" + this.id).css("height", "100px");
			$("#"+$(this).attr('id').replace("_snapShot_img","")).css("height", "100px");
		});
		$("#"+this.id+ "_snapShot_img").mouseout(function(event){
			$("#" + this.id).css("width", "18px");
			$("#" + this.id).css("height", "18px");
			if(statue == true){
				$("#"+$(this).attr('id').replace("_snapShot_img","")).css("height", "55px");
			}else{
				$("#"+$(this).attr('id').replace("_snapShot_img","")).css("height", "35px");
			}
		});
		
		/*
		 * shou the son buttons
		 */
		
		$("#"+this.id+ "_menu").click(function(event){
			if(statue == false){
				$("#"+ this.id+ "_close_img").css("transition-timing-function","cubic-bezier(0.8,0.84,0.44,1.3)");
				$("#"+ this.id+ "_close_img").css("transform","translate3d(-15px,25.98px,0px)");
				$("#"+ this.id+ "_close_img").css("transition-duration","100ms");
			
				$("#"+ this.id+ "_commit").css("transition-timing-function","cubic-bezier(0.8,0.84,0.44,1.3)");
				$("#"+ this.id+ "_commit").css("transform","translate3d(15px,25.98px,0px)");
				$("#"+ this.id+ "_commit").css("transition-duration","200ms");
			
				$("#"+ this.id+ "_show_description").css("transition-timing-function","cubic-bezier(0.8,0.84,0.44,1.3)");
				$("#"+ this.id+ "_show_description").css("transform","translate3d(27px,0px,0px)");
				$("#"+ this.id+ "_show_description").css("transition-duration","300ms");
				
				$("#" + $(this).attr('id').replace("_menu", "")).css("height", "55px");
				statue = true;
			}else{
				$("#"+ this.id+ "_close_img").css("transition-timing-function","ease-out");
				$("#"+ this.id+ "_close_img").css("transform","translate3d(0px,0px,0px)");
				$("#"+ this.id+ "_close_img").css("transition-duration","200ms");
				
				$("#"+ this.id+ "_commit").css("transition-timing-function","ease-out)");
				$("#"+ this.id+ "_commit").css("transform","translate3d(0px,0px,0px)");
				$("#"+ this.id+ "_commit").css("transition-duration","200ms");
				
				$("#"+ this.id+ "_show_description").css("transition-timing-function","ease-out");
				$("#"+ this.id+ "_show_description").css("transform","translate3d(0px,0px,0px)");
				$("#"+ this.id+ "_show_description").css("transition-duration","200ms");
				$("#" + $(this).attr('id').replace("_menu", "")).css("height", "35px");
				statue = false;
			}
		});
		
		/*
		 * fonction of son buttons
		 */
		$("#"+this.id+ "_menu_commit").click(function(event){
			$("#"+this.id+"_text").css("display", "inline");
		});
		
		$("#"+this.id+ "_menu_commit_text").click(function(event){
			$("#"+this.id+"_confirm").css("display", "inline");
			$("#"+this.id+"_delete").css("display", "inline");
		});
		$("#"+this.id+ "_menu_commit_text_delete").click(function(event){
			$(this).css("display", "none");
			$("#"+$(this).attr('id').replace("_delete","_confirm")).css("display", "none");
			$("#"+$(this).attr('id').replace("_delete","")).css("display", "none");
			$("#"+$(this).attr('id').replace("_delete","")).val("");
			self.comment = null;
		});
		$("#"+this.id+ "_menu_commit_text_confirm").click(function(event){
			$(this).css("display", "none");
			$("#"+$(this).attr('id').replace("_confirm","_delete")).css("display", "none");
			$("#"+$(this).attr('id').replace("_confirm","")).css("display", "none");
			self.comment = $("#"+$(this).attr('id').replace("_confirm","")).val();
			$("#"+$(this).attr('id').replace("_confirm","_display")).html(self.comment);
		});
	},
	
	clean: function() {
		this.name = null;
		this.ra = null;
		this.dec = null; 
		this.fov = null;
		this.region = null;
		this.id = null;
		this.img = null;
		this.catalogTab = null;	
		this.XMM = false;
	}
}