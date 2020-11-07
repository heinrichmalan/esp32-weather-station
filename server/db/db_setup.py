from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Table, Column, Integer, String, MetaData, Float, ForeignKey, create_engine, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker
engine = create_engine('postgresql:///sensor_data')
con = engine.connect()
meta = MetaData()

device = Table(
    'device', meta,
    Column('id', Integer, primary_key=True),
    Column('name', String)
)

sensor = Table(
    'sensor', meta,
    Column('id', Integer, primary_key=True),
    Column('type', String),
    Column('units', String),
)

sensor_reading = Table(
    'sensor_reading', meta,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('device', Integer, ForeignKey("device.id"), nullable=False),
    Column('sensor_type', Integer, ForeignKey("sensor.id"), nullable=False),
    Column('value', Float),
    Column('time_taken', DateTime(timezone=True), server_default=func.now())
)


Base = declarative_base()


class Device(Base):
    __tablename__ = "device"

    id = Column('id', Integer, primary_key=True)
    name = Column('name', String)


class Sensor(Base):
    __tablename__ = 'sensor'
    id = Column('id', Integer, primary_key=True)
    type = Column('type', String)
    units = Column('units', String)


class SensorReading(Base):
    __tablename__ = 'sensor_reading'
    id = Column('id', Integer, primary_key=True, autoincrement=True)
    device = Column('device', Integer, ForeignKey("device.id"), nullable=False)
    sensor_type = Column('sensor_type', Integer,
                         ForeignKey("sensor.id"), nullable=False)
    value = Column('value', Float)
    time_taken = Column('time_taken', DateTime(
        timezone=True), server_default=func.now())


Session = sessionmaker(bind=engine)


def set_up():
    meta.create_all(engine)
