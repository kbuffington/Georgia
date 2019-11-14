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

function isNewerVersion (oldVer, newVer) {
	var oldParts = oldVer.split('.');
	var newParts = newVer.split('.');
	for (var i = 0; i < newParts.length; i++) {
		var a = parseInt(newParts[i]) || 0
		var b = parseInt(oldParts[i]) || 0
		if (a > b) return true
		if (a < b) return false
	}
	return false
}

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