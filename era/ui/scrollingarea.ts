namespace Ui {

    export class Scrollbar extends Movable {
        private rect: Rectangle;
        private over: Overable;
        private clock?: Anim.Clock;

        constructor(private orientation: Orientation) {
            super();
            this.cursor = 'inherit';
            this.focusable = false;
            this.over = new Overable();
            this.content = this.over;
            this.rect = new Rectangle();
            if (orientation == 'horizontal') {
                this.rect.width = 30; this.rect.height = 5;
                this.over.height = 15;
                this.rect.verticalAlign = 'bottom';
            }
            else {
                this.rect.width = 5; this.rect.height = 30;
                this.over.width = 15;
                this.rect.horizontalAlign = 'right';
            }
            this.over.content = this.rect;
            this.over.entered.connect(() => this.startAnim());
            this.over.leaved.connect(() => this.startAnim());
            this.downed.connect(() => this.startAnim());
            this.upped.connect(() => this.startAnim());
        }

        set radius(radius: number) {
            this.rect.radius = radius;
        }

        set fill(color: Color) {
            this.rect.fill = color;
        }

        private startAnim() {
            if (this.clock == undefined) {
                this.clock = new Anim.Clock();
                this.clock.duration = 'forever';
                this.clock.timeupdate.connect((e) => this.onTick(e.target, e.progress, e.deltaTick));
                this.clock.begin();
            }
        }

        protected onTick(clock: Anim.Clock, progress: number, deltaTick: number) {
            let d = deltaTick * 30;

            let view = this.over.isOver || this.isDown;

            if (!view)
                d = -d;

            let s = Math.max(5 , Math.min(15,
                ((this.orientation == 'vertical') ? this.rect.width : this.rect.height) + d));
            if (this.orientation == 'vertical')
                this.rect.width = s;
            else
                this.rect.height = s;
            if ((!view && s == 5) || (view && s == 15)) {
                if (this.clock)
                    this.clock.stop();
                this.clock = undefined;
            }
        }
    }

    export interface ScrollingAreaInit extends ScrollableInit {
    }

    export class ScrollingArea extends Scrollable implements ScrollingAreaInit {

        private horizontalScrollbar: Scrollbar;
        private verticalScrollbar: Scrollbar;

        constructor(init?: ScrollingAreaInit) {
            super(init);
            this.horizontalScrollbar = new Scrollbar('horizontal');
            this.setScrollbarHorizontal(this.horizontalScrollbar);

            this.verticalScrollbar = new Scrollbar('vertical');
            this.setScrollbarVertical(this.verticalScrollbar);
        }

        protected onStyleChange() {
            let radius = this.getStyleProperty('radius');
            this.horizontalScrollbar.radius = radius;
            this.verticalScrollbar.radius = radius;
    
            let color = this.getStyleProperty('color');
            this.horizontalScrollbar.fill = color;
            this.verticalScrollbar.fill = color;
        }

        static style: any = {
            color: 'rgba(50,50,50,0.7)',
            radius: 0
        }
    }
}