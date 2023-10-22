const { SerialPort } = require("serialport");
var protobuf = require("protobufjs");

// TODO: Use COBS to decode data

// Create a port
const port = new SerialPort({
  path: "COM3",
  baudRate: 115200,
});

protobuf.load("common.proto").then(function (root) {
  var AwesomeMessage = root.lookupType("common.SimpleMessage");
  port.on("readable", function () {
    var chunk = port.read(); // Reads whole buffer from serial port
    if (chunk == undefined) return;
    console.log("RawData:", chunk);

    // Get packet id from chunk
    id = chunk.slice(0, 2);
    console.log(id.readInt16LE(0));

    // Remove id from chunk
    chunk = chunk.slice(2);
    var message = AwesomeMessage.decode(chunk);
    console.log(message);
  });
});
