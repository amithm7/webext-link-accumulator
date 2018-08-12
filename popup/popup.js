var extensionID = browser.i18n.getMessage("@@extension_id");	// Extension id

window.onload = function() {

	// Extract the current tab open which extension popup is opened
	browser.tabs.query({ currentWindow: true, active: true }).then(function(tabs){
		var tab = tabs[0];
		console.log(tab);
		showMenu(tab);
	});

	// Open collection of links
	document.getElementsByClassName('view-links')[0].addEventListener('click', function() {
		browser.tabs.create({ url: "../collection/links.html" });
	});

	// Close popup
	document.getElementsByClassName('close-popup')[0].addEventListener('click', function() {
		window.close();
	});
};

// Show popup menu
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
	var title = document.getElementsByClassName('link-title')[0];
	title.value = link.title;
	var url = document.getElementsByClassName('link-url')[0];
	url.value = link.url;

	// Get tags data
	var tag = document.getElementsByClassName('tag-name')[0].getElementsByTagName('input')[0];
	var tagVal = document.getElementsByClassName('tag-value')[0].getElementsByTagName('input')[0];

	// To add multiple tags
	document.getElementsByClassName('tag-name')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		// Clear input fields
		addTag(link, tag, tagVal);
		tag.value = "";
		tagVal.value = "";
	});

	// Multiple tag values
	document.getElementsByClassName('tag-value')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		addTag(link, tag, tagVal);
		tagVal.value = "";
	});

	// Form submit click event
	document.getElementsByClassName('form-submit')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		link.title = title.value;
		link.url = url.value;

		addTag(link, tag, tagVal);

		console.log(link);
		saveTab(link);
	});
}

// Add tag data to link object
function addTag(link, tag, tagVal) {
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

// Save Tab data to memory
function saveTab(link) {
	var key;
	var keys = [];

	// Tab ids
	keysP = browser.storage.local.get('keys');
	keysP.then(gotKeys);

	function gotKeys(input) {		// async
		console.log(input);
		if (input.keys != undefined && input.keys.length > 0) {
			keys = input.keys;
			key = keys[keys.length - 1] + 1;
		} else {
			key = 1;
		}
		keys.push(key);
		// Update tab id's array
		browser.storage.local.set({'keys': keys});

		// Add tab data to store obejct
		var store = {};
		store[key] = link;

		// Add tags array to store object
		var tagsArr = [];
		tagsP = browser.storage.local.get('tags');
		tagsP.then(gotTags);

		function gotTags(input) {
			if (input.tags != undefined && input.tags.length > 0) {
				tagsArr = input.tags;
			}
			for (var tag in link.tags) {
				tagsArr.push(tag);
			}

			store.tags = tagsArr;

			// Update storage
			browser.storage.local.set(store);
	
			// reload collection page after adding link
			reloadCollection();
		}
	}
}

function reloadCollection() {
	browser.tabs.query({ url: "moz-extension://" + extensionID + "/collection/links.html" }).then(function (tabs) {
		tabs.forEach(function (tab) {
			browser.tabs.reload(tab.id);
		});
	});
}
