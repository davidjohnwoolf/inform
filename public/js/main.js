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

// adjust content to move down when search bar and menu are displayed
var menuControl = document.getElementById('menu-control');
var searchControl = document.getElementById('search-control');
var outerWrap = document.getElementById('outer-wrap');

var headerChange = function() {
  var menu = document.querySelector('#menu > div');
  if (menuControl.checked === true && searchControl.checked === true) {
      outerWrap.style.paddingTop = Number(menu.getAttribute('data-height')) + 95 + 'px';
  } else if (menuControl.checked === true) {
      outerWrap.style.paddingTop = Number(menu.getAttribute('data-height')) + 60 + 'px';
  } else if (searchControl.checked === true) {
      outerWrap.style.paddingTop = '95px';
  } else {
      outerWrap.style.paddingTop = '60px';
  }
}

menuControl.addEventListener('change', headerChange);
searchControl.addEventListener('change', headerChange);



// when hashed route changes, reset the menu and messages
(function(history) {

  var pushState = history.pushState;
  var handleRouteChange = function() {

    // reset messages
    m.mount(document.getElementById('message'), null);
    document.getElementById('message').innerHTML = '';

    // reset menu
    // document.getElementById('#menu-control').setAttribute('checked', '');
    // document.getElementById('#search-control').setAttribute('checked', '');
    // console.log('route-change')
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
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var FeedInfo = require('./models/feed-info');
var Messages = require('../helpers/messages');

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
      .then(function(response) {
        if (!response.fail) {

          var noticeMessage = Messages.NoticeMessage(response);

          m.mount(document.getElementById('message'), noticeMessage);

          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
        } else {

          var alertMessage = Messages.AlertMessage(response);

          m.mount(document.getElementById('message'), alertMessage);
        }
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
      if (!document.getElementsByName('name')[0].value || !document.getElementsByName('value')[0].value) {
        var alertMessage = Messages.AlertMessage({ message: 'Source Fields Cannot be Blank'});

        return m.mount(document.getElementById('message'), alertMessage);
      }

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
          var noticeMessage = Messages.NoticeMessage(response);

          m.mount(document.getElementById('message'), noticeMessage);

          m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit');
        } else {
          var alertMessage = Messages.AlertMessage(response);

          m.mount(document.getElementById('message'), alertMessage);
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

              var noticeMessage = Messages.NoticeMessage(response);
              m.mount(document.getElementById('message'), noticeMessage);
            } else {
              var alertMessage = Messages.AlertMessage(response);
              m.mount(document.getElementById('message'), alertMessage);
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
          m('input', { type: 'text', name: 'filters', placeholder: 'add filters sepatated by commas', value: ctrl.feedInfo().data.filters.join(',') || '' })
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
          m('input', { type: 'text', name: 'value', placeholder: 'Facebook page ID' })
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
            m('button.delete-button', { onclick: ctrl.deleteSource(source._id)}, 'Delete'),
            m('a', { href: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + source._id + '/edit', config: m.route }, 'Edit')
          ])
        })
      ])
    ])
  }
}

module.exports = FeedEdit;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/messages":"/Users/david/Projects/inform/inform/public/js/src/helpers/messages.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/feed-info":"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feed-info.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-item.js":[function(require,module,exports){
var m = require('mithril');
var findLinks = require('../helpers/find-links');

var FeedItem = {
  controller: function(args) {
    var formatTime = function() {
      var months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ];

      return months[parseInt(args.time.slice(5, 7)) - 1] + ' ' + args.time.slice(8, 10) + ', ' + args.time.slice(0, 4);
    };
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
      time: formatTime(),
      from: args.from,
      message: m.trust(findLinks(args.message)),
      elements: conditionalElements()
    }
  },
  view: function(ctrl) {
    return m('article.feed-item', [
      m('a[href=https://facebook.com/' + ctrl.from.id  + ']', { target: '_blank'}, [
        m('h5', ctrl.from.name),
      ]),
      m('span.feed-date', ctrl.time),
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
    
    var feedList = m('section.content-part', [
      m('h2', 'Feeds'),
      ctrl.feeds().data.map(function(feed) {
        return m.component(FeedListing, { feedId: feed._id, title: feed.title, userId: ctrl.feeds().user.id });
      })
    ]);

    var noFeedListMessage = m('p.feed-error', 'You have no feeds, go to Menu > New Feed to create one');

    return ctrl.feeds().data.length > 0 ? feedList : noFeedListMessage
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
        m('input.info-input', { type: 'text', name: 'title', placeholder: 'create a name for your feed' })
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.createFeed, type: 'submit', value: 'Create Feed' })
      ]),
      m('p', [
        m('a', { href: '/users/' + m.route.param('id') + '/feeds', config: m.route }, 'Cancel')
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
    if (localStorage.getItem('user') && response.user !== localStorage.getItem('user')) {
      localStorage.clear();
    }
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
    m.mount(document.getElementById('search-bar'), null);
    m.mount(document.getElementById('search-icon'), null);
  }

  if (args.sourceName) {
    m.mount(
      document.getElementById('source-name'),
      m.component(args.sourceName, { sourceNameText: args.sourceNameText})
    );
  } else {
    m.mount(document.getElementById('source-name'), null);
  }
}

module.exports = layoutHelper;

},{"../layout/menu-icon":"/Users/david/Projects/inform/inform/public/js/src/layout/menu-icon.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/helpers/messages.js":[function(require,module,exports){
var m = require('mithril');

var AlertMessage = function(response) {
  var component = {
    view: function() {
      return m('div.alert', response.message);
    }
  }
  return component;
}

var NoticeMessage = function(response) {
  var component = {
    view: function() {
      return m('div.notice', response.message);
    }
  }
  return component;
}

module.exports = {
  AlertMessage: AlertMessage,
  NoticeMessage: NoticeMessage
};

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
    return m('div[data-height="152"]', [
      m('li', [
        m('a', { href: '/users/' + ctrl.userId, config: m.route }, 'Account'),
      ]),
      m('li', [
        m('a', { href: '/users/' + ctrl.userId + '/feeds', config: m.route }, 'Feeds'),
      ]),
      m('li', [
        m('a', { href: '/users/' + ctrl.userId + '/feeds/new', config: m.route }, 'New Feed'),
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
    return m('div[data-height="76"]', [
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
      //leftover from javascript menu

      m.redraw.strategy('none');
    };
    return { showMenu: showMenu };
  },
  view: function(ctrl) {
    return m('span.fa.fa-bars', { onclick: ctrl.showMenu })
  }
}

module.exports = MenuIcon;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/layout/refresh-button.js":[function(require,module,exports){
var m = require('mithril');

var RefreshButton = {
  controller: function() {
    var refresh = function() {
      if (!m.route.param('sourceId')) {
        m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId'));
      } else {
        m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId'));
      }
    }
    return { refresh: refresh };
  },
  view: function(ctrl) {
    return m('span.fa.fa-refresh', { onclick: ctrl.refresh });
  }
}

module.exports = RefreshButton;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/layout/search-icon.js":[function(require,module,exports){
var m = require('mithril');

var SearchIcon = {
  controller: function() {
    var showBar = function() {
      //old search method

      m.redraw.strategy('none');
    };

    return { showBar: showBar };
  },
  view: function(ctrl) {
    return m('span.fa.fa-search', { onclick: ctrl.showBar });
  }
}

module.exports = SearchIcon;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/layout/source-name.js":[function(require,module,exports){
var m = require('mithril');

SourceName = {
  controller: function(args) {
    return { sourceNameText: args.sourceNameText }
  },
  view: function(ctrl) {
    return m('span', ctrl.sourceNameText);
  }
};

module.exports = SourceName;

},{"mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sessions/login.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var LoggedOutMenu = require('../layout/logged-out-menu');
var Messages = require('../helpers/messages');

var Login = {
  controller: function() {
    if (localStorage.getItem('user')) {
      m.route('/users/' + localStorage.getItem('user'));
    }

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
          localStorage.setItem('user', response.user.id);
          m.route(
            '/users/'
            + response.user.id
            + '/feeds/'
            + (response.user.defaultFeed || (response.user.feeds[0] && response.user.feeds[0]._id) || 'new')
          );

        } else {
          var alertMessage = Messages.AlertMessage(response);
          m.mount(document.getElementById('message'), alertMessage);

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
    return m('section.content-part', [
      m('h2', 'Login'),
      m('div.input-block', [
        m('input', { name: 'email', type: 'email', placeholder: 'email' })
      ]),
      m('div.input-block', [
        m('input', { name: 'password', type: 'password', placeholder: 'password' }),
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.login, type: 'submit', value: 'Login' })
      ]),
      m('p', 'Don\'t have an account? ', [
        m('a', { href: '/users/new', config: m.route }, 'Sign Up for Free')
      ])
      // m('a', { href: '/request-password', config: m.route }, 'Forgot your password?')
    ])
  }
}

module.exports = Login;

},{"../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/messages":"/Users/david/Projects/inform/inform/public/js/src/helpers/messages.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/logged-out-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-out-menu.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sessions/logout.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');

var Logout = {
  controller: function() {
    return m.request({
      method: 'GET', url: '/logout', extract: reqHelpers.nonJsonErrors
    })
    .then(function(response) {
      localStorage.clear();
      m.route('/');
    });
  }
}

module.exports = Logout;

},{"../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sources/models/search-results.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var SearchResults = function(query) {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId') + '/' + query,
    extract: reqHelpers.nonJsonErrors,
  }).then(authorizeHelper);
};

module.exports = SearchResults;

},{"../../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sources/models/source-info.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var SourceInfo = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId') + '/edit',
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = SourceInfo;

},{"../../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sources/models/source-results.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../../helpers/request-helpers');
var authorizeHelper = require('../../helpers/authorize-helper');

var SourceResults = function() {
  return m.request({
    method: 'GET',
    url: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId'),
    extract: reqHelpers.nonJsonErrors
  }).then(authorizeHelper);
};

module.exports = SourceResults;

},{"../../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sources/source-edit.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var layoutHelper = require('../helpers/layout-helper');
var authorizeHelper = require('../helpers/authorize-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var SourceInfo = require('./models/source-info');
var Messages = require('../helpers/messages');

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
        .then(function(response) {
          if (!response.fail) {
            var noticeMessage = Messages.NoticeMessage(response);
            m.mount(document.getElementById('message'), noticeMessage);

            m.route('/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/sources/' + m.route.param('sourceId') + '/edit');
          } else {
            var alertMessage = Messages.AlertMessage(response);
            m.mount(document.getElementById('message'), alertMessage);
          }
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
    return m('div.content-part', [
      m('h2', 'Edit Source'),
      m('div.input-block', [
        m('input', { type: 'text', name: 'name', placeholder: 'edit name', value: ctrl.sourceInfo().data.name || ''})
      ]),
      m('div.input-block', [
        m('input', { type: 'text', name: 'value', placeholder: 'edit value', value: ctrl.sourceInfo().data.value || '' })
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.updateSource, type: 'submit', value: 'Update Source' })
      ]),
      m('p', [
        m('a', { href: '/users/' + m.route.param('id') + '/feeds/' + m.route.param('feedId') + '/edit', config: m.route }, 'Cancel')
      ])
    ])
  }
}

module.exports = SourceEdit;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/messages":"/Users/david/Projects/inform/inform/public/js/src/helpers/messages.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/source-info":"/Users/david/Projects/inform/inform/public/js/src/sources/models/source-info.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/sources/source-show.js":[function(require,module,exports){
var m = require('mithril');
var reqHelpers = require('../helpers/request-helpers');
var authorizeHelper = require('../helpers/authorize-helper');
var layoutHelper = require('../helpers/layout-helper');
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var RefreshButton = require('../layout/refresh-button');
var SourceResults = require('./models/source-results');
var SearchResults = require('./models/search-results');
var FeedItem = require('../feeds/feed-item');
var SearchIcon = require('../layout/search-icon');
var SourceName = require('../layout/source-name');

var SearchBar = {
  controller: function(args) {
    var search = function() {
      m.mount(document.getElementById('app'), m.component(SourceShow, { query: document.getElementsByName('query')[0].value }));
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

var SourceShow = {
  controller: function(args) {
    if (args && args.query) {
      return { sourceResults: SearchResults(args.query), query: args.query };
    } else {
      return { sourceResults: SourceResults() };
    }
  },
  view: function(ctrl) {
    var userFeeds = ctrl.sourceResults().user.feeds;
    var sourceNameText;

    // set sourceNameText to current source name
    for (var i = 0; i < userFeeds.length; i++) {
      if (userFeeds[i]._id === m.route.param('feedId')) {
        for (var c = 0; c < userFeeds[i].sources.length; c++) {
          if (userFeeds[i].sources[c]._id === m.route.param('sourceId')) {
            sourceNameText = userFeeds[i].sources[c].name;
          }
        }
      }
    }

    layoutHelper({
      menu: LoggedInMenu,
      userId: m.route.param('id'),

      feedSelect: FeedSelect,
      feeds: userFeeds,
      currentFeed: 'select-feed',

      refreshButton: RefreshButton,

      searchBar: SearchBar,
      searchIcon: SearchIcon,
      query: ctrl.query || false,

      sourceName: SourceName,
      sourceNameText: sourceNameText
    });

    if (ctrl.sourceResults().data.length < 1) {
      return m('p.feed-error', ctrl.sourceResults().message)
    } else {
      return m('div', [
        ctrl.sourceResults().data.map(function(item) {
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

module.exports = SourceShow;

},{"../feeds/feed-item":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-item.js","../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","../layout/refresh-button":"/Users/david/Projects/inform/inform/public/js/src/layout/refresh-button.js","../layout/search-icon":"/Users/david/Projects/inform/inform/public/js/src/layout/search-icon.js","../layout/source-name":"/Users/david/Projects/inform/inform/public/js/src/layout/source-name.js","./models/search-results":"/Users/david/Projects/inform/inform/public/js/src/sources/models/search-results.js","./models/source-results":"/Users/david/Projects/inform/inform/public/js/src/sources/models/source-results.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/models/user.js":[function(require,module,exports){
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
var LoggedInMenu = require('../layout/logged-in-menu');
var FeedSelect = require('../layout/feed-select');
var User = require('./models/user');
var Messages = require('../helpers/messages');

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
      .then(function(response) {
        if (!response.fail) {
          m.route('/users/' + m.route.param('id'));
        } else {
          m.route('/users/' + m.route.param('id') + '/edit');

          var alertMessage = Messages.AlertMessage(response);
          m.mount(document.getElementById('message'), alertMessage);
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
      m('small', 'To keep your password the same, leave blank'),
      m('div.input-block', [
        m('input', { type: 'password', name: 'password', placeholder: 'password' })
      ]),
      m('div.input-block', [
        m('input', { type: 'password', name: 'confirmation', placeholder: 'confirmation' })
      ]),
      m('div.submit-block', [
        m('input', { onclick: ctrl.updateUser, type: 'submit', value: 'Update User' })
      ]),
      m('p', [
        m('a', { href: '/users/' + m.route.param('id'), config: m.route }, 'Cancel')
      ])
    ])
  }
}

module.exports = UserEdit;

},{"../helpers/authorize-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/authorize-helper.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/messages":"/Users/david/Projects/inform/inform/public/js/src/helpers/messages.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/user":"/Users/david/Projects/inform/inform/public/js/src/users/models/user.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}],"/Users/david/Projects/inform/inform/public/js/src/users/user-new.js":[function(require,module,exports){
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
      ]),
      m('p', [
        m('a', { href: '/', config: m.route }, 'Cancel')
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
var reqHelpers = require('../helpers/request-helpers');

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
            m.route('/');
          } else {
            console.log(data.message);
            m.route('/users/' + m.route.param('id'));
          }
        });
      }
    }
    return { deleteAccount: deleteAccount, user: User(), feeds: Feeds() };
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
      m('h2', ctrl.user().data.email),
      m('a.edit-button', { href: '/users/' + m.route.param('id') + '/edit', config: m.route }, 'Edit Account'),
      m('button.delete-button', { onclick: ctrl.deleteAccount }, 'Delete Account'),
      m('h2', 'My Feeds'),
      ctrl.feeds().data.map(function(feed) {
        return m.component(FeedListing, { feedId: feed._id, title: feed.title, userId: ctrl.feeds().user.id });
      })
    ])
  }
};

module.exports = UserShow;

},{"../feeds//models/feeds":"/Users/david/Projects/inform/inform/public/js/src/feeds/models/feeds.js","../feeds/feed-list":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-list.js","../feeds/feed-listing":"/Users/david/Projects/inform/inform/public/js/src/feeds/feed-listing.js","../helpers/layout-helper":"/Users/david/Projects/inform/inform/public/js/src/helpers/layout-helper.js","../helpers/request-helpers":"/Users/david/Projects/inform/inform/public/js/src/helpers/request-helpers.js","../layout/feed-select":"/Users/david/Projects/inform/inform/public/js/src/layout/feed-select.js","../layout/logged-in-menu.js":"/Users/david/Projects/inform/inform/public/js/src/layout/logged-in-menu.js","./models/user":"/Users/david/Projects/inform/inform/public/js/src/users/models/user.js","mithril":"/Users/david/Projects/inform/inform/node_modules/mithril/mithril.js"}]},{},["./public/js/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvc3JjL21haW4uanMiLCJub2RlX21vZHVsZXMvbWl0aHJpbC9taXRocmlsLmpzIiwicHVibGljL2pzL3NyYy9mZWVkcy9mZWVkLWVkaXQuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL2ZlZWQtaXRlbS5qcyIsInB1YmxpYy9qcy9zcmMvZmVlZHMvZmVlZC1saXN0LmpzIiwicHVibGljL2pzL3NyYy9mZWVkcy9mZWVkLWxpc3RpbmcuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL2ZlZWQtbmV3LmpzIiwicHVibGljL2pzL3NyYy9mZWVkcy9mZWVkLXNob3cuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL21vZGVscy9mZWVkLWluZm8uanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL21vZGVscy9mZWVkLXJlc3VsdHMuanMiLCJwdWJsaWMvanMvc3JjL2ZlZWRzL21vZGVscy9mZWVkcy5qcyIsInB1YmxpYy9qcy9zcmMvZmVlZHMvbW9kZWxzL3NlYXJjaC1yZXN1bHRzLmpzIiwicHVibGljL2pzL3NyYy9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXIuanMiLCJwdWJsaWMvanMvc3JjL2hlbHBlcnMvZmluZC1saW5rcy5qcyIsInB1YmxpYy9qcy9zcmMvaGVscGVycy9sYXlvdXQtaGVscGVyLmpzIiwicHVibGljL2pzL3NyYy9oZWxwZXJzL21lc3NhZ2VzLmpzIiwicHVibGljL2pzL3NyYy9oZWxwZXJzL3JlcXVlc3QtaGVscGVycy5qcyIsInB1YmxpYy9qcy9zcmMvbGF5b3V0L2ZlZWQtc2VsZWN0LmpzIiwicHVibGljL2pzL3NyYy9sYXlvdXQvbG9nZ2VkLWluLW1lbnUuanMiLCJwdWJsaWMvanMvc3JjL2xheW91dC9sb2dnZWQtb3V0LW1lbnUuanMiLCJwdWJsaWMvanMvc3JjL2xheW91dC9tZW51LWljb24uanMiLCJwdWJsaWMvanMvc3JjL2xheW91dC9yZWZyZXNoLWJ1dHRvbi5qcyIsInB1YmxpYy9qcy9zcmMvbGF5b3V0L3NlYXJjaC1pY29uLmpzIiwicHVibGljL2pzL3NyYy9sYXlvdXQvc291cmNlLW5hbWUuanMiLCJwdWJsaWMvanMvc3JjL3Nlc3Npb25zL2xvZ2luLmpzIiwicHVibGljL2pzL3NyYy9zZXNzaW9ucy9sb2dvdXQuanMiLCJwdWJsaWMvanMvc3JjL3NvdXJjZXMvbW9kZWxzL3NlYXJjaC1yZXN1bHRzLmpzIiwicHVibGljL2pzL3NyYy9zb3VyY2VzL21vZGVscy9zb3VyY2UtaW5mby5qcyIsInB1YmxpYy9qcy9zcmMvc291cmNlcy9tb2RlbHMvc291cmNlLXJlc3VsdHMuanMiLCJwdWJsaWMvanMvc3JjL3NvdXJjZXMvc291cmNlLWVkaXQuanMiLCJwdWJsaWMvanMvc3JjL3NvdXJjZXMvc291cmNlLXNob3cuanMiLCJwdWJsaWMvanMvc3JjL3VzZXJzL21vZGVscy91c2VyLmpzIiwicHVibGljL2pzL3NyYy91c2Vycy91c2VyLWVkaXQuanMiLCJwdWJsaWMvanMvc3JjL3VzZXJzL3VzZXItbmV3LmpzIiwicHVibGljL2pzL3NyYy91c2Vycy91c2VyLXNob3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIGFwcCA9IHtcbiAgTG9naW46IHJlcXVpcmUoJy4vc2Vzc2lvbnMvbG9naW4nKSxcbiAgTG9nb3V0OiByZXF1aXJlKCcuL3Nlc3Npb25zL2xvZ291dCcpLFxuICBVc2VyTmV3OiByZXF1aXJlKCcuL3VzZXJzL3VzZXItbmV3JyksXG4gIFVzZXJTaG93OiByZXF1aXJlKCcuL3VzZXJzL3VzZXItc2hvdycpLFxuICBVc2VyRWRpdDogcmVxdWlyZSgnLi91c2Vycy91c2VyLWVkaXQnKSxcbiAgRmVlZExpc3Q6IHJlcXVpcmUoJy4vZmVlZHMvZmVlZC1saXN0JyksXG4gIEZlZWROZXc6IHJlcXVpcmUoJy4vZmVlZHMvZmVlZC1uZXcnKSxcbiAgRmVlZFNob3c6IHJlcXVpcmUoJy4vZmVlZHMvZmVlZC1zaG93JyksXG4gIEZlZWRFZGl0OiByZXF1aXJlKCcuL2ZlZWRzL2ZlZWQtZWRpdCcpLFxuICBTb3VyY2VTaG93OiByZXF1aXJlKCcuL3NvdXJjZXMvc291cmNlLXNob3cnKSxcbiAgU291cmNlRWRpdDogcmVxdWlyZSgnLi9zb3VyY2VzL3NvdXJjZS1lZGl0Jylcbn07XG5cbm0ucm91dGUubW9kZSA9ICdoYXNoJztcblxubS5yb3V0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyksICcvJywge1xuICAvLyBzZXNzaW9uc1xuICAnLyc6IGFwcC5Mb2dpbixcbiAgJy9sb2dvdXQnOiBhcHAuTG9nb3V0LFxuXG4gIC8vIHBhc3N3b3JkIHJlY292ZXJ5XG4gIC8vICcvcmVxdWVzdC1wYXNzd29yZCc6IGFwcC5SZXF1ZXN0UGFzc3dvcmQsXG4gIC8vICcvcmVzZXQtcGFzc3dvcmQvOnRva2VuJzogYXBwLlJlc2V0UGFzc3dvcmQsXG5cbiAgLy8gdXNlcnNcbiAgJy91c2Vycy9uZXcnOiBhcHAuVXNlck5ldyxcbiAgJy91c2Vycy86aWQnOiBhcHAuVXNlclNob3csXG4gICcvdXNlcnMvOmlkL2VkaXQnOiBhcHAuVXNlckVkaXQsXG5cbiAgLy8gZmVlZHNcbiAgJy91c2Vycy86aWQvZmVlZHMnOiBhcHAuRmVlZExpc3QsXG4gICcvdXNlcnMvOmlkL2ZlZWRzL25ldyc6IGFwcC5GZWVkTmV3LFxuICAnL3VzZXJzLzppZC9mZWVkcy86ZmVlZElkJzogYXBwLkZlZWRTaG93LFxuICAnL3VzZXJzLzppZC9mZWVkcy86ZmVlZElkL2VkaXQnOiBhcHAuRmVlZEVkaXQsXG5cbiAgLy8gc291cmNlc1xuICAnL3VzZXJzLzppZC9mZWVkcy86ZmVlZElkL3NvdXJjZXMvOnNvdXJjZUlkJzogYXBwLlNvdXJjZVNob3csXG4gICcvdXNlcnMvOmlkL2ZlZWRzLzpmZWVkSWQvc291cmNlcy86c291cmNlSWQvZWRpdCc6IGFwcC5Tb3VyY2VFZGl0LFxufSk7XG5cbi8vIGFkanVzdCBjb250ZW50IHRvIG1vdmUgZG93biB3aGVuIHNlYXJjaCBiYXIgYW5kIG1lbnUgYXJlIGRpc3BsYXllZFxudmFyIG1lbnVDb250cm9sID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtY29udHJvbCcpO1xudmFyIHNlYXJjaENvbnRyb2wgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWNvbnRyb2wnKTtcbnZhciBvdXRlcldyYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0ZXItd3JhcCcpO1xuXG52YXIgaGVhZGVyQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21lbnUgPiBkaXYnKTtcbiAgaWYgKG1lbnVDb250cm9sLmNoZWNrZWQgPT09IHRydWUgJiYgc2VhcmNoQ29udHJvbC5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICBvdXRlcldyYXAuc3R5bGUucGFkZGluZ1RvcCA9IE51bWJlcihtZW51LmdldEF0dHJpYnV0ZSgnZGF0YS1oZWlnaHQnKSkgKyA5NSArICdweCc7XG4gIH0gZWxzZSBpZiAobWVudUNvbnRyb2wuY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgb3V0ZXJXcmFwLnN0eWxlLnBhZGRpbmdUb3AgPSBOdW1iZXIobWVudS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGVpZ2h0JykpICsgNjAgKyAncHgnO1xuICB9IGVsc2UgaWYgKHNlYXJjaENvbnRyb2wuY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgb3V0ZXJXcmFwLnN0eWxlLnBhZGRpbmdUb3AgPSAnOTVweCc7XG4gIH0gZWxzZSB7XG4gICAgICBvdXRlcldyYXAuc3R5bGUucGFkZGluZ1RvcCA9ICc2MHB4JztcbiAgfVxufVxuXG5tZW51Q29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoZWFkZXJDaGFuZ2UpO1xuc2VhcmNoQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoZWFkZXJDaGFuZ2UpO1xuXG5cblxuLy8gd2hlbiBoYXNoZWQgcm91dGUgY2hhbmdlcywgcmVzZXQgdGhlIG1lbnUgYW5kIG1lc3NhZ2VzXG4oZnVuY3Rpb24oaGlzdG9yeSkge1xuXG4gIHZhciBwdXNoU3RhdGUgPSBoaXN0b3J5LnB1c2hTdGF0ZTtcbiAgdmFyIGhhbmRsZVJvdXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAvLyByZXNldCBtZXNzYWdlc1xuICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKSwgbnVsbCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKS5pbm5lckhUTUwgPSAnJztcblxuICAgIC8vIHJlc2V0IG1lbnVcbiAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnI21lbnUtY29udHJvbCcpLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICcnKTtcbiAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnI3NlYXJjaC1jb250cm9sJykuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJycpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdyb3V0ZS1jaGFuZ2UnKVxuICB9XG5cbiAgaGlzdG9yeS5wdXNoU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgaWYgKHR5cGVvZiBoaXN0b3J5Lm9ucHVzaHN0YXRlID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGhpc3Rvcnkub25wdXNoc3RhdGUoe3N0YXRlOiBzdGF0ZX0pO1xuICAgICAgfVxuICAgICAgLy8gLi4uIHdoYXRldmVyIGVsc2UgeW91IHdhbnQgdG8gZG9cbiAgICAgIC8vIG1heWJlIGNhbGwgb25oYXNoY2hhbmdlIGUuaGFuZGxlclxuICAgICAgcmV0dXJuIHB1c2hTdGF0ZS5hcHBseShoaXN0b3J5LCBhcmd1bWVudHMpO1xuICB9XG5cbiAgd2luZG93Lm9ucG9wc3RhdGUgPSBoaXN0b3J5Lm9ucHVzaHN0YXRlID0gaGFuZGxlUm91dGVDaGFuZ2U7XG5cbn0pKHdpbmRvdy5oaXN0b3J5KTtcbiIsInZhciBtID0gKGZ1bmN0aW9uIGFwcCh3aW5kb3csIHVuZGVmaW5lZCkge1xyXG5cdHZhciBPQkpFQ1QgPSBcIltvYmplY3QgT2JqZWN0XVwiLCBBUlJBWSA9IFwiW29iamVjdCBBcnJheV1cIiwgU1RSSU5HID0gXCJbb2JqZWN0IFN0cmluZ11cIiwgRlVOQ1RJT04gPSBcImZ1bmN0aW9uXCI7XHJcblx0dmFyIHR5cGUgPSB7fS50b1N0cmluZztcclxuXHR2YXIgcGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsuKz9cXF0pL2csIGF0dHJQYXJzZXIgPSAvXFxbKC4rPykoPzo9KFwifCd8KSguKj8pXFwyKT9cXF0vO1xyXG5cdHZhciB2b2lkRWxlbWVudHMgPSAvXihBUkVBfEJBU0V8QlJ8Q09MfENPTU1BTkR8RU1CRUR8SFJ8SU1HfElOUFVUfEtFWUdFTnxMSU5LfE1FVEF8UEFSQU18U09VUkNFfFRSQUNLfFdCUikkLztcclxuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge31cclxuXHJcblx0Ly8gY2FjaGluZyBjb21tb25seSB1c2VkIHZhcmlhYmxlc1xyXG5cdHZhciAkZG9jdW1lbnQsICRsb2NhdGlvbiwgJHJlcXVlc3RBbmltYXRpb25GcmFtZSwgJGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xyXG5cclxuXHQvLyBzZWxmIGludm9raW5nIGZ1bmN0aW9uIG5lZWRlZCBiZWNhdXNlIG9mIHRoZSB3YXkgbW9ja3Mgd29ya1xyXG5cdGZ1bmN0aW9uIGluaXRpYWxpemUod2luZG93KXtcclxuXHRcdCRkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHRcdCRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuY2xlYXJUaW1lb3V0O1xyXG5cdFx0JHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LnNldFRpbWVvdXQ7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKHdpbmRvdyk7XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAdHlwZWRlZiB7U3RyaW5nfSBUYWdcclxuXHQgKiBBIHN0cmluZyB0aGF0IGxvb2tzIGxpa2UgLT4gZGl2LmNsYXNzbmFtZSNpZFtwYXJhbT1vbmVdW3BhcmFtMj10d29dXHJcblx0ICogV2hpY2ggZGVzY3JpYmVzIGEgRE9NIG5vZGVcclxuXHQgKi9cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge1RhZ30gVGhlIERPTSBub2RlIHRhZ1xyXG5cdCAqIEBwYXJhbSB7T2JqZWN0PVtdfSBvcHRpb25hbCBrZXktdmFsdWUgcGFpcnMgdG8gYmUgbWFwcGVkIHRvIERPTSBhdHRyc1xyXG5cdCAqIEBwYXJhbSB7Li4ubU5vZGU9W119IFplcm8gb3IgbW9yZSBNaXRocmlsIGNoaWxkIG5vZGVzLiBDYW4gYmUgYW4gYXJyYXksIG9yIHNwbGF0IChvcHRpb25hbClcclxuXHQgKlxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIG0oKSB7XHJcblx0XHR2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuXHRcdHZhciBoYXNBdHRycyA9IGFyZ3NbMV0gIT0gbnVsbCAmJiB0eXBlLmNhbGwoYXJnc1sxXSkgPT09IE9CSkVDVCAmJiAhKFwidGFnXCIgaW4gYXJnc1sxXSB8fCBcInZpZXdcIiBpbiBhcmdzWzFdKSAmJiAhKFwic3VidHJlZVwiIGluIGFyZ3NbMV0pO1xyXG5cdFx0dmFyIGF0dHJzID0gaGFzQXR0cnMgPyBhcmdzWzFdIDoge307XHJcblx0XHR2YXIgY2xhc3NBdHRyTmFtZSA9IFwiY2xhc3NcIiBpbiBhdHRycyA/IFwiY2xhc3NcIiA6IFwiY2xhc3NOYW1lXCI7XHJcblx0XHR2YXIgY2VsbCA9IHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7fX07XHJcblx0XHR2YXIgbWF0Y2gsIGNsYXNzZXMgPSBbXTtcclxuXHRcdGlmICh0eXBlLmNhbGwoYXJnc1swXSkgIT0gU1RSSU5HKSB0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBiZSBhIHN0cmluZ1wiKVxyXG5cdFx0d2hpbGUgKG1hdGNoID0gcGFyc2VyLmV4ZWMoYXJnc1swXSkpIHtcclxuXHRcdFx0aWYgKG1hdGNoWzFdID09PSBcIlwiICYmIG1hdGNoWzJdKSBjZWxsLnRhZyA9IG1hdGNoWzJdO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIjXCIpIGNlbGwuYXR0cnMuaWQgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiLlwiKSBjbGFzc2VzLnB1c2gobWF0Y2hbMl0pO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFszXVswXSA9PT0gXCJbXCIpIHtcclxuXHRcdFx0XHR2YXIgcGFpciA9IGF0dHJQYXJzZXIuZXhlYyhtYXRjaFszXSk7XHJcblx0XHRcdFx0Y2VsbC5hdHRyc1twYWlyWzFdXSA9IHBhaXJbM10gfHwgKHBhaXJbMl0gPyBcIlwiIDp0cnVlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGNoaWxkcmVuID0gaGFzQXR0cnMgPyBhcmdzLnNsaWNlKDIpIDogYXJncy5zbGljZSgxKTtcclxuXHRcdGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgdHlwZS5jYWxsKGNoaWxkcmVuWzBdKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuWzBdXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJzKSB7XHJcblx0XHRcdGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IGNsYXNzQXR0ck5hbWUgJiYgYXR0cnNbYXR0ck5hbWVdICE9IG51bGwgJiYgYXR0cnNbYXR0ck5hbWVdICE9PSBcIlwiKSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXR0cnNbYXR0ck5hbWVdKVxyXG5cdFx0XHRcdFx0Y2VsbC5hdHRyc1thdHRyTmFtZV0gPSBcIlwiIC8vY3JlYXRlIGtleSBpbiBjb3JyZWN0IGl0ZXJhdGlvbiBvcmRlclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gYXR0cnNbYXR0ck5hbWVdXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjbGFzc2VzLmxlbmd0aCA+IDApIGNlbGwuYXR0cnNbY2xhc3NBdHRyTmFtZV0gPSBjbGFzc2VzLmpvaW4oXCIgXCIpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gY2VsbFxyXG5cdH1cclxuXHRmdW5jdGlvbiBidWlsZChwYXJlbnRFbGVtZW50LCBwYXJlbnRUYWcsIHBhcmVudENhY2hlLCBwYXJlbnRJbmRleCwgZGF0YSwgY2FjaGVkLCBzaG91bGRSZWF0dGFjaCwgaW5kZXgsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdC8vYGJ1aWxkYCBpcyBhIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0aGF0IG1hbmFnZXMgY3JlYXRpb24vZGlmZmluZy9yZW1vdmFsIG9mIERPTSBlbGVtZW50cyBiYXNlZCBvbiBjb21wYXJpc29uIGJldHdlZW4gYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0Ly90aGUgZGlmZiBhbGdvcml0aG0gY2FuIGJlIHN1bW1hcml6ZWQgYXMgdGhpczpcclxuXHRcdC8vMSAtIGNvbXBhcmUgYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0Ly8yIC0gaWYgdGhleSBhcmUgZGlmZmVyZW50LCBjb3B5IGBkYXRhYCB0byBgY2FjaGVkYCBhbmQgdXBkYXRlIHRoZSBET00gYmFzZWQgb24gd2hhdCB0aGUgZGlmZmVyZW5jZSBpc1xyXG5cdFx0Ly8zIC0gcmVjdXJzaXZlbHkgYXBwbHkgdGhpcyBhbGdvcml0aG0gZm9yIGV2ZXJ5IGFycmF5IGFuZCBmb3IgdGhlIGNoaWxkcmVuIG9mIGV2ZXJ5IHZpcnR1YWwgZWxlbWVudFxyXG5cclxuXHRcdC8vdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIGlzIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91cyByZWRyYXcncyBgZGF0YWAgZGF0YSBzdHJ1Y3R1cmUsIHdpdGggYSBmZXcgYWRkaXRpb25zOlxyXG5cdFx0Ly8tIGBjYWNoZWRgIGFsd2F5cyBoYXMgYSBwcm9wZXJ0eSBjYWxsZWQgYG5vZGVzYCwgd2hpY2ggaXMgYSBsaXN0IG9mIERPTSBlbGVtZW50cyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGRhdGEgcmVwcmVzZW50ZWQgYnkgdGhlIHJlc3BlY3RpdmUgdmlydHVhbCBlbGVtZW50XHJcblx0XHQvLy0gaW4gb3JkZXIgdG8gc3VwcG9ydCBhdHRhY2hpbmcgYG5vZGVzYCBhcyBhIHByb3BlcnR5IG9mIGBjYWNoZWRgLCBgY2FjaGVkYCBpcyAqYWx3YXlzKiBhIG5vbi1wcmltaXRpdmUgb2JqZWN0LCBpLmUuIGlmIHRoZSBkYXRhIHdhcyBhIHN0cmluZywgdGhlbiBjYWNoZWQgaXMgYSBTdHJpbmcgaW5zdGFuY2UuIElmIGRhdGEgd2FzIGBudWxsYCBvciBgdW5kZWZpbmVkYCwgY2FjaGVkIGlzIGBuZXcgU3RyaW5nKFwiXCIpYFxyXG5cdFx0Ly8tIGBjYWNoZWQgYWxzbyBoYXMgYSBgY29uZmlnQ29udGV4dGAgcHJvcGVydHksIHdoaWNoIGlzIHRoZSBzdGF0ZSBzdG9yYWdlIG9iamVjdCBleHBvc2VkIGJ5IGNvbmZpZyhlbGVtZW50LCBpc0luaXRpYWxpemVkLCBjb250ZXh0KVxyXG5cdFx0Ly8tIHdoZW4gYGNhY2hlZGAgaXMgYW4gT2JqZWN0LCBpdCByZXByZXNlbnRzIGEgdmlydHVhbCBlbGVtZW50OyB3aGVuIGl0J3MgYW4gQXJyYXksIGl0IHJlcHJlc2VudHMgYSBsaXN0IG9mIGVsZW1lbnRzOyB3aGVuIGl0J3MgYSBTdHJpbmcsIE51bWJlciBvciBCb29sZWFuLCBpdCByZXByZXNlbnRzIGEgdGV4dCBub2RlXHJcblxyXG5cdFx0Ly9gcGFyZW50RWxlbWVudGAgaXMgYSBET00gZWxlbWVudCB1c2VkIGZvciBXM0MgRE9NIEFQSSBjYWxsc1xyXG5cdFx0Ly9gcGFyZW50VGFnYCBpcyBvbmx5IHVzZWQgZm9yIGhhbmRsaW5nIGEgY29ybmVyIGNhc2UgZm9yIHRleHRhcmVhIHZhbHVlc1xyXG5cdFx0Ly9gcGFyZW50Q2FjaGVgIGlzIHVzZWQgdG8gcmVtb3ZlIG5vZGVzIGluIHNvbWUgbXVsdGktbm9kZSBjYXNlc1xyXG5cdFx0Ly9gcGFyZW50SW5kZXhgIGFuZCBgaW5kZXhgIGFyZSB1c2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG9mZnNldCBvZiBub2Rlcy4gVGhleSdyZSBhcnRpZmFjdHMgZnJvbSBiZWZvcmUgYXJyYXlzIHN0YXJ0ZWQgYmVpbmcgZmxhdHRlbmVkIGFuZCBhcmUgbGlrZWx5IHJlZmFjdG9yYWJsZVxyXG5cdFx0Ly9gZGF0YWAgYW5kIGBjYWNoZWRgIGFyZSwgcmVzcGVjdGl2ZWx5LCB0aGUgbmV3IGFuZCBvbGQgbm9kZXMgYmVpbmcgZGlmZmVkXHJcblx0XHQvL2BzaG91bGRSZWF0dGFjaGAgaXMgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhIHBhcmVudCBub2RlIHdhcyByZWNyZWF0ZWQgKGlmIHNvLCBhbmQgaWYgdGhpcyBub2RlIGlzIHJldXNlZCwgdGhlbiB0aGlzIG5vZGUgbXVzdCByZWF0dGFjaCBpdHNlbGYgdG8gdGhlIG5ldyBwYXJlbnQpXHJcblx0XHQvL2BlZGl0YWJsZWAgaXMgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgYW4gYW5jZXN0b3IgaXMgY29udGVudGVkaXRhYmxlXHJcblx0XHQvL2BuYW1lc3BhY2VgIGluZGljYXRlcyB0aGUgY2xvc2VzdCBIVE1MIG5hbWVzcGFjZSBhcyBpdCBjYXNjYWRlcyBkb3duIGZyb20gYW4gYW5jZXN0b3JcclxuXHRcdC8vYGNvbmZpZ3NgIGlzIGEgbGlzdCBvZiBjb25maWcgZnVuY3Rpb25zIHRvIHJ1biBhZnRlciB0aGUgdG9wbW9zdCBgYnVpbGRgIGNhbGwgZmluaXNoZXMgcnVubmluZ1xyXG5cclxuXHRcdC8vdGhlcmUncyBsb2dpYyB0aGF0IHJlbGllcyBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IG51bGwgYW5kIHVuZGVmaW5lZCBkYXRhIGFyZSBlcXVpdmFsZW50IHRvIGVtcHR5IHN0cmluZ3NcclxuXHRcdC8vLSB0aGlzIHByZXZlbnRzIGxpZmVjeWNsZSBzdXJwcmlzZXMgZnJvbSBwcm9jZWR1cmFsIGhlbHBlcnMgdGhhdCBtaXggaW1wbGljaXQgYW5kIGV4cGxpY2l0IHJldHVybiBzdGF0ZW1lbnRzIChlLmcuIGZ1bmN0aW9uIGZvbygpIHtpZiAoY29uZCkgcmV0dXJuIG0oXCJkaXZcIil9XHJcblx0XHQvLy0gaXQgc2ltcGxpZmllcyBkaWZmaW5nIGNvZGVcclxuXHRcdC8vZGF0YS50b1N0cmluZygpIG1pZ2h0IHRocm93IG9yIHJldHVybiBudWxsIGlmIGRhdGEgaXMgdGhlIHJldHVybiB2YWx1ZSBvZiBDb25zb2xlLmxvZyBpbiBGaXJlZm94IChiZWhhdmlvciBkZXBlbmRzIG9uIHZlcnNpb24pXHJcblx0XHR0cnkge2lmIChkYXRhID09IG51bGwgfHwgZGF0YS50b1N0cmluZygpID09IG51bGwpIGRhdGEgPSBcIlwiO30gY2F0Y2ggKGUpIHtkYXRhID0gXCJcIn1cclxuXHRcdGlmIChkYXRhLnN1YnRyZWUgPT09IFwicmV0YWluXCIpIHJldHVybiBjYWNoZWQ7XHJcblx0XHR2YXIgY2FjaGVkVHlwZSA9IHR5cGUuY2FsbChjYWNoZWQpLCBkYXRhVHlwZSA9IHR5cGUuY2FsbChkYXRhKTtcclxuXHRcdGlmIChjYWNoZWQgPT0gbnVsbCB8fCBjYWNoZWRUeXBlICE9PSBkYXRhVHlwZSkge1xyXG5cdFx0XHRpZiAoY2FjaGVkICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAocGFyZW50Q2FjaGUgJiYgcGFyZW50Q2FjaGUubm9kZXMpIHtcclxuXHRcdFx0XHRcdHZhciBvZmZzZXQgPSBpbmRleCAtIHBhcmVudEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZCA9IG9mZnNldCArIChkYXRhVHlwZSA9PT0gQVJSQVkgPyBkYXRhIDogY2FjaGVkLm5vZGVzKS5sZW5ndGg7XHJcblx0XHRcdFx0XHRjbGVhcihwYXJlbnRDYWNoZS5ub2Rlcy5zbGljZShvZmZzZXQsIGVuZCksIHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoY2FjaGVkLm5vZGVzKSBjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZClcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcjtcclxuXHRcdFx0aWYgKGNhY2hlZC50YWcpIGNhY2hlZCA9IHt9OyAvL2lmIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSB2aXJ0dWFsIGRvbSBlbGVtZW50LCB1c2UgYSBibGFuayBvYmplY3QgYXMgdGhlIGJhc2UgY2FjaGVkIG5vZGUgaW5zdGVhZCBvZiBjb3B5aW5nIHRoZSB2aXJ0dWFsIGVsICgjMjc3KVxyXG5cdFx0XHRjYWNoZWQubm9kZXMgPSBbXVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhVHlwZSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Ly9yZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhW2ldKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdC5hcHBseShbXSwgZGF0YSk7XHJcblx0XHRcdFx0XHRpLS0gLy9jaGVjayBjdXJyZW50IGluZGV4IGFnYWluIGFuZCBmbGF0dGVuIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIG5lc3RlZCBhcnJheXMgYXQgdGhhdCBpbmRleFxyXG5cdFx0XHRcdFx0bGVuID0gZGF0YS5sZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHZhciBub2RlcyA9IFtdLCBpbnRhY3QgPSBjYWNoZWQubGVuZ3RoID09PSBkYXRhLmxlbmd0aCwgc3ViQXJyYXlDb3VudCA9IDA7XHJcblxyXG5cdFx0XHQvL2tleXMgYWxnb3JpdGhtOiBzb3J0IGVsZW1lbnRzIHdpdGhvdXQgcmVjcmVhdGluZyB0aGVtIGlmIGtleXMgYXJlIHByZXNlbnRcclxuXHRcdFx0Ly8xKSBjcmVhdGUgYSBtYXAgb2YgYWxsIGV4aXN0aW5nIGtleXMsIGFuZCBtYXJrIGFsbCBmb3IgZGVsZXRpb25cclxuXHRcdFx0Ly8yKSBhZGQgbmV3IGtleXMgdG8gbWFwIGFuZCBtYXJrIHRoZW0gZm9yIGFkZGl0aW9uXHJcblx0XHRcdC8vMykgaWYga2V5IGV4aXN0cyBpbiBuZXcgbGlzdCwgY2hhbmdlIGFjdGlvbiBmcm9tIGRlbGV0aW9uIHRvIGEgbW92ZVxyXG5cdFx0XHQvLzQpIGZvciBlYWNoIGtleSwgaGFuZGxlIGl0cyBjb3JyZXNwb25kaW5nIGFjdGlvbiBhcyBtYXJrZWQgaW4gcHJldmlvdXMgc3RlcHNcclxuXHRcdFx0dmFyIERFTEVUSU9OID0gMSwgSU5TRVJUSU9OID0gMiAsIE1PVkUgPSAzO1xyXG5cdFx0XHR2YXIgZXhpc3RpbmcgPSB7fSwgc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gZmFsc2U7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGVkLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSAmJiBjYWNoZWRbaV0uYXR0cnMgJiYgY2FjaGVkW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZXhpc3RpbmdbY2FjaGVkW2ldLmF0dHJzLmtleV0gPSB7YWN0aW9uOiBERUxFVElPTiwgaW5kZXg6IGl9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgZ3VpZCA9IDBcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoZGF0YVtpXSAmJiBkYXRhW2ldLmF0dHJzICYmIGRhdGFbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGogPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2pdICYmIGRhdGFbal0uYXR0cnMgJiYgZGF0YVtqXS5hdHRycy5rZXkgPT0gbnVsbCkgZGF0YVtqXS5hdHRycy5rZXkgPSBcIl9fbWl0aHJpbF9fXCIgKyBndWlkKytcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzKSB7XHJcblx0XHRcdFx0dmFyIGtleXNEaWZmZXIgPSBmYWxzZVxyXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCAhPSBjYWNoZWQubGVuZ3RoKSBrZXlzRGlmZmVyID0gdHJ1ZVxyXG5cdFx0XHRcdGVsc2UgZm9yICh2YXIgaSA9IDAsIGNhY2hlZENlbGwsIGRhdGFDZWxsOyBjYWNoZWRDZWxsID0gY2FjaGVkW2ldLCBkYXRhQ2VsbCA9IGRhdGFbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGNhY2hlZENlbGwuYXR0cnMgJiYgZGF0YUNlbGwuYXR0cnMgJiYgY2FjaGVkQ2VsbC5hdHRycy5rZXkgIT0gZGF0YUNlbGwuYXR0cnMua2V5KSB7XHJcblx0XHRcdFx0XHRcdGtleXNEaWZmZXIgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChrZXlzRGlmZmVyKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXSAmJiBkYXRhW2ldLmF0dHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBrZXkgPSBkYXRhW2ldLmF0dHJzLmtleTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghZXhpc3Rpbmdba2V5XSkgZXhpc3Rpbmdba2V5XSA9IHthY3Rpb246IElOU0VSVElPTiwgaW5kZXg6IGl9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBleGlzdGluZ1trZXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb246IE1PVkUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGluZGV4OiBpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcm9tOiBleGlzdGluZ1trZXldLmluZGV4LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50OiBjYWNoZWQubm9kZXNbZXhpc3Rpbmdba2V5XS5pbmRleF0gfHwgJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciBhY3Rpb25zID0gW11cclxuXHRcdFx0XHRcdGZvciAodmFyIHByb3AgaW4gZXhpc3RpbmcpIGFjdGlvbnMucHVzaChleGlzdGluZ1twcm9wXSlcclxuXHRcdFx0XHRcdHZhciBjaGFuZ2VzID0gYWN0aW9ucy5zb3J0KHNvcnRDaGFuZ2VzKTtcclxuXHRcdFx0XHRcdHZhciBuZXdDYWNoZWQgPSBuZXcgQXJyYXkoY2FjaGVkLmxlbmd0aClcclxuXHRcdFx0XHRcdG5ld0NhY2hlZC5ub2RlcyA9IGNhY2hlZC5ub2Rlcy5zbGljZSgpXHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNoYW5nZTsgY2hhbmdlID0gY2hhbmdlc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBERUxFVElPTikge1xyXG5cdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZFtjaGFuZ2UuaW5kZXhdLm5vZGVzLCBjYWNoZWRbY2hhbmdlLmluZGV4XSk7XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShjaGFuZ2UuaW5kZXgsIDEpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IElOU0VSVElPTikge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBkdW1teSA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0XHRcdFx0XHRcdGR1bW15LmtleSA9IGRhdGFbY2hhbmdlLmluZGV4XS5hdHRycy5rZXk7XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZHVtbXksIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdIHx8IG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoY2hhbmdlLmluZGV4LCAwLCB7YXR0cnM6IHtrZXk6IGRhdGFbY2hhbmdlLmluZGV4XS5hdHRycy5rZXl9LCBub2RlczogW2R1bW15XX0pXHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzW2NoYW5nZS5pbmRleF0gPSBkdW1teVxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gTU9WRSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSAhPT0gY2hhbmdlLmVsZW1lbnQgJiYgY2hhbmdlLmVsZW1lbnQgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNoYW5nZS5lbGVtZW50LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWRbY2hhbmdlLmluZGV4XSA9IGNhY2hlZFtjaGFuZ2UuZnJvbV1cclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbY2hhbmdlLmluZGV4XSA9IGNoYW5nZS5lbGVtZW50XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhY2hlZCA9IG5ld0NhY2hlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9lbmQga2V5IGFsZ29yaXRobVxyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNhY2hlQ291bnQgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0Ly9kaWZmIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXlcclxuXHRcdFx0XHR2YXIgaXRlbSA9IGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgY2FjaGVkLCBpbmRleCwgZGF0YVtpXSwgY2FjaGVkW2NhY2hlQ291bnRdLCBzaG91bGRSZWF0dGFjaCwgaW5kZXggKyBzdWJBcnJheUNvdW50IHx8IHN1YkFycmF5Q291bnQsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpO1xyXG5cdFx0XHRcdGlmIChpdGVtID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdGlmICghaXRlbS5ub2Rlcy5pbnRhY3QpIGludGFjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmIChpdGVtLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHQvL2ZpeCBvZmZzZXQgb2YgbmV4dCBlbGVtZW50IGlmIGl0ZW0gd2FzIGEgdHJ1c3RlZCBzdHJpbmcgdy8gbW9yZSB0aGFuIG9uZSBodG1sIGVsZW1lbnRcclxuXHRcdFx0XHRcdC8vdGhlIGZpcnN0IGNsYXVzZSBpbiB0aGUgcmVnZXhwIG1hdGNoZXMgZWxlbWVudHNcclxuXHRcdFx0XHRcdC8vdGhlIHNlY29uZCBjbGF1c2UgKGFmdGVyIHRoZSBwaXBlKSBtYXRjaGVzIHRleHQgbm9kZXNcclxuXHRcdFx0XHRcdHN1YkFycmF5Q291bnQgKz0gKGl0ZW0ubWF0Y2goLzxbXlxcL118XFw+XFxzKltePF0vZykgfHwgWzBdKS5sZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBzdWJBcnJheUNvdW50ICs9IHR5cGUuY2FsbChpdGVtKSA9PT0gQVJSQVkgPyBpdGVtLmxlbmd0aCA6IDE7XHJcblx0XHRcdFx0Y2FjaGVkW2NhY2hlQ291bnQrK10gPSBpdGVtXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFpbnRhY3QpIHtcclxuXHRcdFx0XHQvL2RpZmYgdGhlIGFycmF5IGl0c2VsZlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vdXBkYXRlIHRoZSBsaXN0IG9mIERPTSBub2RlcyBieSBjb2xsZWN0aW5nIHRoZSBub2RlcyBmcm9tIGVhY2ggaXRlbVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoY2FjaGVkW2ldICE9IG51bGwpIG5vZGVzLnB1c2guYXBwbHkobm9kZXMsIGNhY2hlZFtpXS5ub2RlcylcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9yZW1vdmUgaXRlbXMgZnJvbSB0aGUgZW5kIG9mIHRoZSBhcnJheSBpZiB0aGUgbmV3IGFycmF5IGlzIHNob3J0ZXIgdGhhbiB0aGUgb2xkIG9uZVxyXG5cdFx0XHRcdC8vaWYgZXJyb3JzIGV2ZXIgaGFwcGVuIGhlcmUsIHRoZSBpc3N1ZSBpcyBtb3N0IGxpa2VseSBhIGJ1ZyBpbiB0aGUgY29uc3RydWN0aW9uIG9mIHRoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZSBzb21ld2hlcmUgZWFybGllciBpbiB0aGUgcHJvZ3JhbVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBub2RlOyBub2RlID0gY2FjaGVkLm5vZGVzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChub2RlLnBhcmVudE5vZGUgIT0gbnVsbCAmJiBub2Rlcy5pbmRleE9mKG5vZGUpIDwgMCkgY2xlYXIoW25vZGVdLCBbY2FjaGVkW2ldXSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoIDwgY2FjaGVkLmxlbmd0aCkgY2FjaGVkLmxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRhdGEgIT0gbnVsbCAmJiBkYXRhVHlwZSA9PT0gT0JKRUNUKSB7XHJcblx0XHRcdHZhciB2aWV3cyA9IFtdLCBjb250cm9sbGVycyA9IFtdXHJcblx0XHRcdHdoaWxlIChkYXRhLnZpZXcpIHtcclxuXHRcdFx0XHR2YXIgdmlldyA9IGRhdGEudmlldy4kb3JpZ2luYWwgfHwgZGF0YS52aWV3XHJcblx0XHRcdFx0dmFyIGNvbnRyb2xsZXJJbmRleCA9IG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJkaWZmXCIgJiYgY2FjaGVkLnZpZXdzID8gY2FjaGVkLnZpZXdzLmluZGV4T2YodmlldykgOiAtMVxyXG5cdFx0XHRcdHZhciBjb250cm9sbGVyID0gY29udHJvbGxlckluZGV4ID4gLTEgPyBjYWNoZWQuY29udHJvbGxlcnNbY29udHJvbGxlckluZGV4XSA6IG5ldyAoZGF0YS5jb250cm9sbGVyIHx8IG5vb3ApXHJcblx0XHRcdFx0dmFyIGtleSA9IGRhdGEgJiYgZGF0YS5hdHRycyAmJiBkYXRhLmF0dHJzLmtleVxyXG5cdFx0XHRcdGRhdGEgPSBwZW5kaW5nUmVxdWVzdHMgPT0gMCB8fCAoY2FjaGVkICYmIGNhY2hlZC5jb250cm9sbGVycyAmJiBjYWNoZWQuY29udHJvbGxlcnMuaW5kZXhPZihjb250cm9sbGVyKSA+IC0xKSA/IGRhdGEudmlldyhjb250cm9sbGVyKSA6IHt0YWc6IFwicGxhY2Vob2xkZXJcIn1cclxuXHRcdFx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0XHRcdGlmIChrZXkpIHtcclxuXHRcdFx0XHRcdGlmICghZGF0YS5hdHRycykgZGF0YS5hdHRycyA9IHt9XHJcblx0XHRcdFx0XHRkYXRhLmF0dHJzLmtleSA9IGtleVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoY29udHJvbGxlci5vbnVubG9hZCkgdW5sb2FkZXJzLnB1c2goe2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIGhhbmRsZXI6IGNvbnRyb2xsZXIub251bmxvYWR9KVxyXG5cdFx0XHRcdHZpZXdzLnB1c2godmlldylcclxuXHRcdFx0XHRjb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFkYXRhLnRhZyAmJiBjb250cm9sbGVycy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB0ZW1wbGF0ZSBtdXN0IHJldHVybiBhIHZpcnR1YWwgZWxlbWVudCwgbm90IGFuIGFycmF5LCBzdHJpbmcsIGV0Yy5cIilcclxuXHRcdFx0aWYgKCFkYXRhLmF0dHJzKSBkYXRhLmF0dHJzID0ge307XHJcblx0XHRcdGlmICghY2FjaGVkLmF0dHJzKSBjYWNoZWQuYXR0cnMgPSB7fTtcclxuXHJcblx0XHRcdHZhciBkYXRhQXR0cktleXMgPSBPYmplY3Qua2V5cyhkYXRhLmF0dHJzKVxyXG5cdFx0XHR2YXIgaGFzS2V5cyA9IGRhdGFBdHRyS2V5cy5sZW5ndGggPiAoXCJrZXlcIiBpbiBkYXRhLmF0dHJzID8gMSA6IDApXHJcblx0XHRcdC8vaWYgYW4gZWxlbWVudCBpcyBkaWZmZXJlbnQgZW5vdWdoIGZyb20gdGhlIG9uZSBpbiBjYWNoZSwgcmVjcmVhdGUgaXRcclxuXHRcdFx0aWYgKGRhdGEudGFnICE9IGNhY2hlZC50YWcgfHwgZGF0YUF0dHJLZXlzLnNvcnQoKS5qb2luKCkgIT0gT2JqZWN0LmtleXMoY2FjaGVkLmF0dHJzKS5zb3J0KCkuam9pbigpIHx8IGRhdGEuYXR0cnMuaWQgIT0gY2FjaGVkLmF0dHJzLmlkIHx8IGRhdGEuYXR0cnMua2V5ICE9IGNhY2hlZC5hdHRycy5rZXkgfHwgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJhbGxcIiAmJiAoIWNhY2hlZC5jb25maWdDb250ZXh0IHx8IGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiAhPT0gdHJ1ZSkpIHx8IChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiZGlmZlwiICYmIGNhY2hlZC5jb25maWdDb250ZXh0ICYmIGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiA9PT0gZmFsc2UpKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGgpIGNsZWFyKGNhY2hlZC5ub2Rlcyk7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKClcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNhY2hlZC5jb250cm9sbGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY29udHJvbGxlci5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhLnRhZykgIT0gU1RSSU5HKSByZXR1cm47XHJcblxyXG5cdFx0XHR2YXIgbm9kZSwgaXNOZXcgPSBjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwO1xyXG5cdFx0XHRpZiAoZGF0YS5hdHRycy54bWxucykgbmFtZXNwYWNlID0gZGF0YS5hdHRycy54bWxucztcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YS50YWcgPT09IFwic3ZnXCIpIG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YS50YWcgPT09IFwibWF0aFwiKSBuYW1lc3BhY2UgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpc05ldykge1xyXG5cdFx0XHRcdGlmIChkYXRhLmF0dHJzLmlzKSBub2RlID0gbmFtZXNwYWNlID09PSB1bmRlZmluZWQgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZywgZGF0YS5hdHRycy5pcykgOiAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpO1xyXG5cdFx0XHRcdGVsc2Ugbm9kZSA9IG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID8gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnKTtcclxuXHRcdFx0XHRjYWNoZWQgPSB7XHJcblx0XHRcdFx0XHR0YWc6IGRhdGEudGFnLFxyXG5cdFx0XHRcdFx0Ly9zZXQgYXR0cmlidXRlcyBmaXJzdCwgdGhlbiBjcmVhdGUgY2hpbGRyZW5cclxuXHRcdFx0XHRcdGF0dHJzOiBoYXNLZXlzID8gc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywge30sIG5hbWVzcGFjZSkgOiBkYXRhLmF0dHJzLFxyXG5cdFx0XHRcdFx0Y2hpbGRyZW46IGRhdGEuY2hpbGRyZW4gIT0gbnVsbCAmJiBkYXRhLmNoaWxkcmVuLmxlbmd0aCA+IDAgP1xyXG5cdFx0XHRcdFx0XHRidWlsZChub2RlLCBkYXRhLnRhZywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGRhdGEuY2hpbGRyZW4sIGNhY2hlZC5jaGlsZHJlbiwgdHJ1ZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncykgOlxyXG5cdFx0XHRcdFx0XHRkYXRhLmNoaWxkcmVuLFxyXG5cdFx0XHRcdFx0bm9kZXM6IFtub2RlXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y2FjaGVkLnZpZXdzID0gdmlld3NcclxuXHRcdFx0XHRcdGNhY2hlZC5jb250cm9sbGVycyA9IGNvbnRyb2xsZXJzXHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgJiYgY29udHJvbGxlci5vbnVubG9hZC4kb2xkKSBjb250cm9sbGVyLm9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZC4kb2xkXHJcblx0XHRcdFx0XHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgJiYgY29udHJvbGxlci5vbnVubG9hZCkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvbnVubG9hZCA9IGNvbnRyb2xsZXIub251bmxvYWRcclxuXHRcdFx0XHRcdFx0XHRjb250cm9sbGVyLm9udW5sb2FkID0gbm9vcFxyXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQuJG9sZCA9IG9udW5sb2FkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jaGlsZHJlbiAmJiAhY2FjaGVkLmNoaWxkcmVuLm5vZGVzKSBjYWNoZWQuY2hpbGRyZW4ubm9kZXMgPSBbXTtcclxuXHRcdFx0XHQvL2VkZ2UgY2FzZTogc2V0dGluZyB2YWx1ZSBvbiA8c2VsZWN0PiBkb2Vzbid0IHdvcmsgYmVmb3JlIGNoaWxkcmVuIGV4aXN0LCBzbyBzZXQgaXQgYWdhaW4gYWZ0ZXIgY2hpbGRyZW4gaGF2ZSBiZWVuIGNyZWF0ZWRcclxuXHRcdFx0XHRpZiAoZGF0YS50YWcgPT09IFwic2VsZWN0XCIgJiYgXCJ2YWx1ZVwiIGluIGRhdGEuYXR0cnMpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIHt2YWx1ZTogZGF0YS5hdHRycy52YWx1ZX0sIHt9LCBuYW1lc3BhY2UpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRub2RlID0gY2FjaGVkLm5vZGVzWzBdO1xyXG5cdFx0XHRcdGlmIChoYXNLZXlzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCBjYWNoZWQuYXR0cnMsIG5hbWVzcGFjZSk7XHJcblx0XHRcdFx0Y2FjaGVkLmNoaWxkcmVuID0gYnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIGZhbHNlLCAwLCBkYXRhLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA/IG5vZGUgOiBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnNcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHNob3VsZFJlYXR0YWNoID09PSB0cnVlICYmIG5vZGUgIT0gbnVsbCkgcGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vc2NoZWR1bGUgY29uZmlncyB0byBiZSBjYWxsZWQuIFRoZXkgYXJlIGNhbGxlZCBhZnRlciBgYnVpbGRgIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHRcdFx0aWYgKHR5cGVvZiBkYXRhLmF0dHJzW1wiY29uZmlnXCJdID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHZhciBjb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCB8fCB7fTtcclxuXHJcblx0XHRcdFx0Ly8gYmluZFxyXG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEsIGFyZ3MpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEuYXR0cnNbXCJjb25maWdcIl0uYXBwbHkoZGF0YSwgYXJncylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGNvbmZpZ3MucHVzaChjYWxsYmFjayhkYXRhLCBbbm9kZSwgIWlzTmV3LCBjb250ZXh0LCBjYWNoZWRdKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGEgIT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Ly9oYW5kbGUgdGV4dCBub2Rlc1xyXG5cdFx0XHR2YXIgbm9kZXM7XHJcblx0XHRcdGlmIChjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldO1xyXG5cdFx0XHRcdFx0aWYgKCFwYXJlbnRFbGVtZW50Lm5vZGVOYW1lLm1hdGNoKHZvaWRFbGVtZW50cykpIHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGVzWzBdLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IFwic3RyaW5nIG51bWJlciBib29sZWFuXCIuaW5kZXhPZih0eXBlb2YgZGF0YSkgPiAtMSA/IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpIDogZGF0YTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC52YWx1ZU9mKCkgIT09IGRhdGEudmFsdWVPZigpIHx8IHNob3VsZFJlYXR0YWNoID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bm9kZXMgPSBjYWNoZWQubm9kZXM7XHJcblx0XHRcdFx0aWYgKCFlZGl0YWJsZSB8fCBlZGl0YWJsZSAhPT0gJGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdFx0XHRub2RlcyA9IGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9jb3JuZXIgY2FzZTogcmVwbGFjaW5nIHRoZSBub2RlVmFsdWUgb2YgYSB0ZXh0IG5vZGUgdGhhdCBpcyBhIGNoaWxkIG9mIGEgdGV4dGFyZWEvY29udGVudGVkaXRhYmxlIGRvZXNuJ3Qgd29ya1xyXG5cdFx0XHRcdFx0XHQvL3dlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRleHRhcmVhIG9yIHRoZSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnRlZGl0YWJsZSBlbGVtZW50IGluc3RlYWRcclxuXHRcdFx0XHRcdFx0aWYgKHBhcmVudFRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSBwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZWRpdGFibGUpIGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxKSB7IC8vd2FzIGEgdHJ1c3RlZCBzdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZC5ub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZXNbMF0sIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0bm9kZXNbMF0ubm9kZVZhbHVlID0gZGF0YVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblx0ZnVuY3Rpb24gc29ydENoYW5nZXMoYSwgYikge3JldHVybiBhLmFjdGlvbiAtIGIuYWN0aW9uIHx8IGEuaW5kZXggLSBiLmluZGV4fVxyXG5cdGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMobm9kZSwgdGFnLCBkYXRhQXR0cnMsIGNhY2hlZEF0dHJzLCBuYW1lc3BhY2UpIHtcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGRhdGFBdHRycykge1xyXG5cdFx0XHR2YXIgZGF0YUF0dHIgPSBkYXRhQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHR2YXIgY2FjaGVkQXR0ciA9IGNhY2hlZEF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0aWYgKCEoYXR0ck5hbWUgaW4gY2FjaGVkQXR0cnMpIHx8IChjYWNoZWRBdHRyICE9PSBkYXRhQXR0cikpIHtcclxuXHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly9gY29uZmlnYCBpc24ndCBhIHJlYWwgYXR0cmlidXRlcywgc28gaWdub3JlIGl0XHJcblx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiY29uZmlnXCIgfHwgYXR0ck5hbWUgPT0gXCJrZXlcIikgY29udGludWU7XHJcblx0XHRcdFx0XHQvL2hvb2sgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGF1dG8tcmVkcmF3aW5nIHN5c3RlbVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGFBdHRyID09PSBGVU5DVElPTiAmJiBhdHRyTmFtZS5pbmRleE9mKFwib25cIikgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0bm9kZVthdHRyTmFtZV0gPSBhdXRvcmVkcmF3KGRhdGFBdHRyLCBub2RlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgYHN0eWxlOiB7Li4ufWBcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIgJiYgZGF0YUF0dHIgIT0gbnVsbCAmJiB0eXBlLmNhbGwoZGF0YUF0dHIpID09PSBPQkpFQ1QpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcnVsZSBpbiBkYXRhQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChjYWNoZWRBdHRyID09IG51bGwgfHwgY2FjaGVkQXR0cltydWxlXSAhPT0gZGF0YUF0dHJbcnVsZV0pIG5vZGUuc3R5bGVbcnVsZV0gPSBkYXRhQXR0cltydWxlXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gY2FjaGVkQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghKHJ1bGUgaW4gZGF0YUF0dHIpKSBub2RlLnN0eWxlW3J1bGVdID0gXCJcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBTVkdcclxuXHRcdFx0XHRcdGVsc2UgaWYgKG5hbWVzcGFjZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJocmVmXCIpIG5vZGUuc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsIFwiaHJlZlwiLCBkYXRhQXR0cik7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcImNsYXNzTmFtZVwiKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGRhdGFBdHRyKTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBjYXNlcyB0aGF0IGFyZSBwcm9wZXJ0aWVzIChidXQgaWdub3JlIGNhc2VzIHdoZXJlIHdlIHNob3VsZCB1c2Ugc2V0QXR0cmlidXRlIGluc3RlYWQpXHJcblx0XHRcdFx0XHQvLy0gbGlzdCBhbmQgZm9ybSBhcmUgdHlwaWNhbGx5IHVzZWQgYXMgc3RyaW5ncywgYnV0IGFyZSBET00gZWxlbWVudCByZWZlcmVuY2VzIGluIGpzXHJcblx0XHRcdFx0XHQvLy0gd2hlbiB1c2luZyBDU1Mgc2VsZWN0b3JzIChlLmcuIGBtKFwiW3N0eWxlPScnXVwiKWApLCBzdHlsZSBpcyB1c2VkIGFzIGEgc3RyaW5nLCBidXQgaXQncyBhbiBvYmplY3QgaW4ganNcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lIGluIG5vZGUgJiYgIShhdHRyTmFtZSA9PT0gXCJsaXN0XCIgfHwgYXR0ck5hbWUgPT09IFwic3R5bGVcIiB8fCBhdHRyTmFtZSA9PT0gXCJmb3JtXCIgfHwgYXR0ck5hbWUgPT09IFwidHlwZVwiIHx8IGF0dHJOYW1lID09PSBcIndpZHRoXCIgfHwgYXR0ck5hbWUgPT09IFwiaGVpZ2h0XCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIzM0OCBkb24ndCBzZXQgdGhlIHZhbHVlIGlmIG5vdCBuZWVkZWQgb3RoZXJ3aXNlIGN1cnNvciBwbGFjZW1lbnQgYnJlYWtzIGluIENocm9tZVxyXG5cdFx0XHRcdFx0XHRpZiAodGFnICE9PSBcImlucHV0XCIgfHwgbm9kZVthdHRyTmFtZV0gIT09IGRhdGFBdHRyKSBub2RlW2F0dHJOYW1lXSA9IGRhdGFBdHRyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdC8vc3dhbGxvdyBJRSdzIGludmFsaWQgYXJndW1lbnQgZXJyb3JzIHRvIG1pbWljIEhUTUwncyBmYWxsYmFjay10by1kb2luZy1ub3RoaW5nLW9uLWludmFsaWQtYXR0cmlidXRlcyBiZWhhdmlvclxyXG5cdFx0XHRcdFx0aWYgKGUubWVzc2FnZS5pbmRleE9mKFwiSW52YWxpZCBhcmd1bWVudFwiKSA8IDApIHRocm93IGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8jMzQ4IGRhdGFBdHRyIG1heSBub3QgYmUgYSBzdHJpbmcsIHNvIHVzZSBsb29zZSBjb21wYXJpc29uIChkb3VibGUgZXF1YWwpIGluc3RlYWQgb2Ygc3RyaWN0ICh0cmlwbGUgZXF1YWwpXHJcblx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInZhbHVlXCIgJiYgdGFnID09PSBcImlucHV0XCIgJiYgbm9kZS52YWx1ZSAhPSBkYXRhQXR0cikge1xyXG5cdFx0XHRcdG5vZGUudmFsdWUgPSBkYXRhQXR0clxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2FjaGVkQXR0cnNcclxuXHR9XHJcblx0ZnVuY3Rpb24gY2xlYXIobm9kZXMsIGNhY2hlZCkge1xyXG5cdFx0Zm9yICh2YXIgaSA9IG5vZGVzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XHJcblx0XHRcdGlmIChub2Rlc1tpXSAmJiBub2Rlc1tpXS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdFx0dHJ5IHtub2Rlc1tpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGVzW2ldKX1cclxuXHRcdFx0XHRjYXRjaCAoZSkge30gLy9pZ25vcmUgaWYgdGhpcyBmYWlscyBkdWUgdG8gb3JkZXIgb2YgZXZlbnRzIChzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTkyNjA4My9mYWlsZWQtdG8tZXhlY3V0ZS1yZW1vdmVjaGlsZC1vbi1ub2RlKVxyXG5cdFx0XHRcdGNhY2hlZCA9IFtdLmNvbmNhdChjYWNoZWQpO1xyXG5cdFx0XHRcdGlmIChjYWNoZWRbaV0pIHVubG9hZChjYWNoZWRbaV0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChub2Rlcy5sZW5ndGggIT0gMCkgbm9kZXMubGVuZ3RoID0gMFxyXG5cdH1cclxuXHRmdW5jdGlvbiB1bmxvYWQoY2FjaGVkKSB7XHJcblx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgdHlwZW9mIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpO1xyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNvbnRyb2xsZXI7IGNvbnRyb2xsZXIgPSBjYWNoZWQuY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgY29udHJvbGxlci5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY2hpbGRyZW4pIHtcclxuXHRcdFx0aWYgKHR5cGUuY2FsbChjYWNoZWQuY2hpbGRyZW4pID09PSBBUlJBWSkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjYWNoZWQuY2hpbGRyZW5baV07IGkrKykgdW5sb2FkKGNoaWxkKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC5jaGlsZHJlbi50YWcpIHVubG9hZChjYWNoZWQuY2hpbGRyZW4pXHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpIHtcclxuXHRcdHZhciBuZXh0U2libGluZyA9IHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF07XHJcblx0XHRpZiAobmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0dmFyIGlzRWxlbWVudCA9IG5leHRTaWJsaW5nLm5vZGVUeXBlICE9IDE7XHJcblx0XHRcdHZhciBwbGFjZWhvbGRlciA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHRcdFx0aWYgKGlzRWxlbWVudCkge1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBuZXh0U2libGluZyB8fCBudWxsKTtcclxuXHRcdFx0XHRwbGFjZWhvbGRlci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmViZWdpblwiLCBkYXRhKTtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHBsYWNlaG9sZGVyKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgbmV4dFNpYmxpbmcuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSlcclxuXHRcdH1cclxuXHRcdGVsc2UgcGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgZGF0YSk7XHJcblx0XHR2YXIgbm9kZXMgPSBbXTtcclxuXHRcdHdoaWxlIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdICE9PSBuZXh0U2libGluZykge1xyXG5cdFx0XHRub2Rlcy5wdXNoKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0XHRpbmRleCsrXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbm9kZXNcclxuXHR9XHJcblx0ZnVuY3Rpb24gYXV0b3JlZHJhdyhjYWxsYmFjaywgb2JqZWN0KSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpO1xyXG5cdFx0XHRtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0dHJ5IHtyZXR1cm4gY2FsbGJhY2suY2FsbChvYmplY3QsIGUpfVxyXG5cdFx0XHRmaW5hbGx5IHtcclxuXHRcdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGh0bWw7XHJcblx0dmFyIGRvY3VtZW50Tm9kZSA9IHtcclxuXHRcdGFwcGVuZENoaWxkOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdGlmIChodG1sID09PSB1bmRlZmluZWQpIGh0bWwgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh0bWxcIik7XHJcblx0XHRcdGlmICgkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgIT09IG5vZGUpIHtcclxuXHRcdFx0XHQkZG9jdW1lbnQucmVwbGFjZUNoaWxkKG5vZGUsICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSAkZG9jdW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XHJcblx0XHRcdHRoaXMuY2hpbGROb2RlcyA9ICRkb2N1bWVudC5jaGlsZE5vZGVzXHJcblx0XHR9LFxyXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQobm9kZSlcclxuXHRcdH0sXHJcblx0XHRjaGlsZE5vZGVzOiBbXVxyXG5cdH07XHJcblx0dmFyIG5vZGVDYWNoZSA9IFtdLCBjZWxsQ2FjaGUgPSB7fTtcclxuXHRtLnJlbmRlciA9IGZ1bmN0aW9uKHJvb3QsIGNlbGwsIGZvcmNlUmVjcmVhdGlvbikge1xyXG5cdFx0dmFyIGNvbmZpZ3MgPSBbXTtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpO1xyXG5cdFx0dmFyIGlkID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0dmFyIGlzRG9jdW1lbnRSb290ID0gcm9vdCA9PT0gJGRvY3VtZW50O1xyXG5cdFx0dmFyIG5vZGUgPSBpc0RvY3VtZW50Um9vdCB8fCByb290ID09PSAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnROb2RlIDogcm9vdDtcclxuXHRcdGlmIChpc0RvY3VtZW50Um9vdCAmJiBjZWxsLnRhZyAhPSBcImh0bWxcIikgY2VsbCA9IHt0YWc6IFwiaHRtbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBjZWxsfTtcclxuXHRcdGlmIChjZWxsQ2FjaGVbaWRdID09PSB1bmRlZmluZWQpIGNsZWFyKG5vZGUuY2hpbGROb2Rlcyk7XHJcblx0XHRpZiAoZm9yY2VSZWNyZWF0aW9uID09PSB0cnVlKSByZXNldChyb290KTtcclxuXHRcdGNlbGxDYWNoZVtpZF0gPSBidWlsZChub2RlLCBudWxsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY2VsbCwgY2VsbENhY2hlW2lkXSwgZmFsc2UsIDAsIG51bGwsIHVuZGVmaW5lZCwgY29uZmlncyk7XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gY29uZmlncy5sZW5ndGg7IGkgPCBsZW47IGkrKykgY29uZmlnc1tpXSgpXHJcblx0fTtcclxuXHRmdW5jdGlvbiBnZXRDZWxsQ2FjaGVLZXkoZWxlbWVudCkge1xyXG5cdFx0dmFyIGluZGV4ID0gbm9kZUNhY2hlLmluZGV4T2YoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gaW5kZXggPCAwID8gbm9kZUNhY2hlLnB1c2goZWxlbWVudCkgLSAxIDogaW5kZXhcclxuXHR9XHJcblxyXG5cdG0udHJ1c3QgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUgPSBuZXcgU3RyaW5nKHZhbHVlKTtcclxuXHRcdHZhbHVlLiR0cnVzdGVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldHRlcnNldHRlcihzdG9yZSkge1xyXG5cdFx0dmFyIHByb3AgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHN0b3JlID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHRyZXR1cm4gc3RvcmVcclxuXHRcdH07XHJcblxyXG5cdFx0cHJvcC50b0pTT04gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHN0b3JlXHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cclxuXHRtLnByb3AgPSBmdW5jdGlvbiAoc3RvcmUpIHtcclxuXHRcdC8vbm90ZTogdXNpbmcgbm9uLXN0cmljdCBlcXVhbGl0eSBjaGVjayBoZXJlIGJlY2F1c2Ugd2UncmUgY2hlY2tpbmcgaWYgc3RvcmUgaXMgbnVsbCBPUiB1bmRlZmluZWRcclxuXHRcdGlmICgoKHN0b3JlICE9IG51bGwgJiYgdHlwZS5jYWxsKHN0b3JlKSA9PT0gT0JKRUNUKSB8fCB0eXBlb2Ygc3RvcmUgPT09IEZVTkNUSU9OKSAmJiB0eXBlb2Ygc3RvcmUudGhlbiA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkoc3RvcmUpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGdldHRlcnNldHRlcihzdG9yZSlcclxuXHR9O1xyXG5cclxuXHR2YXIgcm9vdHMgPSBbXSwgY29tcG9uZW50cyA9IFtdLCBjb250cm9sbGVycyA9IFtdLCBsYXN0UmVkcmF3SWQgPSBudWxsLCBsYXN0UmVkcmF3Q2FsbFRpbWUgPSAwLCBjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGwsIGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGwsIHByZXZlbnRlZCA9IGZhbHNlLCB0b3BDb21wb25lbnQsIHVubG9hZGVycyA9IFtdO1xyXG5cdHZhciBGUkFNRV9CVURHRVQgPSAxNjsgLy82MCBmcmFtZXMgcGVyIHNlY29uZCA9IDEgY2FsbCBwZXIgMTYgbXNcclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemUoY29tcG9uZW50LCBhcmdzKSB7XHJcblx0XHR2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gKGNvbXBvbmVudC5jb250cm9sbGVyIHx8IG5vb3ApLmFwcGx5KHRoaXMsIGFyZ3MpIHx8IHRoaXNcclxuXHRcdH1cclxuXHRcdHZhciB2aWV3ID0gZnVuY3Rpb24oY3RybCkge1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIGFyZ3MgPSBhcmdzLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXHJcblx0XHRcdHJldHVybiBjb21wb25lbnQudmlldy5hcHBseShjb21wb25lbnQsIGFyZ3MgPyBbY3RybF0uY29uY2F0KGFyZ3MpIDogW2N0cmxdKVxyXG5cdFx0fVxyXG5cdFx0dmlldy4kb3JpZ2luYWwgPSBjb21wb25lbnQudmlld1xyXG5cdFx0dmFyIG91dHB1dCA9IHtjb250cm9sbGVyOiBjb250cm9sbGVyLCB2aWV3OiB2aWV3fVxyXG5cdFx0aWYgKGFyZ3NbMF0gJiYgYXJnc1swXS5rZXkgIT0gbnVsbCkgb3V0cHV0LmF0dHJzID0ge2tleTogYXJnc1swXS5rZXl9XHJcblx0XHRyZXR1cm4gb3V0cHV0XHJcblx0fVxyXG5cdG0uY29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50KSB7XHJcblx0XHRyZXR1cm4gcGFyYW1ldGVyaXplKGNvbXBvbmVudCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKVxyXG5cdH1cclxuXHRtLm1vdW50ID0gbS5tb2R1bGUgPSBmdW5jdGlvbihyb290LCBjb21wb25lbnQpIHtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIGVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgZXhpc3RzIGJlZm9yZSByZW5kZXJpbmcgYSB0ZW1wbGF0ZSBpbnRvIGl0LlwiKTtcclxuXHRcdHZhciBpbmRleCA9IHJvb3RzLmluZGV4T2Yocm9vdCk7XHJcblx0XHRpZiAoaW5kZXggPCAwKSBpbmRleCA9IHJvb3RzLmxlbmd0aDtcclxuXHRcdFxyXG5cdFx0dmFyIGlzUHJldmVudGVkID0gZmFsc2U7XHJcblx0XHR2YXIgZXZlbnQgPSB7cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpc1ByZXZlbnRlZCA9IHRydWU7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbDtcclxuXHRcdH19O1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHVubG9hZGVyOyB1bmxvYWRlciA9IHVubG9hZGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdHVubG9hZGVyLmhhbmRsZXIuY2FsbCh1bmxvYWRlci5jb250cm9sbGVyLCBldmVudClcclxuXHRcdFx0dW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChpc1ByZXZlbnRlZCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgdW5sb2FkZXI7IHVubG9hZGVyID0gdW5sb2FkZXJzW2ldOyBpKyspIHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSB1bmxvYWRlci5oYW5kbGVyXHJcblx0XHR9XHJcblx0XHRlbHNlIHVubG9hZGVycyA9IFtdXHJcblx0XHRcclxuXHRcdGlmIChjb250cm9sbGVyc1tpbmRleF0gJiYgdHlwZW9mIGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkKGV2ZW50KVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAoIWlzUHJldmVudGVkKSB7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiYWxsXCIpO1xyXG5cdFx0XHRtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0cm9vdHNbaW5kZXhdID0gcm9vdDtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSBjb21wb25lbnQgPSBzdWJjb21wb25lbnQoY29tcG9uZW50LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpXHJcblx0XHRcdHZhciBjdXJyZW50Q29tcG9uZW50ID0gdG9wQ29tcG9uZW50ID0gY29tcG9uZW50ID0gY29tcG9uZW50IHx8IHtjb250cm9sbGVyOiBmdW5jdGlvbigpIHt9fTtcclxuXHRcdFx0dmFyIGNvbnN0cnVjdG9yID0gY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcFxyXG5cdFx0XHR2YXIgY29udHJvbGxlciA9IG5ldyBjb25zdHJ1Y3RvcjtcclxuXHRcdFx0Ly9jb250cm9sbGVycyBtYXkgY2FsbCBtLm1vdW50IHJlY3Vyc2l2ZWx5ICh2aWEgbS5yb3V0ZSByZWRpcmVjdHMsIGZvciBleGFtcGxlKVxyXG5cdFx0XHQvL3RoaXMgY29uZGl0aW9uYWwgZW5zdXJlcyBvbmx5IHRoZSBsYXN0IHJlY3Vyc2l2ZSBtLm1vdW50IGNhbGwgaXMgYXBwbGllZFxyXG5cdFx0XHRpZiAoY3VycmVudENvbXBvbmVudCA9PT0gdG9wQ29tcG9uZW50KSB7XHJcblx0XHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdID0gY29udHJvbGxlcjtcclxuXHRcdFx0XHRjb21wb25lbnRzW2luZGV4XSA9IGNvbXBvbmVudFxyXG5cdFx0XHR9XHJcblx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0cmV0dXJuIGNvbnRyb2xsZXJzW2luZGV4XVxyXG5cdFx0fVxyXG5cdH07XHJcblx0dmFyIHJlZHJhd2luZyA9IGZhbHNlXHJcblx0bS5yZWRyYXcgPSBmdW5jdGlvbihmb3JjZSkge1xyXG5cdFx0aWYgKHJlZHJhd2luZykgcmV0dXJuXHJcblx0XHRyZWRyYXdpbmcgPSB0cnVlXHJcblx0XHQvL2xhc3RSZWRyYXdJZCBpcyBhIHBvc2l0aXZlIG51bWJlciBpZiBhIHNlY29uZCByZWRyYXcgaXMgcmVxdWVzdGVkIGJlZm9yZSB0aGUgbmV4dCBhbmltYXRpb24gZnJhbWVcclxuXHRcdC8vbGFzdFJlZHJhd0lEIGlzIG51bGwgaWYgaXQncyB0aGUgZmlyc3QgcmVkcmF3IGFuZCBub3QgYW4gZXZlbnQgaGFuZGxlclxyXG5cdFx0aWYgKGxhc3RSZWRyYXdJZCAmJiBmb3JjZSAhPT0gdHJ1ZSkge1xyXG5cdFx0XHQvL3doZW4gc2V0VGltZW91dDogb25seSByZXNjaGVkdWxlIHJlZHJhdyBpZiB0aW1lIGJldHdlZW4gbm93IGFuZCBwcmV2aW91cyByZWRyYXcgaXMgYmlnZ2VyIHRoYW4gYSBmcmFtZSwgb3RoZXJ3aXNlIGtlZXAgY3VycmVudGx5IHNjaGVkdWxlZCB0aW1lb3V0XHJcblx0XHRcdC8vd2hlbiByQUY6IGFsd2F5cyByZXNjaGVkdWxlIHJlZHJhd1xyXG5cdFx0XHRpZiAoJHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBuZXcgRGF0ZSAtIGxhc3RSZWRyYXdDYWxsVGltZSA+IEZSQU1FX0JVREdFVCkge1xyXG5cdFx0XHRcdGlmIChsYXN0UmVkcmF3SWQgPiAwKSAkY2FuY2VsQW5pbWF0aW9uRnJhbWUobGFzdFJlZHJhd0lkKTtcclxuXHRcdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhdywgRlJBTUVfQlVER0VUKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmVkcmF3KCk7XHJcblx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7bGFzdFJlZHJhd0lkID0gbnVsbH0sIEZSQU1FX0JVREdFVClcclxuXHRcdH1cclxuXHRcdHJlZHJhd2luZyA9IGZhbHNlXHJcblx0fTtcclxuXHRtLnJlZHJhdy5zdHJhdGVneSA9IG0ucHJvcCgpO1xyXG5cdGZ1bmN0aW9uIHJlZHJhdygpIHtcclxuXHRcdGlmIChjb21wdXRlUHJlUmVkcmF3SG9vaykge1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vaygpXHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHJvb3Q7IHJvb3QgPSByb290c1tpXTsgaSsrKSB7XHJcblx0XHRcdGlmIChjb250cm9sbGVyc1tpXSkge1xyXG5cdFx0XHRcdHZhciBhcmdzID0gY29tcG9uZW50c1tpXS5jb250cm9sbGVyICYmIGNvbXBvbmVudHNbaV0uY29udHJvbGxlci4kJGFyZ3MgPyBbY29udHJvbGxlcnNbaV1dLmNvbmNhdChjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIuJCRhcmdzKSA6IFtjb250cm9sbGVyc1tpXV1cclxuXHRcdFx0XHRtLnJlbmRlcihyb290LCBjb21wb25lbnRzW2ldLnZpZXcgPyBjb21wb25lbnRzW2ldLnZpZXcoY29udHJvbGxlcnNbaV0sIGFyZ3MpIDogXCJcIilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9hZnRlciByZW5kZXJpbmcgd2l0aGluIGEgcm91dGVkIGNvbnRleHQsIHdlIG5lZWQgdG8gc2Nyb2xsIGJhY2sgdG8gdGhlIHRvcCwgYW5kIGZldGNoIHRoZSBkb2N1bWVudCB0aXRsZSBmb3IgaGlzdG9yeS5wdXNoU3RhdGVcclxuXHRcdGlmIChjb21wdXRlUG9zdFJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rKCk7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGxcclxuXHRcdH1cclxuXHRcdGxhc3RSZWRyYXdJZCA9IG51bGw7XHJcblx0XHRsYXN0UmVkcmF3Q2FsbFRpbWUgPSBuZXcgRGF0ZTtcclxuXHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdH1cclxuXHJcblx0dmFyIHBlbmRpbmdSZXF1ZXN0cyA9IDA7XHJcblx0bS5zdGFydENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7cGVuZGluZ1JlcXVlc3RzKyt9O1xyXG5cdG0uZW5kQ29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdHBlbmRpbmdSZXF1ZXN0cyA9IE1hdGgubWF4KHBlbmRpbmdSZXF1ZXN0cyAtIDEsIDApO1xyXG5cdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyA9PT0gMCkgbS5yZWRyYXcoKVxyXG5cdH07XHJcblx0dmFyIGVuZEZpcnN0Q29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwibm9uZVwiKSB7XHJcblx0XHRcdHBlbmRpbmdSZXF1ZXN0cy0tXHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBtLmVuZENvbXB1dGF0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRtLndpdGhBdHRyID0gZnVuY3Rpb24ocHJvcCwgd2l0aEF0dHJDYWxsYmFjaykge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IHRoaXM7XHJcblx0XHRcdHdpdGhBdHRyQ2FsbGJhY2socHJvcCBpbiBjdXJyZW50VGFyZ2V0ID8gY3VycmVudFRhcmdldFtwcm9wXSA6IGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApKVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vcm91dGluZ1xyXG5cdHZhciBtb2RlcyA9IHtwYXRobmFtZTogXCJcIiwgaGFzaDogXCIjXCIsIHNlYXJjaDogXCI/XCJ9O1xyXG5cdHZhciByZWRpcmVjdCA9IG5vb3AsIHJvdXRlUGFyYW1zLCBjdXJyZW50Um91dGUsIGlzRGVmYXVsdFJvdXRlID0gZmFsc2U7XHJcblx0bS5yb3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly9tLnJvdXRlKClcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY3VycmVudFJvdXRlO1xyXG5cdFx0Ly9tLnJvdXRlKGVsLCBkZWZhdWx0Um91dGUsIHJvdXRlcylcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgdHlwZS5jYWxsKGFyZ3VtZW50c1sxXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgcm9vdCA9IGFyZ3VtZW50c1swXSwgZGVmYXVsdFJvdXRlID0gYXJndW1lbnRzWzFdLCByb3V0ZXIgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHJlZGlyZWN0ID0gZnVuY3Rpb24oc291cmNlKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBjdXJyZW50Um91dGUgPSBub3JtYWxpemVSb3V0ZShzb3VyY2UpO1xyXG5cdFx0XHRcdGlmICghcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkpIHtcclxuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHRSb3V0ZSkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBkZWZhdWx0IHJvdXRlIG1hdGNoZXMgb25lIG9mIHRoZSByb3V0ZXMgZGVmaW5lZCBpbiBtLnJvdXRlXCIpXHJcblx0XHRcdFx0XHRpc0RlZmF1bHRSb3V0ZSA9IHRydWVcclxuXHRcdFx0XHRcdG0ucm91dGUoZGVmYXVsdFJvdXRlLCB0cnVlKVxyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGxpc3RlbmVyID0gbS5yb3V0ZS5tb2RlID09PSBcImhhc2hcIiA/IFwib25oYXNoY2hhbmdlXCIgOiBcIm9ucG9wc3RhdGVcIjtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gJGxvY2F0aW9uW20ucm91dGUubW9kZV1cclxuXHRcdFx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIpIHBhdGggKz0gJGxvY2F0aW9uLnNlYXJjaFxyXG5cdFx0XHRcdGlmIChjdXJyZW50Um91dGUgIT0gbm9ybWFsaXplUm91dGUocGF0aCkpIHtcclxuXHRcdFx0XHRcdHJlZGlyZWN0KHBhdGgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbDtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSgpXHJcblx0XHR9XHJcblx0XHQvL2NvbmZpZzogbS5yb3V0ZVxyXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzWzBdLmFkZEV2ZW50TGlzdGVuZXIgfHwgYXJndW1lbnRzWzBdLmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgaXNJbml0aWFsaXplZCA9IGFyZ3VtZW50c1sxXTtcclxuXHRcdFx0dmFyIGNvbnRleHQgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHZhciB2ZG9tID0gYXJndW1lbnRzWzNdO1xyXG5cdFx0XHRlbGVtZW50LmhyZWYgPSAobS5yb3V0ZS5tb2RlICE9PSAncGF0aG5hbWUnID8gJGxvY2F0aW9uLnBhdGhuYW1lIDogJycpICsgbW9kZXNbbS5yb3V0ZS5tb2RlXSArIHZkb20uYXR0cnMuaHJlZjtcclxuXHRcdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpO1xyXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZWxlbWVudC5kZXRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9tLnJvdXRlKHJvdXRlLCBwYXJhbXMsIHNob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkpXHJcblx0XHRlbHNlIGlmICh0eXBlLmNhbGwoYXJndW1lbnRzWzBdKSA9PT0gU1RSSU5HKSB7XHJcblx0XHRcdHZhciBvbGRSb3V0ZSA9IGN1cnJlbnRSb3V0ZTtcclxuXHRcdFx0Y3VycmVudFJvdXRlID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50c1sxXSB8fCB7fVxyXG5cdFx0XHR2YXIgcXVlcnlJbmRleCA9IGN1cnJlbnRSb3V0ZS5pbmRleE9mKFwiP1wiKVxyXG5cdFx0XHR2YXIgcGFyYW1zID0gcXVlcnlJbmRleCA+IC0xID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50Um91dGUuc2xpY2UocXVlcnlJbmRleCArIDEpKSA6IHt9XHJcblx0XHRcdGZvciAodmFyIGkgaW4gYXJncykgcGFyYW1zW2ldID0gYXJnc1tpXVxyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKHBhcmFtcylcclxuXHRcdFx0dmFyIGN1cnJlbnRQYXRoID0gcXVlcnlJbmRleCA+IC0xID8gY3VycmVudFJvdXRlLnNsaWNlKDAsIHF1ZXJ5SW5kZXgpIDogY3VycmVudFJvdXRlXHJcblx0XHRcdGlmIChxdWVyeXN0cmluZykgY3VycmVudFJvdXRlID0gY3VycmVudFBhdGggKyAoY3VycmVudFBhdGguaW5kZXhPZihcIj9cIikgPT09IC0xID8gXCI/XCIgOiBcIiZcIikgKyBxdWVyeXN0cmluZztcclxuXHJcblx0XHRcdHZhciBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5ID0gKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgPyBhcmd1bWVudHNbMl0gOiBhcmd1bWVudHNbMV0pID09PSB0cnVlIHx8IG9sZFJvdXRlID09PSBhcmd1bWVudHNbMF07XHJcblxyXG5cdFx0XHRpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XHJcblx0XHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGxcclxuXHRcdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5W3Nob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIl0obnVsbCwgJGRvY3VtZW50LnRpdGxlLCBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJlZGlyZWN0KG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0JGxvY2F0aW9uW20ucm91dGUubW9kZV0gPSBjdXJyZW50Um91dGVcclxuXHRcdFx0XHRyZWRpcmVjdChtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRtLnJvdXRlLnBhcmFtID0gZnVuY3Rpb24oa2V5KSB7XHJcblx0XHRpZiAoIXJvdXRlUGFyYW1zKSB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBjYWxsIG0ucm91dGUoZWxlbWVudCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpIGJlZm9yZSBjYWxsaW5nIG0ucm91dGUucGFyYW0oKVwiKVxyXG5cdFx0cmV0dXJuIHJvdXRlUGFyYW1zW2tleV1cclxuXHR9O1xyXG5cdG0ucm91dGUubW9kZSA9IFwic2VhcmNoXCI7XHJcblx0ZnVuY3Rpb24gbm9ybWFsaXplUm91dGUocm91dGUpIHtcclxuXHRcdHJldHVybiByb3V0ZS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aClcclxuXHR9XHJcblx0ZnVuY3Rpb24gcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkge1xyXG5cdFx0cm91dGVQYXJhbXMgPSB7fTtcclxuXHJcblx0XHR2YXIgcXVlcnlTdGFydCA9IHBhdGguaW5kZXhPZihcIj9cIik7XHJcblx0XHRpZiAocXVlcnlTdGFydCAhPT0gLTEpIHtcclxuXHRcdFx0cm91dGVQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc3Vic3RyKHF1ZXJ5U3RhcnQgKyAxLCBwYXRoLmxlbmd0aCkpO1xyXG5cdFx0XHRwYXRoID0gcGF0aC5zdWJzdHIoMCwgcXVlcnlTdGFydClcclxuXHRcdH1cclxuXHJcblx0XHQvLyBHZXQgYWxsIHJvdXRlcyBhbmQgY2hlY2sgaWYgdGhlcmUnc1xyXG5cdFx0Ly8gYW4gZXhhY3QgbWF0Y2ggZm9yIHRoZSBjdXJyZW50IHBhdGhcclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMocm91dGVyKTtcclxuXHRcdHZhciBpbmRleCA9IGtleXMuaW5kZXhPZihwYXRoKTtcclxuXHRcdGlmKGluZGV4ICE9PSAtMSl7XHJcblx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW2tleXMgW2luZGV4XV0pO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciByb3V0ZSBpbiByb3V0ZXIpIHtcclxuXHRcdFx0aWYgKHJvdXRlID09PSBwYXRoKSB7XHJcblx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJeXCIgKyByb3V0ZS5yZXBsYWNlKC86W15cXC9dKz9cXC57M30vZywgXCIoLio/KVwiKS5yZXBsYWNlKC86W15cXC9dKy9nLCBcIihbXlxcXFwvXSspXCIpICsgXCJcXC8/JFwiKTtcclxuXHJcblx0XHRcdGlmIChtYXRjaGVyLnRlc3QocGF0aCkpIHtcclxuXHRcdFx0XHRwYXRoLnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIga2V5cyA9IHJvdXRlLm1hdGNoKC86W15cXC9dKy9nKSB8fCBbXTtcclxuXHRcdFx0XHRcdHZhciB2YWx1ZXMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSwgLTIpO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHJvdXRlUGFyYW1zW2tleXNbaV0ucmVwbGFjZSgvOnxcXC4vZywgXCJcIildID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpXSlcclxuXHRcdFx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW3JvdXRlXSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJvdXRlVW5vYnRydXNpdmUoZSkge1xyXG5cdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm47XHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XHJcblx0XHR2YXIgYXJncyA9IG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiICYmIGN1cnJlbnRUYXJnZXQuc2VhcmNoID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50VGFyZ2V0LnNlYXJjaC5zbGljZSgxKSkgOiB7fTtcclxuXHRcdHdoaWxlIChjdXJyZW50VGFyZ2V0ICYmIGN1cnJlbnRUYXJnZXQubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPSBcIkFcIikgY3VycmVudFRhcmdldCA9IGN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZVxyXG5cdFx0bS5yb3V0ZShjdXJyZW50VGFyZ2V0W20ucm91dGUubW9kZV0uc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpLCBhcmdzKVxyXG5cdH1cclxuXHRmdW5jdGlvbiBzZXRTY3JvbGwoKSB7XHJcblx0XHRpZiAobS5yb3V0ZS5tb2RlICE9IFwiaGFzaFwiICYmICRsb2NhdGlvbi5oYXNoKSAkbG9jYXRpb24uaGFzaCA9ICRsb2NhdGlvbi5oYXNoO1xyXG5cdFx0ZWxzZSB3aW5kb3cuc2Nyb2xsVG8oMCwgMClcclxuXHR9XHJcblx0ZnVuY3Rpb24gYnVpbGRRdWVyeVN0cmluZyhvYmplY3QsIHByZWZpeCkge1xyXG5cdFx0dmFyIGR1cGxpY2F0ZXMgPSB7fVxyXG5cdFx0dmFyIHN0ciA9IFtdXHJcblx0XHRmb3IgKHZhciBwcm9wIGluIG9iamVjdCkge1xyXG5cdFx0XHR2YXIga2V5ID0gcHJlZml4ID8gcHJlZml4ICsgXCJbXCIgKyBwcm9wICsgXCJdXCIgOiBwcm9wXHJcblx0XHRcdHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wXVxyXG5cdFx0XHR2YXIgdmFsdWVUeXBlID0gdHlwZS5jYWxsKHZhbHVlKVxyXG5cdFx0XHR2YXIgcGFpciA9ICh2YWx1ZSA9PT0gbnVsbCkgPyBlbmNvZGVVUklDb21wb25lbnQoa2V5KSA6XHJcblx0XHRcdFx0dmFsdWVUeXBlID09PSBPQkpFQ1QgPyBidWlsZFF1ZXJ5U3RyaW5nKHZhbHVlLCBrZXkpIDpcclxuXHRcdFx0XHR2YWx1ZVR5cGUgPT09IEFSUkFZID8gdmFsdWUucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIGl0ZW0pIHtcclxuXHRcdFx0XHRcdGlmICghZHVwbGljYXRlc1trZXldKSBkdXBsaWNhdGVzW2tleV0gPSB7fVxyXG5cdFx0XHRcdFx0aWYgKCFkdXBsaWNhdGVzW2tleV1baXRlbV0pIHtcclxuXHRcdFx0XHRcdFx0ZHVwbGljYXRlc1trZXldW2l0ZW1dID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbWVtby5jb25jYXQoZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChpdGVtKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBtZW1vXHJcblx0XHRcdFx0fSwgW10pLmpvaW4oXCImXCIpIDpcclxuXHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKVxyXG5cdFx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkgc3RyLnB1c2gocGFpcilcclxuXHRcdH1cclxuXHRcdHJldHVybiBzdHIuam9pbihcIiZcIilcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhzdHIpIHtcclxuXHRcdGlmIChzdHIuY2hhckF0KDApID09PSBcIj9cIikgc3RyID0gc3RyLnN1YnN0cmluZygxKTtcclxuXHRcdFxyXG5cdFx0dmFyIHBhaXJzID0gc3RyLnNwbGl0KFwiJlwiKSwgcGFyYW1zID0ge307XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0dmFyIHBhaXIgPSBwYWlyc1tpXS5zcGxpdChcIj1cIik7XHJcblx0XHRcdHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFpclswXSlcclxuXHRcdFx0dmFyIHZhbHVlID0gcGFpci5sZW5ndGggPT0gMiA/IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdKSA6IG51bGxcclxuXHRcdFx0aWYgKHBhcmFtc1trZXldICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAodHlwZS5jYWxsKHBhcmFtc1trZXldKSAhPT0gQVJSQVkpIHBhcmFtc1trZXldID0gW3BhcmFtc1trZXldXVxyXG5cdFx0XHRcdHBhcmFtc1trZXldLnB1c2godmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBwYXJhbXNba2V5XSA9IHZhbHVlXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGFyYW1zXHJcblx0fVxyXG5cdG0ucm91dGUuYnVpbGRRdWVyeVN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmdcclxuXHRtLnJvdXRlLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nXHJcblx0XHJcblx0ZnVuY3Rpb24gcmVzZXQocm9vdCkge1xyXG5cdFx0dmFyIGNhY2hlS2V5ID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0Y2xlYXIocm9vdC5jaGlsZE5vZGVzLCBjZWxsQ2FjaGVbY2FjaGVLZXldKTtcclxuXHRcdGNlbGxDYWNoZVtjYWNoZUtleV0gPSB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdG0uZGVmZXJyZWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkXHJcblx0fTtcclxuXHRmdW5jdGlvbiBwcm9waWZ5KHByb21pc2UsIGluaXRpYWxWYWx1ZSkge1xyXG5cdFx0dmFyIHByb3AgPSBtLnByb3AoaW5pdGlhbFZhbHVlKTtcclxuXHRcdHByb21pc2UudGhlbihwcm9wKTtcclxuXHRcdHByb3AudGhlbiA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KSwgaW5pdGlhbFZhbHVlKVxyXG5cdFx0fTtcclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cdC8vUHJvbWl6Lm1pdGhyaWwuanMgfCBab2xtZWlzdGVyIHwgTUlUXHJcblx0Ly9hIG1vZGlmaWVkIHZlcnNpb24gb2YgUHJvbWl6LmpzLCB3aGljaCBkb2VzIG5vdCBjb25mb3JtIHRvIFByb21pc2VzL0ErIGZvciB0d28gcmVhc29uczpcclxuXHQvLzEpIGB0aGVuYCBjYWxsYmFja3MgYXJlIGNhbGxlZCBzeW5jaHJvbm91c2x5IChiZWNhdXNlIHNldFRpbWVvdXQgaXMgdG9vIHNsb3csIGFuZCB0aGUgc2V0SW1tZWRpYXRlIHBvbHlmaWxsIGlzIHRvbyBiaWdcclxuXHQvLzIpIHRocm93aW5nIHN1YmNsYXNzZXMgb2YgRXJyb3IgY2F1c2UgdGhlIGVycm9yIHRvIGJlIGJ1YmJsZWQgdXAgaW5zdGVhZCBvZiB0cmlnZ2VyaW5nIHJlamVjdGlvbiAoYmVjYXVzZSB0aGUgc3BlYyBkb2VzIG5vdCBhY2NvdW50IGZvciB0aGUgaW1wb3J0YW50IHVzZSBjYXNlIG9mIGRlZmF1bHQgYnJvd3NlciBlcnJvciBoYW5kbGluZywgaS5lLiBtZXNzYWdlIHcvIGxpbmUgbnVtYmVyKVxyXG5cdGZ1bmN0aW9uIERlZmVycmVkKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKSB7XHJcblx0XHR2YXIgUkVTT0xWSU5HID0gMSwgUkVKRUNUSU5HID0gMiwgUkVTT0xWRUQgPSAzLCBSRUpFQ1RFRCA9IDQ7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsIHN0YXRlID0gMCwgcHJvbWlzZVZhbHVlID0gMCwgbmV4dCA9IFtdO1xyXG5cclxuXHRcdHNlbGZbXCJwcm9taXNlXCJdID0ge307XHJcblxyXG5cdFx0c2VsZltcInJlc29sdmVcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGZbXCJyZWplY3RcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYucHJvbWlzZVtcInRoZW5cIl0gPSBmdW5jdGlvbihzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spO1xyXG5cdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRuZXh0LnB1c2goZGVmZXJyZWQpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmluaXNoKHR5cGUpIHtcclxuXHRcdFx0c3RhdGUgPSB0eXBlIHx8IFJFSkVDVEVEO1xyXG5cdFx0XHRuZXh0Lm1hcChmdW5jdGlvbihkZWZlcnJlZCkge1xyXG5cdFx0XHRcdHN0YXRlID09PSBSRVNPTFZFRCAmJiBkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSkgfHwgZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB0aGVubmFibGUodGhlbiwgc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2ssIG5vdFRoZW5uYWJsZUNhbGxiYWNrKSB7XHJcblx0XHRcdGlmICgoKHByb21pc2VWYWx1ZSAhPSBudWxsICYmIHR5cGUuY2FsbChwcm9taXNlVmFsdWUpID09PSBPQkpFQ1QpIHx8IHR5cGVvZiBwcm9taXNlVmFsdWUgPT09IEZVTkNUSU9OKSAmJiB0eXBlb2YgdGhlbiA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly8gY291bnQgcHJvdGVjdHMgYWdhaW5zdCBhYnVzZSBjYWxscyBmcm9tIHNwZWMgY2hlY2tlclxyXG5cdFx0XHRcdFx0dmFyIGNvdW50ID0gMDtcclxuXHRcdFx0XHRcdHRoZW4uY2FsbChwcm9taXNlVmFsdWUsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRzdWNjZXNzQ2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRub3RUaGVubmFibGVDYWxsYmFjaygpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaXJlKCkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgdGhlbmFibGVcclxuXHRcdFx0dmFyIHRoZW47XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dGhlbiA9IHByb21pc2VWYWx1ZSAmJiBwcm9taXNlVmFsdWUudGhlblxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0cmV0dXJuIGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVklORyAmJiB0eXBlb2Ygc3VjY2Vzc0NhbGxiYWNrID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBzdWNjZXNzQ2FsbGJhY2socHJvbWlzZVZhbHVlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVElORyAmJiB0eXBlb2YgZmFpbHVyZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZmFpbHVyZUNhbGxiYWNrKHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZpbmlzaCgpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocHJvbWlzZVZhbHVlID09PSBzZWxmKSB7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBUeXBlRXJyb3IoKTtcclxuXHRcdFx0XHRcdGZpbmlzaCgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhlbm5hYmxlKHRoZW4sIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0ZmluaXNoKFJFU09MVkVEKVxyXG5cdFx0XHRcdFx0fSwgZmluaXNoLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIFJFU09MVkVEKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cdG0uZGVmZXJyZWQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmICh0eXBlLmNhbGwoZSkgPT09IFwiW29iamVjdCBFcnJvcl1cIiAmJiAhZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC8gRXJyb3IvKSkgdGhyb3cgZVxyXG5cdH07XHJcblxyXG5cdG0uc3luYyA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuXHRcdHZhciBtZXRob2QgPSBcInJlc29sdmVcIjtcclxuXHRcdGZ1bmN0aW9uIHN5bmNocm9uaXplcihwb3MsIHJlc29sdmVkKSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdHJlc3VsdHNbcG9zXSA9IHZhbHVlO1xyXG5cdFx0XHRcdGlmICghcmVzb2x2ZWQpIG1ldGhvZCA9IFwicmVqZWN0XCI7XHJcblx0XHRcdFx0aWYgKC0tb3V0c3RhbmRpbmcgPT09IDApIHtcclxuXHRcdFx0XHRcdGRlZmVycmVkLnByb21pc2UocmVzdWx0cyk7XHJcblx0XHRcdFx0XHRkZWZlcnJlZFttZXRob2RdKHJlc3VsdHMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGRlZmVycmVkID0gbS5kZWZlcnJlZCgpO1xyXG5cdFx0dmFyIG91dHN0YW5kaW5nID0gYXJncy5sZW5ndGg7XHJcblx0XHR2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShvdXRzdGFuZGluZyk7XHJcblx0XHRpZiAoYXJncy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGFyZ3NbaV0udGhlbihzeW5jaHJvbml6ZXIoaSwgdHJ1ZSksIHN5bmNocm9uaXplcihpLCBmYWxzZSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShbXSk7XHJcblxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7cmV0dXJuIHZhbHVlfVxyXG5cclxuXHRmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcclxuXHRcdGlmIChvcHRpb25zLmRhdGFUeXBlICYmIG9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBjYWxsYmFja0tleSA9IFwibWl0aHJpbF9jYWxsYmFja19cIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgXCJfXCIgKyAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxNikpLnRvU3RyaW5nKDM2KTtcclxuXHRcdFx0dmFyIHNjcmlwdCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cclxuXHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IGZ1bmN0aW9uKHJlc3ApIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cdFx0XHRcdG9wdGlvbnMub25sb2FkKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwibG9hZFwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogcmVzcFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWRcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMub25lcnJvcih7XHJcblx0XHRcdFx0XHR0eXBlOiBcImVycm9yXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0c3RhdHVzOiA1MDAsXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe2Vycm9yOiBcIkVycm9yIG1ha2luZyBqc29ucCByZXF1ZXN0XCJ9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybFxyXG5cdFx0XHRcdCsgKG9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpID4gMCA/IFwiJlwiIDogXCI/XCIpXHJcblx0XHRcdFx0KyAob3B0aW9ucy5jYWxsYmFja0tleSA/IG9wdGlvbnMuY2FsbGJhY2tLZXkgOiBcImNhbGxiYWNrXCIpXHJcblx0XHRcdFx0KyBcIj1cIiArIGNhbGxiYWNrS2V5XHJcblx0XHRcdFx0KyBcIiZcIiArIGJ1aWxkUXVlcnlTdHJpbmcob3B0aW9ucy5kYXRhIHx8IHt9KTtcclxuXHRcdFx0JGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xyXG5cdFx0XHR4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUsIG9wdGlvbnMudXNlciwgb3B0aW9ucy5wYXNzd29yZCk7XHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRcdGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSBvcHRpb25zLm9ubG9hZCh7dHlwZTogXCJsb2FkXCIsIHRhcmdldDogeGhyfSk7XHJcblx0XHRcdFx0XHRlbHNlIG9wdGlvbnMub25lcnJvcih7dHlwZTogXCJlcnJvclwiLCB0YXJnZXQ6IHhocn0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLm1ldGhvZCAhPT0gXCJHRVRcIikge1xyXG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zLmRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmNvbmZpZyA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR2YXIgbWF5YmVYaHIgPSBvcHRpb25zLmNvbmZpZyh4aHIsIG9wdGlvbnMpO1xyXG5cdFx0XHRcdGlmIChtYXliZVhociAhPSBudWxsKSB4aHIgPSBtYXliZVhoclxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgZGF0YSA9IG9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiIHx8ICFvcHRpb25zLmRhdGEgPyBcIlwiIDogb3B0aW9ucy5kYXRhXHJcblx0XHRcdGlmIChkYXRhICYmICh0eXBlLmNhbGwoZGF0YSkgIT0gU1RSSU5HICYmIGRhdGEuY29uc3RydWN0b3IgIT0gd2luZG93LkZvcm1EYXRhKSkge1xyXG5cdFx0XHRcdHRocm93IFwiUmVxdWVzdCBkYXRhIHNob3VsZCBiZSBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgRm9ybURhdGEuIENoZWNrIHRoZSBgc2VyaWFsaXplYCBvcHRpb24gaW4gYG0ucmVxdWVzdGBcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcclxuXHRcdFx0cmV0dXJuIHhoclxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBiaW5kRGF0YSh4aHJPcHRpb25zLCBkYXRhLCBzZXJpYWxpemUpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLm1ldGhvZCA9PT0gXCJHRVRcIiAmJiB4aHJPcHRpb25zLmRhdGFUeXBlICE9IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgcHJlZml4ID0geGhyT3B0aW9ucy51cmwuaW5kZXhPZihcIj9cIikgPCAwID8gXCI/XCIgOiBcIiZcIjtcclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhkYXRhKTtcclxuXHRcdFx0eGhyT3B0aW9ucy51cmwgPSB4aHJPcHRpb25zLnVybCArIChxdWVyeXN0cmluZyA/IHByZWZpeCArIHF1ZXJ5c3RyaW5nIDogXCJcIilcclxuXHRcdH1cclxuXHRcdGVsc2UgeGhyT3B0aW9ucy5kYXRhID0gc2VyaWFsaXplKGRhdGEpO1xyXG5cdFx0cmV0dXJuIHhock9wdGlvbnNcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyYW1ldGVyaXplVXJsKHVybCwgZGF0YSkge1xyXG5cdFx0dmFyIHRva2VucyA9IHVybC5tYXRjaCgvOlthLXpdXFx3Ky9naSk7XHJcblx0XHRpZiAodG9rZW5zICYmIGRhdGEpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIga2V5ID0gdG9rZW5zW2ldLnNsaWNlKDEpO1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHRva2Vuc1tpXSwgZGF0YVtrZXldKTtcclxuXHRcdFx0XHRkZWxldGUgZGF0YVtrZXldXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB1cmxcclxuXHR9XHJcblxyXG5cdG0ucmVxdWVzdCA9IGZ1bmN0aW9uKHhock9wdGlvbnMpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHR2YXIgaXNKU09OUCA9IHhock9wdGlvbnMuZGF0YVR5cGUgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCI7XHJcblx0XHR2YXIgc2VyaWFsaXplID0geGhyT3B0aW9ucy5zZXJpYWxpemUgPSBpc0pTT05QID8gaWRlbnRpdHkgOiB4aHJPcHRpb25zLnNlcmlhbGl6ZSB8fCBKU09OLnN0cmluZ2lmeTtcclxuXHRcdHZhciBkZXNlcmlhbGl6ZSA9IHhock9wdGlvbnMuZGVzZXJpYWxpemUgPSBpc0pTT05QID8gaWRlbnRpdHkgOiB4aHJPcHRpb25zLmRlc2VyaWFsaXplIHx8IEpTT04ucGFyc2U7XHJcblx0XHR2YXIgZXh0cmFjdCA9IGlzSlNPTlAgPyBmdW5jdGlvbihqc29ucCkge3JldHVybiBqc29ucC5yZXNwb25zZVRleHR9IDogeGhyT3B0aW9ucy5leHRyYWN0IHx8IGZ1bmN0aW9uKHhocikge1xyXG5cdFx0XHRyZXR1cm4geGhyLnJlc3BvbnNlVGV4dC5sZW5ndGggPT09IDAgJiYgZGVzZXJpYWxpemUgPT09IEpTT04ucGFyc2UgPyBudWxsIDogeGhyLnJlc3BvbnNlVGV4dFxyXG5cdFx0fTtcclxuXHRcdHhock9wdGlvbnMubWV0aG9kID0gKHhock9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0eGhyT3B0aW9ucy51cmwgPSBwYXJhbWV0ZXJpemVVcmwoeGhyT3B0aW9ucy51cmwsIHhock9wdGlvbnMuZGF0YSk7XHJcblx0XHR4aHJPcHRpb25zID0gYmluZERhdGEoeGhyT3B0aW9ucywgeGhyT3B0aW9ucy5kYXRhLCBzZXJpYWxpemUpO1xyXG5cdFx0eGhyT3B0aW9ucy5vbmxvYWQgPSB4aHJPcHRpb25zLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdFx0dmFyIHVud3JhcCA9IChlLnR5cGUgPT09IFwibG9hZFwiID8geGhyT3B0aW9ucy51bndyYXBTdWNjZXNzIDogeGhyT3B0aW9ucy51bndyYXBFcnJvcikgfHwgaWRlbnRpdHk7XHJcblx0XHRcdFx0dmFyIHJlc3BvbnNlID0gdW53cmFwKGRlc2VyaWFsaXplKGV4dHJhY3QoZS50YXJnZXQsIHhock9wdGlvbnMpKSwgZS50YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChlLnR5cGUgPT09IFwibG9hZFwiKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZS5jYWxsKHJlc3BvbnNlKSA9PT0gQVJSQVkgJiYgeGhyT3B0aW9ucy50eXBlKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHJlc3BvbnNlW2ldID0gbmV3IHhock9wdGlvbnMudHlwZShyZXNwb25zZVtpXSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHhock9wdGlvbnMudHlwZSkgcmVzcG9uc2UgPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkZWZlcnJlZFtlLnR5cGUgPT09IFwibG9hZFwiID8gXCJyZXNvbHZlXCIgOiBcInJlamVjdFwiXShyZXNwb25zZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoeGhyT3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB0cnVlKSBtLmVuZENvbXB1dGF0aW9uKClcclxuXHRcdH07XHJcblx0XHRhamF4KHhock9wdGlvbnMpO1xyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSwgeGhyT3B0aW9ucy5pbml0aWFsVmFsdWUpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cclxuXHQvL3Rlc3RpbmcgQVBJXHJcblx0bS5kZXBzID0gZnVuY3Rpb24obW9jaykge1xyXG5cdFx0aW5pdGlhbGl6ZSh3aW5kb3cgPSBtb2NrIHx8IHdpbmRvdyk7XHJcblx0XHRyZXR1cm4gd2luZG93O1xyXG5cdH07XHJcblx0Ly9mb3IgaW50ZXJuYWwgdGVzdGluZyBvbmx5LCBkbyBub3QgdXNlIGBtLmRlcHMuZmFjdG9yeWBcclxuXHRtLmRlcHMuZmFjdG9yeSA9IGFwcDtcclxuXHJcblx0cmV0dXJuIG1cclxufSkodHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gbTtcclxuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIGRlZmluZShmdW5jdGlvbigpIHtyZXR1cm4gbX0pO1xyXG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcbnZhciBsYXlvdXRIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheW91dC1oZWxwZXInKTtcbnZhciBMb2dnZWRJbk1lbnUgPSByZXF1aXJlKCcuLi9sYXlvdXQvbG9nZ2VkLWluLW1lbnUnKTtcbnZhciBGZWVkU2VsZWN0ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2ZlZWQtc2VsZWN0Jyk7XG52YXIgRmVlZEluZm8gPSByZXF1aXJlKCcuL21vZGVscy9mZWVkLWluZm8nKTtcbnZhciBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbWVzc2FnZXMnKTtcblxudmFyIEZlZWRFZGl0ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXBkYXRlRmVlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL2VkaXQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGl0bGU6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd0aXRsZScpWzBdLnZhbHVlLFxuICAgICAgICAgIGZpbHRlcnM6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdmaWx0ZXJzJylbMF0udmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgIH0pXG4gICAgICAudGhlbihhdXRob3JpemVIZWxwZXIpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAoIXJlc3BvbnNlLmZhaWwpIHtcblxuICAgICAgICAgIHZhciBub3RpY2VNZXNzYWdlID0gTWVzc2FnZXMuTm90aWNlTWVzc2FnZShyZXNwb25zZSk7XG5cbiAgICAgICAgICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyksIG5vdGljZU1lc3NhZ2UpO1xuXG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL2VkaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIHZhciBhbGVydE1lc3NhZ2UgPSBNZXNzYWdlcy5BbGVydE1lc3NhZ2UocmVzcG9uc2UpO1xuXG4gICAgICAgICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZScpLCBhbGVydE1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBkZWxldGVGZWVkID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZScpKSB7XG4gICAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSxcbiAgICAgICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gICAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgICB9KVxuICAgICAgICAudGhlbihhdXRob3JpemVIZWxwZXIpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG0ucm91dGUoJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGFkZFNvdXJjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnbmFtZScpWzBdLnZhbHVlIHx8ICFkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgndmFsdWUnKVswXS52YWx1ZSkge1xuICAgICAgICB2YXIgYWxlcnRNZXNzYWdlID0gTWVzc2FnZXMuQWxlcnRNZXNzYWdlKHsgbWVzc2FnZTogJ1NvdXJjZSBGaWVsZHMgQ2Fubm90IGJlIEJsYW5rJ30pO1xuXG4gICAgICAgIHJldHVybiBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyksIGFsZXJ0TWVzc2FnZSk7XG4gICAgICB9XG5cbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy9uZXcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ25hbWUnKVswXS52YWx1ZSxcbiAgICAgICAgICB2YWx1ZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3ZhbHVlJylbMF0udmFsdWUsXG4gICAgICAgICAgdHlwZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3R5cGUnKVswXS52YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICBzZXJpYWxpemU6IHJlcUhlbHBlcnMuc2VyaWFsaXplLFxuICAgICAgICBjb25maWc6IHJlcUhlbHBlcnMuYXNGb3JtVXJsRW5jb2RlZFxuICAgICAgfSlcbiAgICAgIC50aGVuKGF1dGhvcml6ZUhlbHBlcilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmICghcmVzcG9uc2UuZmFpbCkge1xuICAgICAgICAgIHZhciBub3RpY2VNZXNzYWdlID0gTWVzc2FnZXMuTm90aWNlTWVzc2FnZShyZXNwb25zZSk7XG5cbiAgICAgICAgICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyksIG5vdGljZU1lc3NhZ2UpO1xuXG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL2VkaXQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgYWxlcnRNZXNzYWdlID0gTWVzc2FnZXMuQWxlcnRNZXNzYWdlKHJlc3BvbnNlKTtcblxuICAgICAgICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKSwgYWxlcnRNZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgZGVsZXRlU291cmNlID0gZnVuY3Rpb24oc291cmNlSWQpIHtcblxuICAgICAgdmFyIGRlbGV0ZVNvdXJjZUZuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUnKSkge1xuICAgICAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL3NvdXJjZXMvJyArIHNvdXJjZUlkLFxuICAgICAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihhdXRob3JpemVIZWxwZXIpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2UuZmFpbCkge1xuICAgICAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvZWRpdCcpO1xuXG4gICAgICAgICAgICAgIHZhciBub3RpY2VNZXNzYWdlID0gTWVzc2FnZXMuTm90aWNlTWVzc2FnZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKSwgbm90aWNlTWVzc2FnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgYWxlcnRNZXNzYWdlID0gTWVzc2FnZXMuQWxlcnRNZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZScpLCBhbGVydE1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWxldGVTb3VyY2VGbjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgZmVlZEluZm86IEZlZWRJbmZvKCksIHVwZGF0ZUZlZWQ6IHVwZGF0ZUZlZWQsIGRlbGV0ZUZlZWQ6IGRlbGV0ZUZlZWQsIGFkZFNvdXJjZTogYWRkU291cmNlLCBkZWxldGVTb3VyY2U6IGRlbGV0ZVNvdXJjZSB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgZmVlZHM6IGN0cmwuZmVlZEluZm8oKS51c2VyLmZlZWRzLFxuICAgICAgY3VycmVudEZlZWQ6ICdzZWxlY3QtZmVlZCcsXG4gICAgfSk7XG4gICAgcmV0dXJuIG0oJ2Rpdi5jb250ZW50LXBhcnQnLCBbXG4gICAgICBtKCdkaXYnLCBbXG4gICAgICAgIG0oJ2gyJywgJ0VkaXQgRmVlZCcpLFxuICAgICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3RpdGxlJywgcGxhY2Vob2xkZXI6ICdlZGl0IHRpdGxlJywgdmFsdWU6IGN0cmwuZmVlZEluZm8oKS5kYXRhLnRpdGxlIHx8ICcnfSlcbiAgICAgICAgXSksXG4gICAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAnZmlsdGVycycsIHBsYWNlaG9sZGVyOiAnYWRkIGZpbHRlcnMgc2VwYXRhdGVkIGJ5IGNvbW1hcycsIHZhbHVlOiBjdHJsLmZlZWRJbmZvKCkuZGF0YS5maWx0ZXJzLmpvaW4oJywnKSB8fCAnJyB9KVxuICAgICAgICBdKSxcbiAgICAgICAgbSgnZGl2LnN1Ym1pdC1ibG9jaycsIFtcbiAgICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC51cGRhdGVGZWVkLCB0eXBlOiAnc3VibWl0JywgdmFsdWU6ICdVcGRhdGUgRmVlZCcgfSlcbiAgICAgICAgXSksXG4gICAgICAgIG0oJ2Rpdi5kZWxldGUtZm9ybScsIFtcbiAgICAgICAgICBtKCdidXR0b24uZGVsZXRlLWJ1dHRvbicsIHsgb25jbGljazogY3RybC5kZWxldGVGZWVkIH0sICdEZWxldGUgRmVlZCcgKVxuICAgICAgICBdKVxuICAgICAgXSksXG4gICAgICBtKCdkaXYnLCBbXG4gICAgICAgIG0oJ2gyJywgJ0FkZCBTb3VyY2UnKSxcbiAgICAgICAgbSgnZGl2LmlucHV0LWJsb2NrJywgW1xuICAgICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICduYW1lJywgcGxhY2Vob2xkZXI6ICduYW1lJyB9KVxuICAgICAgICBdKSxcbiAgICAgICAgbSgnZGl2LmlucHV0LWJsb2NrJywgW1xuICAgICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICd2YWx1ZScsIHBsYWNlaG9sZGVyOiAnRmFjZWJvb2sgcGFnZSBJRCcgfSlcbiAgICAgICAgXSksXG4gICAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgICBtKCdzZWxlY3QnLCB7IG5hbWU6ICd0eXBlJyB9LCBbXG4gICAgICAgICAgICBtKCdvcHRpb24nLCB7IHZhbHVlOiAnZmFjZWJvb2snIH0sICdGYWNlYm9vaycpXG4gICAgICAgICAgXSlcbiAgICAgICAgXSksXG4gICAgICAgIG0oJ2Rpdi5zdWJtaXQtYmxvY2snLCBbXG4gICAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuYWRkU291cmNlLCB0eXBlOiAnc3VibWl0JywgdmFsdWU6ICdBZGQgU291cmNlJyB9KVxuICAgICAgICBdKSxcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2JywgW1xuICAgICAgICBtKCdoMicsICdTb3VyY2VzJyksXG4gICAgICAgIGN0cmwuZmVlZEluZm8oKS5kYXRhLnNvdXJjZXMubWFwKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICAgIHJldHVybiBtKCdkaXYubGlzdGVkLWl0ZW0nLCBbXG4gICAgICAgICAgICBtKCdoNCcsIFtcbiAgICAgICAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9zb3VyY2VzLycgKyBzb3VyY2UuX2lkLCBjb25maWc6IG0ucm91dGUgfSwgc291cmNlLm5hbWUpXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIG0oJ2J1dHRvbi5kZWxldGUtYnV0dG9uJywgeyBvbmNsaWNrOiBjdHJsLmRlbGV0ZVNvdXJjZShzb3VyY2UuX2lkKX0sICdEZWxldGUnKSxcbiAgICAgICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy8nICsgc291cmNlLl9pZCArICcvZWRpdCcsIGNvbmZpZzogbS5yb3V0ZSB9LCAnRWRpdCcpXG4gICAgICAgICAgXSlcbiAgICAgICAgfSlcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRFZGl0O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgZmluZExpbmtzID0gcmVxdWlyZSgnLi4vaGVscGVycy9maW5kLWxpbmtzJyk7XG5cbnZhciBGZWVkSXRlbSA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBmb3JtYXRUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbW9udGhzID0gW1xuICAgICAgICAnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JyxcbiAgICAgICAgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlcidcbiAgICAgIF07XG5cbiAgICAgIHJldHVybiBtb250aHNbcGFyc2VJbnQoYXJncy50aW1lLnNsaWNlKDUsIDcpKSAtIDFdICsgJyAnICsgYXJncy50aW1lLnNsaWNlKDgsIDEwKSArICcsICcgKyBhcmdzLnRpbWUuc2xpY2UoMCwgNCk7XG4gICAgfTtcbiAgICB2YXIgY29uZGl0aW9uYWxFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsZW1lbnRzID0gW107XG5cbiAgICAgIGlmIChhcmdzLnZpZGVvKSB7XG4gICAgICAgIGVsZW1lbnRzLnB1c2gobSgndmlkZW8nLCB7IGNvbnRyb2xzOiAnY29udHJvbHMnLCBzcmM6IGFyZ3MudmlkZW8gfSkpO1xuICAgICAgfSBlbHNlIGlmIChhcmdzLnBpY3R1cmUpIHtcbiAgICAgICAgZWxlbWVudHMucHVzaChtKCdpbWcnLCB7IHNyYzogYXJncy5waWN0dXJlLCBhbHQ6IGFyZ3MuZGVzY3JpcHRpb24gfSkpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3MubGluaykge1xuICAgICAgICBlbGVtZW50cy5wdXNoKG0oJ2EubWFpbi1saW5rJywgeyBocmVmOiBhcmdzLmxpbmssIHRhcmdldDogJ19ibGFuaycgfSwgYXJncy5uYW1lIHx8IGFyZ3MubGluaykpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZ3MuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgZWxlbWVudHMucHVzaChtKCdwJywgbS50cnVzdChmaW5kTGlua3MoYXJncy5kZXNjcmlwdGlvbikpKSk7XG4gICAgICB9XG4gICAgICBpZiAoYXJncy5jYXB0aW9uKSB7XG4gICAgICAgIGVsZW1lbnRzLnB1c2gobSgnc21hbGwnLCBhcmdzLmNhcHRpb24pKTtcbiAgICAgIH1cbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBtKCdkaXYubWVkaWEtd3JhcCcsIFtcbiAgICAgICAgICBlbGVtZW50c1xuICAgICAgICBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBtKCdkaXYnLCBbXG4gICAgICAgICAgZWxlbWVudHNcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiBmb3JtYXRUaW1lKCksXG4gICAgICBmcm9tOiBhcmdzLmZyb20sXG4gICAgICBtZXNzYWdlOiBtLnRydXN0KGZpbmRMaW5rcyhhcmdzLm1lc3NhZ2UpKSxcbiAgICAgIGVsZW1lbnRzOiBjb25kaXRpb25hbEVsZW1lbnRzKClcbiAgICB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICByZXR1cm4gbSgnYXJ0aWNsZS5mZWVkLWl0ZW0nLCBbXG4gICAgICBtKCdhW2hyZWY9aHR0cHM6Ly9mYWNlYm9vay5jb20vJyArIGN0cmwuZnJvbS5pZCAgKyAnXScsIHsgdGFyZ2V0OiAnX2JsYW5rJ30sIFtcbiAgICAgICAgbSgnaDUnLCBjdHJsLmZyb20ubmFtZSksXG4gICAgICBdKSxcbiAgICAgIG0oJ3NwYW4uZmVlZC1kYXRlJywgY3RybC50aW1lKSxcbiAgICAgIG0oJ2g0JywgY3RybC5tZXNzYWdlKSxcbiAgICAgIGN0cmwuZWxlbWVudHNcbiAgICBdKVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRJdGVtO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xudmFyIEZlZWRMaXN0aW5nID0gcmVxdWlyZSgnLi4vZmVlZHMvZmVlZC1saXN0aW5nJyk7XG52YXIgRmVlZHMgPSByZXF1aXJlKCcuL21vZGVscy9mZWVkcycpO1xuXG52YXIgRmVlZExpc3QgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IGZlZWRzOiBGZWVkcygpIH1cbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIGxheW91dEhlbHBlcih7XG4gICAgICBtZW51OiBMb2dnZWRJbk1lbnUsXG4gICAgICB1c2VySWQ6IG0ucm91dGUucGFyYW0oJ2lkJyksXG5cbiAgICAgIGZlZWRTZWxlY3Q6IEZlZWRTZWxlY3QsXG4gICAgICBmZWVkczogY3RybC5mZWVkcygpLnVzZXIuZmVlZHMsXG4gICAgICBjdXJyZW50RmVlZDogJ3NlbGVjdC1mZWVkJyxcbiAgICB9KTtcbiAgICBcbiAgICB2YXIgZmVlZExpc3QgPSBtKCdzZWN0aW9uLmNvbnRlbnQtcGFydCcsIFtcbiAgICAgIG0oJ2gyJywgJ0ZlZWRzJyksXG4gICAgICBjdHJsLmZlZWRzKCkuZGF0YS5tYXAoZnVuY3Rpb24oZmVlZCkge1xuICAgICAgICByZXR1cm4gbS5jb21wb25lbnQoRmVlZExpc3RpbmcsIHsgZmVlZElkOiBmZWVkLl9pZCwgdGl0bGU6IGZlZWQudGl0bGUsIHVzZXJJZDogY3RybC5mZWVkcygpLnVzZXIuaWQgfSk7XG4gICAgICB9KVxuICAgIF0pO1xuXG4gICAgdmFyIG5vRmVlZExpc3RNZXNzYWdlID0gbSgncC5mZWVkLWVycm9yJywgJ1lvdSBoYXZlIG5vIGZlZWRzLCBnbyB0byBNZW51ID4gTmV3IEZlZWQgdG8gY3JlYXRlIG9uZScpO1xuXG4gICAgcmV0dXJuIGN0cmwuZmVlZHMoKS5kYXRhLmxlbmd0aCA+IDAgPyBmZWVkTGlzdCA6IG5vRmVlZExpc3RNZXNzYWdlXG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZExpc3Q7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIEZlZWRMaXN0aW5nID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBhcmdzLmlkLFxuICAgICAgdGl0bGU6IGFyZ3MudGl0bGUsXG4gICAgICB1c2VySWQ6IGFyZ3MudXNlcklkLFxuICAgICAgZmVlZElkOiBhcmdzLmZlZWRJZFxuICAgIH1cbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdkaXYubGlzdGVkLWl0ZW0nLCBbXG4gICAgICBtKCdoNCcsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy8nICsgY3RybC51c2VySWQgKyAnL2ZlZWRzLycgKyBjdHJsLmZlZWRJZCwgY29uZmlnOiBtLnJvdXRlIH0sIGN0cmwudGl0bGUpXG4gICAgICBdKSxcbiAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvdXNlcnMvJyArIGN0cmwudXNlcklkICsgJy9mZWVkcy8nICsgY3RybC5mZWVkSWQgKyAnL2VkaXQnLCBjb25maWc6IG0ucm91dGUgfSwgJ1NldHRpbmdzJylcbiAgICBdKVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRMaXN0aW5nO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xudmFyIEZlZWRzID0gcmVxdWlyZSgnLi9tb2RlbHMvZmVlZHMnKTtcblxudmFyIEZlZWROZXcgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjcmVhdGVGZWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy9uZXcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGl0bGU6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd0aXRsZScpWzBdLnZhbHVlXG4gICAgICAgIH0sXG4gICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgIH0pXG4gICAgICAudGhlbihhdXRob3JpemVIZWxwZXIpXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcycpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4geyBjcmVhdGVGZWVkOiBjcmVhdGVGZWVkLCBmZWVkczogRmVlZHMoKSB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZEluTWVudSxcbiAgICAgIHVzZXJJZDogbS5yb3V0ZS5wYXJhbSgnaWQnKSxcblxuICAgICAgZmVlZFNlbGVjdDogRmVlZFNlbGVjdCxcbiAgICAgIGZlZWRzOiBjdHJsLmZlZWRzKCkudXNlci5mZWVkcyxcbiAgICAgIGN1cnJlbnRGZWVkOiAnc2VsZWN0LWZlZWQnLFxuICAgIH0pO1xuICAgIHJldHVybiBtKCdkaXYuY29udGVudC1wYXJ0JywgW1xuICAgICAgbSgnaDInLCAnQ3JlYXRlIEZlZWQnKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQuaW5mby1pbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAndGl0bGUnLCBwbGFjZWhvbGRlcjogJ2NyZWF0ZSBhIG5hbWUgZm9yIHlvdXIgZmVlZCcgfSlcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LnN1Ym1pdC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwuY3JlYXRlRmVlZCwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnQ3JlYXRlIEZlZWQnIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ3AnLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzJywgY29uZmlnOiBtLnJvdXRlIH0sICdDYW5jZWwnKVxuICAgICAgXSlcbiAgICBdKVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWROZXc7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcbnZhciBsYXlvdXRIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheW91dC1oZWxwZXInKTtcbnZhciBMb2dnZWRJbk1lbnUgPSByZXF1aXJlKCcuLi9sYXlvdXQvbG9nZ2VkLWluLW1lbnUnKTtcbnZhciBGZWVkU2VsZWN0ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2ZlZWQtc2VsZWN0Jyk7XG52YXIgUmVmcmVzaEJ1dHRvbiA9IHJlcXVpcmUoJy4uL2xheW91dC9yZWZyZXNoLWJ1dHRvbicpO1xudmFyIEZlZWRSZXN1bHRzID0gcmVxdWlyZSgnLi9tb2RlbHMvZmVlZC1yZXN1bHRzJyk7XG52YXIgU2VhcmNoUmVzdWx0cyA9IHJlcXVpcmUoJy4vbW9kZWxzL3NlYXJjaC1yZXN1bHRzJyk7XG52YXIgRmVlZEl0ZW0gPSByZXF1aXJlKCcuL2ZlZWQtaXRlbScpO1xudmFyIFNlYXJjaEljb24gPSByZXF1aXJlKCcuLi9sYXlvdXQvc2VhcmNoLWljb24nKTtcblxudmFyIFNlYXJjaEJhciA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBzZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpLCBtLmNvbXBvbmVudChGZWVkU2hvdywgeyBxdWVyeTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3F1ZXJ5JylbMF0udmFsdWUgfSkpO1xuICAgIH1cbiAgICBpZiAoYXJncyAmJiBhcmdzLnF1ZXJ5KSB7XG4gICAgICByZXR1cm4geyBzZWFyY2g6IHNlYXJjaCwgcXVlcnk6IGFyZ3MucXVlcnkgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBzZWFyY2g6IHNlYXJjaCB9XG4gICAgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgaWYgKGN0cmwucXVlcnkpIHtcbiAgICAgIHJldHVybiBtKCdkaXYuc2VhcmNoLWNvbnRhaW5lcicsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ3F1ZXJ5JywgdmFsdWU6IGN0cmwucXVlcnkgfSksXG4gICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLnNlYXJjaCwgdHlwZTogJ3N1Ym1pdCcsIG5hbWU6ICdzZWFyY2gnLCB2YWx1ZTogJ0dvJyB9KSxcbiAgICAgIF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbSgnZGl2LnNlYXJjaC1jb250YWluZXInLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICdxdWVyeScgfSksXG4gICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLnNlYXJjaCwgdHlwZTogJ3N1Ym1pdCcsIG5hbWU6ICdzZWFyY2gnLCB2YWx1ZTogJ0dvJyB9KSxcbiAgICAgIF0pO1xuICAgIH1cbiAgfVxufTtcblxudmFyIEZlZWRTaG93ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgaWYgKGFyZ3MgJiYgYXJncy5xdWVyeSkge1xuICAgICAgcmV0dXJuIHsgZmVlZFJlc3VsdHM6IFNlYXJjaFJlc3VsdHMoYXJncy5xdWVyeSksIHF1ZXJ5OiBhcmdzLnF1ZXJ5IH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IGZlZWRSZXN1bHRzOiBGZWVkUmVzdWx0cygpIH07XG4gICAgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZEluTWVudSxcbiAgICAgIHVzZXJJZDogbS5yb3V0ZS5wYXJhbSgnaWQnKSxcblxuICAgICAgZmVlZFNlbGVjdDogRmVlZFNlbGVjdCxcbiAgICAgIGZlZWRzOiBjdHJsLmZlZWRSZXN1bHRzKCkudXNlci5mZWVkcyxcbiAgICAgIGN1cnJlbnRGZWVkOiBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSxcblxuICAgICAgcmVmcmVzaEJ1dHRvbjogUmVmcmVzaEJ1dHRvbixcblxuICAgICAgc2VhcmNoQmFyOiBTZWFyY2hCYXIsXG4gICAgICBzZWFyY2hJY29uOiBTZWFyY2hJY29uLFxuICAgICAgcXVlcnk6IGN0cmwucXVlcnkgfHwgZmFsc2VcbiAgICB9KTtcbiAgICBpZiAoY3RybC5mZWVkUmVzdWx0cygpLmRhdGEubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIG0oJ3AuZmVlZC1lcnJvcicsIGN0cmwuZmVlZFJlc3VsdHMoKS5tZXNzYWdlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgICBjdHJsLmZlZWRSZXN1bHRzKCkuZGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHJldHVybiBtLmNvbXBvbmVudChGZWVkSXRlbSwge1xuICAgICAgICAgICAgdGltZTogaXRlbS5jcmVhdGVkX3RpbWUsXG4gICAgICAgICAgICBmcm9tOiBpdGVtLmZyb20sXG4gICAgICAgICAgICBtZXNzYWdlOiBpdGVtLm1lc3NhZ2UgfHwgaXRlbS5zdG9yeSxcbiAgICAgICAgICAgIHZpZGVvOiBpdGVtLnNvdXJjZSxcbiAgICAgICAgICAgIHBpY3R1cmU6IGl0ZW0uZnVsbF9waWN0dXJlLFxuICAgICAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxuICAgICAgICAgICAgbGluazogaXRlbS5saW5rLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGl0ZW0uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBjYXB0aW9uOiBpdGVtLmNhcHRpb24sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICBdKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZFNob3c7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcblxudmFyIEZlZWRJbmZvID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL2VkaXQnLFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRJbmZvO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG5cbnZhciBGZWVkUmVzdWx0cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpLFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRSZXN1bHRzO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG5cbnZhciBGZWVkcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMnLFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRzO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG5cbnZhciBTZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24ocXVlcnkpIHtcbiAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvJyArIHF1ZXJ5LFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgfSkudGhlbihhdXRob3JpemVIZWxwZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFyY2hSZXN1bHRzO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbi8vIGNoZWNrIGlmIHJlcXVlc3QgcmVzcG9uc2UgaXMgYXV0aG9yaXplZFxuZnVuY3Rpb24gYXV0aG9yaXplSGVscGVyKHJlc3BvbnNlKSB7XG4gIGlmICghcmVzcG9uc2UuYXV0aG9yaXplRmFpbCkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm1lc3NhZ2UpO1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5tZXNzYWdlKTtcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKSAmJiByZXNwb25zZS51c2VyICE9PSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpKSB7XG4gICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICB9XG4gICAgbS5yb3V0ZSgnLycpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXV0aG9yaXplSGVscGVyO1xuIiwiLy8gcGFyc2Ugc3RyaW5ncyBhbmQgdHVybiB1cmxzIGludG8gbGlua3NcbmZ1bmN0aW9uIGZpbmRMaW5rcyhzdHJpbmcpIHtcbiAgLy8gc2VwZXJhdGUgc3RyaW5nIGludG8gYXJyYXkgYnkgc3BhY2VzIGFuZCByZXR1cm5zXG4gIHZhciB3b3JkQXJyYXkgPSBzdHJpbmcuc3BsaXQoL1sgXFxyXFxuXS8pO1xuXG4gIC8vIGxvb3AgdGhyb3VnaCBhcnJheSBhbmQgdHVybiB1cmwgaW50byBhbmNob3IgdGFnXG4gIGZvciAodmFyIG4gPSAwOyBuIDwgd29yZEFycmF5Lmxlbmd0aDsgbisrKSB7XG4gICAgaWYgKHdvcmRBcnJheVtuXS5zbGljZSgwLCA0KSA9PT0gJ2h0dHAnKSB7XG4gICAgICB3b3JkQXJyYXkuc3BsaWNlKG4sIDEsICc8YSBocmVmPScgKyB3b3JkQXJyYXlbbl0gKyAnIHRhcmdldD1fYmxhbms+JyArIHdvcmRBcnJheVtuXSArICc8L2E+Jyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHdvcmRBcnJheS5qb2luKCcgJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZExpbmtzO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgTWVudUljb24gPSByZXF1aXJlKCcuLi9sYXlvdXQvbWVudS1pY29uJyk7XG5cbmZ1bmN0aW9uIGxheW91dEhlbHBlcihhcmdzKSB7XG5cbiAgdmFyIHNlYXJjaERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJyk7XG4gIHZhciBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyLXdyYXAnKTtcbiAgdmFyIGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudC13cmFwJyk7XG5cbiAgbS5tb3VudChcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1pY29uJyksXG4gICAgbS5jb21wb25lbnQoTWVudUljb24pXG4gICk7XG5cbiAgbS5tb3VudChcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudScpLFxuICAgIG0uY29tcG9uZW50KGFyZ3MubWVudSwgeyB1c2VySWQ6IGFyZ3MudXNlcklkIH0pXG4gICk7XG5cbiAgaWYgKGFyZ3MuZmVlZFNlbGVjdCkge1xuICAgIG0ubW91bnQoXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmVlZC1zZWxlY3QnKSxcbiAgICAgIG0uY29tcG9uZW50KGFyZ3MuZmVlZFNlbGVjdCwgeyBmZWVkczogYXJncy5mZWVkcywgY3VycmVudEZlZWQ6IGFyZ3MuY3VycmVudEZlZWQgfSlcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZlZWQtc2VsZWN0JyksIG51bGwpO1xuICB9XG5cbiAgaWYgKGFyZ3MucmVmcmVzaEJ1dHRvbikge1xuICAgIG0ubW91bnQoXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVmcmVzaC1idXR0b24nKSxcbiAgICAgIG0uY29tcG9uZW50KGFyZ3MucmVmcmVzaEJ1dHRvbilcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZnJlc2gtYnV0dG9uJyksIG51bGwpO1xuICB9XG5cbiAgaWYgKGFyZ3Muc2VhcmNoQmFyKSB7XG4gICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWljb24nKSwgYXJncy5zZWFyY2hJY29uKTtcbiAgICBpZiAoYXJncy5xdWVyeSkge1xuICAgICAgbS5tb3VudChcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1iYXInKSxcbiAgICAgICAgbS5jb21wb25lbnQoYXJncy5zZWFyY2hCYXIsIHsgcXVlcnk6IGFyZ3MucXVlcnkgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0ubW91bnQoXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJyksXG4gICAgICAgIG0uY29tcG9uZW50KGFyZ3Muc2VhcmNoQmFyKVxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWJhcicpLCBudWxsKTtcbiAgICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtaWNvbicpLCBudWxsKTtcbiAgfVxuXG4gIGlmIChhcmdzLnNvdXJjZU5hbWUpIHtcbiAgICBtLm1vdW50KFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvdXJjZS1uYW1lJyksXG4gICAgICBtLmNvbXBvbmVudChhcmdzLnNvdXJjZU5hbWUsIHsgc291cmNlTmFtZVRleHQ6IGFyZ3Muc291cmNlTmFtZVRleHR9KVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291cmNlLW5hbWUnKSwgbnVsbCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsYXlvdXRIZWxwZXI7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIEFsZXJ0TWVzc2FnZSA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gIHZhciBjb21wb25lbnQgPSB7XG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbSgnZGl2LmFsZXJ0JywgcmVzcG9uc2UubWVzc2FnZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb21wb25lbnQ7XG59XG5cbnZhciBOb3RpY2VNZXNzYWdlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgdmFyIGNvbXBvbmVudCA9IHtcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBtKCdkaXYubm90aWNlJywgcmVzcG9uc2UubWVzc2FnZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb21wb25lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBbGVydE1lc3NhZ2U6IEFsZXJ0TWVzc2FnZSxcbiAgTm90aWNlTWVzc2FnZTogTm90aWNlTWVzc2FnZVxufTtcbiIsIi8vIGVuY29kZSByZXF1ZXN0c1xuZnVuY3Rpb24gc2VyaWFsaXplKG9iaikge1xuICB2YXIgc3RyID0gW107XG4gIGZvcih2YXIgcCBpbiBvYmopXG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgc3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHApICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtwXSkpO1xuICAgIH1cbiAgcmV0dXJuIHN0ci5qb2luKCcmJyk7XG59XG5cbi8vIHNldCBjb250ZW50IHR5cGUgZm9yIHJlcXVlc3QgaGVhZGVyXG5mdW5jdGlvbiBhc0Zvcm1VcmxFbmNvZGVkKHhocikge1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG59XG5cbi8vIGNvbnZlcnQgbm9uLWpzb24gZXJyb3JzIHRvIGpzb25cbmZ1bmN0aW9uIG5vbkpzb25FcnJvcnMoeGhyKSB7XG4gIHJldHVybiB4aHIuc3RhdHVzID4gMjAwID8gSlNPTi5zdHJpbmdpZnkoeGhyLnJlc3BvbnNlVGV4dCkgOiB4aHIucmVzcG9uc2VUZXh0XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcbiAgYXNGb3JtVXJsRW5jb2RlZDogYXNGb3JtVXJsRW5jb2RlZCxcbiAgbm9uSnNvbkVycm9yczogbm9uSnNvbkVycm9yc1xufTtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG52YXIgRmVlZFNlbGVjdCA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBjaGFuZ2VGZWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZSA9PT0gJ3NlbGVjdC1mZWVkJykge1xuICAgICAgICB0aGlzLnZhbHVlID0gbS5yb3V0ZS5wYXJhbSgnZmVlZElkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyB0aGlzLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB7IGNoYW5nZUZlZWQ6IGNoYW5nZUZlZWQsIGN1cnJlbnRGZWVkOiBhcmdzLmN1cnJlbnRGZWVkLCBmZWVkczogYXJncy5mZWVkcyB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIG0oJ3NlbGVjdCcsIHsgb25jaGFuZ2U6IGN0cmwuY2hhbmdlRmVlZCwgdmFsdWU6IGN0cmwuY3VycmVudEZlZWQgfHwgJ3NlbGVjdC1mZWVkJyB9LCBbXG4gICAgICBtKCdvcHRpb24nLCB7IHZhbHVlOiAnc2VsZWN0LWZlZWQnIH0sICdTZWxlY3QgRmVlZCcpLFxuICAgICAgY3RybC5mZWVkcy5tYXAoZnVuY3Rpb24oZmVlZCkge1xuICAgICAgICByZXR1cm4gbSgnb3B0aW9uJywgeyB2YWx1ZTogZmVlZC5faWQgfSwgZmVlZC50aXRsZSk7XG4gICAgICB9KVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkU2VsZWN0O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbnZhciBMb2dnZWRJbk1lbnUgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICByZXR1cm4geyB1c2VySWQ6IGFyZ3MudXNlcklkfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIG0oJ2RpdltkYXRhLWhlaWdodD1cIjE1MlwiXScsIFtcbiAgICAgIG0oJ2xpJywgW1xuICAgICAgICBtKCdhJywgeyBocmVmOiAnL3VzZXJzLycgKyBjdHJsLnVzZXJJZCwgY29uZmlnOiBtLnJvdXRlIH0sICdBY2NvdW50JyksXG4gICAgICBdKSxcbiAgICAgIG0oJ2xpJywgW1xuICAgICAgICBtKCdhJywgeyBocmVmOiAnL3VzZXJzLycgKyBjdHJsLnVzZXJJZCArICcvZmVlZHMnLCBjb25maWc6IG0ucm91dGUgfSwgJ0ZlZWRzJyksXG4gICAgICBdKSxcbiAgICAgIG0oJ2xpJywgW1xuICAgICAgICBtKCdhJywgeyBocmVmOiAnL3VzZXJzLycgKyBjdHJsLnVzZXJJZCArICcvZmVlZHMvbmV3JywgY29uZmlnOiBtLnJvdXRlIH0sICdOZXcgRmVlZCcpLFxuICAgICAgXSksXG4gICAgICBtKCdsaScsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy9sb2dvdXQnLCBjb25maWc6IG0ucm91dGUgfSwgJ0xvZ291dCcpXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2dnZWRJbk1lbnU7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIExvZ2dlZE91dE1lbnUgPSB7XG4gIHZpZXc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtKCdkaXZbZGF0YS1oZWlnaHQ9XCI3NlwiXScsIFtcbiAgICAgIG0oJ2xpJywgW1xuICAgICAgICBtKCdhJywgeyBocmVmOiAnLycsIGNvbmZpZzogbS5yb3V0ZSB9LCAnTG9naW4nKSxcbiAgICAgIF0pLFxuICAgICAgbSgnbGknLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvdXNlcnMvbmV3JywgY29uZmlnOiBtLnJvdXRlIH0sICdDcmVhdGUgQWNjb3VudCcpXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2dnZWRPdXRNZW51O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbnZhciBNZW51SWNvbiA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItd3JhcCcpO1xuICAgIHZhciBtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKTtcbiAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50LXdyYXAnKTtcblxuICAgIHZhciBzaG93TWVudSA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy9sZWZ0b3ZlciBmcm9tIGphdmFzY3JpcHQgbWVudVxuXG4gICAgICBtLnJlZHJhdy5zdHJhdGVneSgnbm9uZScpO1xuICAgIH07XG4gICAgcmV0dXJuIHsgc2hvd01lbnU6IHNob3dNZW51IH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICByZXR1cm4gbSgnc3Bhbi5mYS5mYS1iYXJzJywgeyBvbmNsaWNrOiBjdHJsLnNob3dNZW51IH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW51SWNvbjtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG52YXIgUmVmcmVzaEJ1dHRvbiA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghbS5yb3V0ZS5wYXJhbSgnc291cmNlSWQnKSkge1xuICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy8nICsgbS5yb3V0ZS5wYXJhbSgnc291cmNlSWQnKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHJlZnJlc2g6IHJlZnJlc2ggfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdzcGFuLmZhLmZhLXJlZnJlc2gnLCB7IG9uY2xpY2s6IGN0cmwucmVmcmVzaCB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlZnJlc2hCdXR0b247XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIFNlYXJjaEljb24gPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzaG93QmFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAvL29sZCBzZWFyY2ggbWV0aG9kXG5cbiAgICAgIG0ucmVkcmF3LnN0cmF0ZWd5KCdub25lJyk7XG4gICAgfTtcblxuICAgIHJldHVybiB7IHNob3dCYXI6IHNob3dCYXIgfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIHJldHVybiBtKCdzcGFuLmZhLmZhLXNlYXJjaCcsIHsgb25jbGljazogY3RybC5zaG93QmFyIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoSWNvbjtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG5Tb3VyY2VOYW1lID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgcmV0dXJuIHsgc291cmNlTmFtZVRleHQ6IGFyZ3Muc291cmNlTmFtZVRleHQgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgcmV0dXJuIG0oJ3NwYW4nLCBjdHJsLnNvdXJjZU5hbWVUZXh0KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VyY2VOYW1lO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkT3V0TWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtb3V0LW1lbnUnKTtcbnZhciBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbWVzc2FnZXMnKTtcblxudmFyIExvZ2luID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKSkge1xuICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpKTtcbiAgICB9XG5cbiAgICB2YXIgbG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZW1haWw6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdlbWFpbCcpWzBdLnZhbHVlLFxuICAgICAgICAgIHBhc3N3b3JkOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncGFzc3dvcmQnKVswXS52YWx1ZVxuICAgICAgICB9LFxuICAgICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5mYWlsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCByZXNwb25zZS51c2VyLmlkKTtcbiAgICAgICAgICBtLnJvdXRlKFxuICAgICAgICAgICAgJy91c2Vycy8nXG4gICAgICAgICAgICArIHJlc3BvbnNlLnVzZXIuaWRcbiAgICAgICAgICAgICsgJy9mZWVkcy8nXG4gICAgICAgICAgICArIChyZXNwb25zZS51c2VyLmRlZmF1bHRGZWVkIHx8IChyZXNwb25zZS51c2VyLmZlZWRzWzBdICYmIHJlc3BvbnNlLnVzZXIuZmVlZHNbMF0uX2lkKSB8fCAnbmV3JylcbiAgICAgICAgICApO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGFsZXJ0TWVzc2FnZSA9IE1lc3NhZ2VzLkFsZXJ0TWVzc2FnZShyZXNwb25zZSk7XG4gICAgICAgICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZScpLCBhbGVydE1lc3NhZ2UpO1xuXG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3Bhc3N3b3JkJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbG9naW46IGxvZ2luIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkT3V0TWVudVxuICAgIH0pO1xuICAgIHJldHVybiBtKCdzZWN0aW9uLmNvbnRlbnQtcGFydCcsIFtcbiAgICAgIG0oJ2gyJywgJ0xvZ2luJyksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyBuYW1lOiAnZW1haWwnLCB0eXBlOiAnZW1haWwnLCBwbGFjZWhvbGRlcjogJ2VtYWlsJyB9KVxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyBuYW1lOiAncGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnLCBwbGFjZWhvbGRlcjogJ3Bhc3N3b3JkJyB9KSxcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LnN1Ym1pdC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwubG9naW4sIHR5cGU6ICdzdWJtaXQnLCB2YWx1ZTogJ0xvZ2luJyB9KVxuICAgICAgXSksXG4gICAgICBtKCdwJywgJ0RvblxcJ3QgaGF2ZSBhbiBhY2NvdW50PyAnLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvdXNlcnMvbmV3JywgY29uZmlnOiBtLnJvdXRlIH0sICdTaWduIFVwIGZvciBGcmVlJylcbiAgICAgIF0pXG4gICAgICAvLyBtKCdhJywgeyBocmVmOiAnL3JlcXVlc3QtcGFzc3dvcmQnLCBjb25maWc6IG0ucm91dGUgfSwgJ0ZvcmdvdCB5b3VyIHBhc3N3b3JkPycpXG4gICAgXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2luO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG5cbnZhciBMb2dvdXQgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiAnR0VUJywgdXJsOiAnL2xvZ291dCcsIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgbS5yb3V0ZSgnLycpO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nb3V0O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG5cbnZhciBTZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24ocXVlcnkpIHtcbiAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy8nICsgbS5yb3V0ZS5wYXJhbSgnc291cmNlSWQnKSArICcvJyArIHF1ZXJ5LFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgfSkudGhlbihhdXRob3JpemVIZWxwZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFyY2hSZXN1bHRzO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG5cbnZhciBTb3VyY2VJbmZvID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL3NvdXJjZXMvJyArIG0ucm91dGUucGFyYW0oJ3NvdXJjZUlkJykgKyAnL2VkaXQnLFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvdXJjZUluZm87XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcblxudmFyIFNvdXJjZVJlc3VsdHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG0ucmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy8nICsgbS5yb3V0ZS5wYXJhbSgnc291cmNlSWQnKSxcbiAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnNcbiAgfSkudGhlbihhdXRob3JpemVIZWxwZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VyY2VSZXN1bHRzO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51Jyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xudmFyIFNvdXJjZUluZm8gPSByZXF1aXJlKCcuL21vZGVscy9zb3VyY2UtaW5mbycpO1xudmFyIE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vaGVscGVycy9tZXNzYWdlcycpO1xuXG52YXIgU291cmNlRWRpdCA9IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVwZGF0ZVNvdXJjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9mZWVkcy8nICsgbS5yb3V0ZS5wYXJhbSgnZmVlZElkJykgKyAnL3NvdXJjZXMvJyArIG0ucm91dGUucGFyYW0oJ3NvdXJjZUlkJykgKyAnL2VkaXQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ25hbWUnKVswXS52YWx1ZSxcbiAgICAgICAgICB2YWx1ZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ3ZhbHVlJylbMF0udmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9ycyxcbiAgICAgICAgc2VyaWFsaXplOiByZXFIZWxwZXJzLnNlcmlhbGl6ZSxcbiAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKGF1dGhvcml6ZUhlbHBlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlLmZhaWwpIHtcbiAgICAgICAgICAgIHZhciBub3RpY2VNZXNzYWdlID0gTWVzc2FnZXMuTm90aWNlTWVzc2FnZShyZXNwb25zZSk7XG4gICAgICAgICAgICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyksIG5vdGljZU1lc3NhZ2UpO1xuXG4gICAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2ZlZWRzLycgKyBtLnJvdXRlLnBhcmFtKCdmZWVkSWQnKSArICcvc291cmNlcy8nICsgbS5yb3V0ZS5wYXJhbSgnc291cmNlSWQnKSArICcvZWRpdCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYWxlcnRNZXNzYWdlID0gTWVzc2FnZXMuQWxlcnRNZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKSwgYWxlcnRNZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4geyBzb3VyY2VJbmZvOiBTb3VyY2VJbmZvKCksIHVwZGF0ZVNvdXJjZTogdXBkYXRlU291cmNlIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBtLm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJyksIG51bGwpO1xuICAgIGxheW91dEhlbHBlcih7XG4gICAgICBtZW51OiBMb2dnZWRJbk1lbnUsXG4gICAgICB1c2VySWQ6IG0ucm91dGUucGFyYW0oJ2lkJyksXG5cbiAgICAgIGZlZWRTZWxlY3Q6IEZlZWRTZWxlY3QsXG4gICAgICBmZWVkczogY3RybC5zb3VyY2VJbmZvKCkudXNlci5mZWVkcyxcbiAgICAgIGN1cnJlbnRGZWVkOiAnc2VsZWN0LWZlZWQnLFxuICAgIH0pO1xuICAgIHJldHVybiBtKCdkaXYuY29udGVudC1wYXJ0JywgW1xuICAgICAgbSgnaDInLCAnRWRpdCBTb3VyY2UnKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgbmFtZTogJ25hbWUnLCBwbGFjZWhvbGRlcjogJ2VkaXQgbmFtZScsIHZhbHVlOiBjdHJsLnNvdXJjZUluZm8oKS5kYXRhLm5hbWUgfHwgJyd9KVxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICd2YWx1ZScsIHBsYWNlaG9sZGVyOiAnZWRpdCB2YWx1ZScsIHZhbHVlOiBjdHJsLnNvdXJjZUluZm8oKS5kYXRhLnZhbHVlIHx8ICcnIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2Rpdi5zdWJtaXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyBvbmNsaWNrOiBjdHJsLnVwZGF0ZVNvdXJjZSwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnVXBkYXRlIFNvdXJjZScgfSlcbiAgICAgIF0pLFxuICAgICAgbSgncCcsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy91c2Vycy8nICsgbS5yb3V0ZS5wYXJhbSgnaWQnKSArICcvZmVlZHMvJyArIG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpICsgJy9lZGl0JywgY29uZmlnOiBtLnJvdXRlIH0sICdDYW5jZWwnKVxuICAgICAgXSlcbiAgICBdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291cmNlRWRpdDtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xudmFyIGF1dGhvcml6ZUhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXV0aG9yaXplLWhlbHBlcicpO1xudmFyIGxheW91dEhlbHBlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5b3V0LWhlbHBlcicpO1xudmFyIExvZ2dlZEluTWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtaW4tbWVudScpO1xudmFyIEZlZWRTZWxlY3QgPSByZXF1aXJlKCcuLi9sYXlvdXQvZmVlZC1zZWxlY3QnKTtcbnZhciBSZWZyZXNoQnV0dG9uID0gcmVxdWlyZSgnLi4vbGF5b3V0L3JlZnJlc2gtYnV0dG9uJyk7XG52YXIgU291cmNlUmVzdWx0cyA9IHJlcXVpcmUoJy4vbW9kZWxzL3NvdXJjZS1yZXN1bHRzJyk7XG52YXIgU2VhcmNoUmVzdWx0cyA9IHJlcXVpcmUoJy4vbW9kZWxzL3NlYXJjaC1yZXN1bHRzJyk7XG52YXIgRmVlZEl0ZW0gPSByZXF1aXJlKCcuLi9mZWVkcy9mZWVkLWl0ZW0nKTtcbnZhciBTZWFyY2hJY29uID0gcmVxdWlyZSgnLi4vbGF5b3V0L3NlYXJjaC1pY29uJyk7XG52YXIgU291cmNlTmFtZSA9IHJlcXVpcmUoJy4uL2xheW91dC9zb3VyY2UtbmFtZScpO1xuXG52YXIgU2VhcmNoQmFyID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIHNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyksIG0uY29tcG9uZW50KFNvdXJjZVNob3csIHsgcXVlcnk6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdxdWVyeScpWzBdLnZhbHVlIH0pKTtcbiAgICB9XG4gICAgaWYgKGFyZ3MgJiYgYXJncy5xdWVyeSkge1xuICAgICAgcmV0dXJuIHsgc2VhcmNoOiBzZWFyY2gsIHF1ZXJ5OiBhcmdzLnF1ZXJ5IH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgc2VhcmNoOiBzZWFyY2ggfVxuICAgIH1cbiAgfSxcbiAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgIGlmIChjdHJsLnF1ZXJ5KSB7XG4gICAgICByZXR1cm4gbSgnZGl2LnNlYXJjaC1jb250YWluZXInLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG5hbWU6ICdxdWVyeScsIHZhbHVlOiBjdHJsLnF1ZXJ5IH0pLFxuICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC5zZWFyY2gsIHR5cGU6ICdzdWJtaXQnLCBuYW1lOiAnc2VhcmNoJywgdmFsdWU6ICdHbycgfSksXG4gICAgICBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG0oJ2Rpdi5zZWFyY2gtY29udGFpbmVyJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBuYW1lOiAncXVlcnknIH0pLFxuICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC5zZWFyY2gsIHR5cGU6ICdzdWJtaXQnLCBuYW1lOiAnc2VhcmNoJywgdmFsdWU6ICdHbycgfSksXG4gICAgICBdKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBTb3VyY2VTaG93ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbihhcmdzKSB7XG4gICAgaWYgKGFyZ3MgJiYgYXJncy5xdWVyeSkge1xuICAgICAgcmV0dXJuIHsgc291cmNlUmVzdWx0czogU2VhcmNoUmVzdWx0cyhhcmdzLnF1ZXJ5KSwgcXVlcnk6IGFyZ3MucXVlcnkgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgc291cmNlUmVzdWx0czogU291cmNlUmVzdWx0cygpIH07XG4gICAgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgdmFyIHVzZXJGZWVkcyA9IGN0cmwuc291cmNlUmVzdWx0cygpLnVzZXIuZmVlZHM7XG4gICAgdmFyIHNvdXJjZU5hbWVUZXh0O1xuXG4gICAgLy8gc2V0IHNvdXJjZU5hbWVUZXh0IHRvIGN1cnJlbnQgc291cmNlIG5hbWVcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVzZXJGZWVkcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHVzZXJGZWVkc1tpXS5faWQgPT09IG0ucm91dGUucGFyYW0oJ2ZlZWRJZCcpKSB7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdXNlckZlZWRzW2ldLnNvdXJjZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICBpZiAodXNlckZlZWRzW2ldLnNvdXJjZXNbY10uX2lkID09PSBtLnJvdXRlLnBhcmFtKCdzb3VyY2VJZCcpKSB7XG4gICAgICAgICAgICBzb3VyY2VOYW1lVGV4dCA9IHVzZXJGZWVkc1tpXS5zb3VyY2VzW2NdLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZEluTWVudSxcbiAgICAgIHVzZXJJZDogbS5yb3V0ZS5wYXJhbSgnaWQnKSxcblxuICAgICAgZmVlZFNlbGVjdDogRmVlZFNlbGVjdCxcbiAgICAgIGZlZWRzOiB1c2VyRmVlZHMsXG4gICAgICBjdXJyZW50RmVlZDogJ3NlbGVjdC1mZWVkJyxcblxuICAgICAgcmVmcmVzaEJ1dHRvbjogUmVmcmVzaEJ1dHRvbixcblxuICAgICAgc2VhcmNoQmFyOiBTZWFyY2hCYXIsXG4gICAgICBzZWFyY2hJY29uOiBTZWFyY2hJY29uLFxuICAgICAgcXVlcnk6IGN0cmwucXVlcnkgfHwgZmFsc2UsXG5cbiAgICAgIHNvdXJjZU5hbWU6IFNvdXJjZU5hbWUsXG4gICAgICBzb3VyY2VOYW1lVGV4dDogc291cmNlTmFtZVRleHRcbiAgICB9KTtcblxuICAgIGlmIChjdHJsLnNvdXJjZVJlc3VsdHMoKS5kYXRhLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiBtKCdwLmZlZWQtZXJyb3InLCBjdHJsLnNvdXJjZVJlc3VsdHMoKS5tZXNzYWdlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbSgnZGl2JywgW1xuICAgICAgICBjdHJsLnNvdXJjZVJlc3VsdHMoKS5kYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIG0uY29tcG9uZW50KEZlZWRJdGVtLCB7XG4gICAgICAgICAgICB0aW1lOiBpdGVtLmNyZWF0ZWRfdGltZSxcbiAgICAgICAgICAgIGZyb206IGl0ZW0uZnJvbSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGl0ZW0ubWVzc2FnZSB8fCBpdGVtLnN0b3J5LFxuICAgICAgICAgICAgdmlkZW86IGl0ZW0uc291cmNlLFxuICAgICAgICAgICAgcGljdHVyZTogaXRlbS5mdWxsX3BpY3R1cmUsXG4gICAgICAgICAgICBuYW1lOiBpdGVtLm5hbWUsXG4gICAgICAgICAgICBsaW5rOiBpdGVtLmxpbmssXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogaXRlbS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNhcHRpb246IGl0ZW0uY2FwdGlvbixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgIF0pO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VyY2VTaG93O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgYXV0aG9yaXplSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9hdXRob3JpemUtaGVscGVyJyk7XG5cbnZhciBVc2VyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBtLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuICAgIGV4dHJhY3Q6IHJlcUhlbHBlcnMubm9uSnNvbkVycm9yc1xuICB9KS50aGVuKGF1dGhvcml6ZUhlbHBlcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXI7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciByZXFIZWxwZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9yZXF1ZXN0LWhlbHBlcnMnKTtcbnZhciBhdXRob3JpemVIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2F1dGhvcml6ZS1oZWxwZXInKTtcbnZhciBsYXlvdXRIZWxwZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheW91dC1oZWxwZXInKTtcbnZhciBMb2dnZWRJbk1lbnUgPSByZXF1aXJlKCcuLi9sYXlvdXQvbG9nZ2VkLWluLW1lbnUnKTtcbnZhciBGZWVkU2VsZWN0ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2ZlZWQtc2VsZWN0Jyk7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4vbW9kZWxzL3VzZXInKTtcbnZhciBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbWVzc2FnZXMnKTtcblxudmFyIFVzZXJFZGl0ID0ge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXBkYXRlVXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgbS5yZXF1ZXN0KHtcbiAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpICsgJy9lZGl0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVtYWlsOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnZW1haWwnKVswXS52YWx1ZSxcbiAgICAgICAgICBkZWZhdWx0RmVlZDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2RlZmF1bHRGZWVkJylbMF0udmFsdWUsXG4gICAgICAgICAgcGFzc3dvcmQ6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdwYXNzd29yZCcpWzBdLnZhbHVlLFxuICAgICAgICAgIGNvbmZpcm1hdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2NvbmZpcm1hdGlvbicpWzBdLnZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5mYWlsKSB7XG4gICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2VkaXQnKTtcblxuICAgICAgICAgIHZhciBhbGVydE1lc3NhZ2UgPSBNZXNzYWdlcy5BbGVydE1lc3NhZ2UocmVzcG9uc2UpO1xuICAgICAgICAgIG0ubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKSwgYWxlcnRNZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdXNlcjogVXNlcigpLCB1cGRhdGVVc2VyOiB1cGRhdGVVc2VyIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgZmVlZHM6IGN0cmwudXNlcigpLmRhdGEuZmVlZHMsXG4gICAgICBjdXJyZW50RmVlZDogJ3NlbGVjdC1mZWVkJ1xuICAgIH0pO1xuICAgIHJldHVybiBtKCdkaXYuY29udGVudC1wYXJ0JywgW1xuICAgICAgbSgnaDInLCAnRWRpdCBBY2NvdW50JyksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAnZW1haWwnLCBuYW1lOiAnZW1haWwnLCB2YWx1ZTogY3RybC51c2VyKCkuZGF0YS5lbWFpbCB9KVxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2xhYmVsJywgJ0RlZmF1bHQgRmVlZCcpLFxuICAgICAgICBtKCdzZWxlY3QnLCB7IG5hbWU6ICdkZWZhdWx0RmVlZCcsIHZhbHVlOiBjdHJsLnVzZXIoKS5kYXRhLmRlZmF1bHRGZWVkIHx8ICdzZWxlY3QtZmVlZCcgfSwgW1xuICAgICAgICAgIG0oJ29wdGlvbicsIHsgdmFsdWU6ICcnIH0sICdTZWxlY3QgRmVlZCcpLFxuICAgICAgICAgIGN0cmwudXNlcigpLmRhdGEuZmVlZHMubWFwKGZ1bmN0aW9uKGZlZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBtKCdvcHRpb24nLCB7IHZhbHVlOiBmZWVkLl9pZCB9LCBmZWVkLnRpdGxlKVxuICAgICAgICAgIH0pXG4gICAgICAgIF0pXG4gICAgICBdKSxcbiAgICAgIG0oJ3NtYWxsJywgJ1RvIGtlZXAgeW91ciBwYXNzd29yZCB0aGUgc2FtZSwgbGVhdmUgYmxhbmsnKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICdwYXNzd29yZCcsIG5hbWU6ICdwYXNzd29yZCcsIHBsYWNlaG9sZGVyOiAncGFzc3dvcmQnIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICdwYXNzd29yZCcsIG5hbWU6ICdjb25maXJtYXRpb24nLCBwbGFjZWhvbGRlcjogJ2NvbmZpcm1hdGlvbicgfSlcbiAgICAgIF0pLFxuICAgICAgbSgnZGl2LnN1Ym1pdC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IG9uY2xpY2s6IGN0cmwudXBkYXRlVXNlciwgdHlwZTogJ3N1Ym1pdCcsIHZhbHVlOiAnVXBkYXRlIFVzZXInIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ3AnLCBbXG4gICAgICAgIG0oJ2EnLCB7IGhyZWY6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJyksIGNvbmZpZzogbS5yb3V0ZSB9LCAnQ2FuY2VsJylcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJFZGl0O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgcmVxSGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcmVxdWVzdC1oZWxwZXJzJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkT3V0TWVudSA9IHJlcXVpcmUoJy4uL2xheW91dC9sb2dnZWQtb3V0LW1lbnUuanMnKTtcblxudmFyIFVzZXJOZXcgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjcmVhdGVVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzL25ldycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlbWFpbDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2VtYWlsJylbMF0udmFsdWUsXG4gICAgICAgICAgcGFzc3dvcmQ6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdwYXNzd29yZCcpWzBdLnZhbHVlLFxuICAgICAgICAgIGNvbmZpcm1hdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2NvbmZpcm1hdGlvbicpWzBdLnZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICBleHRyYWN0OiByZXFIZWxwZXJzLm5vbkpzb25FcnJvcnMsXG4gICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgIGNvbmZpZzogcmVxSGVscGVycy5hc0Zvcm1VcmxFbmNvZGVkXG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEuZmFpbCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgbS5yb3V0ZSgnL2xvZ2luJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICBtLnJvdXRlKCcvdXNlcnMvbmV3Jyk7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2VtYWlsJylbMF0udmFsdWUgPSAnJztcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgncGFzc3dvcmQnKVswXS52YWx1ZSA9ICcnO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjb25maXJtYXRpb24nKVswXS52YWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgZm9ybSA9IHtcbiAgICAgIGVtYWlsOiBtLnByb3AoJycpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgY3JlYXRlVXNlcjogY3JlYXRlVXNlciwgZm9ybTogZm9ybSB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbihjdHJsKSB7XG4gICAgbGF5b3V0SGVscGVyKHtcbiAgICAgIG1lbnU6IExvZ2dlZE91dE1lbnVcbiAgICB9KTtcbiAgICByZXR1cm4gbSgnZGl2LmNvbnRlbnQtcGFydCcsIFtcbiAgICAgIG0oJ2gyJywgJ0NyZWF0ZSBBY2NvdW50JyksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAnZW1haWwnLCBuYW1lOiAnZW1haWwnLCBwbGFjZWhvbGRlcjogJ2VtYWlsJywgb25jaGFuZ2U6IG0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5mb3JtLmVtYWlsKSwgdmFsdWU6IGN0cmwuZm9ybS5lbWFpbCgpIH0pXG4gICAgICBdKSxcbiAgICAgIG0oJ2Rpdi5pbnB1dC1ibG9jaycsIFtcbiAgICAgICAgbSgnaW5wdXQnLCB7IHR5cGU6ICdwYXNzd29yZCcsIG5hbWU6ICdwYXNzd29yZCcsIHBsYWNlaG9sZGVyOiAncGFzc3dvcmQnIH0pLFxuICAgICAgXSksXG4gICAgICBtKCdkaXYuaW5wdXQtYmxvY2snLCBbXG4gICAgICAgIG0oJ2lucHV0JywgeyB0eXBlOiAncGFzc3dvcmQnLCBuYW1lOiAnY29uZmlybWF0aW9uJywgcGxhY2Vob2xkZXI6ICdjb25maXJtYXRpb24nIH0pLFxuICAgICAgXSksXG4gICAgICBtKCdkaXYuc3VibWl0LWJsb2NrJywgW1xuICAgICAgICBtKCdpbnB1dCcsIHsgb25jbGljazogY3RybC5jcmVhdGVVc2VyLCB0eXBlOiAnc3VibWl0JywgdmFsdWU6ICdDcmVhdGUgVXNlcicgfSlcbiAgICAgIF0pLFxuICAgICAgbSgncCcsIFtcbiAgICAgICAgbSgnYScsIHsgaHJlZjogJy8nLCBjb25maWc6IG0ucm91dGUgfSwgJ0NhbmNlbCcpXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyTmV3O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgbGF5b3V0SGVscGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9sYXlvdXQtaGVscGVyJyk7XG52YXIgTG9nZ2VkSW5NZW51ID0gcmVxdWlyZSgnLi4vbGF5b3V0L2xvZ2dlZC1pbi1tZW51LmpzJyk7XG52YXIgRmVlZFNlbGVjdCA9IHJlcXVpcmUoJy4uL2xheW91dC9mZWVkLXNlbGVjdCcpO1xudmFyIEZlZWRMaXN0ID0gcmVxdWlyZSgnLi4vZmVlZHMvZmVlZC1saXN0Jyk7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4vbW9kZWxzL3VzZXInKTtcbnZhciBGZWVkTGlzdGluZyA9IHJlcXVpcmUoJy4uL2ZlZWRzL2ZlZWQtbGlzdGluZycpO1xudmFyIEZlZWRzID0gcmVxdWlyZSgnLi4vZmVlZHMvL21vZGVscy9mZWVkcycpO1xudmFyIHJlcUhlbHBlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3JlcXVlc3QtaGVscGVycycpO1xuXG52YXIgVXNlclNob3cgPSB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWxldGVBY2NvdW50ID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZScpKSB7XG4gICAgICAgIG0ucmVxdWVzdCh7XG4gICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICB1cmw6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJyksXG4gICAgICAgICAgZXh0cmFjdDogcmVxSGVscGVycy5ub25Kc29uRXJyb3JzLFxuICAgICAgICAgIHNlcmlhbGl6ZTogcmVxSGVscGVycy5zZXJpYWxpemUsXG4gICAgICAgICAgY29uZmlnOiByZXFIZWxwZXJzLmFzRm9ybVVybEVuY29kZWRcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YS5mYWlsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgbS5yb3V0ZSgnLycpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgbS5yb3V0ZSgnL3VzZXJzLycgKyBtLnJvdXRlLnBhcmFtKCdpZCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBkZWxldGVBY2NvdW50OiBkZWxldGVBY2NvdW50LCB1c2VyOiBVc2VyKCksIGZlZWRzOiBGZWVkcygpIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBsYXlvdXRIZWxwZXIoe1xuICAgICAgbWVudTogTG9nZ2VkSW5NZW51LFxuICAgICAgdXNlcklkOiBtLnJvdXRlLnBhcmFtKCdpZCcpLFxuXG4gICAgICBmZWVkU2VsZWN0OiBGZWVkU2VsZWN0LFxuICAgICAgZmVlZHM6IGN0cmwudXNlcigpLmRhdGEuZmVlZHMsXG4gICAgICBjdXJyZW50RmVlZDogJ3NlbGVjdC1mZWVkJ1xuICAgIH0pO1xuICAgIHJldHVybiBtKCdkaXYuY29udGVudC1wYXJ0JywgW1xuICAgICAgbSgnaDInLCBjdHJsLnVzZXIoKS5kYXRhLmVtYWlsKSxcbiAgICAgIG0oJ2EuZWRpdC1idXR0b24nLCB7IGhyZWY6ICcvdXNlcnMvJyArIG0ucm91dGUucGFyYW0oJ2lkJykgKyAnL2VkaXQnLCBjb25maWc6IG0ucm91dGUgfSwgJ0VkaXQgQWNjb3VudCcpLFxuICAgICAgbSgnYnV0dG9uLmRlbGV0ZS1idXR0b24nLCB7IG9uY2xpY2s6IGN0cmwuZGVsZXRlQWNjb3VudCB9LCAnRGVsZXRlIEFjY291bnQnKSxcbiAgICAgIG0oJ2gyJywgJ015IEZlZWRzJyksXG4gICAgICBjdHJsLmZlZWRzKCkuZGF0YS5tYXAoZnVuY3Rpb24oZmVlZCkge1xuICAgICAgICByZXR1cm4gbS5jb21wb25lbnQoRmVlZExpc3RpbmcsIHsgZmVlZElkOiBmZWVkLl9pZCwgdGl0bGU6IGZlZWQudGl0bGUsIHVzZXJJZDogY3RybC5mZWVkcygpLnVzZXIuaWQgfSk7XG4gICAgICB9KVxuICAgIF0pXG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlclNob3c7XG4iXX0=
