import { GeoJSONFeature, LngLatLike, Map, MapMouseEvent } from "mapbox-gl"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { UploadFileType } from "../actions/uploadfile"
import { INITIAL_CENTER, INITIAL_ZOOM, MAPBOX_TOKEN } from "../constants"

import "mapbox-gl/dist/mapbox-gl.css"

const menuStyle = {
  background: "#fff",
  position: "absolute",
  zIndex: 1,
  top: 10,
  right: 10,
  borderRadius: 3,
  width: "120px",
  border: "1px solid rgba(0, 0, 0, 0.4)",
  fontFamily: "'Open Sans', sans-serif",
}

const menuItemStyle = {
  fontSize: "13px",
  color: "#404040",
  display: "block",
  margin: "0",
  padding: "10px",
  textDecoration: "none",
  border: "none",
  textAlign: "center",
  cursor: "pointer",
  width: "100%",
}

const activeMenuItemStyle = {
  backgroundColor: "#3887be",
  color: "#ffffff",
}

type DisplayFeatureType = keyof Omit<GeoJSONFeature, "geometry" | "bbox">

export const LayerMap = ({ mapData }: { mapData: UploadFileType }) => {
  const allLayerIds = mapData.map((data) => data.filename)

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  const [activeLayerIds, setActiveLayerIds] = useState(allLayerIds)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [displayFeatures, setDisplayFeatures] = useState<
    DisplayFeatureType[] | undefined
  >()
  const [center, setCenter] = useState<LngLatLike>(INITIAL_CENTER)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)

  useEffect(() => {
    if (!mapContainerRef.current) return
    mapRef.current = new Map({
      container: mapContainerRef.current,
      accessToken: MAPBOX_TOKEN ?? "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER as [number, number],
      zoom: INITIAL_ZOOM,
    })

    setMapLoaded(true)
    mapRef.current?.on("load", loadCustomJson)

    mapRef.current?.on("move", addMouseMove)
    mapRef.current?.on("mousemove", addHoverInfo)

    mapRef.current.on("idle", () => {
      if (allLayerIds.every((id) => !mapRef.current?.getLayer(id))) {
        return
      }
    })
    return () => mapRef.current?.remove()
  }, [])

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

  function addMouseMove() {
    // get the current center coordinates and zoom level from the map
    const mapCenter = mapRef.current!.getCenter()
    const mapZoom = mapRef.current!.getZoom()

    // update state
    setCenter([mapCenter.lng, mapCenter.lat])
    setZoom(mapZoom)
  }

  function addHoverInfo(e: MapMouseEvent) {
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
      const displayFeat: DisplayFeatureType | {} = {}
      displayProperties.forEach((prop: DisplayFeatureType) => {
        displayFeat[prop] = feat[prop]
      })
      return displayFeat
    })

    setDisplayFeatures(formattedFeatures)
  }

  function loadCustomJson() {
    mapData?.forEach((data) => {
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

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const layerId = (e.target as HTMLButtonElement).id

    if (activeLayerIds.includes(layerId)) {
      setActiveLayerIds(activeLayerIds.filter((d) => d !== layerId))
    } else {
      setActiveLayerIds([...activeLayerIds, layerId])
    }
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
        <nav id="menu" style={{ ...menuStyle, position: "absolute" }}>
          {allLayerIds.map((id) => (
            <button
              key={id}
              id={id}
              style={{
                ...menuItemStyle,
                ...(activeLayerIds?.includes(id) && activeMenuItemStyle),
                textAlign: "center",
                borderBottom: "1px solid rgba(0, 0, 0, 0.25)", // add a bottom border to the first button
              }}
              onClick={handleClick}
            >
              {id}
            </button>
          ))}
        </nav>
        <div className="sidebar">
          Longitude: {(center as number[])[0].toFixed(4)} | Latitude:{" "}
          {(center as number[])[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </div>
        <button className="reset-button" onClick={handleButtonClick}>
          Reset
        </button>
        <div id="map" ref={mapContainerRef} style={{ height: "100%" }}></div>
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
      </div>
    </div>
  )
}
