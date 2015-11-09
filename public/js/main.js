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
  SourceEdit: require('./sources/source-edit'),
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
var layoutHelper = require('../helpers/layout-helper');
var authorizeHelper = require('../helpers/authorize-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');

var FeedInfo = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

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
          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'));
        });
    };
    var deleteFeed = function() {
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
        .then(function() {
          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
        });
    };
    var deleteSource = function(sourceId) {
      var deleteSourceFn = function() {
        m.request({
          method: 'DELETE',
          url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + sourceId,
          extract: reqHelpers.nonJsonErrors,
          serialize: reqHelpers.serialize,
          config: reqHelpers.asFormUrlEncoded
        })
          .then(authorizeHelper)
          .then(function() {
            m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
          });
        return deleteSourceFn;
      }
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
    return m('div', [
      m('div', [
        m('h2', 'Edit Feed'),
        m('input', { type: 'text', name: 'title', placeholder: 'edit title', value: ctrl.feedInfo().data.title || ''}),
        m('input', { type: 'text', name: 'filters', placeholder: 'edit filters', value: ctrl.feedInfo().data.filters.join(',') || '' }),
        m('input', { onclick: ctrl.updateFeed, type: 'submit', value: 'Update Feed' }),
        m('button', { onclick: ctrl.deleteFeed }, 'Delete Feed' )
      ]),
      m('div', [
        m('h2', 'Add Source'),
        m('input', { type: 'text', name: 'name', placeholder: 'name' }),
        m('input', { type: 'text', name: 'value', placeholder: 'value' }),
        m('input', { type: 'radio', name: 'type', value: 'Facebook' }),
        m('label', 'Facebook'),
        m('input', { onclick: ctrl.addSource, type: 'submit', value: 'Add Source' })
      ]),
      m('div', [
        m('h2', 'Sources'),
        ctrl.feedInfo().data.sources.map(function(source) {
          return m('div', [
            m('a', { href: '#/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id }, source.name),
            m('a', { href: '#/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id + '/edit' }, 'Edit Source'),
            m('a', { onclick: ctrl.deleteSource(source._id), href: ''}, 'Delete Source')
          ])
        })
      ])
    ])
  }
}

module.exports = FeedEdit;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-list.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');

var Feeds = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

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
    return m('div', [
      m('a', { href: '#/users/' + ctrl.userId + '/feeds/' + ctrl.feedId }, [
        m('h4', ctrl.title)
      ]),
      m('a', { href: '#/users/' + ctrl.userId + '/feeds/' + ctrl.feedId + '/edit' }, 'Settings')
    ])
  }
};

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
    return m('section', [
      m('h2', 'Feeds'),
      ctrl.feeds().data.map(function(feed) {
        return m.component(FeedListing, { feedId: feed._id, title: feed.title, userId: ctrl.feeds().user.id });
      })
    ]);
  }
};

module.exports = FeedList;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-new.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var authorizeHelper = require('../helpers/authorize-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');

var Feeds = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

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
    return m('div', [
      m('h2', 'New Feed'),
      m('div', [
        m('input', { type: 'text', name: 'title', placeholder: 'feed name' })
      ]),
      m('div', [
        m('input', { onclick: ctrl.createFeed, type: 'submit', value: 'Create Feed' })
      ])
    ])
  }
};

module.exports = FeedNew;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-show.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');

// var time = month + '/' + day + '/' + year + ' ' +hours + ':' + minutes;
//
// var fromField = '<h5><a href=https://facebook.com/' + data[i].from.id + ' target=_blank>' + data[i].from.name + '</a> - ' + time + '</h5>';
//
// var messageField = findLinks(data[i].message || data[i].story, 'h4');
// var pictureField = '';
// var video = '';
// if (data[i].source) {
//   video = '<div class="picture"><video src=' + data[i].source + ' controls></video>'
// } else if (data[i].picture) {
//   pictureField = '<div class="picture"><img src=' + data[i].full_picture + ' alt=' + data[i].description + '>';
// }
// var descriptionField = '';
// if (data[i].description) {
//   descriptionField = findLinks(data[i].description, 'p');
// }
// var captionField = '';
// if (data[i].caption) {
//   captionField = '<small>' + data[i].caption + '</small>';
// } else if ((data[i].picture || data[i].source) && !data[i].caption) {
//   captionField = '</div>'
// }
// var linkField = '';
// if (data[i].link) {
//   linkField = '<a class="main-link" href=' + data[i].link + ' target=_blank>' + (data[i].name || data[i].link) + '</a>';
// }
//
// var displayString = '<article class="feed-item">' + fromField + messageField + video + pictureField + linkField + descriptionField + captionField + '</article>';

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
      return m('div#search-container', [
        m('input', { type: 'text', name: 'query', value: ctrl.query }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    } else {
      return m('div#search-container', [
        m('input', { type: 'text', name: 'query' }),
        m('input', { onclick: ctrl.search, type: 'submit', name: 'search', value: 'Go' }),
      ]);
    }
  }
};

var FeedItems = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'),
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

var SearchResults = function(query) {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/' + query,
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

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
      if (args.caption) {
        elements.push(m('small', args.caption));
      }
      if (args.description) {
        elements.push(m('p', args.description));
      }
      return elements;
    }
    return {
      time: args.time,
      from: args.from,
      message: args.message,
      elements: conditionalElements()
    }
  },
  view: function(ctrl) {

    return m('article.feed-item', [
      m('a[href=https://facebook.com/' + ctrl.from.id  + ']', { target: '_blank'}, [
        m('h5', ctrl.from.name + ' ' + ctrl.time)
      ]),
      m('h4', ctrl.message),
      m('div.media-wrap', [
        ctrl.elements
      ])
    ])
  }
};

var FeedShow = {
  controller: function(args) {
    if (args && args.query) {
      return { feedItems: SearchResults(args.query), query: args.query };
    } else {
      return { feedItems: FeedItems() };
    }
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.feedItems().user.feeds,
      currentFeed: m.route.param('feedId'),

      refreshButton: RefreshButton,

      searchBar: SearchBar,
      query: ctrl.query || false
    });
    return m('div', [
      ctrl.feedItems().data.map(function(item) {
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
};

module.exports = FeedShow;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","../layout/refresh-button":"/Users/david/Projects/inform/inform/public/js/src/layout/refresh-button.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js":[function(require,module,exports){
var m = require('mithril');

// check if request response is authorized
function authorize(response) {
  if (!response.authorizeFail) {
    console.log(response.message);
    return response;
  } else {
    console.log(response.message);
    m.route('/');
  }
}

module.exports = authorize;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js":[function(require,module,exports){
var m = require('mithril');

var header = document.getElementById('header-wrap');
var menu = document.getElementById('menu');
var content = document.getElementById('content-wrap');

// temporary menu initializer
menu.style.display = 'none';
content.style.marginTop = header.offsetHeight + 10 + 'px';

var MenuIcon = {
  controller: function() {
    var showMenu = function() {
      console.log('show menu');
      if (menu.style.display === 'none') {
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

function layoutHelper(args) {
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
    m.mount(document.getElementById('search-bar'), null);
  }
}

module.exports = layoutHelper;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js":[function(require,module,exports){
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

// convert not-json errors to json
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
        m('a', { href: '#/users/' + ctrl.userId }, 'Profile'),
      ]),
      m('li', [
        m('a', { href: '#/users/' + ctrl.userId + '/feeds' }, 'Feeds'),
      ]),
      m('li', [
        m('a', { href: '#/users/' + ctrl.userId + '/feeds/new' }, 'New Feed'),
      ]),
      m('li', [
        m('a', { href: '#/users/' + ctrl.userId + '/edit' }, 'Edit Account'),
      ]),
      m('li', [
        m('a', { href: '#/logout' }, 'Logout')
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
        m('a', { href: '#/login' }, 'Login'),
      ]),
      m('li', [
        m('a', { href: '#/users/new' }, 'Create Account')
      ])
    ])
  }
}

module.exports = LoggedOutMenu;

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
      }).then(function(response) {
        console.log(response.message);
        if (!response.fail) {
          m.route('/users/' + response.user.id + '/feeds/' + (
            response.user.defaultFeed ||
            response.user.feeds[0] ||
            'new'
          ));
        } else {
          document.getElementsByName('email')[0].value = '';
          document.getElementsByName('password')[0].value = '';
        }
      });
    }
    return { login: login };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedOutMenu
    });
    return m('section', [
      m('h2', 'Login'),
      m('div', [
        m('input', { name: 'email', type: 'email', placeholder: 'email' })
      ]),
      m('div', [
        m('input', { name: 'password', type: 'password', placeholder: 'password' }),
      ]),
      m('div', [
        m('input', { onclick: ctrl.login, type: 'submit', value: 'Login' }),
        m('a', { href: '/request-password' }, 'Forgot your password?')
      ])
    ])
  }
}

module.exports = Login;

},{"../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/logged-out-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-out-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sessions/logout.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');

var Logout = {
  controller: function() {
    return m.request({ method: 'GET', url: '/logout', extract: reqHelpers.nonJsonErrors })
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

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","../layout/refresh-button":"/Users/david/Projects/inform/inform/public/js/src/layout/refresh-button.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/user-edit.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');

var User = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id'),
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

var UserEdit = {
  controller: function() {
    var updateUser = function() {
      m.request({
        method: 'PUT',
        url: '/users/' + m.route.param('id') + '/edit',
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
            m.route('/users/' + m.route.param('id'));
          } else {
            console.log(data.message);
            m.route('/users/' + m.route.param('id'));
            document.getElementsByName('email')[0].value = '';
            document.getElementsByName('password')[0].value = '';
            document.getElementsByName('confirmation')[0].value = '';
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
    return m('div.content-block', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input', { type: 'email', name: 'email', value: ctrl.user().data.email })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'password', placeholder: 'password' }),
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'confirmation', placeholder: 'confirmation' }),
      ]),
      m('div.input-block', [
        m('input', { onclick: ctrl.updateUser, type: 'submit', value: 'Update User' })
      ])
    ])
  }
}

module.exports = UserEdit;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/user-new.js":[function(require,module,exports){
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
    return { createUser: createUser };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedOutMenu
    });
    return m('div.content-block', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input', { type: 'email', name: 'email', placeholder: 'email' })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'password', placeholder: 'password' }),
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'confirmation', placeholder: 'confirmation' }),
      ]),
      m('div.input-block', [
        m('input', { onclick: ctrl.createUser, type: 'submit', value: 'Create User' })
      ])
    ])
  }
}

module.exports = UserNew;

},{"../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/logged-out-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-out-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/user-show.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu.js');
var FeedSelect = require('../layout/feed-select');

var User = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id'),
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

var UserShow = {
  controller: function() {
    return { user: User() };
  },
  view: function(ctrl) {
    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: ctrl.user().data.feeds,
      currentFeed: 'select-feed'
    });
    return m('div', [
      m('h2', 'User Show'),
      m('p', ctrl.user().data.email)
    ])
  }
}

module.exports = UserShow;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}]},{},["./public/js/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvc3JjL21haW4uanMiLCJub2RlX21vZHVsZXMvbWl0aHJpbC9taXRocmlsLmpzIiwicHVibGljL2pzL3NyYy9mZWVkcy9mZWVkLWVkaXQuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL2ZlZWQtbGlzdC5qcyIsInB1YmxpYy9qcy9zcmMvZmVlZHMvZmVlZC1uZXcuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL2ZlZWQtc2hvdy5qcyIsInB1YmxpYy9qcy9zcmMvaGVscGVycy9hdXRob3JpemUtaGVscGVyLmpzIiwicHVibGljL2pzL3NyYy9oZWxwZXJzL2xheW91dC1oZWxwZXIuanMiLCJwdWJsaWMvanMvc3JjL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzLmpzIiwicHVibGljL2pzL3NyYy9sYXlvdXQvZmVlZC1zZWxlY3QuanMiLCJwdWJsaWMvanMvc3JjL2xheW91dC9sb2dnZWQtaW4tbWVudS5qcyIsInB1YmxpYy9qcy9zcmMvbGF5b3V0L2xvZ2dlZC1vdXQtbWVudS5qcyIsInB1YmxpYy9qcy9zcmMvbGF5b3V0L3JlZnJlc2gtYnV0dG9uLmpzIiwicHVibGljL2pzL3NyYy9zZXNzaW9ucy9sb2dpbi5qcyIsInB1YmxpYy9qcy9zcmMvc2Vzc2lvbnMvbG9nb3V0LmpzIiwicHVibGljL2pzL3NyYy9zb3VyY2VzL3NvdXJjZS1lZGl0LmpzIiwicHVibGljL2pzL3NyYy9zb3VyY2VzL3NvdXJjZS1zaG93LmpzIiwicHVibGljL2pzL3NyYy91c2Vycy91c2VyLWVkaXQuanMiLCJwdWJsaWMvanMvc3JjL3VzZXJzL3VzZXItbmV3LmpzIiwicHVibGljL2pzL3NyYy91c2Vycy91c2VyLXNob3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2b0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG52YXIgYXBwID0ge1xuICBMb2dpbjogcmVxdWlyZSgnLi9zZXNzaW9ucy9sb2dpbicpLFxuICBMb2dvdXQ6IHJlcXVpcmUoJy4vc2Vzc2lvbnMvbG9nb3V0JyksXG4gIFVzZXJOZXc6IHJlcXVpcmUoJy4vdXNlcnMvdXNlci1uZXcnKSxcbiAgVXNlclNob3c6IHJlcXVpcmUoJy4vdXNlcnMvdXNlci1zaG93JyksXG4gIFVzZXJFZGl0OiByZXF1aXJlKCcuL3VzZXJzL3VzZXItZWRpdCcpLFxuICBGZWVkTGlzdDogcmVxdWlyZSgnLi9mZWVkcy9mZWVkLWxpc3QnKSxcbiAgRmVlZE5ldzogcmVxdWlyZSgnLi9mZWVkcy9mZWVkLW5ldycpLFxuICBGZWVkU2hvdzogcmVxdWlyZSgnLi9mZWVkcy9mZWVkLXNob3cnKSxcbiAgRmVlZEVkaXQ6IHJlcXVpcmUoJy4vZmVlZHMvZmVlZC1lZGl0JyksXG4gIFNvdXJjZVNob3c6IHJlcXVpcmUoJy4vc291cmNlcy9zb3VyY2Utc2hvdycpLFxuICBTb3VyY2VFZGl0OiByZXF1aXJlKCcuL3NvdXJjZXMvc291cmNlLWVkaXQnKSxcbn07XG5cbm0ucm91dGUubW9kZSA9ICdoYXNoJztcblxubS5yb3V0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyksICcvJywge1xuICAvLyBzZXNzaW9uc1xuICAnLyc6IGFwcC5Mb2dpbixcbiAgJy9sb2dvdXQnOiBhcHAuTG9nb3V0LFxuXG4gIC8vIHBhc3N3b3JkIHJlY292ZXJ5XG4gIC8vICcvcmVxdWVzdC1wYXNzd29yZCc6IGFwcC5SZXF1ZXN0UGFzc3dvcmQsXG4gIC8vICcvcmVzZXQtcGFzc3dvcmQvOnRva2VuJzogYXBwLlJlc2V0UGFzc3dvcmQsXG5cbiAgLy8gdXNlcnNcbiAgJy91c2Vycy9uZXcnOiBhcHAuVXNlck5ldyxcbiAgJy91c2Vycy86aWQnOiBhcHAuVXNlclNob3csXG4gICcvdXNlcnMvOmlkL2VkaXQnOiBhcHAuVXNlckVkaXQsXG5cbiAgLy8gZmVlZHNcbiAgJy91c2Vycy86aWQvZmVlZHMnOiBhcHAuRmVlZExpc3QsXG4gICcvdXNlcnMvOmlkL2ZlZWRzL25ldyc6IGFwcC5GZWVkTmV3LFxuICAnL3VzZXJzLzppZC9mZWVkcy86ZmVlZElkJzogYXBwLkZlZWRTaG93LFxuICAnL3VzZXJzLzppZC9mZWVkcy86ZmVlZElkL2VkaXQnOiBhcHAuRmVlZEVkaXQsXG5cbiAgLy8gc291cmNlc1xuICAnL3VzZXJzLzppZC9mZWVkcy86ZmVlZElkL3NvdXJjZXMvOnNvdXJjZUlkJzogYXBwLlNvdXJjZVNob3csXG4gICcvdXNlcnMvOmlkL2ZlZWRzLzpmZWVkSWQvc291cmNlcy86c291cmNlSWQvZWRpdCc6IGFwcC5Tb3VyY2VFZGl0LFxufSk7XG4iLCJ2YXIgbSA9IChmdW5jdGlvbiBhcHAod2luZG93LCB1bmRlZmluZWQpIHtcclxuXHR2YXIgT0JKRUNUID0gXCJbb2JqZWN0IE9iamVjdF1cIiwgQVJSQVkgPSBcIltvYmplY3QgQXJyYXldXCIsIFNUUklORyA9IFwiW29iamVjdCBTdHJpbmddXCIsIEZVTkNUSU9OID0gXCJmdW5jdGlvblwiO1xyXG5cdHZhciB0eXBlID0ge30udG9TdHJpbmc7XHJcblx0dmFyIHBhcnNlciA9IC8oPzooXnwjfFxcLikoW14jXFwuXFxbXFxdXSspKXwoXFxbLis/XFxdKS9nLCBhdHRyUGFyc2VyID0gL1xcWyguKz8pKD86PShcInwnfCkoLio/KVxcMik/XFxdLztcclxuXHR2YXIgdm9pZEVsZW1lbnRzID0gL14oQVJFQXxCQVNFfEJSfENPTHxDT01NQU5EfEVNQkVEfEhSfElNR3xJTlBVVHxLRVlHRU58TElOS3xNRVRBfFBBUkFNfFNPVVJDRXxUUkFDS3xXQlIpJC87XHJcblx0dmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9XHJcblxyXG5cdC8vIGNhY2hpbmcgY29tbW9ubHkgdXNlZCB2YXJpYWJsZXNcclxuXHR2YXIgJGRvY3VtZW50LCAkbG9jYXRpb24sICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUsICRjYW5jZWxBbmltYXRpb25GcmFtZTtcclxuXHJcblx0Ly8gc2VsZiBpbnZva2luZyBmdW5jdGlvbiBuZWVkZWQgYmVjYXVzZSBvZiB0aGUgd2F5IG1vY2tzIHdvcmtcclxuXHRmdW5jdGlvbiBpbml0aWFsaXplKHdpbmRvdyl7XHJcblx0XHQkZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XHJcblx0XHQkbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XHJcblx0XHQkY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LmNsZWFyVGltZW91dDtcclxuXHRcdCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5zZXRUaW1lb3V0O1xyXG5cdH1cclxuXHJcblx0aW5pdGlhbGl6ZSh3aW5kb3cpO1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQHR5cGVkZWYge1N0cmluZ30gVGFnXHJcblx0ICogQSBzdHJpbmcgdGhhdCBsb29rcyBsaWtlIC0+IGRpdi5jbGFzc25hbWUjaWRbcGFyYW09b25lXVtwYXJhbTI9dHdvXVxyXG5cdCAqIFdoaWNoIGRlc2NyaWJlcyBhIERPTSBub2RlXHJcblx0ICovXHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtUYWd9IFRoZSBET00gbm9kZSB0YWdcclxuXHQgKiBAcGFyYW0ge09iamVjdD1bXX0gb3B0aW9uYWwga2V5LXZhbHVlIHBhaXJzIHRvIGJlIG1hcHBlZCB0byBET00gYXR0cnNcclxuXHQgKiBAcGFyYW0gey4uLm1Ob2RlPVtdfSBaZXJvIG9yIG1vcmUgTWl0aHJpbCBjaGlsZCBub2Rlcy4gQ2FuIGJlIGFuIGFycmF5LCBvciBzcGxhdCAob3B0aW9uYWwpXHJcblx0ICpcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBtKCkge1xyXG5cdFx0dmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0XHR2YXIgaGFzQXR0cnMgPSBhcmdzWzFdICE9IG51bGwgJiYgdHlwZS5jYWxsKGFyZ3NbMV0pID09PSBPQkpFQ1QgJiYgIShcInRhZ1wiIGluIGFyZ3NbMV0gfHwgXCJ2aWV3XCIgaW4gYXJnc1sxXSkgJiYgIShcInN1YnRyZWVcIiBpbiBhcmdzWzFdKTtcclxuXHRcdHZhciBhdHRycyA9IGhhc0F0dHJzID8gYXJnc1sxXSA6IHt9O1xyXG5cdFx0dmFyIGNsYXNzQXR0ck5hbWUgPSBcImNsYXNzXCIgaW4gYXR0cnMgPyBcImNsYXNzXCIgOiBcImNsYXNzTmFtZVwiO1xyXG5cdFx0dmFyIGNlbGwgPSB7dGFnOiBcImRpdlwiLCBhdHRyczoge319O1xyXG5cdFx0dmFyIG1hdGNoLCBjbGFzc2VzID0gW107XHJcblx0XHRpZiAodHlwZS5jYWxsKGFyZ3NbMF0pICE9IFNUUklORykgdGhyb3cgbmV3IEVycm9yKFwic2VsZWN0b3IgaW4gbShzZWxlY3RvciwgYXR0cnMsIGNoaWxkcmVuKSBzaG91bGQgYmUgYSBzdHJpbmdcIilcclxuXHRcdHdoaWxlIChtYXRjaCA9IHBhcnNlci5leGVjKGFyZ3NbMF0pKSB7XHJcblx0XHRcdGlmIChtYXRjaFsxXSA9PT0gXCJcIiAmJiBtYXRjaFsyXSkgY2VsbC50YWcgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiI1wiKSBjZWxsLmF0dHJzLmlkID0gbWF0Y2hbMl07XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzFdID09PSBcIi5cIikgY2xhc3Nlcy5wdXNoKG1hdGNoWzJdKTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XHJcblx0XHRcdFx0dmFyIHBhaXIgPSBhdHRyUGFyc2VyLmV4ZWMobWF0Y2hbM10pO1xyXG5cdFx0XHRcdGNlbGwuYXR0cnNbcGFpclsxXV0gPSBwYWlyWzNdIHx8IChwYWlyWzJdID8gXCJcIiA6dHJ1ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBjaGlsZHJlbiA9IGhhc0F0dHJzID8gYXJncy5zbGljZSgyKSA6IGFyZ3Muc2xpY2UoMSk7XHJcblx0XHRpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIHR5cGUuY2FsbChjaGlsZHJlblswXSkgPT09IEFSUkFZKSB7XHJcblx0XHRcdGNlbGwuY2hpbGRyZW4gPSBjaGlsZHJlblswXVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNlbGwuY2hpbGRyZW4gPSBjaGlsZHJlblxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBhdHRyTmFtZSBpbiBhdHRycykge1xyXG5cdFx0XHRpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7XHJcblx0XHRcdFx0aWYgKGF0dHJOYW1lID09PSBjbGFzc0F0dHJOYW1lICYmIGF0dHJzW2F0dHJOYW1lXSAhPSBudWxsICYmIGF0dHJzW2F0dHJOYW1lXSAhPT0gXCJcIikge1xyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGF0dHJzW2F0dHJOYW1lXSlcclxuXHRcdFx0XHRcdGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gXCJcIiAvL2NyZWF0ZSBrZXkgaW4gY29ycmVjdCBpdGVyYXRpb24gb3JkZXJcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBjZWxsLmF0dHJzW2F0dHJOYW1lXSA9IGF0dHJzW2F0dHJOYW1lXVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoY2xhc3Nlcy5sZW5ndGggPiAwKSBjZWxsLmF0dHJzW2NsYXNzQXR0ck5hbWVdID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGNlbGxcclxuXHR9XHJcblx0ZnVuY3Rpb24gYnVpbGQocGFyZW50RWxlbWVudCwgcGFyZW50VGFnLCBwYXJlbnRDYWNoZSwgcGFyZW50SW5kZXgsIGRhdGEsIGNhY2hlZCwgc2hvdWxkUmVhdHRhY2gsIGluZGV4LCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKSB7XHJcblx0XHQvL2BidWlsZGAgaXMgYSByZWN1cnNpdmUgZnVuY3Rpb24gdGhhdCBtYW5hZ2VzIGNyZWF0aW9uL2RpZmZpbmcvcmVtb3ZhbCBvZiBET00gZWxlbWVudHMgYmFzZWQgb24gY29tcGFyaXNvbiBiZXR3ZWVuIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vdGhlIGRpZmYgYWxnb3JpdGhtIGNhbiBiZSBzdW1tYXJpemVkIGFzIHRoaXM6XHJcblx0XHQvLzEgLSBjb21wYXJlIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vMiAtIGlmIHRoZXkgYXJlIGRpZmZlcmVudCwgY29weSBgZGF0YWAgdG8gYGNhY2hlZGAgYW5kIHVwZGF0ZSB0aGUgRE9NIGJhc2VkIG9uIHdoYXQgdGhlIGRpZmZlcmVuY2UgaXNcclxuXHRcdC8vMyAtIHJlY3Vyc2l2ZWx5IGFwcGx5IHRoaXMgYWxnb3JpdGhtIGZvciBldmVyeSBhcnJheSBhbmQgZm9yIHRoZSBjaGlsZHJlbiBvZiBldmVyeSB2aXJ0dWFsIGVsZW1lbnRcclxuXHJcblx0XHQvL3RoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZSBpcyBlc3NlbnRpYWxseSB0aGUgc2FtZSBhcyB0aGUgcHJldmlvdXMgcmVkcmF3J3MgYGRhdGFgIGRhdGEgc3RydWN0dXJlLCB3aXRoIGEgZmV3IGFkZGl0aW9uczpcclxuXHRcdC8vLSBgY2FjaGVkYCBhbHdheXMgaGFzIGEgcHJvcGVydHkgY2FsbGVkIGBub2Rlc2AsIHdoaWNoIGlzIGEgbGlzdCBvZiBET00gZWxlbWVudHMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBkYXRhIHJlcHJlc2VudGVkIGJ5IHRoZSByZXNwZWN0aXZlIHZpcnR1YWwgZWxlbWVudFxyXG5cdFx0Ly8tIGluIG9yZGVyIHRvIHN1cHBvcnQgYXR0YWNoaW5nIGBub2Rlc2AgYXMgYSBwcm9wZXJ0eSBvZiBgY2FjaGVkYCwgYGNhY2hlZGAgaXMgKmFsd2F5cyogYSBub24tcHJpbWl0aXZlIG9iamVjdCwgaS5lLiBpZiB0aGUgZGF0YSB3YXMgYSBzdHJpbmcsIHRoZW4gY2FjaGVkIGlzIGEgU3RyaW5nIGluc3RhbmNlLiBJZiBkYXRhIHdhcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIGNhY2hlZCBpcyBgbmV3IFN0cmluZyhcIlwiKWBcclxuXHRcdC8vLSBgY2FjaGVkIGFsc28gaGFzIGEgYGNvbmZpZ0NvbnRleHRgIHByb3BlcnR5LCB3aGljaCBpcyB0aGUgc3RhdGUgc3RvcmFnZSBvYmplY3QgZXhwb3NlZCBieSBjb25maWcoZWxlbWVudCwgaXNJbml0aWFsaXplZCwgY29udGV4dClcclxuXHRcdC8vLSB3aGVuIGBjYWNoZWRgIGlzIGFuIE9iamVjdCwgaXQgcmVwcmVzZW50cyBhIHZpcnR1YWwgZWxlbWVudDsgd2hlbiBpdCdzIGFuIEFycmF5LCBpdCByZXByZXNlbnRzIGEgbGlzdCBvZiBlbGVtZW50czsgd2hlbiBpdCdzIGEgU3RyaW5nLCBOdW1iZXIgb3IgQm9vbGVhbiwgaXQgcmVwcmVzZW50cyBhIHRleHQgbm9kZVxyXG5cclxuXHRcdC8vYHBhcmVudEVsZW1lbnRgIGlzIGEgRE9NIGVsZW1lbnQgdXNlZCBmb3IgVzNDIERPTSBBUEkgY2FsbHNcclxuXHRcdC8vYHBhcmVudFRhZ2AgaXMgb25seSB1c2VkIGZvciBoYW5kbGluZyBhIGNvcm5lciBjYXNlIGZvciB0ZXh0YXJlYSB2YWx1ZXNcclxuXHRcdC8vYHBhcmVudENhY2hlYCBpcyB1c2VkIHRvIHJlbW92ZSBub2RlcyBpbiBzb21lIG11bHRpLW5vZGUgY2FzZXNcclxuXHRcdC8vYHBhcmVudEluZGV4YCBhbmQgYGluZGV4YCBhcmUgdXNlZCB0byBmaWd1cmUgb3V0IHRoZSBvZmZzZXQgb2Ygbm9kZXMuIFRoZXkncmUgYXJ0aWZhY3RzIGZyb20gYmVmb3JlIGFycmF5cyBzdGFydGVkIGJlaW5nIGZsYXR0ZW5lZCBhbmQgYXJlIGxpa2VseSByZWZhY3RvcmFibGVcclxuXHRcdC8vYGRhdGFgIGFuZCBgY2FjaGVkYCBhcmUsIHJlc3BlY3RpdmVseSwgdGhlIG5ldyBhbmQgb2xkIG5vZGVzIGJlaW5nIGRpZmZlZFxyXG5cdFx0Ly9gc2hvdWxkUmVhdHRhY2hgIGlzIGEgZmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgYSBwYXJlbnQgbm9kZSB3YXMgcmVjcmVhdGVkIChpZiBzbywgYW5kIGlmIHRoaXMgbm9kZSBpcyByZXVzZWQsIHRoZW4gdGhpcyBub2RlIG11c3QgcmVhdHRhY2ggaXRzZWxmIHRvIHRoZSBuZXcgcGFyZW50KVxyXG5cdFx0Ly9gZWRpdGFibGVgIGlzIGEgZmxhZyB0aGF0IGluZGljYXRlcyB3aGV0aGVyIGFuIGFuY2VzdG9yIGlzIGNvbnRlbnRlZGl0YWJsZVxyXG5cdFx0Ly9gbmFtZXNwYWNlYCBpbmRpY2F0ZXMgdGhlIGNsb3Nlc3QgSFRNTCBuYW1lc3BhY2UgYXMgaXQgY2FzY2FkZXMgZG93biBmcm9tIGFuIGFuY2VzdG9yXHJcblx0XHQvL2Bjb25maWdzYCBpcyBhIGxpc3Qgb2YgY29uZmlnIGZ1bmN0aW9ucyB0byBydW4gYWZ0ZXIgdGhlIHRvcG1vc3QgYGJ1aWxkYCBjYWxsIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHJcblx0XHQvL3RoZXJlJ3MgbG9naWMgdGhhdCByZWxpZXMgb24gdGhlIGFzc3VtcHRpb24gdGhhdCBudWxsIGFuZCB1bmRlZmluZWQgZGF0YSBhcmUgZXF1aXZhbGVudCB0byBlbXB0eSBzdHJpbmdzXHJcblx0XHQvLy0gdGhpcyBwcmV2ZW50cyBsaWZlY3ljbGUgc3VycHJpc2VzIGZyb20gcHJvY2VkdXJhbCBoZWxwZXJzIHRoYXQgbWl4IGltcGxpY2l0IGFuZCBleHBsaWNpdCByZXR1cm4gc3RhdGVtZW50cyAoZS5nLiBmdW5jdGlvbiBmb28oKSB7aWYgKGNvbmQpIHJldHVybiBtKFwiZGl2XCIpfVxyXG5cdFx0Ly8tIGl0IHNpbXBsaWZpZXMgZGlmZmluZyBjb2RlXHJcblx0XHQvL2RhdGEudG9TdHJpbmcoKSBtaWdodCB0aHJvdyBvciByZXR1cm4gbnVsbCBpZiBkYXRhIGlzIHRoZSByZXR1cm4gdmFsdWUgb2YgQ29uc29sZS5sb2cgaW4gRmlyZWZveCAoYmVoYXZpb3IgZGVwZW5kcyBvbiB2ZXJzaW9uKVxyXG5cdFx0dHJ5IHtpZiAoZGF0YSA9PSBudWxsIHx8IGRhdGEudG9TdHJpbmcoKSA9PSBudWxsKSBkYXRhID0gXCJcIjt9IGNhdGNoIChlKSB7ZGF0YSA9IFwiXCJ9XHJcblx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0dmFyIGNhY2hlZFR5cGUgPSB0eXBlLmNhbGwoY2FjaGVkKSwgZGF0YVR5cGUgPSB0eXBlLmNhbGwoZGF0YSk7XHJcblx0XHRpZiAoY2FjaGVkID09IG51bGwgfHwgY2FjaGVkVHlwZSAhPT0gZGF0YVR5cGUpIHtcclxuXHRcdFx0aWYgKGNhY2hlZCAhPSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKHBhcmVudENhY2hlICYmIHBhcmVudENhY2hlLm5vZGVzKSB7XHJcblx0XHRcdFx0XHR2YXIgb2Zmc2V0ID0gaW5kZXggLSBwYXJlbnRJbmRleDtcclxuXHRcdFx0XHRcdHZhciBlbmQgPSBvZmZzZXQgKyAoZGF0YVR5cGUgPT09IEFSUkFZID8gZGF0YSA6IGNhY2hlZC5ub2RlcykubGVuZ3RoO1xyXG5cdFx0XHRcdFx0Y2xlYXIocGFyZW50Q2FjaGUubm9kZXMuc2xpY2Uob2Zmc2V0LCBlbmQpLCBwYXJlbnRDYWNoZS5zbGljZShvZmZzZXQsIGVuZCkpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKGNhY2hlZC5ub2RlcykgY2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpXHJcblx0XHRcdH1cclxuXHRcdFx0Y2FjaGVkID0gbmV3IGRhdGEuY29uc3RydWN0b3I7XHJcblx0XHRcdGlmIChjYWNoZWQudGFnKSBjYWNoZWQgPSB7fTsgLy9pZiBjb25zdHJ1Y3RvciBjcmVhdGVzIGEgdmlydHVhbCBkb20gZWxlbWVudCwgdXNlIGEgYmxhbmsgb2JqZWN0IGFzIHRoZSBiYXNlIGNhY2hlZCBub2RlIGluc3RlYWQgb2YgY29weWluZyB0aGUgdmlydHVhbCBlbCAoIzI3NylcclxuXHRcdFx0Y2FjaGVkLm5vZGVzID0gW11cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGF0YVR5cGUgPT09IEFSUkFZKSB7XHJcblx0XHRcdC8vcmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheVxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdGlmICh0eXBlLmNhbGwoZGF0YVtpXSkgPT09IEFSUkFZKSB7XHJcblx0XHRcdFx0XHRkYXRhID0gZGF0YS5jb25jYXQuYXBwbHkoW10sIGRhdGEpO1xyXG5cdFx0XHRcdFx0aS0tIC8vY2hlY2sgY3VycmVudCBpbmRleCBhZ2FpbiBhbmQgZmxhdHRlbiB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZSBuZXN0ZWQgYXJyYXlzIGF0IHRoYXQgaW5kZXhcclxuXHRcdFx0XHRcdGxlbiA9IGRhdGEubGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgbm9kZXMgPSBbXSwgaW50YWN0ID0gY2FjaGVkLmxlbmd0aCA9PT0gZGF0YS5sZW5ndGgsIHN1YkFycmF5Q291bnQgPSAwO1xyXG5cclxuXHRcdFx0Ly9rZXlzIGFsZ29yaXRobTogc29ydCBlbGVtZW50cyB3aXRob3V0IHJlY3JlYXRpbmcgdGhlbSBpZiBrZXlzIGFyZSBwcmVzZW50XHJcblx0XHRcdC8vMSkgY3JlYXRlIGEgbWFwIG9mIGFsbCBleGlzdGluZyBrZXlzLCBhbmQgbWFyayBhbGwgZm9yIGRlbGV0aW9uXHJcblx0XHRcdC8vMikgYWRkIG5ldyBrZXlzIHRvIG1hcCBhbmQgbWFyayB0aGVtIGZvciBhZGRpdGlvblxyXG5cdFx0XHQvLzMpIGlmIGtleSBleGlzdHMgaW4gbmV3IGxpc3QsIGNoYW5nZSBhY3Rpb24gZnJvbSBkZWxldGlvbiB0byBhIG1vdmVcclxuXHRcdFx0Ly80KSBmb3IgZWFjaCBrZXksIGhhbmRsZSBpdHMgY29ycmVzcG9uZGluZyBhY3Rpb24gYXMgbWFya2VkIGluIHByZXZpb3VzIHN0ZXBzXHJcblx0XHRcdHZhciBERUxFVElPTiA9IDEsIElOU0VSVElPTiA9IDIgLCBNT1ZFID0gMztcclxuXHRcdFx0dmFyIGV4aXN0aW5nID0ge30sIHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNhY2hlZC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChjYWNoZWRbaV0gJiYgY2FjaGVkW2ldLmF0dHJzICYmIGNhY2hlZFtpXS5hdHRycy5rZXkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0c2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGV4aXN0aW5nW2NhY2hlZFtpXS5hdHRycy5rZXldID0ge2FjdGlvbjogREVMRVRJT04sIGluZGV4OiBpfVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dmFyIGd1aWQgPSAwXHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGRhdGFbaV0gJiYgZGF0YVtpXS5hdHRycyAmJiBkYXRhW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtqXSAmJiBkYXRhW2pdLmF0dHJzICYmIGRhdGFbal0uYXR0cnMua2V5ID09IG51bGwpIGRhdGFbal0uYXR0cnMua2V5ID0gXCJfX21pdGhyaWxfX1wiICsgZ3VpZCsrXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHNob3VsZE1haW50YWluSWRlbnRpdGllcykge1xyXG5cdFx0XHRcdHZhciBrZXlzRGlmZmVyID0gZmFsc2VcclxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggIT0gY2FjaGVkLmxlbmd0aCkga2V5c0RpZmZlciA9IHRydWVcclxuXHRcdFx0XHRlbHNlIGZvciAodmFyIGkgPSAwLCBjYWNoZWRDZWxsLCBkYXRhQ2VsbDsgY2FjaGVkQ2VsbCA9IGNhY2hlZFtpXSwgZGF0YUNlbGwgPSBkYXRhW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChjYWNoZWRDZWxsLmF0dHJzICYmIGRhdGFDZWxsLmF0dHJzICYmIGNhY2hlZENlbGwuYXR0cnMua2V5ICE9IGRhdGFDZWxsLmF0dHJzLmtleSkge1xyXG5cdFx0XHRcdFx0XHRrZXlzRGlmZmVyID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoa2V5c0RpZmZlcikge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0gJiYgZGF0YVtpXS5hdHRycykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIga2V5ID0gZGF0YVtpXS5hdHRycy5rZXk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWV4aXN0aW5nW2tleV0pIGV4aXN0aW5nW2tleV0gPSB7YWN0aW9uOiBJTlNFUlRJT04sIGluZGV4OiBpfTtcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgZXhpc3Rpbmdba2V5XSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiBNT1ZFLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpbmRleDogaSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnJvbTogZXhpc3Rpbmdba2V5XS5pbmRleCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudDogY2FjaGVkLm5vZGVzW2V4aXN0aW5nW2tleV0uaW5kZXhdIHx8ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR2YXIgYWN0aW9ucyA9IFtdXHJcblx0XHRcdFx0XHRmb3IgKHZhciBwcm9wIGluIGV4aXN0aW5nKSBhY3Rpb25zLnB1c2goZXhpc3RpbmdbcHJvcF0pXHJcblx0XHRcdFx0XHR2YXIgY2hhbmdlcyA9IGFjdGlvbnMuc29ydChzb3J0Q2hhbmdlcyk7XHJcblx0XHRcdFx0XHR2YXIgbmV3Q2FjaGVkID0gbmV3IEFycmF5KGNhY2hlZC5sZW5ndGgpXHJcblx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXMgPSBjYWNoZWQubm9kZXMuc2xpY2UoKVxyXG5cclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjaGFuZ2U7IGNoYW5nZSA9IGNoYW5nZXNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gREVMRVRJT04pIHtcclxuXHRcdFx0XHRcdFx0XHRjbGVhcihjYWNoZWRbY2hhbmdlLmluZGV4XS5ub2RlcywgY2FjaGVkW2NoYW5nZS5pbmRleF0pO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoY2hhbmdlLmluZGV4LCAxKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBJTlNFUlRJT04pIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgZHVtbXkgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHRcdFx0XHRcdFx0XHRkdW1teS5rZXkgPSBkYXRhW2NoYW5nZS5pbmRleF0uYXR0cnMua2V5O1xyXG5cdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGR1bW15LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGNoYW5nZS5pbmRleCwgMCwge2F0dHJzOiB7a2V5OiBkYXRhW2NoYW5nZS5pbmRleF0uYXR0cnMua2V5fSwgbm9kZXM6IFtkdW1teV19KVxyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tjaGFuZ2UuaW5kZXhdID0gZHVtbXlcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IE1PVkUpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2NoYW5nZS5pbmRleF0gIT09IGNoYW5nZS5lbGVtZW50ICYmIGNoYW5nZS5lbGVtZW50ICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShjaGFuZ2UuZWxlbWVudCwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2NoYW5nZS5pbmRleF0gfHwgbnVsbClcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkW2NoYW5nZS5pbmRleF0gPSBjYWNoZWRbY2hhbmdlLmZyb21dXHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzW2NoYW5nZS5pbmRleF0gPSBjaGFuZ2UuZWxlbWVudFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYWNoZWQgPSBuZXdDYWNoZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vZW5kIGtleSBhbGdvcml0aG1cclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBjYWNoZUNvdW50ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdC8vZGlmZiBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5XHJcblx0XHRcdFx0dmFyIGl0ZW0gPSBidWlsZChwYXJlbnRFbGVtZW50LCBwYXJlbnRUYWcsIGNhY2hlZCwgaW5kZXgsIGRhdGFbaV0sIGNhY2hlZFtjYWNoZUNvdW50XSwgc2hvdWxkUmVhdHRhY2gsIGluZGV4ICsgc3ViQXJyYXlDb3VudCB8fCBzdWJBcnJheUNvdW50LCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0XHRpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcclxuXHRcdFx0XHRpZiAoIWl0ZW0ubm9kZXMuaW50YWN0KSBpbnRhY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAoaXRlbS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdFx0Ly9maXggb2Zmc2V0IG9mIG5leHQgZWxlbWVudCBpZiBpdGVtIHdhcyBhIHRydXN0ZWQgc3RyaW5nIHcvIG1vcmUgdGhhbiBvbmUgaHRtbCBlbGVtZW50XHJcblx0XHRcdFx0XHQvL3RoZSBmaXJzdCBjbGF1c2UgaW4gdGhlIHJlZ2V4cCBtYXRjaGVzIGVsZW1lbnRzXHJcblx0XHRcdFx0XHQvL3RoZSBzZWNvbmQgY2xhdXNlIChhZnRlciB0aGUgcGlwZSkgbWF0Y2hlcyB0ZXh0IG5vZGVzXHJcblx0XHRcdFx0XHRzdWJBcnJheUNvdW50ICs9IChpdGVtLm1hdGNoKC88W15cXC9dfFxcPlxccypbXjxdL2cpIHx8IFswXSkubGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Ugc3ViQXJyYXlDb3VudCArPSB0eXBlLmNhbGwoaXRlbSkgPT09IEFSUkFZID8gaXRlbS5sZW5ndGggOiAxO1xyXG5cdFx0XHRcdGNhY2hlZFtjYWNoZUNvdW50KytdID0gaXRlbVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghaW50YWN0KSB7XHJcblx0XHRcdFx0Ly9kaWZmIHRoZSBhcnJheSBpdHNlbGZcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvL3VwZGF0ZSB0aGUgbGlzdCBvZiBET00gbm9kZXMgYnkgY29sbGVjdGluZyB0aGUgbm9kZXMgZnJvbSBlYWNoIGl0ZW1cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGNhY2hlZFtpXSAhPSBudWxsKSBub2Rlcy5wdXNoLmFwcGx5KG5vZGVzLCBjYWNoZWRbaV0ubm9kZXMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIGVuZCBvZiB0aGUgYXJyYXkgaWYgdGhlIG5ldyBhcnJheSBpcyBzaG9ydGVyIHRoYW4gdGhlIG9sZCBvbmVcclxuXHRcdFx0XHQvL2lmIGVycm9ycyBldmVyIGhhcHBlbiBoZXJlLCB0aGUgaXNzdWUgaXMgbW9zdCBsaWtlbHkgYSBidWcgaW4gdGhlIGNvbnN0cnVjdGlvbiBvZiB0aGUgYGNhY2hlZGAgZGF0YSBzdHJ1Y3R1cmUgc29tZXdoZXJlIGVhcmxpZXIgaW4gdGhlIHByb2dyYW1cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbm9kZTsgbm9kZSA9IGNhY2hlZC5ub2Rlc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlICE9IG51bGwgJiYgbm9kZXMuaW5kZXhPZihub2RlKSA8IDApIGNsZWFyKFtub2RlXSwgW2NhY2hlZFtpXV0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA8IGNhY2hlZC5sZW5ndGgpIGNhY2hlZC5sZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhICE9IG51bGwgJiYgZGF0YVR5cGUgPT09IE9CSkVDVCkge1xyXG5cdFx0XHR2YXIgdmlld3MgPSBbXSwgY29udHJvbGxlcnMgPSBbXVxyXG5cdFx0XHR3aGlsZSAoZGF0YS52aWV3KSB7XHJcblx0XHRcdFx0dmFyIHZpZXcgPSBkYXRhLnZpZXcuJG9yaWdpbmFsIHx8IGRhdGEudmlld1xyXG5cdFx0XHRcdHZhciBjb250cm9sbGVySW5kZXggPSBtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiZGlmZlwiICYmIGNhY2hlZC52aWV3cyA/IGNhY2hlZC52aWV3cy5pbmRleE9mKHZpZXcpIDogLTFcclxuXHRcdFx0XHR2YXIgY29udHJvbGxlciA9IGNvbnRyb2xsZXJJbmRleCA+IC0xID8gY2FjaGVkLmNvbnRyb2xsZXJzW2NvbnRyb2xsZXJJbmRleF0gOiBuZXcgKGRhdGEuY29udHJvbGxlciB8fCBub29wKVxyXG5cdFx0XHRcdHZhciBrZXkgPSBkYXRhICYmIGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy5rZXlcclxuXHRcdFx0XHRkYXRhID0gcGVuZGluZ1JlcXVlc3RzID09IDAgfHwgKGNhY2hlZCAmJiBjYWNoZWQuY29udHJvbGxlcnMgJiYgY2FjaGVkLmNvbnRyb2xsZXJzLmluZGV4T2YoY29udHJvbGxlcikgPiAtMSkgPyBkYXRhLnZpZXcoY29udHJvbGxlcikgOiB7dGFnOiBcInBsYWNlaG9sZGVyXCJ9XHJcblx0XHRcdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZDtcclxuXHRcdFx0XHRpZiAoa2V5KSB7XHJcblx0XHRcdFx0XHRpZiAoIWRhdGEuYXR0cnMpIGRhdGEuYXR0cnMgPSB7fVxyXG5cdFx0XHRcdFx0ZGF0YS5hdHRycy5rZXkgPSBrZXlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQpIHVubG9hZGVycy5wdXNoKHtjb250cm9sbGVyOiBjb250cm9sbGVyLCBoYW5kbGVyOiBjb250cm9sbGVyLm9udW5sb2FkfSlcclxuXHRcdFx0XHR2aWV3cy5wdXNoKHZpZXcpXHJcblx0XHRcdFx0Y29udHJvbGxlcnMucHVzaChjb250cm9sbGVyKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghZGF0YS50YWcgJiYgY29udHJvbGxlcnMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgdGVtcGxhdGUgbXVzdCByZXR1cm4gYSB2aXJ0dWFsIGVsZW1lbnQsIG5vdCBhbiBhcnJheSwgc3RyaW5nLCBldGMuXCIpXHJcblx0XHRcdGlmICghZGF0YS5hdHRycykgZGF0YS5hdHRycyA9IHt9O1xyXG5cdFx0XHRpZiAoIWNhY2hlZC5hdHRycykgY2FjaGVkLmF0dHJzID0ge307XHJcblxyXG5cdFx0XHR2YXIgZGF0YUF0dHJLZXlzID0gT2JqZWN0LmtleXMoZGF0YS5hdHRycylcclxuXHRcdFx0dmFyIGhhc0tleXMgPSBkYXRhQXR0cktleXMubGVuZ3RoID4gKFwia2V5XCIgaW4gZGF0YS5hdHRycyA/IDEgOiAwKVxyXG5cdFx0XHQvL2lmIGFuIGVsZW1lbnQgaXMgZGlmZmVyZW50IGVub3VnaCBmcm9tIHRoZSBvbmUgaW4gY2FjaGUsIHJlY3JlYXRlIGl0XHJcblx0XHRcdGlmIChkYXRhLnRhZyAhPSBjYWNoZWQudGFnIHx8IGRhdGFBdHRyS2V5cy5zb3J0KCkuam9pbigpICE9IE9iamVjdC5rZXlzKGNhY2hlZC5hdHRycykuc29ydCgpLmpvaW4oKSB8fCBkYXRhLmF0dHJzLmlkICE9IGNhY2hlZC5hdHRycy5pZCB8fCBkYXRhLmF0dHJzLmtleSAhPSBjYWNoZWQuYXR0cnMua2V5IHx8IChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiYWxsXCIgJiYgKCFjYWNoZWQuY29uZmlnQ29udGV4dCB8fCBjYWNoZWQuY29uZmlnQ29udGV4dC5yZXRhaW4gIT09IHRydWUpKSB8fCAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcImRpZmZcIiAmJiBjYWNoZWQuY29uZmlnQ29udGV4dCAmJiBjYWNoZWQuY29uZmlnQ29udGV4dC5yZXRhaW4gPT09IGZhbHNlKSkge1xyXG5cdFx0XHRcdGlmIChjYWNoZWQubm9kZXMubGVuZ3RoKSBjbGVhcihjYWNoZWQubm9kZXMpO1xyXG5cdFx0XHRcdGlmIChjYWNoZWQuY29uZmlnQ29udGV4dCAmJiB0eXBlb2YgY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQgPT09IEZVTkNUSU9OKSBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpXHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jb250cm9sbGVycykge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNvbnRyb2xsZXI7IGNvbnRyb2xsZXIgPSBjYWNoZWQuY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNvbnRyb2xsZXIub251bmxvYWQgPT09IEZVTkNUSU9OKSBjb250cm9sbGVyLm9udW5sb2FkKHtwcmV2ZW50RGVmYXVsdDogbm9vcH0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0eXBlLmNhbGwoZGF0YS50YWcpICE9IFNUUklORykgcmV0dXJuO1xyXG5cclxuXHRcdFx0dmFyIG5vZGUsIGlzTmV3ID0gY2FjaGVkLm5vZGVzLmxlbmd0aCA9PT0gMDtcclxuXHRcdFx0aWYgKGRhdGEuYXR0cnMueG1sbnMpIG5hbWVzcGFjZSA9IGRhdGEuYXR0cnMueG1sbnM7XHJcblx0XHRcdGVsc2UgaWYgKGRhdGEudGFnID09PSBcInN2Z1wiKSBuYW1lc3BhY2UgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XHJcblx0XHRcdGVsc2UgaWYgKGRhdGEudGFnID09PSBcIm1hdGhcIikgbmFtZXNwYWNlID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCI7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoaXNOZXcpIHtcclxuXHRcdFx0XHRpZiAoZGF0YS5hdHRycy5pcykgbm9kZSA9IG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID8gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnLCBkYXRhLmF0dHJzLmlzKTtcclxuXHRcdFx0XHRlbHNlIG5vZGUgPSBuYW1lc3BhY2UgPT09IHVuZGVmaW5lZCA/ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnKSA6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZyk7XHJcblx0XHRcdFx0Y2FjaGVkID0ge1xyXG5cdFx0XHRcdFx0dGFnOiBkYXRhLnRhZyxcclxuXHRcdFx0XHRcdC8vc2V0IGF0dHJpYnV0ZXMgZmlyc3QsIHRoZW4gY3JlYXRlIGNoaWxkcmVuXHJcblx0XHRcdFx0XHRhdHRyczogaGFzS2V5cyA/IHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIHt9LCBuYW1lc3BhY2UpIDogZGF0YS5hdHRycyxcclxuXHRcdFx0XHRcdGNoaWxkcmVuOiBkYXRhLmNoaWxkcmVuICE9IG51bGwgJiYgZGF0YS5jaGlsZHJlbi5sZW5ndGggPiAwID9cclxuXHRcdFx0XHRcdFx0YnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIHRydWUsIDAsIGRhdGEuYXR0cnMuY29udGVudGVkaXRhYmxlID8gbm9kZSA6IGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0XHRcdFx0ZGF0YS5jaGlsZHJlbixcclxuXHRcdFx0XHRcdG5vZGVzOiBbbm9kZV1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChjb250cm9sbGVycy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNhY2hlZC52aWV3cyA9IHZpZXdzXHJcblx0XHRcdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVyc1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNvbnRyb2xsZXI7IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb250cm9sbGVyLm9udW5sb2FkICYmIGNvbnRyb2xsZXIub251bmxvYWQuJG9sZCkgY29udHJvbGxlci5vbnVubG9hZCA9IGNvbnRyb2xsZXIub251bmxvYWQuJG9sZFxyXG5cdFx0XHRcdFx0XHRpZiAocGVuZGluZ1JlcXVlc3RzICYmIGNvbnRyb2xsZXIub251bmxvYWQpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb251bmxvYWQgPSBjb250cm9sbGVyLm9udW5sb2FkXHJcblx0XHRcdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZCA9IG5vb3BcclxuXHRcdFx0XHRcdFx0XHRjb250cm9sbGVyLm9udW5sb2FkLiRvbGQgPSBvbnVubG9hZFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChjYWNoZWQuY2hpbGRyZW4gJiYgIWNhY2hlZC5jaGlsZHJlbi5ub2RlcykgY2FjaGVkLmNoaWxkcmVuLm5vZGVzID0gW107XHJcblx0XHRcdFx0Ly9lZGdlIGNhc2U6IHNldHRpbmcgdmFsdWUgb24gPHNlbGVjdD4gZG9lc24ndCB3b3JrIGJlZm9yZSBjaGlsZHJlbiBleGlzdCwgc28gc2V0IGl0IGFnYWluIGFmdGVyIGNoaWxkcmVuIGhhdmUgYmVlbiBjcmVhdGVkXHJcblx0XHRcdFx0aWYgKGRhdGEudGFnID09PSBcInNlbGVjdFwiICYmIFwidmFsdWVcIiBpbiBkYXRhLmF0dHJzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCB7dmFsdWU6IGRhdGEuYXR0cnMudmFsdWV9LCB7fSwgbmFtZXNwYWNlKTtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bm9kZSA9IGNhY2hlZC5ub2Rlc1swXTtcclxuXHRcdFx0XHRpZiAoaGFzS2V5cykgc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywgY2FjaGVkLmF0dHJzLCBuYW1lc3BhY2UpO1xyXG5cdFx0XHRcdGNhY2hlZC5jaGlsZHJlbiA9IGJ1aWxkKG5vZGUsIGRhdGEudGFnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZGF0YS5jaGlsZHJlbiwgY2FjaGVkLmNoaWxkcmVuLCBmYWxzZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncyk7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzLmludGFjdCA9IHRydWU7XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y2FjaGVkLnZpZXdzID0gdmlld3NcclxuXHRcdFx0XHRcdGNhY2hlZC5jb250cm9sbGVycyA9IGNvbnRyb2xsZXJzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSAmJiBub2RlICE9IG51bGwpIHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHQvL3NjaGVkdWxlIGNvbmZpZ3MgdG8gYmUgY2FsbGVkLiBUaGV5IGFyZSBjYWxsZWQgYWZ0ZXIgYGJ1aWxkYCBmaW5pc2hlcyBydW5uaW5nXHJcblx0XHRcdGlmICh0eXBlb2YgZGF0YS5hdHRyc1tcImNvbmZpZ1wiXSA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR2YXIgY29udGV4dCA9IGNhY2hlZC5jb25maWdDb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgfHwge307XHJcblxyXG5cdFx0XHRcdC8vIGJpbmRcclxuXHRcdFx0XHR2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbihkYXRhLCBhcmdzKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhLmF0dHJzW1wiY29uZmlnXCJdLmFwcGx5KGRhdGEsIGFyZ3MpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRjb25maWdzLnB1c2goY2FsbGJhY2soZGF0YSwgW25vZGUsICFpc05ldywgY29udGV4dCwgY2FjaGVkXSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHR5cGVvZiBkYXRhICE9IEZVTkNUSU9OKSB7XHJcblx0XHRcdC8vaGFuZGxlIHRleHQgbm9kZXNcclxuXHRcdFx0dmFyIG5vZGVzO1xyXG5cdFx0XHRpZiAoY2FjaGVkLm5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHRub2RlcyA9IGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0bm9kZXMgPSBbJGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpXTtcclxuXHRcdFx0XHRcdGlmICghcGFyZW50RWxlbWVudC5ub2RlTmFtZS5tYXRjaCh2b2lkRWxlbWVudHMpKSBwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2Rlc1swXSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYWNoZWQgPSBcInN0cmluZyBudW1iZXIgYm9vbGVhblwiLmluZGV4T2YodHlwZW9mIGRhdGEpID4gLTEgPyBuZXcgZGF0YS5jb25zdHJ1Y3RvcihkYXRhKSA6IGRhdGE7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjYWNoZWQudmFsdWVPZigpICE9PSBkYXRhLnZhbHVlT2YoKSB8fCBzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdG5vZGVzID0gY2FjaGVkLm5vZGVzO1xyXG5cdFx0XHRcdGlmICghZWRpdGFibGUgfHwgZWRpdGFibGUgIT09ICRkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdFx0XHRjbGVhcihub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0XHRcdFx0bm9kZXMgPSBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vY29ybmVyIGNhc2U6IHJlcGxhY2luZyB0aGUgbm9kZVZhbHVlIG9mIGEgdGV4dCBub2RlIHRoYXQgaXMgYSBjaGlsZCBvZiBhIHRleHRhcmVhL2NvbnRlbnRlZGl0YWJsZSBkb2Vzbid0IHdvcmtcclxuXHRcdFx0XHRcdFx0Ly93ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgdmFsdWUgcHJvcGVydHkgb2YgdGhlIHBhcmVudCB0ZXh0YXJlYSBvciB0aGUgaW5uZXJIVE1MIG9mIHRoZSBjb250ZW50ZWRpdGFibGUgZWxlbWVudCBpbnN0ZWFkXHJcblx0XHRcdFx0XHRcdGlmIChwYXJlbnRUYWcgPT09IFwidGV4dGFyZWFcIikgcGFyZW50RWxlbWVudC52YWx1ZSA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGVkaXRhYmxlKSBlZGl0YWJsZS5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAobm9kZXNbMF0ubm9kZVR5cGUgPT09IDEgfHwgbm9kZXMubGVuZ3RoID4gMSkgeyAvL3dhcyBhIHRydXN0ZWQgc3RyaW5nXHJcblx0XHRcdFx0XHRcdFx0XHRjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZCk7XHJcblx0XHRcdFx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGVzWzBdLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdG5vZGVzWzBdLm5vZGVWYWx1ZSA9IGRhdGFcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcihkYXRhKTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgY2FjaGVkLm5vZGVzLmludGFjdCA9IHRydWVcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY2FjaGVkXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHNvcnRDaGFuZ2VzKGEsIGIpIHtyZXR1cm4gYS5hY3Rpb24gLSBiLmFjdGlvbiB8fCBhLmluZGV4IC0gYi5pbmRleH1cclxuXHRmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKG5vZGUsIHRhZywgZGF0YUF0dHJzLCBjYWNoZWRBdHRycywgbmFtZXNwYWNlKSB7XHJcblx0XHRmb3IgKHZhciBhdHRyTmFtZSBpbiBkYXRhQXR0cnMpIHtcclxuXHRcdFx0dmFyIGRhdGFBdHRyID0gZGF0YUF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0dmFyIGNhY2hlZEF0dHIgPSBjYWNoZWRBdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdGlmICghKGF0dHJOYW1lIGluIGNhY2hlZEF0dHJzKSB8fCAoY2FjaGVkQXR0ciAhPT0gZGF0YUF0dHIpKSB7XHJcblx0XHRcdFx0Y2FjaGVkQXR0cnNbYXR0ck5hbWVdID0gZGF0YUF0dHI7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vYGNvbmZpZ2AgaXNuJ3QgYSByZWFsIGF0dHJpYnV0ZXMsIHNvIGlnbm9yZSBpdFxyXG5cdFx0XHRcdFx0aWYgKGF0dHJOYW1lID09PSBcImNvbmZpZ1wiIHx8IGF0dHJOYW1lID09IFwia2V5XCIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0Ly9ob29rIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBhdXRvLXJlZHJhd2luZyBzeXN0ZW1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkYXRhQXR0ciA9PT0gRlVOQ1RJT04gJiYgYXR0ck5hbWUuaW5kZXhPZihcIm9uXCIpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdG5vZGVbYXR0ck5hbWVdID0gYXV0b3JlZHJhdyhkYXRhQXR0ciwgbm9kZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vaGFuZGxlIGBzdHlsZTogey4uLn1gXHJcblx0XHRcdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJzdHlsZVwiICYmIGRhdGFBdHRyICE9IG51bGwgJiYgdHlwZS5jYWxsKGRhdGFBdHRyKSA9PT0gT0JKRUNUKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoY2FjaGVkQXR0ciA9PSBudWxsIHx8IGNhY2hlZEF0dHJbcnVsZV0gIT09IGRhdGFBdHRyW3J1bGVdKSBub2RlLnN0eWxlW3J1bGVdID0gZGF0YUF0dHJbcnVsZV1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBydWxlIGluIGNhY2hlZEF0dHIpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIShydWxlIGluIGRhdGFBdHRyKSkgbm9kZS5zdHlsZVtydWxlXSA9IFwiXCJcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgU1ZHXHJcblx0XHRcdFx0XHRlbHNlIGlmIChuYW1lc3BhY2UgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiaHJlZlwiKSBub2RlLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCBcImhyZWZcIiwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJjbGFzc05hbWVcIikgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBkYXRhQXR0cik7XHJcblx0XHRcdFx0XHRcdGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGRhdGFBdHRyKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgY2FzZXMgdGhhdCBhcmUgcHJvcGVydGllcyAoYnV0IGlnbm9yZSBjYXNlcyB3aGVyZSB3ZSBzaG91bGQgdXNlIHNldEF0dHJpYnV0ZSBpbnN0ZWFkKVxyXG5cdFx0XHRcdFx0Ly8tIGxpc3QgYW5kIGZvcm0gYXJlIHR5cGljYWxseSB1c2VkIGFzIHN0cmluZ3MsIGJ1dCBhcmUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlcyBpbiBqc1xyXG5cdFx0XHRcdFx0Ly8tIHdoZW4gdXNpbmcgQ1NTIHNlbGVjdG9ycyAoZS5nLiBgbShcIltzdHlsZT0nJ11cIilgKSwgc3R5bGUgaXMgdXNlZCBhcyBhIHN0cmluZywgYnV0IGl0J3MgYW4gb2JqZWN0IGluIGpzXHJcblx0XHRcdFx0XHRlbHNlIGlmIChhdHRyTmFtZSBpbiBub2RlICYmICEoYXR0ck5hbWUgPT09IFwibGlzdFwiIHx8IGF0dHJOYW1lID09PSBcInN0eWxlXCIgfHwgYXR0ck5hbWUgPT09IFwiZm9ybVwiIHx8IGF0dHJOYW1lID09PSBcInR5cGVcIiB8fCBhdHRyTmFtZSA9PT0gXCJ3aWR0aFwiIHx8IGF0dHJOYW1lID09PSBcImhlaWdodFwiKSkge1xyXG5cdFx0XHRcdFx0XHQvLyMzNDggZG9uJ3Qgc2V0IHRoZSB2YWx1ZSBpZiBub3QgbmVlZGVkIG90aGVyd2lzZSBjdXJzb3IgcGxhY2VtZW50IGJyZWFrcyBpbiBDaHJvbWVcclxuXHRcdFx0XHRcdFx0aWYgKHRhZyAhPT0gXCJpbnB1dFwiIHx8IG5vZGVbYXR0ck5hbWVdICE9PSBkYXRhQXR0cikgbm9kZVthdHRyTmFtZV0gPSBkYXRhQXR0clxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHQvL3N3YWxsb3cgSUUncyBpbnZhbGlkIGFyZ3VtZW50IGVycm9ycyB0byBtaW1pYyBIVE1MJ3MgZmFsbGJhY2stdG8tZG9pbmctbm90aGluZy1vbi1pbnZhbGlkLWF0dHJpYnV0ZXMgYmVoYXZpb3JcclxuXHRcdFx0XHRcdGlmIChlLm1lc3NhZ2UuaW5kZXhPZihcIkludmFsaWQgYXJndW1lbnRcIikgPCAwKSB0aHJvdyBlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIzM0OCBkYXRhQXR0ciBtYXkgbm90IGJlIGEgc3RyaW5nLCBzbyB1c2UgbG9vc2UgY29tcGFyaXNvbiAoZG91YmxlIGVxdWFsKSBpbnN0ZWFkIG9mIHN0cmljdCAodHJpcGxlIGVxdWFsKVxyXG5cdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJ2YWx1ZVwiICYmIHRhZyA9PT0gXCJpbnB1dFwiICYmIG5vZGUudmFsdWUgIT0gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRub2RlLnZhbHVlID0gZGF0YUF0dHJcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNhY2hlZEF0dHJzXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGNsZWFyKG5vZGVzLCBjYWNoZWQpIHtcclxuXHRcdGZvciAodmFyIGkgPSBub2Rlcy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xyXG5cdFx0XHRpZiAobm9kZXNbaV0gJiYgbm9kZXNbaV0ucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRcdHRyeSB7bm9kZXNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2Rlc1tpXSl9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHt9IC8vaWdub3JlIGlmIHRoaXMgZmFpbHMgZHVlIHRvIG9yZGVyIG9mIGV2ZW50cyAoc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjE5MjYwODMvZmFpbGVkLXRvLWV4ZWN1dGUtcmVtb3ZlY2hpbGQtb24tbm9kZSlcclxuXHRcdFx0XHRjYWNoZWQgPSBbXS5jb25jYXQoY2FjaGVkKTtcclxuXHRcdFx0XHRpZiAoY2FjaGVkW2ldKSB1bmxvYWQoY2FjaGVkW2ldKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobm9kZXMubGVuZ3RoICE9IDApIG5vZGVzLmxlbmd0aCA9IDBcclxuXHR9XHJcblx0ZnVuY3Rpb24gdW5sb2FkKGNhY2hlZCkge1xyXG5cdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Y2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQoKTtcclxuXHRcdFx0Y2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQgPSBudWxsXHJcblx0XHR9XHJcblx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY2FjaGVkLmNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNvbnRyb2xsZXIub251bmxvYWQgPT09IEZVTkNUSU9OKSBjb250cm9sbGVyLm9udW5sb2FkKHtwcmV2ZW50RGVmYXVsdDogbm9vcH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoY2FjaGVkLmNoaWxkcmVuKSB7XHJcblx0XHRcdGlmICh0eXBlLmNhbGwoY2FjaGVkLmNoaWxkcmVuKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2FjaGVkLmNoaWxkcmVuW2ldOyBpKyspIHVubG9hZChjaGlsZClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjYWNoZWQuY2hpbGRyZW4udGFnKSB1bmxvYWQoY2FjaGVkLmNoaWxkcmVuKVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKSB7XHJcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdO1xyXG5cdFx0aWYgKG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdHZhciBpc0VsZW1lbnQgPSBuZXh0U2libGluZy5ub2RlVHlwZSAhPSAxO1xyXG5cdFx0XHR2YXIgcGxhY2Vob2xkZXIgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblx0XHRcdGlmIChpc0VsZW1lbnQpIHtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShwbGFjZWhvbGRlciwgbmV4dFNpYmxpbmcgfHwgbnVsbCk7XHJcblx0XHRcdFx0cGxhY2Vob2xkZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSk7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChwbGFjZWhvbGRlcilcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIG5leHRTaWJsaW5nLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpXHJcblx0XHR9XHJcblx0XHRlbHNlIHBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGRhdGEpO1xyXG5cdFx0dmFyIG5vZGVzID0gW107XHJcblx0XHR3aGlsZSAocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSAhPT0gbmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0bm9kZXMucHVzaChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdFx0aW5kZXgrK1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vZGVzXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGF1dG9yZWRyYXcoY2FsbGJhY2ssIG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKTtcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHRyeSB7cmV0dXJuIGNhbGxiYWNrLmNhbGwob2JqZWN0LCBlKX1cclxuXHRcdFx0ZmluYWxseSB7XHJcblx0XHRcdFx0ZW5kRmlyc3RDb21wdXRhdGlvbigpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBodG1sO1xyXG5cdHZhciBkb2N1bWVudE5vZGUgPSB7XHJcblx0XHRhcHBlbmRDaGlsZDogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0XHRpZiAoaHRtbCA9PT0gdW5kZWZpbmVkKSBodG1sID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJodG1sXCIpO1xyXG5cdFx0XHRpZiAoJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICE9PSBub2RlKSB7XHJcblx0XHRcdFx0JGRvY3VtZW50LnJlcGxhY2VDaGlsZChub2RlLCAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgJGRvY3VtZW50LmFwcGVuZENoaWxkKG5vZGUpO1xyXG5cdFx0XHR0aGlzLmNoaWxkTm9kZXMgPSAkZG9jdW1lbnQuY2hpbGROb2Rlc1xyXG5cdFx0fSxcclxuXHRcdGluc2VydEJlZm9yZTogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKG5vZGUpXHJcblx0XHR9LFxyXG5cdFx0Y2hpbGROb2RlczogW11cclxuXHR9O1xyXG5cdHZhciBub2RlQ2FjaGUgPSBbXSwgY2VsbENhY2hlID0ge307XHJcblx0bS5yZW5kZXIgPSBmdW5jdGlvbihyb290LCBjZWxsLCBmb3JjZVJlY3JlYXRpb24pIHtcclxuXHRcdHZhciBjb25maWdzID0gW107XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIkVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgYmVpbmcgcGFzc2VkIHRvIG0ucm91dGUvbS5tb3VudC9tLnJlbmRlciBpcyBub3QgdW5kZWZpbmVkLlwiKTtcclxuXHRcdHZhciBpZCA9IGdldENlbGxDYWNoZUtleShyb290KTtcclxuXHRcdHZhciBpc0RvY3VtZW50Um9vdCA9IHJvb3QgPT09ICRkb2N1bWVudDtcclxuXHRcdHZhciBub2RlID0gaXNEb2N1bWVudFJvb3QgfHwgcm9vdCA9PT0gJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA/IGRvY3VtZW50Tm9kZSA6IHJvb3Q7XHJcblx0XHRpZiAoaXNEb2N1bWVudFJvb3QgJiYgY2VsbC50YWcgIT0gXCJodG1sXCIpIGNlbGwgPSB7dGFnOiBcImh0bWxcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogY2VsbH07XHJcblx0XHRpZiAoY2VsbENhY2hlW2lkXSA9PT0gdW5kZWZpbmVkKSBjbGVhcihub2RlLmNoaWxkTm9kZXMpO1xyXG5cdFx0aWYgKGZvcmNlUmVjcmVhdGlvbiA9PT0gdHJ1ZSkgcmVzZXQocm9vdCk7XHJcblx0XHRjZWxsQ2FjaGVbaWRdID0gYnVpbGQobm9kZSwgbnVsbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNlbGwsIGNlbGxDYWNoZVtpZF0sIGZhbHNlLCAwLCBudWxsLCB1bmRlZmluZWQsIGNvbmZpZ3MpO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvbmZpZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIGNvbmZpZ3NbaV0oKVxyXG5cdH07XHJcblx0ZnVuY3Rpb24gZ2V0Q2VsbENhY2hlS2V5KGVsZW1lbnQpIHtcclxuXHRcdHZhciBpbmRleCA9IG5vZGVDYWNoZS5pbmRleE9mKGVsZW1lbnQpO1xyXG5cdFx0cmV0dXJuIGluZGV4IDwgMCA/IG5vZGVDYWNoZS5wdXNoKGVsZW1lbnQpIC0gMSA6IGluZGV4XHJcblx0fVxyXG5cclxuXHRtLnRydXN0ID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlID0gbmV3IFN0cmluZyh2YWx1ZSk7XHJcblx0XHR2YWx1ZS4kdHJ1c3RlZCA9IHRydWU7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXR0ZXJzZXR0ZXIoc3RvcmUpIHtcclxuXHRcdHZhciBwcm9wID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSBzdG9yZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0cmV0dXJuIHN0b3JlXHJcblx0XHR9O1xyXG5cclxuXHRcdHByb3AudG9KU09OID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBzdG9yZVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gcHJvcFxyXG5cdH1cclxuXHJcblx0bS5wcm9wID0gZnVuY3Rpb24gKHN0b3JlKSB7XHJcblx0XHQvL25vdGU6IHVzaW5nIG5vbi1zdHJpY3QgZXF1YWxpdHkgY2hlY2sgaGVyZSBiZWNhdXNlIHdlJ3JlIGNoZWNraW5nIGlmIHN0b3JlIGlzIG51bGwgT1IgdW5kZWZpbmVkXHJcblx0XHRpZiAoKChzdG9yZSAhPSBudWxsICYmIHR5cGUuY2FsbChzdG9yZSkgPT09IE9CSkVDVCkgfHwgdHlwZW9mIHN0b3JlID09PSBGVU5DVElPTikgJiYgdHlwZW9mIHN0b3JlLnRoZW4gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHN0b3JlKVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBnZXR0ZXJzZXR0ZXIoc3RvcmUpXHJcblx0fTtcclxuXHJcblx0dmFyIHJvb3RzID0gW10sIGNvbXBvbmVudHMgPSBbXSwgY29udHJvbGxlcnMgPSBbXSwgbGFzdFJlZHJhd0lkID0gbnVsbCwgbGFzdFJlZHJhd0NhbGxUaW1lID0gMCwgY29tcHV0ZVByZVJlZHJhd0hvb2sgPSBudWxsLCBjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsLCBwcmV2ZW50ZWQgPSBmYWxzZSwgdG9wQ29tcG9uZW50LCB1bmxvYWRlcnMgPSBbXTtcclxuXHR2YXIgRlJBTUVfQlVER0VUID0gMTY7IC8vNjAgZnJhbWVzIHBlciBzZWNvbmQgPSAxIGNhbGwgcGVyIDE2IG1zXHJcblx0ZnVuY3Rpb24gcGFyYW1ldGVyaXplKGNvbXBvbmVudCwgYXJncykge1xyXG5cdFx0dmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIChjb21wb25lbnQuY29udHJvbGxlciB8fCBub29wKS5hcHBseSh0aGlzLCBhcmdzKSB8fCB0aGlzXHJcblx0XHR9XHJcblx0XHR2YXIgdmlldyA9IGZ1bmN0aW9uKGN0cmwpIHtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSBhcmdzID0gYXJncy5jb25jYXQoW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKVxyXG5cdFx0XHRyZXR1cm4gY29tcG9uZW50LnZpZXcuYXBwbHkoY29tcG9uZW50LCBhcmdzID8gW2N0cmxdLmNvbmNhdChhcmdzKSA6IFtjdHJsXSlcclxuXHRcdH1cclxuXHRcdHZpZXcuJG9yaWdpbmFsID0gY29tcG9uZW50LnZpZXdcclxuXHRcdHZhciBvdXRwdXQgPSB7Y29udHJvbGxlcjogY29udHJvbGxlciwgdmlldzogdmlld31cclxuXHRcdGlmIChhcmdzWzBdICYmIGFyZ3NbMF0ua2V5ICE9IG51bGwpIG91dHB1dC5hdHRycyA9IHtrZXk6IGFyZ3NbMF0ua2V5fVxyXG5cdFx0cmV0dXJuIG91dHB1dFxyXG5cdH1cclxuXHRtLmNvbXBvbmVudCA9IGZ1bmN0aW9uKGNvbXBvbmVudCkge1xyXG5cdFx0cmV0dXJuIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSlcclxuXHR9XHJcblx0bS5tb3VudCA9IG0ubW9kdWxlID0gZnVuY3Rpb24ocm9vdCwgY29tcG9uZW50KSB7XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBlbnN1cmUgdGhlIERPTSBlbGVtZW50IGV4aXN0cyBiZWZvcmUgcmVuZGVyaW5nIGEgdGVtcGxhdGUgaW50byBpdC5cIik7XHJcblx0XHR2YXIgaW5kZXggPSByb290cy5pbmRleE9mKHJvb3QpO1xyXG5cdFx0aWYgKGluZGV4IDwgMCkgaW5kZXggPSByb290cy5sZW5ndGg7XHJcblx0XHRcclxuXHRcdHZhciBpc1ByZXZlbnRlZCA9IGZhbHNlO1xyXG5cdFx0dmFyIGV2ZW50ID0ge3ByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aXNQcmV2ZW50ZWQgPSB0cnVlO1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGw7XHJcblx0XHR9fTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCB1bmxvYWRlcjsgdW5sb2FkZXIgPSB1bmxvYWRlcnNbaV07IGkrKykge1xyXG5cdFx0XHR1bmxvYWRlci5oYW5kbGVyLmNhbGwodW5sb2FkZXIuY29udHJvbGxlciwgZXZlbnQpXHJcblx0XHRcdHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSBudWxsXHJcblx0XHR9XHJcblx0XHRpZiAoaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIHVubG9hZGVyOyB1bmxvYWRlciA9IHVubG9hZGVyc1tpXTsgaSsrKSB1bmxvYWRlci5jb250cm9sbGVyLm9udW5sb2FkID0gdW5sb2FkZXIuaGFuZGxlclxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB1bmxvYWRlcnMgPSBbXVxyXG5cdFx0XHJcblx0XHRpZiAoY29udHJvbGxlcnNbaW5kZXhdICYmIHR5cGVvZiBjb250cm9sbGVyc1tpbmRleF0ub251bmxvYWQgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZChldmVudClcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKCFpc1ByZXZlbnRlZCkge1xyXG5cdFx0XHRtLnJlZHJhdy5zdHJhdGVneShcImFsbFwiKTtcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHJvb3RzW2luZGV4XSA9IHJvb3Q7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikgY29tcG9uZW50ID0gc3ViY29tcG9uZW50KGNvbXBvbmVudCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpKVxyXG5cdFx0XHR2YXIgY3VycmVudENvbXBvbmVudCA9IHRvcENvbXBvbmVudCA9IGNvbXBvbmVudCA9IGNvbXBvbmVudCB8fCB7Y29udHJvbGxlcjogZnVuY3Rpb24oKSB7fX07XHJcblx0XHRcdHZhciBjb25zdHJ1Y3RvciA9IGNvbXBvbmVudC5jb250cm9sbGVyIHx8IG5vb3BcclxuXHRcdFx0dmFyIGNvbnRyb2xsZXIgPSBuZXcgY29uc3RydWN0b3I7XHJcblx0XHRcdC8vY29udHJvbGxlcnMgbWF5IGNhbGwgbS5tb3VudCByZWN1cnNpdmVseSAodmlhIG0ucm91dGUgcmVkaXJlY3RzLCBmb3IgZXhhbXBsZSlcclxuXHRcdFx0Ly90aGlzIGNvbmRpdGlvbmFsIGVuc3VyZXMgb25seSB0aGUgbGFzdCByZWN1cnNpdmUgbS5tb3VudCBjYWxsIGlzIGFwcGxpZWRcclxuXHRcdFx0aWYgKGN1cnJlbnRDb21wb25lbnQgPT09IHRvcENvbXBvbmVudCkge1xyXG5cdFx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XSA9IGNvbnRyb2xsZXI7XHJcblx0XHRcdFx0Y29tcG9uZW50c1tpbmRleF0gPSBjb21wb25lbnRcclxuXHRcdFx0fVxyXG5cdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHJldHVybiBjb250cm9sbGVyc1tpbmRleF1cclxuXHRcdH1cclxuXHR9O1xyXG5cdHZhciByZWRyYXdpbmcgPSBmYWxzZVxyXG5cdG0ucmVkcmF3ID0gZnVuY3Rpb24oZm9yY2UpIHtcclxuXHRcdGlmIChyZWRyYXdpbmcpIHJldHVyblxyXG5cdFx0cmVkcmF3aW5nID0gdHJ1ZVxyXG5cdFx0Ly9sYXN0UmVkcmF3SWQgaXMgYSBwb3NpdGl2ZSBudW1iZXIgaWYgYSBzZWNvbmQgcmVkcmF3IGlzIHJlcXVlc3RlZCBiZWZvcmUgdGhlIG5leHQgYW5pbWF0aW9uIGZyYW1lXHJcblx0XHQvL2xhc3RSZWRyYXdJRCBpcyBudWxsIGlmIGl0J3MgdGhlIGZpcnN0IHJlZHJhdyBhbmQgbm90IGFuIGV2ZW50IGhhbmRsZXJcclxuXHRcdGlmIChsYXN0UmVkcmF3SWQgJiYgZm9yY2UgIT09IHRydWUpIHtcclxuXHRcdFx0Ly93aGVuIHNldFRpbWVvdXQ6IG9ubHkgcmVzY2hlZHVsZSByZWRyYXcgaWYgdGltZSBiZXR3ZWVuIG5vdyBhbmQgcHJldmlvdXMgcmVkcmF3IGlzIGJpZ2dlciB0aGFuIGEgZnJhbWUsIG90aGVyd2lzZSBrZWVwIGN1cnJlbnRseSBzY2hlZHVsZWQgdGltZW91dFxyXG5cdFx0XHQvL3doZW4gckFGOiBhbHdheXMgcmVzY2hlZHVsZSByZWRyYXdcclxuXHRcdFx0aWYgKCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgbmV3IERhdGUgLSBsYXN0UmVkcmF3Q2FsbFRpbWUgPiBGUkFNRV9CVURHRVQpIHtcclxuXHRcdFx0XHRpZiAobGFzdFJlZHJhd0lkID4gMCkgJGNhbmNlbEFuaW1hdGlvbkZyYW1lKGxhc3RSZWRyYXdJZCk7XHJcblx0XHRcdFx0bGFzdFJlZHJhd0lkID0gJHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXcsIEZSQU1FX0JVREdFVClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJlZHJhdygpO1xyXG5cdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge2xhc3RSZWRyYXdJZCA9IG51bGx9LCBGUkFNRV9CVURHRVQpXHJcblx0XHR9XHJcblx0XHRyZWRyYXdpbmcgPSBmYWxzZVxyXG5cdH07XHJcblx0bS5yZWRyYXcuc3RyYXRlZ3kgPSBtLnByb3AoKTtcclxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XHJcblx0XHRpZiAoY29tcHV0ZVByZVJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2soKVxyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGxcclxuXHRcdH1cclxuXHRcdGZvciAodmFyIGkgPSAwLCByb290OyByb290ID0gcm9vdHNbaV07IGkrKykge1xyXG5cdFx0XHRpZiAoY29udHJvbGxlcnNbaV0pIHtcclxuXHRcdFx0XHR2YXIgYXJncyA9IGNvbXBvbmVudHNbaV0uY29udHJvbGxlciAmJiBjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIuJCRhcmdzID8gW2NvbnRyb2xsZXJzW2ldXS5jb25jYXQoY29tcG9uZW50c1tpXS5jb250cm9sbGVyLiQkYXJncykgOiBbY29udHJvbGxlcnNbaV1dXHJcblx0XHRcdFx0bS5yZW5kZXIocm9vdCwgY29tcG9uZW50c1tpXS52aWV3ID8gY29tcG9uZW50c1tpXS52aWV3KGNvbnRyb2xsZXJzW2ldLCBhcmdzKSA6IFwiXCIpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vYWZ0ZXIgcmVuZGVyaW5nIHdpdGhpbiBhIHJvdXRlZCBjb250ZXh0LCB3ZSBuZWVkIHRvIHNjcm9sbCBiYWNrIHRvIHRoZSB0b3AsIGFuZCBmZXRjaCB0aGUgZG9jdW1lbnQgdGl0bGUgZm9yIGhpc3RvcnkucHVzaFN0YXRlXHJcblx0XHRpZiAoY29tcHV0ZVBvc3RSZWRyYXdIb29rKSB7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vaygpO1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsXHJcblx0XHR9XHJcblx0XHRsYXN0UmVkcmF3SWQgPSBudWxsO1xyXG5cdFx0bGFzdFJlZHJhd0NhbGxUaW1lID0gbmV3IERhdGU7XHJcblx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIilcclxuXHR9XHJcblxyXG5cdHZhciBwZW5kaW5nUmVxdWVzdHMgPSAwO1xyXG5cdG0uc3RhcnRDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge3BlbmRpbmdSZXF1ZXN0cysrfTtcclxuXHRtLmVuZENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRwZW5kaW5nUmVxdWVzdHMgPSBNYXRoLm1heChwZW5kaW5nUmVxdWVzdHMgLSAxLCAwKTtcclxuXHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgPT09IDApIG0ucmVkcmF3KClcclxuXHR9O1xyXG5cdHZhciBlbmRGaXJzdENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcIm5vbmVcIikge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMtLVxyXG5cdFx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIilcclxuXHRcdH1cclxuXHRcdGVsc2UgbS5lbmRDb21wdXRhdGlvbigpO1xyXG5cdH1cclxuXHJcblx0bS53aXRoQXR0ciA9IGZ1bmN0aW9uKHByb3AsIHdpdGhBdHRyQ2FsbGJhY2spIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCB0aGlzO1xyXG5cdFx0XHR3aXRoQXR0ckNhbGxiYWNrKHByb3AgaW4gY3VycmVudFRhcmdldCA/IGN1cnJlbnRUYXJnZXRbcHJvcF0gOiBjdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShwcm9wKSlcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvL3JvdXRpbmdcclxuXHR2YXIgbW9kZXMgPSB7cGF0aG5hbWU6IFwiXCIsIGhhc2g6IFwiI1wiLCBzZWFyY2g6IFwiP1wifTtcclxuXHR2YXIgcmVkaXJlY3QgPSBub29wLCByb3V0ZVBhcmFtcywgY3VycmVudFJvdXRlLCBpc0RlZmF1bHRSb3V0ZSA9IGZhbHNlO1xyXG5cdG0ucm91dGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8vbS5yb3V0ZSgpXHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGN1cnJlbnRSb3V0ZTtcclxuXHRcdC8vbS5yb3V0ZShlbCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpXHJcblx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIHR5cGUuY2FsbChhcmd1bWVudHNbMV0pID09PSBTVFJJTkcpIHtcclxuXHRcdFx0dmFyIHJvb3QgPSBhcmd1bWVudHNbMF0sIGRlZmF1bHRSb3V0ZSA9IGFyZ3VtZW50c1sxXSwgcm91dGVyID0gYXJndW1lbnRzWzJdO1xyXG5cdFx0XHRyZWRpcmVjdCA9IGZ1bmN0aW9uKHNvdXJjZSkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gY3VycmVudFJvdXRlID0gbm9ybWFsaXplUm91dGUoc291cmNlKTtcclxuXHRcdFx0XHRpZiAoIXJvdXRlQnlWYWx1ZShyb290LCByb3V0ZXIsIHBhdGgpKSB7XHJcblx0XHRcdFx0XHRpZiAoaXNEZWZhdWx0Um91dGUpIHRocm93IG5ldyBFcnJvcihcIkVuc3VyZSB0aGUgZGVmYXVsdCByb3V0ZSBtYXRjaGVzIG9uZSBvZiB0aGUgcm91dGVzIGRlZmluZWQgaW4gbS5yb3V0ZVwiKVxyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSB0cnVlXHJcblx0XHRcdFx0XHRtLnJvdXRlKGRlZmF1bHRSb3V0ZSwgdHJ1ZSlcclxuXHRcdFx0XHRcdGlzRGVmYXVsdFJvdXRlID0gZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBsaXN0ZW5lciA9IG0ucm91dGUubW9kZSA9PT0gXCJoYXNoXCIgPyBcIm9uaGFzaGNoYW5nZVwiIDogXCJvbnBvcHN0YXRlXCI7XHJcblx0XHRcdHdpbmRvd1tsaXN0ZW5lcl0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgcGF0aCA9ICRsb2NhdGlvblttLnJvdXRlLm1vZGVdXHJcblx0XHRcdFx0aWYgKG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiKSBwYXRoICs9ICRsb2NhdGlvbi5zZWFyY2hcclxuXHRcdFx0XHRpZiAoY3VycmVudFJvdXRlICE9IG5vcm1hbGl6ZVJvdXRlKHBhdGgpKSB7XHJcblx0XHRcdFx0XHRyZWRpcmVjdChwYXRoKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGw7XHJcblx0XHRcdHdpbmRvd1tsaXN0ZW5lcl0oKVxyXG5cdFx0fVxyXG5cdFx0Ly9jb25maWc6IG0ucm91dGVcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50c1swXS5hZGRFdmVudExpc3RlbmVyIHx8IGFyZ3VtZW50c1swXS5hdHRhY2hFdmVudCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0dmFyIGlzSW5pdGlhbGl6ZWQgPSBhcmd1bWVudHNbMV07XHJcblx0XHRcdHZhciBjb250ZXh0ID0gYXJndW1lbnRzWzJdO1xyXG5cdFx0XHR2YXIgdmRvbSA9IGFyZ3VtZW50c1szXTtcclxuXHRcdFx0ZWxlbWVudC5ocmVmID0gKG0ucm91dGUubW9kZSAhPT0gJ3BhdGhuYW1lJyA/ICRsb2NhdGlvbi5wYXRobmFtZSA6ICcnKSArIG1vZGVzW20ucm91dGUubW9kZV0gKyB2ZG9tLmF0dHJzLmhyZWY7XHJcblx0XHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuXHRcdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKTtcclxuXHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGVsZW1lbnQuZGV0YWNoRXZlbnQoXCJvbmNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpO1xyXG5cdFx0XHRcdGVsZW1lbnQuYXR0YWNoRXZlbnQoXCJvbmNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vbS5yb3V0ZShyb3V0ZSwgcGFyYW1zLCBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5KVxyXG5cdFx0ZWxzZSBpZiAodHlwZS5jYWxsKGFyZ3VtZW50c1swXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgb2xkUm91dGUgPSBjdXJyZW50Um91dGU7XHJcblx0XHRcdGN1cnJlbnRSb3V0ZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHNbMV0gfHwge31cclxuXHRcdFx0dmFyIHF1ZXJ5SW5kZXggPSBjdXJyZW50Um91dGUuaW5kZXhPZihcIj9cIilcclxuXHRcdFx0dmFyIHBhcmFtcyA9IHF1ZXJ5SW5kZXggPiAtMSA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFJvdXRlLnNsaWNlKHF1ZXJ5SW5kZXggKyAxKSkgOiB7fVxyXG5cdFx0XHRmb3IgKHZhciBpIGluIGFyZ3MpIHBhcmFtc1tpXSA9IGFyZ3NbaV1cclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhwYXJhbXMpXHJcblx0XHRcdHZhciBjdXJyZW50UGF0aCA9IHF1ZXJ5SW5kZXggPiAtMSA/IGN1cnJlbnRSb3V0ZS5zbGljZSgwLCBxdWVyeUluZGV4KSA6IGN1cnJlbnRSb3V0ZVxyXG5cdFx0XHRpZiAocXVlcnlzdHJpbmcpIGN1cnJlbnRSb3V0ZSA9IGN1cnJlbnRQYXRoICsgKGN1cnJlbnRQYXRoLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpICsgcXVlcnlzdHJpbmc7XHJcblxyXG5cdFx0XHR2YXIgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA9IChhcmd1bWVudHMubGVuZ3RoID09PSAzID8gYXJndW1lbnRzWzJdIDogYXJndW1lbnRzWzFdKSA9PT0gdHJ1ZSB8fCBvbGRSb3V0ZSA9PT0gYXJndW1lbnRzWzBdO1xyXG5cclxuXHRcdFx0aWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG5cdFx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gc2V0U2Nyb2xsXHJcblx0XHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeVtzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5ID8gXCJyZXBsYWNlU3RhdGVcIiA6IFwicHVzaFN0YXRlXCJdKG51bGwsICRkb2N1bWVudC50aXRsZSwgbW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRyZWRpcmVjdChtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdCRsb2NhdGlvblttLnJvdXRlLm1vZGVdID0gY3VycmVudFJvdXRlXHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0bS5yb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uKGtleSkge1xyXG5cdFx0aWYgKCFyb3V0ZVBhcmFtcykgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgY2FsbCBtLnJvdXRlKGVsZW1lbnQsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKSBiZWZvcmUgY2FsbGluZyBtLnJvdXRlLnBhcmFtKClcIilcclxuXHRcdHJldHVybiByb3V0ZVBhcmFtc1trZXldXHJcblx0fTtcclxuXHRtLnJvdXRlLm1vZGUgPSBcInNlYXJjaFwiO1xyXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVJvdXRlKHJvdXRlKSB7XHJcblx0XHRyZXR1cm4gcm91dGUuc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJvdXRlQnlWYWx1ZShyb290LCByb3V0ZXIsIHBhdGgpIHtcclxuXHRcdHJvdXRlUGFyYW1zID0ge307XHJcblxyXG5cdFx0dmFyIHF1ZXJ5U3RhcnQgPSBwYXRoLmluZGV4T2YoXCI/XCIpO1xyXG5cdFx0aWYgKHF1ZXJ5U3RhcnQgIT09IC0xKSB7XHJcblx0XHRcdHJvdXRlUGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZyhwYXRoLnN1YnN0cihxdWVyeVN0YXJ0ICsgMSwgcGF0aC5sZW5ndGgpKTtcclxuXHRcdFx0cGF0aCA9IHBhdGguc3Vic3RyKDAsIHF1ZXJ5U3RhcnQpXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gR2V0IGFsbCByb3V0ZXMgYW5kIGNoZWNrIGlmIHRoZXJlJ3NcclxuXHRcdC8vIGFuIGV4YWN0IG1hdGNoIGZvciB0aGUgY3VycmVudCBwYXRoXHJcblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJvdXRlcik7XHJcblx0XHR2YXIgaW5kZXggPSBrZXlzLmluZGV4T2YocGF0aCk7XHJcblx0XHRpZihpbmRleCAhPT0gLTEpe1xyXG5cdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltrZXlzIFtpbmRleF1dKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgcm91dGUgaW4gcm91dGVyKSB7XHJcblx0XHRcdGlmIChyb3V0ZSA9PT0gcGF0aCkge1xyXG5cdFx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW3JvdXRlXSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwiXlwiICsgcm91dGUucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIikucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIik7XHJcblxyXG5cdFx0XHRpZiAobWF0Y2hlci50ZXN0KHBhdGgpKSB7XHJcblx0XHRcdFx0cGF0aC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIGtleXMgPSByb3V0ZS5tYXRjaCgvOlteXFwvXSsvZykgfHwgW107XHJcblx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSByb3V0ZVBhcmFtc1trZXlzW2ldLnJlcGxhY2UoLzp8XFwuL2csIFwiXCIpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZXNbaV0pXHJcblx0XHRcdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltyb3V0ZV0pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiByb3V0ZVVub2J0cnVzaXZlKGUpIHtcclxuXHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS53aGljaCA9PT0gMikgcmV0dXJuO1xyXG5cdFx0aWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGVsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG5cdFx0dmFyIGFyZ3MgPSBtLnJvdXRlLm1vZGUgPT09IFwicGF0aG5hbWVcIiAmJiBjdXJyZW50VGFyZ2V0LnNlYXJjaCA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFRhcmdldC5zZWFyY2guc2xpY2UoMSkpIDoge307XHJcblx0XHR3aGlsZSAoY3VycmVudFRhcmdldCAmJiBjdXJyZW50VGFyZ2V0Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT0gXCJBXCIpIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0LnBhcmVudE5vZGVcclxuXHRcdG0ucm91dGUoY3VycmVudFRhcmdldFttLnJvdXRlLm1vZGVdLnNsaWNlKG1vZGVzW20ucm91dGUubW9kZV0ubGVuZ3RoKSwgYXJncylcclxuXHR9XHJcblx0ZnVuY3Rpb24gc2V0U2Nyb2xsKCkge1xyXG5cdFx0aWYgKG0ucm91dGUubW9kZSAhPSBcImhhc2hcIiAmJiAkbG9jYXRpb24uaGFzaCkgJGxvY2F0aW9uLmhhc2ggPSAkbG9jYXRpb24uaGFzaDtcclxuXHRcdGVsc2Ugd2luZG93LnNjcm9sbFRvKDAsIDApXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGJ1aWxkUXVlcnlTdHJpbmcob2JqZWN0LCBwcmVmaXgpIHtcclxuXHRcdHZhciBkdXBsaWNhdGVzID0ge31cclxuXHRcdHZhciBzdHIgPSBbXVxyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBvYmplY3QpIHtcclxuXHRcdFx0dmFyIGtleSA9IHByZWZpeCA/IHByZWZpeCArIFwiW1wiICsgcHJvcCArIFwiXVwiIDogcHJvcFxyXG5cdFx0XHR2YXIgdmFsdWUgPSBvYmplY3RbcHJvcF1cclxuXHRcdFx0dmFyIHZhbHVlVHlwZSA9IHR5cGUuY2FsbCh2YWx1ZSlcclxuXHRcdFx0dmFyIHBhaXIgPSAodmFsdWUgPT09IG51bGwpID8gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgOlxyXG5cdFx0XHRcdHZhbHVlVHlwZSA9PT0gT0JKRUNUID8gYnVpbGRRdWVyeVN0cmluZyh2YWx1ZSwga2V5KSA6XHJcblx0XHRcdFx0dmFsdWVUeXBlID09PSBBUlJBWSA/IHZhbHVlLnJlZHVjZShmdW5jdGlvbihtZW1vLCBpdGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XSkgZHVwbGljYXRlc1trZXldID0ge31cclxuXHRcdFx0XHRcdGlmICghZHVwbGljYXRlc1trZXldW2l0ZW1dKSB7XHJcblx0XHRcdFx0XHRcdGR1cGxpY2F0ZXNba2V5XVtpdGVtXSA9IHRydWVcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1lbW8uY29uY2F0KGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoaXRlbSkpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gbWVtb1xyXG5cdFx0XHRcdH0sIFtdKS5qb2luKFwiJlwiKSA6XHJcblx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSlcclxuXHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHN0ci5wdXNoKHBhaXIpXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gc3RyLmpvaW4oXCImXCIpXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmcoc3RyKSB7XHJcblx0XHRpZiAoc3RyLmNoYXJBdCgwKSA9PT0gXCI/XCIpIHN0ciA9IHN0ci5zdWJzdHJpbmcoMSk7XHJcblx0XHRcclxuXHRcdHZhciBwYWlycyA9IHN0ci5zcGxpdChcIiZcIiksIHBhcmFtcyA9IHt9O1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdHZhciBwYWlyID0gcGFpcnNbaV0uc3BsaXQoXCI9XCIpO1xyXG5cdFx0XHR2YXIga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pXHJcblx0XHRcdHZhciB2YWx1ZSA9IHBhaXIubGVuZ3RoID09IDIgPyBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSkgOiBudWxsXHJcblx0XHRcdGlmIChwYXJhbXNba2V5XSAhPSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUuY2FsbChwYXJhbXNba2V5XSkgIT09IEFSUkFZKSBwYXJhbXNba2V5XSA9IFtwYXJhbXNba2V5XV1cclxuXHRcdFx0XHRwYXJhbXNba2V5XS5wdXNoKHZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgcGFyYW1zW2tleV0gPSB2YWx1ZVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBhcmFtc1xyXG5cdH1cclxuXHRtLnJvdXRlLmJ1aWxkUXVlcnlTdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nXHJcblx0bS5yb3V0ZS5wYXJzZVF1ZXJ5U3RyaW5nID0gcGFyc2VRdWVyeVN0cmluZ1xyXG5cdFxyXG5cdGZ1bmN0aW9uIHJlc2V0KHJvb3QpIHtcclxuXHRcdHZhciBjYWNoZUtleSA9IGdldENlbGxDYWNoZUtleShyb290KTtcclxuXHRcdGNsZWFyKHJvb3QuY2hpbGROb2RlcywgY2VsbENhY2hlW2NhY2hlS2V5XSk7XHJcblx0XHRjZWxsQ2FjaGVbY2FjaGVLZXldID0gdW5kZWZpbmVkXHJcblx0fVxyXG5cclxuXHRtLmRlZmVycmVkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlKTtcclxuXHRcdHJldHVybiBkZWZlcnJlZFxyXG5cdH07XHJcblx0ZnVuY3Rpb24gcHJvcGlmeShwcm9taXNlLCBpbml0aWFsVmFsdWUpIHtcclxuXHRcdHZhciBwcm9wID0gbS5wcm9wKGluaXRpYWxWYWx1ZSk7XHJcblx0XHRwcm9taXNlLnRoZW4ocHJvcCk7XHJcblx0XHRwcm9wLnRoZW4gPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkocHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCksIGluaXRpYWxWYWx1ZSlcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gcHJvcFxyXG5cdH1cclxuXHQvL1Byb21pei5taXRocmlsLmpzIHwgWm9sbWVpc3RlciB8IE1JVFxyXG5cdC8vYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFByb21pei5qcywgd2hpY2ggZG9lcyBub3QgY29uZm9ybSB0byBQcm9taXNlcy9BKyBmb3IgdHdvIHJlYXNvbnM6XHJcblx0Ly8xKSBgdGhlbmAgY2FsbGJhY2tzIGFyZSBjYWxsZWQgc3luY2hyb25vdXNseSAoYmVjYXVzZSBzZXRUaW1lb3V0IGlzIHRvbyBzbG93LCBhbmQgdGhlIHNldEltbWVkaWF0ZSBwb2x5ZmlsbCBpcyB0b28gYmlnXHJcblx0Ly8yKSB0aHJvd2luZyBzdWJjbGFzc2VzIG9mIEVycm9yIGNhdXNlIHRoZSBlcnJvciB0byBiZSBidWJibGVkIHVwIGluc3RlYWQgb2YgdHJpZ2dlcmluZyByZWplY3Rpb24gKGJlY2F1c2UgdGhlIHNwZWMgZG9lcyBub3QgYWNjb3VudCBmb3IgdGhlIGltcG9ydGFudCB1c2UgY2FzZSBvZiBkZWZhdWx0IGJyb3dzZXIgZXJyb3IgaGFuZGxpbmcsIGkuZS4gbWVzc2FnZSB3LyBsaW5lIG51bWJlcilcclxuXHRmdW5jdGlvbiBEZWZlcnJlZChzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0dmFyIFJFU09MVklORyA9IDEsIFJFSkVDVElORyA9IDIsIFJFU09MVkVEID0gMywgUkVKRUNURUQgPSA0O1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLCBzdGF0ZSA9IDAsIHByb21pc2VWYWx1ZSA9IDAsIG5leHQgPSBbXTtcclxuXHJcblx0XHRzZWxmW1wicHJvbWlzZVwiXSA9IHt9O1xyXG5cclxuXHRcdHNlbGZbXCJyZXNvbHZlXCJdID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKCFzdGF0ZSkge1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HO1xyXG5cclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmW1wicmVqZWN0XCJdID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKCFzdGF0ZSkge1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmLnByb21pc2VbXCJ0aGVuXCJdID0gZnVuY3Rpb24oc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spIHtcclxuXHRcdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKTtcclxuXHRcdFx0aWYgKHN0YXRlID09PSBSRVNPTFZFRCkge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdChwcm9taXNlVmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bmV4dC5wdXNoKGRlZmVycmVkKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0XHR9O1xyXG5cclxuXHRcdGZ1bmN0aW9uIGZpbmlzaCh0eXBlKSB7XHJcblx0XHRcdHN0YXRlID0gdHlwZSB8fCBSRUpFQ1RFRDtcclxuXHRcdFx0bmV4dC5tYXAoZnVuY3Rpb24oZGVmZXJyZWQpIHtcclxuXHRcdFx0XHRzdGF0ZSA9PT0gUkVTT0xWRUQgJiYgZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpIHx8IGRlZmVycmVkLnJlamVjdChwcm9taXNlVmFsdWUpXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdGhlbm5hYmxlKHRoZW4sIHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrLCBub3RUaGVubmFibGVDYWxsYmFjaykge1xyXG5cdFx0XHRpZiAoKChwcm9taXNlVmFsdWUgIT0gbnVsbCAmJiB0eXBlLmNhbGwocHJvbWlzZVZhbHVlKSA9PT0gT0JKRUNUKSB8fCB0eXBlb2YgcHJvbWlzZVZhbHVlID09PSBGVU5DVElPTikgJiYgdHlwZW9mIHRoZW4gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vIGNvdW50IHByb3RlY3RzIGFnYWluc3QgYWJ1c2UgY2FsbHMgZnJvbSBzcGVjIGNoZWNrZXJcclxuXHRcdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0XHR0aGVuLmNhbGwocHJvbWlzZVZhbHVlLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0c3VjY2Vzc0NhbGxiYWNrKClcclxuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0ZmFpbHVyZUNhbGxiYWNrKClcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0ZmFpbHVyZUNhbGxiYWNrKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bm90VGhlbm5hYmxlQ2FsbGJhY2soKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmlyZSgpIHtcclxuXHRcdFx0Ly8gY2hlY2sgaWYgaXQncyBhIHRoZW5hYmxlXHJcblx0XHRcdHZhciB0aGVuO1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHRoZW4gPSBwcm9taXNlVmFsdWUgJiYgcHJvbWlzZVZhbHVlLnRoZW5cclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdHJldHVybiBmaXJlKClcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGVubmFibGUodGhlbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0aWYgKHN0YXRlID09PSBSRVNPTFZJTkcgJiYgdHlwZW9mIHN1Y2Nlc3NDYWxsYmFjayA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gc3VjY2Vzc0NhbGxiYWNrKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHN0YXRlID09PSBSRUpFQ1RJTkcgJiYgdHlwZW9mIGZhaWx1cmVDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGZhaWx1cmVDYWxsYmFjayhwcm9taXNlVmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFJFU09MVklOR1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRcdHJldHVybiBmaW5pc2goKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHByb21pc2VWYWx1ZSA9PT0gc2VsZikge1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gVHlwZUVycm9yKCk7XHJcblx0XHRcdFx0XHRmaW5pc2goKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChSRVNPTFZFRClcclxuXHRcdFx0XHRcdH0sIGZpbmlzaCwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goc3RhdGUgPT09IFJFU09MVklORyAmJiBSRVNPTFZFRClcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRtLmRlZmVycmVkLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRpZiAodHlwZS5jYWxsKGUpID09PSBcIltvYmplY3QgRXJyb3JdXCIgJiYgIWUuY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvIEVycm9yLykpIHRocm93IGVcclxuXHR9O1xyXG5cclxuXHRtLnN5bmMgPSBmdW5jdGlvbihhcmdzKSB7XHJcblx0XHR2YXIgbWV0aG9kID0gXCJyZXNvbHZlXCI7XHJcblx0XHRmdW5jdGlvbiBzeW5jaHJvbml6ZXIocG9zLCByZXNvbHZlZCkge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHRyZXN1bHRzW3Bvc10gPSB2YWx1ZTtcclxuXHRcdFx0XHRpZiAoIXJlc29sdmVkKSBtZXRob2QgPSBcInJlamVjdFwiO1xyXG5cdFx0XHRcdGlmICgtLW91dHN0YW5kaW5nID09PSAwKSB7XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5wcm9taXNlKHJlc3VsdHMpO1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWRbbWV0aG9kXShyZXN1bHRzKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBkZWZlcnJlZCA9IG0uZGVmZXJyZWQoKTtcclxuXHRcdHZhciBvdXRzdGFuZGluZyA9IGFyZ3MubGVuZ3RoO1xyXG5cdFx0dmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkob3V0c3RhbmRpbmcpO1xyXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRhcmdzW2ldLnRoZW4oc3luY2hyb25pemVyKGksIHRydWUpLCBzeW5jaHJvbml6ZXIoaSwgZmFsc2UpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGRlZmVycmVkLnJlc29sdmUoW10pO1xyXG5cclxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0fTtcclxuXHRmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge3JldHVybiB2YWx1ZX1cclxuXHJcblx0ZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XHJcblx0XHRpZiAob3B0aW9ucy5kYXRhVHlwZSAmJiBvcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgPT09IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgY2FsbGJhY2tLZXkgPSBcIm1pdGhyaWxfY2FsbGJhY2tfXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIFwiX1wiICsgKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlMTYpKS50b1N0cmluZygzNik7XHJcblx0XHRcdHZhciBzY3JpcHQgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuXHJcblx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSBmdW5jdGlvbihyZXNwKSB7XHJcblx0XHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcclxuXHRcdFx0XHRvcHRpb25zLm9ubG9hZCh7XHJcblx0XHRcdFx0XHR0eXBlOiBcImxvYWRcIixcclxuXHRcdFx0XHRcdHRhcmdldDoge1xyXG5cdFx0XHRcdFx0XHRyZXNwb25zZVRleHQ6IHJlc3BcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cclxuXHRcdFx0XHRvcHRpb25zLm9uZXJyb3Ioe1xyXG5cdFx0XHRcdFx0dHlwZTogXCJlcnJvclwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHN0YXR1czogNTAwLFxyXG5cdFx0XHRcdFx0XHRyZXNwb25zZVRleHQ6IEpTT04uc3RyaW5naWZ5KHtlcnJvcjogXCJFcnJvciBtYWtpbmcganNvbnAgcmVxdWVzdFwifSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQuc3JjID0gb3B0aW9ucy51cmxcclxuXHRcdFx0XHQrIChvcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA+IDAgPyBcIiZcIiA6IFwiP1wiKVxyXG5cdFx0XHRcdCsgKG9wdGlvbnMuY2FsbGJhY2tLZXkgPyBvcHRpb25zLmNhbGxiYWNrS2V5IDogXCJjYWxsYmFja1wiKVxyXG5cdFx0XHRcdCsgXCI9XCIgKyBjYWxsYmFja0tleVxyXG5cdFx0XHRcdCsgXCImXCIgKyBidWlsZFF1ZXJ5U3RyaW5nKG9wdGlvbnMuZGF0YSB8fCB7fSk7XHJcblx0XHRcdCRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR2YXIgeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcclxuXHRcdFx0eGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJsLCB0cnVlLCBvcHRpb25zLnVzZXIsIG9wdGlvbnMucGFzc3dvcmQpO1xyXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgb3B0aW9ucy5vbmxvYWQoe3R5cGU6IFwibG9hZFwiLCB0YXJnZXQ6IHhocn0pO1xyXG5cdFx0XHRcdFx0ZWxzZSBvcHRpb25zLm9uZXJyb3Ioe3R5cGU6IFwiZXJyb3JcIiwgdGFyZ2V0OiB4aHJ9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWFsaXplID09PSBKU09OLnN0cmluZ2lmeSAmJiBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5tZXRob2QgIT09IFwiR0VUXCIpIHtcclxuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIilcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAob3B0aW9ucy5kZXNlcmlhbGl6ZSA9PT0gSlNPTi5wYXJzZSkge1xyXG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC8qXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucy5jb25maWcgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0dmFyIG1heWJlWGhyID0gb3B0aW9ucy5jb25maWcoeGhyLCBvcHRpb25zKTtcclxuXHRcdFx0XHRpZiAobWF5YmVYaHIgIT0gbnVsbCkgeGhyID0gbWF5YmVYaHJcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGRhdGEgPSBvcHRpb25zLm1ldGhvZCA9PT0gXCJHRVRcIiB8fCAhb3B0aW9ucy5kYXRhID8gXCJcIiA6IG9wdGlvbnMuZGF0YVxyXG5cdFx0XHRpZiAoZGF0YSAmJiAodHlwZS5jYWxsKGRhdGEpICE9IFNUUklORyAmJiBkYXRhLmNvbnN0cnVjdG9yICE9IHdpbmRvdy5Gb3JtRGF0YSkpIHtcclxuXHRcdFx0XHR0aHJvdyBcIlJlcXVlc3QgZGF0YSBzaG91bGQgYmUgZWl0aGVyIGJlIGEgc3RyaW5nIG9yIEZvcm1EYXRhLiBDaGVjayB0aGUgYHNlcmlhbGl6ZWAgb3B0aW9uIGluIGBtLnJlcXVlc3RgXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0eGhyLnNlbmQoZGF0YSk7XHJcblx0XHRcdHJldHVybiB4aHJcclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gYmluZERhdGEoeGhyT3B0aW9ucywgZGF0YSwgc2VyaWFsaXplKSB7XHJcblx0XHRpZiAoeGhyT3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZSAhPSBcImpzb25wXCIpIHtcclxuXHRcdFx0dmFyIHByZWZpeCA9IHhock9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCI7XHJcblx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcoZGF0YSk7XHJcblx0XHRcdHhock9wdGlvbnMudXJsID0geGhyT3B0aW9ucy51cmwgKyAocXVlcnlzdHJpbmcgPyBwcmVmaXggKyBxdWVyeXN0cmluZyA6IFwiXCIpXHJcblx0XHR9XHJcblx0XHRlbHNlIHhock9wdGlvbnMuZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcclxuXHRcdHJldHVybiB4aHJPcHRpb25zXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZVVybCh1cmwsIGRhdGEpIHtcclxuXHRcdHZhciB0b2tlbnMgPSB1cmwubWF0Y2goLzpbYS16XVxcdysvZ2kpO1xyXG5cdFx0aWYgKHRva2VucyAmJiBkYXRhKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0dmFyIGtleSA9IHRva2Vuc1tpXS5zbGljZSgxKTtcclxuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSh0b2tlbnNbaV0sIGRhdGFba2V5XSk7XHJcblx0XHRcdFx0ZGVsZXRlIGRhdGFba2V5XVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdXJsXHJcblx0fVxyXG5cclxuXHRtLnJlcXVlc3QgPSBmdW5jdGlvbih4aHJPcHRpb25zKSB7XHJcblx0XHRpZiAoeGhyT3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB0cnVlKSBtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG5cdFx0dmFyIGlzSlNPTlAgPSB4aHJPcHRpb25zLmRhdGFUeXBlICYmIHhock9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiO1xyXG5cdFx0dmFyIHNlcmlhbGl6ZSA9IHhock9wdGlvbnMuc2VyaWFsaXplID0gaXNKU09OUCA/IGlkZW50aXR5IDogeGhyT3B0aW9ucy5zZXJpYWxpemUgfHwgSlNPTi5zdHJpbmdpZnk7XHJcblx0XHR2YXIgZGVzZXJpYWxpemUgPSB4aHJPcHRpb25zLmRlc2VyaWFsaXplID0gaXNKU09OUCA/IGlkZW50aXR5IDogeGhyT3B0aW9ucy5kZXNlcmlhbGl6ZSB8fCBKU09OLnBhcnNlO1xyXG5cdFx0dmFyIGV4dHJhY3QgPSBpc0pTT05QID8gZnVuY3Rpb24oanNvbnApIHtyZXR1cm4ganNvbnAucmVzcG9uc2VUZXh0fSA6IHhock9wdGlvbnMuZXh0cmFjdCB8fCBmdW5jdGlvbih4aHIpIHtcclxuXHRcdFx0cmV0dXJuIHhoci5yZXNwb25zZVRleHQubGVuZ3RoID09PSAwICYmIGRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlID8gbnVsbCA6IHhoci5yZXNwb25zZVRleHRcclxuXHRcdH07XHJcblx0XHR4aHJPcHRpb25zLm1ldGhvZCA9ICh4aHJPcHRpb25zLm1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKTtcclxuXHRcdHhock9wdGlvbnMudXJsID0gcGFyYW1ldGVyaXplVXJsKHhock9wdGlvbnMudXJsLCB4aHJPcHRpb25zLmRhdGEpO1xyXG5cdFx0eGhyT3B0aW9ucyA9IGJpbmREYXRhKHhock9wdGlvbnMsIHhock9wdGlvbnMuZGF0YSwgc2VyaWFsaXplKTtcclxuXHRcdHhock9wdGlvbnMub25sb2FkID0geGhyT3B0aW9ucy5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHRcdHZhciB1bndyYXAgPSAoZS50eXBlID09PSBcImxvYWRcIiA/IHhock9wdGlvbnMudW53cmFwU3VjY2VzcyA6IHhock9wdGlvbnMudW53cmFwRXJyb3IpIHx8IGlkZW50aXR5O1xyXG5cdFx0XHRcdHZhciByZXNwb25zZSA9IHVud3JhcChkZXNlcmlhbGl6ZShleHRyYWN0KGUudGFyZ2V0LCB4aHJPcHRpb25zKSksIGUudGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoZS50eXBlID09PSBcImxvYWRcIikge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUuY2FsbChyZXNwb25zZSkgPT09IEFSUkFZICYmIHhock9wdGlvbnMudHlwZSkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSByZXNwb25zZVtpXSA9IG5ldyB4aHJPcHRpb25zLnR5cGUocmVzcG9uc2VbaV0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmICh4aHJPcHRpb25zLnR5cGUpIHJlc3BvbnNlID0gbmV3IHhock9wdGlvbnMudHlwZShyZXNwb25zZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVmZXJyZWRbZS50eXBlID09PSBcImxvYWRcIiA/IFwicmVzb2x2ZVwiIDogXCJyZWplY3RcIl0ocmVzcG9uc2UpXHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGUpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHhock9wdGlvbnMuYmFja2dyb3VuZCAhPT0gdHJ1ZSkgbS5lbmRDb21wdXRhdGlvbigpXHJcblx0XHR9O1xyXG5cdFx0YWpheCh4aHJPcHRpb25zKTtcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UsIHhock9wdGlvbnMuaW5pdGlhbFZhbHVlKTtcclxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0fTtcclxuXHJcblx0Ly90ZXN0aW5nIEFQSVxyXG5cdG0uZGVwcyA9IGZ1bmN0aW9uKG1vY2spIHtcclxuXHRcdGluaXRpYWxpemUod2luZG93ID0gbW9jayB8fCB3aW5kb3cpO1xyXG5cdFx0cmV0dXJuIHdpbmRvdztcclxuXHR9O1xyXG5cdC8vZm9yIGludGVybmFsIHRlc3Rpbmcgb25seSwgZG8gbm90IHVzZSBgbS5kZXBzLmZhY3RvcnlgXHJcblx0bS5kZXBzLmZhY3RvcnkgPSBhcHA7XHJcblxyXG5cdHJldHVybiBtXHJcbn0pKHR5cGVvZiB3aW5kb3cgIT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KTtcclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IG07XHJcbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIG19KTtcclxuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xuXG52YXIgRmVlZEluZm8gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvZWRpdCcsXG4gICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzXG4gIH0pLnRoZW4oYXV0aG9yaXplSGVscGVyKTtcbn07XG5cbnZhciBGZWVkRWRpdCA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVwZGF0ZUZlZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9lZGl0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgndGl0bGUnKVswXS52YWx1ZSxcbiAgICAgICAgICBmaWx0ZXJzOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnZmlsdGVycycpWzBdLnZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICB9KVxuICAgICAgICAudGhlbihhdXRob3JpemVIZWxwZXIpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG0ucm91dGUoJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgZGVsZXRlRmVlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyksXG4gICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKGF1dGhvcml6ZUhlbHBlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgYWRkU291cmNlID0gZnVuY3Rpb24oKSB7XG4gICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL3NvdXJjZXMvbmV3JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG5hbWU6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCduYW1lJylbMF0udmFsdWUsXG4gICAgICAgICAgdmFsdWU6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd2YWx1ZScpWzBdLnZhbHVlLFxuICAgICAgICAgIHR5cGU6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd0eXBlJylbMF0udmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKGF1dGhvcml6ZUhlbHBlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL2VkaXQnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgZGVsZXRlU291cmNlID0gZnVuY3Rpb24oc291cmNlSWQpIHtcbiAgICAgIHZhciBkZWxldGVTb3VyY2VGbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL3NvdXJjZXMvJyArIHNvdXJjZUlkLFxuICAgICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oYXV0aG9yaXplSGVscGVyKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL2VkaXQnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlbGV0ZVNvdXJjZUZuO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHsgZmVlZEluZm86IEZlZWRJbmZvKCksIHVwZGF0ZUZlZWQ6IHVwZGF0ZUZlZWQsIGRlbGV0ZUZlZWQ6IGRlbGV0ZUZlZWQsIGFkZFNvdXJjZTogYWRkU291cmNlLCBkZWxldGVTb3VyY2U6IGRlbGV0ZVNvdXJjZSB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgZmVlZHM6IGN0cmwuZmVlZEluZm8oKS51c2VyLmZlZWRzLFxuICAgICAgY3VycmVudEZlZWQ6ICdzZWxlY3QtZmVlZCcsXG4gICAgfSk7XG4gICAgcmV0dXJuIG0oJ2RpdicsIFtcbiAgICAgIG0oJ2RpdicsIFtcbiAgICAgICAgbSgnaDInLCAnRWRpdCBGZWVkJyksXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICd0aXRsZScsIHBsYWNlaG9sZGVyOiAnZWRpdCB0aXRsZScsIHZhbHVlOiBjdHJsLmZlZWRJbmZvKCkuZGF0YS50aXRsZSB8fCAnJ30pLFxuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAnZmlsdGVycycsIHBsYWNlaG9sZGVyOiAnZWRpdCBmaWx0ZXJzJywgdmFsdWU6IGN0cmwuZmVlZEluZm8oKS5kYXRhLmZpbHRlcnMuam9pbignLCcpIHx8ICcnIH0pLFxuICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC51cGRhdGVGZWVkLCB0eXBlOiAnc3VibWl0JywgdmFsdWU6ICdVcGRhdGUgRmVlZCcgfSksXG4gICAgICAgIG0oJ2J1dHRvbicsIHsgb25jbGljazogY3RybC5kZWxldGVGZWVkIH0sICdEZWxldGUgRmVlZCcgKVxuICAgICAgXSksXG4gICAgICBtKCdkaXYnLCBbXG4gICAgICAgIG0oJ2gyJywgJ0FkZCBTb3VyY2UnKSxcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ25hbWUnLCBwbGFjZWhvbGRlcjogJ25hbWUnIH0pLFxuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAndmFsdWUnLCBwbGFjZWhvbGRlcjogJ3ZhbHVlJyB9KSxcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICdyYWRpbycsIG5hbWU6ICd0eXBlJywgdmFsdWU6ICdGYWNlYm9vaycgfSksXG4gICAgICAgIG0oJ2xhYmVsJywgJ0ZhY2Vib29rJyksXG4gICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLmFkZFNvdXJjZSwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnQWRkIFNvdXJjZScgfSlcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2JywgW1xuICAgICAgICBtKCdoMicsICdTb3VyY2VzJyksXG4gICAgICAgIGN0cmwuZmVlZEluZm8oKS5kYXRhLnNvdXJjZXMubWFwKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICAgIHJldHVybiBtKCdkaXYnLCBbXG4gICAgICAgICAgICBtKCdhJywgeyBocmVmOiAnIy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9zb3VyY2VzLycgKyBzb3VyY2UuX2lkIH0sIHNvdXJjZS5uYW1lKSxcbiAgICAgICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcjL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL3NvdXJjZXMvJyArIHNvdXJjZS5faWQgKyAnL2VkaXQnIH0sICdFZGl0IFNvdXJjZScpLFxuICAgICAgICAgICAgbSgnYScsIHsgb25jbGljazogY3RybC5kZWxldGVTb3VyY2Uoc291cmNlLl9pZCksIGhyZWY6ICcnfSwgJ0RlbGV0ZSBTb3VyY2UnKVxuICAgICAgICAgIF0pXG4gICAgICAgIH0pXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkRWRpdDtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGF1dGhvcml6ZUhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXV0aG9yaXplLWhlbHBlcicpO1xudmFyIGxheW91dEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5b3V0LWhlbHBlcicpO1xudmFyIExvZ2dlZEluTWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtaW4tbWVudS5qcycpO1xudmFyIEZlZWRTZWxlY3QgPSByZXF1aXJlKCcuLi9sYXlvdXQvZmVlZC1zZWxlY3QnKTtcblxudmFyIEZlZWRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcycsXG4gICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzXG4gIH0pLnRoZW4oYXV0aG9yaXplSGVscGVyKTtcbn07XG5cbnZhciBGZWVkTGlzdGluZyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oYXJncykge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogYXJncy5pZCxcbiAgICAgIHRpdGxlOiBhcmdzLnRpdGxlLFxuICAgICAgdXNlcklkOiBhcmdzLnVzZXJJZCxcbiAgICAgIGZlZWRJZDogYXJncy5mZWVkSWRcbiAgICB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgbSgnYScsIHsgaHJlZjogJyMvdXNlcnMvJyArIGN0cmwudXNlcklkICsgJy9mZWVkcy8nICsgY3RybC5mZWVkSWQgfSwgW1xuICAgICAgICBtKCdoNCcsIGN0cmwudGl0bGUpXG4gICAgICBdKSxcbiAgICAgIG0oJ2EnLCB7IGhyZWY6ICcjL3VzZXJzLycgKyBjdHJsLnVzZXJJZCArICcvZmVlZHMvJyArIGN0cmwuZmVlZElkICsgJy9lZGl0JyB9LCAnU2V0dGluZ3MnKVxuICAgIF0pXG4gIH1cbn07XG5cbnZhciBGZWVkTGlzdCA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHsgZmVlZHM6IEZlZWRzKCkgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZEluTWVudSxcbiAgICAgIHVzZXJJZDogbS5yb3V0ZS5wYXJhbSgnaWQnKSxcblxuICAgICAgZmVlZFNlbGVjdDogRmVlZFNlbGVjdCxcbiAgICAgIGZlZWRzOiBjdHJsLmZlZWRzKCkudXNlci5mZWVkcyxcbiAgICAgIGN1cnJlbnRGZWVkOiAnc2VsZWN0LWZlZWQnLFxuICAgIH0pO1xuICAgIHJldHVybiBtKCdzZWN0aW9uJywgW1xuICAgICAgbSgnaDInLCAnRmVlZHMnKSxcbiAgICAgIGN0cmwuZmVlZHMoKS5kYXRhLm1hcChmdW5jdGlvbihmZWVkKSB7XG4gICAgICAgIHJldHVybiBtLmNvbXBvbmVudChGZWVkTGlzdGluZywgeyBmZWVkSWQ6IGZlZWQuX2lkLCB0aXRsZTogZmVlZC50aXRsZSwgdXNlcklkOiBjdHJsLmZlZWRzKCkudXNlci5pZCB9KTtcbiAgICAgIH0pXG4gICAgXSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZExpc3Q7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBsYXlvdXRIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheW91dC1oZWxwZXInKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcbnZhciBMb2dnZWRJbk1lbnUgPSByZXF1aXJlKCcuLi9sYXlvdXQvbG9nZ2VkLWluLW1lbnUuanMnKTtcbnZhciBGZWVkU2VsZWN0ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2ZlZWQtc2VsZWN0Jyk7XG5cbnZhciBGZWVkcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMnLFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG52YXIgRmVlZE5ldyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNyZWF0ZUZlZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzL25ldycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0aXRsZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3RpdGxlJylbMF0udmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oYXV0aG9yaXplSGVscGVyKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHsgY3JlYXRlRmVlZDogY3JlYXRlRmVlZCwgZmVlZHM6IEZlZWRzKCkgfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIGxheW91dEhlbHBlcih7XG4gICAgICBtZW51OiBMb2dnZWRJbk1lbnUsXG4gICAgICB1c2VySWQ6IG0ucm91dGUucGFyYW0oJ2lkJyksXG5cbiAgICAgIGZlZWRTZWxlY3Q6IEZlZWRTZWxlY3QsXG4gICAgICBmZWVkczogY3RybC5mZWVkcygpLnVzZXIuZmVlZHMsXG4gICAgICBjdXJyZW50RmVlZDogJ3NlbGVjdC1mZWVkJyxcbiAgICB9KTtcbiAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgbSgnaDInLCAnTmV3IEZlZWQnKSxcbiAgICAgIG0oJ2RpdicsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3RpdGxlJywgcGxhY2Vob2xkZXI6ICdmZWVkIG5hbWUnIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2RpdicsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuY3JlYXRlRmVlZCwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnQ3JlYXRlIEZlZWQnIH0pXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZE5ldztcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGF1dGhvcml6ZUhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXV0aG9yaXplLWhlbHBlcicpO1xudmFyIGxheW91dEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5b3V0LWhlbHBlcicpO1xudmFyIExvZ2dlZEluTWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtaW4tbWVudScpO1xudmFyIEZlZWRTZWxlY3QgPSByZXF1aXJlKCcuLi9sYXlvdXQvZmVlZC1zZWxlY3QnKTtcbnZhciBSZWZyZXNoQnV0dG9uID0gcmVxdWlyZSgnLi4vbGF5b3V0L3JlZnJlc2gtYnV0dG9uJyk7XG5cbi8vIHZhciB0aW1lID0gbW9udGggKyAnLycgKyBkYXkgKyAnLycgKyB5ZWFyICsgJyAnICtob3VycyArICc6JyArIG1pbnV0ZXM7XG4vL1xuLy8gdmFyIGZyb21GaWVsZCA9ICc8aDU+PGEgaHJlZj1odHRwczovL2ZhY2Vib29rLmNvbS8nICsgZGF0YVtpXS5mcm9tLmlkICsgJyB0YXJnZXQ9X2JsYW5rPicgKyBkYXRhW2ldLmZyb20ubmFtZSArICc8L2E+IC0gJyArIHRpbWUgKyAnPC9oNT4nO1xuLy9cbi8vIHZhciBtZXNzYWdlRmllbGQgPSBmaW5kTGlua3MoZGF0YVtpXS5tZXNzYWdlIHx8IGRhdGFbaV0uc3RvcnksICdoNCcpO1xuLy8gdmFyIHBpY3R1cmVGaWVsZCA9ICcnO1xuLy8gdmFyIHZpZGVvID0gJyc7XG4vLyBpZiAoZGF0YVtpXS5zb3VyY2UpIHtcbi8vICAgdmlkZW8gPSAnPGRpdiBjbGFzcz1cInBpY3R1cmVcIj48dmlkZW8gc3JjPScgKyBkYXRhW2ldLnNvdXJjZSArICcgY29udHJvbHM+PC92aWRlbz4nXG4vLyB9IGVsc2UgaWYgKGRhdGFbaV0ucGljdHVyZSkge1xuLy8gICBwaWN0dXJlRmllbGQgPSAnPGRpdiBjbGFzcz1cInBpY3R1cmVcIj48aW1nIHNyYz0nICsgZGF0YVtpXS5mdWxsX3BpY3R1cmUgKyAnIGFsdD0nICsgZGF0YVtpXS5kZXNjcmlwdGlvbiArICc+Jztcbi8vIH1cbi8vIHZhciBkZXNjcmlwdGlvbkZpZWxkID0gJyc7XG4vLyBpZiAoZGF0YVtpXS5kZXNjcmlwdGlvbikge1xuLy8gICBkZXNjcmlwdGlvbkZpZWxkID0gZmluZExpbmtzKGRhdGFbaV0uZGVzY3JpcHRpb24sICdwJyk7XG4vLyB9XG4vLyB2YXIgY2FwdGlvbkZpZWxkID0gJyc7XG4vLyBpZiAoZGF0YVtpXS5jYXB0aW9uKSB7XG4vLyAgIGNhcHRpb25GaWVsZCA9ICc8c21hbGw+JyArIGRhdGFbaV0uY2FwdGlvbiArICc8L3NtYWxsPic7XG4vLyB9IGVsc2UgaWYgKChkYXRhW2ldLnBpY3R1cmUgfHwgZGF0YVtpXS5zb3VyY2UpICYmICFkYXRhW2ldLmNhcHRpb24pIHtcbi8vICAgY2FwdGlvbkZpZWxkID0gJzwvZGl2Pidcbi8vIH1cbi8vIHZhciBsaW5rRmllbGQgPSAnJztcbi8vIGlmIChkYXRhW2ldLmxpbmspIHtcbi8vICAgbGlua0ZpZWxkID0gJzxhIGNsYXNzPVwibWFpbi1saW5rXCIgaHJlZj0nICsgZGF0YVtpXS5saW5rICsgJyB0YXJnZXQ9X2JsYW5rPicgKyAoZGF0YVtpXS5uYW1lIHx8IGRhdGFbaV0ubGluaykgKyAnPC9hPic7XG4vLyB9XG4vL1xuLy8gdmFyIGRpc3BsYXlTdHJpbmcgPSAnPGFydGljbGUgY2xhc3M9XCJmZWVkLWl0ZW1cIj4nICsgZnJvbUZpZWxkICsgbWVzc2FnZUZpZWxkICsgdmlkZW8gKyBwaWN0dXJlRmllbGQgKyBsaW5rRmllbGQgKyBkZXNjcmlwdGlvbkZpZWxkICsgY2FwdGlvbkZpZWxkICsgJzwvYXJ0aWNsZT4nO1xuXG52YXIgU2VhcmNoQmFyID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIHNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyksIG0uY29tcG9uZW50KEZlZWRTaG93LCB7IHF1ZXJ5OiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncXVlcnknKVswXS52YWx1ZSB9KSk7XG4gICAgfVxuICAgIGlmIChhcmdzICYmIGFyZ3MucXVlcnkpIHtcbiAgICAgIHJldHVybiB7IHNlYXJjaDogc2VhcmNoLCBxdWVyeTogYXJncy5xdWVyeSB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IHNlYXJjaDogc2VhcmNoIH1cbiAgICB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBpZiAoY3RybC5xdWVyeSkge1xuICAgICAgcmV0dXJuIG0oJ2RpdiNzZWFyY2gtY29udGFpbmVyJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAncXVlcnknLCB2YWx1ZTogY3RybC5xdWVyeSB9KSxcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuc2VhcmNoLCB0eXBlOiAnc3VibWl0JywgbmFtZTogJ3NlYXJjaCcsIHZhbHVlOiAnR28nIH0pLFxuICAgICAgXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtKCdkaXYjc2VhcmNoLWNvbnRhaW5lcicsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3F1ZXJ5JyB9KSxcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuc2VhcmNoLCB0eXBlOiAnc3VibWl0JywgbmFtZTogJ3NlYXJjaCcsIHZhbHVlOiAnR28nIH0pLFxuICAgICAgXSk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgRmVlZEl0ZW1zID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyksXG4gICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG52YXIgU2VhcmNoUmVzdWx0cyA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnLycgKyBxdWVyeSxcbiAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gIH0pLnRoZW4oYXV0aG9yaXplSGVscGVyKTtcbn07XG5cbnZhciBGZWVkSXRlbSA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBjb25kaXRpb25hbEVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWxlbWVudHMgPSBbXTtcbiAgICAgIGlmIChhcmdzLnZpZGVvKSB7XG4gICAgICAgIGVsZW1lbnRzLnB1c2gobSgndmlkZW8nLCB7IGNvbnRyb2xzOiAnY29udHJvbHMnLCBzcmM6IGFyZ3MudmlkZW8gfSkpO1xuICAgICAgfSBlbHNlIGlmIChhcmdzLnBpY3R1cmUpIHtcbiAgICAgICAgZWxlbWVudHMucHVzaChtKCdpbWcnLCB7IHNyYzogYXJncy5waWN0dXJlLCBhbHQ6IGFyZ3MuZGVzY3JpcHRpb24gfSkpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3MubGluaykge1xuICAgICAgICBlbGVtZW50cy5wdXNoKG0oJ2EubWFpbi1saW5rJywgeyBocmVmOiBhcmdzLmxpbmssIHRhcmdldDogJ19ibGFuaycgfSwgYXJncy5uYW1lIHx8IGFyZ3MubGluaykpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3MuY2FwdGlvbikge1xuICAgICAgICBlbGVtZW50cy5wdXNoKG0oJ3NtYWxsJywgYXJncy5jYXB0aW9uKSk7XG4gICAgICB9XG4gICAgICBpZiAoYXJncy5kZXNjcmlwdGlvbikge1xuICAgICAgICBlbGVtZW50cy5wdXNoKG0oJ3AnLCBhcmdzLmRlc2NyaXB0aW9uKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiBhcmdzLnRpbWUsXG4gICAgICBmcm9tOiBhcmdzLmZyb20sXG4gICAgICBtZXNzYWdlOiBhcmdzLm1lc3NhZ2UsXG4gICAgICBlbGVtZW50czogY29uZGl0aW9uYWxFbGVtZW50cygpXG4gICAgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG5cbiAgICByZXR1cm4gbSgnYXJ0aWNsZS5mZWVkLWl0ZW0nLCBbXG4gICAgICBtKCdhW2hyZWY9aHR0cHM6Ly9mYWNlYm9vay5jb20vJyArIGN0cmwuZnJvbS5pZCAgKyAnXScsIHsgdGFyZ2V0OiAnX2JsYW5rJ30sIFtcbiAgICAgICAgbSgnaDUnLCBjdHJsLmZyb20ubmFtZSArICcgJyArIGN0cmwudGltZSlcbiAgICAgIF0pLFxuICAgICAgbSgnaDQnLCBjdHJsLm1lc3NhZ2UpLFxuICAgICAgbSgnZGl2Lm1lZGlhLXdyYXAnLCBbXG4gICAgICAgIGN0cmwuZWxlbWVudHNcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufTtcblxudmFyIEZlZWRTaG93ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgaWYgKGFyZ3MgJiYgYXJncy5xdWVyeSkge1xuICAgICAgcmV0dXJuIHsgZmVlZEl0ZW1zOiBTZWFyY2hSZXN1bHRzKGFyZ3MucXVlcnkpLCBxdWVyeTogYXJncy5xdWVyeSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBmZWVkSXRlbXM6IEZlZWRJdGVtcygpIH07XG4gICAgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZEluTWVudSxcbiAgICAgIHVzZXJJZDogbS5yb3V0ZS5wYXJhbSgnaWQnKSxcblxuICAgICAgZmVlZFNlbGVjdDogRmVlZFNlbGVjdCxcbiAgICAgIGZlZWRzOiBjdHJsLmZlZWRJdGVtcygpLnVzZXIuZmVlZHMsXG4gICAgICBjdXJyZW50RmVlZDogbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyksXG5cbiAgICAgIHJlZnJlc2hCdXR0b246IFJlZnJlc2hCdXR0b24sXG5cbiAgICAgIHNlYXJjaEJhcjogU2VhcmNoQmFyLFxuICAgICAgcXVlcnk6IGN0cmwucXVlcnkgfHwgZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgY3RybC5mZWVkSXRlbXMoKS5kYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBtLmNvbXBvbmVudChGZWVkSXRlbSwge1xuICAgICAgICAgIHRpbWU6IGl0ZW0uY3JlYXRlZF90aW1lLFxuICAgICAgICAgIGZyb206IGl0ZW0uZnJvbSxcbiAgICAgICAgICBtZXNzYWdlOiBpdGVtLm1lc3NhZ2UgfHwgaXRlbS5zdG9yeSxcbiAgICAgICAgICB2aWRlbzogaXRlbS5zb3VyY2UsXG4gICAgICAgICAgcGljdHVyZTogaXRlbS5mdWxsX3BpY3R1cmUsXG4gICAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxuICAgICAgICAgIGxpbms6IGl0ZW0ubGluayxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogaXRlbS5kZXNjcmlwdGlvbixcbiAgICAgICAgICBjYXB0aW9uOiBpdGVtLmNhcHRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICBdKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkU2hvdztcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG4vLyBjaGVjayBpZiByZXF1ZXN0IHJlc3BvbnNlIGlzIGF1dGhvcml6ZWRcbmZ1bmN0aW9uIGF1dGhvcml6ZShyZXNwb25zZSkge1xuICBpZiAoIXJlc3BvbnNlLmF1dGhvcml6ZUZhaWwpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5tZXNzYWdlKTtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UubWVzc2FnZSk7XG4gICAgbS5yb3V0ZSgnLycpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXV0aG9yaXplO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbnZhciBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyLXdyYXAnKTtcbnZhciBtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKTtcbnZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQtd3JhcCcpO1xuXG4vLyB0ZW1wb3JhcnkgbWVudSBpbml0aWFsaXplclxubWVudS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuY29udGVudC5zdHlsZS5tYXJnaW5Ub3AgPSBoZWFkZXIub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xuXG52YXIgTWVudUljb24gPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzaG93TWVudSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coJ3Nob3cgbWVudScpO1xuICAgICAgaWYgKG1lbnUuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGNvbnRlbnQuc3R5bGUubWFyZ2luVG9wID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDEwICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgY29udGVudC5zdHlsZS5tYXJnaW5Ub3AgPSBoZWFkZXIub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4geyBzaG93TWVudTogc2hvd01lbnUgfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdzcGFuJywgeyBvbmNsaWNrOiBjdHJsLnNob3dNZW51IH0sIG0udHJ1c3QoJyYjOTc3NjsnKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBsYXlvdXRIZWxwZXIoYXJncykge1xuICBtLm1vdW50KFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWljb24nKSxcbiAgICBtLmNvbXBvbmVudChNZW51SWNvbilcbiAgKTtcblxuICBtLm1vdW50KFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51JyksXG4gICAgbS5jb21wb25lbnQoYXJncy5tZW51LCB7IHVzZXJJZDogYXJncy51c2VySWQgfSlcbiAgKTtcblxuICBpZiAoYXJncy5mZWVkU2VsZWN0KSB7XG4gICAgbS5tb3VudChcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmZWVkLXNlbGVjdCcpLFxuICAgICAgbS5jb21wb25lbnQoYXJncy5mZWVkU2VsZWN0LCB7IGZlZWRzOiBhcmdzLmZlZWRzLCBjdXJyZW50RmVlZDogYXJncy5jdXJyZW50RmVlZCB9KVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmVlZC1zZWxlY3QnKSwgbnVsbCk7XG4gIH1cblxuICBpZiAoYXJncy5yZWZyZXNoQnV0dG9uKSB7XG4gICAgbS5tb3VudChcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWZyZXNoLWJ1dHRvbicpLFxuICAgICAgbS5jb21wb25lbnQoYXJncy5yZWZyZXNoQnV0dG9uKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVmcmVzaC1idXR0b24nKSwgbnVsbCk7XG4gIH1cblxuICBpZiAoYXJncy5zZWFyY2hCYXIpIHtcbiAgICBpZiAoYXJncy5xdWVyeSkge1xuICAgICAgbS5tb3VudChcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1iYXInKSxcbiAgICAgICAgbS5jb21wb25lbnQoYXJncy5zZWFyY2hCYXIsIHsgcXVlcnk6IGFyZ3MucXVlcnkgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0ubW91bnQoXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJyksXG4gICAgICAgIG0uY29tcG9uZW50KGFyZ3Muc2VhcmNoQmFyKVxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWJhcicpLCBudWxsKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxheW91dEhlbHBlcjtcbiIsIi8vIGVuY29kZSByZXF1ZXN0c1xuZnVuY3Rpb24gc2VyaWFsaXplKG9iaikge1xuICB2YXIgc3RyID0gW107XG4gIGZvcih2YXIgcCBpbiBvYmopXG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgc3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHApICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtwXSkpO1xuICAgIH1cbiAgcmV0dXJuIHN0ci5qb2luKCcmJyk7XG59XG5cbi8vIHNldCBjb250ZW50IHR5cGUgZm9yIHJlcXVlc3QgaGVhZGVyXG5mdW5jdGlvbiBhc0Zvcm1VcmxFbmNvZGVkKHhocikge1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG59XG5cbi8vIGNvbnZlcnQgbm90LWpzb24gZXJyb3JzIHRvIGpzb25cbmZ1bmN0aW9uIG5vbkpzb25FcnJvcnMoeGhyKSB7XG4gIHJldHVybiB4aHIuc3RhdHVzID4gMjAwID8gSlNPTi5zdHJpbmdpZnkoeGhyLnJlc3BvbnNlVGV4dCkgOiB4aHIucmVzcG9uc2VUZXh0XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcbiAgYXNGb3JtVXJsRW5jb2RlZDogYXNGb3JtVXJsRW5jb2RlZCxcbiAgbm9uSnNvbkVycm9yczogbm9uSnNvbkVycm9yc1xufTtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG52YXIgRmVlZFNlbGVjdCA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBjaGFuZ2VGZWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZSA9PT0gJ3NlbGVjdC1mZWVkJykge1xuICAgICAgICB0aGlzLnZhbHVlID0gbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyB0aGlzLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB7IGNoYW5nZUZlZWQ6IGNoYW5nZUZlZWQsIGN1cnJlbnRGZWVkOiBhcmdzLmN1cnJlbnRGZWVkLCBmZWVkczogYXJncy5mZWVkcyB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIG0oJ3NlbGVjdCcsIHsgb25jaGFuZ2U6IGN0cmwuY2hhbmdlRmVlZCwgdmFsdWU6IGN0cmwuY3VycmVudEZlZWQgfHwgJ3NlbGVjdC1mZWVkJyB9LCBbXG4gICAgICBtKCdvcHRpb24nLCB7IHZhbHVlOiAnc2VsZWN0LWZlZWQnIH0sICdTZWxlY3QgRmVlZCcpLFxuICAgICAgY3RybC5mZWVkcy5tYXAoZnVuY3Rpb24oZmVlZCkge1xuICAgICAgICByZXR1cm4gbSgnb3B0aW9uJywgeyB2YWx1ZTogZmVlZC5faWQgfSwgZmVlZC50aXRsZSk7XG4gICAgICB9KVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkU2VsZWN0O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbnZhciBMb2dnZWRJbk1lbnUgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICByZXR1cm4geyB1c2VySWQ6IGFyZ3MudXNlcklkfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIG0oJ2RpdicsIFtcbiAgICAgIG0oJ2xpJywgW1xuICAgICAgICBtKCdhJywgeyBocmVmOiAnIy91c2Vycy8nICsgY3RybC51c2VySWQgfSwgJ1Byb2ZpbGUnKSxcbiAgICAgIF0pLFxuICAgICAgbSgnbGknLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcjL3VzZXJzLycgKyBjdHJsLnVzZXJJZCArICcvZmVlZHMnIH0sICdGZWVkcycpLFxuICAgICAgXSksXG4gICAgICBtKCdsaScsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJyMvdXNlcnMvJyArIGN0cmwudXNlcklkICsgJy9mZWVkcy9uZXcnIH0sICdOZXcgRmVlZCcpLFxuICAgICAgXSksXG4gICAgICBtKCdsaScsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJyMvdXNlcnMvJyArIGN0cmwudXNlcklkICsgJy9lZGl0JyB9LCAnRWRpdCBBY2NvdW50JyksXG4gICAgICBdKSxcbiAgICAgIG0oJ2xpJywgW1xuICAgICAgICBtKCdhJywgeyBocmVmOiAnIy9sb2dvdXQnIH0sICdMb2dvdXQnKVxuICAgICAgXSlcbiAgICBdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nZ2VkSW5NZW51O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbnZhciBMb2dnZWRPdXRNZW51ID0ge1xuICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgbSgnbGknLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcjL2xvZ2luJyB9LCAnTG9naW4nKSxcbiAgICAgIF0pLFxuICAgICAgbSgnbGknLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcjL3VzZXJzL25ldycgfSwgJ0NyZWF0ZSBBY2NvdW50JylcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2dlZE91dE1lbnU7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIFJlZnJlc2hCdXR0b24gPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWZyZXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSk7XG4gICAgfVxuICAgIHJldHVybiB7IHJlZnJlc2g6IHJlZnJlc2ggfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdzcGFuJywgeyBvbmNsaWNrOiBjdHJsLnJlZnJlc2ggfSwgbS50cnVzdCgnJiMxMDIyNzsnKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWZyZXNoQnV0dG9uO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkT3V0TWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtb3V0LW1lbnUuanMnKTtcblxudmFyIExvZ2luID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZW1haWw6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdlbWFpbCcpWzBdLnZhbHVlLFxuICAgICAgICAgIHBhc3N3b3JkOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncGFzc3dvcmQnKVswXS52YWx1ZVxuICAgICAgICB9LFxuICAgICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm1lc3NhZ2UpO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLmZhaWwpIHtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIHJlc3BvbnNlLnVzZXIuaWQgKyAnL2ZlZWRzLycgKyAoXG4gICAgICAgICAgICByZXNwb25zZS51c2VyLmRlZmF1bHRGZWVkIHx8XG4gICAgICAgICAgICByZXNwb25zZS51c2VyLmZlZWRzWzBdIHx8XG4gICAgICAgICAgICAnbmV3J1xuICAgICAgICAgICkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdlbWFpbCcpWzBdLnZhbHVlID0gJyc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3Bhc3N3b3JkJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB7IGxvZ2luOiBsb2dpbiB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZE91dE1lbnVcbiAgICB9KTtcbiAgICByZXR1cm4gbSgnc2VjdGlvbicsIFtcbiAgICAgIG0oJ2gyJywgJ0xvZ2luJyksXG4gICAgICBtKCdkaXYnLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyBuYW1lOiAnZW1haWwnLCB0eXBlOiAnZW1haWwnLCBwbGFjZWhvbGRlcjogJ2VtYWlsJyB9KVxuICAgICAgXSksXG4gICAgICBtKCdkaXYnLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyBuYW1lOiAncGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnLCBwbGFjZWhvbGRlcjogJ3Bhc3N3b3JkJyB9KSxcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2JywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC5sb2dpbiwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnTG9naW4nIH0pLFxuICAgICAgICBtKCdhJywgeyBocmVmOiAnL3JlcXVlc3QtcGFzc3dvcmQnIH0sICdGb3Jnb3QgeW91ciBwYXNzd29yZD8nKVxuICAgICAgXSlcbiAgICBdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9naW47XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcblxudmFyIExvZ291dCA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG0ucmVxdWVzdCh7IG1ldGhvZDogJ0dFVCcsIHVybDogJy9sb2dvdXQnLCBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIG0ucm91dGUoJy8nKTtcbiAgICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nb3V0O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xuXG52YXIgU291cmNlSW5mbyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9zb3VyY2VzLycgKyBtLnJvdXRlLnBhcmFtKCdzb3VyY2VJZCcpICsgJy9lZGl0JyxcbiAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnNcbiAgfSkudGhlbihhdXRob3JpemVIZWxwZXIpO1xufTtcblxudmFyIFNvdXJjZUVkaXQgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1cGRhdGVTb3VyY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9zb3VyY2VzLycgKyBtLnJvdXRlLnBhcmFtKCdzb3VyY2VJZCcpICsgJy9lZGl0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG5hbWU6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCduYW1lJylbMF0udmFsdWUsXG4gICAgICAgICAgdmFsdWU6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd2YWx1ZScpWzBdLnZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICB9KVxuICAgICAgICAudGhlbihhdXRob3JpemVIZWxwZXIpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG0ucm91dGUoJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9zb3VyY2VzLycgKyBtLnJvdXRlLnBhcmFtKCdzb3VyY2VJZCcpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7IHNvdXJjZUluZm86IFNvdXJjZUluZm8oKSwgdXBkYXRlU291cmNlOiB1cGRhdGVTb3VyY2UgfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1iYXInKSwgbnVsbCk7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZEluTWVudSxcbiAgICAgIHVzZXJJZDogbS5yb3V0ZS5wYXJhbSgnaWQnKSxcblxuICAgICAgZmVlZFNlbGVjdDogRmVlZFNlbGVjdCxcbiAgICAgIGZlZWRzOiBjdHJsLnNvdXJjZUluZm8oKS51c2VyLmZlZWRzLFxuICAgICAgY3VycmVudEZlZWQ6ICdzZWxlY3QtZmVlZCcsXG4gICAgfSk7XG4gICAgcmV0dXJuIG0oJ2RpdicsIFtcbiAgICAgIG0oJ2RpdicsIFtcbiAgICAgICAgbSgnaDInLCAnRWRpdCBTb3VyY2UnKSxcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ25hbWUnLCBwbGFjZWhvbGRlcjogJ2VkaXQgbmFtZScsIHZhbHVlOiBjdHJsLnNvdXJjZUluZm8oKS5kYXRhLm5hbWUgfHwgJyd9KSxcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3ZhbHVlJywgcGxhY2Vob2xkZXI6ICdlZGl0IHZhbHVlJywgdmFsdWU6IGN0cmwuc291cmNlSW5mbygpLmRhdGEudmFsdWUgfHwgJycgfSksXG4gICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLnVwZGF0ZVNvdXJjZSwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnVXBkYXRlIFNvdXJjZScgfSlcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvdXJjZUVkaXQ7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcbnZhciBsYXlvdXRIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheW91dC1oZWxwZXInKTtcbnZhciBMb2dnZWRJbk1lbnUgPSByZXF1aXJlKCcuLi9sYXlvdXQvbG9nZ2VkLWluLW1lbnUnKTtcbnZhciBGZWVkU2VsZWN0ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2ZlZWQtc2VsZWN0Jyk7XG52YXIgUmVmcmVzaEJ1dHRvbiA9IHJlcXVpcmUoJy4uL2xheW91dC9yZWZyZXNoLWJ1dHRvbicpO1xuXG4vL1xuLy8gdmFyIFNvdXJjZUl0ZW1zID0gZnVuY3Rpb24oKSB7XG4vLyAgIHJldHVybiBtLnJlcXVlc3Qoe1xuLy8gICAgIG1ldGhvZDogJ0dFVCcsXG4vLyAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyksXG4vLyAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuLy8gICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG4vLyB9O1xuLy9cbi8vIHZhciBTZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24ocXVlcnkpIHtcbi8vICAgcmV0dXJuIG0ucmVxdWVzdCh7XG4vLyAgICAgbWV0aG9kOiAnR0VUJyxcbi8vICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvJyArIHF1ZXJ5LFxuLy8gICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbi8vICAgfSkudGhlbihhdXRob3JpemVIZWxwZXIpO1xuLy8gfTtcbi8vXG4vLyB2YXIgU2VhcmNoQmFyID0ge1xuLy8gICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4vLyAgICAgdmFyIHNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyksIG0uY29tcG9uZW50KEZlZWRTaG93LCB7IHF1ZXJ5OiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncXVlcnknKVswXS52YWx1ZSB9KSk7XG4vLyAgICAgfVxuLy8gICAgIGlmIChhcmdzICYmIGFyZ3MucXVlcnkpIHtcbi8vICAgICAgIHJldHVybiB7IHNlYXJjaDogc2VhcmNoLCBxdWVyeTogYXJncy5xdWVyeSB9XG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIHJldHVybiB7IHNlYXJjaDogc2VhcmNoIH1cbi8vICAgICB9XG4vLyAgIH0sXG4vLyAgIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbi8vICAgICBpZiAoY3RybC5xdWVyeSkge1xuLy8gICAgICAgcmV0dXJuIG0oJ2RpdiNzZWFyY2gtY29udGFpbmVyJywgW1xuLy8gICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAncXVlcnknLCB2YWx1ZTogY3RybC5xdWVyeSB9KSxcbi8vICAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuc2VhcmNoLCB0eXBlOiAnc3VibWl0JywgbmFtZTogJ3NlYXJjaCcsIHZhbHVlOiAnR28nIH0pLFxuLy8gICAgICAgXSk7XG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIHJldHVybiBtKCdkaXYjc2VhcmNoLWNvbnRhaW5lcicsIFtcbi8vICAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3F1ZXJ5JyB9KSxcbi8vICAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuc2VhcmNoLCB0eXBlOiAnc3VibWl0JywgbmFtZTogJ3NlYXJjaCcsIHZhbHVlOiAnR28nIH0pLFxuLy8gICAgICAgXSk7XG4vLyAgICAgfVxuLy9cbi8vICAgfVxuLy8gfTtcblxuLy8gdmFyIEZlZWRJdGVtID0ge1xuLy8gICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgIHRpbWU6IGFyZ3MudGltZSxcbi8vICAgICAgIGZyb206IGFyZ3MuZnJvbSxcbi8vICAgICAgIG1lc3NhZ2U6IGFyZ3MubWVzc2FnZSxcbi8vICAgICAgIHBpY3R1cmU6IGFyZ3MucGljdHVyZSxcbi8vICAgICAgIGRlc2NyaXB0aW9uOiBhcmdzLmRlc2NyaXB0aW9uXG4vLyAgICAgfVxuLy8gICB9LFxuLy8gICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4vLyAgICAgcmV0dXJuIG0oJ2FydGljbGUnLCBbXG4vLyAgICAgICBtKCdwJywgY3RybC50aW1lKSxcbi8vICAgICAgIG0oJ2FbaHJlZj1odHRwczovL2ZhY2Vib29rLmNvbS8nICsgY3RybC5mcm9tLmlkICArICddJywgeyB0YXJnZXQ6ICdfYmxhbmsnfSwgY3RybC5mcm9tLm5hbWUpLFxuLy8gICAgICAgbSgnaDUnLCBjdHJsLm1lc3NhZ2UpLFxuLy8gICAgICAgbSgnaW1nJywgeyBzcmM6IGN0cmwucGljdHVyZSwgYWx0OiBjdHJsLmRlc2NyaXB0aW9uIH0pLFxuLy8gICAgICAgbSgncCcsIGN0cmwuZGVzY3JpcHRpb24pXG4vLyAgICAgXSlcbi8vICAgfVxuLy8gfTtcblxudmFyIFNvdXJjZVNob3cgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAvLyBpZiAoYXJncyAmJiBhcmdzLnF1ZXJ5KSB7XG4gICAgLy8gICByZXR1cm4geyBmZWVkSXRlbXM6IFNlYXJjaFJlc3VsdHMoYXJncy5xdWVyeSksIHF1ZXJ5OiBhcmdzLnF1ZXJ5IH07XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIHJldHVybiB7IGZlZWRJdGVtczogRmVlZEl0ZW1zKCkgfTtcbiAgICAvLyB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICAvLyBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgLy8gZmVlZHM6IGN0cmwuZmVlZEl0ZW1zKCkudXNlci5mZWVkcyxcbiAgICAgIC8vIGN1cnJlbnRGZWVkOiBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSxcbiAgICAgIC8vXG4gICAgICAvLyByZWZyZXNoQnV0dG9uOiBSZWZyZXNoQnV0dG9uLFxuICAgIH0pO1xuICAgIC8vIGlmIChjdHJsLnF1ZXJ5KSB7XG4gICAgLy8gICBtLm1vdW50KFxuICAgIC8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWJhcicpLFxuICAgIC8vICAgICBtLmNvbXBvbmVudChTZWFyY2hCYXIsIHsgcXVlcnk6IGN0cmwucXVlcnkgfSlcbiAgICAvLyAgICk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIG0ubW91bnQoXG4gICAgLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJyksXG4gICAgLy8gICAgIG0uY29tcG9uZW50KFNlYXJjaEJhcilcbiAgICAvLyAgICk7XG4gICAgLy8gfVxuICAgIHJldHVybiBtKCdkaXYnLCBbXG4gICAgICAvLyBjdHJsLmZlZWRJdGVtcygpLmRhdGEubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIC8vICAgcmV0dXJuIG0uY29tcG9uZW50KEZlZWRJdGVtLCB7XG4gICAgICAvLyAgICAgdGltZTogaXRlbS5jcmVhdGVkX3RpbWUsXG4gICAgICAvLyAgICAgZnJvbTogaXRlbS5mcm9tLFxuICAgICAgLy8gICAgIG1lc3NhZ2U6IGl0ZW0ubWVzc2FnZSB8fCBpdGVtLnN0b3J5LFxuICAgICAgLy8gICAgIHBpY3R1cmU6IGl0ZW0ucGljdHVyZSxcbiAgICAgIC8vICAgICBkZXNjcmlwdGlvbjogaXRlbS5kZXNjcmlwdGlvblxuICAgICAgLy8gICB9KTtcbiAgICAgIC8vIH0pXG4gICAgICBtKCdoMicsICdTb3VyY2UgU2hvdyBQYWdlJylcbiAgICBdKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VyY2VTaG93O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xuXG52YXIgVXNlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSxcbiAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnNcbiAgfSkudGhlbihhdXRob3JpemVIZWxwZXIpO1xufTtcblxudmFyIFVzZXJFZGl0ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXBkYXRlVXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9lZGl0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVtYWlsOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnZW1haWwnKVswXS52YWx1ZSxcbiAgICAgICAgICBwYXNzd29yZDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3Bhc3N3b3JkJylbMF0udmFsdWUsXG4gICAgICAgICAgY29uZmlybWF0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29uZmlybWF0aW9uJylbMF0udmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBpZiAoIWRhdGEuZmFpbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIG0ucm91dGUoJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2VtYWlsJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdwYXNzd29yZCcpWzBdLnZhbHVlID0gJyc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29uZmlybWF0aW9uJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4geyB1c2VyOiBVc2VyKCksIHVwZGF0ZVVzZXI6IHVwZGF0ZVVzZXIgfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIGxheW91dEhlbHBlcih7XG4gICAgICBtZW51OiBMb2dnZWRJbk1lbnUsXG4gICAgICB1c2VySWQ6IG0ucm91dGUucGFyYW0oJ2lkJyksXG5cbiAgICAgIGZlZWRTZWxlY3Q6IEZlZWRTZWxlY3QsXG4gICAgICBmZWVkczogY3RybC51c2VyKCkuZGF0YS5mZWVkcyxcbiAgICAgIGN1cnJlbnRGZWVkOiAnc2VsZWN0LWZlZWQnXG4gICAgfSk7XG4gICAgcmV0dXJuIG0oJ2Rpdi5jb250ZW50LWJsb2NrJywgW1xuICAgICAgbSgnaDInLCAnTG9naW4nKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICdlbWFpbCcsIG5hbWU6ICdlbWFpbCcsIHZhbHVlOiBjdHJsLnVzZXIoKS5kYXRhLmVtYWlsIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICdwYXNzd29yZCcsIG5hbWU6ICdwYXNzd29yZCcsIHBsYWNlaG9sZGVyOiAncGFzc3dvcmQnIH0pLFxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAncGFzc3dvcmQnLCBuYW1lOiAnY29uZmlybWF0aW9uJywgcGxhY2Vob2xkZXI6ICdjb25maXJtYXRpb24nIH0pLFxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLnVwZGF0ZVVzZXIsIHR5cGU6ICdzdWJtaXQnLCB2YWx1ZTogJ1VwZGF0ZSBVc2VyJyB9KVxuICAgICAgXSlcbiAgICBdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckVkaXQ7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBsYXlvdXRIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheW91dC1oZWxwZXInKTtcbnZhciBMb2dnZWRPdXRNZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1vdXQtbWVudS5qcycpO1xuXG52YXIgVXNlck5ldyA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNyZWF0ZVVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvbmV3JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVtYWlsOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnZW1haWwnKVswXS52YWx1ZSxcbiAgICAgICAgICBwYXNzd29yZDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3Bhc3N3b3JkJylbMF0udmFsdWUsXG4gICAgICAgICAgY29uZmlybWF0aW9uOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29uZmlybWF0aW9uJylbMF0udmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBpZiAoIWRhdGEuZmFpbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIG0ucm91dGUoJy9sb2dpbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzL25ldycpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2VtYWlsJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdwYXNzd29yZCcpWzBdLnZhbHVlID0gJyc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29uZmlybWF0aW9uJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4geyBjcmVhdGVVc2VyOiBjcmVhdGVVc2VyIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkT3V0TWVudVxuICAgIH0pO1xuICAgIHJldHVybiBtKCdkaXYuY29udGVudC1ibG9jaycsIFtcbiAgICAgIG0oJ2gyJywgJ0xvZ2luJyksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAnZW1haWwnLCBuYW1lOiAnZW1haWwnLCBwbGFjZWhvbGRlcjogJ2VtYWlsJyB9KVxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAncGFzc3dvcmQnLCBuYW1lOiAncGFzc3dvcmQnLCBwbGFjZWhvbGRlcjogJ3Bhc3N3b3JkJyB9KSxcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LmlucHV0LWJsb2NrJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3Bhc3N3b3JkJywgbmFtZTogJ2NvbmZpcm1hdGlvbicsIHBsYWNlaG9sZGVyOiAnY29uZmlybWF0aW9uJyB9KSxcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LmlucHV0LWJsb2NrJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC5jcmVhdGVVc2VyLCB0eXBlOiAnc3VibWl0JywgdmFsdWU6ICdDcmVhdGUgVXNlcicgfSlcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJOZXc7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcbnZhciBsYXlvdXRIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheW91dC1oZWxwZXInKTtcbnZhciBMb2dnZWRJbk1lbnUgPSByZXF1aXJlKCcuLi9sYXlvdXQvbG9nZ2VkLWluLW1lbnUuanMnKTtcbnZhciBGZWVkU2VsZWN0ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2ZlZWQtc2VsZWN0Jyk7XG5cbnZhciBVc2VyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG52YXIgVXNlclNob3cgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHVzZXI6IFVzZXIoKSB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZEluTWVudSxcbiAgICAgIHVzZXJJZDogbS5yb3V0ZS5wYXJhbSgnaWQnKSxcblxuICAgICAgZmVlZFNlbGVjdDogRmVlZFNlbGVjdCxcbiAgICAgIGZlZWRzOiBjdHJsLnVzZXIoKS5kYXRhLmZlZWRzLFxuICAgICAgY3VycmVudEZlZWQ6ICdzZWxlY3QtZmVlZCdcbiAgICB9KTtcbiAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgbSgnaDInLCAnVXNlciBTaG93JyksXG4gICAgICBtKCdwJywgY3RybC51c2VyKCkuZGF0YS5lbWFpbClcbiAgICBdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlclNob3c7XG4iXX0=
