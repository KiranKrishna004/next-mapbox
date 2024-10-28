"use client"
import { MAPBOX_TOKEN } from "@/app/constants"
import Map from "react-map-gl"

export const MapBox = () => {
  return (
    <div className="flex justify-center mt-12">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </div>
  )
}
