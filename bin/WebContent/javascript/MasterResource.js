MasterResource = function(resource){
	this.url= resource.url;
	this.radiusUnit= resource.radiusUnit;
	this.format = resource.format;
	this.label = resource.label;
	this.description = resource.description
	this.associe_data = resource.associe_data;
	this.handler = resource.handler;
	this.tab = [];
}

MasterResource.prototype = {
		setParamsInUrl: function(aladinLiteView){
			var self = this;
			var times = null;
			var url;
			var fov;
			if(aladinLiteView.masterResource.radiusUnit == 'arcmin'){
				times = 60;
			}else if(aladinLiteView.masterResource.radiusUnit == 'arcsec'){
				times = 3600;
			}else{
				times = 1;
			}
			if(aladinLiteView.fov>1){
				fov = 1;
			}else{
				fov = aladinLiteView.fov
			}
			url = aladinLiteView.masterResource.url.replace(/\{\$ra\}/g,aladinLiteView.ra);
			url = url.replace(/\{\$dec\}/g,aladinLiteView.dec);
			url = url.replace(/\{\$fov\}/g,fov*times);
			url = url.replace(/\{\$format\}/g,aladinLiteView.masterResource.format);
			return url;
		},
		
		cleanTab: function(){
			this.tab=[];
		}
}