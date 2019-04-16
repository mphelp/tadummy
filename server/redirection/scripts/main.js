
input = new Input()
form  = new Form()

input.createInput();
form.createForm("theform", "35.153.114.63", "8009");
input.addTo(form);
form.addToDocument();
