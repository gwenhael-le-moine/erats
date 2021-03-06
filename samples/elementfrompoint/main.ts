/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();
		this.ptrdowned.connect((event: Ui.PointerEvent) => {
			console.log('ptrdown at: '+event.pointer.getX()+','+event.pointer.getY()+' found: '+
				Ui.App.current.elementFromPoint(new Ui.Point(event.pointer.x, event.pointer.y)));
			Ui.Toast.send(`${Ui.App.current.elementFromPoint(new Ui.Point(event.pointer.x, event.pointer.y))}`);
		}, true);

		let vbox = new Ui.VBox({ spacing: 10, margin: 10 });
		this.content = vbox;

		vbox.append(new Ui.Button({ text: 'Click me', icon: 'star' }));

		vbox.append(new Ui.Rectangle({ fill: 'purple', height: 100 }));

		vbox.append(new Ui.Text({ text: 'Some text sample' }));
	}
}

new App();
