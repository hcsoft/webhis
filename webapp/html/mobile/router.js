/**/
var approuter = new $.mobile.Router([ {
	"(?:[?](.*))?" : {
		handler : "all",
		argsre : true,
		 events: "bc,c,i,bs,s,bh,h"
	}
} ], {
	all : function(type, match, ui, page, e) {
		if(type=='pageshow'){
			$(".backhome").each(function(idx){
				var index = $( this ).attr("href").indexOf("?");
				if(index>=0){
					$( this ).attr("href",$( this ).attr("href").substring(0,index)+"?id="+$.urlParam("id"));
				}else{
					$( this ).attr("href",$( this ).attr("href")+"?id="+$.urlParam("id"));
				}
			});
		}
	}
});

