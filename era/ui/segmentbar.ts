namespace Ui {
    export interface SegmentBarInit extends LBoxInit {
        orientation?: 'horizontal' | 'vertical';
        field?: string;
        data?: Array<any>;
        currentPosition?: number;
        onchanged?: (event: { target: SegmentBar, value: any }) => void;
    }

    export class SegmentBar extends LBox {
        private border: Frame;
        private box: Box;
        private current: SegmentButton;
        private _field: string = 'text';
        private _data: Array<any>;
        private _orientation: 'horizontal' | 'vertical' = 'horizontal';
        readonly changed = new Core.Events<{ target: SegmentBar, value: any }>();
        set onchanged(value: (event: { target: SegmentBar, value: any }) => void) { this.changed.connect(value); }

        constructor(init?: SegmentBarInit) {
            super(init);
            this.focusable = true;

            this.border = new Frame();
            this.append(this.border);

            this.box = new Ui.Box({ uniform: true, margin: 1, spacing: 1, orientation: this._orientation });
            this.append(this.box);

            this.focused.connect(() => this.onStyleChange());
            this.blurred.connect(() => this.onStyleChange());
            this.drawing.addEventListener('keydown', (e) => this.onKeyDown(e));
            
            if (init) {
                if (init.orientation !== undefined)
                    this.orientation = init.orientation;
                if (init.field !== undefined)
                    this.field = init.field;
                if (init.data !== undefined)
                    this.data = init.data;	
                if (init.currentPosition !== undefined)
                    this.currentPosition = init.currentPosition;	
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
            }
        }

        set orientation(orientation: 'horizontal' | 'vertical') {
            this._orientation = orientation;
            this.box.orientation = orientation;
        }

        set field(field: string) {
            this._field = field;
        }

        set data(data: Array<any>) {
            let pos = this.currentPosition;
            while (this.box.firstChild !== undefined) {
                (this.box.firstChild as Ui.SegmentButton).pressed.disconnect(this.onSegmentSelect);
                this.box.remove(this.box.firstChild);
            }
            this._data = data;
            for (let i = 0; i < data.length; i++) {
                let mode;
                if (this._orientation === 'horizontal')
                    mode = (i === 0) ? 'left' : (i === data.length - 1) ? 'right' : 'middle';
                else
                    mode = (i === 0) ? 'top' : (i === data.length - 1) ? 'bottom' : 'middle';
                let segment = new Ui.SegmentButton({ data: data[i], text: data[i][this._field], mode: mode });
                this.box.append(segment, true);
                segment.pressed.connect(this.onSegmentSelect);
            }
            this.currentPosition = Math.max(0, Math.min(pos, this.box.children.length -1));
        }

        set currentPosition(position: number) {
            if ((position >= 0) && (position < this.box.children.length)) {
                this.current = this.box.children[position] as SegmentButton;
                this.onSegmentSelect({ target: this.current });
            }
        }

        get currentPosition(): number {
            for (let i = 0; i < this.box.children.length; i++) {
                if (this.box.children[i] === this.current)
                    return i;
            }
        }

        // Move the current choice to the next choice		
        next() {
            for (let i = 0; i < this.box.children.length; i++) {
                if (this.box.children[i] === this.current) {
                    this.currentPosition = i + 1;
                    break;
                }
            }
        }

        // Move the current choice to the previous choice
        previous() {
            for (let i = 0; i < this.box.children.length; i++) {
                if (this.box.children[i] === this.current) {
                    this.currentPosition = i - 1;
                    break;
                }
            }
        }

        private onSegmentSelect = (e: { target: SegmentButton }) => {
            this.current = e.target;
            this.onStyleChange();
            this.changed.fire({ target: this, value: e.target.data });
        }

        private onKeyDown(event) {
            if (this.isDisabled)
                return;
            let key = event.which;
            if ((key == 37) || (key == 39)) {
                event.stopPropagation();
                event.preventDefault();
            }
            if (key == 37)
                this.previous();
            else if (key == 39)
                this.next();
        }

        protected onStyleChange() {
            let spacing = this.getStyleProperty('spacing');
            let padding = this.getStyleProperty('padding');
            let radius = this.getStyleProperty('radius');
            let borderWidth = this.getStyleProperty('borderWidth');
            this.border.radius = radius;
            this.border.frameWidth = borderWidth;

            let background = this.getStyleProperty('background');
            let backgroundBorder = this.getStyleProperty('backgroundBorder');
            let backgroundMode = this.getStyleProperty('backgroundMode');
            let backgroundSize = this.getStyleProperty('backgroundSize');
            let foreground = this.getStyleProperty('foreground');
            if (this.hasFocus && !this.getIsMouseFocus()) {
                background = this.getStyleProperty('focusBackground');
                backgroundBorder = this.getStyleProperty('focusBackgroundBorder');
                foreground = this.getStyleProperty('focusForeground');
            }
            let activeBackground = this.getStyleProperty('activeBackground');
            let activeForeground = this.getStyleProperty('activeForeground');
            let textHeight = this.getStyleProperty('textHeight');
            let textTransform = this.getStyleProperty('textTransform');

            this.box.margin = borderWidth;
            this.border.fill = backgroundBorder;
            for (let i = 0; i < this.box.children.length; i++) {
                let child = this.box.children[i] as SegmentButton;
                child.radius = Math.max(0, radius - borderWidth);
                child.spacing = padding - borderWidth;
                child.textHeight = textHeight;
                child.textTransform = textTransform;
                if (this.current === child) {
                    child.background = activeBackground;
                    child.foreground = activeForeground;
                }
                else {
                    child.background = background;
                    child.foreground = foreground;
                }
                child.backgroundMode = backgroundMode;
                if(backgroundSize != undefined) { 
                    if(backgroundMode == 'top' || backgroundMode == 'bottom')
                        child.backgroundHeight = backgroundSize;
                    if(backgroundMode == 'left' || backgroundMode == 'right') 
                        child.backgroundWidth = backgroundSize;
                }		
            }
        }
        
        static style: any = {
            borderWidth: 1,
            background: 'rgba(240,240,240,1)',
            backgroundBorder: 'rgba(102,102,102,1)',
            backgroundMode: 'stretch',
            backgroundSize: 5,
            foreground: '#444444',
            focusBackground: 'rgba(240,240,240,1)',
            focusBackgroundBorder: '#07a0e5',
            focusForeground: '#07a0e5',
            activeBackground: '#07a0e5',
            activeForeground: 'rgba(250,250,250,1)',
            radius: 3,
            textHeight: 26,
            spacing: 10,
            padding: 7,
            textTransform: 'uppercase'
        }
    }

    export interface SegmentButtonInit extends PressableInit {
        textTransform?: string;
        foreground?: Color | string;
        data?: any;
        text?: string;
        textHeight?: number;
        mode?: 'left' | 'right' | 'top' | 'bottom';	
        radius?: number;
        spacing?: number;
        background?: Color | string;
    }
    
    export class SegmentButton extends Pressable implements SegmentButtonInit {
        private textBox: LBox;
        private label: CompactLabel;
        private bg: Rectangle;
        private _mode: 'left' | 'right' | 'top' | 'bottom' = undefined;
        private _data: undefined;
        private _radius: number = 3;

        constructor(init?: SegmentButtonInit) {
            super(init);
            this.focusable = false;
            this.bg = new Rectangle();
            this.append(this.bg);
            this.textBox = new LBox();
            this.append(this.textBox);
            this.label = new CompactLabel({ verticalAlign: 'center', whiteSpace: 'nowrap', textAlign: 'center' });
            this.textBox.content = this.label;
            
            if (init) {
                if (init.textTransform !== undefined)
                    this.textTransform = init.textTransform;	
                if (init.foreground !== undefined)
                    this.foreground = init.foreground;
                if (init.data !== undefined)
                    this.data = init.data;
                if (init.text !== undefined)
                    this.text = init.text;
                if (init.textHeight !== undefined)
                    this.textHeight = init.textHeight;
                if (init.mode !== undefined)
                    this.mode = init.mode;	
                if (init.radius !== undefined)
                    this.radius = init.radius;	
                if (init.spacing !== undefined)
                    this.spacing = init.spacing;	
                if (init.background !== undefined)
                    this.background = init.background;	
            }
        }

        set textTransform(textTransform: string) {
            this.label.textTransform = textTransform;
        }

        set foreground(color: Color | string) {
            this.label.color = Color.create(color);
        }

        get data(): any {
            return this._data;
        }

        set data(data: any) {
            this._data = data;
        }

        set text(text: string) {
            this.label.text = text;
        }

        set textHeight(height: number) {
            this.textBox.height = height;
        }

        set mode(mode: 'left' | 'right' | 'top' | 'bottom') {
            this._mode = mode;
            if (mode == 'left') {
                this.bg.radiusTopLeft = this._radius;
                this.bg.radiusBottomLeft = this._radius;
                this.bg.radiusTopRight = 0;
                this.bg.radiusBottomRight = 0;
            }
            else if (mode == 'right') {
                this.bg.radiusTopLeft = 0;
                this.bg.radiusBottomLeft = 0;
                this.bg.radiusTopRight = this._radius;
                this.bg.radiusBottomRight = this._radius;
            }
            else if (mode == 'top') {
                this.bg.radiusTopLeft = this._radius;
                this.bg.radiusBottomLeft = 0;
                this.bg.radiusTopRight = this._radius;
                this.bg.radiusBottomRight = 0;
            }
            else if (mode == 'bottom') {
                this.bg.radiusTopLeft = 0;
                this.bg.radiusBottomLeft = this._radius;
                this.bg.radiusTopRight = 0;
                this.bg.radiusBottomRight = this._radius;
            }
            else {
                this.bg.radiusTopLeft = 0;
                this.bg.radiusBottomLeft = 0;
                this.bg.radiusTopRight = 0;
                this.bg.radiusBottomRight = 0;
            }
        }
    
        set radius(radius: number) {
            this._radius = radius;
            this.mode = this._mode;
        }

        set spacing(spacing: number) {
            this.textBox.margin = spacing;
        }

        set background(color: Color | string) {
            this.bg.fill = color;
        }

        set backgroundMode(mode: 'top'|'bottom'|'left'|'right'|'stretch') {
            if( mode == 'top' || mode == 'bottom') {
                this.bg.horizontalAlign = 'stretch';
                this.bg.verticalAlign = mode;
            } else if( mode == 'left' || mode == 'right') {
                this.bg.horizontalAlign = mode;
                this.bg.verticalAlign = 'stretch';
            } else {
                this.bg.horizontalAlign = 'stretch';
                this.bg.verticalAlign = 'stretch';
            }
        }

        set backgroundWidth(width: number) {
            this.bg.width = width;
        }

        set backgroundHeight(height: number) {
            this.bg.height = height;
        }

        protected onDisable() {
            super.onDisable();
            this.bg.opacity = 0.2;
        }

        protected onEnable() {
            super.onEnable();
            this.bg.opacity = 1;
        }
    }
}
