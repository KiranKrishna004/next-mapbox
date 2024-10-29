"use client"

import { UploadFileType } from "@/app/actions/uploadfile"
import { MAPBOX_TOKEN } from "@/app/constants"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { area } from "@turf/turf"
import { LngLatLike, Map } from "mapbox-gl"
import { useEffect, useRef, useState } from "react"

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
import "mapbox-gl/dist/mapbox-gl.css"

const INITIAL_CENTER: [number, number] = [
  -71.97722138410576, -13.517379300798098,
]
const INITIAL_ZOOM = 2

const paragraphStyle = {
  fontFamily: "Open Sans",
  margin: 0,
  fontSize: 13,
}

export const MapBox = ({
  mapData,
  selectedFeature,
}: {
  mapData: UploadFileType | null
  selectedFeature: string
}) => {
  const isDrawMap = selectedFeature === "Draw"

  const [center, setCenter] = useState<LngLatLike>(INITIAL_CENTER)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [roundedArea, setRoundedArea] = useState<number | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return
    mapRef.current = new Map({
      accessToken: MAPBOX_TOKEN,
      container: mapContainerRef.current,
      center: INITIAL_CENTER as [number, number],
      zoom: INITIAL_ZOOM,
      style: "mapbox://styles/mapbox/streets-v12",
    })

    mapRef.current?.on("move", addMouseMove)

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    })
    if (isDrawMap) {
      mapRef.current?.addControl(draw)

      mapRef.current?.on("draw.create", updateArea)
      mapRef.current?.on("draw.delete", updateArea)
      mapRef.current?.on("draw.update", updateArea)

      function updateArea(e: { type: string }) {
        const data = draw.getAll()
        if (data.features.length > 0) {
          const drawArea = area(data)
          setRoundedArea(Math.round(drawArea * 100) / 100)
        } else {
          setRoundedArea(null)
          if (e.type !== "draw.delete")
            alert("Click the map to draw a polygon.")
        }
      }
    }
  }, [isDrawMap])

  function addMouseMove() {
    // get the current center coordinates and zoom level from the map
    const mapCenter = mapRef.current!.getCenter()
    const mapZoom = mapRef.current!.getZoom()

    // update state
    setCenter([mapCenter.lng, mapCenter.lat])
    setZoom(mapZoom)
  }

  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    })
  }

  return (
    <div className="flex w-full mt-12 pb-12 justify-center items-center">
      <div className="w-[650px] h-[650px] relative">
        <div className="sidebar">
          Longitude: {(center as number[])[0].toFixed(4)} | Latitude:{" "}
          {(center as number[])[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </div>
        <button className="reset-button" onClick={handleButtonClick}>
          Reset
        </button>
        <div
          id="map-container"
          ref={mapContainerRef}
          style={{ cursor: "crosshair", height: "100%", width: "100%" }}
        />

        <div
          className="calculation-box"
          style={{
            height: 75,
            width: 150,
            position: "absolute",
            bottom: 40,
            left: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 15,
            textAlign: "center",
          }}
        >
          <p style={paragraphStyle}>Click the map to draw a polygon.</p>
          <div id="calculated-area">
            {roundedArea && (
              <>
                <p style={paragraphStyle}>
                  <strong>{roundedArea}</strong>
                </p>
                <p style={paragraphStyle}>square meters</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
