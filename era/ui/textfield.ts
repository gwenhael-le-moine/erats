namespace Ui {
	export interface TextFieldInit extends LBoxInit {
		textHolder?: string;
		passwordMode?: boolean;
		value?: string;
		onchanged?: (event: { target: TextField, value: string }) => void;
		onvalidated?: (event: { target: TextField }) => void;
	}

	export class TextField extends LBox {
		private entry: Entry;
		private graphic: TextBgGraphic;
		private textholder: Label;
		readonly changed = new Core.Events<{ target: TextField, value: string }>();
		readonly validated = new Core.Events<{ target: TextField }>();

		constructor(init?: TextFieldInit) {
			super(init);

			this.padding = 0;
		
			this.graphic = new TextBgGraphic();
			this.append(this.graphic);

			this.textholder = new Label();
			this.textholder.opacity = 0.5;
			this.textholder.horizontalAlign = 'left';
			this.textholder.margin = 5;
			this.textholder.marginLeft = 10;
			this.textholder.marginRight = 10;
			this.append(this.textholder);

			this.entry = new Ui.Entry();
			this.entry.margin = 5;
			this.entry.marginLeft = 10;
			this.entry.marginRight = 10;
			this.entry.fontSize = 16;
			this.entry.focused.connect(() => this.onEntryFocus());
			this.entry.blurred.connect(() => this.onEntryBlur());
			this.append(this.entry);

			this.entry.changed.connect((e) => this.onEntryChange(e.target, e.value));
			this.entry.validated.connect(() => this.validated.fire({ target: this }));
			if (init) {
				if (init.textHolder !== undefined)
					this.textHolder = init.textHolder;
				if (init.passwordMode !== undefined)
					this.passwordMode = init.passwordMode;
				if (init.value !== undefined)
					this.value = init.value;	
				if (init.onchanged)
					this.changed.connect(init.onchanged);
				if (init.onvalidated)
					this.validated.connect(init.onvalidated);
			}
		}

		set textHolder(text: string) {
			this.textholder.text = text;
		}

		set passwordMode(passwordMode: boolean) {
			this.entry.passwordMode = passwordMode;
		}

		get value(): string {
			return this.entry.value;
		}

		set value(value: string) {
			this.entry.value = value;
			if ((value === undefined) || (value === ''))
				this.textholder.show();
			else
				this.textholder.hide();
		}

		private onEntryFocus() {
			this.textholder.hide();
			this.graphic.hasFocus = true;
		}

		private onEntryBlur() {
			if (this.value === '')
				this.textholder.show();
			this.graphic.hasFocus = false;
		}

		private onEntryChange(entry, value) {
			this.changed.fire({ target: this, value: value });
		}
	}
}	

