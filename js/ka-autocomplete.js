;(function ( kaAutocomplete, window, document, undefined ) {
 
    // private properties
    var oldInput = '',
        focusPosition = -1,
		kaSuggestions = [],
		filteredSuggestions = [],
		kaInput = null,
		kaList = null,
		kaWrapper = null,
		focused = null,
		timer = null,
		keyCode = -1;
 
    // public methods and properties
    kaAutocomplete.create = function (wrapper, list) {
		kaWrapper = wrapper;
        kaSuggestions = list;
		kaInput = document.createElement('input');
		kaList = document.createElement('ul');
		kaInput.className = kaInput.className + ' ka-input';
		kaInput['type'] = 'text';
		kaInput['placeholder'] = 'Type something...';
		kaWrapper.appendChild(kaInput);
		kaList.className = kaList.className + ' ka-list';
		kaList.style.display = 'none';
		kaWrapper.appendChild(kaList);
		
		bindEvent(kaInput, 'keydown', function(e) {
			e = e || window.event;
			keyCode = e.keyCode;
			timer = setTimeout(moveFocus, 150);
		});
		bindEvent(kaInput, 'keyup', keyUpHandler);
		bindEvent(document.body, 'click', function (e) {
			e = e || window.event;
			if (e.target !== kaInput) { 
				kaList.style.display = 'none';
				focusPosition = -1;
			}
		});
		bindEvent(window, 'resize', resizeList);
    };
 
    // private methods
    function keyUpHandler(e) {
		clearTimeout(timer);
        e = e || window.event;
		
		keyCode = e.keyCode;
		var currInput = kaInput.value.toLowerCase();
		
		if (keyCode === 38 || keyCode === 40) {
			moveFocus(keyCode);
		} else if (keyCode === 13) {
			if (focused) {
				setInputOnEnter();
				currInput = kaInput.value.toLowerCase();
			}
		} else {
			focusPosition = -1;
			if (kaList.style.display === 'none' && (kaInput.value !== '' || (
				keyCode !== 8 || keyCode !== 127)) && currInput != oldInput) {
				kaList.style.display = 'block';
			}
		}
		
		if (currInput != oldInput) {
			oldInput = currInput;
			displaySuggestions(currInput);
		}
    }
	
	function displaySuggestions(currInput) {
        var suggLen = kaSuggestions.length;
		var filteredSuggs = [];
		if (currInput === '') {
			for (var i = 0; i < suggLen; i++) {
				filteredSuggs += insertSuggestion(i);
			}
		} else {
			for (var i = 0; i < suggLen; i++) {
				/*
				Adding all original list items to the filtered list
				that contain the entered text
				*/
				if (kaSuggestions[i].toLowerCase()
					.indexOf(currInput) >= 0) {
					if (kaSuggestions[i].toLowerCase()
						.indexOf(currInput) === 0) {
						filteredSuggs = insertSuggestion(i)
							+ filteredSuggs;
					} else {
						filteredSuggs += insertSuggestion(i);
					}
				}
			}
		}
		
		kaList.innerHTML = filteredSuggs;
		filteredSuggestions = getElementsByClassName('ka-list-item');
		makeSuggestionsSelectable();
		resizeList();
    }
	
	function insertSuggestion(i) {
        return '<li id="' + i + '" class="ka-list-item">' +
        kaSuggestions[i] + '</li>';
    }
	
	/* 
	Adding ability to select suggestion list items
	and set input text to the selected item 
	*/
	function makeSuggestionsSelectable() {
        var elms = filteredSuggestions;
		var len = elms.length,
			suggText = '';
		for (var i = 0; i < len; i++) {
			bindEvent(elms[i], 'click', (function (i) {
				return function () {
					suggText = elms[i].innerHTML;
					kaInput.value = suggText;
					oldInput = suggText.toLowerCase();
				}
			})(i));
		}
    }
	
	// Moving focus across the suggestion list using up and down arrow
	function moveFocus() {
		// Down arrow
        if (keyCode === 40) {
			if (focusPosition !== -1) {
				removeFocus();
			}
			// Bottom of the list condition
			if (focusPosition === filteredSuggestions.length - 1) {
				focusPosition = 0;
				updateScrollPosition(0);
			} else {
				focusPosition += 1;
				updateScrollPosition(filteredSuggestions[focusPosition]);
			}
			setFocus();
		}
		// Up arrow
		if (keyCode === 38) {
			removeFocus();
			focusPosition -= 1;
			// Top of the list condition
			if (focusPosition === -1) {
				focusPosition = filteredSuggestions.length - 1;
				updateScrollPosition(0);
				
			} else {
				updateScrollPosition(filteredSuggestions[focusPosition]);
			}
			setFocus();
		}
    }
	
	function setFocus() {
        focused = filteredSuggestions[focusPosition].innerHTML;
		filteredSuggestions[focusPosition].className += ' focus';
    }
	
	function removeFocus() {
        focused = null;
		filteredSuggestions[focusPosition].className = ' ka-list-item';
    }
	
	/*
	Setting input text using Enter button
	while traversing list using arrow keys
	*/
	function setInputOnEnter() {
        kaInput.value = focused;
		oldInput = focused.toLowerCase();
		removeFocus();
		focusPosition = -1;
		kaList.style.display = 'none';
    }
	
	// Setting the list's dimensions according to the size of the input box
	function resizeList() {
		var rect = kaInput.getBoundingClientRect();
		kaList.style.left = rect.left + (window.pageXOffset ||
			document.documentElement.scrollLeft) + 'px';
		kaList.style.top = rect.bottom + (window.pageYOffset ||
			document.documentElement.scrollTop) + 1 + 'px';
		kaList.style.width = rect.right - rect.left - 12 + 'px'; // outerWidth
	}
	
	// Updating scroll position while using arrow keys to traverse the list
	function updateScrollPosition(next){
		if (!kaList.maxHeight) {
			kaList.maxHeight = parseInt((window.getComputedStyle ?
				getComputedStyle(kaList, null) :
					kaList.currentStyle).maxHeight);
		}
		if (!kaList.suggestionHeight) {
			kaList.suggestionHeight = next.offsetHeight;
		}
		if (kaList.suggestionHeight) {
			if (!next) {
				if (keyCode === 38) {
					kaList.scrollTop = kaList.scrollHeight;
				} else {
					kaList.scrollTop = 0;
				}
			} else {
				var scrTop = kaList.scrollTop,
					selTop = next.getBoundingClientRect().top -
						kaList.getBoundingClientRect().top;
				if (selTop + kaList.suggestionHeight -
					kaList.maxHeight > 0) {
					kaList.scrollTop = selTop + kaList.suggestionHeight
						+ scrTop - kaList.maxHeight;
				} else if (selTop < 0) {
					kaList.scrollTop = selTop + scrTop;
				}
			}
		}
	}
	
	// 'addEventListener' IE8 fix
	function bindEvent(el, event, fn) {
        if (el.attachEvent) {
			el.attachEvent('on' + event, function() {fn.call(el);});
		}
	   else if (el.addEventListener) {
		  el.addEventListener(event, fn, false);
	   }
    }
	
	// 'getElementsByClassName' IE8 fix
	function getElementsByClassName(className) {
        if (document.getElementsByClassName) {
		  return document.getElementsByClassName(className);
		} else {
			return document.querySelectorAll('.' + className);
		}
    }
 
})( window.kaAutocomplete = window.kaAutocomplete || {},
	window, document, undefined );