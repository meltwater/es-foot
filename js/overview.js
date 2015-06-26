var overview = new function() {

  // Clear all tables and fields from data
  this.clear = function() {
    $("#version_es").html("");
    $("#version_lucene").html("");
    $("#clustername").html("");
    $("#statuslabel").removeClass().html("");
    $("#nodes-table-body").html("");
    $("#plugins-table-body").html("");
    $("#templates-table-body").html("");
  }

  /* Update Plugins table with new data */
  function renderPluginTable(pluginDatas) {
    $("#plugin-table").dataTable({
      "data": pluginDatas,
      "destroy": true,
      "columns": [
        {
          "title": "node",
          "data": "nodeName"
        },
        {
          "title": "name",
          "data": "pluginName"
        },
        {
          "title": "version",
          "data": "pluginVersion"
        }
      ],
      "paging": false,
      "info": false,
      "language": {
        "search" : "",
        "searchPlaceholder": " Filter results"
      }
    });
  }

  this.hide = function() {
    $("#overview").hide();
  }

  this.show = function() {
    $("#overview").show();
  }

  this.refresh = function(url) {
    // ES status
    $.getJSON(url, function(data) {
      // Versions
      $("#version_es").html(data["version"]["number"]);
      $("#version_lucene").html(data["version"]["lucene_version"]);

      // Cluster status
      $.getJSON(url + "/_cluster/stats", function(data) {
        // Name
        $("#clustername").html(data["cluster_name"]);
        // Status
        var status = data["status"];
        $("#index_count").html(data.indices.count);
        $("#total_shard_count").html(data.indices.shards.total);
        $("#primary_shard_count").html(data.indices.shards.primaries);
        $("#nested_total_doc_count").html(data.indices.docs.count);

        if (status == "yellow") { $("#statuslabel").removeClass().addClass("ink-label yellow").html("yellow"); }
        if (status == "red") { $("#statuslabel").removeClass().addClass("ink-label red").html("red"); }
        if (status == "green") { $("#statuslabel").removeClass().addClass("ink-label green").html("green"); }
      })

      $.getJSON(url + "/_count", function(data) {
        $("#total_doc_count").html(data.count);
      })

      $.getJSON(url + "/_cluster/state/master_node/", function(data_master) {
        $.getJSON(url + "/_nodes/plugins", function(data) {
          var pluginDatas = [];

          // Nodes
          for (var node in data["nodes"]) {
            var n = data["nodes"][node]
            var tr = $("<tr>");
            tr.append($("<td>").html(n["name"]));
            if (node == data_master["master_node"]) { tr.append($("<td>").html("<span class=\"ink-label black\">master</span>")); }
            else {tr.append($("<td>"));}
            tr.append($("<td>").html(n["host"]));
            tr.append($("<td>").html(n["ip"]));
            tr.append($("<td>").html(n["transport_address"]));
            tr.append($("<td>").html(n["version"]));
            $("#nodes-table-body").append(tr);

            // Plugins
            for (var plugin in n["plugins"]) {
              var p = n["plugins"][plugin];
              var pluginData = {};
              pluginData.nodeName = n["name"];
              pluginData.pluginName = p["name"];
              pluginData.pluginVersion = p["version"];
              pluginDatas.push(pluginData);
            }
          }

          renderPluginTable(pluginDatas);
        })
      })

      $.getJSON(url + "/_template", function(data) {
        // Templates
        for (var template in data) {
          if (data.hasOwnProperty(template)) {
              var tr = $("<tr>");
              tr.append($("<td>").html(template));
              tr.append($("<td>").html(data[template]["template"]));
              tr.append($("<td>").html(Object.keys(data[template]["mappings"]["versioninfo"]["properties"]).join(", ")));
              $("#templates-table-body").append(tr);
          }
        }
      })
    })
    // Refresh error handler
    .error(function() {
      $("#statuslabel").removeClass().addClass("ink-label red").html(
        "Connection failed: " + url);
    })
  }
}
