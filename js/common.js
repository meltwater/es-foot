var foot = new function() {

    this.defaultUrl = "http://localhost:9200";
    this.currentTab = "overview";
    this.loadedTabs = [];

    this.navigate = function(tab) {
        this.currentTab = tab;

        overview.hide();
        indices.hide();
        browser.hide();
        searcher.hide();
        docViewer.hide();
        $("#navOverview").removeClass("active");
        $("#navIndices").removeClass("active");
        $("#navBrowser").removeClass("active");
        $("#navSearcher").removeClass("active");
        $("#navDocViewer").removeClass("active");
        if (tab == "overview") {
            overview.show();
            $("#navOverview").addClass("active");
        }
        if (tab == "indices") {
            indices.show();
            $("#navIndices").addClass("active");
        }
        if (tab == "browser") {
            browser.show();
            $("#navBrowser").addClass("active");
        }
        if (tab == "docViewer") {
            docViewer.show();
            $("#navDocViewer").addClass("active");
        }
        if (tab == "searcher") {
            searcher.show();
            $("#navSearcher").addClass("active");
        }

        this.refreshCurrent();
    }

    this.clearAll = function() {
        overview.clear();
        indices.clear();
        browser.clear();
        searcher.clear();
        docViewer.clear();
        this.loadedTabs = [];
    }

    this.refreshCurrent = function() {
        if ($.inArray(this.currentTab, this.loadedTabs) == -1) {
            var url = this.getEnvironmentUrl();

            if (this.currentTab == "overview") {
                overview.clear();
                overview.refresh(url);
            }
            else if (this.currentTab == "indices") {
                indices.clear();
                indices.refresh(url);
            }
            else if (this.currentTab == "browser") {
                browser.clear();
            }
            else if (this.currentTab == "searcher") {
                searcher.clear();
            }
            else if (this.currentTab == "docViewer") {
                docViewer.clear();
            }

            this.loadedTabs.push(this.currentTab)
        }
    }

    this.getStatus = function() {
        $.getJSON(this.getEnvironmentUrl() + "/_cluster/stats", function(data) {
            $("#clusterNameHead")
                .removeClass()
                .addClass("ink-label " + data.status)
                .text(data.cluster_name);
        })
    };

    this.getEnvironmentUrl = function() {
        var url = this.environment['url']
        if (url == "") url = "http://localhost:9200/";
        return url;
    }
}

var storeObjectInSession = function(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

var getObjectFromSession = function(key) {
    return JSON.parse(sessionStorage.getItem(key));
}

var hasObjectInSession = function(key) {
    var obj = sessionStorage.getItem(key);
    return obj !== null && obj !== undefined;
}

var pending = new function() {
    // Pending requests counter
    this.pendingRequests = 0;

    $(document).ajaxSend(function() {
        pending.pendingRequests++;
        pending.updatePendingRequestsCounter();
    });

    $(document).ajaxComplete(function() {
        pending.pendingRequests--;
        pending.updatePendingRequestsCounter();
    });

    this.updatePendingRequestsCounter = function(){
        if (this.pendingRequests > 0) {
            $("#refreshBtnIcon").addClass("fa-spin");
            $("#pendingRequestsText").show();
            $("#pendingRequests").show();
        } else {
            $("#refreshBtnIcon").removeClass("fa-spin");
            $("#pendingRequestsText").hide();
            $("#pendingRequests").hide();
        }
    }
}


$(document).ready(function() {

    // Current environment
    if (!hasObjectInSession("environment")) {
        foot.environment = {
            "url" : "http://localhost:9200",
            "name" : "default"
        }
        storeObjectInSession("environment", foot.environment)
    } else {
        foot.environment = getObjectFromSession("environment");
    }

    // Connection params form
    $("#storageEsUrl").val(foot.getEnvironmentUrl());
    $("#setConnectionDetailsBtn").click(function(){
        storeObjectInSession("environment", foot.environment);
        foot.clearAll();
        foot.getStatus();
    });
    var environmentsAutofill = $("#environmentsAutofill");
    function autofillButton(env, url) {
        var item = $("<button>")
            .addClass("ink-button")
            .text(env + ": " + url)
            .click(function(){
                $("#storageEsUrl").val(url);
                foot.environment['url'] = url;
                foot.environment['name'] = env;
            });
        return item;
    }
    for (var env in foot.environments) {
        environmentsAutofill.append(autofillButton(env, foot.environments[env]));
        environmentsAutofill.append("<br>");
    };

    // Tabbing
    $("#navBtnOverview").click(function(e) { foot.navigate("overview"); })
    $("#navBtnIndices").click(function(e) { foot.navigate("indices"); })
    $("#navBtnBrowser").click(function(e) { foot.navigate("browser"); })
    $("#navBtnSearcher").click(function(e) { foot.navigate("searcher"); })
    $("#navBtnDocViewer").click(function(e) { foot.navigate("docViewer"); })
    
    // Refresh button
    $("#refreshBtn").click(function(e) {
        e.preventDefault();
        foot.clearAll();
        foot.getStatus();
        foot.refreshCurrent();
    })

    // Connect button
    $("#setConnectionDetailsBtn").click(function(e) {
        foot.environment['url'] = $("#storageEsUrl").val()
        storeObjectInSession("environment", foot.environment)

        foot.clearAll();
        foot.getStatus();
        foot.refreshCurrent();
    })


    // Refresh all on load
    foot.clearAll();
    foot.getStatus();
    foot.navigate("overview");
});
