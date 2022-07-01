FROM eclipse-mosquitto

COPY mosquitto.conf /mosquitto/config/mosquitto.conf

RUN mosquitto_passwd -U /app/passwords.txt