var extensionID = browser.i18n.getMessage("@@extension_id");	// Extension id

window.onload = function() {

	// Extract the current tab open which extension popup is opened
	browser.tabs.query({ currentWindow: true, active: true }).then(function(tabs){
		var tab = tabs[0];
		console.log(tab);
		editMenu(tab);
	});

	// Open collection of links
	document.getElementById('view-links').addEventListener('click', function() {
		browser.tabs.create({ url: "../collection/links.html" });
	});
};

function editMenu(tab) {
	// A link's data
	var link = {
		title: tab.title,
		url: tab.url,
		favIconUrl: tab.favIconUrl,

		name: getTitleName(tab.title, tab.url),
		tags: {
			actors: [],
			producer: "",
		}
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

	// Form submit click event
	document.getElementById('submit-link').addEventListener('click', function() {
		link.title = title.value;
		link.url = url.value;
		saveTab(link);
	});
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
