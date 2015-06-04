// app init
(function(){

	function dev_greeting(){
		console.log('Hello there, savvy friend!');
	};

	function hire_button_handler(){
		var toggle = document.querySelector('a.availability');

		toggle.addEventListener('click', function(){
			myapp.scrollToId('#contact');
		});
	};

	function form_handler(){

		var form = document.querySelector('form');
		var button = document.querySelector('form button');

		button.addEventListener('click', function(e){
			if (e.preventDefault) e.preventDefault();

			contact_form_submission();

			return false;
		});

		form.addEventListener('submit', function(e){
			if (e.preventDefault) e.preventDefault();

			contact_form_submission();

			return false;
		});
	};

	function contact_form_validation(fields){

		var valid = true;

		function requireField(field, prompt){
			if (!field){
				valid = false;

				myapp.addClass('show').to(prompt);
			} else {
				myapp.removeClass('show').from(prompt);
			}
		};

		requireField(fields.name, document.querySelector('.name .required'));
		requireField(fields.email, document.querySelector('.email .required'));

		return valid;

	};

	function contact_form_submission(){

		var fields = {
			name: document.querySelector('input#name').value,
			email: document.querySelector('input#email').value,
			message: document.querySelector('textarea#message').value
		};

		if (contact_form_validation(fields)){

			function xhrCallback(){

				var overlay = document.querySelector('.overlay');

				myapp.addClass('show').to(overlay);

				document.querySelector('form').reset();

				setTimeout(function(){
					myapp.scrollToId('#');

					myapp.removeClass('show').from(overlay);
				}, 2000);

			}

			var xhr = new XMLHttpRequest();
			xhr.addEventListener("load", xhrCallback, false);
			xhr.open("POST", "/api/contact");
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.send(JSON.stringify(fields));

		}

	};

	window.addEventListener('load', function(){
		dev_greeting();

		hire_button_handler();

		form_handler();
	});

})();
