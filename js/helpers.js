// @ts-ignore-line
const lodash = _.noConflict();
var _ = lodash;	// fixes type errors

function IsFile(filename) {
	return utils.FileTest(filename, 'e');
	// return "IsFile" in utils ? utils.IsFile(filename) : utils.FileTest(filename, "e");
}

function IsFolder(folder) {
	return utils.FileTest(folder, 'd');
	// return "IsFolder" in utils ? utils.IsFolder(folder) : utils.FileTest(folder, "d");
}

/**
 *
 * @param {string} titleFormatString Title format string to evaluate
 * @param {FbMetadbHandle=} metadb Handle to evaluate string with
 * @param {boolean=} force Force evaluate. Optional.
 */
function $(titleFormatString, metadb = undefined, force = false) {
	var tf;
	try {
		if (metadb) {
			tf = fb.TitleFormat(titleFormatString).EvalWithMetadb(metadb);
		} else {
			tf = fb.TitleFormat(titleFormatString).Eval(force);
		}
	} catch (e) {
		tf = e + " (Invalid metadb!)"
	};
	return tf;
}

/**
 * Given a metadata field of name, returns an array of all corresponding metadata values.
 * Will strip leading and trailing %'s from name.
 * @param {string} name
 * @param {FbMetadbHandle=} metadb
 * @returns {Array<string>}
 */
function getMetaValues(name, metadb = undefined) {
	let vals = [];
	const searchName = name.replace(/%/g, '');
	for (let i = 0; i < parseInt($(`$meta_num(${searchName})`, metadb)); i++) {
		vals.push($(`$meta(${searchName},${i})`, metadb));
	}
	if (!vals.length) {
		const unsplit = $(name, metadb);
		if (unsplit !== name) {
			vals = unsplit.split(', ');
		}
	}

	return vals;
}

/**
 * Use the debugLog function instead of console.log to easily hide messages that I don't want cluttering the console constantly
 * @type {function(...*):void} var_args
 */
const debugLog = (var_args) => {
	if (settings.showDebugLog) console.log(var_args);
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
var rgb = RGB;
var rgba = RGBA;

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

class ImageSize {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}

function testFont(fontName) {
	if (!utils.CheckFont(fontName)) {
		console.log('Error: Font "' + fontName + '" was not found. Please install it from the fonts folder');
		return false;
	}
	return true;
}

function calculateGridMaxTextWidth(gr, gridArray, font) {
	var maxWidth = 0;
	gridArray && gridArray.forEach(function (el) {
		const width = Math.ceil(gr.MeasureString(el.label, font, 0, 0, ww, wh).Width) + 1;
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
		if (measurements.Lines <= maxLines)
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
	var lineHeight;
	let continuation;

	for (var fontIndex = 0; fontIndex < fontList1.length && fontIndex < fontList2.length; fontIndex++) {
		textArray = [];
		lineHeight = Math.max(gr.CalcTextHeight(text1, fontList1[fontIndex]),
							  gr.CalcTextHeight(text2, fontList2[fontIndex]))
		continuation = false;	// does font change on same line
		var lineText = gr.EstimateLineWrap(text1, fontList1[fontIndex], availableWidth);
		for (var i = 0; i < lineText.length; i += 2) {
			textArray.push({ text: lineText[i], x_offset: 0, font: fontList1[fontIndex] });
		}
		if (textArray.length <= maxLines) {
			var lastLineWidth = lineText[lineText.length - 1];
			var secondaryText = gr.EstimateLineWrap(text2, fontList2[fontIndex], availableWidth - lastLineWidth - 5);
			let firstSecondaryLine = secondaryText[0];
			let textRemainder = text2.substr(firstSecondaryLine.length).trim();
			if (firstSecondaryLine.trim().length) {
				textArray.push({ text: firstSecondaryLine, x_offset: lastLineWidth + 5, font: fontList2[fontIndex] });
				continuation = true;	// font changes on same line
			}
			secondaryText = gr.EstimateLineWrap(textRemainder, fontList2[fontIndex], availableWidth);
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
			throw new ArgumentError('date', date, 'in calcAgeDateString()');
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

var timezoneOffset = 0;
function updateTimezoneOffset() {
	// this method is called from on_playback_new_track so we can gracefully handle DST adjustments and the like
	var temp = new Date();
	timezoneOffset = temp.getTimezoneOffset() * 60 * 1000;
}

function toTime(dateTimeStr) {
	/* foobar time strings are already in local time, so converting them to date objects treats
	 * them as UTC time, and again adjusts to local time, and the timezone offset is applied twice.
	 * Therefore we need to add it back in here.
	 */
	return new Date(toDatetime(dateTimeStr)).getTime() + timezoneOffset;
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
		const propValue = obj[propName]

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
	/** @type {*} */
	var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	xmlhttp.open(type, url, true);
	xmlhttp.setRequestHeader('User-Agent', 'foo_spider_monkey_georgia');
	xmlhttp.send();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState == 4) {
			successCB(xmlhttp.responseText);
		}
	};
}

// from: https://github.com/substack/semver-compare/issues/1#issuecomment-594765531
// release must be in form of 2.0.0-beta1, or 2.0.1
function isNewerVersion (oldVer, newVer) {
	const a = newVer.split('-');
	const b = oldVer.split('-');
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
function Menu(title = '') {
	Menu.itemIndex++;
	Menu.callbacks;
	Menu.variables;
	this.menu = window.CreatePopupMenu();
	this.title = title;
	this.systemMenu = false;
	this.menuManager = null;

	/**
	 * Creates default foobar menu corresponding to `name`.
	 * @param {string} name
	 */
	this.initFoobarMenu = function(name) {
		if (name) {
			this.systemMenu = true;
			this.menuManager = fb.CreateMainMenuManager();
			this.menuManager.Init(name);
			this.menuManager.BuildMenu(this.menu, 1, 1000);
		}
	}

	/**
	 * Adds a separator to the menu.
	 */
	this.addSeparator = function() {
		this.menu.AppendMenuSeparator();
	}

	/**
	 *
	 * @param {string} label
	 * @param {boolean} checked Should the menu item be checked
	 * @param {Function} callback
	 * @param {boolean=} [disabled=false]
	 */
	this.addItem = function(label, checked, callback, disabled = false) {
		this.addItemWithVariable(label, checked, undefined, callback, disabled);
	}

	/**
	 * Similar to addItem, but takes an object and property name which will automatically be set when the callback is called,
	 * before calling any user specified callback. If the property you wish to toggle is options.repeat, then propertiesObj
	 * is options, and the propertyName must be "repeat" as a string.
	 * @param {string} label
	 * @param {object} propertiesObj An object which contains propertyName
	 * @param {string} propertyName The name of the property to toggle on/off
	 * @param {?Function} callback
	 * @param {?boolean=} [disabled=false]
	 */
	this.addToggleItem = function(label, propertiesObj, propertyName, callback = () => {}, disabled = false) {
		this.addItem(label, propertiesObj[propertyName], () => {
			propertiesObj[propertyName] = !propertiesObj[propertyName];
			if (callback) {
				callback();
			}
		}, disabled);
	}

	/**
	 * Creates a set of radio items and checks the value specified
	 * @param {string[]} labels Array of strings which corresponds to each radio item
	 * @param {*} selectedValue Value of the radio item to be checked
	 * @param {*[]} variables Array of values which correspond to each radio entry. `selectedValue` will be checked against these values.
	 * @param {Function} callback
	 */
	this.addRadioItems = function(labels, selectedValue, variables, callback) {
		var startIndex = Menu.itemIndex;
		var selectedIndex;
		for (var i = 0; i < labels.length; i++) {
			this.menu.AppendMenuItem(MF_STRING, Menu.itemIndex, labels[i]);
			Menu.callbacks[Menu.itemIndex] = callback;
			Menu.variables[Menu.itemIndex] = variables[i];
			if (selectedValue === variables[i]) {
				selectedIndex = Menu.itemIndex;
			}
			Menu.itemIndex++;
		}
		if (selectedIndex) {
			this.menu.CheckMenuRadioItem(startIndex, Menu.itemIndex - 1, selectedIndex);
		}
	}

	/**
	 * Creates a submenu consisting of radio items
	 * @param {string} subMenuName
	 * @param {string[]} labels Array of strings which corresponds to each radio item
	 * @param {*} selectedValue Value of the radio item to be checked
	 * @param {*[]} variables Array of values which correspond to each radio entry. `selectedValue` will be checked against these values.
	 * @param {Function} callback
	 */
	this.createRadioSubMenu = function(subMenuName, labels, selectedValue, variables, callback) {
		var subMenu = new Menu(subMenuName);
		subMenu.addRadioItems(labels, selectedValue, variables, callback);
		subMenu.appendTo(this);
	}

	/**
	 * @param {string} label
	 * @param {boolean} checked Should the menu item be checked
	 * @param {*} variable Variable which will be passed to callback when item is clicked
	 * @param {Function} callback
	 * @param {boolean} disabled
	 */
	this.addItemWithVariable = function(label, checked, variable, callback, disabled) {
		this.menu.AppendMenuItem(MF_STRING | (disabled ? MF_DISABLED : 0), Menu.itemIndex, label);
		this.menu.CheckMenuItem(Menu.itemIndex, checked);
		Menu.callbacks[Menu.itemIndex] = callback;
		if (typeof variable !== 'undefined') {
			Menu.variables[Menu.itemIndex] = variable;
		}
		Menu.itemIndex++;
	}

	/**
	 * Appends menu to a parent menu
	 * @param {Menu} parentMenu
	 */
	this.appendTo = function(parentMenu) {
		this.menu.AppendTo(parentMenu.menu, MF_STRING, this.title);
	}

	/**
	 * handles callback and automatically Disposes menu
	 * @param {number} idx Value of the menu item's callback to call. Comes from menu.trackPopupMenu(x, y).
	 */
	this.doCallback = function(idx) {
		if (idx > menuStartIndex && Menu.callbacks[idx]) {
			Menu.callbacks[idx](Menu.variables[idx]);
		} else if (this.systemMenu) {
			idx && this.menuManager.ExecuteByID(idx - 1);
			this.menuManager = null;
		}
		this.menu = null;
		Menu.callbacks = [];
		Menu.variables = [];
		Menu.itemIndex = menuStartIndex;
	}

	/**
	 * @return {number} index of the menu item clicked on
	 */
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

const countryCodes = {
	'US': 'United States',
	'GB': 'United Kingdom',
	'AU': 'Australia',
	'DE': 'Germany',
	'FR': 'France',
	'SE': 'Sweden',
	'NO': 'Norway',
	'IT': 'Italy',
	'JP': 'Japan',
	'CN': 'China',
	'FI': 'Finland',
	'KR': 'South Korea',
	'RU': 'Russia',
	'IE': 'Ireland',
	'GR': 'Greece',
	'IS': 'Iceland',
	'IN': 'India',
	'AD': 'Andorra',
	'AE': 'United Arab Emirates',
	'AF': 'Afghanistan',
	'AG': 'Antigua and Barbuda',
	'AI': 'Anguilla',
	'AL': 'Albania',
	'AM': 'Armenia',
	'AO': 'Angola',
	'AQ': 'Antarctica',
	'AR': 'Argentina',
	'AS': 'American Samoa',
	'AT': 'Austria',
	'AW': 'Aruba',
	'AX': 'Åland',
	'AZ': 'Azerbaijan',
	'BA': 'Bosnia and Herzegovina',
	'BB': 'Barbados',
	'BD': 'Bangladesh',
	'BE': 'Belgium',
	'BF': 'Burkina Faso',
	'BG': 'Bulgaria',
	'BH': 'Bahrain',
	'BI': 'Burundi',
	'BJ': 'Benin',
	'BL': 'Saint Barthelemy',
	'BM': 'Bermuda',
	'BN': 'Brunei Darussalam',
	'BO': 'Bolivia',
	'BQ': 'Bonaire, Sint Eustatius and Saba',
	'BR': 'Brazil',
	'BS': 'Bahamas',
	'BT': 'Bhutan',
	'BV': 'Bouvet Island',
	'BW': 'Botswana',
	'BY': 'Belarus',
	'BZ': 'Belize',
	'CA': 'Canada',
	'CC': 'Cocos Keeling Islands',
	'CD': 'Democratic Republic of the Congo',
	'CF': 'Central African Republic',
	'CH': 'Switzerland',
	'CI': 'Cote d\'Ivoire',
	'CK': 'Cook Islands',
	'CL': 'Chile',
	'CM': 'Cameroon',
	'CO': 'Colombia',
	'CR': 'Costa Rica',
	'CU': 'Cuba',
	'CV': 'Cape Verde',
	'CX': 'Christmas Island',
	'CY': 'Cyprus',
	'CZ': 'Czech Republic',
	'DJ': 'Djibouti',
	'DK': 'Denmark',
	'DM': 'Dominica',
	'DO': 'Dominican Republic',
	'DZ': 'Algeria',
	'EC': 'Ecuador',
	'EE': 'Estonia',
	'EG': 'Egypt',
	'EH': 'Western Sahara',
	'ER': 'Eritrea',
	'ES': 'Spain',
	'ET': 'Ethiopia',
	'FJ': 'Fiji',
	'FK': 'Falkland Islands',
	'FM': 'Micronesia',
	'FO': 'Faroess',
	'GA': 'Gabon',
	'GD': 'Grenada',
	'GE': 'Georgia',
	'GG': 'Guernsey',
	'GH': 'Ghana',
	'GI': 'Gibraltar',
	'GL': 'Greenland',
	'GM': 'Gambia',
	'GN': 'Guinea',
	'GQ': 'Equatorial Guinea',
	'GS': 'South Georgia and the South Sandwich Islands',
	'GT': 'Guatemala',
	'GU': 'Guam',
	'GW': 'Guinea-Bissau',
	'GY': 'Guyana',
	'HK': 'Hong Kong',
	'HN': 'Honduras',
	'HR': 'Croatia',
	'HT': 'Haiti',
	'HU': 'Hungary',
	'ID': 'Indonesia',
	'IL': 'Israel',
	'IM': 'Isle of Man',
	'IQ': 'Iraq',
	'IR': 'Iran',
	'JE': 'Jersey',
	'JM': 'Jamaica',
	'JO': 'Jordan',
	'KE': 'Kenya',
	'KG': 'Kyrgyzstan',
	'KH': 'Cambodia',
	'KI': 'Kiribati',
	'KM': 'Comoros',
	'KN': 'Saint Kitts and Nevis',
	'KP': 'North Korea',
	'KW': 'Kuwait',
	'KY': 'Cayman Islands',
	'KZ': 'Kazakhstan',
	'LA': 'Laos',
	'LB': 'Lebanon',
	'LC': 'Saint Lucia',
	'LI': 'Liechtenstein',
	'LK': 'Sri Lanka',
	'LR': 'Liberia',
	'LS': 'Lesotho',
	'LT': 'Lithuania',
	'LU': 'Luxembourg',
	'LV': 'Latvia',
	'LY': 'Libya',
	'MA': 'Morocco',
	'MC': 'Monaco',
	'MD': 'Moldova',
	'ME': 'Montenegro',
	'MF': 'Saint Martin',
	'MG': 'Madagascar',
	'MH': 'Marshall Islands',
	'MK': 'Macedonia',
	'ML': 'Mali',
	'MM': 'Myanmar',
	'MN': 'Mongolia',
	'MO': 'Macao',
	'MP': 'Northern Mariana Islands',
	'MQ': 'Martinique',
	'MR': 'Mauritania',
	'MS': 'Montserrat',
	'MT': 'Malta',
	'MU': 'Mauritius',
	'MV': 'Maldives',
	'MW': 'Malawi',
	'MX': 'Mexico',
	'MY': 'Malaysia',
	'MZ': 'Mozambique',
	'NA': 'Namibia',
	'NC': 'New Caledonia',
	'NE': 'Niger',
	'NF': 'Norfolk Island',
	'NG': 'Nigeria',
	'NI': 'Nicaragua',
	'NL': 'Netherlands',
	'NP': 'Nepal',
	'NR': 'Nauru',
	'NU': 'Niue',
	'NZ': 'New Zealand',
	'OM': 'Oman',
	'PA': 'Panama',
	'PE': 'Peru',
	'PF': 'French Polynesia',
	'PG': 'Papua New Guinea',
	'PH': 'Philippines',
	'PK': 'Pakistan',
	'PL': 'Poland',
	'PM': 'Saint Pierre and Miquelon',
	'PN': 'Pitcairn',
	'PR': 'Puerto Rico',
	'PS': 'Palestine',
	'PT': 'Portugal',
	'PW': 'Palau',
	'PY': 'Paraguay',
	'QA': 'Qatar',
	'RE': 'Réunion',
	'RO': 'Romania',
	'RS': 'Serbia',
	'RW': 'Rwanda',
	'SA': 'Saudi Arabia',
	'SB': 'Solomon Islands',
	'SC': 'Seychelles',
	'SD': 'Sudan',
	'SG': 'Singapore',
	'SH': 'Saint Helena',
	'SI': 'Slovenia',
	'SJ': 'Svalbard and Jan Mayen',
	'SK': 'Slovakia',
	'SL': 'Sierra Leone',
	'SM': 'San Marino',
	'SN': 'Senegal',
	'SO': 'Somalia',
	'SR': 'Suriname',
	'SS': 'South Sudan',
	'ST': 'Sao Tome and Principe',
	'SV': 'El Salvador',
	'SX': 'Sint Maarten',
	'SY': 'Syrian Arab Republic',
	'SZ': 'Swaziland',
	'TC': 'Turks and Caicos Islands',
	'TD': 'Chad',
	'TF': 'French Southern Territories',
	'TG': 'Togo',
	'TH': 'Thailand',
	'TJ': 'Tajikistan',
	'TK': 'Tokelau',
	'TL': 'Timor-Leste',
	'TM': 'Turkmenistan',
	'TN': 'Tunisia',
	'TO': 'Tonga',
	'TR': 'Turkey',
	'TT': 'Trinidad and Tobago',
	'TV': 'Tuvalu',
	'TW': 'Taiwan',
	'TZ': 'Tanzania',
	'UA': 'Ukraine',
	'UG': 'Uganda',
	'UY': 'Uruguay',
	'UZ': 'Uzbekistan',
	'VA': 'Vatican City',
	'VC': 'Saint Vincent and the Grenadines',
	'VE': 'Venezuela',
	'VI': 'US Virgin Islands',
	'VN': 'Vietnam',
	'VU': 'Vanuatu',
	'WF': 'Wallis and Futuna',
	'WS': 'Samoa',
	'XE': 'European Union',	// Musicbrainz code for European releases. Council of Europe uses same flag as EU.
	'XW': 'United Nations', // Musicbrainz code for all World releases. Uses the UN flag which is the MB standard.
	'YE': 'Yemen',
	'YT': 'Mayotte',
	'ZA': 'South Africa',
	'ZM': 'Zambia',
	'ZW': 'Zimbabwe'
};
function convertIsoCountryCodeToFull(code) {
	if (code.length === 2) {
		return countryCodes[code];
	}
	return code;
}

let DPI = 96;
try {
	DPI = WshShell.RegRead('HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI');
} catch (e) {
}

_.mixin({
	runCmd:               function (command, wait, show) {
		try {
			WshShell.Run(command, show ? 1 : 0, wait ? wait : false);
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
	tt:                   function (text, force) {
		if (g_tooltip.Text !== text.toString() || force) {
			g_tooltip.Text = text;
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
		this.id = Math.ceil(Math.random() * 10000);

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
			if (tooltip_timer) {
				this.force_stop(); /// < There can be only one tooltip present at all times, so we can kill the timer w/o any worries
			}

			if (!tooltip_timer) {
				tooltip_timer = setTimeout(function() {
					_.tt(text);
					tooltip_timer = null;
				}, 300);
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
			clearTimeout(tooltip_timer);
			tooltip_timer = null;
			tt_caller = null;
		}
	};
};