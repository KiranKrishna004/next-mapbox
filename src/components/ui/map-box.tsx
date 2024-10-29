"use client"

import { UploadFileType } from "@/app/actions/uploadfile"
import { MAPBOX_TOKEN } from "@/app/constants"
import { GeoJSONFeature, LngLatLike, Map, MapMouseEvent } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef, useState } from "react"

import type {
  Dispatch,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
} from "react"
const INITIAL_CENTER: [number, number] = [
  -71.97722138410576, -13.517379300798098,
]
const INITIAL_ZOOM = 1

const menuStyle = {
  background: "#ffffff",
  zIndex: 1,
  top: 10,
  right: 10,
  borderRadius: 3,
  width: "120px",
  border: "1px solid rgba(0, 0, 0, 0.4)",
}

const menuItemStyle = {
  fontSize: "13px",
  color: "#404040",
  display: "block",
  margin: "0",
  padding: "10px",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  width: "100%",
}

const activeMenuItemStyle = {
  backgroundColor: "#3887be",
  color: "#ffffff",
}

function loadCustomJson(
  mapRef: MutableRefObject<Map | null>,
  mapData: UploadFileType
) {
  {
    mapData.forEach((data) => {
      mapRef.current?.addSource(data.filename, {
        type: "geojson",
        data: data.geojson,
      })

      mapRef.current?.addLayer({
        id: data.filename,
        type: "circle",
        source: data.filename,
        paint: {
          "circle-radius": 2,
          "circle-stroke-width": 1,
          "circle-color": "red",
          "circle-stroke-color": "white",
        },
      })
    })
  }
}

function addMouseMove(
  mapRef: MutableRefObject<Map | null>,
  setCenter: Dispatch<SetStateAction<LngLatLike>>,
  setZoom: Dispatch<SetStateAction<number>>
) {
  // get the current center coordinates and zoom level from the map
  const mapCenter = mapRef.current!.getCenter()
  const mapZoom = mapRef.current!.getZoom()

  // update state
  setCenter([mapCenter.lng, mapCenter.lat])
  setZoom(mapZoom)
}

type DisplayFeatureType = keyof Omit<GeoJSONFeature, "geometry" | "bbox">

function addHoverInfo(
  e: MapMouseEvent,
  mapRef: MutableRefObject<Map | null>,
  setDisplayFeatures: Dispatch<SetStateAction<DisplayFeatureType[] | undefined>>
) {
  const features: GeoJSONFeature[] | undefined =
    mapRef.current?.queryRenderedFeatures(e.point)
  const displayProperties: DisplayFeatureType[] = [
    "type",
    "properties",
    "id",
    "layer",
    "source",
    "sourceLayer",
    "state",
  ]
  const formattedFeatures = features?.map((feat) => {
    const displayFeat: DisplayFeatureType | null = null
    displayProperties.forEach((prop: DisplayFeatureType) => {
      displayFeat[prop] = feat[prop]
    })
    return displayFeat
  })

  setDisplayFeatures(formattedFeatures)
}

export const MapBox = ({
  mapData,
  selectedFeature,
}: {
  mapData: UploadFileType | null
  selectedFeature: string
}) => {
  const isDistanceMap = selectedFeature === "Distance"
  const isLayerMap = selectedFeature === "Layer"
  const allLayerIds = mapData ? mapData.map((data) => data.filename) : []

  const [center, setCenter] = useState<LngLatLike>(INITIAL_CENTER)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)
  const [activeLayerIds, setActiveLayerIds] = useState(allLayerIds)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [displayFeatures, setDisplayFeatures] = useState<
    DisplayFeatureType[] | undefined
  >()

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return
    mapRef.current = new Map({
      accessToken: MAPBOX_TOKEN ?? "",
      container: mapContainerRef.current,
      center: INITIAL_CENTER as [number, number],
      zoom: INITIAL_ZOOM,
      style: "mapbox://styles/mapbox/streets-v12",
    })

    mapRef.current?.on("move", () => addMouseMove(mapRef, setCenter, setZoom))

    mapRef.current.on("idle", () => {
      if (allLayerIds.every((id) => !mapRef.current?.getLayer(id))) {
        return
      }
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  // When active layers changes on Layer view
  useEffect(() => {
    if (!mapLoaded) return

    allLayerIds.forEach((layerId) => {
      if (activeLayerIds.includes(layerId)) {
        mapRef.current?.setLayoutProperty(layerId, "visibility", "visible")
      } else {
        mapRef.current?.setLayoutProperty(layerId, "visibility", "none")
      }
    })
  }, [activeLayerIds])

  // Layer view conditions
  useEffect(() => {
    if (!isLayerMap) {
      if (mapData) {
        setMapLoaded(false)
        mapRef.current?.off("load", () => loadCustomJson(mapRef, mapData))
      }
      mapRef.current?.off("mousemove", (e) =>
        addHoverInfo(e, mapRef, setDisplayFeatures)
      )
    } else {
      if (mapData) {
        setMapLoaded(true)
        mapRef.current?.on("load", () => loadCustomJson(mapRef, mapData))
      }
      mapRef.current?.on("mousemove", (e) =>
        addHoverInfo(e, mapRef, setDisplayFeatures)
      )
    }
  }, [isLayerMap])

  // Distance view conditions
  useEffect(() => {
    if (isDistanceMap) {
    }
  }, [isDistanceMap])

  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    })
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const layerId = (e.target as HTMLButtonElement).id

    if (activeLayerIds.includes(layerId)) {
      setActiveLayerIds(activeLayerIds.filter((d) => d !== layerId))
    } else {
      setActiveLayerIds([...activeLayerIds, layerId])
    }
  }

  return (
    <div className="flex w-full mt-12 pb-12 justify-center items-center">
      <div className="w-[650px] h-[650px] relative">
        {isLayerMap && (
          <nav id="menu" style={{ ...menuStyle, position: "absolute" }}>
            {allLayerIds.map((id) => (
              <button
                key={id}
                id={id}
                style={{
                  ...menuItemStyle,
                  ...(activeLayerIds.includes(id) && activeMenuItemStyle),
                  textAlign: "center",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.25)", // add a bottom border to the first button
                }}
                onClick={handleClick}
              >
                {id}
              </button>
            ))}
          </nav>
        )}
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

        {isLayerMap && (
          <pre
            id="features"
            style={{
              fontSize: "10px",
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "50%",
              overflow: "auto",
              background: "rgba(255, 255, 255, 0.8)",
            }}
          >
            {JSON.stringify(displayFeatures, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
