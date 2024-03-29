import math
from datetime import datetime, timedelta

from flask import jsonify

from app import app
from db.db_setup import con, sensor_reading, sensor, Session, Sensor, SensorReading, Device
from sqlalchemy import select, desc, asc
from flask import request


@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/sensors')
def available_sensors():
    session = Session()
    q = session.query(Device)
    res = q.all()

    data = [{"id": d.id, "name": d.name} for d in res]
    session.close()
    return jsonify({"sensors": data})


@app.route('/sensor-data/<station_id>/historical')
def sensor_data(station_id):
    kwargs = {}
    if request.args:
        kwargs = {k: int(v) for k, v in request.args.items()}
    else:
        kwargs = {"hours": 3}
    three_hours_ago = datetime.now() - timedelta(**kwargs)
    j = sensor_reading.join(
        sensor, sensor_reading.c.sensor_type == sensor.c.id)
    query = select([sensor_reading, sensor]).select_from(j).where(
        sensor_reading.c.time_taken >= three_hours_ago).where(sensor_reading.c.device == int(station_id)).order_by(asc(sensor_reading.c.time_taken))
    res = con.execute(query)

    temp_data = []
    hum_data = []
    press_data = []

    for row in res:
        time = row.time_taken.timestamp() * 1000
        value = row.value
        if math.isnan(value):
            continue

        if row.type == 'temperature':
            temp_data.append((time, value))
        elif row.type == 'humidity':
            hum_data.append((time, value))
        elif row.type == 'air_pressure':
            press_data.append((time, value))

    mod = math.ceil(len(temp_data) / 2200)
    temp_data = [datum for i, datum in enumerate(temp_data) if i % mod == 0]
    hum_data = [datum for i, datum in enumerate(hum_data) if i % mod == 0]
    press_data = [datum for i, datum in enumerate(press_data) if i % mod == 0]

    return jsonify({
        'tempData': temp_data,
        'humData': hum_data,
        'pressData': press_data
    })


@app.route('/sensor-data/<station_id>/latest')
def latest_sensor_data(station_id):
    session = Session()
    latest_temp = session.query(SensorReading, Sensor).filter(SensorReading.sensor_type == Sensor.id).\
        filter(SensorReading.device == int(station_id)).\
        filter(Sensor.type == "temperature").order_by(
            desc(SensorReading.time_taken)).first()

    if latest_temp:
        temp_sr, temp_s = latest_temp
        temp = temp_sr.value
        units = temp_s.units
        temp = f"{temp} {units}"
    else:
        temp = "N/A"

    latest_humidity = session.query(SensorReading, Sensor).filter(SensorReading.sensor_type == Sensor.id).\
        filter(SensorReading.device == int(station_id)).\
        filter(Sensor.type == "humidity").order_by(
            desc(SensorReading.time_taken)).first()
    
    if latest_humidity:
        hum_sr, hum_s = latest_humidity
        humidity = hum_sr.value
        units = hum_s.units
        humidity = f"{humidity} {units}"
    else:
        humidity = "N/A"

    latest_pressure = session.query(SensorReading, Sensor).filter(SensorReading.sensor_type == Sensor.id).\
        filter(SensorReading.device == int(station_id)).\
        filter(Sensor.type == "air_pressure").order_by(
            desc(SensorReading.time_taken)).first()

    if latest_pressure:
        press_sr, press_s = latest_pressure
        pressure = press_sr.value
        units = press_s.units
        pressure = f"{pressure} {units}"
    session.close()
    return jsonify({
        'temperature': temp,
        'humidity': humidity,
        'pressure': pressure
    })
