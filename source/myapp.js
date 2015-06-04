// namespace
var myapp = {

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
