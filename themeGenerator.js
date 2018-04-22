// ==PREPROCESSOR==
// @name = "Georgia"
// @author "Mordred"
// @import "%fb2k_profile_path%georgia\js\polyfills.js"
// @import "%fb2k_profile_path%georgia\js\color.js"
// @import "%fb2k_profile_path%georgia\js\helpers.js"
// @import "%fb2k_profile_path%georgia\themegenerator.js"
// @feature "dragdrop"
// @feature "v1.0"
// ==/PREPROCESSOR==

var img = null;
var arr = [];
var jsonArrHigh = [];
var jsonArrLow = [];
var maxColorsToPull = 15;
var gap = 0;

var colRegular;
var colHigh;
var colLow;
var colLowMedian;

var highContrast = false;
var ww, wh;
var artSize = 400;
var themeSize = 85;
var art = {
	x: 0,
	y: 0,
	w: artSize,
	h: artSize
};
var maxColorsBar = {
	x: 10,
	y: 30,
	w: 0,
	h: 15
}
var maxColorsToPullBar = {
	x: 10,
	y: 75,
	w: 0,
	h: 20
}

var maxColorsToPull = 10;
var maxColorsToConsider = 9;
var thumbWidth = 1;

on_size();
on_item_focus_change();

function on_size() {
	ww = window.Width;
	wh = window.Height;
	art.x = Math.floor(ww/2 - artSize/2) + gap;
	art.y = Math.floor(wh/2 - artSize/2 + themeSize + gap);

	maxColorsBar.w = Math.floor(art.x * 0.75);
	maxColorsToPullBar.w = maxColorsBar.w;
	thumbWidth = maxColorsBar.w / maxColorsToPull;
}

function on_item_focus_change() {
	var m = fb.GetFocusItem();
	if (img) {
		img.Dispose();
	}
	img = null;
	if (m) {
		img = utils.GetAlbumArtV2(m, 0);
		if (img) {
			pullColors(img);
		}
		m.Dispose();
	}
	window.Repaint();
}

function pullColors(img) {
	var start, end;

	// if GetColourScheme is called before GetColourSchemeJson, GetColourSchemeJson's speed is 2-3x faster.
	start = new Date();
	jsonArrHigh = JSON.parse(img.GetColourSchemeJSON(maxColorsToPull));
	end = new Date();
	getColourSchemeJsonTime = end - start;
	colHigh = jsonArrHigh[0].col;
	colLowMedian = getThemeColor(img, maxColorsToPull, jsonArrHigh);

	start = new Date();
	arr = img.GetColourScheme(maxColorsToPull).toArray();
	end = new Date();
	getColourSchemeTime = end - start;


	// jsonArrLow = JSON.parse(img.GetColourSchemeJson(maxColorsToPull, true));
	// colLow  = getThemeColorsJson(img, false, maxColorsToPull, maxColorsToConsider, jsonArrLow);
	console.log('Recalc Time elapsed:', getColourSchemeJsonTime, 'ms');
}

var font = gdi.Font('blah', 16, 0);	// use default fonts
var fixedFont = gdi.Font('Courier New', 17, 1);
var StringAlignment = {Near: 0, Center: 1, Far: 2};
var StringFormatFlags = {
	DirectionRightToLeft: 0x00000001,
	DirectionVertical: 0x00000002,
	NoFitBlackBox: 0x00000004,
	DisplayFormatControl: 0x00000020,
	NoFontFallback: 0x00000400,
	MeasureTrailingSpaces: 0x00000800,
	NoWrap: 0x00001000,
	LineLimit: 0x00002000,
	NoClip: 0x00004000
};
var lt_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Near);
var ct_stringformat = StringFormat(StringAlignment.Center, StringAlignment.Near);
var rt_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Near);
var lc_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Center);
var cc_stringformat = StringFormat(StringAlignment.Center, StringAlignment.Center);
var rc_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Center);
var lb_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Far);
var cb_stringformat = StringFormat(StringAlignment.Center, StringAlignment.Far);
var rb_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Far);

var lcu_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Center, 0, StringFormatFlags.DirectionVertical);

var maxBright = 128;
function on_paint(gr) {
	gr.FillSolidRect(0,0,ww,wh,rgb(210,210,210));
	if (img) {
		gr.DrawImage(img, art.x, art.y, artSize, artSize, 0, 0, img.Width, img.Height);
		var h = artSize / arr.length;
		for (var i = 0; i < arr.length; i++) {
			gr.FillSolidRect(art.x + i * h, 0, h, art.y - themeSize, arr[i]);
			var col = new Color(arr[i]);
			gr.DrawString(i + '. ' + col.getRGB(false, true), fixedFont, col.brightness > maxBright ? rgb(0,0,0) : rgb(255,255,255),
					art.x + i * h, 7, h, art.y - themeSize, lcu_stringformat);
		}
		gr.DrawString('GetColourScheme', font, rgb(0,0,0), art.x + i * h, 7, h, art.y - themeSize, lcu_stringformat);
		gr.FillSolidRect(art.x, art.y - themeSize, art.w, themeSize - gap, arr[0]);
		col = new Color(arr[0]);
		gr.DrawString(col.getRGB(false), font, col.brightness > maxBright ? rgb(0,0,0) : rgb(255,255,255),
			art.x, art.y - themeSize, art.w, themeSize - gap, cc_stringformat);


		h = artSize / jsonArrHigh.length;
		gr.DrawString('GetColourSchemeJson', font, rgb(0,0,0), 15, art.y - h, art.x - themeSize*2 - 5, h, lc_stringformat);
		for (var i = 0; i < jsonArrHigh.length; i++) {
			gr.FillSolidRect(0, art.y + h * i, art.x - themeSize*2, h, jsonArrHigh[i].col);
			var col = new Color(jsonArrHigh[i].col);
			gr.DrawString(leftPad(i, 2) + '. ' + col.getRGB(false, true) + ' ' + leftPad(parseFloat(jsonArrHigh[i].freq*100).toFixed(2), 5) + '% [' + col.brightness + ']', fixedFont, col.brightness > maxBright ? rgb(0,0,0) : rgb(255,255,255),
				5, art.y + h * i, art.x - themeSize*2 - 5, h, lc_stringformat);
		}
		gr.DrawString('idx      color       freq. brightness', fixedFont, rgb(0,0,0), 5, art.y + h * i, art.x - themeSize*2 - 5, h, lc_stringformat);
		gr.FillSolidRect(art.x - themeSize*2, art.y, themeSize*2 - gap, art.h, colHigh);
		col = new Color(colHigh);
		gr.DrawString(col.getRGB(false), font, col.brightness > maxBright ? rgb(0,0,0) : rgb(255,255,255),
			art.x - themeSize*2, art.y, themeSize*2 - gap, art.h, cc_stringformat);

		gr.FillSolidRect(art.x + art.w + gap, art.y, themeSize * 3, art.h, colLowMedian);
		col = new Color(colLowMedian);
		gr.DrawString('Simple algorithm\n\nTake first color not close to greyscale, but if too dark choose color based on combination of brightness and frequency\n\n' + col.getRGB(false),
			font, col.brightness > maxBright ? rgb(0,0,0) : rgb(255,255,255),
			art.x + art.w + 5 + gap, art.y, themeSize*3 - 10, art.h, cc_stringformat);
	}

	// maxColorsBar
	gr.DrawString('Max. Colors to Pull', font, rgb(0,0,0), maxColorsBar.x, maxColorsBar.y - 20, maxColorsBar.w, maxColorsBar.h + 2, lc_stringformat);
	gr.FillSolidRect(maxColorsBar.x, maxColorsBar.y, maxColorsBar.w, maxColorsBar.h, rgb(128,128,128));
	gr.FillSolidRect(maxColorsBar.x + (maxColorsToPull - 1) * thumbWidth, maxColorsBar.y, thumbWidth, maxColorsBar.h, rgb(0, 0, 128));
	gr.DrawString(maxColorsToPull, font, rgb(0,0,0), maxColorsBar.x + maxColorsBar.w + 5, maxColorsBar.y, 30, maxColorsBar.h, lc_stringformat);

	if (img) {
		var y = maxColorsToPullBar.y - 20;
		gr.DrawString('Cover image size: ' + img.Width + 'x' + img.Height, font, rgb(0,0,0), maxColorsToPullBar.x, y, maxColorsToPullBar.w, maxColorsToPullBar.h + 2, lc_stringformat);
		gr.DrawString('GetColourScheme Calc. Time:     ' + getColourSchemeTime + 'ms', fixedFont, rgb(0,0,0),
			maxColorsToPullBar.x, y+=25, maxColorsToPullBar.w, maxColorsToPullBar.h + 2, lc_stringformat);
		y+=25;
		gr.DrawString('GetColourSchemeJson Calc. Time: ' + getColourSchemeJsonTime + 'ms', fixedFont, rgb(0,0,0),
			maxColorsToPullBar.x, y, maxColorsToPullBar.w, maxColorsToPullBar.h + 2, lc_stringformat);
		if (getColourSchemeJsonTime < getColourSchemeTime) {
			gr.DrawString(Math.round((getColourSchemeTime/getColourSchemeJsonTime)*100)-100 + '% faster', font, rgb(255,0,0),
				maxColorsToPullBar.x + 380, y - 3, maxColorsToPullBar.w + 20, maxColorsToPullBar.h + 6, lc_stringformat);
		}
	}
}

function on_mouse_lbtn_down(x, y, m) {
	if (x >= maxColorsBar.x && x <= maxColorsBar.x + maxColorsBar.w &&
		y >= maxColorsBar.y && y <= maxColorsBar.y + maxColorsBar.h) {

		var click = x - maxColorsBar.x;
		maxColorsToPull = Math.floor(click / thumbWidth) + 1;
	}
	if (img) {
		pullColors(img);
	}
	window.Repaint();
}

/* simple algorithm to smartly choose a color to display. Could be a lot better with more thought */
function getThemeColor(image, maxColorsToPull, colorObjArray) {
	var redTotal = 0, greenTotal = 0, blueTotal = 0;
	var colorCount = 0;
	var greyscaleThreshold = 4;
	var weightedTotal = 0;
	var avgColor;
	var minFrequency = 0.015;
    var colorsWeighted = [];
    var found = false;

	try {
		colorsWeighted = JSON.parse(JSON.stringify(colorObjArray));
		colorsWeighted.forEach(function (c, i) {
			colorsWeighted[i].col = new Color(c.col);
		});

        console.log('idx      color        bright  freq    weight');
        maxWeight = 0;
        colorsWeighted.forEach(function (c, i) {
			var col = c.col;
			c.weight = c.freq * col.brightness * 10; // multiply by 10 so numbers are easier to compare
            if (!found && c.freq >= minFrequency && !col.isCloseToGreyscale && col.brightness < 218) {
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