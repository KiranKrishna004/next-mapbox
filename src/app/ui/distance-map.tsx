"use client"

import { useRef, useEffect, useState } from "react"
import mapboxgl, { GeoJSONFeature } from "mapbox-gl"
import * as turf from "@turf/turf"
import "mapbox-gl/dist/mapbox-gl.css"
import { MAPBOX_TOKEN } from "../constants"

mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN"

export const DistanceMapBox = () => {
  const [distance, setDistance] = useState(0)
  const mapContainerRef = useRef(null)
  const [geojson, setGeojson] = useState({
    type: "FeatureCollection",
    features: [],
  })

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [2.3399, 48.8555],
      zoom: 12,
    })

    const linestring = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    }

    map.on("load", () => {
      map.addSource("geojson", {
        type: "geojson",
        data: geojson,
      })

      map.addLayer({
        id: "measure-points",
        type: "circle",
        source: "geojson",
        paint: {
          "circle-radius": 5,
          "circle-color": "#000",
        },
        filter: ["in", "$type", "Point"],
      })

      map.addLayer({
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

      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["measure-points"],
        })

        let updatedGeojson = { ...geojson }
        if (updatedGeojson.features.length > 1) updatedGeojson.features.pop()

        if (features.length) {
          const id = features[0].properties.id
          updatedGeojson.features = updatedGeojson.features.filter(
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

          updatedGeojson.features.push(point)
        }

        if (updatedGeojson.features.length > 1) {
          linestring.geometry.coordinates = updatedGeojson.features.map(
            (point) => point.geometry.coordinates
          )
          updatedGeojson.features.push(linestring)

          const distance = turf.length(linestring)
          setDistance(distance)
        }

        setGeojson(updatedGeojson)
        map.getSource("geojson").setData(updatedGeojson)
      })

      map.on("mousemove", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["measure-points"],
        })
        map.getCanvas().style.cursor = features.length ? "pointer" : "crosshair"
      })
    })

    return () => map.remove()
  }, [])

  return (
    <div className="flex w-full pb-12 justify-center items-center">
      <div className="w-[650px] h-[650px] relative">
        <div
          className="w-full h-full"
          ref={mapContainerRef}
          // style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
        />
        <div
          className="distance-container"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "#fff",
            fontSize: "11px",
            lineHeight: "18px",
            padding: "5px 10px",
            borderRadius: "3px",
          }}
        >
          Total distance: {distance} km
        </div>
      </div>
    </div>
  )
}
