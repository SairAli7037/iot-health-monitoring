from django.urls import path
from .views import sensor_data, latest_data, sensor_history, insert_dummy

urlpatterns = [
    path('sensor-data/', sensor_data, name='sensor_data'),
    path('latest-data/', latest_data, name='latest_data'),
    path('history/', sensor_history, name='sensor_history'),
    path('insert/', insert_dummy),
]