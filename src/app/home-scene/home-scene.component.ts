import { Component, OnInit, AfterContentInit, Input, HostListener } from '@angular/core';
import { PixiService, SpriteComponent } from 'angular2pixi';
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import * as $ from 'jquery';

const deg2rad = (deg: number) => deg * Math.PI / 180;
const drawHexagon = (graphics: PIXI.Graphics, x: number, y: number, outterRadius: number, edgeRadius = 0, spin = 0) => {
	const points = [
		0,
		60,
		120,
		180,
		240,
		300,
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

@Component({
	selector: 'app-home-scene',
	template: '',
})
export class HomeSceneComponent extends SpriteComponent implements OnInit, AfterContentInit {
	@Input() renderer: HTMLCanvasElement;
	private depthLayers: PIXI.Container[] = [];
    private $head: JQuery<HTMLElement>;
    private worldStage: PIXI.Container;
    
    private w: number = 0;
    private h: number = 0;
    
    constructor(
        private pixi: PixiService
    ){
        super();
    }
    
	ngOnInit() {
        this.$head = $('.plain-page-head');
        this.pixi.init(0, 0, this.renderer );
        this.worldStage = this.pixi.worldStage;
        this.doResize();
        this.pixi.app.renderer.autoResize = true;
		for (let i = 0; i < PARALLAX_LAYERS_COUNT; i++) {
            const container = new PIXI.Container();
            this.worldStage.addChild(container);
            this.depthLayers.push(container);
		}
        
		const HEX_SIZE = 50;
		const MARGIN = 15;
		const DIST_BTW_CENTERS = 2 * HEX_SIZE + MARGIN;
		const D_X = DIST_BTW_CENTERS * Math.sin(deg2rad(60));
		const D_Y = DIST_BTW_CENTERS * Math.cos(deg2rad(60));
        
		const COLOR = 0x1FA67A;
		const LINE_WIDTH = 6;
		const HEX_OPACITY = 0.6;
		for (let x = 0; x < 22; x++) {
			for (let y = 0; y < 10; y++) {
				const graphics = new PIXI.Graphics();
                
				// Set the fill color
				graphics.lineStyle(LINE_WIDTH, COLOR, HEX_OPACITY);
                
				const posX = x * D_X - (x % 2 ? D_X * 2 : 0);
				const posY = y * 2 * D_Y + (x % 2 ? D_Y : 0);
				// Draw a circle
				drawHexagon(graphics, posX, posY, HEX_SIZE); // drawCircle(x, y, radius)
                
				// Applies fill to lines and shapes since the last call to beginFill.
				(_.sample(this.depthLayers) as PIXI.Container).addChild(graphics);
			}
		}
		this.depthLayers.forEach((depthLayer, index) => {
			depthLayer.cacheAsBitmap = true;
		});
		requestAnimationFrame(() => {
			this.depthLayers.forEach((depthLayer, index) => {
				depthLayer.alpha = (index + 1) * 0.1;
			});
		});
	}
    
	ngAfterContentInit() {
	}
    
    
	@HostListener('window:resize')
	doResize() {
		if (this.$head && this.$head.isOnScreen()) {
            this.w = this.$head.width() as number;
            this.h = this.$head.height() as number;
            this.pixi.app.renderer.resize(this.w, this.h);
        }
    }
    
	@HostListener('document:scroll')
	doScroll() {
		if (this.$head && this.$head.isOnScreen()) {
			const scrollPos = window.scrollY;
			const headHeight = this.$head.height() as number;
            
			const scrollLog = logInterpolation(0, headHeight, scrollPos);
			const scrollMaxed = scrollLog * MAX_PARALLAX;
			_.forEach(this.depthLayers, (depthLayer, index) => {
				const y = logInterpolation(0, PARALLAX_LAYERS_COUNT, index) * scrollMaxed;
				depthLayer.position = new PIXI.Point( 0, -y);
			});
		}
	}
}
