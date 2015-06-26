# es-foot

es-foot is an [Elasticsearch](https://www.elastic.co/products/elasticsearch) GUI for investigating content and configuration of your cluster, with the goal of being:

 * fast
 * intuitive
 * easy to use

for both small, large and huge clusters.


## Usage

To use, simply:

 1. clone the repository
 1. point your browser to esfoot.html
 2. click the database icon in the top right
 3. specify the url to your ES cluster and connect


## Views

### overview

Gives an overview of your cluster, showing your cluster status and also:

 * nodes - All nodes connected to the cluster, also shows master node(s).
 * templates - All templates submitted to the cluster.
 * plugins - All plugins installed on the cluster.

### indices

View all indices on your cluster.

Click an index to browse documents of that index using the browser view. Note that max 2000 documents will be loaded, when searching for something specific in an index please use the searcher view.

### searcher

Run a search query towards your cluster. Specify an [Elasticsearch Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) in the search query editor and click Search. Results will appear in the browser view.

### browser

Browses the contents of an index or the results of your latest search.

Click a document to inspect it with the doc viewer view.

### doc viewer

Inspect the full contents of a document.

To inspect a specific document, supply its id in the doc id field.


## Compatibility

Tested on Chrome towards ES 1.4.x, 1.5.x

## Made with

 * [JQuery](https://jquery.com/)
 * [Ink](http://ink.sapo.pt/) 
 * [Ace](http://ace.c9.io/) for JSON editing
 * [DataTables](https://www.datatables.net/) for searchable data tables with nice navigation
 * [jquery.json-viewer](https://www.npmjs.com/package/jquery.json-viewer) for viewing documents
