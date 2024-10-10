"use client"
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { droneData } from "./data/DroneData";
import Navbar from "./components/Navbar";

export default function Home() {
  const [query, setQuery] = useState("")
  const [sortCriteria, setSortCriteria] = useState("image_id")
  const [sortOrder, setSortOrder] = useState("asc")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: query, droneData }),
    })
    const data = await res.json()
    setResponse(data.response) 
    setLoading(false) 

    setQuery("") 
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(e.target.value)
  }

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value)
  }

  const sortedData = [...droneData].sort((a, b) => {
    const comparison = a[sortCriteria as keyof typeof a] < b[sortCriteria as keyof typeof b] ? -1 : a[sortCriteria as keyof typeof a] > b[sortCriteria as keyof typeof b] ? 1 : 0
    return sortOrder === "asc" ? comparison : -comparison
  })

  const toggleRow = (imageId: string) => {
    setExpandedRow(expandedRow === imageId ? null : imageId)
  }

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4">
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-center">
        <div className="flex items-center mb-2 md:mb-0 md:mr-4">
          <label className="text-white font-bold bg-blue-500 px-2 rounded-l" style={{ paddingTop: '8.5px', paddingBottom: '8.5px' }}>Sort by</label>
          <select value={sortCriteria} onChange={handleSortChange} className="p-2 border-2 border-blue-500 rounded-r bg-white focus:outline-none focus:ring-0">
            <option value="image_id">Image ID</option>
            <option value="timestamp">Timestamp</option>
            <option value="altitude_m">Altitude (m)</option>
            <option value="battery_level_pct">Battery Level (%)</option>
          </select>
        </div>
        <div className="flex items-center mb-2 md:mb-0">
          <label className="text-white font-bold bg-blue-500 px-2 rounded-l" style={{ paddingTop: '8.5px', paddingBottom: '8.5px' }}>Order</label>
            <select value={sortOrder} onChange={handleOrderChange} className="p-2 border-2 border-blue-500 rounded-r bg-white focus:outline-none focus:ring-0">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
        </div>
      </div>
      <table className="mt-4 rounded-lg w-full border-collapse border border-blue-400">
        <thead>
          <tr className="bg-blue-200">
            <th className="border border-blue-400 p-2">Image ID</th>
            <th className="border border-blue-400 p-2">Timestamp</th>
            <th className="border border-blue-400 p-2">Altitude (m)</th>
            <th className="border border-blue-400 p-2">Battery Level (%)</th>
            <th className="border border-blue-400 p-2 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((data) => (
            <tr key={data.image_id} className="hover:bg-blue-50">
              <td className="border border-blue-400 p-2">{data.image_id}</td>
              <td className="border border-blue-400 p-2">{data.timestamp}</td>
              <td className="border border-blue-400 p-2">{data.altitude_m}</td>
              <td className="border border-blue-400 p-2">{data.battery_level_pct}</td>
              <td className="border border-blue-400 p-2 text-center">
                <button onClick={() => toggleRow(data.image_id)} className="text-blue-600 hover:underline mt-5">
                  {expandedRow === data.image_id ? "Hide Details" : "Show Details"}
                </button>
                <div className={`mt-2 p-2 border border-blue-400 rounded bg-blue-100 transition-all duration-300 ease-in-out ${expandedRow === data.image_id ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <p><strong>Latitude:</strong> {data.latitude}</p>
                  <p><strong>Longitude:</strong> {data.longitude}</p>
                  <p><strong>File Name:</strong> {data.file_name}</p>
                  <p><strong>Camera Tilt (°):</strong> {data.camera_tilt_deg}</p>
                  <p><strong>Focal Length (mm):</strong> {data.focal_length_mm}</p>
                  <p><strong>ISO:</strong> {data.iso}</p>
                  <p><strong>Shutter Speed:</strong> {data.shutter_speed}</p>
                  <p><strong>Aperture:</strong> {data.aperture}</p>
                  <p><strong>Color Temp (K):</strong> {data.color_temp_k}</p>
                  <p><strong>Image Format:</strong> {data.image_format}</p>
                  <p><strong>File Size (MB):</strong> {data.file_size_mb}</p>
                  <p><strong>Drone Speed (m/s):</strong> {data.drone_speed_mps}</p>
                  <p><strong>GPS Accuracy (m):</strong> {data.gps_accuracy_m}</p>
                  <p><strong>Gimbal Mode:</strong> {data.gimbal_mode}</p>
                  <p><strong>Subject Detection:</strong> {data.subject_detection}</p>
                  <p><strong>Image Tags:</strong> {data.image_tags.join(", ")}</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit} className="mt-8 mb-8">
        <div className="flex flex-col items-center w-full">
          <div className="w-full flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about the drone data..."
              className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 bg-blue-500 text-white font-semibold rounded-r-md hover:bg-blue-600 focus:outline-none"
              style={{ paddingTop: '9px', paddingBottom: '9px' }}
            >
              <i className="fas fa-paper-plane xs:mr-2 px-2 xs:px-0"> </i>
            </button>
          </div>
          {loading && ( 
            <div className="mt-4 w-full flex justify-center">
              <div className="bg-gray-200 rounded-lg p-3 w-full md:w-3/4 mb-5">
                <p className="text-gray-800 text-center">Thinking...</p>
              </div>
            </div>
          )}
          {response && !loading && (
              <div className="mt-4 w-full flex justify-center">
                <div className="bg-gray-200 rounded-lg p-3 w-full md:w-3/4 mb-5">
                  <p className="text-gray-800 text-center">{response}</p>
                </div>
              </div>
            )}
        </div>
      </form>
    </div>
    </>
  )
}
