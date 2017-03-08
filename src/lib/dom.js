/**
 * Find the closest element, up in the hierarchy, with a node name equal to the 
 * provided target
 * @param  {HTMLElement} element The element to search from
 * @param  {String}      target  The target element node name
 * @return {HTMLElement}         The closest element
 */
export function closest(element, target) {
	const parentNode = element.parentNode;
	const parentNodeName = (parentNode) ? parentNode.nodeName : '';

	// The element is the target element
	if (element.nodeName.toLowerCase() === target.toLowerCase()) {
		return element;
	}

	// We found our match. Or reached the html element which parent node is null
	if (parentNodeName.toLowerCase() === target.toLowerCase() ||
		parentNode === null) {
		return parentNode;
	}

	return closest(parentNode, target);
}

export function wrapHtmlStringInElement(string, wrapperType) {
	const wrapper = document.createElement(wrapperType.toLowerCase());
	wrapper.innerHTML = string;
	return wrapper;
}

export function setPageTitle(title) {
	document.querySelector('html > head > title').innerHTML = title;
}
