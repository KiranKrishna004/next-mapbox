"use client"
import Dropzone from "@/components/ui/dropzone"
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { useState } from "react"
import { Navbar } from "./navbar"
import { MapBox } from "@/components/ui/map-box"
import {
  GeoJsonType,
  UploadFileErrorType,
  UploadFileType,
} from "../actions/uploadfile"

export const HomePage = () => {
  const [mapData, setMapData] = useState<UploadFileType[] | null>(null)
  const [selectedMap, setSelectedMap] = useState<
    GeoJsonType | UploadFileErrorType | null
  >(null)

  console.log(selectedMap)
  return (
    <>
      <Navbar />
      <div className="flex justify-center pt-6">
        <Dropzone setMapData={setMapData} />
      </div>
      {mapData && (
        <>
          <div className="flex pt-12 justify-center">
            <Menubar className="w-min">
              {mapData?.map((data) => (
                <MenubarMenu key={data.filename}>
                  <MenubarTrigger onClick={() => setSelectedMap(data)}>
                    {data.filename}
                  </MenubarTrigger>
                </MenubarMenu>
              ))}
            </Menubar>
          </div>
        </>
      )}
      {selectedMap && "geojson" in selectedMap && (
        <MapBox mapData={selectedMap} />
      )}
    </>
  )
}
