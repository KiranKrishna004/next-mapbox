"use client"

import Dropzone from "@/components/ui/dropzone"
import { LayerMap } from "./layer-map"
import { UploadFileType } from "../actions/uploadfile"
import { useState } from "react"

export const CustomDataMap = () => {
  const [mapData, setMapData] = useState<UploadFileType | null>(null)

  return (
    <div className="flex w-full">
      <Dropzone setMapData={setMapData} />
      {mapData && <LayerMap mapData={mapData} />}
    </div>
  )
}
