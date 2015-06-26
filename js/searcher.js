var searcher = new function() {

    this.queryMatchAll = { "match_all" : {}}

    // Clear all tables and fields from data
    this.clear = function() {
    }

    this.hide = function() {
        $("#searcher").hide();
    }

    this.show = function() {
        $("#searcher").show();

        // Search query editor
        var editor = ace.edit("searchQuery")
        editor.setTheme("ace/theme/kuroir")
        editor.getSession().setMode("ace/mode/json")
    }

    this.search = function(esUrl, index, query, size) {
        browser.clear()
        var requestUrl = esUrl + '/' + index + '/_search'
        var requestData = {}
        requestData['query'] = query
        requestData['size'] = size
        requestData['fields'] = [
            "_id",
            "_index",
            "_type"
        ]

        // Search in specified index
        $.postJSON(requestUrl, requestData, function(data) {
            var hits = data["hits"]["hits"];
            var docs = [];

            if (hits.length > 0) {
                for (var i = 0; i < hits.length; i++) {
                    var doc = hits[i];
                    var docData = {}

                    docData["id"] = doc["_id"]
                    docData["index"] = doc["_index"]
                    docData["type"] = doc["_type"]

                    // ID fix for ES 1.5.1
                    if (Array.isArray(docData["id"])) {
                        docData["id"] = docData["id"][0]
                    }

                    docs.push(docData)
                }

                browser.addDocs(docs)
            } else {
                // TODO Nice message showing no hits found
            }
        })
    }
}

$(document).ready(function() {
    $("#searchQuery").html(JSON.stringify(searcher.queryMatchAll, undefined, 4))
    $("#searchButton").click(function(e) {

        var index = $("#searchIndex").val()
        if (index == "") {
          index = "_all"
        }

        var maxHits = $("#searchMaxHits").val()
        if (maxHits == "") {
            maxHits = "2000";
        }
        maxHits = parseInt(maxHits)

        var query = JSON.parse(ace.edit("searchQuery").getValue())

        foot.navigate("browser")
        searcher.search(foot.getEnvironmentUrl(), index, query, maxHits)
    })
})