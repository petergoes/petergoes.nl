import * as dom from '../../../lib/dom';

/**
 * Load partial content async and replace the main element
 */
const asyncContentLoader = () => {
	if (window.history.pushState) {
		document.body.addEventListener('click', clickHandler, false);
	}

	/**
	 * Handle any click event that reaches the body element by checking if the 
	 * page to navigate to is internal or external. For internal pages, fetch 
	 * the partial version of that page and replace the contents with the 
	 * current main element contents
	 * 
	 * @param  {ClickEvent} event The click event
	 */
	function clickHandler(event) {
		if (!window.fetch || !dom.closest(event.target, 'a')) { return; }
		event.preventDefault();
		const link = dom.closest(event.target, 'a');
		const href = link.href;
		const origin = window.location.origin;
		const isExternal = !(new RegExp(origin).test(href));

		if (link === null) {
			return;
		}

		if (isExternal) {
			window.open(href, '_blank');
			return;
		}

		document.body.classList.add('async-content-loading');

		fetch(`${href}/partial.html`)
			.then(checkStatus)
			.then(parseResponseBody)
			.then(response => replaceMainWithResponse(response, href))
			.then(() => document.body.classList.remove('async-content-loading'))
			.catch(() => {
				window.location = href;
			});
	}

	/**
	 * Replace the content of the current main element with the response body.
	 * The response contains html with the content and a script element. This 
	 * script element contains the contents meta data. The head of the page is 
	 * updated with this meta data (currently only the title), as well as the 
	 * body class
	 * 
	 * @param  {String} response The response body containing html
	 * @param  {String} href     The url that was originally requested
	 */
	function replaceMainWithResponse(response, href) {
		const wrappedResponse = dom.wrapHtmlStringInElement(response, 'div');
		const dataElement = wrappedResponse.querySelector('script[type="application/json"]');
		const rootBodyElement = document.body;
		const jsonData = dataElement.innerHTML || '{}';
		const data = JSON.parse(jsonData);
		const supportedScrollTop = document.body.scrollTop > 0 ? document.body : document.documentElement;

		wrappedResponse.removeChild(dataElement);

		dom.setPageTitle(data.title);
		rootBodyElement.setAttribute('class', data.bodyClass);

		supportedScrollTop.scrollTop = 0;
		document.querySelector('main').innerHTML = wrappedResponse.innerHTML;
		window.history.pushState(null, data.title, href);
	}

	/**
	 * Check the status of the response. The fetch api does not throw an error 
	 * on status codes other than 2xx, so I need to do that myself.
	 * 
	 * @param  {Object} response The response object
	 * @return {Object}          The response object
	 */
	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response
		} else {
			const error = new Error(response.statusText)
			error.response = response
			throw error
		}
	}

	/**
	 * Helper function to get the body from the response
	 * 
	 * @param  {Object} response The response object
	 * @return {String}          The response body as a string
	 */
	function parseResponseBody(response) {
		return response.text();
	}
}

asyncContentLoader();
