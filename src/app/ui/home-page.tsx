"use client"

import Dropzone from "@/components/ui/dropzone"
import { MapBox } from "@/components/ui/map-box"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dispatch, SetStateAction, useState } from "react"
import { UploadFileType } from "../actions/uploadfile"
import { Navbar } from "./navbar"

export const HomePage = () => {
  const [selectedFeature, setSelectedFeature] = useState("Layer")
  const [mapData, setMapData] = useState<UploadFileType | null>(null)

  const features = ["Layer", "Distance", "Point"]

  return (
    <>
      <Navbar />

      <div className="flex flex-col pt-12">
        <Tabs
          defaultValue={selectedFeature}
          className="flex justify-center items-center flex-col w-full"
        >
          <TabsList className="w-fit">
            {features.map((feat) => (
              <TabsTrigger
                key={feat}
                value={feat}
                onClick={() => setSelectedFeature(feat)}
              >
                {feat}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex flex-col items-center pt-6 w-full">
            {selectedComponent(selectedFeature, setMapData)}
            <MapBox mapData={mapData} selectedFeature={selectedFeature} />
          </div>
        </Tabs>
      </div>
    </>
  )
}

function selectedComponent(
  selectedFeature: string,
  setMapData: Dispatch<SetStateAction<UploadFileType | null>>
) {
  switch (selectedFeature) {
    case "Layer":
      return <Dropzone setMapData={setMapData} />

    default:
      return <></>
  }
}
