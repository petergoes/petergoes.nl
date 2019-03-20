const header = (element) => {
	function init() {
		console.log('netlify');
	}
	init();
}

[...document.querySelectorAll('[data-header]')].map(header);
