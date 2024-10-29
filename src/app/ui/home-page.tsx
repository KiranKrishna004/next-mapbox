import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayerMapbox } from "./layer-mapbox"
import { Navbar } from "./navbar"

export const HomePage = () => {
  const features = [
    { name: "Distance", component: <></> },
    {
      name: "Layer",
      component: <LayerMapbox />,
    },
  ]

  return (
    <>
      <Navbar />

      <div className="flex flex-col pt-12">
        <Tabs
          defaultValue={features[0].name}
          className="flex justify-center items-center flex-col w-full"
        >
          <TabsList className="w-fit">
            {features.map((feat) => (
              <TabsTrigger key={feat.name} value={feat.name}>
                {feat.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {features.map((feat) => (
            <TabsContent key={feat.name} className="w-full" value={feat.name}>
              {feat.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  )
}
