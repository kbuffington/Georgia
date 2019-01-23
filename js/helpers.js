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

function StringFormat() {
	var h_align = 0, v_align = 0, trimming = 0, flags = 0;
	switch (arguments.length) {
		// fall-through
		case 4: flags = arguments[3];
		case 3: trimming = arguments[2];
		case 2: v_align = arguments[1];
		case 1: h_align = arguments[0]; break;
		default: return 0;
	}
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
// TODO: add maxLines field so this can be used multiple places. Possibly handle multiple text/font combos
function chooseFontForWidth(gr, availableWidth, text, fontList) {
	var fontIndex = undefined;
	for (var i = 0; i < fontList.length; i++) {
		fontIndex = i;
		var width = Math.ceil(gr.MeasureString(text, fontList[fontIndex], 0, 0, 0, 0).Width) + 1;
		if (width <= availableWidth)
			break;
	}
	return fontIndex !== undefined ? fontList[fontIndex] : null;
}

function calcAgeDateString(date) {
	var str = '';
	if (date.length) {
		try {
			var days = calcAge($date(date), true);

			var then = new Date($date(date));

			var diffDate = new Date(new Date() - then);
			if (diffDate.toISOString().slice(0, 4) - 1970) {
				str = (diffDate.toISOString().slice(0, 4) - 1970) + 'y ';
			}
			if (diffDate.getMonth()) {
				str += diffDate.getMonth() + 'm ';
			}
			if (diffDate.getDate()-1) {
				str += (diffDate.getDate()-1) + 'd';
			}
		} catch (e) {
			console.log(e);
			console.log('date:', date, 'days:', days, 'then:', then);
			// fail();
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
    return dateTimeStr.replace(' ', 'T') + pref.time_zone;
}

function toTime(dateTimeStr) {
	return new Date(toDatetime(dateTimeStr)).getTime();
}

function calcAge(date, roundAge) {
	var round = 1000;		// round to the second
	if (roundAge) {
		round = 86400000;	// milliseconds in a day
	}
	var now = new Date();
	var then = new Date(date);
	var age = Math.floor(now.getTime() / round) - Math.floor(then.getTime() / round);

	return age;
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

var sizeInitialized = false;
var last_size = undefined;

function checkFor4k(w) {
	if (pref.use_4k === 'always') {
		is_4k = true;
	} else if (pref.use_4k === 'auto' && w > 3000) {
		is_4k = true;
	} else {
		is_4k = false;
	}
	if (last_size !== is_4k) {
		sizeInitialized = false;
		last_size = is_4k;
	}
}