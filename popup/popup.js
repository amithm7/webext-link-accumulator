var extensionID = browser.i18n.getMessage("@@extension_id");	// Extension id

window.onload = function() {

	// Extract the current tab open which extension popup is opened
	browser.tabs.query({ currentWindow: true, active: true }).then(function(tabs){
		var tab = tabs[0];
		console.log(tab);
		showMenu(tab);
	});

	// Open collection of links
	document.getElementById('view-links').addEventListener('click', function() {
		browser.tabs.create({ url: "../collection/links.html" });
	});

	// Close popup
	document.getElementById('close-popup').addEventListener('click', function() {
		window.close();
	});
};

function showMenu(tab) {
	// A link's data
	var link = {
		title: tab.title,
		url: tab.url,
		favIconUrl: tab.favIconUrl,

		name: getTitleName(tab.title, tab.url),
		tags: {}
	};

	// Extract Actual title - To do
	function getTitleName(title, url) {
		return title;
	}

	// Display form for input
	var title = document.getElementById('link-name');
	title.value = link.title;
	var url = document.getElementById('link-url');
	url.value = link.url;

	// Get tags data
	var tag = document.getElementById('tag');
	var tagVal = document.getElementById('tag-value');

	// To add multiple tags
	document.getElementById('tag-plus').addEventListener('click', function() {
		// Clear input fields
		saveTag(link, tag, tagVal);
		tag.value = "";
		tagVal.value = "";
	});

	// Multiple tag values
	document.getElementById('tag-value-plus').addEventListener('click', function() {
		saveTag(link, tag, tagVal);
		tagVal.value = "";
	});

	// Form submit click event
	document.getElementById('submit-link').addEventListener('click', function() {
		link.title = title.value;
		link.url = url.value;

		saveTag(link, tag, tagVal);

		console.log(link);
		saveTab(link);
	});
}

function saveTag(link, tag, tagVal) {
	var key = tag.value;
	var value = tagVal.value;
	if (tag.value !== ""){
		if(link.tags[key] != undefined && link.tags[key].length > 0) {
			if (value !== "")
				link.tags[key].push(value);
		} else {
			link.tags[key] = [];
			if (value !== "")
				link.tags[key].push(value);
		}
	}
}

function saveTab(link) {
	var key;
	var keys = [];

	keysP = browser.storage.local.get('keys');
	keysP.then(gotKeys);

	function gotKeys(input) {		// async
		if (input.keys != undefined && input.keys.length > 0) {
			keys = input.keys;
			key = keys[keys.length - 1] + 1;
		} else {
			key = 1;
		}
		keys.push(key);
		browser.storage.local.set({'keys': keys});

		var tab = {};
		tab[key] = link;
		browser.storage.local.set(tab);

		// reload collection page after adding link
		reloadCollection();
	}
}

function reloadCollection() {
	browser.tabs.query({ url: "moz-extension://" + extensionID + "/collection/links.html" }).then(function (tabs) {
		tabs.forEach(function (tab) {
			browser.tabs.reload(tab.id);
		});
	});
}
