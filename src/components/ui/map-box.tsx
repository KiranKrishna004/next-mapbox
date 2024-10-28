"use client"
import { GeoJsonType } from "@/app/actions/uploadfile"
import { MAPBOX_TOKEN } from "@/app/constants"
import { Map, Layer, Source, LayerProps, Marker } from "react-map-gl"

export const MapBox = ({ mapData }: { mapData: GeoJsonType }) => {
  const layerStyle: LayerProps = {
    id: "point",
    type: "circle",
    paint: {
      "circle-color": "black",
      "circle-radius": 2,
    },
    layout: {
      visibility: "visible",
    },
  }

  return (
    <div className="flex justify-center mt-12">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 1,
        }}
        style={{ width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker longitude={-100} latitude={40} anchor="bottom">
          <img src="./pin.png" />
        </Marker>
        <Source id="my-data" type="geojson" data={mapData.geojson}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    </div>
  )
}
