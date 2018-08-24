/*------------- General-------------------------------------------------------*/

// Random color generator
function getColor() {
	return (
		"#" +
		Math.random()
			.toString(16)
			.slice(2, 8)
	);
}

// Remove an element from array
function arrayRemove(array, element) {
	var index = array.indexOf(element);
	if (index > -1) {
		array.splice(index, 1);
	}
	return array;
}

// Current date string generator `YYYY-MM-DD`
function getDateString() {
	var now = new Date();
	var month = (now.getMonth() + 1);
	var day = now.getDate();
	if (month < 10)
		month = "0" + month;
	if (day < 10)
		day = "0" + day;
	return (now.getFullYear() + '-' + month + '-' + day);
}

// Unique ID generator - UUID / GUID
// https://stackoverflow.com/a/2117523/3861350
// https://www.ietf.org/rfc/rfc4122.txt
function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function(c) {
		return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
	});
}

// Unique ID generator - Simpler
function ID() {
	return Math.random().toString(36).substr(2, 9);
}

/*------------- App Specific--------------------------------------------------*/

// Get manifest.json
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
// Set '.version-number'
loadJSON(function (response) {
	var manifest = JSON.parse(response);
	$('.version-number')[0].innerHTML = manifest.version;
});

function updateCacheDates(operation, tabID, tab) {
	browser.storage.local.get('tabsOnDate').then(function (input) {
		var tabsOnDate = {};
		var date = tab.date;
		var tabIDList = [];

		if (input.tabsOnDate != undefined) {
			tabsOnDate = input.tabsOnDate;
		}
		if (tabsOnDate[date] != undefined && tabsOnDate[date].length > 0) {
			tabIDList = tabsOnDate[date];
		}

		// Remove (false) or add (true) tabID to Cache
		if (operation) {
			tabIDList.push(tabID);
		} else {
			tabIDList = arrayRemove(tabIDList, tabID);
		}
		tabsOnDate[date] = tabIDList;

		if (tabsOnDate[date].length < 1) {
			delete tabsOnDate[date];
		}

		browser.storage.local.set({ 'tabsOnDate': tabsOnDate });
	});
}

function updateCacheTags(operation, tabID, tab) {
	browser.storage.local.get('tags').then(function (input) {
		var tags = {};
		if (input.tags != undefined) {
			tags = input.tags;
		}

		for (var tagType in tab.tags) {
			if (tags[tagType] == undefined) {
				if (!operation) { break; }	// tag not present
				tags[tagType] = {};
			}
			for (var i = 0; i < tab.tags[tagType].length; i++) {
				var tagName = tab.tags[tagType][i];
				if (tags[tagType][tagName] == undefined) {
					if (!operation) { break; }	// tag not present
					tags[tagType][tagName] = [tabID];
				} else {
					if (operation) {
						tags[tagType][tagName].push(tabID);
					} else {
						tags[tagType][tagName] = arrayRemove(tags[tagType][tagName], tabID);
					}
				}

				// if tag-name contains no tabs - remove key
				if (tags[tagType][tagName].length < 1) {
					delete tags[tagType][tagName];
				}
			}

			// if tag-type contains any tabs - remove key
			if (Object.keys(tags[tagType]).length < 1) {
				delete tags[tagType];
			}
		}

		browser.storage.local.set({ 'tags': tags });
	});
}

// Update Population (Storage cache) about stored tabs (add(true) / remove(false))
// add / remove tab parameters to "Cache" to organise / sort
function updateCachePopulation(operation, tabID, tabData) {
	if(!operation) {
		browser.storage.local.get('tabIDList').then(function(input) {
			var tabIDList = [];
			if (input.tabIDList != undefined && input.tabIDList.length > 0) {
				tabIDList = input.tabIDList;
			}
			tabIDList = arrayRemove(tabIDList, tabID);
			browser.storage.local.set({ 'tabIDList': tabIDList });
		});
	}
	updateCacheDates(operation, tabID, tabData);
	updateCacheTags(operation, tabID, tabData);
}
