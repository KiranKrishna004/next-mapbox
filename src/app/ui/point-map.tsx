"use client"

import mapboxgl, { LngLatLike, Map, MapMouseEvent } from "mapbox-gl"
import { useEffect, useRef, useState } from "react"
import { INITIAL_CENTER, INITIAL_ZOOM, MAPBOX_TOKEN } from "../constants"

import "mapbox-gl/dist/mapbox-gl.css"

export const PointMapBox = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  const [center, setCenter] = useState<LngLatLike>(INITIAL_CENTER)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)
  const [coordinates, setCoordinates] = useState<string[] | undefined>()
  // const [markers, setMarkers] = useState<Marker[] | []>([])

  useEffect(() => {
    if (!mapContainerRef.current) return
    mapRef.current = new Map({
      container: mapContainerRef.current,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER as [number, number],
      zoom: INITIAL_ZOOM,
    })

    mapRef.current?.on("move", addMouseMove)
    mapRef.current?.on("click", addMarker)

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  function addMouseMove() {
    // get the current center coordinates and zoom level from the map
    const mapCenter = mapRef.current!.getCenter()
    const mapZoom = mapRef.current!.getZoom()

    // update state
    setCenter([mapCenter.lng, mapCenter.lat])
    setZoom(mapZoom)
  }

  function addMarker(e: MapMouseEvent) {
    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(e.lngLat)
      .addTo(mapRef.current!)

    // setMarkers((markers) => [...markers, marker])

    function onDragEnd() {
      const lngLat = marker.getLngLat()
      setCoordinates([`Longitude: ${lngLat.lng}`, `Latitude: ${lngLat.lat}`])
    }

    marker.on("dragend", onDragEnd)
  }

  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    })
  }

  return (
    <div className="flex w-full pb-12 justify-center items-center">
      <div className="w-[650px] h-[650px] relative">
        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            color: "#fff",
            position: "absolute",
            bottom: "40px",
            left: "10px",
            padding: "5px 10px",
            margin: 0,
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: "11px",
            lineHeight: "18px",
            borderRadius: "3px",
            display: coordinates ? "block" : "none",
          }}
        >
          {coordinates?.map((coord, index) => (
            <p key={`${coord}-${index}`} style={{ marginBottom: 0 }}>
              {coord}
            </p>
          ))}
        </div>
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
      </div>
    </div>
  )
}
