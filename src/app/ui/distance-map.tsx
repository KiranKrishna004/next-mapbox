"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef, useState } from "react"
import { LngLatLike, Map } from "mapbox-gl"
import { INITIAL_CENTER, INITIAL_ZOOM, MAPBOX_TOKEN } from "../constants"
import { length } from "@turf/turf"

export const DistanceMapBox = () => {
  const [center, setCenter] = useState<LngLatLike>(INITIAL_CENTER)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return
    mapRef.current = new Map({
      container: mapContainerRef.current,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER as [number, number],
      zoom: INITIAL_ZOOM,
    })

    const geojson = {
      type: "FeatureCollection",
      features: [],
    }

    // Used to draw a line between points
    const linestring = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    }

    mapRef.current.on("load", () => {
      mapRef.current?.addSource("geojson", {
        type: "geojson",
        data: geojson,
      })

      // Add styles to the map
      mapRef.current?.addLayer({
        id: "measure-points",
        type: "circle",
        source: "geojson",
        paint: {
          "circle-radius": 5,
          "circle-color": "#000",
        },
        filter: ["in", "$type", "Point"],
      })
      mapRef.current?.addLayer({
        id: "measure-lines",
        type: "line",
        source: "geojson",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#000",
          "line-width": 2.5,
        },
        filter: ["in", "$type", "LineString"],
      })

      mapRef.current?.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["measure-points"],
        })

        // Remove the linestring from the group
        // so we can redraw it based on the points collection.
        if (geojson.features.length > 1) geojson.features.pop()

        // Clear the distance container to populate it with a new value.
        distanceContainer.innerHTML = ""

        // If a feature was clicked, remove it from the map.
        if (features.length) {
          const id = features[0].properties.id
          geojson.features = geojson.features.filter(
            (point) => point.properties.id !== id
          )
        } else {
          const point = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            },
            properties: {
              id: String(new Date().getTime()),
            },
          }

          geojson.features.push(point)
        }

        if (geojson.features.length > 1) {
          linestring.geometry.coordinates = geojson.features.map(
            (point) => point.geometry.coordinates
          )

          geojson.features.push(linestring)

          // Populate the distanceContainer with total distance
          const value = document.createElement("pre")
          const distance = length(linestring)
          value.textContent = `Total distance: ${distance.toLocaleString()}km`
          distanceContainer.appendChild(value)
        }

        mapRef.current?.getSource("geojson").setData(geojson)
      })
    })
    mapRef.current?.on("mousemove", (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ["measure-points"],
      })
      // Change the cursor to a pointer when hovering over a point on the map.
      // Otherwise cursor is a crosshair.
      mapRef.current!.getCanvasContainer().style.cursor = features.length
        ? "pointer"
        : "crosshair"
    })

    mapRef.current?.on("move", addMouseMove)
  }, [])

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
    <div className="flex w-full pb-12 justify-center items-center">
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
        <div id="distance" className="distance-container" />
      </div>
    </div>
  )
}
