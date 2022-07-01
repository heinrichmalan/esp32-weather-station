
from datetime import datetime
import math

import paho.mqtt.client as mqtt

from db.db_setup import device, sensor, sensor_reading, engine, Device, Session


conn = engine.connect()

# The callback for when the client receives a CONNACK response from the server.


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("esp32/#")

# The callback for when a PUBLISH message is received from the server.


def on_message(client, userdata, msg):
    topic: str = msg.topic
    payload = float(msg.payload.decode())
    print(topic, payload)
    if math.isnan(payload):
        print("Value was NaN")
        return
    _, device_name, sensor_type = topic.split("/")
    print(device_name, sensor_type, payload)
    device_entry = conn.execute(device.select().where(
        device.c.name == device_name)).fetchone()

    if not device_entry:
        print("Device with name {device_name} not found. Creating.")
        with Session() as session:
            device_entry = Device(name=device_name)
            session.add(device_entry)
            session.commit()

    device_id = device_entry.id

    sensor_entry = conn.execute(sensor.select().where(
        sensor.c.type == sensor_type)).fetchone()

    if not sensor_entry:
        print(f"Sensor not found for type {sensor_type}")
        return

    sensor_id = sensor_entry.id

    print(f"Device: {device_name}, Sensor: {sensor_type}, Payload: {payload}")
    ins = sensor_reading.insert().values(
        device=device_id, sensor_type=sensor_id, value=payload)
    conn.execute(ins)


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

print("Connecting to mqtt client")
client.connect("mqtt", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
print("Looping forever")
client.loop_forever()
conn.close()
