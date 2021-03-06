var common = require('./common');

function dev_greeting(){
	console.log('Hello there, savvy friend!');
	console.log('You may find the living source code for this website at: https://github.com/panstav/panembassy');
};

function form_handler(){

	var form = document.querySelector('form');
	var button = document.querySelector('form button');

	common.addEvent(button, 'click', function(e){
		if (e.preventDefault) e.preventDefault();

		contact_form_submission();

		return false;
	});

	common.addEvent(form, 'submit', function(e){
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

			common.addClass('show').to(prompt);
		} else {
			common.removeClass('show').from(prompt);
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

			ga('send', 'event', 'interactions', 'contact-form-successful');

			var overlay = document.querySelector('.overlay');

			common.addClass('show').to(overlay);

			document.querySelector('form').reset();

			window.scroll(0, 0);

			setTimeout(function(){
				common.removeClass('show').from(overlay);
			}, 2000);

		}

		var xhr = new XMLHttpRequest();
		common.addEvent(xhr, 'load', xhrCallback);
		xhr.open("POST", "/api/contact");
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(JSON.stringify(fields));

	}

};

common.addEvent(window, 'load', function(){

	// all pages
	dev_greeting();

	// front-page
	if (window.location.pathname === '/'){
		form_handler();
	}
});
