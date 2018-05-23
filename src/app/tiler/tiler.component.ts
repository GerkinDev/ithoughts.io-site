import { Component, AfterContentInit, ElementRef, ViewChild, HostListener, ViewChildren, QueryList, OnChanges, Input } from '@angular/core';

import * as _ from 'lodash';


const DELAY_BEFORE_TRANSITION = 10;

@Component({
	selector: 'app-tiler',
	templateUrl: './tiler.component.html',
	styleUrls: ['./tiler.component.scss']
})
export class TilerComponent implements AfterContentInit, OnChanges {
	@ViewChild('cursor') cursor?: ElementRef;
	@Input() transitionTimeInMs = 500;
	private currentTarget?: HTMLElement;
	private fullView = false;
	private willClose = false;

	private cursorStyle = {
		opacity: 0,
		left: 0 + 'px',
		top: 0 + 'px',
		width: 0 + 'px',
		height: 0 + 'px',
		position: 'absolute',
		transition: `${this.transitionTimeInMs}ms all`,
	};

	constructor(private el: ElementRef) {

	}

	ngAfterContentInit() {
		this.bindChildren();
		const elements = (this.el.nativeElement as HTMLElement).querySelectorAll('.container > *') as any as HTMLElement[];
		this.currentTarget = elements[0];
		this.reloadCursorPosition();
	}

	public bindChildren() {
		const elements = (this.el.nativeElement as HTMLElement).querySelectorAll('.container > *') as any as HTMLElement[];
		/*_.forEach(elements, (child) => {
			if (!(child instanceof HTMLElement)) {
				return;
			}
			$(child)
			.filter((index, element) => typeof $(element).data('bound') === 'undefined')
			.data('boud', true)
			.mouseenter(this.setPosition.bind(this, child))
			.click(this.goFullView.bind(this))
			.mouseleave(() => this.currentTarget === child && this.onMouseLeave());
			const closeBlocks = child.querySelectorAll('.close-click-block');
			/*_.forEach(closeBlocks, closeBlock => {
				closeBlock.addEventListener('click', (event) => {
					event.stopImmediatePropagation();
					this.setPosition(child);
					this.leaveFullView();
					return false;
				});
			});
		});*/
	}

	private addTargetContentClass(selector: string, newClass: string) {
		if (this.currentTarget) {
			const hoverBlock = this.currentTarget.querySelector(selector);
			if (hoverBlock) {
				hoverBlock.classList.add(newClass);
			}
		}
	}

	private removeTargetContentClass(selector: string, oldClass: string) {
		if (this.currentTarget) {
			const hoverBlock = this.currentTarget.querySelector(selector);
			if (hoverBlock) {
				hoverBlock.classList.remove(oldClass);
			}
		}
	}

	@HostListener('cursor-move', ['$event'])
	private moveCursor(event: CustomEvent) {
		if (!this.fullView) {
			this.currentTarget = event.detail.newTarget;
			this.reloadCursorPosition(1);
		}
	}

	@HostListener('cursor-maybe-leave')
	private hideCursorCooldown(timeout: number = 10) {
console.log('Will hide in', timeout);
	}

	@HostListener('open-full-view')
	public goFullView() {
		if (!this.currentTarget) {
			return;
		}
		this.willClose = false;
		this.fullView = true;
		console.log('Go full view', this.currentTarget);
		this.currentTarget.classList.add('active');
		if (this.cursor && this.cursor.nativeElement) {
			this.cursor.nativeElement.classList.add('fullView');
			const position = (this.cursor.nativeElement as HTMLElement).getBoundingClientRect();
			_.assign(this.cursorStyle, {
				transition: 'none',
				position: 'fixed',
				top: position.top + 'px',
				left: position.left + 'px',
			});
			setTimeout(() => {
				this.cursorStyle.transition = `${this.transitionTimeInMs}ms all`;
				this.reloadCursorPosition();
				setTimeout(() => this.addTargetContentClass('.click-block', 'visible'), this.transitionTimeInMs);
			}, DELAY_BEFORE_TRANSITION);
		}
	}

	@HostListener('close-full-view')
	public leaveFullView() {
		console.log('leaveFullView, willClose?', this.willClose);
		this.fullView = false;
		this.removeTargetContentClass('.click-block', 'visible');
		if (this.cursor && this.cursor.nativeElement) {
			console.log('Do leave');
			this.cursor.nativeElement.classList.remove('fullView');
			const containerPos = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
			const headerHeight = $('#mainHeader').height() as number;
			const newStyle = {
				transition: 'none',
				position: 'absolute',
				top: (-containerPos.top + headerHeight) + 'px',
				left: (-containerPos.left) + 'px',
			};
			_.assign(this.cursorStyle, newStyle);
			console.log(this.cursorStyle);
			setTimeout(() => {
				this.cursorStyle.transition = `${this.transitionTimeInMs}ms all`;
				this.cursorStyle.opacity = 0;
				setTimeout(() => {
					this.reloadCursorPosition();
					if (this.willClose === true) {
						console.log('Closing after timeout');
						this.onMouseLeave();
					}
					if (this.cursorStyle.opacity === 1) {
						this.addTargetContentClass('.hover-block', 'visible');
					}
				}, this.transitionTimeInMs);
			}, DELAY_BEFORE_TRANSITION);
		}
	}

	public reloadCursorPosition(opacity = this.cursorStyle.opacity) {
		// console.log('reloadCursorPosition');
		const style = {
			opacity,
		};
		if (this.fullView) {
			const headerHeight = $('#mainHeader').height() as number;
			_.assign(style, {
				left: 0 + 'px',
				top: headerHeight + 'px',
				width: window.innerWidth + 'px',
				height: window.innerHeight - headerHeight + 'px',
			});
		} else if (this.currentTarget) {
			_.assign(style, {
				left: this.currentTarget.offsetLeft + 'px',
				top: this.currentTarget.offsetTop + 'px',
				width: this.currentTarget.offsetWidth + 'px',
				height: this.currentTarget.offsetHeight + 'px',
			});
		}
		_.assign(this.cursorStyle, style);
	}

	ngOnChanges() {
		this.reloadCursorPosition();
	}

	@HostListener('window:resize')
	onResize() {
		this.reloadCursorPosition();
	}

	/*@HostListener('mouseenter')
	onMouseEnter() {
		if(!this.fullView){
			const elements = document.querySelectorAll(':hover');
			const appTilerIndex = _.findIndex(elements, element => element.nodeName.toLowerCase() === 'app-tiler');
			const currentElement = _.get(elements, appTilerIndex + 2);
			//this.currentTarget = _.find(document.querySelectorAll(':hover'), this);
			if(currentElement && currentElement instanceof HTMLElement){
				this.currentTarget = currentElement;
				this.cursorOpacity = 1;
				this.reloadCursorPosition();
			}
		}
	}*/

	@HostListener('mouseleave')
	onMouseLeave() {
		this.willClose = true;
		if (!this.fullView) {
			this.cursorStyle.opacity = 0;
			this.removeTargetContentClass('.hover-block', 'visible');
		}
	}
}
