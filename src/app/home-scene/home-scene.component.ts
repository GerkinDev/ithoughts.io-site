import { Component, OnInit, AfterContentInit, Input, HostListener } from '@angular/core';
import { PixiService, SpriteComponent } from 'angular2pixi';
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import * as $ from 'jquery';

const deg2rad = (deg: number) => deg * Math.PI / 180;
const drawHexagon = (graphics: PIXI.Graphics, x: number, y: number, outterRadius: number, edgeRadius = 0, spin = 0) => {
	const points = [
		30,
		90,
		150,
		210,
		270,
		330,
	];
	const outPointsCorners = points.map(angle => {
		return [
			x + (Math.cos(deg2rad(spin + angle)) * outterRadius),
			y + (Math.sin(deg2rad(spin + angle)) * outterRadius)
		];
	});

	const joinPoint = [
		((_.first(outPointsCorners) as number[])[0] + (_.last(outPointsCorners) as number[])[0]) / 2,
		((_.first(outPointsCorners) as number[])[1] + (_.last(outPointsCorners) as number[])[1]) / 2,
	];

	const outPoints = [joinPoint, ...outPointsCorners, joinPoint].reduce((acc, point, index, collection) => {
		return acc.concat(point);
	}, []) as number[];

	graphics.drawPolygon(outPoints);
	return graphics;
};

const logInterpolation = (from: number, to: number, val: number) => {
	to -= from;
	val -= from;
	const percent = val / to;
	return Math.log2(percent + 1);
};

$.fn.isOnScreen = function(this: JQuery) {
	const win = $(window);

	const viewport = {
		top : win.scrollTop(),
		left : win.scrollLeft(),
	} as any;
	viewport.right = viewport.left + win.width();
	viewport.bottom = viewport.top + win.height();

	const bounds = this.offset() as any;
	bounds.right = bounds.left + this.outerWidth();
	bounds.bottom = bounds.top + this.outerHeight();

	return (!(
		viewport.right < bounds.left ||
		viewport.left > bounds.right ||
		viewport.bottom < bounds.top ||
		viewport.top > bounds.bottom
	));
};

const PARALLAX_LAYERS_COUNT = 6;
const MAX_PARALLAX = 200;

// const HEX_COLS = 44;
// const HEX_ROWS = 10;
// const HEX_COLS = 1;
// const HEX_ROWS = 1;

const HEX_SIZE = 50;
const MARGIN = 15;
const DIST_BTW_CENTERS = 2 * HEX_SIZE + MARGIN;
const D_Y = DIST_BTW_CENTERS * Math.sin(deg2rad(60));
const D_X = DIST_BTW_CENTERS * Math.cos(deg2rad(60));

const COLOR = 0x1FA67A;
const LINE_WIDTH = 6;
const HEX_OPACITY = 0.6;

@Component({
	selector: 'app-home-scene',
	template: '',
})
export class HomeSceneComponent extends SpriteComponent implements OnInit, AfterContentInit {
	@Input() renderer: HTMLCanvasElement;
	private depthLayers: PIXI.Container[] = [];
	private $head: JQuery<HTMLElement>;
	private worldStage: PIXI.Container;
	private resizeTimeout?: NodeJS.Timer;

	private w = 0;
	private h = 0;
	private baseLayerX = 0;
	private baseLayerY = 0;

	private static logosSvgs = {
		'/assets/images/nodejs.svg': 1,
		'/assets/images/symfony4.svg': 0.9,
		'/assets/images/angular.svg': 0.9,
		'/assets/images/prestashop.svg': 0.9,
		'/assets/images/sailsjs.svg': 0.75,
		'/assets/images/typo3.svg': 1,
		'/assets/images/wordpress.svg': 0.9,
	};

	constructor(
		private pixi: PixiService
	) {
		super();
	}

	static addLogoSprite(depthLayer: PIXI.Container, logoDesc: {
		pos: number;
		img: string;
		baseScale: number;
	}, posX: number, posY: number) {
		const ratio = Math.min((HEX_SIZE * 2) / 120, (HEX_SIZE * 2) / 120) * logoDesc.baseScale;
		const nodeTexture = PIXI.Texture.fromImage(logoDesc.img, undefined, undefined, ratio);
		const logoSprite = new PIXI.Sprite(nodeTexture);
		// nodeSprite.scale.set(0.5, 0.5)
		logoSprite.anchor.set(0.5, 0.5);
		logoSprite.position.set(posX, posY);

		/*console.log({width: nodeSprite.width, height: nodeSprite.height})
		const scale = {
			x: HEX_SIZE / nodeSprite.width,
			y: HEX_SIZE / nodeSprite.height
		}
		console.log({scale})
		nodeSprite.scale.set(scale.x, scale.y);*/
		depthLayer.addChild(logoSprite);
		return logoSprite;
	}
	static addHexagon(depthLayer: PIXI.Container, doFill: boolean, posX: number, posY: number) {
		const graphics = new PIXI.Graphics();

		graphics.lineStyle(LINE_WIDTH, COLOR, HEX_OPACITY);
		drawHexagon(graphics, posX, posY, HEX_SIZE); // drawCircle(x, y, radius)

		if (doFill) {
			// Set the fill color
			graphics.beginFill(COLOR, HEX_OPACITY);
			graphics.lineStyle(0);
			drawHexagon(graphics, posX, posY, HEX_SIZE - LINE_WIDTH / 2);
			graphics.endFill();
		}

		depthLayer.addChild(graphics);
		return graphics;
	}

	ngOnInit() {
		this.$head = $('.plain-page-head');
		this.pixi.init(0, 0, this.renderer );
		this.worldStage = this.pixi.worldStage;
		this.pixi.app.renderer.autoResize = true;
		for (let i = 0; i < PARALLAX_LAYERS_COUNT; i++) {
			const container = new PIXI.Container();
			this.depthLayers.push(container);
		}
		(this.worldStage.addChild as any)(...this.depthLayers);

		this.redraw();
		this.doResize();
	}

	redraw() {
		const HEX_COLS = Math.ceil((window.innerWidth / D_X)) + 1;
		const HEX_ROWS = Math.ceil((window.innerHeight / D_Y) / 2);
		this.baseLayerX = - (((D_X * HEX_COLS) - window.innerWidth) - (MARGIN + HEX_SIZE ));
		// this.baseLayerY = - ((D_Y * HEX_ROWS - MARGIN) - window.innerHeight) / 2;
		// console.log({pavementWidht: D_X * HEX_COLS - MARGIN, windowWidth: window.innerWidth, baseX: this.baseLayerX})
		const HEX_COUNT = HEX_COLS * HEX_ROWS;

		this.depthLayers.forEach(depthLayer => {
			// Purge the layer
			depthLayer.removeChildren();
		});

		const hexLayers = _.chain(_.range(0, HEX_COUNT))
		.map(() => _.sample(this.depthLayers))
		.value();

		const logoPositions = _.chain(hexLayers)
		.map((val, index) => ({
			depthLayer: val,
			index
		}))
		.filter(desc => desc.depthLayer === _.last(this.depthLayers))
		.shuffle()
		.sampleSize(_.keys(HomeSceneComponent.logosSvgs).length)
		.map((layerDesc, index) => {
			const logoUrl = _.keys(HomeSceneComponent.logosSvgs)[index];
			const logoBaseScale = (HomeSceneComponent.logosSvgs as any)[logoUrl] as number;
			return {
				pos: layerDesc.index,
				img: logoUrl,
				baseScale: logoBaseScale,
			};
		})
		.value();

		let index = 0;
		for (let x = 0; x < HEX_COLS; x++) {
			for (let y = 0; y < HEX_ROWS; y++) {
				// Applies fill to lines and shapes since the last call to beginFill.
				const depthLayer = hexLayers[index];
				// console.log({depthLayer, index})
				if (depthLayer) {
					const imageSprite = _.find(logoPositions, {pos: index});


					const posX = x * D_X;
					const posY = y * 2 * D_Y + (x % 2 ? D_Y : 0);

					// console.log({nodeSpritePos, index})
					const hexagon = HomeSceneComponent.addHexagon(depthLayer, typeof imageSprite !== 'undefined', posX, posY);
					if (imageSprite) {
						const sprite = HomeSceneComponent.addLogoSprite(depthLayer, imageSprite, posX, posY);
					}

				}
				index++;
			}
		}
		/*this.depthLayers.forEach((depthLayer, index) => {
			depthLayer.cacheAsBitmap = true;
		});*/
		requestAnimationFrame(() => {
			this.depthLayers.forEach((depthLayer, index) => {
				depthLayer.alpha = (index + 1) * 0.1;
			});
		});
		this.pixi.app.render();
	}

	ngAfterContentInit() {
	}


	@HostListener('window:resize')
	doResize() {
		if (this.resizeTimeout) {
			clearTimeout(this.resizeTimeout);
			this.resizeTimeout = undefined;
		}
		if (this.$head && this.$head.isOnScreen()) {
			setTimeout(this.finishResize.bind(this), 100);
		}
	}

	private finishResize() {
		this.w = window.innerWidth as number;
		this.h = window.innerHeight as number;
		this.pixi.app.renderer.resize(this.w, this.h);
		this.redraw();
		this.doScroll();
	}

	@HostListener('document:scroll')
	doScroll() {
		if (this.$head && this.$head.isOnScreen()) {
			const scrollPos = window.scrollY;
			const headHeight = window.innerHeight as number;

			const scrollLog = logInterpolation(0, headHeight, scrollPos);
			const scrollMaxed = scrollLog * MAX_PARALLAX;
			_.forEach(this.depthLayers, (depthLayer, index) => {
				const y = logInterpolation(0, PARALLAX_LAYERS_COUNT, index) * scrollMaxed;
				depthLayer.position = new PIXI.Point( this.baseLayerX, this.baseLayerY - y);
			});
			if (window.scrollY === 0) {
				$('#mainHeader').addClass('attop');
			} else {
				$('#mainHeader').removeClass('attop');
			}
		}
	}
}
