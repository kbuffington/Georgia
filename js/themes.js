var themeArray = [];
var themeList = [];

themeList.push = function (theme) {
	registerTheme(theme);
	return Array.prototype.push.apply(theme);
}

themeList.push(redTheme = {
	name: 'salmon/brightred',
	colors: {
		primary: rgb(235, 70, 80),
		darkAccent: rgb(170, 26, 42),
		accent: rgb(206, 58, 72),
		lightAccent: rgb(238, 135, 146),
		playedLine: rgba(255, 255, 255, 75),
	},
	hint: [rgb(235, 70, 80), rgb(240,230,220)]
});

themeList.push(blueTheme = {
	name: 'blue',
	colors: {
		primary: rgb(40, 57, 99),
		darkAccent: rgb(21, 36, 74),
		accent: rgb(61, 78, 120),
		lightAccent: rgb(97, 112, 148),
		playedLine: rgba(255, 255, 255, 75),
	},
	hint: [rgb(40, 57, 99), rgb(220,230,240)]
});

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

// themeList.push(purpleTheme = {
// 	name: 'purple',
// 	colors: {
// 		primary: rgb(74, 20, 140),
// 		darkAccent: rgb(42, 5, 87),
// 		accent: rgb(97, 44, 161),
// 		lightAccent: rgb(119, 74, 173),
// 		playedLine: rgba(255, 255, 255, 75),
// 	},
// 	hint: [rgb(74, 20, 140)]
// });

// themeList.push(greenTheme = {
// 	name: 'green',
// 	colors: {
// 		primary: rgb(27, 94, 31),
// 		darkAccent: rgb(0, 39, 3),
// 		accent: rgb(10, 66, 14),
// 		lightAccent: rgb(49, 113, 53),
// 		playedLine: rgba(255, 255, 255, 75),
// 	},
// 	hint: [rgb(27, 94, 31)]
// });

// themeList.push({
// 	name: 'lighterGreen',
// 	colors: {
//  		primary: rgb(90, 115, 90),
// 		darkAccent: rgb(63, 81, 63),
// 		accent: rgb(77, 98, 77),
// 		lightAccent: rgb(122, 145, 122),
// 		playedLine: rgba(255, 255, 255, 85),
// 	},
// 	hint: [rgb(90, 115, 90), rgb(220,240,220)]
// });

// themeList.push({
// 	name: 'purpleBlue',
// 	colors: {
// 		primary: rgb(51, 45, 100),
// 		darkAccent: rgb(15, 10, 50),
// 		accent: rgb(33, 27, 79),
// 		lightAccent: rgb(76, 69, 125),
// 		playedLine: rgba(255, 255, 255, 75),
// 	},
// 	hint: [rgb(51, 45, 90)]
// });

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

// themeList.push({
// 	name: 'lightBrown',
// 	colors: {
// 		primary: rgb(179, 154, 122),
// 		darkAccent: rgb(125, 108, 85),
// 		accent: rgb(152, 131, 104),
// 		lightAccent: rgb(193, 177, 156),
// 		playedLine: rgba(255, 255, 255, 75),
// 	},
// 	hint: [rgb(179, 154, 122)]
// });

// themeList.push({
// 	name: 'red',
// 	colors: {
// 		primary: rgb(128, 32, 32),
// 		darkAccent: rgb(74, 10, 10),
// 		accent: rgb(89, 20, 20),
// 		lightAccent: rgb(161, 52, 52),
// 		playedLine: rgba(255, 255, 255, 75),
// 	},
// 	hint: [rgb(128, 32, 32)]
// });

// themeList.push({
// 	name: 'orange',
// 	colors: {
// 		primary: rgb(199, 117, 0),
// 		darkAccent: rgb(139, 82, 0),
// 		accent: rgb(169, 99, 0),
// 		lightAccent: rgb(246, 152, 18),
// 		playedLine: rgba(255, 255, 255, 85),
// 	},
// 	hint: [rgb(199, 117, 0)]
// });

function setTheme(theme) {
	// theme.primary = rgb(192,192,160); // testing conflicts
	// if (isCloseToColor(theme.primary, col.bg)) {
    if (colorDistance(theme.primary, col.bg, true) < 45) {
		console.log('>>> Theme primary color is too close to bg color. Adjusting.');
		// darken theme.primary because it's too close to col.bg
		theme.primary = shadeColor(theme.primary, 5);
	}
    col.info_bg = theme.primary;

    col.progress_bar = rgb(125,125,125);
    if (colorDistance(theme.primary, col.progress_bar, true) < 45) {
		// progress fill is too close in color to bg
        console.log('>>> Theme primary color is too close to progress bar. Adjusting progress_bar');
        if (calcBrightness(theme.primary) < 125) {
            col.progress_bar = rgb(138,138,138);
        } else {
            col.progress_bar = rgb(112,112,112);
        }
    }
	col.progress_fill = theme.primary;
    col.tl_added = theme.darkAccent;
	col.tl_played = theme.accent;
	col.tl_unplayed = theme.lightAccent;
	col.tl_play = theme.playedLine;

	col.primary = theme.primary;
	col.extraDarkAccent = shadeColor(theme.primary, 50);
	col.darkAccent = theme.darkAccent;
	col.accent = theme.accent;
	col.lightAccent = theme.lightAccent;
	col.grid_key = theme.gridCol ? theme.gridCol : rgb(255,255,255);
	col.grid_val = theme.gridCol ? theme.gridCol : rgb(255,255,255);
}

function registerTheme(theme) {
	for (i=0; i < theme.hint.length; i++) {
		var themeObj = { colors: theme.colors, hint: theme.hint[i], name: theme.name };
		themeArray.push(themeObj);
	}
}

function findClosestTheme(color) {
	var red = getRed(color);
	var green = getGreen(color);
	var blue = getBlue(color);
	var colorArray = [red, green, blue];
	var closest;
	var closestDistance = 999;

	for (i=0; i < themeArray.length; i++) {
		var themeRed = getRed(themeArray[i].hint);
		var themeGreen = getGreen(themeArray[i].hint);
		var themeBlue = getBlue(themeArray[i].hint);

		var distance = Math.abs(red - themeRed);
		distance += Math.abs(green - themeGreen);
		distance += Math.abs(blue - themeBlue);

		if (distance < closestDistance) {
			console.log(distance, themeArray[i].name + ' - ' + colToRgb(themeArray[i].hint, false));
			closestDistance = distance;
			closest = themeArray[i];
		}
	}
	setTheme(closest.colors);
	console.log(closest.name + ' - ' + colToRgb(closest.hint));
}

function getThemeColorsJson(image, maxColorsToPull, maxColors, colorObjArray) {
	var redTotal = 0, greenTotal = 0, blueTotal = 0;
	var colorCount = 0;
	var greyscaleThreshold = 4;
	var weightedTotal = 0;
	var avgColor;
	var minFrequency = 0.015;
    var colorsWeighted = [];
    var found = false;

	try {
		if (colorObjArray) {
			colorsWeighted = JSON.parse(JSON.stringify(colorObjArray));
		} else {
			colorsWeighted = JSON.parse(image.GetColourSchemeJson(maxColorsToPull));
		}
		colorsWeighted.forEach(function (c, i) {
			colorsWeighted[i].col = new Color(c.col);
		});

        console.log('idx      color        bright  freq    weight');
        maxWeight = 0;
        colorsWeighted.forEach(function (c, i) {
			var col = c.col;
			c.weight = c.freq * col.brightness * 10; // multiply by 10 so numbers are easier to compare
            if (!found && c.freq >= minFrequency && colorCount < maxColors && !col.isCloseToGreyscale && col.brightness < 212) {
                if (i === 0) {
                    avgColor = colorsWeighted[i].col;
                    c.weight = 0;
                    found = true;
                }
                console.log(leftPad(i, 2), col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad(parseFloat(c.freq*100).toFixed(2),5) + '%', leftPad(parseFloat(c.weight).toFixed(2), 7));
                if (!found && c.weight > maxWeight) {
                    maxWeight = c.weight;
                    avgColor = col;
                }
            } else if (col.isCloseToGreyscale) {
                console.log(' g', col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad(parseFloat(c.freq*100).toFixed(2),5) + '%', '   --');
			} else {
                console.log(' -', col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad(parseFloat(c.freq*100).toFixed(2),5) + '%', leftPad(parseFloat(c.weight).toFixed(2), 7));
            }
        });

        if (!avgColor) {
            avgColor = colorsWeighted[0].col;
        }

		if (avgColor.brightness < 50) {
			console.log(avgColor.getRGB(true), 'brightness:', avgColor.brightness, 'too dark -- searching for highlight color');
            brightest = avgColor;
            maxWeight = 0;
			colorsWeighted.forEach(function (c, i) {
				if (c.col.brightness > avgColor.brightness &&
                    c.col.brightness < 200 &&
                    !c.col.isCloseToGreyscale &&
					c.weight > maxWeight &&
					c.freq > .01) {
                        maxWeight = c.weight;
                        brightest = c.col;  // change the name of this
                    }
			});
			avgColor = brightest;
		}
		console.log('Avg. Color:', avgColor.getRGB(true));
		return 0xff000000 | avgColor.val;
	} catch (e) {
		return undefined;
	}
}

function getThemeColorScheme(image, maxColorsToPull, maxColors, colors) {
	var redTotal = 0, greenTotal = 0, blueTotal = 0;
	var colorCount = 0;
	var greyscaleCount = 0;
	var weightedTotal = 0;
	var colorStr = '';

	if (colors) {
        colors = image.GetColourScheme(maxColorsToPull).toArray();
        console.log(colors);
	}
	colors.forEach(function (c, i) {
		colorStr += colToRgb(c, false) + ', ';
		if (!isGreyscale(c) && colorCount < maxColors) {
			colorCount++;
			var weight = 1 + 9 * (maxColorsToPull-i)/maxColorsToPull;	// first color will count 4x as much as last
			weight *= weight;
			redTotal += getRed(c) * weight;
			greenTotal += getGreen(c) * weight;
			blueTotal += getBlue(c) * weight;
			weightedTotal += weight;
		} else if (colorCount < 1) {
			greyscaleCount++;	// only care about grayscale colors if they are first in the array, otherwise they'd just lighten or darken the primary color
		}
	});
	if (greyscaleCount > 4) {
		avgColorOld = colors[0] | 0xff000000;	// predominately black & white image
	} else {
		avgColorOld = (Math.round(redTotal / weightedTotal) << 16) +
					  (Math.round(greenTotal / weightedTotal) << 8) +
					   Math.round(blueTotal / weightedTotal);
		avgColorOld |= 0xff000000;
	}
	console.log('Color Scheme: ' + colorStr + '- Avg Color (' + colorCount + ' colors): ' + colToRgb(avgColorOld) + ' brightness: ' + calcBrightness(avgColorOld));
	return avgColorOld;
}

function getThemeColors(image) {
	var calculatedColor;

    val = $('[%THEMECOLOR%]');
    if (val.length) {
		var themeRgb = val.match(/\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)/);
		if (themeRgb) {
			calculatedColor = rgb(parseInt(themeRgb[1]), parseInt(themeRgb[2]), parseInt(themeRgb[3]));
		} else {
			calculatedColor = 0xff000000 | parseInt(val, 16);
		}
	} else {
		try {
            var start = new Date();
            // image.GetColourScheme(maxColorsToPull).toArray();
            console.log('getColourScheme time:', new Date() - start, 'ms\n');
			calculatedColor = getThemeColorsJson(image, 14, 3);
				// calculatedColor = 0xffb04030;
		} catch (e) {
			calculatedColor = getThemeColorScheme(image, 10, 5);
		}
	}
	// avgColor = rgb(0,0,16);
	// avgColor = colorsWeighted[4].col;
	// console.log(colToRgb(avgColor), calcBrightness(avgColor));
	if (!isNaN(calculatedColor)) {
		while (calcBrightness(calculatedColor) >= 200) {
			calculatedColor = shadeColor(calculatedColor, 3);
			console.log(' >> Shading: ', colToRgb(calculatedColor), ' - brightness: ', calcBrightness(calculatedColor));
		}
		while (!isGreyscale(calculatedColor) && calcBrightness(calculatedColor) <= 17) {
			calculatedColor = tintColor(calculatedColor, 3);
			console.log(' >> Tinting: ', colToRgb(calculatedColor), ' - brightness: ', calcBrightness(calculatedColor));
		}
		if (pref.generate_theme && calcBrightness(calculatedColor) > 17) {
			var tObj = {
				primary: calculatedColor,
				darkAccent: shadeColor(calculatedColor, 30),
				accent: shadeColor(calculatedColor, 15),
				lightAccent: tintColor(calculatedColor, 20),
				playedLine: rgba(255,255,255,75),
				gridCol: rgb(255,255,255)
			};
			if (calcBrightness(calculatedColor) < 40) {
				tObj.darkAccent = shadeColor(calculatedColor, 35);
				tObj.accent = tintColor(calculatedColor, 12);
				tObj.lightAccent = tintColor(calculatedColor, 25);
			}
			// printColorObj(tObj);
			setTheme(tObj);
		} else {
			findClosestTheme(calculatedColor);
		}
	}
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
	val = Math.round(color - shift);
	return Math.max(val, 0);
}

function lightenColorVal(color, percent) {
	val = Math.round(color + ((255-color) * (percent / 100)));
	return Math.min(val, 255);
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

function isGreyscale(color) {
	return (getRed(color) === getGreen(color) && getRed(color) === getBlue(color));
}

function isCloseToGreyscale(color) {
	var r = getRed(color);
	var g = getGreen(color);
	var b = getBlue(color);
    var avg = (r + g + b) / 3;
    return isColorCloseToColorVal(color, avg, 10);
}

// TODO: remove this when colorDistance is fully tested
function isCloseToColor(color, testColor) {
	var r = getRed(testColor);
	var g = getGreen(testColor);
	var b = getBlue(testColor);
	var threshold = isGreyscale(color) ? 16 : isCloseToGreyscale(color) ? 12 : 5;	// is greyscale threshold too high?
    console.log('Diff:', calcBrightness(color), calcBrightness(testColor), Math.abs(calcBrightness(color) - calcBrightness(testColor)));
	return Math.abs(calcBrightness(color) - calcBrightness(testColor)) <= threshold;
}

function isColorCloseToColorVal(color, avg, threshold) {
	var r = getRed(color);
	var g = getGreen(color);
	var b = getBlue(color);
	return !(r < avg - threshold || r > avg + threshold ||
		g < avg - threshold || g > avg + threshold ||
		b < avg - threshold || b > avg + threshold);
}

function colorDistance(a, b, log) {
    var aCol = new Color(a);
    var bCol = new Color(b);

    var rho = (aCol.r + bCol.r) / 2;
    var deltaR = Math.pow(aCol.r - bCol.r, 2);
    var deltaG = Math.pow(aCol.g - bCol.g, 2);
    var deltaB = Math.pow(aCol.b - bCol.b, 2);

    // var distance = Math.sqrt((2 + rho/256) * deltaR + 4 * deltaG + (2 + (255 - rho)/256) * deltaB);
    var distance = Math.sqrt(2 * deltaR  + 4 * deltaG + 3 * deltaB + (rho * (deltaR - deltaB))/256);
    if (log === true) {
        console.log(aCol.getRGB(), bCol.getRGB(), distance);
    }
    return distance;
}