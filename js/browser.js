var browser = new function() {

    this.currentIndex = "";

    this.clear = function() {
        this.currentIndex = "";
        $("#browser-table-body").html("");
        $("#browser-table").dataTable({
            "destroy": true,
            "data": [],
            "createdRow": function ( row, data, index ) {
                // Clicking a row takes you to docViewer for that doc      
                $(row).click(function(e) {
                    var docId = data["id"];
                    var docIndex = data["index"];
                    foot.navigate("docViewer");
                    $("#docId").val(docId, docIndex);
                    docViewer.fetchDocById(foot.getEnvironmentUrl(), docId, docIndex);
                })
            },
            "columns": [
                {
                    "title": "id",
                    "data": "id"
                },
                {
                    "title": "index",
                    "data": "index"
                },
                {
                    "title": "type",
                    "data": "type"
                }
            ],
            "language": {
                "search" : "",
                "searchPlaceholder": " Filter results"
            },
            "lengthMenu": [10, 25, 50, 100, 250, 500, 1000]
        });
    }

    this.show = function() {
        $("#browser").show();
    }

    this.hide = function() {
        $("#browser").hide();
    }

    this.addDocs = function(docs) {
        var dt = $("#browser-table").DataTable();
        for (var i = 0; i < docs.length; i++) {
            dt.row.add(docs[i]);
        }
        dt.draw();
    }
}

$(document).ready(function() {
    browser.clear()
    $("#browserIndex")
        .change(function(){
            browser.refresh(foot.getEnvironmentUrl(), $(this).val())
        })
        .keypress(function(event){
            if(event.keyCode == 13) {
                event.preventDefault();
                browser.refresh(foot.getEnvironmentUrl(), $(this).val())
                return false;
            }
        });
})