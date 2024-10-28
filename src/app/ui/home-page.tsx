"use client"
import Dropzone from "@/components/ui/dropzone"
import { Navbar } from "./navbar"
import { useState } from "react"

export const HomePage = () => {
  const [mapData, setMapData] = useState<any>(null)

  console.log(mapData)
  return (
    <>
      <Navbar />
      <div className="flex justify-center pt-6">
        <Dropzone setMapData={setMapData} />
      </div>
      {/* <MapBox /> */}
    </>
  )
}
