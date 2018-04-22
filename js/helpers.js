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
		width = gr.CalcTextWidth(el.label, font);
		if (width + 1> maxWidth) {
			maxWidth = width + 1;
		}
	});
	return maxWidth;
}

function calcAgeDateString(date) {
    console.log('calcAgeDateString:', date);
    var str = "";
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
        fail();
    }

    return str.trim();
}

function $date(dateStr) {
    return $('$date(' + dateStr + ')');
}

function toDatetime(dateTimeStr) {
    return dateTimeStr.replace(' ', 'T') + pref.time_zone;
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

function toPaddedHexString(num, len) {
    return ("000000" + num.toString(16)).substr(-6)
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
