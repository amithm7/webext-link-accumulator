var extensionID = browser.i18n.getMessage("@@extension_id");	// Extension id

window.onload = function() {
	// Extract the current tab open which extension popup is opened
	browser.tabs.query({ currentWindow: true, active: true }).then(function(input) {
		var currentTab = input[0];
		console.log(currentTab);
		showMenu(currentTab);
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
function showMenu(currentTab) {
	// A tab's data to store
	var tab = {
		title: currentTab.title,
		url: currentTab.url,
		favIconUrl: currentTab.favIconUrl,

		name: getTitleName(currentTab.title, currentTab.url),
		tags: {}
	};
	
	// Display form for input
	var title = document.getElementsByClassName('link-title')[0];
	title.value = tab.title;
	var url = document.getElementsByClassName('link-url')[0];
	url.value = tab.url;
	
	// Get tags data
	var tag = document.getElementsByClassName('tag-name')[0].getElementsByTagName('input')[0];
	var tagVal = document.getElementsByClassName('tag-value')[0].getElementsByTagName('input')[0];
	
	tagsP = browser.storage.local.get('tags');
	tagsP.then(function(input) {
		$('.tag-name input').autocomplete({
			source: input.tags,
			autoFocus: true
		});
	});
	
	tagVal.addEventListener('focus', function(){
		if (tag.value !== "") {
			var tagIn = tag.value;
			tagVP = browser.storage.local.get(tagIn);
			tagVP.then(function(input) {
				if (input[tagIn] != undefined) {
					$('.tag-value input').autocomplete({
						source: input[tagIn],
						autoFocus: true
					});
				}
			});
		}
	});
	
	// To add multiple tags
	document.getElementsByClassName('tag-name')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		// Clear input fields
		addTag(tab, tag, tagVal);
		tag.value = "";
		tagVal.value = "";
	});
	
	// Multiple tag values
	document.getElementsByClassName('tag-value')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		addTag(tab, tag, tagVal);
		tagVal.value = "";
	});
	
	// Form submit click event
	document.getElementsByClassName('form-submit')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
		tab.title = title.value;
		tab.url = url.value;
		
		addTag(tab, tag, tagVal);
		
		console.log(tab);
		saveTab(tab);
	});
}

// Add tag data to link object
function addTag(tab, tag, tagVal) {
	var key = tag.value;
	var value = tagVal.value;
	if (tag.value !== ""){
		if(tab.tags[key] != undefined && tab.tags[key].length > 0) {
			if (value !== "")
			tab.tags[key].push(value);
		} else {
			tab.tags[key] = [];
			if (value !== "")
			tab.tags[key].push(value);
		}
	}
}

// Save Tab data to memory
function saveTab(tab) {
	var key;
	var keys = [];
	
	// Tab ids
	keysP = browser.storage.local.get('keys');
	keysP.then(gotKeys);
	
	function gotKeys(input) {		// async
		console.log(input);
		
		var storageUpdated;
		var linkTags = tab.tags;
		
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
		store[key] = tab;
		
		// If no tags exist
		if (Object.keys(linkTags).length == 0) {
			// Update storage
			storageUpdated = browser.storage.local.set(store);
			
			storageUpdated.then(function(){
				disableSaveBtn();
				
				// reload collection page after adding link
				reloadCollection();
			});
			
		} else {
			// Add tags array to store object
			var tagsArr = [];
			tagsP = browser.storage.local.get('tags');
			tagsP.then(gotTags);
		}
		
		function gotTags(input) {
			if (input.tags != undefined && input.tags.length > 0) {
				tagsArr = input.tags;
			}
			for (var tag in tab.tags) {
				tagsArr.push(tag);
			}
			
			store.tags = Array.from(new Set(tagsArr));
			
			// Store tag values array to store object
			for (tag in tab.tags) {
				storeTag(tag);
			}
			
			function storeTag(tag) {
				tagVP = browser.storage.local.get(tag);
				tagVP.then(gotTagV);
				
				function gotTagV(input) {
					var tagVArr = [];
					if (input[tag] != undefined && input[tag].length > 0) {
						tagVArr = input[tag];
					}
					tagVArr.push.apply(tagVArr, tab.tags[tag]);
					
					store[tag] = Array.from(new Set(tagVArr));
					
					// Update storage
					storageUpdated = browser.storage.local.set(store);
					storageUpdated.then(function () {
						disableSaveBtn();
						
						// reload collection page after adding link
						reloadCollection();
					});
				}
			}
		}
	}
}

// Extract Actual title - To do
function getTitleName(title, url) {
	return title;
}

function disableSaveBtn() {
	var saveButton = document.getElementsByClassName('form-submit')[0].getElementsByTagName('button')[0];
	saveButton.innerHTML = "Saved!";
	saveButton.style.backgroundColor = 'white';
	saveButton.disabled = true;
}

function reloadCollection() {
	browser.tabs.query({ url: "moz-extension://" + extensionID + "/collection/links.html" }).then(function (tabs) {
		tabs.forEach(function (tab) {
			browser.tabs.reload(tab.id);
		});
	});
}
