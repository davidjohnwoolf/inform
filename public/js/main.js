(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/js/src/main.js":[function(require,module,exports){
var m = require('mithril');

var app = {
  Login: require('./sessions/login'),
  Logout: require('./sessions/logout'),
  UserNew: require('./users/user-new'),
  UserShow: require('./users/user-show'),
  UserEdit: require('./users/user-edit'),
  FeedList: require('./feeds/feed-list'),
  FeedNew: require('./feeds/feed-new'),
  FeedShow: require('./feeds/feed-show'),
  FeedEdit: require('./feeds/feed-edit'),
  SourceShow: require('./sources/source-show'),
  SourceEdit: require('./sources/source-edit')
};

m.route.mode = 'hash';

m.route(document.getElementById('app'), '/', {
  // sessions
  '/': app.Login,
  '/logout': app.Logout,

  // password recovery
  // '/request-password': app.RequestPassword,
  // '/reset-password/:token': app.ResetPassword,

  // users
  '/users/new': app.UserNew,
  '/users/:id': app.UserShow,
  '/users/:id/edit': app.UserEdit,

  // feeds
  '/users/:id/feeds': app.FeedList,
  '/users/:id/feeds/new': app.FeedNew,
  '/users/:id/feeds/:feedId': app.FeedShow,
  '/users/:id/feeds/:feedId/edit': app.FeedEdit,

  // sources
  '/users/:id/feeds/:feedId/sources/:sourceId': app.SourceShow,
  '/users/:id/feeds/:feedId/sources/:sourceId/edit': app.SourceEdit,
});

// when hashed route changes, reset the menu
(function(history) {

  var pushState = history.pushState;
  var handleRouteChange = function() {
    var header = document.getElementById('header-wrap');
    var menu = document.getElementById('menu');
    var content = document.getElementById('content-wrap');

    // reset menu
    menu.style.display = 'none';
    content.style.marginTop = header.offsetHeight + 10 + 'px';
  }

  history.pushState = function(state) {
      if (typeof history.onpushstate == "function") {
          history.onpushstate({state: state});
      }
      // ... whatever else you want to do
      // maybe call onhashchange e.handler
      return pushState.apply(history, arguments);
  }

  window.onpopstate = history.onpushstate = handleRouteChange;

})(window.history);

},{"./feeds/feed-edit":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-edit.js","./feeds/feed-list":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-list.js","./feeds/feed-new":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-new.js","./feeds/feed-show":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-show.js","./sessions/login":"/Users/david/Projects/inform/inform/public/js/src/sessions/login.js","./sessions/logout":"/Users/david/Projects/inform/inform/public/js/src/sessions/logout.js","./sources/source-edit":"/Users/david/Projects/inform/inform/public/js/src/sources/source-edit.js","./sources/source-show":"/Users/david/Projects/inform/inform/public/js/src/sources/source-show.js","./users/user-edit":"/Users/david/Projects/inform/inform/public/js/src/users/user-edit.js","./users/user-new":"/Users/david/Projects/inform/inform/public/js/src/users/user-new.js","./users/user-show":"/Users/david/Projects/inform/inform/public/js/src/users/user-show.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js":[function(require,module,exports){
var m = (function app(window, undefined) {
	var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
	var noop = function() {}

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window){
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);


	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m() {
		var args = [].slice.call(arguments);
		var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1] || "view" in args[1]) && !("subtree" in args[1]);
		var attrs = hasAttrs ? args[1] : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
		while (match = parser.exec(args[0])) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
			}
		}

		var children = hasAttrs ? args.slice(2) : args.slice(1);
		if (children.length === 1 && type.call(children[0]) === ARRAY) {
			cell.children = children[0]
		}
		else {
			cell.children = children
		}
		
		for (var attrName in attrs) {
			if (attrs.hasOwnProperty(attrName)) {
				if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
					classes.push(attrs[attrName])
					cell.attrs[attrName] = "" //create key in correct iteration order
				}
				else cell.attrs[attrName] = attrs[attrName]
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");
		
		return cell
	}
	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element

		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
		try {if (data == null || data.toString() == null) data = "";} catch (e) {data = ""}
		if (data.subtree === "retain") return cached;
		var cachedType = type.call(cached), dataType = type.call(data);
		if (cached == null || cachedType !== dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex;
					var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
				}
				else if (cached.nodes) clear(cached.nodes, cached)
			}
			cached = new data.constructor;
			if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
			cached.nodes = []
		}

		if (dataType === ARRAY) {
			//recursively flatten array
			for (var i = 0, len = data.length; i < len; i++) {
				if (type.call(data[i]) === ARRAY) {
					data = data.concat.apply([], data);
					i-- //check current index again and flatten until there are no more nested arrays at that index
					len = data.length
				}
			}
			
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			var DELETION = 1, INSERTION = 2 , MOVE = 3;
			var existing = {}, shouldMaintainIdentities = false;
			for (var i = 0; i < cached.length; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true;
					existing[cached[i].attrs.key] = {action: DELETION, index: i}
				}
			}
			
			var guid = 0
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i] && data[i].attrs && data[i].attrs.key != null) {
					for (var j = 0, len = data.length; j < len; j++) {
						if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = "__mithril__" + guid++
					}
					break
				}
			}
			
			if (shouldMaintainIdentities) {
				var keysDiffer = false
				if (data.length != cached.length) keysDiffer = true
				else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
					if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
						keysDiffer = true
						break
					}
				}
				
				if (keysDiffer) {
					for (var i = 0, len = data.length; i < len; i++) {
						if (data[i] && data[i].attrs) {
							if (data[i].attrs.key != null) {
								var key = data[i].attrs.key;
								if (!existing[key]) existing[key] = {action: INSERTION, index: i};
								else existing[key] = {
									action: MOVE,
									index: i,
									from: existing[key].index,
									element: cached.nodes[existing[key].index] || $document.createElement("div")
								}
							}
						}
					}
					var actions = []
					for (var prop in existing) actions.push(existing[prop])
					var changes = actions.sort(sortChanges);
					var newCached = new Array(cached.length)
					newCached.nodes = cached.nodes.slice()

					for (var i = 0, change; change = changes[i]; i++) {
						if (change.action === DELETION) {
							clear(cached[change.index].nodes, cached[change.index]);
							newCached.splice(change.index, 1)
						}
						if (change.action === INSERTION) {
							var dummy = $document.createElement("div");
							dummy.key = data[change.index].attrs.key;
							parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
							newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
							newCached.nodes[change.index] = dummy
						}

						if (change.action === MOVE) {
							if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
								parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
							}
							newCached[change.index] = cached[change.from]
							newCached.nodes[change.index] = change.element
						}
					}
					cached = newCached;
				}
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
				if (item === undefined) continue;
				if (!item.nodes.intact) intact = false;
				if (item.$trusted) {
					//fix offset of next element if item was a trusted string w/ more than one html element
					//the first clause in the regexp matches elements
					//the second clause (after the pipe) matches text nodes
					subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length
				}
				else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself
				
				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0, len = data.length; i < len; i++) {
					if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				if (data.length < cached.length) cached.length = data.length;
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType === OBJECT) {
			var views = [], controllers = []
			while (data.view) {
				var view = data.view.$original || data.view
				var controllerIndex = m.redraw.strategy() == "diff" && cached.views ? cached.views.indexOf(view) : -1
				var controller = controllerIndex > -1 ? cached.controllers[controllerIndex] : new (data.controller || noop)
				var key = data && data.attrs && data.attrs.key
				data = pendingRequests == 0 || (cached && cached.controllers && cached.controllers.indexOf(controller) > -1) ? data.view(controller) : {tag: "placeholder"}
				if (data.subtree === "retain") return cached;
				if (key) {
					if (!data.attrs) data.attrs = {}
					data.attrs.key = key
				}
				if (controller.onunload) unloaders.push({controller: controller, handler: controller.onunload})
				views.push(view)
				controllers.push(controller)
			}
			if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.")
			if (!data.attrs) data.attrs = {};
			if (!cached.attrs) cached.attrs = {};

			var dataAttrKeys = Object.keys(data.attrs)
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || dataAttrKeys.sort().join() != Object.keys(cached.attrs).sort().join() || data.attrs.id != cached.attrs.id || data.attrs.key != cached.attrs.key || (m.redraw.strategy() == "all" && (!cached.configContext || cached.configContext.retain !== true)) || (m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false)) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
				if (cached.controllers) {
					for (var i = 0, controller; controller = cached.controllers[i]; i++) {
						if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop})
					}
				}
			}
			if (type.call(data.tag) != STRING) return;

			var node, isNew = cached.nodes.length === 0;
			if (data.attrs.xmlns) namespace = data.attrs.xmlns;
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
			
			if (isNew) {
				if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
				else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
				cached = {
					tag: data.tag,
					//set attributes first, then create children
					attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
					children: data.children != null && data.children.length > 0 ?
						build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
						data.children,
					nodes: [node]
				};
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
					for (var i = 0, controller; controller = controllers[i]; i++) {
						if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old
						if (pendingRequests && controller.onunload) {
							var onunload = controller.onunload
							controller.onunload = noop
							controller.onunload.$old = onunload
						}
					}
				}
				
				if (cached.children && !cached.children.nodes) cached.children.nodes = [];
				//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
				if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0];
				if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
				cached.nodes.intact = true;
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
				}
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === FUNCTION) {
				var context = cached.configContext = cached.configContext || {};

				// bind
				var callback = function(data, args) {
					return function() {
						return data.attrs["config"].apply(data, args)
					}
				};
				configs.push(callback(data, [node, !isNew, context, cached]))
			}
		}
		else if (typeof data != FUNCTION) {
			//handle text nodes
			var nodes;
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [$document.createTextNode(data)];
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes;
				if (!editable || editable !== $document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached);
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data;
						else if (editable) editable.innerHTML = data;
						else {
							if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached);
								nodes = [$document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data);
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}
	function sortChanges(a, b) {return a.action - b.action || a.index - b.index}
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				try {
					//`config` isn't a real attributes, so ignore it
					if (attrName === "config" || attrName == "key") continue;
					//hook event handlers to the auto-redrawing system
					else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
						node[attrName] = autoredraw(dataAttr, node)
					}
					//handle `style: {...}`
					else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
						for (var rule in dataAttr) {
							if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
						}
						for (var rule in cachedAttr) {
							if (!(rule in dataAttr)) node.style[rule] = ""
						}
					}
					//handle SVG
					else if (namespace != null) {
						if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
						else if (attrName === "className") node.setAttribute("class", dataAttr);
						else node.setAttribute(attrName, dataAttr)
					}
					//handle cases that are properties (but ignore cases where we should use setAttribute instead)
					//- list and form are typically used as strings, but are DOM element references in js
					//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
					else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
						//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
						if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
					}
					else node.setAttribute(attrName, dataAttr)
				}
				catch (e) {
					//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr
			}
		}
		return cachedAttrs
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {nodes[i].parentNode.removeChild(nodes[i])}
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0
	}
	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
			cached.configContext.onunload();
			cached.configContext.onunload = null
		}
		if (cached.controllers) {
			for (var i = 0, controller; controller = cached.controllers[i]; i++) {
				if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop});
			}
		}
		if (cached.children) {
			if (type.call(cached.children) === ARRAY) {
				for (var i = 0, child; child = cached.children[i]; i++) unload(child)
			}
			else if (cached.children.tag) unload(cached.children)
		}
	}
	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder)
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data)
		}
		else parentElement.insertAdjacentHTML("beforeend", data);
		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++
		}
		return nodes
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try {return callback.call(object, e)}
			finally {
				endFirstComputation()
			}
		}
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		for (var i = 0, len = configs.length; i < len; i++) configs[i]()
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store
		};

		prop.toJSON = function() {
			return store
		};

		return prop
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
			return propify(store)
		}

		return gettersetter(store)
	};

	var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, prevented = false, topComponent, unloaders = [];
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	function parameterize(component, args) {
		var controller = function() {
			return (component.controller || noop).apply(this, args) || this
		}
		var view = function(ctrl) {
			if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
			return component.view.apply(component, args ? [ctrl].concat(args) : [ctrl])
		}
		view.$original = component.view
		var output = {controller: controller, view: view}
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
		return output
	}
	m.component = function(component) {
		return parameterize(component, [].slice.call(arguments, 1))
	}
	m.mount = m.module = function(root, component) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;
		
		var isPrevented = false;
		var event = {preventDefault: function() {
			isPrevented = true;
			computePreRedrawHook = computePostRedrawHook = null;
		}};
		for (var i = 0, unloader; unloader = unloaders[i]; i++) {
			unloader.handler.call(unloader.controller, event)
			unloader.controller.onunload = null
		}
		if (isPrevented) {
			for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler
		}
		else unloaders = []
		
		if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
			controllers[index].onunload(event)
		}
		
		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			if (arguments.length > 2) component = subcomponent(component, [].slice.call(arguments, 2))
			var currentComponent = topComponent = component = component || {controller: function() {}};
			var constructor = component.controller || noop
			var controller = new constructor;
			//controllers may call m.mount recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.mount call is applied
			if (currentComponent === topComponent) {
				controllers[index] = controller;
				components[index] = component
			}
			endFirstComputation();
			return controllers[index]
		}
	};
	var redrawing = false
	m.redraw = function(force) {
		if (redrawing) return
		redrawing = true
		//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
		//lastRedrawID is null if it's the first redraw and not an event handler
		if (lastRedrawId && force !== true) {
			//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
			//when rAF: always reschedule redraw
			if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
				if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
				lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
			}
		}
		else {
			redraw();
			lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
		}
		redrawing = false
	};
	m.redraw.strategy = m.prop();
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}
		for (var i = 0, root; root = roots[i]; i++) {
			if (controllers[i]) {
				var args = components[i].controller && components[i].controller.$$args ? [controllers[i]].concat(components[i].controller.$$args) : [controllers[i]]
				m.render(root, components[i].view ? components[i].view(controllers[i], args) : "")
			}
		}
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0;
	m.startComputation = function() {pendingRequests++};
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0);
		if (pendingRequests === 0) m.redraw()
	};
	var endFirstComputation = function() {
		if (m.redraw.strategy() == "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
	m.route = function() {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, router, path)) {
					if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route")
					isDefaultRoute = true
					m.route(defaultRoute, true)
					isDefaultRoute = false
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute != normalizeRoute(path)) {
					redirect(path)
				}
			};
			computePreRedrawHook = setScroll;
			window[listener]()
		}
		//config: m.route
		else if (arguments[0].addEventListener || arguments[0].attachEvent) {
			var element = arguments[0];
			var isInitialized = arguments[1];
			var context = arguments[2];
			var vdom = arguments[3];
			element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
			if (element.addEventListener) {
				element.removeEventListener("click", routeUnobtrusive);
				element.addEventListener("click", routeUnobtrusive)
			}
			else {
				element.detachEvent("onclick", routeUnobtrusive);
				element.attachEvent("onclick", routeUnobtrusive)
			}
		}
		//m.route(route, params, shouldReplaceHistoryEntry)
		else if (type.call(arguments[0]) === STRING) {
			var oldRoute = currentRoute;
			currentRoute = arguments[0];
			var args = arguments[1] || {}
			var queryIndex = currentRoute.indexOf("?")
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
			for (var i in args) params[i] = args[i]
			var querystring = buildQueryString(params)
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

			if (window.history.pushState) {
				computePreRedrawHook = setScroll
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
				};
				redirect(modes[m.route.mode] + currentRoute)
			}
			else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
		return routeParams[key]
	};
	m.route.mode = "search";
	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router);
		var index = keys.indexOf(path);
		if(index !== -1){
			m.mount(root, router[keys [index]]);
			return true;
		}

		for (var route in router) {
			if (route === path) {
				m.mount(root, router[route]);
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.mount(root, router[route])
				});
				return true
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;
		if (e.ctrlKey || e.metaKey || e.which === 2) return;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		var currentTarget = e.currentTarget || e.srcElement;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
	}
	function setScroll() {
		if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0)
	}
	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []
		for (var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop
			var value = object[prop]
			var valueType = type.call(value)
			var pair = (value === null) ? encodeURIComponent(key) :
				valueType === OBJECT ? buildQueryString(value, key) :
				valueType === ARRAY ? value.reduce(function(memo, item) {
					if (!duplicates[key]) duplicates[key] = {}
					if (!duplicates[key][item]) {
						duplicates[key][item] = true
						return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
					}
					return memo
				}, []).join("&") :
				encodeURIComponent(key) + "=" + encodeURIComponent(value)
			if (value !== undefined) str.push(pair)
		}
		return str.join("&")
	}
	function parseQueryString(str) {
		if (str.charAt(0) === "?") str = str.substring(1);
		
		var pairs = str.split("&"), params = {};
		for (var i = 0, len = pairs.length; i < len; i++) {
			var pair = pairs[i].split("=");
			var key = decodeURIComponent(pair[0])
			var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
				params[key].push(value)
			}
			else params[key] = value
		}
		return params
	}
	m.route.buildQueryString = buildQueryString
	m.route.parseQueryString = parseQueryString
	
	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred
	};
	function propify(promise, initialValue) {
		var prop = m.prop(initialValue);
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		};
		return prop
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self["promise"] = {};

		self["resolve"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire()
			}
			return this
		};

		self["reject"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire()
			}
			return this
		};

		self.promise["then"] = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback);
			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue)
			}
			else {
				next.push(deferred)
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
			})
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback()
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback()
					})
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback()
				}
			} else {
				notThennableCallback()
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire()
			}
			thennable(then, function() {
				state = RESOLVING;
				fire()
			}, function() {
				state = REJECTING;
				fire()
			}, function() {
				try {
					if (state === RESOLVING && typeof successCallback === FUNCTION) {
						promiseValue = successCallback(promiseValue)
					}
					else if (state === REJECTING && typeof failureCallback === "function") {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish()
				}
				else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
	};

	m.sync = function(args) {
		var method = "resolve";
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve([]);

		return deferred.promise
	};
	function identity(value) {return value}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined
			};

			script.onerror = function(e) {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({error: "Error making jsonp request"})
					}
				});
				window[callbackKey] = undefined;

				return false
			};

			script.onload = function(e) {
				return false
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script)
		}
		else {
			var xhr = new window.XMLHttpRequest;
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr})
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (typeof options.config === FUNCTION) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data
			if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
				throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
			}
			xhr.send(data);
			return xhr
		}
	}
	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				url = url.replace(tokens[i], data[key]);
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = new Deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = isJSONP ? function(jsonp) {return jsonp.responseText} : xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		};
		xhrOptions.method = (xhrOptions.method || 'GET').toUpperCase();
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
				if (e.type === "load") {
					if (type.call(response) === ARRAY && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type === "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		};
		ajax(xhrOptions);
		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
		return deferred.promise
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m
})(typeof window != "undefined" ? window : {});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() {return m});

},{}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-edit.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var FeedInfo = require('./models/feed-info');

var FeedEdit = {
  controller: function() {
    var updateFeed = function() {
      m.request({
        method: 'PUT',
        url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit',
        data: {
          title: document.getElementsByName('title')[0].value,
          filters: document.getElementsByName('filters')[0].value,
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(authorizeHelper)
      .then(function() {
        m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
      });
    };
    var deleteFeed = function(e) {
      if (confirm('Are you sure')) {
        m.request({
          method: 'DELETE',
          url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'),
          extract: reqHelpers.nonJsonErrors,
          serialize: reqHelpers.serialize,
          config: reqHelpers.asFormUrlEncoded
        })
        .then(authorizeHelper)
        .then(function() {
          m.route('/users/' + m.route.param('id') + '/feeds/');
        });
      }
    };
    var addSource = function() {
      m.request({
        method: 'POST',
        url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/new',
        data: {
          name: document.getElementsByName('name')[0].value,
          value: document.getElementsByName('value')[0].value,
          type: document.getElementsByName('type')[0].value,
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(authorizeHelper)
      .then(function(response) {
        if (!response.fail) {
          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
        } else {
          console.log('Failure occured after authorization');
        }
      });
    };
    var deleteSource = function(sourceId) {

      var deleteSourceFn = function() {
        if (confirm('Are you sure')) {
          m.request({
            method: 'DELETE',
            url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + sourceId,
            extract: reqHelpers.nonJsonErrors,
            serialize: reqHelpers.serialize,
            config: reqHelpers.asFormUrlEncoded
          })
          .then(authorizeHelper)
          .then(function(response) {
            if (!response.fail) {
              m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
            } else {
              console.log('Failure occured after authorization');
            }
          });
        }
      }

      return deleteSourceFn;
    };

    return { feedInfo: FeedInfo(), updateFeed: updateFeed, deleteFeed: deleteFeed, addSource: addSource, deleteSource: deleteSource }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feedInfo().user.feeds,
      currentFeed: 'select-feed',
    });
    return m('div.content-part', [
      m('div', [
        m('h2', 'Edit Feed'),
        m('div.input-block', [
          m('input', { type: 'text', name: 'title', placeholder: 'edit title', value: ctrl.feedInfo().data.title || ''})
        ]),
        m('div.input-block', [
          m('input', { type: 'text', name: 'filters', placeholder: 'edit filters', value: ctrl.feedInfo().data.filters.join(',') || '' })
        ]),
        m('div.submit-block', [
          m('input', { onclick: ctrl.updateFeed, type: 'submit', value: 'Update Feed' })
        ]),
        m('div.delete-form', [
          m('button.delete-button', { onclick: ctrl.deleteFeed }, 'Delete Feed' )
        ])
      ]),
      m('div', [
        m('h2', 'Add Source'),
        m('div.input-block', [
          m('input', { type: 'text', name: 'name', placeholder: 'name' })
        ]),
        m('div.input-block', [
          m('input', { type: 'text', name: 'value', placeholder: 'value' })
        ]),
        m('div.input-block', [
          m('select', { name: 'type' }, [
            m('option', { value: 'facebook' }, 'Facebook')
          ])
        ]),
        m('div.submit-block', [
          m('input', { onclick: ctrl.addSource, type: 'submit', value: 'Add Source' })
        ]),
      ]),
      m('div', [
        m('h2', 'Sources'),
        ctrl.feedInfo().data.sources.map(function(source) {
          return m('div.listed-item', [
            m('h4', [
              m('a', { href: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id, config: m.route }, source.name)
            ]),
            m('button.delete-button', { onclick: ctrl.deleteSource(source._id)}, 'Delete Source'),
            m('a', { href: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id + '/edit', config: m.route }, 'Edit Source')
          ])
        })
      ])
    ])
  }
}

module.exports = FeedEdit;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/feed-info":"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feed-info.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-item.js":[function(require,module,exports){
var m = require('mithril');
var findLinks = require('../helpers/find-links');

var FeedItem = {
  controller: function(args) {
    var conditionalElements = function() {
      var elements = [];

      if (args.video) {
        elements.push(m('video', { controls: 'controls', src: args.video }));
      } else if (args.picture) {
        elements.push(m('img', { src: args.picture, alt: args.description }));
      }
      if (args.link) {
        elements.push(m('a.main-link', { href: args.link, target: '_blank' }, args.name || args.link));
      }
      if (args.description) {
        elements.push(m('p', m.trust(findLinks(args.description))));
      }
      if (args.caption) {
        elements.push(m('small', args.caption));
      }
      if (elements.length > 0) {
        return m('div.media-wrap', [
          elements
        ]);
      } else {
        return m('div', [
          elements
        ]);
      }
    }
    return {
      time: args.time.slice(0, 10),
      from: args.from,
      message: m.trust(findLinks(args.message)),
      elements: conditionalElements()
    }
  },
  view: function(ctrl) {
    return m('article.feed-item', [
      m('a[href=https://facebook.com/' + ctrl.from.id  + ']', { target: '_blank'}, [
        m('h5', ctrl.from.name + ' - ' + ctrl.time)
      ]),
      m('h4', ctrl.message),
      ctrl.elements
    ])
  }
};

module.exports = FeedItem;

},{"../helpers/find-links":"/Users/david/Projects/inform/inform/public/js/src/helpers/find-links.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-list.js":[function(require,module,exports){
var m = require('mithril');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var FeedListing = require('../feeds/feed-listing');
var Feeds = require('./models/feeds');

var FeedList = {
  controller: function() {
    return { feeds: Feeds() }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feeds().user.feeds,
      currentFeed: 'select-feed',
    });
    return m('section.content-part', [
      m('h2', 'Feeds'),
      ctrl.feeds().data.map(function(feed) {
        return m.component(FeedListing, { feedId: feed._id, title: feed.title, userId: ctrl.feeds().user.id });
      })
    ]);
  }
};

module.exports = FeedList;

},{"../feeds/feed-listing":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-listing.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/feeds":"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feeds.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-listing.js":[function(require,module,exports){
var m = require('mithril');

var FeedListing = {
  controller: function(args) {
    return {
      id: args.id,
      title: args.title,
      userId: args.userId,
      feedId: args.feedId
    }
  },
  view: function(ctrl) {
    return m('div.listed-item', [
      m('h4', [
        m('a', { href: '/users/' + ctrl.userId + '/feeds/' + ctrl.feedId, config: m.route }, ctrl.title)
      ]),
      m('a', { href: '/users/' + ctrl.userId + '/feeds/' + ctrl.feedId + '/edit', config: m.route }, 'Settings')
    ])
  }
};

module.exports = FeedListing;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-new.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var Feeds = require('./models/feeds');

var FeedNew = {
  controller: function() {
    var createFeed = function() {
      m.request({
        method: 'POST',
        url: '/users/' + m.route.param('id') + '/feeds/new',
        data: {
          title: document.getElementsByName('title')[0].value
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(authorizeHelper)
      .then(function() {
        m.route('/users/' + m.route.param('id') + '/feeds');
      });
    };
    return { createFeed: createFeed, feeds: Feeds() };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feeds().user.feeds,
      currentFeed: 'select-feed',
    });
    return m('div.content-part', [
      m('h2', 'Create Feed'),
      m('div.input-block', [
        m('input', { type: 'text', name: 'title', placeholder: 'feed name' })
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.createFeed, type: 'submit', value: 'Create Feed' })
      ])
    ])
  }
};

module.exports = FeedNew;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/feeds":"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feeds.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-show.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');
var FeedResults = require('./models/feed-results');
var SearchResults = require('./models/search-results');
var FeedItem = require('./feed-item');
var SearchIcon = require('../layout/search-icon');

var SearchBar = {
  controller: function(args) {
    var search = function() {
      m.mount(document.getElementById('app'), m.component(FeedShow, { query: document.getElementsByName('query')[0].value }));
    }
    if (args && args.query) {
      return { search: search, query: args.query }
    } else {
      return { search: search }
    }
  },
  view: function(ctrl) {
    if (ctrl.query) {
      return m('div.search-container', [
        m('input', { type: 'text', name: 'query', value: ctrl.query }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    } else {
      return m('div.search-container', [
        m('input', { type: 'text', name: 'query' }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    }
  }
};

var FeedShow = {
  controller: function(args) {
    if (args && args.query) {
      return { feedResults: SearchResults(args.query), query: args.query };
    } else {
      return { feedResults: FeedResults() };
    }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feedResults().user.feeds,
      currentFeed: m.route.param('feedId'),

      refreshButton: RefreshButton,

      searchBar: SearchBar,
      searchIcon: SearchIcon,
      query: ctrl.query || false
    });
    if (ctrl.feedResults().data.length < 1) {
      return m('p.feed-error', ctrl.feedResults().message)
    } else {
      return m('div', [
        ctrl.feedResults().data.map(function(item) {
          return m.component(FeedItem, {
            time: item.created_time,
            from: item.from,
            message: item.message || item.story,
            video: item.source,
            picture: item.full_picture,
            name: item.name,
            link: item.link,
            description: item.description,
            caption: item.caption,
          });
        })
      ]);
    }
  }
};

module.exports = FeedShow;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","../layout/refresh-button":"/Users/david/Projects/inform/inform/public/js/src/layout/refresh-button.js","../layout/search-icon":"/Users/david/Projects/inform/inform/public/js/src/layout/search-icon.js","./feed-item":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-item.js","./models/feed-results":"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feed-results.js","./models/search-results":"/Users/david/Projects/inform/inform/public/js/src/feeds/models/search-results.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feed-info.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var FeedInfo = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = FeedInfo;

},{"../../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feed-results.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var FeedResults = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'),
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = FeedResults;

},{"../../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feeds.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var Feeds = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = Feeds;

},{"../../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/models/search-results.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var SearchResults = function(query) {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/' + query,
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

module.exports = SearchResults;

},{"../../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js":[function(require,module,exports){
var m = require('mithril');

// check if request response is authorized
function authorizeHelper(response) {
  if (!response.authorizeFail) {
    console.log(response.message);
    return response;
  } else {
    console.log(response.message);
    m.route('/');
  }
}

module.exports = authorizeHelper;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/helpers/find-links.js":[function(require,module,exports){
// parse strings and turn urls into links
function findLinks(string) {
  // seperate string into array by spaces and returns
  var wordArray = string.split(/[ \r\n]/);

  // loop through array and turn url into anchor tag
  for (var n = 0; n < wordArray.length; n++) {
    if (wordArray[n].slice(0, 4) === 'http') {
      wordArray.splice(n, 1, '<a href=' + wordArray[n] + ' target=_blank>' + wordArray[n] + '</a>');
    }
  }

  return wordArray.join(' ');
}

module.exports = findLinks;

},{}],"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js":[function(require,module,exports){
var m = require('mithril');
var MenuIcon = require('../layout/menu-icon');

function layoutHelper(args) {

  var searchDiv = document.getElementById('search-bar');
  var header = document.getElementById('header-wrap');
  var content = document.getElementById('content-wrap');

  m.mount(
    document.getElementById('menu-icon'),
    m.component(MenuIcon)
  );

  m.mount(
    document.getElementById('menu'),
    m.component(args.menu, { userId: args.userId })
  );

  if (args.feedSelect) {
    m.mount(
      document.getElementById('feed-select'),
      m.component(args.feedSelect, { feeds: args.feeds, currentFeed: args.currentFeed })
    );
  } else {
    m.mount(document.getElementById('feed-select'), null);
  }

  if (args.refreshButton) {
    m.mount(
      document.getElementById('refresh-button'),
      m.component(args.refreshButton)
    );
  } else {
    m.mount(document.getElementById('refresh-button'), null);
  }

  if (args.searchBar) {
    m.mount(document.getElementById('search-icon'), args.searchIcon);
    if (args.query) {
      m.mount(
        document.getElementById('search-bar'),
        m.component(args.searchBar, { query: args.query })
      );
    } else {
      m.mount(
        document.getElementById('search-bar'),
        m.component(args.searchBar)
      );
    }
  } else {
    searchDiv.style.display = 'none';
    content.style.marginTop = header.offsetHeight + 10 + 'px';

    m.mount(document.getElementById('search-bar'), null);
    m.mount(document.getElementById('search-icon'), null);
  }
}

module.exports = layoutHelper;

},{"../layout/menu-icon":"/Users/david/Projects/inform/inform/public/js/src/layout/menu-icon.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js":[function(require,module,exports){
// encode requests
function serialize(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}

// set content type for request header
function asFormUrlEncoded(xhr) {
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
}

// convert non-json errors to json
function nonJsonErrors(xhr) {
  return xhr.status > 200 ? JSON.stringify(xhr.responseText) : xhr.responseText
}

module.exports = {
  serialize: serialize,
  asFormUrlEncoded: asFormUrlEncoded,
  nonJsonErrors: nonJsonErrors
};

},{}],"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js":[function(require,module,exports){
var m = require('mithril');

var FeedSelect = {
  controller: function(args) {
    var changeFeed = function() {
      if (this.value === 'select-feed') {
        this.value = m.route.param('feedId');
      } else {
        m.route('/users/' + m.route.param('id') + '/feeds/' + this.value);
      }
    };
    return { changeFeed: changeFeed, currentFeed: args.currentFeed, feeds: args.feeds };
  },
  view: function(ctrl) {
    return m('select', { onchange: ctrl.changeFeed, value: ctrl.currentFeed || 'select-feed' }, [
      m('option', { value: 'select-feed' }, 'Select Feed'),
      ctrl.feeds.map(function(feed) {
        return m('option', { value: feed._id }, feed.title);
      })
    ])
  }
}

module.exports = FeedSelect;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js":[function(require,module,exports){
var m = require('mithril');

var LoggedInMenu = {
  controller: function(args) {
    return { userId: args.userId}
  },
  view: function(ctrl) {
    return m('div', [
      m('li', [
        m('a', { href: '/users/' + ctrl.userId, config: m.route }, 'Profile'),
      ]),
      m('li', [
        m('a', { href: '/users/' + ctrl.userId + '/feeds', config: m.route }, 'Feeds'),
      ]),
      m('li', [
        m('a', { href: '/users/' + ctrl.userId + '/feeds/new', config: m.route }, 'New Feed'),
      ]),
      m('li', [
        m('a', { href: '/users/' + ctrl.userId + '/edit', config: m.route }, 'Edit Account'),
      ]),
      m('li', [
        m('a', { href: '/logout', config: m.route }, 'Logout')
      ])
    ])
  }
}

module.exports = LoggedInMenu;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/layout/logged-out-menu.js":[function(require,module,exports){
var m = require('mithril');

var LoggedOutMenu = {
  view: function() {
    return m('div', [
      m('li', [
        m('a', { href: '/', config: m.route }, 'Login'),
      ]),
      m('li', [
        m('a', { href: '/users/new', config: m.route }, 'Create Account')
      ])
    ])
  }
}

module.exports = LoggedOutMenu;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/layout/menu-icon.js":[function(require,module,exports){
var m = require('mithril');

var MenuIcon = {
  controller: function() {
    var header = document.getElementById('header-wrap');
    var menu = document.getElementById('menu');
    var content = document.getElementById('content-wrap');

    var showMenu = function() {
      if (!menu.style.display || menu.style.display === 'none') {
        menu.style.display = 'block';
        content.style.marginTop = header.offsetHeight + 10 + 'px';
      } else {
        menu.style.display = 'none';
        content.style.marginTop = header.offsetHeight + 10 + 'px';
      }
    };
    return { showMenu: showMenu };
  },
  view: function(ctrl) {
    return m('span', { onclick: ctrl.showMenu }, m.trust('&#9776;'))
  }
}

module.exports = MenuIcon;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/layout/refresh-button.js":[function(require,module,exports){
var m = require('mithril');

var RefreshButton = {
  controller: function() {
    var refresh = function() {
      m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'));
    }
    return { refresh: refresh };
  },
  view: function(ctrl) {
    return m('span', { onclick: ctrl.refresh }, m.trust('&#10227;'));
  }
}

module.exports = RefreshButton;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/layout/search-icon.js":[function(require,module,exports){
var m = require('mithril');

var SearchIcon = {
  controller: function() {
    var showBar = function() {
      var searchDiv = document.getElementById('search-bar');
      var header = document.getElementById('header-wrap');
      var content = document.getElementById('content-wrap');

      if (!searchDiv.style.display || searchDiv.style.display === 'none') {
        searchDiv.style.display = 'block';
        content.style.marginTop = header.offsetHeight + 10 + 'px';
      } else {
        searchDiv.style.display = 'none';
        content.style.marginTop = header.offsetHeight + 10 + 'px';
      }
    };

    return { showBar: showBar };
  },
  view: function(ctrl) {
    return m('span', { onclick: ctrl.showBar}, m.trust('&#9906;'));
  }
}

module.exports = SearchIcon;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sessions/login.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var LoggedOutMenu = require('../layout/logged-out-menu.js');

var Login = {
  controller: function() {
    var login = function() {
      m.request({
        method: 'POST',
        url: '/login',
        data: {
          email: document.getElementsByName('email')[0].value,
          password: document.getElementsByName('password')[0].value
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(function(response) {
        if (!response.fail) {

          m.route(
            '/users/'
            + response.user.id
            + '/feeds/'
            + (response.user.defaultFeed || response.user.feeds[0]._id || 'new')
          );

        } else {
          document.getElementsByName('email')[0].value = '';
          document.getElementsByName('password')[0].value = '';
        }
      });
    }

    var form = {
      email: m.prop('')
    };

    return { login: login, form: form };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedOutMenu
    });
    return m('section.content-part', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input', { name: 'email', type: 'email', placeholder: 'email', onchange: m.withAttr('value', ctrl.form.email), value: ctrl.form.email() })
      ]),
      m('div.input-block', [
        m('input', { name: 'password', type: 'password', placeholder: 'password' }),
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.login, type: 'submit', value: 'Login' })
      ]),
      m('p', 'Don\'t have an account? ', [
        m('a', { href: '/users/new', config: m.route }, 'Sign Up for Free')
      ]),
      m('a', { href: '/request-password', config: m.route }, 'Forgot your password?')
    ])
  }
}

module.exports = Login;

},{"../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/logged-out-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-out-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sessions/logout.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');

var Logout = {
  controller: function() {
    return m.request({
      method: 'GET', url: '/logout', extract: reqHelpers.nonJsonErrors
    })
    .then(function(response) {
      m.route('/');
    });
  }
}

module.exports = Logout;

},{"../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sources/source-edit.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var authorizeHelper = require('../helpers/authorize-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');

var SourceInfo = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId') + '/edit',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

var SourceEdit = {
  controller: function() {
    var updateSource = function() {
      m.request({
        method: 'PUT',
        url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId') + '/edit',
        data: {
          name: document.getElementsByName('name')[0].value,
          value: document.getElementsByName('value')[0].value,
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
        .then(authorizeHelper)
        .then(function() {
          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId'));
        });
    };

    return { sourceInfo: SourceInfo(), updateSource: updateSource };
  },
  view: function(ctrl) {
    m.mount(document.getElementById('search-bar'), null);
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.sourceInfo().user.feeds,
      currentFeed: 'select-feed',
    });
    return m('div', [
      m('div', [
        m('h2', 'Edit Source'),
        m('input', { type: 'text', name: 'name', placeholder: 'edit name', value: ctrl.sourceInfo().data.name || ''}),
        m('input', { type: 'text', name: 'value', placeholder: 'edit value', value: ctrl.sourceInfo().data.value || '' }),
        m('input', { onclick: ctrl.updateSource, type: 'submit', value: 'Update Source' })
      ])
    ])
  }
}

module.exports = SourceEdit;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sources/source-show.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');

//
// var SourceItems = function() {
//   return m.request({
//     method: 'GET',
//     url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'),
//     extract: reqHelpers.nonJsonErrors,
//   }).then(authorizeHelper);
// };
//
// var SearchResults = function(query) {
//   return m.request({
//     method: 'GET',
//     url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/' + query,
//     extract: reqHelpers.nonJsonErrors,
//   }).then(authorizeHelper);
// };
//
// var SearchBar = {
//   controller: function(args) {
//     var search = function() {
//       m.mount(document.getElementById('app'), m.component(FeedShow, { query: document.getElementsByName('query')[0].value }));
//     }
//     if (args && args.query) {
//       return { search: search, query: args.query }
//     } else {
//       return { search: search }
//     }
//   },
//   view: function(ctrl) {
//     if (ctrl.query) {
//       return m('div#search-container', [
//         m('input', { type: 'text', name: 'query', value: ctrl.query }),
//         m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
//       ]);
//     } else {
//       return m('div#search-container', [
//         m('input', { type: 'text', name: 'query' }),
//         m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
//       ]);
//     }
//
//   }
// };

// var FeedItem = {
//   controller: function(args) {
//     return {
//       time: args.time,
//       from: args.from,
//       message: args.message,
//       picture: args.picture,
//       description: args.description
//     }
//   },
//   view: function(ctrl) {
//     return m('article', [
//       m('p', ctrl.time),
//       m('a[href=https://facebook.com/' + ctrl.from.id  + ']', { target: '_blank'}, ctrl.from.name),
//       m('h5', ctrl.message),
//       m('img', { src: ctrl.picture, alt: ctrl.description }),
//       m('p', ctrl.description)
//     ])
//   }
// };

var SourceShow = {
  controller: function(args) {
    // if (args && args.query) {
    //   return { feedItems: SearchResults(args.query), query: args.query };
    // } else {
    //   return { feedItems: FeedItems() };
    // }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      // feedSelect: FeedSelect,
      // feeds: ctrl.feedItems().user.feeds,
      // currentFeed: m.route.param('feedId'),
      //
      // refreshButton: RefreshButton,
    });
    // if (ctrl.query) {
    //   m.mount(
    //     document.getElementById('search-bar'),
    //     m.component(SearchBar, { query: ctrl.query })
    //   );
    // } else {
    //   m.mount(
    //     document.getElementById('search-bar'),
    //     m.component(SearchBar)
    //   );
    // }
    return m('div', [
      // ctrl.feedItems().data.map(function(item) {
      //   return m.component(FeedItem, {
      //     time: item.created_time,
      //     from: item.from,
      //     message: item.message || item.story,
      //     picture: item.picture,
      //     description: item.description
      //   });
      // })
      m('h2', 'Source Show Page')
    ]);
  }
};

module.exports = SourceShow;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","../layout/refresh-button":"/Users/david/Projects/inform/inform/public/js/src/layout/refresh-button.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/models/user.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var User = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id'),
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = User;

},{"../../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/user-edit.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var User = require('./models/user');

var UserEdit = {
  controller: function() {
    var updateUser = function() {
      m.request({
        method: 'PUT',
        url: '/users/' + m.route.param('id') + '/edit',
        data: {
          email: document.getElementsByName('email')[0].value,
          defaultFeed: document.getElementsByName('defaultFeed')[0].value,
          password: document.getElementsByName('password')[0].value,
          confirmation: document.getElementsByName('confirmation')[0].value,
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(function(data) {
        if (!data.fail) {
          console.log(data.message);
          m.route('/users/' + m.route.param('id'));
        } else {
          console.log(data.message);
          m.route('/users/' + m.route.param('id') + '/edit');
        }
      });
    }

    return { user: User(), updateUser: updateUser };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.user().data.feeds,
      currentFeed: 'select-feed'
    });
    return m('div.content-part', [
      m('h2', 'Edit Account'),
      m('div.input-block', [
        m('input', { type: 'email', name: 'email', value: ctrl.user().data.email })
      ]),
      m('div.input-block', [
        m('label', 'Default Feed'),
        m('select', { name: 'defaultFeed', value: ctrl.user().data.defaultFeed || 'select-feed' }, [
          m('option', { value: '' }, 'Select Feed'),
          ctrl.user().data.feeds.map(function(feed) {
            return m('option', { value: feed._id }, feed.title)
          })
        ])
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'password', placeholder: 'password' })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'confirmation', placeholder: 'confirmation' })
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.updateUser, type: 'submit', value: 'Update User' })
      ])
    ])
  }
}

module.exports = UserEdit;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/user":"/Users/david/Projects/inform/inform/public/js/src/users/models/user.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/user-new.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var LoggedOutMenu = require('../layout/logged-out-menu.js');

var UserNew = {
  controller: function() {
    var createUser = function() {
      m.request({
        method: 'POST',
        url: '/users/new',
        data: {
          email: document.getElementsByName('email')[0].value,
          password: document.getElementsByName('password')[0].value,
          confirmation: document.getElementsByName('confirmation')[0].value,
        },
        extract: reqHelpers.nonJsonErrors,
        serialize: reqHelpers.serialize,
        config: reqHelpers.asFormUrlEncoded
      })
      .then(function(data) {
        if (!data.fail) {
          console.log(data.message);
          m.route('/login');
        } else {
          console.log(data.message);
          m.route('/users/new');
          document.getElementsByName('email')[0].value = '';
          document.getElementsByName('password')[0].value = '';
          document.getElementsByName('confirmation')[0].value = '';
        }
      });
    }

    var form = {
      email: m.prop('')
    }

    return { createUser: createUser, form: form };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedOutMenu
    });
    return m('div.content-part', [
      m('h2', 'Create Account'),
      m('div.input-block', [
        m('input', { type: 'email', name: 'email', placeholder: 'email', onchange: m.withAttr('value', ctrl.form.email), value: ctrl.form.email() })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'password', placeholder: 'password' }),
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'confirmation', placeholder: 'confirmation' }),
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.createUser, type: 'submit', value: 'Create User' })
      ])
    ])
  }
}

module.exports = UserNew;

},{"../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/logged-out-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-out-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/user-show.js":[function(require,module,exports){
var m = require('mithril');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');
var FeedList = require('../feeds/feed-list');
var User = require('./models/user');
var FeedListing = require('../feeds/feed-listing');
var Feeds = require('../feeds//models/feeds');

var UserShow = {
  controller: function() {
    var deleteAccount = function(e) {
      if (confirm('Are you sure')) {
        m.request({
          method: 'DELETE',
          url: '/users/' + m.route.param('id'),
          extract: reqHelpers.nonJsonErrors,
          serialize: reqHelpers.serialize,
          config: reqHelpers.asFormUrlEncoded
        })
        .then(function(data) {
          if (!data.fail) {
            console.log(data.message);
            m.route('/login');
          } else {
            console.log(data.message);
            m.route('/users/' + m.route.param('id'));
          }
        });
      }
    }
    return { user: User(), feeds: Feeds() };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.user().data.feeds,
      currentFeed: 'select-feed'
    });
    return m('div.content-part', [
      m('h2', 'Profile'),
      m('p', ctrl.user().data.email),
      m('a', { href: '/users/' + m.route.param('id') + '/edit', config: m.route }, 'Edit Account'),
      m('h2', 'My Feeds'),
      ctrl.feeds().data.map(function(feed) {
        return m.component(FeedListing, { feedId: feed._id, title: feed.title, userId: ctrl.feeds().user.id });
      }),
      m('h2', 'Danger Zone'),
      m('button.delete-button', { onclick: ctrl.deleteAccount }, 'Delete Account')
    ])
  }
};

module.exports = UserShow;

},{"../feeds//models/feeds":"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feeds.js","../feeds/feed-list":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-list.js","../feeds/feed-listing":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-listing.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/user":"/Users/david/Projects/inform/inform/public/js/src/users/models/user.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}]},{},["./public/js/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvc3JjL21haW4uanMiLCJub2RlX21vZHVsZXMvbWl0aHJpbC9taXRocmlsLmpzIiwicHVibGljL2pzL3NyYy9mZWVkcy9mZWVkLWVkaXQuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL2ZlZWQtaXRlbS5qcyIsInB1YmxpYy9qcy9zcmMvZmVlZHMvZmVlZC1saXN0LmpzIiwicHVibGljL2pzL3NyYy9mZWVkcy9mZWVkLWxpc3RpbmcuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL2ZlZWQtbmV3LmpzIiwicHVibGljL2pzL3NyYy9mZWVkcy9mZWVkLXNob3cuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL21vZGVscy9mZWVkLWluZm8uanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL21vZGVscy9mZWVkLXJlc3VsdHMuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL21vZGVscy9mZWVkcy5qcyIsInB1YmxpYy9qcy9zcmMvZmVlZHMvbW9kZWxzL3NlYXJjaC1yZXN1bHRzLmpzIiwicHVibGljL2pzL3NyYy9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXIuanMiLCJwdWJsaWMvanMvc3JjL2hlbHBlcnMvZmluZC1saW5rcy5qcyIsInB1YmxpYy9qcy9zcmMvaGVscGVycy9sYXlvdXQtaGVscGVyLmpzIiwicHVibGljL2pzL3NyYy9oZWxwZXJzL3JlcXVlc3QtaGVscGVycy5qcyIsInB1YmxpYy9qcy9zcmMvbGF5b3V0L2ZlZWQtc2VsZWN0LmpzIiwicHVibGljL2pzL3NyYy9sYXlvdXQvbG9nZ2VkLWluLW1lbnUuanMiLCJwdWJsaWMvanMvc3JjL2xheW91dC9sb2dnZWQtb3V0LW1lbnUuanMiLCJwdWJsaWMvanMvc3JjL2xheW91dC9tZW51LWljb24uanMiLCJwdWJsaWMvanMvc3JjL2xheW91dC9yZWZyZXNoLWJ1dHRvbi5qcyIsInB1YmxpYy9qcy9zcmMvbGF5b3V0L3NlYXJjaC1pY29uLmpzIiwicHVibGljL2pzL3NyYy9zZXNzaW9ucy9sb2dpbi5qcyIsInB1YmxpYy9qcy9zcmMvc2Vzc2lvbnMvbG9nb3V0LmpzIiwicHVibGljL2pzL3NyYy9zb3VyY2VzL3NvdXJjZS1lZGl0LmpzIiwicHVibGljL2pzL3NyYy9zb3VyY2VzL3NvdXJjZS1zaG93LmpzIiwicHVibGljL2pzL3NyYy91c2Vycy9tb2RlbHMvdXNlci5qcyIsInB1YmxpYy9qcy9zcmMvdXNlcnMvdXNlci1lZGl0LmpzIiwicHVibGljL2pzL3NyYy91c2Vycy91c2VyLW5ldy5qcyIsInB1YmxpYy9qcy9zcmMvdXNlcnMvdXNlci1zaG93LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG52YXIgYXBwID0ge1xuICBMb2dpbjogcmVxdWlyZSgnLi9zZXNzaW9ucy9sb2dpbicpLFxuICBMb2dvdXQ6IHJlcXVpcmUoJy4vc2Vzc2lvbnMvbG9nb3V0JyksXG4gIFVzZXJOZXc6IHJlcXVpcmUoJy4vdXNlcnMvdXNlci1uZXcnKSxcbiAgVXNlclNob3c6IHJlcXVpcmUoJy4vdXNlcnMvdXNlci1zaG93JyksXG4gIFVzZXJFZGl0OiByZXF1aXJlKCcuL3VzZXJzL3VzZXItZWRpdCcpLFxuICBGZWVkTGlzdDogcmVxdWlyZSgnLi9mZWVkcy9mZWVkLWxpc3QnKSxcbiAgRmVlZE5ldzogcmVxdWlyZSgnLi9mZWVkcy9mZWVkLW5ldycpLFxuICBGZWVkU2hvdzogcmVxdWlyZSgnLi9mZWVkcy9mZWVkLXNob3cnKSxcbiAgRmVlZEVkaXQ6IHJlcXVpcmUoJy4vZmVlZHMvZmVlZC1lZGl0JyksXG4gIFNvdXJjZVNob3c6IHJlcXVpcmUoJy4vc291cmNlcy9zb3VyY2Utc2hvdycpLFxuICBTb3VyY2VFZGl0OiByZXF1aXJlKCcuL3NvdXJjZXMvc291cmNlLWVkaXQnKVxufTtcblxubS5yb3V0ZS5tb2RlID0gJ2hhc2gnO1xuXG5tLnJvdXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSwgJy8nLCB7XG4gIC8vIHNlc3Npb25zXG4gICcvJzogYXBwLkxvZ2luLFxuICAnL2xvZ291dCc6IGFwcC5Mb2dvdXQsXG5cbiAgLy8gcGFzc3dvcmQgcmVjb3ZlcnlcbiAgLy8gJy9yZXF1ZXN0LXBhc3N3b3JkJzogYXBwLlJlcXVlc3RQYXNzd29yZCxcbiAgLy8gJy9yZXNldC1wYXNzd29yZC86dG9rZW4nOiBhcHAuUmVzZXRQYXNzd29yZCxcblxuICAvLyB1c2Vyc1xuICAnL3VzZXJzL25ldyc6IGFwcC5Vc2VyTmV3LFxuICAnL3VzZXJzLzppZCc6IGFwcC5Vc2VyU2hvdyxcbiAgJy91c2Vycy86aWQvZWRpdCc6IGFwcC5Vc2VyRWRpdCxcblxuICAvLyBmZWVkc1xuICAnL3VzZXJzLzppZC9mZWVkcyc6IGFwcC5GZWVkTGlzdCxcbiAgJy91c2Vycy86aWQvZmVlZHMvbmV3JzogYXBwLkZlZWROZXcsXG4gICcvdXNlcnMvOmlkL2ZlZWRzLzpmZWVkSWQnOiBhcHAuRmVlZFNob3csXG4gICcvdXNlcnMvOmlkL2ZlZWRzLzpmZWVkSWQvZWRpdCc6IGFwcC5GZWVkRWRpdCxcblxuICAvLyBzb3VyY2VzXG4gICcvdXNlcnMvOmlkL2ZlZWRzLzpmZWVkSWQvc291cmNlcy86c291cmNlSWQnOiBhcHAuU291cmNlU2hvdyxcbiAgJy91c2Vycy86aWQvZmVlZHMvOmZlZWRJZC9zb3VyY2VzLzpzb3VyY2VJZC9lZGl0JzogYXBwLlNvdXJjZUVkaXQsXG59KTtcblxuLy8gd2hlbiBoYXNoZWQgcm91dGUgY2hhbmdlcywgcmVzZXQgdGhlIG1lbnVcbihmdW5jdGlvbihoaXN0b3J5KSB7XG5cbiAgdmFyIHB1c2hTdGF0ZSA9IGhpc3RvcnkucHVzaFN0YXRlO1xuICB2YXIgaGFuZGxlUm91dGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci13cmFwJyk7XG4gICAgdmFyIG1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudScpO1xuICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQtd3JhcCcpO1xuXG4gICAgLy8gcmVzZXQgbWVudVxuICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBjb250ZW50LnN0eWxlLm1hcmdpblRvcCA9IGhlYWRlci5vZmZzZXRIZWlnaHQgKyAxMCArICdweCc7XG4gIH1cblxuICBoaXN0b3J5LnB1c2hTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICBpZiAodHlwZW9mIGhpc3Rvcnkub25wdXNoc3RhdGUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaGlzdG9yeS5vbnB1c2hzdGF0ZSh7c3RhdGU6IHN0YXRlfSk7XG4gICAgICB9XG4gICAgICAvLyAuLi4gd2hhdGV2ZXIgZWxzZSB5b3Ugd2FudCB0byBkb1xuICAgICAgLy8gbWF5YmUgY2FsbCBvbmhhc2hjaGFuZ2UgZS5oYW5kbGVyXG4gICAgICByZXR1cm4gcHVzaFN0YXRlLmFwcGx5KGhpc3RvcnksIGFyZ3VtZW50cyk7XG4gIH1cblxuICB3aW5kb3cub25wb3BzdGF0ZSA9IGhpc3Rvcnkub25wdXNoc3RhdGUgPSBoYW5kbGVSb3V0ZUNoYW5nZTtcblxufSkod2luZG93Lmhpc3RvcnkpO1xuIiwidmFyIG0gPSAoZnVuY3Rpb24gYXBwKHdpbmRvdywgdW5kZWZpbmVkKSB7XHJcblx0dmFyIE9CSkVDVCA9IFwiW29iamVjdCBPYmplY3RdXCIsIEFSUkFZID0gXCJbb2JqZWN0IEFycmF5XVwiLCBTVFJJTkcgPSBcIltvYmplY3QgU3RyaW5nXVwiLCBGVU5DVElPTiA9IFwiZnVuY3Rpb25cIjtcclxuXHR2YXIgdHlwZSA9IHt9LnRvU3RyaW5nO1xyXG5cdHZhciBwYXJzZXIgPSAvKD86KF58I3xcXC4pKFteI1xcLlxcW1xcXV0rKSl8KFxcWy4rP1xcXSkvZywgYXR0clBhcnNlciA9IC9cXFsoLis/KSg/Oj0oXCJ8J3wpKC4qPylcXDIpP1xcXS87XHJcblx0dmFyIHZvaWRFbGVtZW50cyA9IC9eKEFSRUF8QkFTRXxCUnxDT0x8Q09NTUFORHxFTUJFRHxIUnxJTUd8SU5QVVR8S0VZR0VOfExJTkt8TUVUQXxQQVJBTXxTT1VSQ0V8VFJBQ0t8V0JSKSQvO1xyXG5cdHZhciBub29wID0gZnVuY3Rpb24oKSB7fVxyXG5cclxuXHQvLyBjYWNoaW5nIGNvbW1vbmx5IHVzZWQgdmFyaWFibGVzXHJcblx0dmFyICRkb2N1bWVudCwgJGxvY2F0aW9uLCAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAkY2FuY2VsQW5pbWF0aW9uRnJhbWU7XHJcblxyXG5cdC8vIHNlbGYgaW52b2tpbmcgZnVuY3Rpb24gbmVlZGVkIGJlY2F1c2Ugb2YgdGhlIHdheSBtb2NrcyB3b3JrXHJcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZSh3aW5kb3cpe1xyXG5cdFx0JGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xyXG5cdFx0JGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xyXG5cdFx0JGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5jbGVhclRpbWVvdXQ7XHJcblx0XHQkcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuc2V0VGltZW91dDtcclxuXHR9XHJcblxyXG5cdGluaXRpYWxpemUod2luZG93KTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEB0eXBlZGVmIHtTdHJpbmd9IFRhZ1xyXG5cdCAqIEEgc3RyaW5nIHRoYXQgbG9va3MgbGlrZSAtPiBkaXYuY2xhc3NuYW1lI2lkW3BhcmFtPW9uZV1bcGFyYW0yPXR3b11cclxuXHQgKiBXaGljaCBkZXNjcmliZXMgYSBET00gbm9kZVxyXG5cdCAqL1xyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7VGFnfSBUaGUgRE9NIG5vZGUgdGFnXHJcblx0ICogQHBhcmFtIHtPYmplY3Q9W119IG9wdGlvbmFsIGtleS12YWx1ZSBwYWlycyB0byBiZSBtYXBwZWQgdG8gRE9NIGF0dHJzXHJcblx0ICogQHBhcmFtIHsuLi5tTm9kZT1bXX0gWmVybyBvciBtb3JlIE1pdGhyaWwgY2hpbGQgbm9kZXMuIENhbiBiZSBhbiBhcnJheSwgb3Igc3BsYXQgKG9wdGlvbmFsKVxyXG5cdCAqXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gbSgpIHtcclxuXHRcdHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cdFx0dmFyIGhhc0F0dHJzID0gYXJnc1sxXSAhPSBudWxsICYmIHR5cGUuY2FsbChhcmdzWzFdKSA9PT0gT0JKRUNUICYmICEoXCJ0YWdcIiBpbiBhcmdzWzFdIHx8IFwidmlld1wiIGluIGFyZ3NbMV0pICYmICEoXCJzdWJ0cmVlXCIgaW4gYXJnc1sxXSk7XHJcblx0XHR2YXIgYXR0cnMgPSBoYXNBdHRycyA/IGFyZ3NbMV0gOiB7fTtcclxuXHRcdHZhciBjbGFzc0F0dHJOYW1lID0gXCJjbGFzc1wiIGluIGF0dHJzID8gXCJjbGFzc1wiIDogXCJjbGFzc05hbWVcIjtcclxuXHRcdHZhciBjZWxsID0ge3RhZzogXCJkaXZcIiwgYXR0cnM6IHt9fTtcclxuXHRcdHZhciBtYXRjaCwgY2xhc3NlcyA9IFtdO1xyXG5cdFx0aWYgKHR5cGUuY2FsbChhcmdzWzBdKSAhPSBTVFJJTkcpIHRocm93IG5ldyBFcnJvcihcInNlbGVjdG9yIGluIG0oc2VsZWN0b3IsIGF0dHJzLCBjaGlsZHJlbikgc2hvdWxkIGJlIGEgc3RyaW5nXCIpXHJcblx0XHR3aGlsZSAobWF0Y2ggPSBwYXJzZXIuZXhlYyhhcmdzWzBdKSkge1xyXG5cdFx0XHRpZiAobWF0Y2hbMV0gPT09IFwiXCIgJiYgbWF0Y2hbMl0pIGNlbGwudGFnID0gbWF0Y2hbMl07XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzFdID09PSBcIiNcIikgY2VsbC5hdHRycy5pZCA9IG1hdGNoWzJdO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIuXCIpIGNsYXNzZXMucHVzaChtYXRjaFsyXSk7XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzNdWzBdID09PSBcIltcIikge1xyXG5cdFx0XHRcdHZhciBwYWlyID0gYXR0clBhcnNlci5leGVjKG1hdGNoWzNdKTtcclxuXHRcdFx0XHRjZWxsLmF0dHJzW3BhaXJbMV1dID0gcGFpclszXSB8fCAocGFpclsyXSA/IFwiXCIgOnRydWUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hpbGRyZW4gPSBoYXNBdHRycyA/IGFyZ3Muc2xpY2UoMikgOiBhcmdzLnNsaWNlKDEpO1xyXG5cdFx0aWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiB0eXBlLmNhbGwoY2hpbGRyZW5bMF0pID09PSBBUlJBWSkge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW5bMF1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW5cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgYXR0ck5hbWUgaW4gYXR0cnMpIHtcclxuXHRcdFx0aWYgKGF0dHJzLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkge1xyXG5cdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gY2xhc3NBdHRyTmFtZSAmJiBhdHRyc1thdHRyTmFtZV0gIT0gbnVsbCAmJiBhdHRyc1thdHRyTmFtZV0gIT09IFwiXCIpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChhdHRyc1thdHRyTmFtZV0pXHJcblx0XHRcdFx0XHRjZWxsLmF0dHJzW2F0dHJOYW1lXSA9IFwiXCIgLy9jcmVhdGUga2V5IGluIGNvcnJlY3QgaXRlcmF0aW9uIG9yZGVyXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgY2VsbC5hdHRyc1thdHRyTmFtZV0gPSBhdHRyc1thdHRyTmFtZV1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKGNsYXNzZXMubGVuZ3RoID4gMCkgY2VsbC5hdHRyc1tjbGFzc0F0dHJOYW1lXSA9IGNsYXNzZXMuam9pbihcIiBcIik7XHJcblx0XHRcclxuXHRcdHJldHVybiBjZWxsXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgcGFyZW50Q2FjaGUsIHBhcmVudEluZGV4LCBkYXRhLCBjYWNoZWQsIHNob3VsZFJlYXR0YWNoLCBpbmRleCwgZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncykge1xyXG5cdFx0Ly9gYnVpbGRgIGlzIGEgcmVjdXJzaXZlIGZ1bmN0aW9uIHRoYXQgbWFuYWdlcyBjcmVhdGlvbi9kaWZmaW5nL3JlbW92YWwgb2YgRE9NIGVsZW1lbnRzIGJhc2VkIG9uIGNvbXBhcmlzb24gYmV0d2VlbiBgZGF0YWAgYW5kIGBjYWNoZWRgXHJcblx0XHQvL3RoZSBkaWZmIGFsZ29yaXRobSBjYW4gYmUgc3VtbWFyaXplZCBhcyB0aGlzOlxyXG5cdFx0Ly8xIC0gY29tcGFyZSBgZGF0YWAgYW5kIGBjYWNoZWRgXHJcblx0XHQvLzIgLSBpZiB0aGV5IGFyZSBkaWZmZXJlbnQsIGNvcHkgYGRhdGFgIHRvIGBjYWNoZWRgIGFuZCB1cGRhdGUgdGhlIERPTSBiYXNlZCBvbiB3aGF0IHRoZSBkaWZmZXJlbmNlIGlzXHJcblx0XHQvLzMgLSByZWN1cnNpdmVseSBhcHBseSB0aGlzIGFsZ29yaXRobSBmb3IgZXZlcnkgYXJyYXkgYW5kIGZvciB0aGUgY2hpbGRyZW4gb2YgZXZlcnkgdmlydHVhbCBlbGVtZW50XHJcblxyXG5cdFx0Ly90aGUgYGNhY2hlZGAgZGF0YSBzdHJ1Y3R1cmUgaXMgZXNzZW50aWFsbHkgdGhlIHNhbWUgYXMgdGhlIHByZXZpb3VzIHJlZHJhdydzIGBkYXRhYCBkYXRhIHN0cnVjdHVyZSwgd2l0aCBhIGZldyBhZGRpdGlvbnM6XHJcblx0XHQvLy0gYGNhY2hlZGAgYWx3YXlzIGhhcyBhIHByb3BlcnR5IGNhbGxlZCBgbm9kZXNgLCB3aGljaCBpcyBhIGxpc3Qgb2YgRE9NIGVsZW1lbnRzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUgZGF0YSByZXByZXNlbnRlZCBieSB0aGUgcmVzcGVjdGl2ZSB2aXJ0dWFsIGVsZW1lbnRcclxuXHRcdC8vLSBpbiBvcmRlciB0byBzdXBwb3J0IGF0dGFjaGluZyBgbm9kZXNgIGFzIGEgcHJvcGVydHkgb2YgYGNhY2hlZGAsIGBjYWNoZWRgIGlzICphbHdheXMqIGEgbm9uLXByaW1pdGl2ZSBvYmplY3QsIGkuZS4gaWYgdGhlIGRhdGEgd2FzIGEgc3RyaW5nLCB0aGVuIGNhY2hlZCBpcyBhIFN0cmluZyBpbnN0YW5jZS4gSWYgZGF0YSB3YXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLCBjYWNoZWQgaXMgYG5ldyBTdHJpbmcoXCJcIilgXHJcblx0XHQvLy0gYGNhY2hlZCBhbHNvIGhhcyBhIGBjb25maWdDb250ZXh0YCBwcm9wZXJ0eSwgd2hpY2ggaXMgdGhlIHN0YXRlIHN0b3JhZ2Ugb2JqZWN0IGV4cG9zZWQgYnkgY29uZmlnKGVsZW1lbnQsIGlzSW5pdGlhbGl6ZWQsIGNvbnRleHQpXHJcblx0XHQvLy0gd2hlbiBgY2FjaGVkYCBpcyBhbiBPYmplY3QsIGl0IHJlcHJlc2VudHMgYSB2aXJ0dWFsIGVsZW1lbnQ7IHdoZW4gaXQncyBhbiBBcnJheSwgaXQgcmVwcmVzZW50cyBhIGxpc3Qgb2YgZWxlbWVudHM7IHdoZW4gaXQncyBhIFN0cmluZywgTnVtYmVyIG9yIEJvb2xlYW4sIGl0IHJlcHJlc2VudHMgYSB0ZXh0IG5vZGVcclxuXHJcblx0XHQvL2BwYXJlbnRFbGVtZW50YCBpcyBhIERPTSBlbGVtZW50IHVzZWQgZm9yIFczQyBET00gQVBJIGNhbGxzXHJcblx0XHQvL2BwYXJlbnRUYWdgIGlzIG9ubHkgdXNlZCBmb3IgaGFuZGxpbmcgYSBjb3JuZXIgY2FzZSBmb3IgdGV4dGFyZWEgdmFsdWVzXHJcblx0XHQvL2BwYXJlbnRDYWNoZWAgaXMgdXNlZCB0byByZW1vdmUgbm9kZXMgaW4gc29tZSBtdWx0aS1ub2RlIGNhc2VzXHJcblx0XHQvL2BwYXJlbnRJbmRleGAgYW5kIGBpbmRleGAgYXJlIHVzZWQgdG8gZmlndXJlIG91dCB0aGUgb2Zmc2V0IG9mIG5vZGVzLiBUaGV5J3JlIGFydGlmYWN0cyBmcm9tIGJlZm9yZSBhcnJheXMgc3RhcnRlZCBiZWluZyBmbGF0dGVuZWQgYW5kIGFyZSBsaWtlbHkgcmVmYWN0b3JhYmxlXHJcblx0XHQvL2BkYXRhYCBhbmQgYGNhY2hlZGAgYXJlLCByZXNwZWN0aXZlbHksIHRoZSBuZXcgYW5kIG9sZCBub2RlcyBiZWluZyBkaWZmZWRcclxuXHRcdC8vYHNob3VsZFJlYXR0YWNoYCBpcyBhIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIGEgcGFyZW50IG5vZGUgd2FzIHJlY3JlYXRlZCAoaWYgc28sIGFuZCBpZiB0aGlzIG5vZGUgaXMgcmV1c2VkLCB0aGVuIHRoaXMgbm9kZSBtdXN0IHJlYXR0YWNoIGl0c2VsZiB0byB0aGUgbmV3IHBhcmVudClcclxuXHRcdC8vYGVkaXRhYmxlYCBpcyBhIGZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBhbiBhbmNlc3RvciBpcyBjb250ZW50ZWRpdGFibGVcclxuXHRcdC8vYG5hbWVzcGFjZWAgaW5kaWNhdGVzIHRoZSBjbG9zZXN0IEhUTUwgbmFtZXNwYWNlIGFzIGl0IGNhc2NhZGVzIGRvd24gZnJvbSBhbiBhbmNlc3RvclxyXG5cdFx0Ly9gY29uZmlnc2AgaXMgYSBsaXN0IG9mIGNvbmZpZyBmdW5jdGlvbnMgdG8gcnVuIGFmdGVyIHRoZSB0b3Btb3N0IGBidWlsZGAgY2FsbCBmaW5pc2hlcyBydW5uaW5nXHJcblxyXG5cdFx0Ly90aGVyZSdzIGxvZ2ljIHRoYXQgcmVsaWVzIG9uIHRoZSBhc3N1bXB0aW9uIHRoYXQgbnVsbCBhbmQgdW5kZWZpbmVkIGRhdGEgYXJlIGVxdWl2YWxlbnQgdG8gZW1wdHkgc3RyaW5nc1xyXG5cdFx0Ly8tIHRoaXMgcHJldmVudHMgbGlmZWN5Y2xlIHN1cnByaXNlcyBmcm9tIHByb2NlZHVyYWwgaGVscGVycyB0aGF0IG1peCBpbXBsaWNpdCBhbmQgZXhwbGljaXQgcmV0dXJuIHN0YXRlbWVudHMgKGUuZy4gZnVuY3Rpb24gZm9vKCkge2lmIChjb25kKSByZXR1cm4gbShcImRpdlwiKX1cclxuXHRcdC8vLSBpdCBzaW1wbGlmaWVzIGRpZmZpbmcgY29kZVxyXG5cdFx0Ly9kYXRhLnRvU3RyaW5nKCkgbWlnaHQgdGhyb3cgb3IgcmV0dXJuIG51bGwgaWYgZGF0YSBpcyB0aGUgcmV0dXJuIHZhbHVlIG9mIENvbnNvbGUubG9nIGluIEZpcmVmb3ggKGJlaGF2aW9yIGRlcGVuZHMgb24gdmVyc2lvbilcclxuXHRcdHRyeSB7aWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhLnRvU3RyaW5nKCkgPT0gbnVsbCkgZGF0YSA9IFwiXCI7fSBjYXRjaCAoZSkge2RhdGEgPSBcIlwifVxyXG5cdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZDtcclxuXHRcdHZhciBjYWNoZWRUeXBlID0gdHlwZS5jYWxsKGNhY2hlZCksIGRhdGFUeXBlID0gdHlwZS5jYWxsKGRhdGEpO1xyXG5cdFx0aWYgKGNhY2hlZCA9PSBudWxsIHx8IGNhY2hlZFR5cGUgIT09IGRhdGFUeXBlKSB7XHJcblx0XHRcdGlmIChjYWNoZWQgIT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChwYXJlbnRDYWNoZSAmJiBwYXJlbnRDYWNoZS5ub2Rlcykge1xyXG5cdFx0XHRcdFx0dmFyIG9mZnNldCA9IGluZGV4IC0gcGFyZW50SW5kZXg7XHJcblx0XHRcdFx0XHR2YXIgZW5kID0gb2Zmc2V0ICsgKGRhdGFUeXBlID09PSBBUlJBWSA/IGRhdGEgOiBjYWNoZWQubm9kZXMpLmxlbmd0aDtcclxuXHRcdFx0XHRcdGNsZWFyKHBhcmVudENhY2hlLm5vZGVzLnNsaWNlKG9mZnNldCwgZW5kKSwgcGFyZW50Q2FjaGUuc2xpY2Uob2Zmc2V0LCBlbmQpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChjYWNoZWQubm9kZXMpIGNsZWFyKGNhY2hlZC5ub2RlcywgY2FjaGVkKVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yO1xyXG5cdFx0XHRpZiAoY2FjaGVkLnRhZykgY2FjaGVkID0ge307IC8vaWYgY29uc3RydWN0b3IgY3JlYXRlcyBhIHZpcnR1YWwgZG9tIGVsZW1lbnQsIHVzZSBhIGJsYW5rIG9iamVjdCBhcyB0aGUgYmFzZSBjYWNoZWQgbm9kZSBpbnN0ZWFkIG9mIGNvcHlpbmcgdGhlIHZpcnR1YWwgZWwgKCMyNzcpXHJcblx0XHRcdGNhY2hlZC5ub2RlcyA9IFtdXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRhdGFUeXBlID09PSBBUlJBWSkge1xyXG5cdFx0XHQvL3JlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRpZiAodHlwZS5jYWxsKGRhdGFbaV0pID09PSBBUlJBWSkge1xyXG5cdFx0XHRcdFx0ZGF0YSA9IGRhdGEuY29uY2F0LmFwcGx5KFtdLCBkYXRhKTtcclxuXHRcdFx0XHRcdGktLSAvL2NoZWNrIGN1cnJlbnQgaW5kZXggYWdhaW4gYW5kIGZsYXR0ZW4gdW50aWwgdGhlcmUgYXJlIG5vIG1vcmUgbmVzdGVkIGFycmF5cyBhdCB0aGF0IGluZGV4XHJcblx0XHRcdFx0XHRsZW4gPSBkYXRhLmxlbmd0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG5vZGVzID0gW10sIGludGFjdCA9IGNhY2hlZC5sZW5ndGggPT09IGRhdGEubGVuZ3RoLCBzdWJBcnJheUNvdW50ID0gMDtcclxuXHJcblx0XHRcdC8va2V5cyBhbGdvcml0aG06IHNvcnQgZWxlbWVudHMgd2l0aG91dCByZWNyZWF0aW5nIHRoZW0gaWYga2V5cyBhcmUgcHJlc2VudFxyXG5cdFx0XHQvLzEpIGNyZWF0ZSBhIG1hcCBvZiBhbGwgZXhpc3Rpbmcga2V5cywgYW5kIG1hcmsgYWxsIGZvciBkZWxldGlvblxyXG5cdFx0XHQvLzIpIGFkZCBuZXcga2V5cyB0byBtYXAgYW5kIG1hcmsgdGhlbSBmb3IgYWRkaXRpb25cclxuXHRcdFx0Ly8zKSBpZiBrZXkgZXhpc3RzIGluIG5ldyBsaXN0LCBjaGFuZ2UgYWN0aW9uIGZyb20gZGVsZXRpb24gdG8gYSBtb3ZlXHJcblx0XHRcdC8vNCkgZm9yIGVhY2gga2V5LCBoYW5kbGUgaXRzIGNvcnJlc3BvbmRpbmcgYWN0aW9uIGFzIG1hcmtlZCBpbiBwcmV2aW91cyBzdGVwc1xyXG5cdFx0XHR2YXIgREVMRVRJT04gPSAxLCBJTlNFUlRJT04gPSAyICwgTU9WRSA9IDM7XHJcblx0XHRcdHZhciBleGlzdGluZyA9IHt9LCBzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSBmYWxzZTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjYWNoZWQubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoY2FjaGVkW2ldICYmIGNhY2hlZFtpXS5hdHRycyAmJiBjYWNoZWRbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IHRydWU7XHJcblx0XHRcdFx0XHRleGlzdGluZ1tjYWNoZWRbaV0uYXR0cnMua2V5XSA9IHthY3Rpb246IERFTEVUSU9OLCBpbmRleDogaX1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHZhciBndWlkID0gMFxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdGlmIChkYXRhW2ldICYmIGRhdGFbaV0uYXR0cnMgJiYgZGF0YVtpXS5hdHRycy5rZXkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGRhdGFbal0gJiYgZGF0YVtqXS5hdHRycyAmJiBkYXRhW2pdLmF0dHJzLmtleSA9PSBudWxsKSBkYXRhW2pdLmF0dHJzLmtleSA9IFwiX19taXRocmlsX19cIiArIGd1aWQrK1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmIChzaG91bGRNYWludGFpbklkZW50aXRpZXMpIHtcclxuXHRcdFx0XHR2YXIga2V5c0RpZmZlciA9IGZhbHNlXHJcblx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoICE9IGNhY2hlZC5sZW5ndGgpIGtleXNEaWZmZXIgPSB0cnVlXHJcblx0XHRcdFx0ZWxzZSBmb3IgKHZhciBpID0gMCwgY2FjaGVkQ2VsbCwgZGF0YUNlbGw7IGNhY2hlZENlbGwgPSBjYWNoZWRbaV0sIGRhdGFDZWxsID0gZGF0YVtpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoY2FjaGVkQ2VsbC5hdHRycyAmJiBkYXRhQ2VsbC5hdHRycyAmJiBjYWNoZWRDZWxsLmF0dHJzLmtleSAhPSBkYXRhQ2VsbC5hdHRycy5rZXkpIHtcclxuXHRcdFx0XHRcdFx0a2V5c0RpZmZlciA9IHRydWVcclxuXHRcdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGtleXNEaWZmZXIpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2ldICYmIGRhdGFbaV0uYXR0cnMpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5hdHRycy5rZXkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGtleSA9IGRhdGFbaV0uYXR0cnMua2V5O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFleGlzdGluZ1trZXldKSBleGlzdGluZ1trZXldID0ge2FjdGlvbjogSU5TRVJUSU9OLCBpbmRleDogaX07XHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGV4aXN0aW5nW2tleV0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGFjdGlvbjogTU9WRSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aW5kZXg6IGksXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZyb206IGV4aXN0aW5nW2tleV0uaW5kZXgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQ6IGNhY2hlZC5ub2Rlc1tleGlzdGluZ1trZXldLmluZGV4XSB8fCAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIGFjdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgcHJvcCBpbiBleGlzdGluZykgYWN0aW9ucy5wdXNoKGV4aXN0aW5nW3Byb3BdKVxyXG5cdFx0XHRcdFx0dmFyIGNoYW5nZXMgPSBhY3Rpb25zLnNvcnQoc29ydENoYW5nZXMpO1xyXG5cdFx0XHRcdFx0dmFyIG5ld0NhY2hlZCA9IG5ldyBBcnJheShjYWNoZWQubGVuZ3RoKVxyXG5cdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzID0gY2FjaGVkLm5vZGVzLnNsaWNlKClcclxuXHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY2hhbmdlOyBjaGFuZ2UgPSBjaGFuZ2VzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IERFTEVUSU9OKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2xlYXIoY2FjaGVkW2NoYW5nZS5pbmRleF0ubm9kZXMsIGNhY2hlZFtjaGFuZ2UuaW5kZXhdKTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGNoYW5nZS5pbmRleCwgMSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gSU5TRVJUSU9OKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGR1bW15ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblx0XHRcdFx0XHRcdFx0ZHVtbXkua2V5ID0gZGF0YVtjaGFuZ2UuaW5kZXhdLmF0dHJzLmtleTtcclxuXHRcdFx0XHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShkdW1teSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2NoYW5nZS5pbmRleF0gfHwgbnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShjaGFuZ2UuaW5kZXgsIDAsIHthdHRyczoge2tleTogZGF0YVtjaGFuZ2UuaW5kZXhdLmF0dHJzLmtleX0sIG5vZGVzOiBbZHVtbXldfSlcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbY2hhbmdlLmluZGV4XSA9IGR1bW15XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBNT1ZFKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdICE9PSBjaGFuZ2UuZWxlbWVudCAmJiBjaGFuZ2UuZWxlbWVudCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY2hhbmdlLmVsZW1lbnQsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZFtjaGFuZ2UuaW5kZXhdID0gY2FjaGVkW2NoYW5nZS5mcm9tXVxyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tjaGFuZ2UuaW5kZXhdID0gY2hhbmdlLmVsZW1lbnRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2FjaGVkID0gbmV3Q2FjaGVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvL2VuZCBrZXkgYWxnb3JpdGhtXHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgY2FjaGVDb3VudCA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHQvL2RpZmYgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxyXG5cdFx0XHRcdHZhciBpdGVtID0gYnVpbGQocGFyZW50RWxlbWVudCwgcGFyZW50VGFnLCBjYWNoZWQsIGluZGV4LCBkYXRhW2ldLCBjYWNoZWRbY2FjaGVDb3VudF0sIHNob3VsZFJlYXR0YWNoLCBpbmRleCArIHN1YkFycmF5Q291bnQgfHwgc3ViQXJyYXlDb3VudCwgZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncyk7XHJcblx0XHRcdFx0aWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblx0XHRcdFx0aWYgKCFpdGVtLm5vZGVzLmludGFjdCkgaW50YWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKGl0ZW0uJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdC8vZml4IG9mZnNldCBvZiBuZXh0IGVsZW1lbnQgaWYgaXRlbSB3YXMgYSB0cnVzdGVkIHN0cmluZyB3LyBtb3JlIHRoYW4gb25lIGh0bWwgZWxlbWVudFxyXG5cdFx0XHRcdFx0Ly90aGUgZmlyc3QgY2xhdXNlIGluIHRoZSByZWdleHAgbWF0Y2hlcyBlbGVtZW50c1xyXG5cdFx0XHRcdFx0Ly90aGUgc2Vjb25kIGNsYXVzZSAoYWZ0ZXIgdGhlIHBpcGUpIG1hdGNoZXMgdGV4dCBub2Rlc1xyXG5cdFx0XHRcdFx0c3ViQXJyYXlDb3VudCArPSAoaXRlbS5tYXRjaCgvPFteXFwvXXxcXD5cXHMqW148XS9nKSB8fCBbMF0pLmxlbmd0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHN1YkFycmF5Q291bnQgKz0gdHlwZS5jYWxsKGl0ZW0pID09PSBBUlJBWSA/IGl0ZW0ubGVuZ3RoIDogMTtcclxuXHRcdFx0XHRjYWNoZWRbY2FjaGVDb3VudCsrXSA9IGl0ZW1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWludGFjdCkge1xyXG5cdFx0XHRcdC8vZGlmZiB0aGUgYXJyYXkgaXRzZWxmXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly91cGRhdGUgdGhlIGxpc3Qgb2YgRE9NIG5vZGVzIGJ5IGNvbGxlY3RpbmcgdGhlIG5vZGVzIGZyb20gZWFjaCBpdGVtXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChjYWNoZWRbaV0gIT0gbnVsbCkgbm9kZXMucHVzaC5hcHBseShub2RlcywgY2FjaGVkW2ldLm5vZGVzKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL3JlbW92ZSBpdGVtcyBmcm9tIHRoZSBlbmQgb2YgdGhlIGFycmF5IGlmIHRoZSBuZXcgYXJyYXkgaXMgc2hvcnRlciB0aGFuIHRoZSBvbGQgb25lXHJcblx0XHRcdFx0Ly9pZiBlcnJvcnMgZXZlciBoYXBwZW4gaGVyZSwgdGhlIGlzc3VlIGlzIG1vc3QgbGlrZWx5IGEgYnVnIGluIHRoZSBjb25zdHJ1Y3Rpb24gb2YgdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIHNvbWV3aGVyZSBlYXJsaWVyIGluIHRoZSBwcm9ncmFtXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG5vZGU7IG5vZGUgPSBjYWNoZWQubm9kZXNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKG5vZGUucGFyZW50Tm9kZSAhPSBudWxsICYmIG5vZGVzLmluZGV4T2Yobm9kZSkgPCAwKSBjbGVhcihbbm9kZV0sIFtjYWNoZWRbaV1dKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPCBjYWNoZWQubGVuZ3RoKSBjYWNoZWQubGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YSAhPSBudWxsICYmIGRhdGFUeXBlID09PSBPQkpFQ1QpIHtcclxuXHRcdFx0dmFyIHZpZXdzID0gW10sIGNvbnRyb2xsZXJzID0gW11cclxuXHRcdFx0d2hpbGUgKGRhdGEudmlldykge1xyXG5cdFx0XHRcdHZhciB2aWV3ID0gZGF0YS52aWV3LiRvcmlnaW5hbCB8fCBkYXRhLnZpZXdcclxuXHRcdFx0XHR2YXIgY29udHJvbGxlckluZGV4ID0gbS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcImRpZmZcIiAmJiBjYWNoZWQudmlld3MgPyBjYWNoZWQudmlld3MuaW5kZXhPZih2aWV3KSA6IC0xXHJcblx0XHRcdFx0dmFyIGNvbnRyb2xsZXIgPSBjb250cm9sbGVySW5kZXggPiAtMSA/IGNhY2hlZC5jb250cm9sbGVyc1tjb250cm9sbGVySW5kZXhdIDogbmV3IChkYXRhLmNvbnRyb2xsZXIgfHwgbm9vcClcclxuXHRcdFx0XHR2YXIga2V5ID0gZGF0YSAmJiBkYXRhLmF0dHJzICYmIGRhdGEuYXR0cnMua2V5XHJcblx0XHRcdFx0ZGF0YSA9IHBlbmRpbmdSZXF1ZXN0cyA9PSAwIHx8IChjYWNoZWQgJiYgY2FjaGVkLmNvbnRyb2xsZXJzICYmIGNhY2hlZC5jb250cm9sbGVycy5pbmRleE9mKGNvbnRyb2xsZXIpID4gLTEpID8gZGF0YS52aWV3KGNvbnRyb2xsZXIpIDoge3RhZzogXCJwbGFjZWhvbGRlclwifVxyXG5cdFx0XHRcdGlmIChkYXRhLnN1YnRyZWUgPT09IFwicmV0YWluXCIpIHJldHVybiBjYWNoZWQ7XHJcblx0XHRcdFx0aWYgKGtleSkge1xyXG5cdFx0XHRcdFx0aWYgKCFkYXRhLmF0dHJzKSBkYXRhLmF0dHJzID0ge31cclxuXHRcdFx0XHRcdGRhdGEuYXR0cnMua2V5ID0ga2V5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChjb250cm9sbGVyLm9udW5sb2FkKSB1bmxvYWRlcnMucHVzaCh7Y29udHJvbGxlcjogY29udHJvbGxlciwgaGFuZGxlcjogY29udHJvbGxlci5vbnVubG9hZH0pXHJcblx0XHRcdFx0dmlld3MucHVzaCh2aWV3KVxyXG5cdFx0XHRcdGNvbnRyb2xsZXJzLnB1c2goY29udHJvbGxlcilcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWRhdGEudGFnICYmIGNvbnRyb2xsZXJzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHRlbXBsYXRlIG11c3QgcmV0dXJuIGEgdmlydHVhbCBlbGVtZW50LCBub3QgYW4gYXJyYXksIHN0cmluZywgZXRjLlwiKVxyXG5cdFx0XHRpZiAoIWRhdGEuYXR0cnMpIGRhdGEuYXR0cnMgPSB7fTtcclxuXHRcdFx0aWYgKCFjYWNoZWQuYXR0cnMpIGNhY2hlZC5hdHRycyA9IHt9O1xyXG5cclxuXHRcdFx0dmFyIGRhdGFBdHRyS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuYXR0cnMpXHJcblx0XHRcdHZhciBoYXNLZXlzID0gZGF0YUF0dHJLZXlzLmxlbmd0aCA+IChcImtleVwiIGluIGRhdGEuYXR0cnMgPyAxIDogMClcclxuXHRcdFx0Ly9pZiBhbiBlbGVtZW50IGlzIGRpZmZlcmVudCBlbm91Z2ggZnJvbSB0aGUgb25lIGluIGNhY2hlLCByZWNyZWF0ZSBpdFxyXG5cdFx0XHRpZiAoZGF0YS50YWcgIT0gY2FjaGVkLnRhZyB8fCBkYXRhQXR0cktleXMuc29ydCgpLmpvaW4oKSAhPSBPYmplY3Qua2V5cyhjYWNoZWQuYXR0cnMpLnNvcnQoKS5qb2luKCkgfHwgZGF0YS5hdHRycy5pZCAhPSBjYWNoZWQuYXR0cnMuaWQgfHwgZGF0YS5hdHRycy5rZXkgIT0gY2FjaGVkLmF0dHJzLmtleSB8fCAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcImFsbFwiICYmICghY2FjaGVkLmNvbmZpZ0NvbnRleHQgfHwgY2FjaGVkLmNvbmZpZ0NvbnRleHQucmV0YWluICE9PSB0cnVlKSkgfHwgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJkaWZmXCIgJiYgY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgY2FjaGVkLmNvbmZpZ0NvbnRleHQucmV0YWluID09PSBmYWxzZSkpIHtcclxuXHRcdFx0XHRpZiAoY2FjaGVkLm5vZGVzLmxlbmd0aCkgY2xlYXIoY2FjaGVkLm5vZGVzKTtcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgdHlwZW9mIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID09PSBGVU5DVElPTikgY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQoKVxyXG5cdFx0XHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY2FjaGVkLmNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb250cm9sbGVyLm9udW5sb2FkID09PSBGVU5DVElPTikgY29udHJvbGxlci5vbnVubG9hZCh7cHJldmVudERlZmF1bHQ6IG5vb3B9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGRhdGEudGFnKSAhPSBTVFJJTkcpIHJldHVybjtcclxuXHJcblx0XHRcdHZhciBub2RlLCBpc05ldyA9IGNhY2hlZC5ub2Rlcy5sZW5ndGggPT09IDA7XHJcblx0XHRcdGlmIChkYXRhLmF0dHJzLnhtbG5zKSBuYW1lc3BhY2UgPSBkYXRhLmF0dHJzLnhtbG5zO1xyXG5cdFx0XHRlbHNlIGlmIChkYXRhLnRhZyA9PT0gXCJzdmdcIikgbmFtZXNwYWNlID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xyXG5cdFx0XHRlbHNlIGlmIChkYXRhLnRhZyA9PT0gXCJtYXRoXCIpIG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGlzTmV3KSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuYXR0cnMuaXMpIG5vZGUgPSBuYW1lc3BhY2UgPT09IHVuZGVmaW5lZCA/ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnLCBkYXRhLmF0dHJzLmlzKSA6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZywgZGF0YS5hdHRycy5pcyk7XHJcblx0XHRcdFx0ZWxzZSBub2RlID0gbmFtZXNwYWNlID09PSB1bmRlZmluZWQgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZykgOiAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcpO1xyXG5cdFx0XHRcdGNhY2hlZCA9IHtcclxuXHRcdFx0XHRcdHRhZzogZGF0YS50YWcsXHJcblx0XHRcdFx0XHQvL3NldCBhdHRyaWJ1dGVzIGZpcnN0LCB0aGVuIGNyZWF0ZSBjaGlsZHJlblxyXG5cdFx0XHRcdFx0YXR0cnM6IGhhc0tleXMgPyBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCB7fSwgbmFtZXNwYWNlKSA6IGRhdGEuYXR0cnMsXHJcblx0XHRcdFx0XHRjaGlsZHJlbjogZGF0YS5jaGlsZHJlbiAhPSBudWxsICYmIGRhdGEuY2hpbGRyZW4ubGVuZ3RoID4gMCA/XHJcblx0XHRcdFx0XHRcdGJ1aWxkKG5vZGUsIGRhdGEudGFnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZGF0YS5jaGlsZHJlbiwgY2FjaGVkLmNoaWxkcmVuLCB0cnVlLCAwLCBkYXRhLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA/IG5vZGUgOiBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKSA6XHJcblx0XHRcdFx0XHRcdGRhdGEuY2hpbGRyZW4sXHJcblx0XHRcdFx0XHRub2RlczogW25vZGVdXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnNcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoY29udHJvbGxlci5vbnVubG9hZCAmJiBjb250cm9sbGVyLm9udW5sb2FkLiRvbGQpIGNvbnRyb2xsZXIub251bmxvYWQgPSBjb250cm9sbGVyLm9udW5sb2FkLiRvbGRcclxuXHRcdFx0XHRcdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyAmJiBjb250cm9sbGVyLm9udW5sb2FkKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZFxyXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQgPSBub29wXHJcblx0XHRcdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZC4kb2xkID0gb251bmxvYWRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNoaWxkcmVuICYmICFjYWNoZWQuY2hpbGRyZW4ubm9kZXMpIGNhY2hlZC5jaGlsZHJlbi5ub2RlcyA9IFtdO1xyXG5cdFx0XHRcdC8vZWRnZSBjYXNlOiBzZXR0aW5nIHZhbHVlIG9uIDxzZWxlY3Q+IGRvZXNuJ3Qgd29yayBiZWZvcmUgY2hpbGRyZW4gZXhpc3QsIHNvIHNldCBpdCBhZ2FpbiBhZnRlciBjaGlsZHJlbiBoYXZlIGJlZW4gY3JlYXRlZFxyXG5cdFx0XHRcdGlmIChkYXRhLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiBcInZhbHVlXCIgaW4gZGF0YS5hdHRycykgc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywge3ZhbHVlOiBkYXRhLmF0dHJzLnZhbHVlfSwge30sIG5hbWVzcGFjZSk7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdG5vZGUgPSBjYWNoZWQubm9kZXNbMF07XHJcblx0XHRcdFx0aWYgKGhhc0tleXMpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIGNhY2hlZC5hdHRycywgbmFtZXNwYWNlKTtcclxuXHRcdFx0XHRjYWNoZWQuY2hpbGRyZW4gPSBidWlsZChub2RlLCBkYXRhLnRhZywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGRhdGEuY2hpbGRyZW4sIGNhY2hlZC5jaGlsZHJlbiwgZmFsc2UsIDAsIGRhdGEuYXR0cnMuY29udGVudGVkaXRhYmxlID8gbm9kZSA6IGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2Rlcy5pbnRhY3QgPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChjb250cm9sbGVycy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNhY2hlZC52aWV3cyA9IHZpZXdzXHJcblx0XHRcdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVyc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoc2hvdWxkUmVhdHRhY2ggPT09IHRydWUgJiYgbm9kZSAhPSBudWxsKSBwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdH1cclxuXHRcdFx0Ly9zY2hlZHVsZSBjb25maWdzIHRvIGJlIGNhbGxlZC4gVGhleSBhcmUgY2FsbGVkIGFmdGVyIGBidWlsZGAgZmluaXNoZXMgcnVubmluZ1xyXG5cdFx0XHRpZiAodHlwZW9mIGRhdGEuYXR0cnNbXCJjb25maWdcIl0gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0dmFyIGNvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCA9IGNhY2hlZC5jb25maWdDb250ZXh0IHx8IHt9O1xyXG5cclxuXHRcdFx0XHQvLyBiaW5kXHJcblx0XHRcdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oZGF0YSwgYXJncykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YS5hdHRyc1tcImNvbmZpZ1wiXS5hcHBseShkYXRhLCBhcmdzKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0Y29uZmlncy5wdXNoKGNhbGxiYWNrKGRhdGEsIFtub2RlLCAhaXNOZXcsIGNvbnRleHQsIGNhY2hlZF0pKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YSAhPSBGVU5DVElPTikge1xyXG5cdFx0XHQvL2hhbmRsZSB0ZXh0IG5vZGVzXHJcblx0XHRcdHZhciBub2RlcztcclxuXHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdFx0bm9kZXMgPSBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV07XHJcblx0XHRcdFx0XHRpZiAoIXBhcmVudEVsZW1lbnQubm9kZU5hbWUubWF0Y2godm9pZEVsZW1lbnRzKSkgcGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZXNbMF0sIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FjaGVkID0gXCJzdHJpbmcgbnVtYmVyIGJvb2xlYW5cIi5pbmRleE9mKHR5cGVvZiBkYXRhKSA+IC0xID8gbmV3IGRhdGEuY29uc3RydWN0b3IoZGF0YSkgOiBkYXRhO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoY2FjaGVkLnZhbHVlT2YoKSAhPT0gZGF0YS52YWx1ZU9mKCkgfHwgc2hvdWxkUmVhdHRhY2ggPT09IHRydWUpIHtcclxuXHRcdFx0XHRub2RlcyA9IGNhY2hlZC5ub2RlcztcclxuXHRcdFx0XHRpZiAoIWVkaXRhYmxlIHx8IGVkaXRhYmxlICE9PSAkZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGRhdGEuJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdFx0Y2xlYXIobm9kZXMsIGNhY2hlZCk7XHJcblx0XHRcdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL2Nvcm5lciBjYXNlOiByZXBsYWNpbmcgdGhlIG5vZGVWYWx1ZSBvZiBhIHRleHQgbm9kZSB0aGF0IGlzIGEgY2hpbGQgb2YgYSB0ZXh0YXJlYS9jb250ZW50ZWRpdGFibGUgZG9lc24ndCB3b3JrXHJcblx0XHRcdFx0XHRcdC8vd2UgbmVlZCB0byB1cGRhdGUgdGhlIHZhbHVlIHByb3BlcnR5IG9mIHRoZSBwYXJlbnQgdGV4dGFyZWEgb3IgdGhlIGlubmVySFRNTCBvZiB0aGUgY29udGVudGVkaXRhYmxlIGVsZW1lbnQgaW5zdGVhZFxyXG5cdFx0XHRcdFx0XHRpZiAocGFyZW50VGFnID09PSBcInRleHRhcmVhXCIpIHBhcmVudEVsZW1lbnQudmFsdWUgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChlZGl0YWJsZSkgZWRpdGFibGUuaW5uZXJIVE1MID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKG5vZGVzWzBdLm5vZGVUeXBlID09PSAxIHx8IG5vZGVzLmxlbmd0aCA+IDEpIHsgLy93YXMgYSB0cnVzdGVkIHN0cmluZ1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0bm9kZXMgPSBbJGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpXVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2Rlc1swXSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKTtcclxuXHRcdFx0XHRcdFx0XHRub2Rlc1swXS5ub2RlVmFsdWUgPSBkYXRhXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FjaGVkID0gbmV3IGRhdGEuY29uc3RydWN0b3IoZGF0YSk7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGNhY2hlZC5ub2Rlcy5pbnRhY3QgPSB0cnVlXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGNhY2hlZFxyXG5cdH1cclxuXHRmdW5jdGlvbiBzb3J0Q2hhbmdlcyhhLCBiKSB7cmV0dXJuIGEuYWN0aW9uIC0gYi5hY3Rpb24gfHwgYS5pbmRleCAtIGIuaW5kZXh9XHJcblx0ZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhub2RlLCB0YWcsIGRhdGFBdHRycywgY2FjaGVkQXR0cnMsIG5hbWVzcGFjZSkge1xyXG5cdFx0Zm9yICh2YXIgYXR0ck5hbWUgaW4gZGF0YUF0dHJzKSB7XHJcblx0XHRcdHZhciBkYXRhQXR0ciA9IGRhdGFBdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdHZhciBjYWNoZWRBdHRyID0gY2FjaGVkQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHRpZiAoIShhdHRyTmFtZSBpbiBjYWNoZWRBdHRycykgfHwgKGNhY2hlZEF0dHIgIT09IGRhdGFBdHRyKSkge1xyXG5cdFx0XHRcdGNhY2hlZEF0dHJzW2F0dHJOYW1lXSA9IGRhdGFBdHRyO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvL2Bjb25maWdgIGlzbid0IGEgcmVhbCBhdHRyaWJ1dGVzLCBzbyBpZ25vcmUgaXRcclxuXHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJjb25maWdcIiB8fCBhdHRyTmFtZSA9PSBcImtleVwiKSBjb250aW51ZTtcclxuXHRcdFx0XHRcdC8vaG9vayBldmVudCBoYW5kbGVycyB0byB0aGUgYXV0by1yZWRyYXdpbmcgc3lzdGVtXHJcblx0XHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YUF0dHIgPT09IEZVTkNUSU9OICYmIGF0dHJOYW1lLmluZGV4T2YoXCJvblwiKSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRub2RlW2F0dHJOYW1lXSA9IGF1dG9yZWRyYXcoZGF0YUF0dHIsIG5vZGUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBgc3R5bGU6IHsuLi59YFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwic3R5bGVcIiAmJiBkYXRhQXR0ciAhPSBudWxsICYmIHR5cGUuY2FsbChkYXRhQXR0cikgPT09IE9CSkVDVCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBydWxlIGluIGRhdGFBdHRyKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGNhY2hlZEF0dHIgPT0gbnVsbCB8fCBjYWNoZWRBdHRyW3J1bGVdICE9PSBkYXRhQXR0cltydWxlXSkgbm9kZS5zdHlsZVtydWxlXSA9IGRhdGFBdHRyW3J1bGVdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcnVsZSBpbiBjYWNoZWRBdHRyKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCEocnVsZSBpbiBkYXRhQXR0cikpIG5vZGUuc3R5bGVbcnVsZV0gPSBcIlwiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vaGFuZGxlIFNWR1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiAobmFtZXNwYWNlICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGF0dHJOYW1lID09PSBcImhyZWZcIikgbm9kZS5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwgXCJocmVmXCIsIGRhdGFBdHRyKTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwiY2xhc3NOYW1lXCIpIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdFx0XHRlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vaGFuZGxlIGNhc2VzIHRoYXQgYXJlIHByb3BlcnRpZXMgKGJ1dCBpZ25vcmUgY2FzZXMgd2hlcmUgd2Ugc2hvdWxkIHVzZSBzZXRBdHRyaWJ1dGUgaW5zdGVhZClcclxuXHRcdFx0XHRcdC8vLSBsaXN0IGFuZCBmb3JtIGFyZSB0eXBpY2FsbHkgdXNlZCBhcyBzdHJpbmdzLCBidXQgYXJlIERPTSBlbGVtZW50IHJlZmVyZW5jZXMgaW4ganNcclxuXHRcdFx0XHRcdC8vLSB3aGVuIHVzaW5nIENTUyBzZWxlY3RvcnMgKGUuZy4gYG0oXCJbc3R5bGU9JyddXCIpYCksIHN0eWxlIGlzIHVzZWQgYXMgYSBzdHJpbmcsIGJ1dCBpdCdzIGFuIG9iamVjdCBpbiBqc1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgaW4gbm9kZSAmJiAhKGF0dHJOYW1lID09PSBcImxpc3RcIiB8fCBhdHRyTmFtZSA9PT0gXCJzdHlsZVwiIHx8IGF0dHJOYW1lID09PSBcImZvcm1cIiB8fCBhdHRyTmFtZSA9PT0gXCJ0eXBlXCIgfHwgYXR0ck5hbWUgPT09IFwid2lkdGhcIiB8fCBhdHRyTmFtZSA9PT0gXCJoZWlnaHRcIikpIHtcclxuXHRcdFx0XHRcdFx0Ly8jMzQ4IGRvbid0IHNldCB0aGUgdmFsdWUgaWYgbm90IG5lZWRlZCBvdGhlcndpc2UgY3Vyc29yIHBsYWNlbWVudCBicmVha3MgaW4gQ2hyb21lXHJcblx0XHRcdFx0XHRcdGlmICh0YWcgIT09IFwiaW5wdXRcIiB8fCBub2RlW2F0dHJOYW1lXSAhPT0gZGF0YUF0dHIpIG5vZGVbYXR0ck5hbWVdID0gZGF0YUF0dHJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGRhdGFBdHRyKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0Ly9zd2FsbG93IElFJ3MgaW52YWxpZCBhcmd1bWVudCBlcnJvcnMgdG8gbWltaWMgSFRNTCdzIGZhbGxiYWNrLXRvLWRvaW5nLW5vdGhpbmctb24taW52YWxpZC1hdHRyaWJ1dGVzIGJlaGF2aW9yXHJcblx0XHRcdFx0XHRpZiAoZS5tZXNzYWdlLmluZGV4T2YoXCJJbnZhbGlkIGFyZ3VtZW50XCIpIDwgMCkgdGhyb3cgZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyMzNDggZGF0YUF0dHIgbWF5IG5vdCBiZSBhIHN0cmluZywgc28gdXNlIGxvb3NlIGNvbXBhcmlzb24gKGRvdWJsZSBlcXVhbCkgaW5zdGVhZCBvZiBzdHJpY3QgKHRyaXBsZSBlcXVhbClcclxuXHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwidmFsdWVcIiAmJiB0YWcgPT09IFwiaW5wdXRcIiAmJiBub2RlLnZhbHVlICE9IGRhdGFBdHRyKSB7XHJcblx0XHRcdFx0bm9kZS52YWx1ZSA9IGRhdGFBdHRyXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjYWNoZWRBdHRyc1xyXG5cdH1cclxuXHRmdW5jdGlvbiBjbGVhcihub2RlcywgY2FjaGVkKSB7XHJcblx0XHRmb3IgKHZhciBpID0gbm9kZXMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcclxuXHRcdFx0aWYgKG5vZGVzW2ldICYmIG5vZGVzW2ldLnBhcmVudE5vZGUpIHtcclxuXHRcdFx0XHR0cnkge25vZGVzW2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZXNbaV0pfVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7fSAvL2lnbm9yZSBpZiB0aGlzIGZhaWxzIGR1ZSB0byBvcmRlciBvZiBldmVudHMgKHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIxOTI2MDgzL2ZhaWxlZC10by1leGVjdXRlLXJlbW92ZWNoaWxkLW9uLW5vZGUpXHJcblx0XHRcdFx0Y2FjaGVkID0gW10uY29uY2F0KGNhY2hlZCk7XHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSkgdW5sb2FkKGNhY2hlZFtpXSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKG5vZGVzLmxlbmd0aCAhPSAwKSBub2Rlcy5sZW5ndGggPSAwXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHVubG9hZChjYWNoZWQpIHtcclxuXHRcdGlmIChjYWNoZWQuY29uZmlnQ29udGV4dCAmJiB0eXBlb2YgY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKCk7XHJcblx0XHRcdGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0aWYgKGNhY2hlZC5jb250cm9sbGVycykge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNhY2hlZC5jb250cm9sbGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBjb250cm9sbGVyLm9udW5sb2FkID09PSBGVU5DVElPTikgY29udHJvbGxlci5vbnVubG9hZCh7cHJldmVudERlZmF1bHQ6IG5vb3B9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKGNhY2hlZC5jaGlsZHJlbikge1xyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGNhY2hlZC5jaGlsZHJlbikgPT09IEFSUkFZKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNhY2hlZC5jaGlsZHJlbltpXTsgaSsrKSB1bmxvYWQoY2hpbGQpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoY2FjaGVkLmNoaWxkcmVuLnRhZykgdW5sb2FkKGNhY2hlZC5jaGlsZHJlbilcclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSkge1xyXG5cdFx0dmFyIG5leHRTaWJsaW5nID0gcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XTtcclxuXHRcdGlmIChuZXh0U2libGluZykge1xyXG5cdFx0XHR2YXIgaXNFbGVtZW50ID0gbmV4dFNpYmxpbmcubm9kZVR5cGUgIT0gMTtcclxuXHRcdFx0dmFyIHBsYWNlaG9sZGVyID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cdFx0XHRpZiAoaXNFbGVtZW50KSB7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIG5leHRTaWJsaW5nIHx8IG51bGwpO1xyXG5cdFx0XHRcdHBsYWNlaG9sZGVyLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBuZXh0U2libGluZy5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmViZWdpblwiLCBkYXRhKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBwYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBkYXRhKTtcclxuXHRcdHZhciBub2RlcyA9IFtdO1xyXG5cdFx0d2hpbGUgKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gIT09IG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdG5vZGVzLnB1c2gocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRcdGluZGV4KytcclxuXHRcdH1cclxuXHRcdHJldHVybiBub2Rlc1xyXG5cdH1cclxuXHRmdW5jdGlvbiBhdXRvcmVkcmF3KGNhbGxiYWNrLCBvYmplY3QpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHR0cnkge3JldHVybiBjYWxsYmFjay5jYWxsKG9iamVjdCwgZSl9XHJcblx0XHRcdGZpbmFsbHkge1xyXG5cdFx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgaHRtbDtcclxuXHR2YXIgZG9jdW1lbnROb2RlID0ge1xyXG5cdFx0YXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdFx0aWYgKGh0bWwgPT09IHVuZGVmaW5lZCkgaHRtbCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiKTtcclxuXHRcdFx0aWYgKCRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAhPT0gbm9kZSkge1xyXG5cdFx0XHRcdCRkb2N1bWVudC5yZXBsYWNlQ2hpbGQobm9kZSwgJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlICRkb2N1bWVudC5hcHBlbmRDaGlsZChub2RlKTtcclxuXHRcdFx0dGhpcy5jaGlsZE5vZGVzID0gJGRvY3VtZW50LmNoaWxkTm9kZXNcclxuXHRcdH0sXHJcblx0XHRpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChub2RlKVxyXG5cdFx0fSxcclxuXHRcdGNoaWxkTm9kZXM6IFtdXHJcblx0fTtcclxuXHR2YXIgbm9kZUNhY2hlID0gW10sIGNlbGxDYWNoZSA9IHt9O1xyXG5cdG0ucmVuZGVyID0gZnVuY3Rpb24ocm9vdCwgY2VsbCwgZm9yY2VSZWNyZWF0aW9uKSB7XHJcblx0XHR2YXIgY29uZmlncyA9IFtdO1xyXG5cdFx0aWYgKCFyb290KSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IGJlaW5nIHBhc3NlZCB0byBtLnJvdXRlL20ubW91bnQvbS5yZW5kZXIgaXMgbm90IHVuZGVmaW5lZC5cIik7XHJcblx0XHR2YXIgaWQgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHR2YXIgaXNEb2N1bWVudFJvb3QgPSByb290ID09PSAkZG9jdW1lbnQ7XHJcblx0XHR2YXIgbm9kZSA9IGlzRG9jdW1lbnRSb290IHx8IHJvb3QgPT09ICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgPyBkb2N1bWVudE5vZGUgOiByb290O1xyXG5cdFx0aWYgKGlzRG9jdW1lbnRSb290ICYmIGNlbGwudGFnICE9IFwiaHRtbFwiKSBjZWxsID0ge3RhZzogXCJodG1sXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IGNlbGx9O1xyXG5cdFx0aWYgKGNlbGxDYWNoZVtpZF0gPT09IHVuZGVmaW5lZCkgY2xlYXIobm9kZS5jaGlsZE5vZGVzKTtcclxuXHRcdGlmIChmb3JjZVJlY3JlYXRpb24gPT09IHRydWUpIHJlc2V0KHJvb3QpO1xyXG5cdFx0Y2VsbENhY2hlW2lkXSA9IGJ1aWxkKG5vZGUsIG51bGwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjZWxsLCBjZWxsQ2FjaGVbaWRdLCBmYWxzZSwgMCwgbnVsbCwgdW5kZWZpbmVkLCBjb25maWdzKTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb25maWdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBjb25maWdzW2ldKClcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGdldENlbGxDYWNoZUtleShlbGVtZW50KSB7XHJcblx0XHR2YXIgaW5kZXggPSBub2RlQ2FjaGUuaW5kZXhPZihlbGVtZW50KTtcclxuXHRcdHJldHVybiBpbmRleCA8IDAgPyBub2RlQ2FjaGUucHVzaChlbGVtZW50KSAtIDEgOiBpbmRleFxyXG5cdH1cclxuXHJcblx0bS50cnVzdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZSA9IG5ldyBTdHJpbmcodmFsdWUpO1xyXG5cdFx0dmFsdWUuJHRydXN0ZWQgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0dGVyc2V0dGVyKHN0b3JlKSB7XHJcblx0XHR2YXIgcHJvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkgc3RvcmUgPSBhcmd1bWVudHNbMF07XHJcblx0XHRcdHJldHVybiBzdG9yZVxyXG5cdFx0fTtcclxuXHJcblx0XHRwcm9wLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gc3RvcmVcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHByb3BcclxuXHR9XHJcblxyXG5cdG0ucHJvcCA9IGZ1bmN0aW9uIChzdG9yZSkge1xyXG5cdFx0Ly9ub3RlOiB1c2luZyBub24tc3RyaWN0IGVxdWFsaXR5IGNoZWNrIGhlcmUgYmVjYXVzZSB3ZSdyZSBjaGVja2luZyBpZiBzdG9yZSBpcyBudWxsIE9SIHVuZGVmaW5lZFxyXG5cdFx0aWYgKCgoc3RvcmUgIT0gbnVsbCAmJiB0eXBlLmNhbGwoc3RvcmUpID09PSBPQkpFQ1QpIHx8IHR5cGVvZiBzdG9yZSA9PT0gRlVOQ1RJT04pICYmIHR5cGVvZiBzdG9yZS50aGVuID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShzdG9yZSlcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZ2V0dGVyc2V0dGVyKHN0b3JlKVxyXG5cdH07XHJcblxyXG5cdHZhciByb290cyA9IFtdLCBjb21wb25lbnRzID0gW10sIGNvbnRyb2xsZXJzID0gW10sIGxhc3RSZWRyYXdJZCA9IG51bGwsIGxhc3RSZWRyYXdDYWxsVGltZSA9IDAsIGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbCwgY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbCwgcHJldmVudGVkID0gZmFsc2UsIHRvcENvbXBvbmVudCwgdW5sb2FkZXJzID0gW107XHJcblx0dmFyIEZSQU1FX0JVREdFVCA9IDE2OyAvLzYwIGZyYW1lcyBwZXIgc2Vjb25kID0gMSBjYWxsIHBlciAxNiBtc1xyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIGFyZ3MpIHtcclxuXHRcdHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiAoY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcCkuYXBwbHkodGhpcywgYXJncykgfHwgdGhpc1xyXG5cdFx0fVxyXG5cdFx0dmFyIHZpZXcgPSBmdW5jdGlvbihjdHJsKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkgYXJncyA9IGFyZ3MuY29uY2F0KFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSlcclxuXHRcdFx0cmV0dXJuIGNvbXBvbmVudC52aWV3LmFwcGx5KGNvbXBvbmVudCwgYXJncyA/IFtjdHJsXS5jb25jYXQoYXJncykgOiBbY3RybF0pXHJcblx0XHR9XHJcblx0XHR2aWV3LiRvcmlnaW5hbCA9IGNvbXBvbmVudC52aWV3XHJcblx0XHR2YXIgb3V0cHV0ID0ge2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIHZpZXc6IHZpZXd9XHJcblx0XHRpZiAoYXJnc1swXSAmJiBhcmdzWzBdLmtleSAhPSBudWxsKSBvdXRwdXQuYXR0cnMgPSB7a2V5OiBhcmdzWzBdLmtleX1cclxuXHRcdHJldHVybiBvdXRwdXRcclxuXHR9XHJcblx0bS5jb21wb25lbnQgPSBmdW5jdGlvbihjb21wb25lbnQpIHtcclxuXHRcdHJldHVybiBwYXJhbWV0ZXJpemUoY29tcG9uZW50LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXHJcblx0fVxyXG5cdG0ubW91bnQgPSBtLm1vZHVsZSA9IGZ1bmN0aW9uKHJvb3QsIGNvbXBvbmVudCkge1xyXG5cdFx0aWYgKCFyb290KSB0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2UgZW5zdXJlIHRoZSBET00gZWxlbWVudCBleGlzdHMgYmVmb3JlIHJlbmRlcmluZyBhIHRlbXBsYXRlIGludG8gaXQuXCIpO1xyXG5cdFx0dmFyIGluZGV4ID0gcm9vdHMuaW5kZXhPZihyb290KTtcclxuXHRcdGlmIChpbmRleCA8IDApIGluZGV4ID0gcm9vdHMubGVuZ3RoO1xyXG5cdFx0XHJcblx0XHR2YXIgaXNQcmV2ZW50ZWQgPSBmYWxzZTtcclxuXHRcdHZhciBldmVudCA9IHtwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlzUHJldmVudGVkID0gdHJ1ZTtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsO1xyXG5cdFx0fX07XHJcblx0XHRmb3IgKHZhciBpID0gMCwgdW5sb2FkZXI7IHVubG9hZGVyID0gdW5sb2FkZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0dW5sb2FkZXIuaGFuZGxlci5jYWxsKHVubG9hZGVyLmNvbnRyb2xsZXIsIGV2ZW50KVxyXG5cdFx0XHR1bmxvYWRlci5jb250cm9sbGVyLm9udW5sb2FkID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0aWYgKGlzUHJldmVudGVkKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCB1bmxvYWRlcjsgdW5sb2FkZXIgPSB1bmxvYWRlcnNbaV07IGkrKykgdW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IHVubG9hZGVyLmhhbmRsZXJcclxuXHRcdH1cclxuXHRcdGVsc2UgdW5sb2FkZXJzID0gW11cclxuXHRcdFxyXG5cdFx0aWYgKGNvbnRyb2xsZXJzW2luZGV4XSAmJiB0eXBlb2YgY29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRjb250cm9sbGVyc1tpbmRleF0ub251bmxvYWQoZXZlbnQpXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJhbGxcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyb290c1tpbmRleF0gPSByb290O1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIGNvbXBvbmVudCA9IHN1YmNvbXBvbmVudChjb21wb25lbnQsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSlcclxuXHRcdFx0dmFyIGN1cnJlbnRDb21wb25lbnQgPSB0b3BDb21wb25lbnQgPSBjb21wb25lbnQgPSBjb21wb25lbnQgfHwge2NvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge319O1xyXG5cdFx0XHR2YXIgY29uc3RydWN0b3IgPSBjb21wb25lbnQuY29udHJvbGxlciB8fCBub29wXHJcblx0XHRcdHZhciBjb250cm9sbGVyID0gbmV3IGNvbnN0cnVjdG9yO1xyXG5cdFx0XHQvL2NvbnRyb2xsZXJzIG1heSBjYWxsIG0ubW91bnQgcmVjdXJzaXZlbHkgKHZpYSBtLnJvdXRlIHJlZGlyZWN0cywgZm9yIGV4YW1wbGUpXHJcblx0XHRcdC8vdGhpcyBjb25kaXRpb25hbCBlbnN1cmVzIG9ubHkgdGhlIGxhc3QgcmVjdXJzaXZlIG0ubW91bnQgY2FsbCBpcyBhcHBsaWVkXHJcblx0XHRcdGlmIChjdXJyZW50Q29tcG9uZW50ID09PSB0b3BDb21wb25lbnQpIHtcclxuXHRcdFx0XHRjb250cm9sbGVyc1tpbmRleF0gPSBjb250cm9sbGVyO1xyXG5cdFx0XHRcdGNvbXBvbmVudHNbaW5kZXhdID0gY29tcG9uZW50XHJcblx0XHRcdH1cclxuXHRcdFx0ZW5kRmlyc3RDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyZXR1cm4gY29udHJvbGxlcnNbaW5kZXhdXHJcblx0XHR9XHJcblx0fTtcclxuXHR2YXIgcmVkcmF3aW5nID0gZmFsc2VcclxuXHRtLnJlZHJhdyA9IGZ1bmN0aW9uKGZvcmNlKSB7XHJcblx0XHRpZiAocmVkcmF3aW5nKSByZXR1cm5cclxuXHRcdHJlZHJhd2luZyA9IHRydWVcclxuXHRcdC8vbGFzdFJlZHJhd0lkIGlzIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGEgc2Vjb25kIHJlZHJhdyBpcyByZXF1ZXN0ZWQgYmVmb3JlIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZVxyXG5cdFx0Ly9sYXN0UmVkcmF3SUQgaXMgbnVsbCBpZiBpdCdzIHRoZSBmaXJzdCByZWRyYXcgYW5kIG5vdCBhbiBldmVudCBoYW5kbGVyXHJcblx0XHRpZiAobGFzdFJlZHJhd0lkICYmIGZvcmNlICE9PSB0cnVlKSB7XHJcblx0XHRcdC8vd2hlbiBzZXRUaW1lb3V0OiBvbmx5IHJlc2NoZWR1bGUgcmVkcmF3IGlmIHRpbWUgYmV0d2VlbiBub3cgYW5kIHByZXZpb3VzIHJlZHJhdyBpcyBiaWdnZXIgdGhhbiBhIGZyYW1lLCBvdGhlcndpc2Uga2VlcCBjdXJyZW50bHkgc2NoZWR1bGVkIHRpbWVvdXRcclxuXHRcdFx0Ly93aGVuIHJBRjogYWx3YXlzIHJlc2NoZWR1bGUgcmVkcmF3XHJcblx0XHRcdGlmICgkcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IG5ldyBEYXRlIC0gbGFzdFJlZHJhd0NhbGxUaW1lID4gRlJBTUVfQlVER0VUKSB7XHJcblx0XHRcdFx0aWYgKGxhc3RSZWRyYXdJZCA+IDApICRjYW5jZWxBbmltYXRpb25GcmFtZShsYXN0UmVkcmF3SWQpO1xyXG5cdFx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3LCBGUkFNRV9CVURHRVQpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZWRyYXcoKTtcclxuXHRcdFx0bGFzdFJlZHJhd0lkID0gJHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtsYXN0UmVkcmF3SWQgPSBudWxsfSwgRlJBTUVfQlVER0VUKVxyXG5cdFx0fVxyXG5cdFx0cmVkcmF3aW5nID0gZmFsc2VcclxuXHR9O1xyXG5cdG0ucmVkcmF3LnN0cmF0ZWd5ID0gbS5wcm9wKCk7XHJcblx0ZnVuY3Rpb24gcmVkcmF3KCkge1xyXG5cdFx0aWYgKGNvbXB1dGVQcmVSZWRyYXdIb29rKSB7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rKClcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBudWxsXHJcblx0XHR9XHJcblx0XHRmb3IgKHZhciBpID0gMCwgcm9vdDsgcm9vdCA9IHJvb3RzW2ldOyBpKyspIHtcclxuXHRcdFx0aWYgKGNvbnRyb2xsZXJzW2ldKSB7XHJcblx0XHRcdFx0dmFyIGFyZ3MgPSBjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIgJiYgY29tcG9uZW50c1tpXS5jb250cm9sbGVyLiQkYXJncyA/IFtjb250cm9sbGVyc1tpXV0uY29uY2F0KGNvbXBvbmVudHNbaV0uY29udHJvbGxlci4kJGFyZ3MpIDogW2NvbnRyb2xsZXJzW2ldXVxyXG5cdFx0XHRcdG0ucmVuZGVyKHJvb3QsIGNvbXBvbmVudHNbaV0udmlldyA/IGNvbXBvbmVudHNbaV0udmlldyhjb250cm9sbGVyc1tpXSwgYXJncykgOiBcIlwiKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL2FmdGVyIHJlbmRlcmluZyB3aXRoaW4gYSByb3V0ZWQgY29udGV4dCwgd2UgbmVlZCB0byBzY3JvbGwgYmFjayB0byB0aGUgdG9wLCBhbmQgZmV0Y2ggdGhlIGRvY3VtZW50IHRpdGxlIGZvciBoaXN0b3J5LnB1c2hTdGF0ZVxyXG5cdFx0aWYgKGNvbXB1dGVQb3N0UmVkcmF3SG9vaykge1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2soKTtcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0bGFzdFJlZHJhd0lkID0gbnVsbDtcclxuXHRcdGxhc3RSZWRyYXdDYWxsVGltZSA9IG5ldyBEYXRlO1xyXG5cdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpXHJcblx0fVxyXG5cclxuXHR2YXIgcGVuZGluZ1JlcXVlc3RzID0gMDtcclxuXHRtLnN0YXJ0Q29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtwZW5kaW5nUmVxdWVzdHMrK307XHJcblx0bS5lbmRDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cGVuZGluZ1JlcXVlc3RzID0gTWF0aC5tYXgocGVuZGluZ1JlcXVlc3RzIC0gMSwgMCk7XHJcblx0XHRpZiAocGVuZGluZ1JlcXVlc3RzID09PSAwKSBtLnJlZHJhdygpXHJcblx0fTtcclxuXHR2YXIgZW5kRmlyc3RDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJub25lXCIpIHtcclxuXHRcdFx0cGVuZGluZ1JlcXVlc3RzLS1cclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpXHJcblx0XHR9XHJcblx0XHRlbHNlIG0uZW5kQ29tcHV0YXRpb24oKTtcclxuXHR9XHJcblxyXG5cdG0ud2l0aEF0dHIgPSBmdW5jdGlvbihwcm9wLCB3aXRoQXR0ckNhbGxiYWNrKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgdGhpcztcclxuXHRcdFx0d2l0aEF0dHJDYWxsYmFjayhwcm9wIGluIGN1cnJlbnRUYXJnZXQgPyBjdXJyZW50VGFyZ2V0W3Byb3BdIDogY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUocHJvcCkpXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly9yb3V0aW5nXHJcblx0dmFyIG1vZGVzID0ge3BhdGhuYW1lOiBcIlwiLCBoYXNoOiBcIiNcIiwgc2VhcmNoOiBcIj9cIn07XHJcblx0dmFyIHJlZGlyZWN0ID0gbm9vcCwgcm91dGVQYXJhbXMsIGN1cnJlbnRSb3V0ZSwgaXNEZWZhdWx0Um91dGUgPSBmYWxzZTtcclxuXHRtLnJvdXRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHQvL20ucm91dGUoKVxyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiBjdXJyZW50Um91dGU7XHJcblx0XHQvL20ucm91dGUoZWwsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKVxyXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiB0eXBlLmNhbGwoYXJndW1lbnRzWzFdKSA9PT0gU1RSSU5HKSB7XHJcblx0XHRcdHZhciByb290ID0gYXJndW1lbnRzWzBdLCBkZWZhdWx0Um91dGUgPSBhcmd1bWVudHNbMV0sIHJvdXRlciA9IGFyZ3VtZW50c1syXTtcclxuXHRcdFx0cmVkaXJlY3QgPSBmdW5jdGlvbihzb3VyY2UpIHtcclxuXHRcdFx0XHR2YXIgcGF0aCA9IGN1cnJlbnRSb3V0ZSA9IG5vcm1hbGl6ZVJvdXRlKHNvdXJjZSk7XHJcblx0XHRcdFx0aWYgKCFyb3V0ZUJ5VmFsdWUocm9vdCwgcm91dGVyLCBwYXRoKSkge1xyXG5cdFx0XHRcdFx0aWYgKGlzRGVmYXVsdFJvdXRlKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIGRlZmF1bHQgcm91dGUgbWF0Y2hlcyBvbmUgb2YgdGhlIHJvdXRlcyBkZWZpbmVkIGluIG0ucm91dGVcIilcclxuXHRcdFx0XHRcdGlzRGVmYXVsdFJvdXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0bS5yb3V0ZShkZWZhdWx0Um91dGUsIHRydWUpXHJcblx0XHRcdFx0XHRpc0RlZmF1bHRSb3V0ZSA9IGZhbHNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgbGlzdGVuZXIgPSBtLnJvdXRlLm1vZGUgPT09IFwiaGFzaFwiID8gXCJvbmhhc2hjaGFuZ2VcIiA6IFwib25wb3BzdGF0ZVwiO1xyXG5cdFx0XHR3aW5kb3dbbGlzdGVuZXJdID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSAkbG9jYXRpb25bbS5yb3V0ZS5tb2RlXVxyXG5cdFx0XHRcdGlmIChtLnJvdXRlLm1vZGUgPT09IFwicGF0aG5hbWVcIikgcGF0aCArPSAkbG9jYXRpb24uc2VhcmNoXHJcblx0XHRcdFx0aWYgKGN1cnJlbnRSb3V0ZSAhPSBub3JtYWxpemVSb3V0ZShwYXRoKSkge1xyXG5cdFx0XHRcdFx0cmVkaXJlY3QocGF0aClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gc2V0U2Nyb2xsO1xyXG5cdFx0XHR3aW5kb3dbbGlzdGVuZXJdKClcclxuXHRcdH1cclxuXHRcdC8vY29uZmlnOiBtLnJvdXRlXHJcblx0XHRlbHNlIGlmIChhcmd1bWVudHNbMF0uYWRkRXZlbnRMaXN0ZW5lciB8fCBhcmd1bWVudHNbMF0uYXR0YWNoRXZlbnQpIHtcclxuXHRcdFx0dmFyIGVsZW1lbnQgPSBhcmd1bWVudHNbMF07XHJcblx0XHRcdHZhciBpc0luaXRpYWxpemVkID0gYXJndW1lbnRzWzFdO1xyXG5cdFx0XHR2YXIgY29udGV4dCA9IGFyZ3VtZW50c1syXTtcclxuXHRcdFx0dmFyIHZkb20gPSBhcmd1bWVudHNbM107XHJcblx0XHRcdGVsZW1lbnQuaHJlZiA9IChtLnJvdXRlLm1vZGUgIT09ICdwYXRobmFtZScgPyAkbG9jYXRpb24ucGF0aG5hbWUgOiAnJykgKyBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgdmRvbS5hdHRycy5ocmVmO1xyXG5cdFx0XHRpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XHJcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRlbGVtZW50LmRldGFjaEV2ZW50KFwib25jbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKTtcclxuXHRcdFx0XHRlbGVtZW50LmF0dGFjaEV2ZW50KFwib25jbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL20ucm91dGUocm91dGUsIHBhcmFtcywgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSlcclxuXHRcdGVsc2UgaWYgKHR5cGUuY2FsbChhcmd1bWVudHNbMF0pID09PSBTVFJJTkcpIHtcclxuXHRcdFx0dmFyIG9sZFJvdXRlID0gY3VycmVudFJvdXRlO1xyXG5cdFx0XHRjdXJyZW50Um91dGUgPSBhcmd1bWVudHNbMF07XHJcblx0XHRcdHZhciBhcmdzID0gYXJndW1lbnRzWzFdIHx8IHt9XHJcblx0XHRcdHZhciBxdWVyeUluZGV4ID0gY3VycmVudFJvdXRlLmluZGV4T2YoXCI/XCIpXHJcblx0XHRcdHZhciBwYXJhbXMgPSBxdWVyeUluZGV4ID4gLTEgPyBwYXJzZVF1ZXJ5U3RyaW5nKGN1cnJlbnRSb3V0ZS5zbGljZShxdWVyeUluZGV4ICsgMSkpIDoge31cclxuXHRcdFx0Zm9yICh2YXIgaSBpbiBhcmdzKSBwYXJhbXNbaV0gPSBhcmdzW2ldXHJcblx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcocGFyYW1zKVxyXG5cdFx0XHR2YXIgY3VycmVudFBhdGggPSBxdWVyeUluZGV4ID4gLTEgPyBjdXJyZW50Um91dGUuc2xpY2UoMCwgcXVlcnlJbmRleCkgOiBjdXJyZW50Um91dGVcclxuXHRcdFx0aWYgKHF1ZXJ5c3RyaW5nKSBjdXJyZW50Um91dGUgPSBjdXJyZW50UGF0aCArIChjdXJyZW50UGF0aC5pbmRleE9mKFwiP1wiKSA9PT0gLTEgPyBcIj9cIiA6IFwiJlwiKSArIHF1ZXJ5c3RyaW5nO1xyXG5cclxuXHRcdFx0dmFyIHNob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkgPSAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyA/IGFyZ3VtZW50c1syXSA6IGFyZ3VtZW50c1sxXSkgPT09IHRydWUgfHwgb2xkUm91dGUgPT09IGFyZ3VtZW50c1swXTtcclxuXHJcblx0XHRcdGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpIHtcclxuXHRcdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbFxyXG5cdFx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0d2luZG93Lmhpc3Rvcnlbc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiXShudWxsLCAkZG9jdW1lbnQudGl0bGUsIG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHQkbG9jYXRpb25bbS5yb3V0ZS5tb2RlXSA9IGN1cnJlbnRSb3V0ZVxyXG5cdFx0XHRcdHJlZGlyZWN0KG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdG0ucm91dGUucGFyYW0gPSBmdW5jdGlvbihrZXkpIHtcclxuXHRcdGlmICghcm91dGVQYXJhbXMpIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGNhbGwgbS5yb3V0ZShlbGVtZW50LCBkZWZhdWx0Um91dGUsIHJvdXRlcykgYmVmb3JlIGNhbGxpbmcgbS5yb3V0ZS5wYXJhbSgpXCIpXHJcblx0XHRyZXR1cm4gcm91dGVQYXJhbXNba2V5XVxyXG5cdH07XHJcblx0bS5yb3V0ZS5tb2RlID0gXCJzZWFyY2hcIjtcclxuXHRmdW5jdGlvbiBub3JtYWxpemVSb3V0ZShyb3V0ZSkge1xyXG5cdFx0cmV0dXJuIHJvdXRlLnNsaWNlKG1vZGVzW20ucm91dGUubW9kZV0ubGVuZ3RoKVxyXG5cdH1cclxuXHRmdW5jdGlvbiByb3V0ZUJ5VmFsdWUocm9vdCwgcm91dGVyLCBwYXRoKSB7XHJcblx0XHRyb3V0ZVBhcmFtcyA9IHt9O1xyXG5cclxuXHRcdHZhciBxdWVyeVN0YXJ0ID0gcGF0aC5pbmRleE9mKFwiP1wiKTtcclxuXHRcdGlmIChxdWVyeVN0YXJ0ICE9PSAtMSkge1xyXG5cdFx0XHRyb3V0ZVBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcocGF0aC5zdWJzdHIocXVlcnlTdGFydCArIDEsIHBhdGgubGVuZ3RoKSk7XHJcblx0XHRcdHBhdGggPSBwYXRoLnN1YnN0cigwLCBxdWVyeVN0YXJ0KVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEdldCBhbGwgcm91dGVzIGFuZCBjaGVjayBpZiB0aGVyZSdzXHJcblx0XHQvLyBhbiBleGFjdCBtYXRjaCBmb3IgdGhlIGN1cnJlbnQgcGF0aFxyXG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhyb3V0ZXIpO1xyXG5cdFx0dmFyIGluZGV4ID0ga2V5cy5pbmRleE9mKHBhdGgpO1xyXG5cdFx0aWYoaW5kZXggIT09IC0xKXtcclxuXHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJba2V5cyBbaW5kZXhdXSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIHJvdXRlIGluIHJvdXRlcikge1xyXG5cdFx0XHRpZiAocm91dGUgPT09IHBhdGgpIHtcclxuXHRcdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltyb3V0ZV0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcIl5cIiArIHJvdXRlLnJlcGxhY2UoLzpbXlxcL10rP1xcLnszfS9nLCBcIiguKj8pXCIpLnJlcGxhY2UoLzpbXlxcL10rL2csIFwiKFteXFxcXC9dKylcIikgKyBcIlxcLz8kXCIpO1xyXG5cclxuXHRcdFx0aWYgKG1hdGNoZXIudGVzdChwYXRoKSkge1xyXG5cdFx0XHRcdHBhdGgucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBrZXlzID0gcm91dGUubWF0Y2goLzpbXlxcL10rL2cpIHx8IFtdO1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxLCAtMik7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykgcm91dGVQYXJhbXNba2V5c1tpXS5yZXBsYWNlKC86fFxcLi9nLCBcIlwiKV0gPSBkZWNvZGVVUklDb21wb25lbnQodmFsdWVzW2ldKVxyXG5cdFx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gcm91dGVVbm9idHJ1c2l2ZShlKSB7XHJcblx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUud2hpY2ggPT09IDIpIHJldHVybjtcclxuXHRcdGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuXHRcdHZhciBhcmdzID0gbS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIgJiYgY3VycmVudFRhcmdldC5zZWFyY2ggPyBwYXJzZVF1ZXJ5U3RyaW5nKGN1cnJlbnRUYXJnZXQuc2VhcmNoLnNsaWNlKDEpKSA6IHt9O1xyXG5cdFx0d2hpbGUgKGN1cnJlbnRUYXJnZXQgJiYgY3VycmVudFRhcmdldC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpICE9IFwiQVwiKSBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5wYXJlbnROb2RlXHJcblx0XHRtLnJvdXRlKGN1cnJlbnRUYXJnZXRbbS5yb3V0ZS5tb2RlXS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aCksIGFyZ3MpXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHNldFNjcm9sbCgpIHtcclxuXHRcdGlmIChtLnJvdXRlLm1vZGUgIT0gXCJoYXNoXCIgJiYgJGxvY2F0aW9uLmhhc2gpICRsb2NhdGlvbi5oYXNoID0gJGxvY2F0aW9uLmhhc2g7XHJcblx0XHRlbHNlIHdpbmRvdy5zY3JvbGxUbygwLCAwKVxyXG5cdH1cclxuXHRmdW5jdGlvbiBidWlsZFF1ZXJ5U3RyaW5nKG9iamVjdCwgcHJlZml4KSB7XHJcblx0XHR2YXIgZHVwbGljYXRlcyA9IHt9XHJcblx0XHR2YXIgc3RyID0gW11cclxuXHRcdGZvciAodmFyIHByb3AgaW4gb2JqZWN0KSB7XHJcblx0XHRcdHZhciBrZXkgPSBwcmVmaXggPyBwcmVmaXggKyBcIltcIiArIHByb3AgKyBcIl1cIiA6IHByb3BcclxuXHRcdFx0dmFyIHZhbHVlID0gb2JqZWN0W3Byb3BdXHJcblx0XHRcdHZhciB2YWx1ZVR5cGUgPSB0eXBlLmNhbGwodmFsdWUpXHJcblx0XHRcdHZhciBwYWlyID0gKHZhbHVlID09PSBudWxsKSA/IGVuY29kZVVSSUNvbXBvbmVudChrZXkpIDpcclxuXHRcdFx0XHR2YWx1ZVR5cGUgPT09IE9CSkVDVCA/IGJ1aWxkUXVlcnlTdHJpbmcodmFsdWUsIGtleSkgOlxyXG5cdFx0XHRcdHZhbHVlVHlwZSA9PT0gQVJSQVkgPyB2YWx1ZS5yZWR1Y2UoZnVuY3Rpb24obWVtbywgaXRlbSkge1xyXG5cdFx0XHRcdFx0aWYgKCFkdXBsaWNhdGVzW2tleV0pIGR1cGxpY2F0ZXNba2V5XSA9IHt9XHJcblx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XVtpdGVtXSkge1xyXG5cdFx0XHRcdFx0XHRkdXBsaWNhdGVzW2tleV1baXRlbV0gPSB0cnVlXHJcblx0XHRcdFx0XHRcdHJldHVybiBtZW1vLmNvbmNhdChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGl0ZW0pKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIG1lbW9cclxuXHRcdFx0XHR9LCBbXSkuam9pbihcIiZcIikgOlxyXG5cdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpXHJcblx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSBzdHIucHVzaChwYWlyKVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHN0ci5qb2luKFwiJlwiKVxyXG5cdH1cclxuXHRmdW5jdGlvbiBwYXJzZVF1ZXJ5U3RyaW5nKHN0cikge1xyXG5cdFx0aWYgKHN0ci5jaGFyQXQoMCkgPT09IFwiP1wiKSBzdHIgPSBzdHIuc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHJcblx0XHR2YXIgcGFpcnMgPSBzdHIuc3BsaXQoXCImXCIpLCBwYXJhbXMgPSB7fTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHR2YXIgcGFpciA9IHBhaXJzW2ldLnNwbGl0KFwiPVwiKTtcclxuXHRcdFx0dmFyIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdKVxyXG5cdFx0XHR2YXIgdmFsdWUgPSBwYWlyLmxlbmd0aCA9PSAyID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pIDogbnVsbFxyXG5cdFx0XHRpZiAocGFyYW1zW2tleV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmICh0eXBlLmNhbGwocGFyYW1zW2tleV0pICE9PSBBUlJBWSkgcGFyYW1zW2tleV0gPSBbcGFyYW1zW2tleV1dXHJcblx0XHRcdFx0cGFyYW1zW2tleV0ucHVzaCh2YWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHBhcmFtc1trZXldID0gdmFsdWVcclxuXHRcdH1cclxuXHRcdHJldHVybiBwYXJhbXNcclxuXHR9XHJcblx0bS5yb3V0ZS5idWlsZFF1ZXJ5U3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZ1xyXG5cdG0ucm91dGUucGFyc2VRdWVyeVN0cmluZyA9IHBhcnNlUXVlcnlTdHJpbmdcclxuXHRcclxuXHRmdW5jdGlvbiByZXNldChyb290KSB7XHJcblx0XHR2YXIgY2FjaGVLZXkgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHRjbGVhcihyb290LmNoaWxkTm9kZXMsIGNlbGxDYWNoZVtjYWNoZUtleV0pO1xyXG5cdFx0Y2VsbENhY2hlW2NhY2hlS2V5XSA9IHVuZGVmaW5lZFxyXG5cdH1cclxuXHJcblx0bS5kZWZlcnJlZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWRcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIHByb3BpZnkocHJvbWlzZSwgaW5pdGlhbFZhbHVlKSB7XHJcblx0XHR2YXIgcHJvcCA9IG0ucHJvcChpbml0aWFsVmFsdWUpO1xyXG5cdFx0cHJvbWlzZS50aGVuKHByb3ApO1xyXG5cdFx0cHJvcC50aGVuID0gZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpLCBpbml0aWFsVmFsdWUpXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIHByb3BcclxuXHR9XHJcblx0Ly9Qcm9taXoubWl0aHJpbC5qcyB8IFpvbG1laXN0ZXIgfCBNSVRcclxuXHQvL2EgbW9kaWZpZWQgdmVyc2lvbiBvZiBQcm9taXouanMsIHdoaWNoIGRvZXMgbm90IGNvbmZvcm0gdG8gUHJvbWlzZXMvQSsgZm9yIHR3byByZWFzb25zOlxyXG5cdC8vMSkgYHRoZW5gIGNhbGxiYWNrcyBhcmUgY2FsbGVkIHN5bmNocm9ub3VzbHkgKGJlY2F1c2Ugc2V0VGltZW91dCBpcyB0b28gc2xvdywgYW5kIHRoZSBzZXRJbW1lZGlhdGUgcG9seWZpbGwgaXMgdG9vIGJpZ1xyXG5cdC8vMikgdGhyb3dpbmcgc3ViY2xhc3NlcyBvZiBFcnJvciBjYXVzZSB0aGUgZXJyb3IgdG8gYmUgYnViYmxlZCB1cCBpbnN0ZWFkIG9mIHRyaWdnZXJpbmcgcmVqZWN0aW9uIChiZWNhdXNlIHRoZSBzcGVjIGRvZXMgbm90IGFjY291bnQgZm9yIHRoZSBpbXBvcnRhbnQgdXNlIGNhc2Ugb2YgZGVmYXVsdCBicm93c2VyIGVycm9yIGhhbmRsaW5nLCBpLmUuIG1lc3NhZ2Ugdy8gbGluZSBudW1iZXIpXHJcblx0ZnVuY3Rpb24gRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spIHtcclxuXHRcdHZhciBSRVNPTFZJTkcgPSAxLCBSRUpFQ1RJTkcgPSAyLCBSRVNPTFZFRCA9IDMsIFJFSkVDVEVEID0gNDtcclxuXHRcdHZhciBzZWxmID0gdGhpcywgc3RhdGUgPSAwLCBwcm9taXNlVmFsdWUgPSAwLCBuZXh0ID0gW107XHJcblxyXG5cdFx0c2VsZltcInByb21pc2VcIl0gPSB7fTtcclxuXHJcblx0XHRzZWxmW1wicmVzb2x2ZVwiXSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGlmICghc3RhdGUpIHtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZltcInJlamVjdFwiXSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGlmICghc3RhdGUpIHtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFSkVDVElORztcclxuXHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZi5wcm9taXNlW1widGhlblwiXSA9IGZ1bmN0aW9uKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKSB7XHJcblx0XHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZChzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjayk7XHJcblx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWRUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdG5leHQucHVzaChkZWZlcnJlZClcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBmaW5pc2godHlwZSkge1xyXG5cdFx0XHRzdGF0ZSA9IHR5cGUgfHwgUkVKRUNURUQ7XHJcblx0XHRcdG5leHQubWFwKGZ1bmN0aW9uKGRlZmVycmVkKSB7XHJcblx0XHRcdFx0c3RhdGUgPT09IFJFU09MVkVEICYmIGRlZmVycmVkLnJlc29sdmUocHJvbWlzZVZhbHVlKSB8fCBkZWZlcnJlZC5yZWplY3QocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRoZW5uYWJsZSh0aGVuLCBzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaywgbm90VGhlbm5hYmxlQ2FsbGJhY2spIHtcclxuXHRcdFx0aWYgKCgocHJvbWlzZVZhbHVlICE9IG51bGwgJiYgdHlwZS5jYWxsKHByb21pc2VWYWx1ZSkgPT09IE9CSkVDVCkgfHwgdHlwZW9mIHByb21pc2VWYWx1ZSA9PT0gRlVOQ1RJT04pICYmIHR5cGVvZiB0aGVuID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvLyBjb3VudCBwcm90ZWN0cyBhZ2FpbnN0IGFidXNlIGNhbGxzIGZyb20gc3BlYyBjaGVja2VyXHJcblx0XHRcdFx0XHR2YXIgY291bnQgPSAwO1xyXG5cdFx0XHRcdFx0dGhlbi5jYWxsKHByb21pc2VWYWx1ZSwgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdHN1Y2Nlc3NDYWxsYmFjaygpXHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGZhaWx1cmVDYWxsYmFjaygpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRcdGZhaWx1cmVDYWxsYmFjaygpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5vdFRoZW5uYWJsZUNhbGxiYWNrKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGZpcmUoKSB7XHJcblx0XHRcdC8vIGNoZWNrIGlmIGl0J3MgYSB0aGVuYWJsZVxyXG5cdFx0XHR2YXIgdGhlbjtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR0aGVuID0gcHJvbWlzZVZhbHVlICYmIHByb21pc2VWYWx1ZS50aGVuXHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFSkVDVElORztcclxuXHRcdFx0XHRyZXR1cm4gZmlyZSgpXHJcblx0XHRcdH1cclxuXHRcdFx0dGhlbm5hYmxlKHRoZW4sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HO1xyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFSkVDVElORztcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIHR5cGVvZiBzdWNjZXNzQ2FsbGJhY2sgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHN1Y2Nlc3NDYWxsYmFjayhwcm9taXNlVmFsdWUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChzdGF0ZSA9PT0gUkVKRUNUSU5HICYmIHR5cGVvZiBmYWlsdXJlQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBmYWlsdXJlQ2FsbGJhY2socHJvbWlzZVZhbHVlKTtcclxuXHRcdFx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmluaXNoKClcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChwcm9taXNlVmFsdWUgPT09IHNlbGYpIHtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IFR5cGVFcnJvcigpO1xyXG5cdFx0XHRcdFx0ZmluaXNoKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGVubmFibGUodGhlbiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goUkVTT0xWRUQpXHJcblx0XHRcdFx0XHR9LCBmaW5pc2gsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0ZmluaXNoKHN0YXRlID09PSBSRVNPTFZJTkcgJiYgUkVTT0xWRUQpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblx0bS5kZWZlcnJlZC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYgKHR5cGUuY2FsbChlKSA9PT0gXCJbb2JqZWN0IEVycm9yXVwiICYmICFlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goLyBFcnJvci8pKSB0aHJvdyBlXHJcblx0fTtcclxuXHJcblx0bS5zeW5jID0gZnVuY3Rpb24oYXJncykge1xyXG5cdFx0dmFyIG1ldGhvZCA9IFwicmVzb2x2ZVwiO1xyXG5cdFx0ZnVuY3Rpb24gc3luY2hyb25pemVyKHBvcywgcmVzb2x2ZWQpIHtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0cmVzdWx0c1twb3NdID0gdmFsdWU7XHJcblx0XHRcdFx0aWYgKCFyZXNvbHZlZCkgbWV0aG9kID0gXCJyZWplY3RcIjtcclxuXHRcdFx0XHRpZiAoLS1vdXRzdGFuZGluZyA9PT0gMCkge1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucHJvbWlzZShyZXN1bHRzKTtcclxuXHRcdFx0XHRcdGRlZmVycmVkW21ldGhvZF0ocmVzdWx0cylcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZGVmZXJyZWQgPSBtLmRlZmVycmVkKCk7XHJcblx0XHR2YXIgb3V0c3RhbmRpbmcgPSBhcmdzLmxlbmd0aDtcclxuXHRcdHZhciByZXN1bHRzID0gbmV3IEFycmF5KG91dHN0YW5kaW5nKTtcclxuXHRcdGlmIChhcmdzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0YXJnc1tpXS50aGVuKHN5bmNocm9uaXplcihpLCB0cnVlKSwgc3luY2hyb25pemVyKGksIGZhbHNlKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBkZWZlcnJlZC5yZXNvbHZlKFtdKTtcclxuXHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdH07XHJcblx0ZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtyZXR1cm4gdmFsdWV9XHJcblxyXG5cdGZ1bmN0aW9uIGFqYXgob3B0aW9ucykge1xyXG5cdFx0aWYgKG9wdGlvbnMuZGF0YVR5cGUgJiYgb3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCIpIHtcclxuXHRcdFx0dmFyIGNhbGxiYWNrS2V5ID0gXCJtaXRocmlsX2NhbGxiYWNrX1wiICsgbmV3IERhdGUoKS5nZXRUaW1lKCkgKyBcIl9cIiArIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSkudG9TdHJpbmcoMzYpO1xyXG5cdFx0XHR2YXIgc2NyaXB0ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcblxyXG5cdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gZnVuY3Rpb24ocmVzcCkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblx0XHRcdFx0b3B0aW9ucy5vbmxvYWQoe1xyXG5cdFx0XHRcdFx0dHlwZTogXCJsb2FkXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2VUZXh0OiByZXNwXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IHVuZGVmaW5lZFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcclxuXHJcblx0XHRcdFx0b3B0aW9ucy5vbmVycm9yKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwiZXJyb3JcIixcclxuXHRcdFx0XHRcdHRhcmdldDoge1xyXG5cdFx0XHRcdFx0XHRzdGF0dXM6IDUwMCxcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2VUZXh0OiBKU09OLnN0cmluZ2lmeSh7ZXJyb3I6IFwiRXJyb3IgbWFraW5nIGpzb25wIHJlcXVlc3RcIn0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0LnNyYyA9IG9wdGlvbnMudXJsXHJcblx0XHRcdFx0KyAob3B0aW9ucy51cmwuaW5kZXhPZihcIj9cIikgPiAwID8gXCImXCIgOiBcIj9cIilcclxuXHRcdFx0XHQrIChvcHRpb25zLmNhbGxiYWNrS2V5ID8gb3B0aW9ucy5jYWxsYmFja0tleSA6IFwiY2FsbGJhY2tcIilcclxuXHRcdFx0XHQrIFwiPVwiICsgY2FsbGJhY2tLZXlcclxuXHRcdFx0XHQrIFwiJlwiICsgYnVpbGRRdWVyeVN0cmluZyhvcHRpb25zLmRhdGEgfHwge30pO1xyXG5cdFx0XHQkZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XHJcblx0XHRcdHhoci5vcGVuKG9wdGlvbnMubWV0aG9kLCBvcHRpb25zLnVybCwgdHJ1ZSwgb3B0aW9ucy51c2VyLCBvcHRpb25zLnBhc3N3b3JkKTtcclxuXHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG5cdFx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIG9wdGlvbnMub25sb2FkKHt0eXBlOiBcImxvYWRcIiwgdGFyZ2V0OiB4aHJ9KTtcclxuXHRcdFx0XHRcdGVsc2Ugb3B0aW9ucy5vbmVycm9yKHt0eXBlOiBcImVycm9yXCIsIHRhcmdldDogeGhyfSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGlmIChvcHRpb25zLnNlcmlhbGl6ZSA9PT0gSlNPTi5zdHJpbmdpZnkgJiYgb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMubWV0aG9kICE9PSBcIkdFVFwiKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG9wdGlvbnMuZGVzZXJpYWxpemUgPT09IEpTT04ucGFyc2UpIHtcclxuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvKlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMuY29uZmlnID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHZhciBtYXliZVhociA9IG9wdGlvbnMuY29uZmlnKHhociwgb3B0aW9ucyk7XHJcblx0XHRcdFx0aWYgKG1heWJlWGhyICE9IG51bGwpIHhociA9IG1heWJlWGhyXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBkYXRhID0gb3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgfHwgIW9wdGlvbnMuZGF0YSA/IFwiXCIgOiBvcHRpb25zLmRhdGFcclxuXHRcdFx0aWYgKGRhdGEgJiYgKHR5cGUuY2FsbChkYXRhKSAhPSBTVFJJTkcgJiYgZGF0YS5jb25zdHJ1Y3RvciAhPSB3aW5kb3cuRm9ybURhdGEpKSB7XHJcblx0XHRcdFx0dGhyb3cgXCJSZXF1ZXN0IGRhdGEgc2hvdWxkIGJlIGVpdGhlciBiZSBhIHN0cmluZyBvciBGb3JtRGF0YS4gQ2hlY2sgdGhlIGBzZXJpYWxpemVgIG9wdGlvbiBpbiBgbS5yZXF1ZXN0YFwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdHhoci5zZW5kKGRhdGEpO1xyXG5cdFx0XHRyZXR1cm4geGhyXHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGJpbmREYXRhKHhock9wdGlvbnMsIGRhdGEsIHNlcmlhbGl6ZSkge1xyXG5cdFx0aWYgKHhock9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiICYmIHhock9wdGlvbnMuZGF0YVR5cGUgIT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBwcmVmaXggPSB4aHJPcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiO1xyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpO1xyXG5cdFx0XHR4aHJPcHRpb25zLnVybCA9IHhock9wdGlvbnMudXJsICsgKHF1ZXJ5c3RyaW5nID8gcHJlZml4ICsgcXVlcnlzdHJpbmcgOiBcIlwiKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB4aHJPcHRpb25zLmRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XHJcblx0XHRyZXR1cm4geGhyT3B0aW9uc1xyXG5cdH1cclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemVVcmwodXJsLCBkYXRhKSB7XHJcblx0XHR2YXIgdG9rZW5zID0gdXJsLm1hdGNoKC86W2Etel1cXHcrL2dpKTtcclxuXHRcdGlmICh0b2tlbnMgJiYgZGF0YSkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBrZXkgPSB0b2tlbnNbaV0uc2xpY2UoMSk7XHJcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UodG9rZW5zW2ldLCBkYXRhW2tleV0pO1xyXG5cdFx0XHRcdGRlbGV0ZSBkYXRhW2tleV1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHVybFxyXG5cdH1cclxuXHJcblx0bS5yZXF1ZXN0ID0gZnVuY3Rpb24oeGhyT3B0aW9ucykge1xyXG5cdFx0aWYgKHhock9wdGlvbnMuYmFja2dyb3VuZCAhPT0gdHJ1ZSkgbS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuXHRcdHZhciBpc0pTT05QID0geGhyT3B0aW9ucy5kYXRhVHlwZSAmJiB4aHJPcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgPT09IFwianNvbnBcIjtcclxuXHRcdHZhciBzZXJpYWxpemUgPSB4aHJPcHRpb25zLnNlcmlhbGl6ZSA9IGlzSlNPTlAgPyBpZGVudGl0eSA6IHhock9wdGlvbnMuc2VyaWFsaXplIHx8IEpTT04uc3RyaW5naWZ5O1xyXG5cdFx0dmFyIGRlc2VyaWFsaXplID0geGhyT3B0aW9ucy5kZXNlcmlhbGl6ZSA9IGlzSlNPTlAgPyBpZGVudGl0eSA6IHhock9wdGlvbnMuZGVzZXJpYWxpemUgfHwgSlNPTi5wYXJzZTtcclxuXHRcdHZhciBleHRyYWN0ID0gaXNKU09OUCA/IGZ1bmN0aW9uKGpzb25wKSB7cmV0dXJuIGpzb25wLnJlc3BvbnNlVGV4dH0gOiB4aHJPcHRpb25zLmV4dHJhY3QgfHwgZnVuY3Rpb24oeGhyKSB7XHJcblx0XHRcdHJldHVybiB4aHIucmVzcG9uc2VUZXh0Lmxlbmd0aCA9PT0gMCAmJiBkZXNlcmlhbGl6ZSA9PT0gSlNPTi5wYXJzZSA/IG51bGwgOiB4aHIucmVzcG9uc2VUZXh0XHJcblx0XHR9O1xyXG5cdFx0eGhyT3B0aW9ucy5tZXRob2QgPSAoeGhyT3B0aW9ucy5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XHJcblx0XHR4aHJPcHRpb25zLnVybCA9IHBhcmFtZXRlcml6ZVVybCh4aHJPcHRpb25zLnVybCwgeGhyT3B0aW9ucy5kYXRhKTtcclxuXHRcdHhock9wdGlvbnMgPSBiaW5kRGF0YSh4aHJPcHRpb25zLCB4aHJPcHRpb25zLmRhdGEsIHNlcmlhbGl6ZSk7XHJcblx0XHR4aHJPcHRpb25zLm9ubG9hZCA9IHhock9wdGlvbnMub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0XHR2YXIgdW53cmFwID0gKGUudHlwZSA9PT0gXCJsb2FkXCIgPyB4aHJPcHRpb25zLnVud3JhcFN1Y2Nlc3MgOiB4aHJPcHRpb25zLnVud3JhcEVycm9yKSB8fCBpZGVudGl0eTtcclxuXHRcdFx0XHR2YXIgcmVzcG9uc2UgPSB1bndyYXAoZGVzZXJpYWxpemUoZXh0cmFjdChlLnRhcmdldCwgeGhyT3B0aW9ucykpLCBlLnRhcmdldCk7XHJcblx0XHRcdFx0aWYgKGUudHlwZSA9PT0gXCJsb2FkXCIpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlLmNhbGwocmVzcG9uc2UpID09PSBBUlJBWSAmJiB4aHJPcHRpb25zLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykgcmVzcG9uc2VbaV0gPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlW2ldKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoeGhyT3B0aW9ucy50eXBlKSByZXNwb25zZSA9IG5ldyB4aHJPcHRpb25zLnR5cGUocmVzcG9uc2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRlZmVycmVkW2UudHlwZSA9PT0gXCJsb2FkXCIgPyBcInJlc29sdmVcIiA6IFwicmVqZWN0XCJdKHJlc3BvbnNlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdChlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uZW5kQ29tcHV0YXRpb24oKVxyXG5cdFx0fTtcclxuXHRcdGFqYXgoeGhyT3B0aW9ucyk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlLCB4aHJPcHRpb25zLmluaXRpYWxWYWx1ZSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdH07XHJcblxyXG5cdC8vdGVzdGluZyBBUElcclxuXHRtLmRlcHMgPSBmdW5jdGlvbihtb2NrKSB7XHJcblx0XHRpbml0aWFsaXplKHdpbmRvdyA9IG1vY2sgfHwgd2luZG93KTtcclxuXHRcdHJldHVybiB3aW5kb3c7XHJcblx0fTtcclxuXHQvL2ZvciBpbnRlcm5hbCB0ZXN0aW5nIG9ubHksIGRvIG5vdCB1c2UgYG0uZGVwcy5mYWN0b3J5YFxyXG5cdG0uZGVwcy5mYWN0b3J5ID0gYXBwO1xyXG5cclxuXHRyZXR1cm4gbVxyXG59KSh0eXBlb2Ygd2luZG93ICE9IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSk7XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZSAhPT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBtO1xyXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCkge3JldHVybiBtfSk7XHJcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGF1dGhvcml6ZUhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXV0aG9yaXplLWhlbHBlcicpO1xudmFyIGxheW91dEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5b3V0LWhlbHBlcicpO1xudmFyIExvZ2dlZEluTWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtaW4tbWVudS5qcycpO1xudmFyIEZlZWRTZWxlY3QgPSByZXF1aXJlKCcuLi9sYXlvdXQvZmVlZC1zZWxlY3QnKTtcbnZhciBGZWVkSW5mbyA9IHJlcXVpcmUoJy4vbW9kZWxzL2ZlZWQtaW5mbycpO1xuXG52YXIgRmVlZEVkaXQgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1cGRhdGVGZWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvZWRpdCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0aXRsZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3RpdGxlJylbMF0udmFsdWUsXG4gICAgICAgICAgZmlsdGVyczogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2ZpbHRlcnMnKVswXS52YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgfSlcbiAgICAgIC50aGVuKGF1dGhvcml6ZUhlbHBlcilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvZWRpdCcpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgZGVsZXRlRmVlZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUnKSkge1xuICAgICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyksXG4gICAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oYXV0aG9yaXplSGVscGVyKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBhZGRTb3VyY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy9uZXcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ25hbWUnKVswXS52YWx1ZSxcbiAgICAgICAgICB2YWx1ZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3ZhbHVlJylbMF0udmFsdWUsXG4gICAgICAgICAgdHlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3R5cGUnKVswXS52YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgfSlcbiAgICAgIC50aGVuKGF1dGhvcml6ZUhlbHBlcilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmICghcmVzcG9uc2UuZmFpbCkge1xuICAgICAgICAgIG0ucm91dGUoJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9lZGl0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWx1cmUgb2NjdXJlZCBhZnRlciBhdXRob3JpemF0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIGRlbGV0ZVNvdXJjZSA9IGZ1bmN0aW9uKHNvdXJjZUlkKSB7XG5cbiAgICAgIHZhciBkZWxldGVTb3VyY2VGbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlJykpIHtcbiAgICAgICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9zb3VyY2VzLycgKyBzb3VyY2VJZCxcbiAgICAgICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oYXV0aG9yaXplSGVscGVyKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLmZhaWwpIHtcbiAgICAgICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL2VkaXQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsdXJlIG9jY3VyZWQgYWZ0ZXIgYXV0aG9yaXphdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWxldGVTb3VyY2VGbjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgZmVlZEluZm86IEZlZWRJbmZvKCksIHVwZGF0ZUZlZWQ6IHVwZGF0ZUZlZWQsIGRlbGV0ZUZlZWQ6IGRlbGV0ZUZlZWQsIGFkZFNvdXJjZTogYWRkU291cmNlLCBkZWxldGVTb3VyY2U6IGRlbGV0ZVNvdXJjZSB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgZmVlZHM6IGN0cmwuZmVlZEluZm8oKS51c2VyLmZlZWRzLFxuICAgICAgY3VycmVudEZlZWQ6ICdzZWxlY3QtZmVlZCcsXG4gICAgfSk7XG4gICAgcmV0dXJuIG0oJ2Rpdi5jb250ZW50LXBhcnQnLCBbXG4gICAgICBtKCdkaXYnLCBbXG4gICAgICAgIG0oJ2gyJywgJ0VkaXQgRmVlZCcpLFxuICAgICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3RpdGxlJywgcGxhY2Vob2xkZXI6ICdlZGl0IHRpdGxlJywgdmFsdWU6IGN0cmwuZmVlZEluZm8oKS5kYXRhLnRpdGxlIHx8ICcnfSlcbiAgICAgICAgXSksXG4gICAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAnZmlsdGVycycsIHBsYWNlaG9sZGVyOiAnZWRpdCBmaWx0ZXJzJywgdmFsdWU6IGN0cmwuZmVlZEluZm8oKS5kYXRhLmZpbHRlcnMuam9pbignLCcpIHx8ICcnIH0pXG4gICAgICAgIF0pLFxuICAgICAgICBtKCdkaXYuc3VibWl0LWJsb2NrJywgW1xuICAgICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLnVwZGF0ZUZlZWQsIHR5cGU6ICdzdWJtaXQnLCB2YWx1ZTogJ1VwZGF0ZSBGZWVkJyB9KVxuICAgICAgICBdKSxcbiAgICAgICAgbSgnZGl2LmRlbGV0ZS1mb3JtJywgW1xuICAgICAgICAgIG0oJ2J1dHRvbi5kZWxldGUtYnV0dG9uJywgeyBvbmNsaWNrOiBjdHJsLmRlbGV0ZUZlZWQgfSwgJ0RlbGV0ZSBGZWVkJyApXG4gICAgICAgIF0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2RpdicsIFtcbiAgICAgICAgbSgnaDInLCAnQWRkIFNvdXJjZScpLFxuICAgICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ25hbWUnLCBwbGFjZWhvbGRlcjogJ25hbWUnIH0pXG4gICAgICAgIF0pLFxuICAgICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3ZhbHVlJywgcGxhY2Vob2xkZXI6ICd2YWx1ZScgfSlcbiAgICAgICAgXSksXG4gICAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgICBtKCdzZWxlY3QnLCB7IG5hbWU6ICd0eXBlJyB9LCBbXG4gICAgICAgICAgICBtKCdvcHRpb24nLCB7IHZhbHVlOiAnZmFjZWJvb2snIH0sICdGYWNlYm9vaycpXG4gICAgICAgICAgXSlcbiAgICAgICAgXSksXG4gICAgICAgIG0oJ2Rpdi5zdWJtaXQtYmxvY2snLCBbXG4gICAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuYWRkU291cmNlLCB0eXBlOiAnc3VibWl0JywgdmFsdWU6ICdBZGQgU291cmNlJyB9KVxuICAgICAgICBdKSxcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2JywgW1xuICAgICAgICBtKCdoMicsICdTb3VyY2VzJyksXG4gICAgICAgIGN0cmwuZmVlZEluZm8oKS5kYXRhLnNvdXJjZXMubWFwKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICAgIHJldHVybiBtKCdkaXYubGlzdGVkLWl0ZW0nLCBbXG4gICAgICAgICAgICBtKCdoNCcsIFtcbiAgICAgICAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9zb3VyY2VzLycgKyBzb3VyY2UuX2lkLCBjb25maWc6IG0ucm91dGUgfSwgc291cmNlLm5hbWUpXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIG0oJ2J1dHRvbi5kZWxldGUtYnV0dG9uJywgeyBvbmNsaWNrOiBjdHJsLmRlbGV0ZVNvdXJjZShzb3VyY2UuX2lkKX0sICdEZWxldGUgU291cmNlJyksXG4gICAgICAgICAgICBtKCdhJywgeyBocmVmOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL3NvdXJjZXMvJyArIHNvdXJjZS5faWQgKyAnL2VkaXQnLCBjb25maWc6IG0ucm91dGUgfSwgJ0VkaXQgU291cmNlJylcbiAgICAgICAgICBdKVxuICAgICAgICB9KVxuICAgICAgXSlcbiAgICBdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZEVkaXQ7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciBmaW5kTGlua3MgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2ZpbmQtbGlua3MnKTtcblxudmFyIEZlZWRJdGVtID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIGNvbmRpdGlvbmFsRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbGVtZW50cyA9IFtdO1xuXG4gICAgICBpZiAoYXJncy52aWRlbykge1xuICAgICAgICBlbGVtZW50cy5wdXNoKG0oJ3ZpZGVvJywgeyBjb250cm9sczogJ2NvbnRyb2xzJywgc3JjOiBhcmdzLnZpZGVvIH0pKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJncy5waWN0dXJlKSB7XG4gICAgICAgIGVsZW1lbnRzLnB1c2gobSgnaW1nJywgeyBzcmM6IGFyZ3MucGljdHVyZSwgYWx0OiBhcmdzLmRlc2NyaXB0aW9uIH0pKTtcbiAgICAgIH1cbiAgICAgIGlmIChhcmdzLmxpbmspIHtcbiAgICAgICAgZWxlbWVudHMucHVzaChtKCdhLm1haW4tbGluaycsIHsgaHJlZjogYXJncy5saW5rLCB0YXJnZXQ6ICdfYmxhbmsnIH0sIGFyZ3MubmFtZSB8fCBhcmdzLmxpbmspKTtcbiAgICAgIH1cbiAgICAgIGlmIChhcmdzLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIGVsZW1lbnRzLnB1c2gobSgncCcsIG0udHJ1c3QoZmluZExpbmtzKGFyZ3MuZGVzY3JpcHRpb24pKSkpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3MuY2FwdGlvbikge1xuICAgICAgICBlbGVtZW50cy5wdXNoKG0oJ3NtYWxsJywgYXJncy5jYXB0aW9uKSk7XG4gICAgICB9XG4gICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gbSgnZGl2Lm1lZGlhLXdyYXAnLCBbXG4gICAgICAgICAgZWxlbWVudHNcbiAgICAgICAgXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgICAgIGVsZW1lbnRzXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdGltZTogYXJncy50aW1lLnNsaWNlKDAsIDEwKSxcbiAgICAgIGZyb206IGFyZ3MuZnJvbSxcbiAgICAgIG1lc3NhZ2U6IG0udHJ1c3QoZmluZExpbmtzKGFyZ3MubWVzc2FnZSkpLFxuICAgICAgZWxlbWVudHM6IGNvbmRpdGlvbmFsRWxlbWVudHMoKVxuICAgIH1cbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdhcnRpY2xlLmZlZWQtaXRlbScsIFtcbiAgICAgIG0oJ2FbaHJlZj1odHRwczovL2ZhY2Vib29rLmNvbS8nICsgY3RybC5mcm9tLmlkICArICddJywgeyB0YXJnZXQ6ICdfYmxhbmsnfSwgW1xuICAgICAgICBtKCdoNScsIGN0cmwuZnJvbS5uYW1lICsgJyAtICcgKyBjdHJsLnRpbWUpXG4gICAgICBdKSxcbiAgICAgIG0oJ2g0JywgY3RybC5tZXNzYWdlKSxcbiAgICAgIGN0cmwuZWxlbWVudHNcbiAgICBdKVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRJdGVtO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xudmFyIEZlZWRMaXN0aW5nID0gcmVxdWlyZSgnLi4vZmVlZHMvZmVlZC1saXN0aW5nJyk7XG52YXIgRmVlZHMgPSByZXF1aXJlKCcuL21vZGVscy9mZWVkcycpO1xuXG52YXIgRmVlZExpc3QgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IGZlZWRzOiBGZWVkcygpIH1cbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIGxheW91dEhlbHBlcih7XG4gICAgICBtZW51OiBMb2dnZWRJbk1lbnUsXG4gICAgICB1c2VySWQ6IG0ucm91dGUucGFyYW0oJ2lkJyksXG5cbiAgICAgIGZlZWRTZWxlY3Q6IEZlZWRTZWxlY3QsXG4gICAgICBmZWVkczogY3RybC5mZWVkcygpLnVzZXIuZmVlZHMsXG4gICAgICBjdXJyZW50RmVlZDogJ3NlbGVjdC1mZWVkJyxcbiAgICB9KTtcbiAgICByZXR1cm4gbSgnc2VjdGlvbi5jb250ZW50LXBhcnQnLCBbXG4gICAgICBtKCdoMicsICdGZWVkcycpLFxuICAgICAgY3RybC5mZWVkcygpLmRhdGEubWFwKGZ1bmN0aW9uKGZlZWQpIHtcbiAgICAgICAgcmV0dXJuIG0uY29tcG9uZW50KEZlZWRMaXN0aW5nLCB7IGZlZWRJZDogZmVlZC5faWQsIHRpdGxlOiBmZWVkLnRpdGxlLCB1c2VySWQ6IGN0cmwuZmVlZHMoKS51c2VyLmlkIH0pO1xuICAgICAgfSlcbiAgICBdKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkTGlzdDtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG52YXIgRmVlZExpc3RpbmcgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGFyZ3MuaWQsXG4gICAgICB0aXRsZTogYXJncy50aXRsZSxcbiAgICAgIHVzZXJJZDogYXJncy51c2VySWQsXG4gICAgICBmZWVkSWQ6IGFyZ3MuZmVlZElkXG4gICAgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIG0oJ2Rpdi5saXN0ZWQtaXRlbScsIFtcbiAgICAgIG0oJ2g0JywgW1xuICAgICAgICBtKCdhJywgeyBocmVmOiAnL3VzZXJzLycgKyBjdHJsLnVzZXJJZCArICcvZmVlZHMvJyArIGN0cmwuZmVlZElkLCBjb25maWc6IG0ucm91dGUgfSwgY3RybC50aXRsZSlcbiAgICAgIF0pLFxuICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy8nICsgY3RybC51c2VySWQgKyAnL2ZlZWRzLycgKyBjdHJsLmZlZWRJZCArICcvZWRpdCcsIGNvbmZpZzogbS5yb3V0ZSB9LCAnU2V0dGluZ3MnKVxuICAgIF0pXG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZExpc3Rpbmc7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcbnZhciBsYXlvdXRIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheW91dC1oZWxwZXInKTtcbnZhciBMb2dnZWRJbk1lbnUgPSByZXF1aXJlKCcuLi9sYXlvdXQvbG9nZ2VkLWluLW1lbnUuanMnKTtcbnZhciBGZWVkU2VsZWN0ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2ZlZWQtc2VsZWN0Jyk7XG52YXIgRmVlZHMgPSByZXF1aXJlKCcuL21vZGVscy9mZWVkcycpO1xuXG52YXIgRmVlZE5ldyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNyZWF0ZUZlZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzL25ldycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0aXRsZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3RpdGxlJylbMF0udmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgfSlcbiAgICAgIC50aGVuKGF1dGhvcml6ZUhlbHBlcilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzJyk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiB7IGNyZWF0ZUZlZWQ6IGNyZWF0ZUZlZWQsIGZlZWRzOiBGZWVkcygpIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgZmVlZHM6IGN0cmwuZmVlZHMoKS51c2VyLmZlZWRzLFxuICAgICAgY3VycmVudEZlZWQ6ICdzZWxlY3QtZmVlZCcsXG4gICAgfSk7XG4gICAgcmV0dXJuIG0oJ2Rpdi5jb250ZW50LXBhcnQnLCBbXG4gICAgICBtKCdoMicsICdDcmVhdGUgRmVlZCcpLFxuICAgICAgbSgnZGl2LmlucHV0LWJsb2NrJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAndGl0bGUnLCBwbGFjZWhvbGRlcjogJ2ZlZWQgbmFtZScgfSlcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LnN1Ym1pdC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuY3JlYXRlRmVlZCwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnQ3JlYXRlIEZlZWQnIH0pXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZE5ldztcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGF1dGhvcml6ZUhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXV0aG9yaXplLWhlbHBlcicpO1xudmFyIGxheW91dEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5b3V0LWhlbHBlcicpO1xudmFyIExvZ2dlZEluTWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtaW4tbWVudScpO1xudmFyIEZlZWRTZWxlY3QgPSByZXF1aXJlKCcuLi9sYXlvdXQvZmVlZC1zZWxlY3QnKTtcbnZhciBSZWZyZXNoQnV0dG9uID0gcmVxdWlyZSgnLi4vbGF5b3V0L3JlZnJlc2gtYnV0dG9uJyk7XG52YXIgRmVlZFJlc3VsdHMgPSByZXF1aXJlKCcuL21vZGVscy9mZWVkLXJlc3VsdHMnKTtcbnZhciBTZWFyY2hSZXN1bHRzID0gcmVxdWlyZSgnLi9tb2RlbHMvc2VhcmNoLXJlc3VsdHMnKTtcbnZhciBGZWVkSXRlbSA9IHJlcXVpcmUoJy4vZmVlZC1pdGVtJyk7XG52YXIgU2VhcmNoSWNvbiA9IHJlcXVpcmUoJy4uL2xheW91dC9zZWFyY2gtaWNvbicpO1xuXG52YXIgU2VhcmNoQmFyID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIHNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyksIG0uY29tcG9uZW50KEZlZWRTaG93LCB7IHF1ZXJ5OiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncXVlcnknKVswXS52YWx1ZSB9KSk7XG4gICAgfVxuICAgIGlmIChhcmdzICYmIGFyZ3MucXVlcnkpIHtcbiAgICAgIHJldHVybiB7IHNlYXJjaDogc2VhcmNoLCBxdWVyeTogYXJncy5xdWVyeSB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IHNlYXJjaDogc2VhcmNoIH1cbiAgICB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBpZiAoY3RybC5xdWVyeSkge1xuICAgICAgcmV0dXJuIG0oJ2Rpdi5zZWFyY2gtY29udGFpbmVyJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAncXVlcnknLCB2YWx1ZTogY3RybC5xdWVyeSB9KSxcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuc2VhcmNoLCB0eXBlOiAnc3VibWl0JywgbmFtZTogJ3NlYXJjaCcsIHZhbHVlOiAnR28nIH0pLFxuICAgICAgXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtKCdkaXYuc2VhcmNoLWNvbnRhaW5lcicsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3F1ZXJ5JyB9KSxcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuc2VhcmNoLCB0eXBlOiAnc3VibWl0JywgbmFtZTogJ3NlYXJjaCcsIHZhbHVlOiAnR28nIH0pLFxuICAgICAgXSk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgRmVlZFNob3cgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICBpZiAoYXJncyAmJiBhcmdzLnF1ZXJ5KSB7XG4gICAgICByZXR1cm4geyBmZWVkUmVzdWx0czogU2VhcmNoUmVzdWx0cyhhcmdzLnF1ZXJ5KSwgcXVlcnk6IGFyZ3MucXVlcnkgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgZmVlZFJlc3VsdHM6IEZlZWRSZXN1bHRzKCkgfTtcbiAgICB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgZmVlZHM6IGN0cmwuZmVlZFJlc3VsdHMoKS51c2VyLmZlZWRzLFxuICAgICAgY3VycmVudEZlZWQ6IG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpLFxuXG4gICAgICByZWZyZXNoQnV0dG9uOiBSZWZyZXNoQnV0dG9uLFxuXG4gICAgICBzZWFyY2hCYXI6IFNlYXJjaEJhcixcbiAgICAgIHNlYXJjaEljb246IFNlYXJjaEljb24sXG4gICAgICBxdWVyeTogY3RybC5xdWVyeSB8fCBmYWxzZVxuICAgIH0pO1xuICAgIGlmIChjdHJsLmZlZWRSZXN1bHRzKCkuZGF0YS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gbSgncC5mZWVkLWVycm9yJywgY3RybC5mZWVkUmVzdWx0cygpLm1lc3NhZ2UpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtKCdkaXYnLCBbXG4gICAgICAgIGN0cmwuZmVlZFJlc3VsdHMoKS5kYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIG0uY29tcG9uZW50KEZlZWRJdGVtLCB7XG4gICAgICAgICAgICB0aW1lOiBpdGVtLmNyZWF0ZWRfdGltZSxcbiAgICAgICAgICAgIGZyb206IGl0ZW0uZnJvbSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGl0ZW0ubWVzc2FnZSB8fCBpdGVtLnN0b3J5LFxuICAgICAgICAgICAgdmlkZW86IGl0ZW0uc291cmNlLFxuICAgICAgICAgICAgcGljdHVyZTogaXRlbS5mdWxsX3BpY3R1cmUsXG4gICAgICAgICAgICBuYW1lOiBpdGVtLm5hbWUsXG4gICAgICAgICAgICBsaW5rOiBpdGVtLmxpbmssXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogaXRlbS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNhcHRpb246IGl0ZW0uY2FwdGlvbixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgIF0pO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkU2hvdztcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGF1dGhvcml6ZUhlbHBlciA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvYXV0aG9yaXplLWhlbHBlcicpO1xuXG52YXIgRmVlZEluZm8gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvZWRpdCcsXG4gICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzXG4gIH0pLnRoZW4oYXV0aG9yaXplSGVscGVyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZEluZm87XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcblxudmFyIEZlZWRSZXN1bHRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyksXG4gICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzXG4gIH0pLnRoZW4oYXV0aG9yaXplSGVscGVyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZFJlc3VsdHM7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcblxudmFyIEZlZWRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcycsXG4gICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzXG4gIH0pLnRoZW4oYXV0aG9yaXplSGVscGVyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZHM7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcblxudmFyIFNlYXJjaFJlc3VsdHMgPSBmdW5jdGlvbihxdWVyeSkge1xuICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy8nICsgcXVlcnksXG4gICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaFJlc3VsdHM7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxuLy8gY2hlY2sgaWYgcmVxdWVzdCByZXNwb25zZSBpcyBhdXRob3JpemVkXG5mdW5jdGlvbiBhdXRob3JpemVIZWxwZXIocmVzcG9uc2UpIHtcbiAgaWYgKCFyZXNwb25zZS5hdXRob3JpemVGYWlsKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UubWVzc2FnZSk7XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm1lc3NhZ2UpO1xuICAgIG0ucm91dGUoJy8nKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGF1dGhvcml6ZUhlbHBlcjtcbiIsIi8vIHBhcnNlIHN0cmluZ3MgYW5kIHR1cm4gdXJscyBpbnRvIGxpbmtzXG5mdW5jdGlvbiBmaW5kTGlua3Moc3RyaW5nKSB7XG4gIC8vIHNlcGVyYXRlIHN0cmluZyBpbnRvIGFycmF5IGJ5IHNwYWNlcyBhbmQgcmV0dXJuc1xuICB2YXIgd29yZEFycmF5ID0gc3RyaW5nLnNwbGl0KC9bIFxcclxcbl0vKTtcblxuICAvLyBsb29wIHRocm91Z2ggYXJyYXkgYW5kIHR1cm4gdXJsIGludG8gYW5jaG9yIHRhZ1xuICBmb3IgKHZhciBuID0gMDsgbiA8IHdvcmRBcnJheS5sZW5ndGg7IG4rKykge1xuICAgIGlmICh3b3JkQXJyYXlbbl0uc2xpY2UoMCwgNCkgPT09ICdodHRwJykge1xuICAgICAgd29yZEFycmF5LnNwbGljZShuLCAxLCAnPGEgaHJlZj0nICsgd29yZEFycmF5W25dICsgJyB0YXJnZXQ9X2JsYW5rPicgKyB3b3JkQXJyYXlbbl0gKyAnPC9hPicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3b3JkQXJyYXkuam9pbignICcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRMaW5rcztcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIE1lbnVJY29uID0gcmVxdWlyZSgnLi4vbGF5b3V0L21lbnUtaWNvbicpO1xuXG5mdW5jdGlvbiBsYXlvdXRIZWxwZXIoYXJncykge1xuXG4gIHZhciBzZWFyY2hEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWJhcicpO1xuICB2YXIgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci13cmFwJyk7XG4gIHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQtd3JhcCcpO1xuXG4gIG0ubW91bnQoXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtaWNvbicpLFxuICAgIG0uY29tcG9uZW50KE1lbnVJY29uKVxuICApO1xuXG4gIG0ubW91bnQoXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKSxcbiAgICBtLmNvbXBvbmVudChhcmdzLm1lbnUsIHsgdXNlcklkOiBhcmdzLnVzZXJJZCB9KVxuICApO1xuXG4gIGlmIChhcmdzLmZlZWRTZWxlY3QpIHtcbiAgICBtLm1vdW50KFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZlZWQtc2VsZWN0JyksXG4gICAgICBtLmNvbXBvbmVudChhcmdzLmZlZWRTZWxlY3QsIHsgZmVlZHM6IGFyZ3MuZmVlZHMsIGN1cnJlbnRGZWVkOiBhcmdzLmN1cnJlbnRGZWVkIH0pXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmZWVkLXNlbGVjdCcpLCBudWxsKTtcbiAgfVxuXG4gIGlmIChhcmdzLnJlZnJlc2hCdXR0b24pIHtcbiAgICBtLm1vdW50KFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZnJlc2gtYnV0dG9uJyksXG4gICAgICBtLmNvbXBvbmVudChhcmdzLnJlZnJlc2hCdXR0b24pXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWZyZXNoLWJ1dHRvbicpLCBudWxsKTtcbiAgfVxuXG4gIGlmIChhcmdzLnNlYXJjaEJhcikge1xuICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1pY29uJyksIGFyZ3Muc2VhcmNoSWNvbik7XG4gICAgaWYgKGFyZ3MucXVlcnkpIHtcbiAgICAgIG0ubW91bnQoXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJyksXG4gICAgICAgIG0uY29tcG9uZW50KGFyZ3Muc2VhcmNoQmFyLCB7IHF1ZXJ5OiBhcmdzLnF1ZXJ5IH0pXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBtLm1vdW50KFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWJhcicpLFxuICAgICAgICBtLmNvbXBvbmVudChhcmdzLnNlYXJjaEJhcilcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlYXJjaERpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGNvbnRlbnQuc3R5bGUubWFyZ2luVG9wID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDEwICsgJ3B4JztcblxuICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1iYXInKSwgbnVsbCk7XG4gICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWljb24nKSwgbnVsbCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsYXlvdXRIZWxwZXI7XG4iLCIvLyBlbmNvZGUgcmVxdWVzdHNcbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgdmFyIHN0ciA9IFtdO1xuICBmb3IodmFyIHAgaW4gb2JqKVxuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChvYmpbcF0pKTtcbiAgICB9XG4gIHJldHVybiBzdHIuam9pbignJicpO1xufVxuXG4vLyBzZXQgY29udGVudCB0eXBlIGZvciByZXF1ZXN0IGhlYWRlclxuZnVuY3Rpb24gYXNGb3JtVXJsRW5jb2RlZCh4aHIpIHtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xufVxuXG4vLyBjb252ZXJ0IG5vbi1qc29uIGVycm9ycyB0byBqc29uXG5mdW5jdGlvbiBub25Kc29uRXJyb3JzKHhocikge1xuICByZXR1cm4geGhyLnN0YXR1cyA+IDIwMCA/IEpTT04uc3RyaW5naWZ5KHhoci5yZXNwb25zZVRleHQpIDogeGhyLnJlc3BvbnNlVGV4dFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2VyaWFsaXplOiBzZXJpYWxpemUsXG4gIGFzRm9ybVVybEVuY29kZWQ6IGFzRm9ybVVybEVuY29kZWQsXG4gIG5vbkpzb25FcnJvcnM6IG5vbkpzb25FcnJvcnNcbn07XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIEZlZWRTZWxlY3QgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgY2hhbmdlRmVlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudmFsdWUgPT09ICdzZWxlY3QtZmVlZCcpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgdGhpcy52YWx1ZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4geyBjaGFuZ2VGZWVkOiBjaGFuZ2VGZWVkLCBjdXJyZW50RmVlZDogYXJncy5jdXJyZW50RmVlZCwgZmVlZHM6IGFyZ3MuZmVlZHMgfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdzZWxlY3QnLCB7IG9uY2hhbmdlOiBjdHJsLmNoYW5nZUZlZWQsIHZhbHVlOiBjdHJsLmN1cnJlbnRGZWVkIHx8ICdzZWxlY3QtZmVlZCcgfSwgW1xuICAgICAgbSgnb3B0aW9uJywgeyB2YWx1ZTogJ3NlbGVjdC1mZWVkJyB9LCAnU2VsZWN0IEZlZWQnKSxcbiAgICAgIGN0cmwuZmVlZHMubWFwKGZ1bmN0aW9uKGZlZWQpIHtcbiAgICAgICAgcmV0dXJuIG0oJ29wdGlvbicsIHsgdmFsdWU6IGZlZWQuX2lkIH0sIGZlZWQudGl0bGUpO1xuICAgICAgfSlcbiAgICBdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZFNlbGVjdDtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG52YXIgTG9nZ2VkSW5NZW51ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgcmV0dXJuIHsgdXNlcklkOiBhcmdzLnVzZXJJZH1cbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdkaXYnLCBbXG4gICAgICBtKCdsaScsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy8nICsgY3RybC51c2VySWQsIGNvbmZpZzogbS5yb3V0ZSB9LCAnUHJvZmlsZScpLFxuICAgICAgXSksXG4gICAgICBtKCdsaScsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy8nICsgY3RybC51c2VySWQgKyAnL2ZlZWRzJywgY29uZmlnOiBtLnJvdXRlIH0sICdGZWVkcycpLFxuICAgICAgXSksXG4gICAgICBtKCdsaScsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy8nICsgY3RybC51c2VySWQgKyAnL2ZlZWRzL25ldycsIGNvbmZpZzogbS5yb3V0ZSB9LCAnTmV3IEZlZWQnKSxcbiAgICAgIF0pLFxuICAgICAgbSgnbGknLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvdXNlcnMvJyArIGN0cmwudXNlcklkICsgJy9lZGl0JywgY29uZmlnOiBtLnJvdXRlIH0sICdFZGl0IEFjY291bnQnKSxcbiAgICAgIF0pLFxuICAgICAgbSgnbGknLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvbG9nb3V0JywgY29uZmlnOiBtLnJvdXRlIH0sICdMb2dvdXQnKVxuICAgICAgXSlcbiAgICBdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nZ2VkSW5NZW51O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbnZhciBMb2dnZWRPdXRNZW51ID0ge1xuICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgbSgnbGknLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvJywgY29uZmlnOiBtLnJvdXRlIH0sICdMb2dpbicpLFxuICAgICAgXSksXG4gICAgICBtKCdsaScsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy9uZXcnLCBjb25maWc6IG0ucm91dGUgfSwgJ0NyZWF0ZSBBY2NvdW50JylcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2dlZE91dE1lbnU7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIE1lbnVJY29uID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci13cmFwJyk7XG4gICAgdmFyIG1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudScpO1xuICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQtd3JhcCcpO1xuXG4gICAgdmFyIHNob3dNZW51ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIW1lbnUuc3R5bGUuZGlzcGxheSB8fCBtZW51LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykge1xuICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBjb250ZW50LnN0eWxlLm1hcmdpblRvcCA9IGhlYWRlci5vZmZzZXRIZWlnaHQgKyAxMCArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGNvbnRlbnQuc3R5bGUubWFyZ2luVG9wID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDEwICsgJ3B4JztcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB7IHNob3dNZW51OiBzaG93TWVudSB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIG0oJ3NwYW4nLCB7IG9uY2xpY2s6IGN0cmwuc2hvd01lbnUgfSwgbS50cnVzdCgnJiM5Nzc2OycpKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudUljb247XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIFJlZnJlc2hCdXR0b24gPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWZyZXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSk7XG4gICAgfVxuICAgIHJldHVybiB7IHJlZnJlc2g6IHJlZnJlc2ggfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdzcGFuJywgeyBvbmNsaWNrOiBjdHJsLnJlZnJlc2ggfSwgbS50cnVzdCgnJiMxMDIyNzsnKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWZyZXNoQnV0dG9uO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbnZhciBTZWFyY2hJY29uID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2hvd0JhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlYXJjaERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJyk7XG4gICAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci13cmFwJyk7XG4gICAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50LXdyYXAnKTtcblxuICAgICAgaWYgKCFzZWFyY2hEaXYuc3R5bGUuZGlzcGxheSB8fCBzZWFyY2hEaXYuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgIHNlYXJjaERpdi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgY29udGVudC5zdHlsZS5tYXJnaW5Ub3AgPSBoZWFkZXIub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VhcmNoRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGNvbnRlbnQuc3R5bGUubWFyZ2luVG9wID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDEwICsgJ3B4JztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgc2hvd0Jhcjogc2hvd0JhciB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIG0oJ3NwYW4nLCB7IG9uY2xpY2s6IGN0cmwuc2hvd0Jhcn0sIG0udHJ1c3QoJyYjOTkwNjsnKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWFyY2hJY29uO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkT3V0TWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtb3V0LW1lbnUuanMnKTtcblxudmFyIExvZ2luID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZW1haWw6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdlbWFpbCcpWzBdLnZhbHVlLFxuICAgICAgICAgIHBhc3N3b3JkOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncGFzc3dvcmQnKVswXS52YWx1ZVxuICAgICAgICB9LFxuICAgICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5mYWlsKSB7XG5cbiAgICAgICAgICBtLnJvdXRlKFxuICAgICAgICAgICAgJy91c2Vycy8nXG4gICAgICAgICAgICArIHJlc3BvbnNlLnVzZXIuaWRcbiAgICAgICAgICAgICsgJy9mZWVkcy8nXG4gICAgICAgICAgICArIChyZXNwb25zZS51c2VyLmRlZmF1bHRGZWVkIHx8IHJlc3BvbnNlLnVzZXIuZmVlZHNbMF0uX2lkIHx8ICduZXcnKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnZW1haWwnKVswXS52YWx1ZSA9ICcnO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdwYXNzd29yZCcpWzBdLnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBmb3JtID0ge1xuICAgICAgZW1haWw6IG0ucHJvcCgnJylcbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgbG9naW46IGxvZ2luLCBmb3JtOiBmb3JtIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkT3V0TWVudVxuICAgIH0pO1xuICAgIHJldHVybiBtKCdzZWN0aW9uLmNvbnRlbnQtcGFydCcsIFtcbiAgICAgIG0oJ2gyJywgJ0xvZ2luJyksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyBuYW1lOiAnZW1haWwnLCB0eXBlOiAnZW1haWwnLCBwbGFjZWhvbGRlcjogJ2VtYWlsJywgb25jaGFuZ2U6IG0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5mb3JtLmVtYWlsKSwgdmFsdWU6IGN0cmwuZm9ybS5lbWFpbCgpIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IG5hbWU6ICdwYXNzd29yZCcsIHR5cGU6ICdwYXNzd29yZCcsIHBsYWNlaG9sZGVyOiAncGFzc3dvcmQnIH0pLFxuICAgICAgXSksXG4gICAgICBtKCdkaXYuc3VibWl0LWJsb2NrJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC5sb2dpbiwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnTG9naW4nIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ3AnLCAnRG9uXFwndCBoYXZlIGFuIGFjY291bnQ/ICcsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy9uZXcnLCBjb25maWc6IG0ucm91dGUgfSwgJ1NpZ24gVXAgZm9yIEZyZWUnKVxuICAgICAgXSksXG4gICAgICBtKCdhJywgeyBocmVmOiAnL3JlcXVlc3QtcGFzc3dvcmQnLCBjb25maWc6IG0ucm91dGUgfSwgJ0ZvcmdvdCB5b3VyIHBhc3N3b3JkPycpXG4gICAgXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2luO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG5cbnZhciBMb2dvdXQgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiAnR0VUJywgdXJsOiAnL2xvZ291dCcsIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIG0ucm91dGUoJy8nKTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ291dDtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGxheW91dEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5b3V0LWhlbHBlcicpO1xudmFyIGF1dGhvcml6ZUhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXV0aG9yaXplLWhlbHBlcicpO1xudmFyIExvZ2dlZEluTWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtaW4tbWVudS5qcycpO1xudmFyIEZlZWRTZWxlY3QgPSByZXF1aXJlKCcuLi9sYXlvdXQvZmVlZC1zZWxlY3QnKTtcblxudmFyIFNvdXJjZUluZm8gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy8nICsgbS5yb3V0ZS5wYXJhbSgnc291cmNlSWQnKSArICcvZWRpdCcsXG4gICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzXG4gIH0pLnRoZW4oYXV0aG9yaXplSGVscGVyKTtcbn07XG5cbnZhciBTb3VyY2VFZGl0ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXBkYXRlU291cmNlID0gZnVuY3Rpb24oKSB7XG4gICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy8nICsgbS5yb3V0ZS5wYXJhbSgnc291cmNlSWQnKSArICcvZWRpdCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBuYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnbmFtZScpWzBdLnZhbHVlLFxuICAgICAgICAgIHZhbHVlOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgndmFsdWUnKVswXS52YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oYXV0aG9yaXplSGVscGVyKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy8nICsgbS5yb3V0ZS5wYXJhbSgnc291cmNlSWQnKSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4geyBzb3VyY2VJbmZvOiBTb3VyY2VJbmZvKCksIHVwZGF0ZVNvdXJjZTogdXBkYXRlU291cmNlIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJyksIG51bGwpO1xuICAgIGxheW91dEhlbHBlcih7XG4gICAgICBtZW51OiBMb2dnZWRJbk1lbnUsXG4gICAgICB1c2VySWQ6IG0ucm91dGUucGFyYW0oJ2lkJyksXG5cbiAgICAgIGZlZWRTZWxlY3Q6IEZlZWRTZWxlY3QsXG4gICAgICBmZWVkczogY3RybC5zb3VyY2VJbmZvKCkudXNlci5mZWVkcyxcbiAgICAgIGN1cnJlbnRGZWVkOiAnc2VsZWN0LWZlZWQnLFxuICAgIH0pO1xuICAgIHJldHVybiBtKCdkaXYnLCBbXG4gICAgICBtKCdkaXYnLCBbXG4gICAgICAgIG0oJ2gyJywgJ0VkaXQgU291cmNlJyksXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICduYW1lJywgcGxhY2Vob2xkZXI6ICdlZGl0IG5hbWUnLCB2YWx1ZTogY3RybC5zb3VyY2VJbmZvKCkuZGF0YS5uYW1lIHx8ICcnfSksXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICd2YWx1ZScsIHBsYWNlaG9sZGVyOiAnZWRpdCB2YWx1ZScsIHZhbHVlOiBjdHJsLnNvdXJjZUluZm8oKS5kYXRhLnZhbHVlIHx8ICcnIH0pLFxuICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC51cGRhdGVTb3VyY2UsIHR5cGU6ICdzdWJtaXQnLCB2YWx1ZTogJ1VwZGF0ZSBTb3VyY2UnIH0pXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3VyY2VFZGl0O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51Jyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xudmFyIFJlZnJlc2hCdXR0b24gPSByZXF1aXJlKCcuLi9sYXlvdXQvcmVmcmVzaC1idXR0b24nKTtcblxuLy9cbi8vIHZhciBTb3VyY2VJdGVtcyA9IGZ1bmN0aW9uKCkge1xuLy8gICByZXR1cm4gbS5yZXF1ZXN0KHtcbi8vICAgICBtZXRob2Q6ICdHRVQnLFxuLy8gICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpLFxuLy8gICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbi8vICAgfSkudGhlbihhdXRob3JpemVIZWxwZXIpO1xuLy8gfTtcbi8vXG4vLyB2YXIgU2VhcmNoUmVzdWx0cyA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4vLyAgIHJldHVybiBtLnJlcXVlc3Qoe1xuLy8gICAgIG1ldGhvZDogJ0dFVCcsXG4vLyAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnLycgKyBxdWVyeSxcbi8vICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4vLyAgIH0pLnRoZW4oYXV0aG9yaXplSGVscGVyKTtcbi8vIH07XG4vL1xuLy8gdmFyIFNlYXJjaEJhciA9IHtcbi8vICAgY29udHJvbGxlcjogZnVuY3Rpb24oYXJncykge1xuLy8gICAgIHZhciBzZWFyY2ggPSBmdW5jdGlvbigpIHtcbi8vICAgICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpLCBtLmNvbXBvbmVudChGZWVkU2hvdywgeyBxdWVyeTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3F1ZXJ5JylbMF0udmFsdWUgfSkpO1xuLy8gICAgIH1cbi8vICAgICBpZiAoYXJncyAmJiBhcmdzLnF1ZXJ5KSB7XG4vLyAgICAgICByZXR1cm4geyBzZWFyY2g6IHNlYXJjaCwgcXVlcnk6IGFyZ3MucXVlcnkgfVxuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICByZXR1cm4geyBzZWFyY2g6IHNlYXJjaCB9XG4vLyAgICAgfVxuLy8gICB9LFxuLy8gICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4vLyAgICAgaWYgKGN0cmwucXVlcnkpIHtcbi8vICAgICAgIHJldHVybiBtKCdkaXYjc2VhcmNoLWNvbnRhaW5lcicsIFtcbi8vICAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3F1ZXJ5JywgdmFsdWU6IGN0cmwucXVlcnkgfSksXG4vLyAgICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLnNlYXJjaCwgdHlwZTogJ3N1Ym1pdCcsIG5hbWU6ICdzZWFyY2gnLCB2YWx1ZTogJ0dvJyB9KSxcbi8vICAgICAgIF0pO1xuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICByZXR1cm4gbSgnZGl2I3NlYXJjaC1jb250YWluZXInLCBbXG4vLyAgICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICdxdWVyeScgfSksXG4vLyAgICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLnNlYXJjaCwgdHlwZTogJ3N1Ym1pdCcsIG5hbWU6ICdzZWFyY2gnLCB2YWx1ZTogJ0dvJyB9KSxcbi8vICAgICAgIF0pO1xuLy8gICAgIH1cbi8vXG4vLyAgIH1cbi8vIH07XG5cbi8vIHZhciBGZWVkSXRlbSA9IHtcbi8vICAgY29udHJvbGxlcjogZnVuY3Rpb24oYXJncykge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICB0aW1lOiBhcmdzLnRpbWUsXG4vLyAgICAgICBmcm9tOiBhcmdzLmZyb20sXG4vLyAgICAgICBtZXNzYWdlOiBhcmdzLm1lc3NhZ2UsXG4vLyAgICAgICBwaWN0dXJlOiBhcmdzLnBpY3R1cmUsXG4vLyAgICAgICBkZXNjcmlwdGlvbjogYXJncy5kZXNjcmlwdGlvblxuLy8gICAgIH1cbi8vICAgfSxcbi8vICAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuLy8gICAgIHJldHVybiBtKCdhcnRpY2xlJywgW1xuLy8gICAgICAgbSgncCcsIGN0cmwudGltZSksXG4vLyAgICAgICBtKCdhW2hyZWY9aHR0cHM6Ly9mYWNlYm9vay5jb20vJyArIGN0cmwuZnJvbS5pZCAgKyAnXScsIHsgdGFyZ2V0OiAnX2JsYW5rJ30sIGN0cmwuZnJvbS5uYW1lKSxcbi8vICAgICAgIG0oJ2g1JywgY3RybC5tZXNzYWdlKSxcbi8vICAgICAgIG0oJ2ltZycsIHsgc3JjOiBjdHJsLnBpY3R1cmUsIGFsdDogY3RybC5kZXNjcmlwdGlvbiB9KSxcbi8vICAgICAgIG0oJ3AnLCBjdHJsLmRlc2NyaXB0aW9uKVxuLy8gICAgIF0pXG4vLyAgIH1cbi8vIH07XG5cbnZhciBTb3VyY2VTaG93ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgLy8gaWYgKGFyZ3MgJiYgYXJncy5xdWVyeSkge1xuICAgIC8vICAgcmV0dXJuIHsgZmVlZEl0ZW1zOiBTZWFyY2hSZXN1bHRzKGFyZ3MucXVlcnkpLCBxdWVyeTogYXJncy5xdWVyeSB9O1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICByZXR1cm4geyBmZWVkSXRlbXM6IEZlZWRJdGVtcygpIH07XG4gICAgLy8gfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZEluTWVudSxcbiAgICAgIHVzZXJJZDogbS5yb3V0ZS5wYXJhbSgnaWQnKSxcblxuICAgICAgLy8gZmVlZFNlbGVjdDogRmVlZFNlbGVjdCxcbiAgICAgIC8vIGZlZWRzOiBjdHJsLmZlZWRJdGVtcygpLnVzZXIuZmVlZHMsXG4gICAgICAvLyBjdXJyZW50RmVlZDogbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyksXG4gICAgICAvL1xuICAgICAgLy8gcmVmcmVzaEJ1dHRvbjogUmVmcmVzaEJ1dHRvbixcbiAgICB9KTtcbiAgICAvLyBpZiAoY3RybC5xdWVyeSkge1xuICAgIC8vICAgbS5tb3VudChcbiAgICAvLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1iYXInKSxcbiAgICAvLyAgICAgbS5jb21wb25lbnQoU2VhcmNoQmFyLCB7IHF1ZXJ5OiBjdHJsLnF1ZXJ5IH0pXG4gICAgLy8gICApO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICBtLm1vdW50KFxuICAgIC8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWJhcicpLFxuICAgIC8vICAgICBtLmNvbXBvbmVudChTZWFyY2hCYXIpXG4gICAgLy8gICApO1xuICAgIC8vIH1cbiAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgLy8gY3RybC5mZWVkSXRlbXMoKS5kYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAvLyAgIHJldHVybiBtLmNvbXBvbmVudChGZWVkSXRlbSwge1xuICAgICAgLy8gICAgIHRpbWU6IGl0ZW0uY3JlYXRlZF90aW1lLFxuICAgICAgLy8gICAgIGZyb206IGl0ZW0uZnJvbSxcbiAgICAgIC8vICAgICBtZXNzYWdlOiBpdGVtLm1lc3NhZ2UgfHwgaXRlbS5zdG9yeSxcbiAgICAgIC8vICAgICBwaWN0dXJlOiBpdGVtLnBpY3R1cmUsXG4gICAgICAvLyAgICAgZGVzY3JpcHRpb246IGl0ZW0uZGVzY3JpcHRpb25cbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9KVxuICAgICAgbSgnaDInLCAnU291cmNlIFNob3cgUGFnZScpXG4gICAgXSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU291cmNlU2hvdztcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGF1dGhvcml6ZUhlbHBlciA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvYXV0aG9yaXplLWhlbHBlcicpO1xuXG52YXIgVXNlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSxcbiAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnNcbiAgfSkudGhlbihhdXRob3JpemVIZWxwZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuL21vZGVscy91c2VyJyk7XG5cbnZhciBVc2VyRWRpdCA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVwZGF0ZVVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZWRpdCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlbWFpbDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2VtYWlsJylbMF0udmFsdWUsXG4gICAgICAgICAgZGVmYXVsdEZlZWQ6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdkZWZhdWx0RmVlZCcpWzBdLnZhbHVlLFxuICAgICAgICAgIHBhc3N3b3JkOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncGFzc3dvcmQnKVswXS52YWx1ZSxcbiAgICAgICAgICBjb25maXJtYXRpb246IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjb25maXJtYXRpb24nKVswXS52YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhLmZhaWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgIG0ucm91dGUoJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2VkaXQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdXNlcjogVXNlcigpLCB1cGRhdGVVc2VyOiB1cGRhdGVVc2VyIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgZmVlZHM6IGN0cmwudXNlcigpLmRhdGEuZmVlZHMsXG4gICAgICBjdXJyZW50RmVlZDogJ3NlbGVjdC1mZWVkJ1xuICAgIH0pO1xuICAgIHJldHVybiBtKCdkaXYuY29udGVudC1wYXJ0JywgW1xuICAgICAgbSgnaDInLCAnRWRpdCBBY2NvdW50JyksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAnZW1haWwnLCBuYW1lOiAnZW1haWwnLCB2YWx1ZTogY3RybC51c2VyKCkuZGF0YS5lbWFpbCB9KVxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2xhYmVsJywgJ0RlZmF1bHQgRmVlZCcpLFxuICAgICAgICBtKCdzZWxlY3QnLCB7IG5hbWU6ICdkZWZhdWx0RmVlZCcsIHZhbHVlOiBjdHJsLnVzZXIoKS5kYXRhLmRlZmF1bHRGZWVkIHx8ICdzZWxlY3QtZmVlZCcgfSwgW1xuICAgICAgICAgIG0oJ29wdGlvbicsIHsgdmFsdWU6ICcnIH0sICdTZWxlY3QgRmVlZCcpLFxuICAgICAgICAgIGN0cmwudXNlcigpLmRhdGEuZmVlZHMubWFwKGZ1bmN0aW9uKGZlZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBtKCdvcHRpb24nLCB7IHZhbHVlOiBmZWVkLl9pZCB9LCBmZWVkLnRpdGxlKVxuICAgICAgICAgIH0pXG4gICAgICAgIF0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICdwYXNzd29yZCcsIG5hbWU6ICdwYXNzd29yZCcsIHBsYWNlaG9sZGVyOiAncGFzc3dvcmQnIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICdwYXNzd29yZCcsIG5hbWU6ICdjb25maXJtYXRpb24nLCBwbGFjZWhvbGRlcjogJ2NvbmZpcm1hdGlvbicgfSlcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LnN1Ym1pdC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwudXBkYXRlVXNlciwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnVXBkYXRlIFVzZXInIH0pXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyRWRpdDtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGxheW91dEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5b3V0LWhlbHBlcicpO1xudmFyIExvZ2dlZE91dE1lbnUgPSByZXF1aXJlKCcuLi9sYXlvdXQvbG9nZ2VkLW91dC1tZW51LmpzJyk7XG5cbnZhciBVc2VyTmV3ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3JlYXRlVXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVybDogJy91c2Vycy9uZXcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZW1haWw6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdlbWFpbCcpWzBdLnZhbHVlLFxuICAgICAgICAgIHBhc3N3b3JkOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncGFzc3dvcmQnKVswXS52YWx1ZSxcbiAgICAgICAgICBjb25maXJtYXRpb246IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjb25maXJtYXRpb24nKVswXS52YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhLmZhaWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgIG0ucm91dGUoJy9sb2dpbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzL25ldycpO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdlbWFpbCcpWzBdLnZhbHVlID0gJyc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3Bhc3N3b3JkJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29uZmlybWF0aW9uJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGZvcm0gPSB7XG4gICAgICBlbWFpbDogbS5wcm9wKCcnKVxuICAgIH1cblxuICAgIHJldHVybiB7IGNyZWF0ZVVzZXI6IGNyZWF0ZVVzZXIsIGZvcm06IGZvcm0gfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIGxheW91dEhlbHBlcih7XG4gICAgICBtZW51OiBMb2dnZWRPdXRNZW51XG4gICAgfSk7XG4gICAgcmV0dXJuIG0oJ2Rpdi5jb250ZW50LXBhcnQnLCBbXG4gICAgICBtKCdoMicsICdDcmVhdGUgQWNjb3VudCcpLFxuICAgICAgbSgnZGl2LmlucHV0LWJsb2NrJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ2VtYWlsJywgbmFtZTogJ2VtYWlsJywgcGxhY2Vob2xkZXI6ICdlbWFpbCcsIG9uY2hhbmdlOiBtLndpdGhBdHRyKCd2YWx1ZScsIGN0cmwuZm9ybS5lbWFpbCksIHZhbHVlOiBjdHJsLmZvcm0uZW1haWwoKSB9KVxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAncGFzc3dvcmQnLCBuYW1lOiAncGFzc3dvcmQnLCBwbGFjZWhvbGRlcjogJ3Bhc3N3b3JkJyB9KSxcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LmlucHV0LWJsb2NrJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3Bhc3N3b3JkJywgbmFtZTogJ2NvbmZpcm1hdGlvbicsIHBsYWNlaG9sZGVyOiAnY29uZmlybWF0aW9uJyB9KSxcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LnN1Ym1pdC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuY3JlYXRlVXNlciwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnQ3JlYXRlIFVzZXInIH0pXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyTmV3O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xudmFyIEZlZWRMaXN0ID0gcmVxdWlyZSgnLi4vZmVlZHMvZmVlZC1saXN0Jyk7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4vbW9kZWxzL3VzZXInKTtcbnZhciBGZWVkTGlzdGluZyA9IHJlcXVpcmUoJy4uL2ZlZWRzL2ZlZWQtbGlzdGluZycpO1xudmFyIEZlZWRzID0gcmVxdWlyZSgnLi4vZmVlZHMvL21vZGVscy9mZWVkcycpO1xuXG52YXIgVXNlclNob3cgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWxldGVBY2NvdW50ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZScpKSB7XG4gICAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJyksXG4gICAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YS5mYWlsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgbS5yb3V0ZSgnL2xvZ2luJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHVzZXI6IFVzZXIoKSwgZmVlZHM6IEZlZWRzKCkgfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIGxheW91dEhlbHBlcih7XG4gICAgICBtZW51OiBMb2dnZWRJbk1lbnUsXG4gICAgICB1c2VySWQ6IG0ucm91dGUucGFyYW0oJ2lkJyksXG5cbiAgICAgIGZlZWRTZWxlY3Q6IEZlZWRTZWxlY3QsXG4gICAgICBmZWVkczogY3RybC51c2VyKCkuZGF0YS5mZWVkcyxcbiAgICAgIGN1cnJlbnRGZWVkOiAnc2VsZWN0LWZlZWQnXG4gICAgfSk7XG4gICAgcmV0dXJuIG0oJ2Rpdi5jb250ZW50LXBhcnQnLCBbXG4gICAgICBtKCdoMicsICdQcm9maWxlJyksXG4gICAgICBtKCdwJywgY3RybC51c2VyKCkuZGF0YS5lbWFpbCksXG4gICAgICBtKCdhJywgeyBocmVmOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9lZGl0JywgY29uZmlnOiBtLnJvdXRlIH0sICdFZGl0IEFjY291bnQnKSxcbiAgICAgIG0oJ2gyJywgJ015IEZlZWRzJyksXG4gICAgICBjdHJsLmZlZWRzKCkuZGF0YS5tYXAoZnVuY3Rpb24oZmVlZCkge1xuICAgICAgICByZXR1cm4gbS5jb21wb25lbnQoRmVlZExpc3RpbmcsIHsgZmVlZElkOiBmZWVkLl9pZCwgdGl0bGU6IGZlZWQudGl0bGUsIHVzZXJJZDogY3RybC5mZWVkcygpLnVzZXIuaWQgfSk7XG4gICAgICB9KSxcbiAgICAgIG0oJ2gyJywgJ0RhbmdlciBab25lJyksXG4gICAgICBtKCdidXR0b24uZGVsZXRlLWJ1dHRvbicsIHsgb25jbGljazogY3RybC5kZWxldGVBY2NvdW50IH0sICdEZWxldGUgQWNjb3VudCcpXG4gICAgXSlcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyU2hvdztcbiJdfQ==
