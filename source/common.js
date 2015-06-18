// namespace
var common = {

	addEvent: function addEvent(element, type, callback, capture) {
		if (element.addEventListener) element.addEventListener(type, callback, capture);
		else if (element.attachEvent) element.attachEvent('on' + type, callback);
	},

	addClass: function addClass(className){

		return {
			to: function(elem){

				if (elem.classList){
					elem.classList.add(className);

				} else {
					elem.className += ' ' + className;
				}

			}
		};

	},
	removeClass: function removeClass(className){

		return {
			from: function(elem){

				if (elem.classList){
					elem.classList.remove(className);

				} else {
					elem.className = elem.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
				}

			}
		};

	},

	scrollToId: function(id){
		smoothScroll.animateScroll(null, id, {
			speed: 500,
			easing: 'easeInOutCubic'
		});
	}

};