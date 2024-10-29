"use client"
import Dropzone from "@/components/ui/dropzone"
import { MapBox } from "@/components/ui/map-box"
import { useState } from "react"
import { UploadFileType } from "../actions/uploadfile"

export const LayerMapbox = () => {
  const [mapData, setMapData] = useState<UploadFileType | null>(null)

  return (
    <>
      <div className="flex justify-center pt-6 w-full">
        <Dropzone setMapData={setMapData} />
      </div>
      {mapData && <MapBox mapData={mapData} />}
    </>
  )
}
