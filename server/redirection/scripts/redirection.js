
function Input(){
	this.createInput = function(){
		this.item = document.createElement("INPUT");
		this.item.setAttribute("type", "hidden");
	}
	this.addTo = function(node){
		node.item.appendChild(this.item);
	}
}
function Form(){
	this.createForm = function(id, ip, port){
		this.item = document.createElement("FORM");

		let client = "http://"+ip+":"+port;

		this.item.setAttribute("method", "post");
		this.item.setAttribute("action", client);
		this.item.setAttribute("id", id);
	}

	this.addToDocument = function(){
		document.body.appendChild(this.item);
	}
}


