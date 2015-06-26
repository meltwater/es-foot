var indices = new function() {

  // Clear all tables and fields from data
  this.clear = function() {
    $("#index-table-body").html("");
    renderIndexTable([]);
  }

  /* Update Index table with new data */
  function renderIndexTable(indexDatas) {
    $("#index-table").dataTable({
      "data": indexDatas,
      "destroy": true,
      "createdRow": function ( row, data, index ) {
        // Clicking a row takes you to browser for that index      
        $(row).click(function(e) {
          var index = data["name"];
          foot.navigate("browser");
          searcher.search(foot.getEnvironmentUrl(), index, searcher.queryMatchAll, 2000)
        })
      },
      "columns": [
        {
          "title": "name",
          "data": "name"
        },
        {
          "title": "aliases",
          "data": "aliases[, ]"
        },
        {
          "title": "docs",
          "data": "docs",
          "width": "60px"
        },
        {
          "title": "state",
          "data": "state",
          "width": "60px"
        },
        {
          "title": "shards",
          "data": "number_of_shards",
          "width": "60px"
        },
        {
          "title": "replicas",
          "data": "number_of_replicas",
          "width": "60px"
        }
      ],
      "language": {
        "search" : "",
        "searchPlaceholder": " Filter results"
      },
      "lengthMenu": [10, 25, 50, 100, 250, 500, 1000]
    });
  }

  function multiCountSearch(indices) {
    var post = "";
    for (var index in indices) {
      post += '{"index":"'+index+'", "search_type":"count"}\n{"query":{"match_all":{}}}\n';
    }
    var url = foot.getEnvironmentUrl() + "/_msearch";
    var ajax = {
      contentType: 'application/json',
      data: post,
      dataType: 'json',
      processData: false,
      type: 'POST',
      url: url,
      success: function(data) {
        var responses = data.responses;
        var table = $('#index-table').DataTable();  
        for (var i = 0; i < responses.length; i++) {
          if ('hits' in responses[i]) {
            var count = responses[i].hits.total;
            var rowData = table.row(i).data();
            rowData.docs = count;
          }
        }
        table.rows().invalidate();
      },
      error: function(error) {
        var a = 1;
      }
    };
    $.ajax(ajax);
  }

  this.hide = function() {
    $("#indices").hide();
  }

  this.show = function() {
    $("#indices").show();
  }

  this.refresh = function(url) {
    // ES status
    $.getJSON(url, function(data) {

      var indexDatas = [];

      $.getJSON(url + "/_cluster/state/metadata", function(data) {
          var indices = data.metadata.indices;
          for (var index in indices) {
            var indexData = {}
            indexData.name = index;
            indexData.state = indices[index].state;
            indexData.docs = null;
            indexData.aliases = indices[index].aliases;
            indexData.number_of_shards = indices[index].settings.index.number_of_shards;
            indexData.number_of_replicas = indices[index].settings.index.number_of_replicas;
            indexDatas.push(indexData);
          }
          renderIndexTable(indexDatas);
          multiCountSearch(indices);
      })
    })
    // Refresh error handler
    .error(function() {
      $("#statuslabel").removeClass().addClass("ink-label red").html(
        "Connection failed: " + url);
    })
  }
}

