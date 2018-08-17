render();

// Set background color of an element
function setBackground(ele, color) {
	ele.style.background = color;
}

var collectionSection = document.querySelector('.collection');

function displayList(store, tabIDList) {
	var list = document.createElement('ul');
	collectionSection.appendChild(list);

	// Iterate over stored links and display them
	for (i = 0; i < tabIDList.length; i++) {
		var tab = store[tabIDList[i]];
		console.log(tab);

		var link = document.createElement('a');
		link.setAttribute('href', tab.url);
		link.setAttribute('target', '_blank');

		// Security - https://developers.google.com/web/tools/lighthouse/audits/noopener
		// https://www.thesitewizard.com/html-tutorial/open-links-in-new-window-or-tab.shtml
		link.setAttribute('rel', 'noopener noreferrer');

		link.innerHTML = tab.title;

		var li = document.createElement('li');

		list.appendChild(li).appendChild(link);

		// Iterate over all tags
		for (var key in tab.tags) {
			var tag = document.createElement('span');
			tag.setAttribute('class', 'tooltip tag');
			tag.innerHTML = key;

			rcolor = getColor();
			setBackground(tag, rcolor);

			var tagvalue = document.createElement('span');
			tagvalue.setAttribute('class', 'tooltiptext tag-value');
			tagvalue.innerHTML = tab.tags[key];

			li.appendChild(tag).appendChild(tagvalue);
		}
	}
}

function displayNoSort(store) {
	collectionSection.innerHTML = "";

	var tabIDList = store.tabIDList;

	displayList(store, tabIDList);
}

function displayByDate(store) {
	collectionSection.innerHTML = "";

	Object.keys(store.tabsOnDate).forEach(function(date) {
		var dateHeader = document.createElement('h3');
		dateHeader.innerHTML = date;
		collectionSection.appendChild(dateHeader);

		var tabIDList = store.tabsOnDate[date];

		displayList(store, tabIDList);
	});
}

function render() {
	browser.storage.local.get().then(onGot);

	function onGot(store) {
		console.log(store);

		var sorting = document.querySelector('.list-sorting').sortBy;

		for(i = 0; i < 2; i++){
			sorting[i].addEventListener('click', sortBy);
		}

		function sortBy() {
			if (sorting.value == "none") {
				displayNoSort(store);
			} else if (sorting.value == "byDate"){
				displayByDate(store);
			}
		}
		sortBy();
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
