/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();
		let vbox = new Ui.VBox();
		this.content = vbox;

		let tb = new Ui.HBox();
		vbox.append(tb);

		tb.append(new Ui.Button({ text: 'test 1' }));
		tb.append(new Ui.Button({ text: 'test 2' }));

		vbox.append(new Ui.Button({
			text: 'Open dialog',
			verticalAlign: 'center', horizontalAlign: 'center',
			onpressed: () => {
				let dialog = new Ui.Dialog({
					title: 'Test Dialog',
					cancelButton: new Ui.DialogCloseButton({ text: 'Annuler' }),
					actionButtons: [
						new Ui.Button({ text: 'Previous' }),
						new Ui.Button({ text: 'Next' })
					],
					content: new Ui.Rectangle({ fill: 'lightgreen', width: 350, height: 200 })
				});
				dialog.open();
			}
		}), true);
	}
}

new App();
