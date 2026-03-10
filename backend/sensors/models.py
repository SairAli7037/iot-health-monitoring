from django.db import models

class SensorData(models.Model):
    bpm = models.FloatField()
    bpm_avg = models.FloatField()
    ir = models.IntegerField()

    ds18b20_temp = models.FloatField()
    dht11_temp = models.FloatField()
    humidity = models.FloatField()

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"BPM: {self.bpm} | Temp: {self.ds18b20_temp}"