const { SerialPort } = require("serialport");
var protobuf = require("protobufjs");

// TODO: Use COBS to decode data

// Create a port
const port = new SerialPort({
  path: "COM3",
  baudRate: 115200,
});
console.log("READY");

protobuf.load("common.proto").then(function (root) {
  var AwesomeMessage = root.lookupType("croissantbit.Pong");
  port.on("readable", function () {
    var chunk = port.read(); // Reads whole buffer from serial port
    if (chunk == undefined) return;
    console.log("RawData:", chunk);

    // Get packet id from chunk
    id = chunk.slice(0, 2);
    chunk = chunk.slice(2);

    switch (id.readInt16LE(0)) {
      case 1:
        console.log("Got Ping request");
        break;
      case 2:
        console.log("Got Pong response");
        var message = AwesomeMessage.decode(chunk);
        console.log(message);
        break;
    }

    console.log("====================================");
  });

  setInterval(() => {
    // Send ping packet
    var ping = root.lookupType("croissantbit.Ping");
    var buf = ping.encode().finish();
    var packet = Buffer.concat([Buffer.from([1, 0]), buf]);
    console.log("Sending:", packet);
    port.write(packet);
  }, 5000);
});
