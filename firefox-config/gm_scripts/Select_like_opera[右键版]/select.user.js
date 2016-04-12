﻿// ==UserScript==
// @name					Select like opera[右键版]
// @namespace				lkytal
// @author					lkytal-modified by AC
// @homepage				http://lkytal.github.io/
// @icon					http://lkytal.qiniudn.com/ic.ico
// @version					1.1.3
// @description				Select texts insider links, for firefox only
// @include					*
// @grant					unsafeWindow
// @grant					GM_getValue
// @grant					GM_setValue
// ==/UserScript==

selectLikeOpera = function() {
	var findHTMLAchor = function(a) {
		if (a.nodeType === 3) a = a.parentNode;
		do {
			if (a.constructor === HTMLAnchorElement) return a;
		} while ((a = a.parentNode) && a !== document.body);
		return null;
	};
	
	var preventEvent = function(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};
	
	var rangeOperator = (function() {
		var w = typeof InstallTrigger === 'undefined';
		return {
			createRange: function(x, y) {
				if (w) {
					return document.caretRangeFromPoint(x, y)
				}
				else
				{
					var a = document.createRange();
					var p = document.caretPositionFromPoint(x, y);
					a.setStart(p.offsetNode, p.offset);
					return a;
				}
				return null;
			},
			rangeAttr: ((w ? '-webkit-' : '-moz-') + 'user-select')
		}
	})();
	
	var j = (function() {
		var o = [{
			p: rangeOperator.rangeAttr,
			v: 'text'
		}, {
			p: 'outline-width',
			v: 0
		}];
		var n;
		var s;
		return function(a) {
			if (a) {
				n = a, s = [];
				for (var i = o.length - 1; i >= 0; i -= 1) {
					s.push([n.style.getPropertyValue(o[i].p), n.style.getPropertyPriority(o[i].p)]);
					n.style.setProperty(o[i].p, o[i].v, 'important');
				}
			}
			else if (n)
			{
				for (var i = o.length; i-- > 0;) {
					n.style.removeProperty(o[i].p);
					if (s[i][0] !== null) n.style.setProperty(o[i].p, s[i][0], s[i][1]);
				}
				n = s = null
			}
		}
	})();
	
	var toggleEvent = function(events, bAdd) {
		if (bAdd === undefined) bAdd = true;
		if (events.constructor !== Array) events = [events];

		for (var i = 0, len = events.length; i < len; i += 1)
		{
			if (bAdd)
			{
				document.addEventListener(events[i], eventList[events[i]], true);
			}
			else
			{
				document.removeEventListener(events[i], eventList[events[i]], true);
			}
		}
	};
	
	var removeEvent = function(a) {
		toggleEvent(a, false);
	};
	
	var m, q, u, v, z, A = function() {
		q = v = true;
		u = z = false;
	};
	
	var B, selected = document.getSelection();
	
	selectEvent = function(e) {
		if (e.which == 3) {
			A();
			var x = e.clientX,
				y = e.clientY;
			if (selected.rangeCount > 0) {
				var a = selected.getRangeAt(0);
				if (!a.collapsed) {
					var r = rangeOperator.createRange(x, y);
					if (r && a.isPointInRange(r.startContainer, r.startOffset)) return;
				}
			}
			j();
			var t = e.target,
				n = findHTMLAchor(t);
			if (!n) n = t.nodeType !== 3 ? t : t.parentNode;
			if (n.constructor === HTMLCanvasElement || n.textContent === '') return;
			var r = n.getBoundingClientRect();
			B = {
				n: n,
				x: Math.round(r.left),
				y: Math.round(r.top),
				c: 0
			};
			m = {
				x: x,
				y: y
			};
			toggleEvent(['mousemove', 'mouseup', 'dragend', 'dragstart']);
			j(n);
		}
	};
	
	var D = 3,
		K = 0.8,
		eventList = {
			'mousemove': function(e) {
				if (B) {
					if (B.c++ < 12) {
						var r = B.n.getBoundingClientRect();
						if (Math.round(r.left) !== B.x || Math.round(r.top) !== B.y) {
							removeEvent(['mousemove', 'mouseup', 'dragend', 'dragstart', 'click']);
							j();
							selected.removeAllRanges();
							return;
						}
					} else {
						B = null;
					}
				}
				var x = e.clientX,
					y = e.clientY;
				if (v) {
					selected.removeAllRanges();
					var a = x > m.x ? -2 : 2;
					var b = rangeOperator.createRange(x + a, y);
					if (b) {
						selected.addRange(b);
						v = false;
					}
				}
				if (q) {
					var c = Math.abs(m.x - x),
						d = Math.abs(m.y - y);
					u = d === 0 || c / d > K;
					if (c > D || d > D) {
						q = false;
						z = true;
						toggleEvent('click');
					}
				}
				if (u) {
					var b = rangeOperator.createRange(x, y);
					if (b) selected.extend(b.startContainer, b.startOffset);
				}
			},
			'dragstart': function(e) {
				removeEvent('dragstart');
				if (u) return preventEvent(e);
			},
			'mouseup': function(e) {
				removeEvent(['mousemove', 'mouseup', 'dragstart', 'dragend']);
				if (!u && z) z = false;
				setTimeout(function() {
					removeEvent('click');
				}, 111);
			},
			'dragend': function(e) {
				removeEvent(['dragend', 'mousemove', 'mouseup']);
			},
			'click': function(e) {
				removeEvent('click');
				if (z) return preventEvent(e);
			}
		};

	document.addEventListener('mousedown', selectEvent, true);
};

setTimeout(selectLikeOpera, 300);
