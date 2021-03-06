"use strict";
/// <reference path="../../era/era.d.ts" />
//
// Play with Ui.VBox, the element allow vertical stacking
//
var app = new Ui.App();
var vbox1 = new Ui.VBox();
app.content = vbox1;
// create a 20 tall rectangle. The default packing behavior of element
// is to stretch the available size. In this case, the width will be
// stretched to the parent vbox width
vbox1.append(new Ui.Rectangle({ fill: 'orange', height: 20 }));
// the second argument (true) specify that the vbox can use this
// rectangle to fill all the available space
vbox1.append(new Ui.Rectangle({ fill: 'lightgreen' }), true);
// unlike the first rectangle, specify that we want this element
// to be horizontaly centered
vbox1.append(new Ui.Rectangle({ fill: 'brown', width: 100, height: 20, horizontalAlign: 'center' }));
