import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomDataMap } from "./custom-data-map"
import { DistanceMapBox } from "./distance-map"
import { DrawMapBox } from "./draw-map"
import { Navbar } from "./navbar"
import { PointMapBox } from "./point-map"

export const HomePage = () => {
  const features = ["Layer", "Distance", "Point", "Draw"]

  return (
    <>
      <Navbar />

      <Tabs
        defaultValue={"Layer"}
        className="flex justify-center items-center flex-col w-full pt-12"
      >
        <TabsList className="w-fit mb-20">
          {features.map((feat) => (
            <TabsTrigger key={feat} value={feat}>
              {feat}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Layer">
          <CustomDataMap />
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
      </Tabs>
    </>
  )
}
