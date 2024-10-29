"use client"

import Dropzone from "@/components/ui/dropzone"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { UploadFileType } from "../actions/uploadfile"
import { DistanceMapBox } from "./distance-map"
import { DrawMapBox } from "./draw-map"
import { LayerMap } from "./layer-map"
import { Navbar } from "./navbar"
import { PointMapBox } from "./point-map"

export const HomePage = () => {
  const [mapData, setMapData] = useState<UploadFileType | null>(null)

  const features = ["Layer", "Distance", "Point", "Draw"]

  return (
    <>
      <Navbar />

      <div className="flex flex-col pt-12">
        <Tabs
          defaultValue={"Layer"}
          className="flex justify-center items-center flex-col w-full"
        >
          <TabsList className="w-fit mb-20">
            {features.map((feat) => (
              <TabsTrigger key={feat} value={feat}>
                {feat}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Layer">
            <div className="flex w-full">
              <Dropzone setMapData={setMapData} />
              {mapData && <LayerMap mapData={mapData} />}
            </div>
          </TabsContent>
          <TabsContent value="Distance">
            <DistanceMapBox />
          </TabsContent>

          <TabsContent value="Point">
            <PointMapBox />
          </TabsContent>

          <TabsContent value="Draw">
            <DrawMapBox />
          </TabsContent>
          {/* <div className="flex flex-col items-center pt-6 w-full">
            {selectedComponent(selectedFeature, setMapData)}
            <MapBox mapData={mapData} selectedFeature={selectedFeature} />
          </div> */}
        </Tabs>
      </div>
    </>
  )
}

// function selectedComponent(
//   selectedFeature: string,
//   setMapData: Dispatch<SetStateAction<UploadFileType | null>>
// ) {
//   switch (selectedFeature) {
//     case "Layer":
//       return <Dropzone setMapData={setMapData} />

//     default:
//       return <></>
//   }
// }
