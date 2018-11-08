const Netpie = require('./netpie');
const mosca = require('mosca');

let netpie = Netpie.create({
	appid: '{APPID}',
	key: '{KEY}}',
	secret: '{SECRET}}'
})

let moscaserver = new mosca.Server({
	port: 1883
});

moscaserver.on('published', function(packet, client) {
	if (netpie.connected() && client != null) {
		console.log('outgoing msg to NETPIE --- '+packet.topic+' : '+packet.payload.toString());
		netpie.publish(packet.topic, packet.payload.toString());
	}
});

moscaserver.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

moscaserver.on('ready', function() {
    console.log('Mosca server is up and running...');
});

netpie.on('connected', function() {
	netpie.subscribe('/#');
	console.log('connected to netpie...');
})

netpie.on('message', function(topic, payload) {
	console.log('incoming msg from NETPIE --- '+topic+' : '+payload);
	if(topic) {
		let msgobj = {
	 	    topic : '/'+topic.split('/').splice(2).join('/'),
 	 	    payload : payload,
 	 	    qos: 0,
 	 	    retain: false
   	    }
	    moscaserver.publish(msgobj, function(){
   	    });
	}
})

netpie.connect();
