function IsFile(filename) {
	return "IsFile" in utils ? utils.IsFile(filename) : utils.FileTest(filename, "e");
}

function IsFolder(folder) {
	return "IsFolder" in utils ? utils.IsFolder(folder) : utils.FileTest(folder, "d");
}

function $(field, metadb) {
	metadb = metadb || false;
	var tf;
	try {
		if (metadb) {
			tf = fb.TitleFormat(field).EvalWithMetadb(metadb);
		} else {
			tf = fb.TitleFormat(field).Eval();
		}
	} catch (e) {
		tf = e + " (Invalid metadb!)"
	};
	return tf;
}

/**
 * Accepts 1-4 parameters, corresponding to h_align, v_align, trimming, flags
 * @param {number} [h_align] - 0: Near, 1: Center, 2: Far
 * @param {number} [v_align] - 0: Near, 1: Center, 2: Far
 * @param {number} [trimming] - 0: None, 1: Char, 2: Word, 3: Ellipses char, 4: Ellipses word, 5: Ellipses path
 * @param {number} [flags] - `|`'d together flags. See g_string_format in Common.js
 */
function StringFormat(h_align, v_align, trimming, flags) {
	if (!h_align) h_align = 0;
	if (!v_align) v_align = 0;
	if (!trimming) trimming = 0;
	if (!flags) flags = 0;

	return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
}

function getAlpha(color) {
	return ((color >> 24) & 0xff);
}

function getRed(color) {
	return ((color >> 16) & 0xff);
}

function getGreen(color) {
	return ((color >> 8) & 0xff);
}

function getBlue(color) {
	return (color & 0xff);
}

function RGB(r, g, b) { return (0xff000000 | (r << 16) | (g << 8) | (b)); }
function RGBA(r, g, b, a) { return ((a << 24) | (r << 16) | (g << 8) | (b)); }
function RGBtoRGBA (rgb, a) { return a << 24 | (rgb & 0x00FFFFFF); }

function colToRgb(c, showPrefix) {
	if (typeof showPrefix === 'undefined') showPrefix = true;
	var alpha = getAlpha(c);
	var prefix = '';
	if (alpha < 255) {
		if (showPrefix) prefix = 'rgba'
		return prefix + '('+ getRed(c) + ', ' + getGreen(c) + ', ' + getBlue(c) + ', ' + alpha + ')';
	} else {
		if (showPrefix) prefix = 'rgb'
		return prefix + '(' + getRed(c) + ', ' + getGreen(c) + ', ' + getBlue(c) + ')';
	}
}

function calcBrightness(c) {
	var r = getRed(c);
	var g = getGreen(c);
	var b = getBlue(c);
	return Math.round(Math.sqrt( 0.299*r*r + 0.587*g*g + 0.114*b*b ));
}
var rgb = RGB;
var rgba = RGBA;

function ImageSize(x, y, w, h) {
	return {
		x: x,
		y: y,
		w: w,
		h: h,
	};
}

function testFont(fontName) {
	if (!utils.checkFont(fontName)) {
		console.log('Error: Font "' + fontName + '" was not found. Please install it from the fonts folder');
	}
}

function calculateGridMaxTextWidth(gr, gridArray, font) {
	var maxWidth = 0;
	gridArray && gridArray.forEach(function (el) {
        width = Math.ceil(gr.MeasureString(el.label, font, 0, 0, ww, wh).Width) + 1;
		if (width > maxWidth) {
			maxWidth = width;
		}
	});
	return maxWidth;
}

/** Given an array of fonts, returns a single font which the given text will fully fit the
 *  availableSpace, or the last font in the list (should be the smallest and text will be truncated)
 * */
function chooseFontForWidth(gr, availableWidth, text, fontList, maxLines) {
    maxLines = (typeof maxLines !== 'undefined') ? maxLines : 1;
	var fontIndex = undefined;
	for (var i = 0; i < fontList.length; i++) {
		fontIndex = i;
		var measurements = gr.MeasureString(text, fontList[fontIndex], 0, 0, availableWidth, 0);
		if (measurements.lines <= maxLines)
			break;
	}
	return fontIndex !== undefined ? fontList[fontIndex] : null;
}

/** Given two different texts, and two different font arrays, draws both lines of text
 *  in the maximum number of lines available, using the largest font where all of the text
 *  will fit. Where text1 ends and text2 begins will be on the same line if possible, switching
 *  fonts in between.
 *  Returns the height of the drawn text
*/
function drawMultipleLines(gr, availableWidth, left, top, color, text1, fontList1, text2, fontList2, maxLines) {
	maxLines = (typeof maxLines !== 'undefined') ? maxLines : 2;
	var textArray;
	var continuation;
	var lineHeight;
	height = 0;
	for (var fontIndex = 0; fontIndex < fontList1.length && fontIndex < fontList2.length; fontIndex++) {
		textArray = [];
		lineHeight = Math.max(gr.CalcTextHeight(text1, fontList1[fontIndex]),
							  gr.CalcTextHeight(text2, fontList2[fontIndex]))
		var continuation = false;	// does font change on same line
		var lineText = gr.EstimateLineWrap(text1, fontList1[fontIndex], availableWidth).toArray();
		for (var i = 0; i < lineText.length; i += 2) {
			textArray.push({ text: lineText[i], x_offset: 0, font: fontList1[fontIndex] });
		}
		if (textArray.length <= maxLines) {
			var lastLineWidth = lineText[lineText.length - 1];
			var secondaryText = gr.EstimateLineWrap(text2, fontList2[fontIndex], availableWidth - lastLineWidth - 5).toArray();
			firstSecondaryLine = secondaryText[0];
			textRemainder = text2.substr(firstSecondaryLine.length).trim();
			if (firstSecondaryLine.trim().length) {
				textArray.push({ text: firstSecondaryLine, x_offset: lastLineWidth + 5, font: fontList2[fontIndex] });
				continuation = true;	// font changes on same line
			}
			secondaryText = gr.EstimateLineWrap(textRemainder, fontList2[fontIndex], availableWidth).toArray();
			for (var i = 0; i < secondaryText.length; i += 2) {
				textArray.push({ text: secondaryText[i], x_offset: 0, font: fontList2[fontIndex] });
			}
		}
		if (textArray.length - (continuation ? 1 : 0) <= maxLines) break;
	}
	var y_offset = 0;
	var linesDrawn = 0;
	var cutoff = false;
	if (textArray.length > maxLines + (continuation ? 1 : 0)) {
		cutoff = true;
	}
	textArray.splice(maxLines + (continuation ? 1 : 0));
	for (var i = 0; i < textArray.length; i++) {
		var line = textArray[i];
		if (line.x_offset) {
			// continuation line, so move back up for drawing
			y_offset -= lineHeight;
		} else if (line.text.length) {
			linesDrawn++;
		}
		if (i === textArray.length - 1 && cutoff) {
			line.text += ' ABCDEFGHIJKMLNOPQRSTUVWXYZABCDEFGHIJKMLNOPQRSTUVWXYZ';	// trigger elipses
		}
		gr.DrawString(line.text, line.font, color, left + line.x_offset, top + y_offset,
			availableWidth - line.x_offset, lineHeight, g_string_format.trim_ellipsis_word);
		y_offset += lineHeight;
	}
	return linesDrawn * lineHeight;
}

function dateDiff(startingDate, endingDate) {
    var hasStartDay = (startingDate.length > 7) ? true : false;
    if (!hasStartDay) {
        startingDate = startingDate + '-02';    // avoid timezone issues
    }
    var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
    if (!endingDate) {
        endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
	}
	var endDate = new Date(endingDate);
    if (startDate > endDate) {
        var swap = startDate;
        startDate = endDate;
        endDate = swap;
    }
    var startYear = startDate.getFullYear();
    var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var yearDiff = endDate.getFullYear() - startYear;
    var monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
    }
    var dayDiff = 0;
    if (hasStartDay) {
        dayDiff = endDate.getDate() - startDate.getDate();
        if (dayDiff < 0) {
            if (monthDiff > 0) {
                monthDiff--;
            } else {
                yearDiff--;
                monthDiff = 11;
            }
            dayDiff += daysInMonth[startDate.getMonth()];
        }
    }

    return (yearDiff ? yearDiff + 'y ' : '') + (monthDiff > 0 ? monthDiff + 'm ': '') + (dayDiff ? dayDiff + 'd': '');
}

function calcAgeDateString(date) {
	var str = '';
	if (date.length) {
		try {
            str = dateDiff($date(date));
		} catch (e) {
			console.log(e);
			console.log('date:', date);
			fail();
			str = '';
		}
	}

    return str.trim();
}

function $date(dateStr) {
    return $('$date(' + dateStr + ')');
}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

function toDatetime(dateTimeStr) {
	// convert FB datetime string into one that we can call new Date() on
    return dateTimeStr.replace(' ', 'T');
}

function toTime(dateTimeStr) {
	return new Date(toDatetime(dateTimeStr)).getTime();
}

function calcAge(date) {
	var round = 1000;		// round to the second
	var now = new Date();
	var age = Math.floor(now.getTime() / round) - Math.floor(date / round);

	return age;
}

function calcAgeRatio(num, divisor) {
	return toFixed(1.0 - (calcAge(num) / divisor), 3);
}

function toFixed(number, precision) {
    var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}

function printColorObj(obj) {
	console.log('\tname: \'\',\n\tcolors: {');
	for(var propName in obj) {
		propValue = obj[propName]

		console.log('\t\t' + propName + ': ' + colToRgb(propValue, true) + ',\t\t// #' + toPaddedHexString(0xffffff & propValue, 6));
	}
	console.log('\t},\n\thint: [' + colToRgb(obj.primary, true) + ']');
}

function colorToHSLString(col) {
    return leftPad(col.hue, 3) + ' '  + leftPad(col.saturation, 3) + ' ' + leftPad(col.lightness,3);
}

function toPaddedHexString(num, len) {
    return padNumber(num, len, 16);
}

function padNumber(num, len, base) {
    if (!base) {
        base = 10;
    }
    return ('000000' + num.toString(base)).substr(-len);
}

function leftPad(val, size, ch) {
	var result = String(val);
	if(!ch) {
		ch = ' ';
	}
	while (result.length < size) {
		result = ch + result;
	}
	return result;
}

function makeHttpRequest(type, url, successCB) {
	var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	xmlhttp.open(type, url, true);
	xmlhttp.setRequestHeader('User-Agent', 'foo_jscript_panel_georgia');
	xmlhttp.send();
	xmlhttp.onreadystatechange = _.bind(function () {
		if (xmlhttp.readyState == 4) {
			successCB(xmlhttp.responseText);
		}
	}, this);
}

// from: https://github.com/substack/semver-compare/issues/1#issuecomment-594765531
function isNewerVersion (oldVer, newVer) {
	a = newVer.split('-');
	b = oldVer.split('-');
	var pa = a[0].split('.');
	var pb = b[0].split('.');
	for (var i = 0; i < 3; i++) {
		var na = Number(pa[i]);
		var nb = Number(pb[i]);
		if (na > nb) return true;
		if (nb > na) return false;
		if (!isNaN(na) && isNaN(nb)) return true;
		if (isNaN(na) && !isNaN(nb)) return false;
	}
	if (a[1] && b[1]) {
		return a[1] > b[1] ? true : false;
	}
	return !a[1] && b[1] ? true : false;
}

var menuStartIndex = 100;	// can be anything except 0
function Menu(title) {
	Menu.itemIndex++;
	Menu.callbacks;
	Menu.variables;
	this.menu = window.CreatePopupMenu();
	this.title = title;

	this.addSeparator = function() {
		this.menu.AppendMenuSeparator();
	}

	this.addItem = function(label, enabled, callback, disabled) {
		this.addItemWithVariable(label, enabled, undefined, callback, disabled);
	}
	
	/** similar to addItem, but takes an object and property name which will automatically be set when the callback is called, 
	  * before calling any user specified callback. If the property you wish to toggle is options.repeat, then propertiesObj
	  * is options, and the propertyName must be "repeat" as a string.
	  **/
	this.addToggleItem = function(label, propertiesObj, propertyName, callback, disabled) {
		this.addItem(label, propertiesObj[propertyName], function () {
			propertiesObj[propertyName] = !propertiesObj[propertyName];
			if (callback) {
				callback();
			}
		}, disabled);
	}

	// creates a set of radio items and checks the value specified 
	this.addRadioItems = function(labels, radioValue, variables, callback) {
		var startIndex = Menu.itemIndex;
		var selectedIndex;
		for (var i = 0; i < labels.length; i++) {
			this.menu.AppendMenuItem(MF_STRING, Menu.itemIndex, labels[i]);
			Menu.callbacks[Menu.itemIndex] = callback;
			Menu.variables[Menu.itemIndex] = variables[i];
			if (radioValue === variables[i]) {
				selectedIndex = Menu.itemIndex;
			}
			Menu.itemIndex++;
		}
		this.menu.CheckMenuRadioItem(startIndex, Menu.itemIndex - 1, selectedIndex);
	}

	this.createRadioSubMenu = function(subMenuName, labels, radioValue, variables, callback) {
		var subMenu = new Menu(subMenuName);
		subMenu.addRadioItems(labels, radioValue, variables, callback);
		subMenu.appendTo(this);
	}

	this.addItemWithVariable = function(label, enabled, variable, callback, disabled) {
		this.menu.AppendMenuItem(MF_STRING | disabled ? MF_DISABLED : 0, Menu.itemIndex, label);
		this.menu.CheckMenuItem(Menu.itemIndex, enabled);
		Menu.callbacks[Menu.itemIndex] = callback;
		if (typeof variable !== 'undefined') {
			Menu.variables[Menu.itemIndex] = variable;
		}
		Menu.itemIndex++;
	}

	this.appendTo = function(parentMenu) {
		this.menu.appendTo(parentMenu.menu, MF_STRING, this.title);
	}

	// handles callback and automatically Disposes menu
	this.doCallback = function(idx) {
		if (idx > menuStartIndex) {
			Menu.callbacks[idx](Menu.variables[idx]);
		}
		this.menu.Dispose();
		Menu.callbacks = [];
		Menu.variables = [];
		Menu.itemIndex = menuStartIndex;
	}

	this.trackPopupMenu = function (x, y) {
		return this.menu.TrackPopupMenu(x, y);
	}
}
Menu.itemIndex = menuStartIndex;	// TODO: in SMP initialize these values inside the class
Menu.callbacks = [];
Menu.variables = [];

// setup variables for 4k check
var sizeInitialized = false;
var last_size = undefined;

function checkFor4k(w, h) {
	if (pref.use_4k === 'always') {
		is_4k = true;
	} else if (pref.use_4k === 'auto' && (w > 3000 || h > 1400)) {
		is_4k = true;
	} else {
		is_4k = false;
	}
	if (last_size !== is_4k) {
		sizeInitialized = false;
		last_size = is_4k;
	}
}

function scaleForDisplay(number) {
	return is_4k ? number * 2 : number;
}

try {
	var DPI = WshShell.RegRead('HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI');
} catch (e) {
	var DPI = 96;
}

_.mixin({
	runCmd:               function (command, wait, show) {
		try {
			WshShell.Run(command, show ? 1 : 0, !_.isNil(wait) ? wait : false);
			return true;
		} catch (e) {
			return false;
		}
	},
	scale:                function (size) {
        return Math.round(size * DPI / 72);
    },
    toDb:                 function (volume) {
        return 50 * Math.log(0.99 * volume + 0.01) / Math.LN10;
    },
    tt:                   function (value, force) {
        if (g_tooltip.Text !== _.toString(value) || force) {
            g_tooltip.Text = value;
            g_tooltip.Activate();
        }
    },
    /** @constructor */
    tt_handler:           function () {
        this.showDelayed = function (text) {
            tt_timer.start(this.id, text);
        };
        this.showImmediate = function (text) {
            tt_timer.stop(this.id);
            _.tt(text);
        };
        this.clear = function () {
            tt_timer.stop(this.id);
        };
        this.stop = function () {
            tt_timer.force_stop();
        };
		this.id = Math.ceil(Math.random().toFixed(8) * 1000);

        var tt_timer = _.tt_handler.tt_timer;
    },
});

_.tt_handler.tt_timer = new function () {
    var tooltip_timer;
    var tt_caller = undefined;

    this.start = function (id, text) {
        var old_caller = tt_caller;
        tt_caller = id;

        if (!tooltip_timer && g_tooltip.Text) {
            _.tt(text, old_caller !== tt_caller );
        }
        else {
            this.force_stop(); /// < There can be only one tooltip present at all times, so we can kill the timer w/o any worries

            if (!tooltip_timer) {
                tooltip_timer = window.SetTimeout(_.bind(function () {
                    _.tt(text);
                    tooltip_timer = null;
                }, this), 500);
            }
        }
    };

    this.stop = function (id) {
        if (tt_caller === id) {// Do not stop other callers
            this.force_stop();
        }
    };

    this.force_stop = function () {
        _.tt('');
        if (tooltip_timer) {
            window.ClearTimeout(tooltip_timer);
            tooltip_timer = null;
        }
    };
};