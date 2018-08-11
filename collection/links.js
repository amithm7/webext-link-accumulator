render();

var list = document.getElementById('links');

function render() {
	browser.storage.local.get().then(onGot);

	function onGot(store) {
		// Iterate over stored links and display them
		for (i = 0; i < store.keys.length; i++) {
			var tab = store[store.keys[i]];
			console.log(tab);

			var link = document.createElement('a');
			link.setAttribute('href', tab.url);
			link.innerHTML = tab.title + " || tags: " + JSON.stringify(tab.tags);

			var li = document.createElement('li');

			list.appendChild(li).appendChild(link);
		}
	}
}

// Delete all links
document.getElementById('clear-all').addEventListener('click', function() {
	if(confirm("Are you sure you want to delete all the links?")){
		browser.storage.local.clear();
		list.innerHTML = "";
	}
});

// Footer - get Version
function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', '../manifest.json', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}
loadJSON(function (response) {
	var manifest = JSON.parse(response);
	$('.version-number')[0].innerHTML = manifest.version;
});
