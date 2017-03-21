import * as dom from '../../../lib/dom';

/**
 * Load partial content async and replace the main element
 */
const asyncContentLoader = () => {
	if (window.history.pushState && window.fetch) {
		document.body.addEventListener('click', clickHandler, false);
		window.addEventListener('popstate', popStateHandler, false);
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
		if (!dom.closest(event.target, 'a')) { return; }
		event.preventDefault();
		const link = dom.closest(event.target, 'a');
		const href = link.href.replace(/\/^/, '');
		const origin = window.location.origin;
		const isExternal = !(new RegExp(origin).test(href));

		if (link === null) {
			return;
		}

		if (isExternal) {
			window.open(href, '_blank');
			return;
		}

		loadTargetContent(href)
			.then(() => window.history.pushState(null, '', href));
	}

	/**
	 * Handles a popState event. When a user clicks the back button of the 
	 * browser for example. It fetches the content for the previous page and
	 * replaces the current main element
	 */
	function popStateHandler() {
		const href = location.href;
		const origin = window.location.origin;
		const isExternal = !(new RegExp(origin).test(href));

		if (isExternal) {
			window.open(href, '_blank');
			return;
		}

		loadTargetContent(href);
	}

	/**
	 * The loading of the target content. It fetches the partial for a page and 
	 * makes a call to replaceMainWithResponse so it gets rendered. It returns
	 * a promise for when it is all done.
	 * 
	 * @param  {String}  href The url to load
	 * @return {Promise}      A promise which resolves when the content is added
	 *                        to the page
	 */
	function loadTargetContent(href) {
		document.body.classList.add('async-content-loading');

		return fetch(`${href}/partial.html`)
			.then(checkStatus)
			.then(parseResponseBody)
			.then(response => replaceMainWithResponse(response))
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
	 */
	function replaceMainWithResponse(response) {
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
