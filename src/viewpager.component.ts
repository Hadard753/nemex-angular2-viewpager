import { Component, ElementRef, Renderer, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/platform-browser';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

import { PointerPosition } from './pointer_position';
import * as util from './utils';

@Component({
    selector: 'nemex-viewpager',
    template:
    `<div class="viewpager" (mousedown)="onMouseDown($event)" (mouseup)="onMouseUp($event)" (touchstart)="onMouseDown($event)" (touchend)="onMouseUp($event)">
        <div class="viewpager-content">
            <ng-content></ng-content>
        </div>
    </div>`,
    styles: [
        `.viewpager {
          display: block;
          width: 100%;
          height: 800px;
          overflow: hidden;
      }
      
      .viewpager-content {
          position: relative;
          display: block;
          height: 100%;   
      }`
    ]
})
export class ViewPagerComponent {
    private mouseMoveBind: EventListener;
    private mouseMoveBound = false;
    private previousPointerPosition:PointerPosition;

    constructor(private el: ElementRef,
        private renderer: Renderer,
        private sanitizer: DomSanitizer,
        @Inject(DOCUMENT) private document: any) {
        this.mouseMoveBind = this.onWindowMouseMove.bind(this);
    }

    get viewPagerElement() {
        return this.el.nativeElement.children[0];
    }

    get viewPagerContentElement() {
        return this.viewPagerElement.children[0];
    }

    get viewPagerItems() {
        return this.viewPagerContentElement.children;
    }

    ngAfterViewInit() {
        this.prepareElements();
    }

    onMouseDown(event: Event) {
        event.preventDefault();

        if (!this.mouseMoveBound) {
            this.document.addEventListener('touchmove', this.mouseMoveBind);
            this.document.addEventListener('mousemove', this.mouseMoveBind);

            this.mouseMoveBound = true;
        }
    }

    onWindowMouseMove(event: Event) {
        if (util.isMouseInBounds(event, this.viewPagerElement, 0, this.document)) {
            let pointerPosition = util.getPointerPosition(event);

            if (this.previousPointerPosition == null)
                this.previousPointerPosition = pointerPosition;
            else {
                let deltaPosition = pointerPosition.getDeltaPointerPosition(this.previousPointerPosition);

                // Update the viewpager location according to the mouse delta position
                this.viewPagerElement.scrollLeft += deltaPosition.x;
            }

            this.previousPointerPosition = pointerPosition;
        }
    }

    onMouseUp(event: Event) {
        if (this.mouseMoveBound) {
            document.removeEventListener('touchmove', this.mouseMoveBind);
            document.removeEventListener('mousemove', this.mouseMoveBind);
            this.previousPointerPosition = null;
            this.mouseMoveBound = false;

            // Complete the sliding animation the user attempted to slide to
        }
    }

    prepareElements() {
        let index = 0;
        let canvasWidth = this.viewPagerElement.clientWidth;
        for (let child of this.viewPagerItems)
            this.prepareElementForViewpager(child, canvasWidth, index++);

        this.viewPagerContentElement.style.width = (index * canvasWidth) + "px";
    }

    prepareElementForViewpager(el, width, index) {
        el.style.display = "block";
        el.style.position = "absolute";
        el.style.top = "0px";
        el.style.left = (width * index) + "px";
        el.style.width = width + "px";
        el.style.height = "100%";
    }

    getCurrentElementInView() {
        var childrenCount = this.viewPagerItems;
    }

    slideToElement(index) {
        var currentScrollLeft = this.viewPagerElement.scrollLeft;
    }
}