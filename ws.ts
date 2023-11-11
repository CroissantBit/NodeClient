import {
  DeviceInfoResponse,
  Ping,
  RegisterClientResponse,
  VideoMetadataResponse,
} from "./types/main";
import WebSocket from "ws";
import { DeviceInfo, VideoMetadata } from "./types/metadata";

const server = new WebSocket.Server({
  port: 8081,
});
server.binaryType = "arraybuffer";
console.log("Server started");

server.on("close", () => {
  console.log("Client disconnected");
});

server.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    let msgId = message[0];
    let msgData = message.slice(1);
    console.log("Received:", msgId);
    switch (msgId) {
      case 1:
        Ping.decode(msgData);
        ws.send(new Uint8Array([2]));
        break;

      case 2:
        console.log("Got pong");
        break;

      case 3:
        console.log("Sending register response");
        var buffer = RegisterClientResponse.encode(
          RegisterClientResponse.create({ clientId: 1 })
        ).finish();
        var response = new Uint8Array([4, ...buffer]);
        ws.send(response);
        break;

      case 8:
        console.log("Got VideoMetadataListRequest");
        var buffer = VideoMetadataResponse.encode(
          VideoMetadataResponse.create({
            videosMetadata: [
              VideoMetadata.create({
                id: 1,
                processing: true,
                title: "Test",
                duration: 245041,
                bpm: 120,
                size: 1000,
                bitrate: 1000,
              }),
              VideoMetadata.create({
                id: 2,
                processing: false,
                title: "Test 2",
                duration: 81021,
                bpm: 120,
                size: 1000,
                bitrate: 1000,
              }),
              VideoMetadata.create({
                id: 3,
                processing: false,
                title: "Test 3",
                duration: 81021,
                bpm: 120,
                size: 1000,
                bitrate: 1000,
              }),
              VideoMetadata.create({
                id: 4,
                processing: false,
                title: "Test 4",
                duration: 81000021,
                bpm: 99999,
                size: 1000,
                bitrate: 1000,
              }),
            ],
          })
        ).finish();
        var response = new Uint8Array([9, ...buffer]);
        ws.send(response);

        setTimeout(() => {
          var buffer = VideoMetadataResponse.encode(
            VideoMetadataResponse.create({
              videosMetadata: [
                VideoMetadata.create({
                  id: 1,
                  processing: false,
                  title: "Test New",
                  duration: 245041,
                  bpm: 120,
                  size: 1000,
                  bitrate: 1000,
                }),
                VideoMetadata.create({
                  id: 2,
                  processing: true,
                  title: "Test 555",
                  duration: 81021,
                  bpm: 120,
                  size: 1000,
                  bitrate: 1000,
                }),
              ],
            })
          ).finish();
          var response = new Uint8Array([9, ...buffer]);
          ws.send(response);
        }, 3000);
        break;

      case 14:
        console.log("Got DeviceInfoListRequest");
        var buffer = DeviceInfoResponse.encode({
          devices: [
            DeviceInfo.create({
              id: 1,
              friendlyName: "Test",
              supportsAudio: true,
              supportsVideo: true,
              supportsControl: true,
              ping: 100,
              uptime: 1000,
              wirelessDeviceInfo: {
                ip: "localhost",
                port: 8080,
              },
            }),
          ],
        }).finish();

        var response = new Uint8Array([15, ...buffer]);
        ws.send(response);

        setTimeout(() => {
          var buffer = DeviceInfoResponse.encode({
            devices: [
              DeviceInfo.create({
                id: 1,
                friendlyName: "Test 1",
                supportsAudio: true,
                supportsVideo: true,
                supportsControl: false,
                ping: 250,
                uptime: 5000,
                wirelessDeviceInfo: {
                  ip: "localhost",
                  port: 8080,
                },
              }),
              DeviceInfo.create({
                id: 2,
                friendlyName: "Test 2",
                supportsAudio: true,
                supportsVideo: true,
                supportsControl: false,
                ping: 100,
                uptime: 1000,
                wiredDeviceInfo: {
                  port: "COM3",
                },
              }),
            ],
          }).finish();

          var response = new Uint8Array([15, ...buffer]);
          ws.send(response);
        }, 3000);
    }
  });
  ws.send(new Uint8Array([1]));
});
