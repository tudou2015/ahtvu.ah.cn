var STK = (function() {
	var that = {};
	var errorList = [];
	that.inc = function(key) {
		return true
	};
	that.register = function(ns, maker) {
		if (!ns || !maker) {
			return false
		}
		var NSList = ns.split(".");
		var step = that;
		var k = null;
		while (k = NSList.shift()) {
			if (NSList.length) {
				if (step[k] === undefined) {
					step[k] = {}
				}
				step = step[k]
			} else {
				if (step[k] === undefined) {
					try {
						step[k] = maker(that)
					} catch(exp) {}
				}
			}
		}
	};
	that.IE = /msie/i.test(navigator.userAgent);
	that.IE6 = /msie 6/i.test(navigator.userAgent);
	that.E = function(id) {
		if (typeof id === "string") {
			return document.getElementById(id)
		} else {
			return id
		}
	};
	that.C = function(tagName) {
		var dom;
		tagName = tagName.toUpperCase();
		if (tagName == "TEXT") {
			dom = document.createTextNode("")
		} else {
			if (tagName == "BUFFER") {
				dom = document.createDocumentFragment()
			} else {
				dom = document.createElement(tagName)
			}
		}
		return dom
	};
	that.log = function(str) {
		errorList.push("[" + (new Date()).toString() + "]: " + str)
	};
	that.getLogs = function() {
		return errorList
	};
	return that
})();
$Import = STK.inc;
STK.register("core.evt.eventUtil",
function() {
	return {
		addEvent: function(el, type, oFunc, sta) {
			if (el.attachEvent) {
				el.attachEvent("on" + type, oFunc)
			} else {
				if (el.addEventListener) {
					el.addEventListener(type, oFunc, sta || false)
				} else {
					el["on" + type] = oFunc
				}
			}
		},
		removeEvent: function(el, type, func, useCapture) {
			if (el.removeEventListener) {
				el.removeEventListener(type, func, useCapture)
			} else {
				if (el.detachEvent) {
					el.detachEvent("on" + type, func)
				} else {
					el["on" + type] = null
				}
			}
		}
	}
});
STK.register("core.pageM",
function() {
	var evt = STK.core.evt.eventUtil;
	var that = {};
	var nsCache = {};
	var nsList = [];
	that.add = function(ns) {
		if (!nsCache[ns]) {
			var t = ns.split(".");
			var fn = STK,
			i = 0;
			do {
				fn = fn[t[i]];
				i++
			} while ( i < t . length );
			nsList.push(ns);
			nsCache[ns] = fn
		}
	};
	that.start = function() {
		var d;
		for (var i = 0; i < nsList.length; i++) {
			try {
				d = nsList[i];
				if (d) {
					nsCache[d] = nsCache[d]()
				} else {
					STK.log("start:ns=" + i + " ,have not been registed")
				}
			} catch(e) {
				STK.log(e)
			}
		}
	};
	that.destroy = function() {
		var d;
		while (nsList.length) {
			try {
				d = nsList.shift();
				nsCache[d].destroy();
				nsCache[d] = null
			} catch(e) {}
		}
	};
	if (!window.jQuery) {
		document.addEventListener && evt.addEvent(document, "DOMContentLoaded", that.start);
		document.attachEvent && evt.addEvent(document, "onreadystatechange", that.start);
		evt.addEvent(window, "unload", that.destroy)
	} else {
		jQuery(document).ready(that.start);
		jQuery(window).unload(that.destroy)
	}
	return that
});

STK.register("core.arr.isArray",
function() {
	return function(o) {
		return Object.prototype.toString.call(o) === "[object Array]"
	}
});
STK.register("core.dom.getElementsByAttr",
function() {
	return function(node, attrK, attrV) {
		if (!node) {
			return
		}
		var DOM = [];
		if (document.createNodeIterator) {
			var iterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT, null, false);
			var nd = iterator.nextNode();
			while (nd != null) {
				if (nd.hasAttribute(attrK)) {
					if (attrV) {
						nd.getAttribute(attrK) == attrV && DOM.push(nd)
					} else {
						DOM.push(nd)
					}
				}
				nd = iterator.nextNode()
			}
		} else {
			for (var i = 0,
			l = node.childNodes.length; i < l; i++) {
				if (node.childNodes[i].nodeType == 1) {
					if (typeof node.childNodes[i].getAttribute(attrK) == "string") {
						if (attrV) {
							node.childNodes[i].getAttribute(attrK) == attrV && DOM.push(node.childNodes[i])
						} else {
							DOM.push(node.childNodes[i])
						}
					}
					if (node.childNodes[i].childNodes.length > 0) {
						DOM = DOM.concat(arguments.callee.call(null, node.childNodes[i], attrK, attrV))
					}
				}
			}
		}
		return DOM
	}
});
STK.register("core.dom.buildDom",
function() {
	var getByAttr = STK.core.dom.getElementsByAttr;
	return function(node) {
		var ls = getByAttr(node, "node-type");
		var d, DOM = {};
		var len = ls.length;
		var item;
		for (var i = 0; i < len; i++) {
			item = ls[i];
			d = item.getAttribute("node-type");
			if (!DOM[d]) {
				DOM[d] = item
			} else {
				if (STK.core.arr.isArray(DOM[d])) {
					DOM[d].push(item)
				} else {
					DOM[d] = [DOM[d]];
					DOM[d].push(item)
				}
			}
		}
		DOM.parentNode = node;
		return DOM
	}
});
STK.register("core.evt.getEvent",
function() {
	return function() {
		if (STK.IE) {
			return window.event
		} else {
			if (window.event) {
				return window.event
			}
			var o = arguments.callee.caller;
			var e;
			var n = 0;
			while (o != null && n < 40) {
				e = o.arguments[0];
				if (e && (e.constructor == Event || e.constructor == MouseEvent || e.constructor == KeyboardEvent)) {
					return e
				}
				n++;
				o = o.caller
			}
			return e
		}
	}
});
STK.register("core.evt.fixEvent",
function() {
	return function(e) {
		e = e || STK.core.evt.getEvent();
		if (!e.target) {
			e.target = e.srcElement;
			e.pageX = e.x;
			e.pageY = e.y
		}
		if (/mouseover/.test(e.type) && !e.relatedTarget) {
			e.relatedTarget = e.fromElement
		} else {
			if (/mouseout/.test(e.type) && !e.relatedTarget) {
				e.relatedTarget = e.toElement
			}
		}
		if (typeof e.layerX == "undefined") {
			e.layerX = e.offsetX
		}
		if (typeof e.layerY == "undefined") {
			e.layerY = e.offsetY
		}
		if (STK.IE) {
			var ver = /msie\s+\d+/i.exec(navigator.userAgent);
			ver && (ver = parseInt(/\d+/.exec(ver[0])));
			if (ver && ver < 9) {
				if (e.button == 1) {
					e.button = 0;
					e.which = 1
				} else {
					if (e.button == 4) {
						e.button = 1;
						e.which = 2
					} else {
						if (e.button == 2) {
							e.button = 2;
							e.which = 3
						}
					}
				}
			}
		}
		return e
	}
});

STK.register("core.arr.indexOf",
function() {
	return function(oElement, aSource) {
		if (aSource.indexOf) {
			return aSource.indexOf(oElement)
		}
		for (var i = 0,
		len = aSource.length; i < len; i++) {
			if (aSource[i] === oElement) {
				return i
			}
		}
		return - 1
	}
});
STK.register("core.arr.inArray",
function() {
	return function(oElement, aSource) {
		return STK.core.arr.indexOf(oElement, aSource) > -1
	}
});
STK.register("core.str.trim",
function() {
	return function(_str, loc) {
		var str = _str || "";
		var rnotwhite = /\S/,
		l = /^\s+/,
		r = /\s+$/;
		if (rnotwhite.test("\xA0")) {
			l = /^[\s\xA0]+/;
			r = /[\s\xA0]+$/
		}
		str = str.toString();
		return loc == "left" ? str.replace(l, "") : (loc == "right" ? str.replace(r, "") : str.replace(l, "").replace(r, ""))
	}
});
STK.register("core.json.queryToJson",
function() {
	return function(QS, isDecode) {
		var _Qlist = STK.core.str.trim(QS).split("&");
		var _json = {};
		var _fData = function(data) {
			if (isDecode) {
				return decodeURIComponent(data)
			} else {
				return data
			}
		};
		for (var i = 0,
		len = _Qlist.length; i < len; i++) {
			if (_Qlist[i]) {
				var _hsh = _Qlist[i].split("=");
				var _key = _hsh[0];
				var _value = _hsh[1];
				if (_hsh.length < 2) {
					_value = _key;
					_key = "$nullName"
				}
				if (!_json[_key]) {
					_json[_key] = _fData(_value)
				} else {
					if (STK.core.arr.isArray(_json[_key]) != true) {
						_json[_key] = [_json[_key]]
					}
					_json[_key].push(_fData(_value))
				}
			}
		}
		return _json
	}
});
STK.register("core.evt.delegatedEvent",
function() {
	var eventUtil = STK.core.evt.eventUtil;
	var indexOf = STK.core.arr.indexOf;
	var actEls = [],
	actElsEvtList = [];
	return function(actEl) {
		var that = {},
		evtList;
		if (!actEl) {
			return
		}
		var idx = indexOf(actEl, actEls);
		if (idx == -1) {
			actEls.push(actEl);
			idx = actEls.length - 1;
			actElsEvtList[idx] = {}
		}
		evtList = actElsEvtList[idx];
		var bindEvent = function(e) {
			var evt = STK.core.evt.fixEvent(e);
			var el = evt.target;
			var type = e.type;
			var checkBuble = function() {
				if (evtList[type] && evtList[type][actionType]) {
					return evtList[type][actionType]({
						evt: evt,
						el: el,
						box: actEl,
						data: STK.core.json.queryToJson(el.getAttribute("action-data") || "", 1)
					})
				} else {
					return true
				}
			};
			var actionType = null;
			while (el && el !== actEl) {
				actionType = el.getAttribute("action-type");
				if (actionType && checkBuble() === false) {
					break
				}
				el = el.parentNode
			}
		};
		that.add = function(funcName, evtType, process) {
			if (!evtList[evtType]) {
				evtList[evtType] = {};
				eventUtil.addEvent(actEl, evtType, bindEvent)
			}
			var ns = evtList[evtType];
			ns[funcName] = process
		};
		that.remove = function(funcName, evtType) {
			if (evtList[evtType]) {
				delete evtList[evtType][funcName];
				if (STK.core.obj.isEmpty(evtList[evtType])) {
					delete evtList[evtType];
					eventUtil.removeEvent(actEl, evtType, bindEvent)
				}
			}
		};
		that.destroy = function() {
			if (actEl) {
				evtList = actElsEvtList[indexOf(actEl, actEls)];
				for (k in evtList) {
					for (l in evtList[k]) {
						delete evtList[k][l]
					}
					delete evtList[k];
					eventUtil.removeEvent(actEl, k, bindEvent)
				}
				return
			}
			for (var i in actElsEvtList) {
				evtList = actElsEvtList[i];
				for (k in evtList) {
					for (l in evtList[k]) {
						delete evtList[k][l]
					}
					delete evtList[k];
					eventUtil.removeEvent(actEl, k, bindEvent)
				}
			}
		};
		return that
	}
});
STK.register("jobs.home.homeView",
function() {
	return function() {
		var buildDom = STK.core.dom.buildDom;
		var delegate = STK.core.evt.delegatedEvent;
		var handle;
		var node;
		var that = {
			DOM: {},
			current: 0,
			bodyWidth: 0,
			imgWidth: 0,
			maxWidth: 2232,
			initLeft: "",
			max: 5,
			interval: null,
			isAnimate: 0,
			imgLoader: ""
		};
		var C = {
			initState: function() {
				var bWidth = $("body").width();
				if (bWidth > that.maxWidth) {
					that.bodyWidth = that.maxWidth
				} else {
					if (bWidth < 960) {
						that.bodyWidth = 960
					} else {
						that.bodyWidth = bWidth
					}
				}
				$(that.DOM.pictureBox).css("width", that.bodyWidth + "px");
				that.imgWidth = $(that.DOM.picItem).width() + 24;
				that.initLeft = -(that.imgWidth - (that.bodyWidth - that.imgWidth) / 2);
				var tempWidth = that.initLeft + 12;
				$(that.DOM.pictures).css("left", that.initLeft + "px");
				$(that.DOM.maskLeft).css("left", tempWidth + "px");
				$(that.DOM.maskRight).css("right", tempWidth + "px")
			},
			slide: function(state) {
				if (that.isAnimate) {
					return
				}
				that.isAnimate = 1;
				var left = 0;
				$(that.DOM.smallPic[that.current]).removeClass("currentImg");
				that.current = that.current + state;
				C.move(500)
			},
			move: function(speed) {
				var left = 0;
				if (that.current >= that.max) {
					that.current = 0
				} else {
					if (that.current < 0) {
						that.current = that.max - 1
					}
				}
				left = that.initLeft - that.current * that.imgWidth;
				$(that.DOM.pictures).animate({
					left: left + "px"
				},
				speed,
				function() {
					that.isAnimate = 0
				});
				$(that.DOM.smallPic[that.current]).addClass("currentImg");
				bindDOMFuns.auto()
			}
		};
		var _trans = {};
		var bindDOMFuns = {
			prev: function(args) {
				C.slide( - 1)
			},
			next: function(args) {
				C.slide(1)
			},
			resize: function(e) {
				C.initState()
			},
			auto: function() {
				that.interval && clearTimeout(that.interval);
				that.interval = setTimeout(function() {
					C.slide(1)
				},
				6000)
			},
			over: function(e) {
				that.interval && clearTimeout(that.interval);
				that.interval = setTimeout(function() {
					if (that.isAnimate) {
						return
					}
					that.isAnimate = 1;
					var el = e.target || e.srcElement;
					if ($(el).attr("data-index") == undefined) {
						el = $(el).parent()
					}
					var index = parseInt($(el).attr("data-index"), 10);
					$(that.DOM.smallPic[that.current]).removeClass("currentImg");
					that.current = index - 1;
					C.move(200)
				},
				500)
			}
		};
		var Gls = ["prev", "next"];
		var bindDom = function() {
			var d;
			handle = delegate(node);
			for (var i = 0; i < Gls.length; i++) {
				d = Gls[i];
				handle.add(d, "click", bindDOMFuns[d])
			}
			$(window).bind("resize", bindDOMFuns.resize);
			$(node).delegate('[node-type="smallPic"]', "mouseover", bindDOMFuns.over)
		};
		var parseDom = function() {
			that.DOM = buildDom(node)
		};
		var checkParent = function() {
			return node
		};
		var destroy = function() {
			handle.destroy();
			$(window).unbind("resize", bindDOMFuns.resize);
			$(node).undelegate('[node-type="smallPic"]', "mouseover", bindDOMFuns.over)
		};
		var init = function() {
			node = STK.E("jobs_home_homeView");
			if (!checkParent()) {
				return
			}
			parseDom();
			bindDom();
			C.initState();
			bindDOMFuns.auto();
			that.imgLoader = STK.common.imgLoader(node)
		};
		that.destroy = destroy;
		init();
		return that
	}
});
STK.core.pageM.add("jobs.home.homeView");