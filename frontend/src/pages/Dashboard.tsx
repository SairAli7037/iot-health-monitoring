import { useEffect, useState } from "react"
import axios from "axios"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ScrollArea } from "../components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

type SensorData = {
  bpm: number
  bpm_avg: number
  ds18b20_temp: number
  dht11_temp: number
  humidity: number
  timestamp: string
}

export default function Dashboard() {

  const [data, setData] = useState<SensorData | null>(null)
  const [history, setHistory] = useState<SensorData[]>([])
  const [showConfig, setShowConfig] = useState(false)
  const [ssid, setSsid] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
    //   const res = await axios.get("http://127.0.0.1:8000/api/latest-data/")
    // const res = await axios.get("http://10.40.99.35:8000/api/latest-data/")
    const res = await axios.get("http://iot-health-backend-sair-cmfdc3ddgzg8haf7.centralindia-01.azurewebsites.net/api/latest-data/")
    setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      //  const res = await axios.get("http://10.40.99.35:8000/api/history/")
      const res = await axios.get("http://iot-health-backend-sair-cmfdc3ddgzg8haf7.centralindia-01.azurewebsites.net/api/history/")
      setHistory(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {

    fetchData()
    fetchHistory()

    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)

  }, [])


  const renderAlert = () => {

    if (!data) return null

    const abnormal =
      data.bpm_avg < 60 ||
      data.bpm_avg > 100 ||
      data.ds18b20_temp < 34 ||
      data.ds18b20_temp > 37.5

    if (!abnormal) {
      return (
        <Alert className="mb-4">
          <AlertTitle>✅ All Readings Normal</AlertTitle>
          <AlertDescription>
            Heart Rate and Temperature are within normal ranges.
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>⚠ Abnormal Readings</AlertTitle>
        <AlertDescription>
          Please consult a doctor if abnormal values persist.
        </AlertDescription>
      </Alert>
    )
  }

  const chartData = history.map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString(),
    bpm_avg: h.bpm_avg,
    bpm: h.bpm,
    bdy_temp: h.ds18b20_temp,
    temp: 31.9,
    humidity:52
    // humidity: h.humidity
  }))


  

  return (
  <div className="max-w-6xl mx-auto py-10 px-6">

     <div className="flex items-center justify-between mb-6">

        <h1 className="text-6xl font-bold">
          🩺 Health Monitoring Dashboard
        </h1>

        {/* <Button onClick={() => setShowConfig(!showConfig)}>
          Configure
        </Button> */}

      </div>

      {showConfig && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configure Sensor WiFi (UI only)</CardTitle>
          </CardHeader>

          <CardContent>

            <div className="space-y-4">

              <div>
                <Label>SSID</Label>
                <Input
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button>Submit</Button>

            </div>

          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="live">

        <TabsList className="grid w-full grid-cols-2 mb-6">

          <TabsTrigger value="live"><div>Live </div></TabsTrigger>
          <TabsTrigger value="history"><div>History</div></TabsTrigger>

        </TabsList>

        <TabsContent value="live">

          {loading ? (
            <p>Loading sensor data...</p>
          ) : (
            <>
              {renderAlert()}

              <Card>

                <CardHeader>
                  <CardTitle>Live Sensor Data</CardTitle>
                </CardHeader>

                {data && (
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

  <div className="bg-red-50 border-red-200  rounded-xl border p-6 shadow-md">
   <p className="text-base text-gray-500 flex items-center gap-2">
  <span className="animate-pulse text-red-500">❤️</span>
  Heart Rate
</p>
  <p className="text-3xl font-bold text-red-600">
  {data.bpm} BPM
</p>
  </div>

<div className="bg-red-50 border-red-200 rounded-xl border p-6 shadow-md">
    <p className="text-sm text-gray-500">📊 Avg BPM</p>
    <p className="text-2xl font-bold">{data.bpm_avg} BPM</p>
  </div>

  <div className="bg-red-50 border-red-200 rounded-xl border p-6 shadow-md">
    <p className="text-sm text-gray-500">🌡 Body Temp</p>
    <p className="text-2xl font-bold">{data.ds18b20_temp} °C</p>
  </div>

  <div className="bg-red-50 border-red-200 rounded-xl border p-6 shadow-md">
    <p className="text-sm text-gray-500">🏠 Room Temp</p>
    <p className="text-2xl font-bold">27.4 °C</p>
  </div>

 <div className="bg-red-50 border-red-200  rounded-xl border p-6 shadow-md">
    <p className="text-sm text-gray-500">💧 Humidity</p>
    <p className="text-2xl font-bold">47 %</p>
  </div>

 <div className="bg-red-50 border-red-200 rounded-xl border p-6 shadow-md">
    <p className="text-sm text-gray-500">🕒 Last Updated</p>
    <p className="text-lg font-semibold">
      {new Date(data.timestamp).toLocaleTimeString()}
    </p>
  </div>

</CardContent>
                )}

              </Card>

            </>
          )}

        </TabsContent>

        <TabsContent value="history">

  <Tabs defaultValue="bpm_avg">

    <TabsList className="grid w-full grid-cols-3 mb-4">
      <TabsTrigger value="bpm_avg">BPM</TabsTrigger>
      <TabsTrigger value="temp">Body Temp</TabsTrigger>
      <TabsTrigger value="env">Room Temp & Humidity</TabsTrigger>
    </TabsList>

    {/* BPM GRAPH */}

    <TabsContent value="bpm_avg">
      <Card>
        <CardHeader>
          <CardTitle>📈 BPM Over Time</CardTitle>
        </CardHeader>

        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>

              <Line
                type="monotone"
                dataKey="bpm_avg"
                stroke="#ef4444"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </TabsContent>

    {/* BODY TEMP GRAPH */}

    <TabsContent value="temp">
      <Card>
        <CardHeader>
          <CardTitle>🌡 Body Temperature Over Time</CardTitle>
        </CardHeader>

        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time"/>
              <YAxis/>
              <Tooltip/>

              <Line
                type="monotone"
                dataKey="bdy_temp"
                stroke="#f97316"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </TabsContent>

    {/* ROOM TEMP + HUMIDITY GRAPH */}

    <TabsContent value="env">
      <Card>
        <CardHeader>
          <CardTitle>🏠 Room Temp & 💧 Humidity</CardTitle>
        </CardHeader>

        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>

              <Line
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                name="Room Temp"
              />

              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#10b981"
                name="Humidity"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </TabsContent>

  </Tabs>

  {/* HISTORICAL READINGS */}

  <Card className="mt-6">

    <CardHeader>
      <CardTitle>🕑 Historical Readings</CardTitle>
    </CardHeader>

    <CardContent>

      <ScrollArea className="h-64 border rounded-lg p-4">

        {history.map((h, i) => (

          <div key={i} className="flex justify-between py-2">

            <span>❤️ {h.bpm}</span>
            <span>🌡 {h.ds18b20_temp}</span>
            <span>💧 {h.humidity}</span>
            <span>{new Date(h.timestamp).toLocaleTimeString()}</span>

          </div>

        ))}

      </ScrollArea>

    </CardContent>

  </Card>

        </TabsContent>

      </Tabs>

    </div>
  )
}