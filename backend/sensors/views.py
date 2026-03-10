from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import SensorData


@csrf_exempt
def sensor_data(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            sensor = SensorData.objects.create(
                bpm=data.get("bpm"),
                bpm_avg=data.get("bpm_avg"),
                ir=data.get("ir"),
                ds18b20_temp=data.get("ds18b20_temp"),
                dht11_temp=data.get("dht11_temp"),
                humidity=data.get("humidity")
            )

            return JsonResponse({
                "message": "Sensor data stored successfully",
                "id": sensor.id
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"message": "Only POST request allowed"})


def latest_data(request):
    try:
        latest = SensorData.objects.latest("timestamp")

        data = {
            "bpm": latest.bpm,
            "bpm_avg": latest.bpm_avg,
            "ir": latest.ir,
            "ds18b20_temp": latest.ds18b20_temp,
            "dht11_temp": latest.dht11_temp,
            "humidity": latest.humidity,
            "timestamp": latest.timestamp
        }

        return JsonResponse(data)

    except SensorData.DoesNotExist:
        return JsonResponse({"message": "No sensor data found"})
    


def sensor_history(request):
    data = SensorData.objects.order_by("-timestamp")[:50]

    history = []

    for item in data:
        history.append({
            "bpm": item.bpm,
            "bpm_avg": item.bpm_avg,
            "ir": item.ir,
            "ds18b20_temp": item.ds18b20_temp,
            "dht11_temp": item.dht11_temp,
            "humidity": item.humidity,
            "timestamp": item.timestamp
        })

    return JsonResponse(history, safe=False)