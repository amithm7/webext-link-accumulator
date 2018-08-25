var extensionID = browser.i18n.getMessage("@@extension_id");

window.onload = function() {
	// Extract the current tab data on which extension popup is opened
	browser.tabs.query({ currentWindow: true, active: true }).then(function(input) {
		var currentTab = input[0];
		console.log(currentTab);
		showMenu(currentTab);
	});

	// Open collection of links stored
	document.getElementsByClassName('view-links')[0].addEventListener('click', function() {
		browser.tabs.create({ url: "../collection/links.html" });
	});

	// Close popup
	document.getElementsByClassName('close-popup')[0].addEventListener('click', function() {
		window.close();
	});
};

// Show popup menu
function showMenu(currentTab) {
	// A tab's data to store
	var tab = {
		title: currentTab.title,
		url: currentTab.url,
		favIconUrl: currentTab.favIconUrl,

		name: getTitleName(currentTab.title, currentTab.url),
		date: getDateString(),
		tags: {}
	};
	
	// Display form for input
	var title = document.getElementsByClassName('link-title')[0];
	title.value = tab.title;
	var url = document.getElementsByClassName('link-url')[0];
	url.value = tab.url;
	
	// Get tags data
	var tagType = document.getElementsByClassName('tag-type')[0].getElementsByTagName('input')[0];
	var tagName = document.getElementsByClassName('tag-name')[0].getElementsByTagName('input')[0];
	
	browser.storage.local.get('tags').then(function(input) {
		$('.tag-type input').autocomplete({
			source: Object.keys(input.tags),
			autoFocus: true
		});

		tagName.addEventListener('focus', function () {
			if (tagType.value !== "") {
				var tagIn = tagType.value;
				if (input.tags[tagIn] != undefined) {
					$('.tag-name input').autocomplete({
						source: Object.keys(input.tags[tagIn]),
						autoFocus: true
					});
				}
			}
		});
	});
	
	// To add multiple tags
	document.getElementsByClassName('tag-type')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		// Clear input fields
		addTag(tab, tagType, tagName);
		tagType.value = "";
		tagName.value = "";
	});
	
	// Multiple tag values
	document.getElementsByClassName('tag-name')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		addTag(tab, tagType, tagName);
		tagName.value = "";
	});
	
	// Form submit click event
	document.getElementsByClassName('form-submit')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		tab.title = title.value;
		tab.url = url.value;
		
		addTag(tab, tagType, tagName);
		
		console.log(tab);
		saveTab(tab);
	});
}

// Add tag data to tab object
function addTag(tab, tagType, tagName) {
	// Replace ( Not word (a-z, 0-9, _) & not - with - ) . Replace trailing -'s at start and end . Convert to lower case
	var tagTypeVal = tagType.value.replace(/[^\w-]+/ig, '-').replace(/-+$/g, '').replace(/^-+/g, '').toLowerCase();
	var tagNameVal = tagName.value.replace(/[^\w-]+/ig, '-').replace(/-+$/g, '').replace(/^-+/g, '').toLowerCase();

	if (tagTypeVal !== ""){
		if(tab.tags[tagTypeVal] != undefined && tab.tags[tagTypeVal].length > 0) {
			if (tagNameVal !== "")
			tab.tags[tagTypeVal].push(tagNameVal);
		} else {
			tab.tags[tagTypeVal] = [];
			if (tagNameVal !== "")
			tab.tags[tagTypeVal].push(tagNameVal);
		}
	}
}

// Save Tab data to memory
function saveTab(tab) {
	var tabID = 'tab-' + getDateString().replace(/-/g, '') + '-' + ID();
	var tabIDList = [];
	
	// Retrive stored Tab ids
	browser.storage.local.get('tabIDList').then(gotTabIDList);
	
	function gotTabIDList(input) {		// async
		console.log(input);
		
		var storageUpdated;
		
		if (input.tabIDList != undefined && input.tabIDList.length > 0) {
			tabIDList = input.tabIDList;
		}

		tabIDList.push(tabID);
		// Update tab id's array
		browser.storage.local.set({'tabIDList': tabIDList});

		// Add tab data to store obejct
		var store = {};
		store[tabID] = tab;

		// Update storage
		storageUpdated = browser.storage.local.set(store);
		
		storageUpdated.then(function(){
			disableSaveBtn();
			
			// reload collection page after adding link
			reloadCollection();
		});

		// Store (Cache) data to organise
		updateCachePopulation(true, tabID, tab);
	}
}

// Extract Actual title - To do
function getTitleName(title, url) {
	return title;
}

function disableSaveBtn() {
	var saveButton = document.getElementsByClassName('form-submit')[0].getElementsByTagName('button')[0];
	saveButton.disabled = true;
	saveButton.innerHTML = "Saved!";
	saveButton.classList.add('disabled-save-btn');
}

function reloadCollection() {
	browser.tabs.query({ url: "moz-extension://" + extensionID + "/collection/links.html" }).then(function (tabs) {
		tabs.forEach(function (tab) {
			browser.tabs.reload(tab.id);
		});
	});
}
