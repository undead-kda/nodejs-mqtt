const dotenv = require('dotenv');
const mqtt = require('mqtt');

dotenv.config();

const mqttHost = process.env.MQTT_HOST;
const port = process.env.PORT;

let connectToBroker = (clientId) => {
  const hostURL = `mqtt://${mqttHost}:${port}`;

  const options = {
    keepalive: 60,
    clientId: clientId,
    username: 'Admin',
    password: '7654321',
    prtocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  let mqttClient = mqtt.connect(hostURL, options);

  mqttClient.on('error', (err) => {
    console.log('Error: ', err);
    mqttClient.end();
  });

  mqttClient.on('reconnect', () => {
    console.log('Reconnecting...');
  });

  mqttClient.on('connect', () => {
    console.log('Client connected: ' + clientId);
  });

  mqttClient.on('message', (topic, message, packet) => {
    console.log(
      'Received Message: ' + message.toString() + '\nOn topic: ' + topic
    );
  });

  return mqttClient;
};

let clientId = 'client-' + Math.random().toString(36).substring(7);
mqttClient = connectToBroker(clientId);
mqttClient.subscribe('temperature', { qos: 0 });
