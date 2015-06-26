var docViewer = new function() {

    // Clear all tables and fields from data
    this.clear = function() {
        $("#docFromEs").html("");
        $("#docFromRiak").html("");
    }

    this.hide = function() {
        $("#docViewer").hide();
    }

    this.show = function() {
        $("#docViewer").show();
    }

    this.fetchDocById = function(esUrl, docId, index) {
        if (docId){
            var esQuery =
            {
                "query": {
                  	"ids" : {
                          "values" : [docId]
                  	}
              	}
            };

            var url;
            if (index) {
                url = esUrl + "/" + index + "/_search";
            }
            else {
                url = esUrl + "/_search";
            }

            $.postJSON(url, esQuery, function(data) {
                var hits = data["hits"]["hits"]
                if (hits.length > 0) {
                    $("#docjson").jsonViewer(data["hits"]["hits"][0])
                } else {
                    $("#docjson").html("document not found")
                }
            });
        }
    }
}

$(document).ready(function() {
    $("#docId")
        .change(function(){
            docViewer.fetchDocById(foot.getEnvironmentUrl(), $(this).val())
        })
        .keypress(function(event){
            if(event.keyCode == 13) {
                event.preventDefault();
                docViewer.fetchDocById(foot.getEnvironmentUrl(), $(this).val())
                return false;
            }
        });
})