module.exports.create = create

const MicroGear = require('microgear');
const events = require('events');

let Netpie = function(option) {
	let that = this;

	this.option = option;

	this.microgear = MicroGear.create({
	    appid : option.appid,
	    key : option.key,
	    secret : option.secret
	});

	this.microgear.on('connected', function() {
		that.emit('connected');
	});

	this.microgear.on('message', function(topic, body) {
		that.emit('message', topic, body.toString());
	});

	this.microgear.on('closed', function() {
		that.emit('closed');
	});
}

Netpie.prototype = new events.EventEmitter;

Netpie.prototype.connect = function() {
	this.microgear.connect(this.option.appid);
}

Netpie.prototype.publish = function(topic, payload) {
	return this.microgear.publish(topic, payload);
}

Netpie.prototype.subscribe = function(topic) {
	return this.microgear.subscribe(topic);
}

Netpie.prototype.unsubscribe = function(topic) {
	return this.microgear.unsubscribe(topic);
}

Netpie.prototype.disconnect = function() {
	return this.microgear.disconnect();
}

Netpie.prototype.connected = function() {
	return this.microgear.connected();
}

function create(option) {
	return new Netpie(option);
}
