var matchedTagArray = [];

render();

// Set background color of an element
function setBackground(ele, color) {
	ele.style.background = color;
}

// Delete individual link with delete btn
function deleteTab() {
	var li = this.parentNode;
	var tabID = this.value;
	browser.storage.local.get(tabID).then(function(input) {
		var tabData = input[tabID];
		browser.storage.local.remove(tabID).then(function() {
			updateCachePopulation(false, tabID, tabData);
			li.parentNode.removeChild(li);
		});
	});
}

var collectionSection = document.querySelector('.collection');

function displayList(store, tabIDList) {
	var list = document.createElement('ul');
	collectionSection.appendChild(list);

	// Iterate over stored links and display them
	for (i = 0; i < tabIDList.length; i++) {
		var tab = store[tabIDList[i]];
		console.log(tab);

		$(".collection ul:last").append(HTMLLinkItem.replace('%tabID%', tabIDList[i]).replace('%url%', tab.url).replace('%name%', tab.name));

		var delBtn = document.querySelectorAll('.collection ul:last-child .delete-link')[i];
		delBtn.addEventListener('click', deleteTab);

		// Iterate over all tags
		for (var key in tab.tags) {
			$(".collection ul:last li:last").append(HTMLLinkItemTag.replace('%tagType%', key).replace('%tagNames%', tab.tags[key]));

			var tag = document.querySelector(".collection ul:last-child li:last-child .tag:last-child");
			rcolor = getColor();
			setBackground(tag, rcolor);
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

function matchTags(store, tagType, tagName) {
	if (store.tags[tagType][tagName] != undefined) {
		matchedTagArray.push.apply(matchedTagArray, store.tags[tagType][tagName]);
		matchedTagArray = Array.from(new Set(matchedTagArray));
		collectionSection.innerHTML = "";
		displayList(store, matchedTagArray);
	}
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
				$('.tag-matching').show();
				displayNoSort(store);
			} else if (sorting.value == "byDate"){
				$('.tag-matching').hide();
				displayByDate(store);
			}
		}
		sortBy();

		// Input elements
		var tagType = document.querySelectorAll('.tag-matching input:nth-child(1)')[0];
		var tagName = document.querySelectorAll('.tag-matching input:nth-child(2)')[0];

		$('.tag-matching input:nth-child(1)').autocomplete({
			source: Object.keys(store.tags),
			autoFocus: true,
			minLength: 0
		}).focus(function() {
			$(this).autocomplete("search", "");
		});
		
		tagName.addEventListener('focus', function () {
			if (tagType.value !== "") {
				var tagIn = tagType.value;
				if (store.tags[tagIn] != undefined) {
					$('.tag-matching input:nth-child(2)').autocomplete({
						source: Object.keys(store.tags[tagIn]),
						autoFocus: true,
						minLength: 0
					}).focus(function () {
						$(this).autocomplete("search", "");
					});
				}
			}
		});

		// Tag matching
		document.querySelector(".tag-matching-save").addEventListener('click', function () {
			matchTags(store, tagType.value, tagName.value);
		});
	}
}

// Delete all links
document.getElementById('clear-all').addEventListener('click', function() {
	if(confirm("Are you sure you want to delete all the links?")){
		browser.storage.local.clear();
		collectionSection.innerHTML = "";
	}
});
