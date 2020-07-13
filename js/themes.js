var themeArray = [];
var themeList = [];

themeList.push = function (theme) {
	registerTheme(theme);
	return Array.prototype.push.apply(theme);
}

const redTheme = {
	name: 'salmon/brightred',
	colors: {
		primary: rgb(235, 70, 80),
		darkAccent: rgb(170, 26, 42),
		accent: rgb(206, 58, 72),
		lightAccent: rgb(238, 135, 146),
		playedLine: rgba(255, 255, 255, 75),
	},
	hint: [rgb(235, 70, 80), rgb(240,230,220)]
};
themeList.push(redTheme);

const blueTheme = {
	name: 'blue',
	colors: {
		primary: rgb(40, 57, 99),
		darkAccent: rgb(21, 36, 74),
		accent: rgb(61, 78, 120),
		lightAccent: rgb(97, 112, 148),
		playedLine: rgba(255, 255, 255, 75),
	},
	hint: [rgb(40, 57, 99), rgb(220,230,240)]
};
themeList.push(blueTheme);

themeList.push({
	name: 'lighterblue',
	colors: {
		primary: rgb(51, 77, 141),
		darkAccent: rgb(36, 54, 99),
		accent: rgb(43, 65, 120),
		lightAccent: rgb(76, 100, 160),
		playedLine: rgba(255, 255, 255, 75),
	},
	hint: [rgb(51, 77, 141)]
});

themeList.push({
	name: 'midnightBlue',
	colors: {
		primary: rgb(0, 0, 48),
		darkAccent: rgb(0, 0, 32),
		accent: rgb(31, 31, 92),
		lightAccent: rgb(64, 64, 116),
		playedLine: rgba(255, 255, 255, 75),
		gridCol: rgb(255, 255, 255),
	},
	hint: [rgb(0, 0, 48)]
});

themeList.push({
	name: 'black',
	colors: {
		primary: rgb(10,10,10),
		darkAccent: rgb(32, 32, 32),
		accent: rgb(56, 56, 56),
		lightAccent: rgb(78, 78, 78),
		playedLine: rgba(255, 255, 255, 75),
	},
	hint: [rgb(0, 0, 0)]
});


function setTheme(theme) {
	var themeCol = new Color(theme.primary);
	if (colorDistance(theme.primary, col.bg, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
        if (pref.darkMode) {
            if (pref.show_theme_log) console.log('>>> Theme primary color is too close to bg color. Tinting theme color.');
            theme.primary = tintColor(theme.primary, 5);
            themeCol = new Color(theme.primary);
        } else {
            if (pref.show_theme_log) console.log('>>> Theme primary color is too close to bg color. Shading theme color.');
            theme.primary = shadeColor(theme.primary, 5);
            themeCol = new Color(theme.primary);
        }
	}
	col.info_bg = theme.primary;

	if (!pref.darkMode) {
		col.progress_bar = rgb(125,125,125);
	} else {
		col.progress_bar = rgb(23, 22, 25);
	}
	if (colorDistance(theme.primary, col.progress_bar, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
		// progress fill is too close in color to bg
		if (pref.show_theme_log) console.log('>>> Theme primary color is too close to progress bar. Adjusting progress_bar');
		if (themeCol.brightness < 125) {
			col.progress_bar = rgb(138,138,138);
		} else {
			col.progress_bar = rgb(112,112,112);
		}
    }
	col.progress_fill = theme.primary;
	if (str.timeline) {
		str.timeline.setColors(theme.darkAccent, theme.accent, theme.lightAccent);
	}
	col.tl_added = theme.darkAccent;
	col.tl_played = theme.accent;
	col.tl_unplayed = theme.lightAccent;
	col.tl_play = theme.playedLine;

	col.primary = theme.primary;
	col.extraDarkAccent = shadeColor(theme.primary, 50);
	col.darkAccent = theme.darkAccent;
	col.accent = theme.accent;
	col.lightAccent = theme.lightAccent;
	col.info_text = theme.gridCol ? theme.gridCol : rgb(255,255,255);
}

function registerTheme(theme) {
	for (let i = 0; i < theme.hint.length; i++) {
		var themeObj = { colors: theme.colors, hint: theme.hint[i], name: theme.name };
		themeArray.push(themeObj);
	}
}

function findClosestTheme(color) {
	var red = getRed(color);
	var green = getGreen(color);
	var blue = getBlue(color);
	var closest;
	var closestDistance = 999;

	for (let i = 0; i < themeArray.length; i++) {
		var themeRed = getRed(themeArray[i].hint);
		var themeGreen = getGreen(themeArray[i].hint);
		var themeBlue = getBlue(themeArray[i].hint);

		var distance = Math.abs(red - themeRed);
		distance += Math.abs(green - themeGreen);
		distance += Math.abs(blue - themeBlue);

		if (distance < closestDistance) {
			if (pref.show_theme_log) console.log(distance, themeArray[i].name + ' - ' + colToRgb(themeArray[i].hint, false));
			closestDistance = distance;
			closest = themeArray[i];
		}
	}
	setTheme(closest.colors);
	if (pref.show_theme_log) console.log(closest.name + ' - ' + colToRgb(closest.hint));
}

function getThemeColorsJson(image, maxColorsToPull) {
	var selectedColor;
	var minFrequency = 0.015;
	var colorsWeighted = [];
	var maxBrightness = pref.darkMode ? 255 : 212;

	try {
		colorsWeighted = JSON.parse(image.GetColourSchemeJSON(maxColorsToPull));
		colorsWeighted.forEach(function (c, i) {
			colorsWeighted[i].col = new Color(c.col);
		});

		if (pref.show_theme_log) console.log('idx      color        bright  freq   weight');
		let maxWeight = 0;
		selectedColor = colorsWeighted[0].col;  // choose first color in case no color selected below
		colorsWeighted.forEach(function (c, i) {
			var col = c.col;
			var midBrightness = 127 - Math.abs(127 - col.brightness);   // favors colors with a brightness around 127
			c.weight = c.freq * midBrightness * 10; // multiply by 10 so numbers are easier to compare

			if (c.freq >= minFrequency && !col.isCloseToGreyscale && col.brightness < maxBrightness) {
				if (pref.show_theme_log) console.log(leftPad(i, 2), col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad(parseFloat(c.freq*100).toFixed(2),5) + '%', leftPad(parseFloat(c.weight).toFixed(2), 7));
				if (c.weight > maxWeight) {
					maxWeight = c.weight;
					selectedColor = col;
				}
			} else if (col.isCloseToGreyscale) {
				if (pref.show_theme_log) console.log(' -', col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad(parseFloat(c.freq*100).toFixed(2),5) + '%', '   grey');
			} else {
				if (pref.show_theme_log) console.log(' -', col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad(parseFloat(c.freq*100).toFixed(2),5) + '%',
					(c.freq < minFrequency) ? '   freq' : ' bright');
			}
		});

		if (selectedColor.brightness < 37) {
			if (pref.show_theme_log) console.log(selectedColor.getRGB(true), 'brightness:', selectedColor.brightness, 'too dark -- searching for highlight color');
			let brightest = selectedColor;
			maxWeight = 0;
			colorsWeighted.forEach(function (c, i) {
				if (c.col.brightness > selectedColor.brightness &&
					c.col.brightness < 200 &&
					!c.col.isCloseToGreyscale &&
					c.weight > maxWeight &&
					c.freq > .01) {
						maxWeight = c.weight;
						brightest = c.col;
					}
			});
			selectedColor = brightest;
		}
		if (pref.show_theme_log) console.log('Selected Color:', selectedColor.getRGB(true));
		return selectedColor.val;
	} catch (e) {
		console.log('<Error: GetColourSchemeJSON failed.>');
	}
}

function getThemeColors(image) {
	var calculatedColor;

	var val = $('[%THEMECOLOR%]');
	if (val.length) {	// color hardcoded
		var themeRgb = val.match(/\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)/);
		if (themeRgb) {
			calculatedColor = rgb(parseInt(themeRgb[1]), parseInt(themeRgb[2]), parseInt(themeRgb[3]));
		} else {
			calculatedColor = 0xff000000 | parseInt(val, 16);
		}
	} else {
		calculatedColor = getThemeColorsJson(image, 14);
	}
	if (!isNaN(calculatedColor)) {
		var color = new Color(calculatedColor);
		while (!pref.darkMode && color.brightness > 200) {
			calculatedColor = shadeColor(calculatedColor, 3);
			if (pref.show_theme_log) console.log(' >> Shading: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
		}
		while (!color.isGreyscale && color.brightness <= 17) {
			calculatedColor = tintColor(calculatedColor, 3);
			if (pref.show_theme_log) console.log(' >> Tinting: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
		}
		if (color.brightness > 17) {
			var tObj = createThemeColorObject(color)
			setTheme(tObj);
		} else {
			findClosestTheme(calculatedColor);
		}
	}
}

function createThemeColorObject(color) {
    var themeObj = {
        primary: color.val,
        darkAccent: shadeColor(color.val, 30),
        accent: shadeColor(color.val, 15),
        lightAccent: tintColor(color.val, 20),
        playedLine: rgba(255,255,255,75),
        gridCol: rgb(255,255,255)
    };
    if (color.brightness < 40) {
        themeObj.darkAccent = shadeColor(color.val, 35);
        themeObj.accent = tintColor(color.val, 10);
        themeObj.lightAccent = tintColor(color.val, 20);
    }
    if (color.brightness > 210) {
        themeObj.darkAccent = shadeColor(color.val, 30);
        themeObj.accent = shadeColor(color.val, 20);
        themeObj.lightAccent = shadeColor(color.val, 10);
    }
    return themeObj;
}

function shadeColor(color, percent) {
	var red = getRed(color);
	var green = getGreen(color);
	var blue = getBlue(color);

	return rgba(darkenColorVal(red, percent), darkenColorVal(green, percent), darkenColorVal(blue, percent), getAlpha(color));
}

function tintColor(color, percent) {
	var red = getRed(color);
	var green = getGreen(color);
	var blue = getBlue(color);

	return rgba(lightenColorVal(red, percent), lightenColorVal(green, percent), lightenColorVal(blue, percent), getAlpha(color));
}

function darkenColorVal(color, percent) {
	var shift = Math.max(color * percent / 100, percent / 2);
	const val = Math.round(color - shift);
	return Math.max(val, 0);
}

function lightenColorVal(color, percent) {
	const val = Math.round(color + ((255-color) * (percent / 100)));
	return Math.min(val, 255);
}

function colorDistance(a, b, log) {
	var aCol = new Color(a);
	var bCol = new Color(b);

	var rho = (aCol.r + bCol.r) / 2;
	var deltaR = Math.pow(aCol.r - bCol.r, 2);
	var deltaG = Math.pow(aCol.g - bCol.g, 2);
	var deltaB = Math.pow(aCol.b - bCol.b, 2);

	var distance = Math.sqrt(2 * deltaR + 4 * deltaG + 3 * deltaB + (rho * (deltaR - deltaB))/256);
	if (log === true) {
		if (pref.show_theme_log) console.log('distance from:', aCol.getRGB(), 'to:', bCol.getRGB(), '=', distance);
	}
	return distance;
}