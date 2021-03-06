namespace Ui {

    export class DraggableWatcher extends Core.Object {
        allowedMode: string | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' = 'all';
        // the data that we drag & drop
        data: any;
        private _dragDelta: Point;
        private dataTransfer: DragDataTransfer;
        private element: Ui.Element;
        private start: (watcher: DraggableWatcher) => void;
        private end: (watcher: DraggableWatcher, effect: 'none' | 'copy' | 'link' | 'move' | string) => void;

        constructor(init: {
            element: Ui.Element,
            data: any,
            start?: (watcher: DraggableWatcher) => void,
            end?: (watcher: DraggableWatcher, effect: 'none' | 'copy' | 'link' | 'move' | string) => void
        }) {
            super();
            this.element = init.element;
            this.element.drawing.style.touchAction = 'none';
            this.data = init.data;
            if (init.start !== undefined)
                this.start = init.start;
            if (init.end !== undefined)
                this.end = init.end;
            this.element.ptrdowned.connect(e => this.onDraggablePointerDown(e));
        }

        get dragDelta(): Point {
            return this._dragDelta;
        }

        private onDraggablePointerDown(event: PointerEvent): void {
            // left and middle mouse button only
            if (event.pointerType == 'mouse' && event.pointer.button != 0 && event.pointer.button != 1)
                return;	
            if (this.element.isDisabled || (this.data === undefined))
                return;

            let delayed = !(event.pointerType == 'mouse' && event.pointer.button == 0);
            
            let dataTransfer = new DragEmuDataTransfer(
                this.element, event.clientX, event.clientY, delayed, event.pointer);
            this.dataTransfer = dataTransfer;
            this._dragDelta = this.element.pointFromWindow(new Point(event.clientX, event.clientY));
            dataTransfer.started.connect(e => this.onDragStart(dataTransfer));
            dataTransfer.ended.connect(e => this.onDragEnd(dataTransfer));
        }

        private onDragStart(dataTransfer: DragEmuDataTransfer): void {
            let selection = Selectionable.getParentSelectionHandler(this.element);
            if (selection && (selection.elements.indexOf(this.element as any) != -1))
                dataTransfer.setData(selection);
            else
                dataTransfer.setData(this.data);
            dataTransfer.effectAllowed = this.allowedMode;
            if (this.start)
                this.start(this);
        }

        private onDragEnd(dataTransfer: DragEmuDataTransfer): void {
            let action = 'none';
            if (dataTransfer.dropEffect && dataTransfer.dropEffect.length > 0)
                action = dataTransfer.dropEffect[0].action;
            // dropEffect give the operation done: [none|copy|link|move]
            if (this.end)
                this.end(this, action);
            
        }
    }

    export interface DraggableInit extends PressableInit {
        ondragstarted?: (event: { target: Draggable, dataTransfer: DragEmuDataTransfer }) => void;
        ondragended?: (event: { target: Draggable, effect: string }) => void;
    }

    export class Draggable extends Pressable implements DraggableInit
    {
        //
        // Fires when object start to be dragged
        // @name Ui.Draggable#dragstart
        // @event
        // @param {Ui.Draggable} draggable The draggable itself
        //

        //
        // Fires when object stop to be dragged
        // @name Ui.Draggable#dragend
        // @event
        // @param {Ui.Draggable} draggable The draggable itself
        // @param {string} dropEffect Give the operation done: [none|copy|link|move]
        //

        allowedMode: any = 'all';
        // the data that we drag & drop
        draggableData: any;
        private _dragDelta: Point;
        private dataTransfer: DragDataTransfer;
        readonly dragstarted = new Core.Events<{ target: Draggable, dataTransfer: DragEmuDataTransfer }>();
        set ondragstarted(value: (event: { target: Draggable, dataTransfer: DragEmuDataTransfer }) => void) { this.dragstarted.connect(value); }
        readonly dragended = new Core.Events<{ target: Draggable, effect: string }>();
        set ondragended(value: (event: { target: Draggable, effect: string }) => void) { this.dragended.connect(value); }

        constructor(init?: DraggableInit) {
            super(init);
            this.drawing.style.touchAction = 'none';
            this.ptrdowned.connect((e) => this.onDraggablePointerDown(e));
            if (init) {
                if (init.ondragstarted)
                    this.dragstarted.connect(init.ondragstarted);	
                if (init.ondragended)
                    this.dragended.connect(init.ondragended);	
            }
        }

        //
        // Set the allowed operation. Possible values are:
        // [copy|copyLink|copyMove|link|linkMove|move|all]
        //
        setAllowedMode(allowedMode): void {
            this.allowedMode = allowedMode;
        }

        get dragDelta(): Point {
            return this._dragDelta;
        }

        private onDraggablePointerDown(event: PointerEvent): void {
            // left and middle mouse button only
            if (event.pointerType == 'mouse' && event.pointer.button != 0 && event.pointer.button != 1)
                return;	
            if (this.lock || this.isDisabled || (this.draggableData === undefined))
                return;

            let delayed = !(event.pointerType == 'mouse' && event.pointer.button == 0);
            
            let dataTransfer = new DragEmuDataTransfer(
                this, event.clientX, event.clientY, delayed, event.pointer);
            this.dataTransfer = dataTransfer;
            this._dragDelta = this.pointFromWindow(new Point(event.clientX, event.clientY));
            dataTransfer.started.connect(e => this.onDragStart(dataTransfer));
            dataTransfer.ended.connect(e => this.onDragEnd(dataTransfer));
        }

        protected onDragStart(dataTransfer: DragEmuDataTransfer): void {
            let selection = Selectionable.getParentSelectionHandler(this);
            if (selection && (selection.elements.indexOf(this as any) != -1))
                dataTransfer.setData(selection);
            else
                dataTransfer.setData(this.draggableData);
            dataTransfer.effectAllowed = this.allowedMode;
            this.dragstarted.fire({ target: this, dataTransfer: dataTransfer });
        }

        protected onDragEnd(dataTransfer: DragEmuDataTransfer): void {
            // dropEffect give the operation done: [none|copy|link|move]
            this.dragended.fire({ target: this, effect: dataTransfer.dropEffect });
        }
    }
}	

