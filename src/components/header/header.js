const header = (element) => {
	function init() {
		console.log('header:', element);
	}
	init();
}

[...document.querySelectorAll('[data-header]')].map(header);
