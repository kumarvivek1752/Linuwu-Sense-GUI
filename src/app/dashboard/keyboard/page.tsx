"use client";

import { HexColorPicker } from "react-colorful";
import { invoke } from "@tauri-apps/api/tauri";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyboardIcon } from "lucide-react";
import { useState, useEffect } from "react";

function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number,
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default function KeyboardControl() {
  const [color, setColor] = useState("#ffffff");
  const [zone1, setZone1] = useState("#ffffff");
  const [zone2, setZone2] = useState("#ffffff");
  const [zone3, setZone3] = useState("#ffffff");
  const [zone4, setZone4] = useState("#ffffff");
  const [zonesEnabled, setZonesEnabled] = useState({
    zone1: true,
    zone2: true,
    zone3: true,
    zone4: true,
  });
  const [tab, setTab] = useState("all-zones");
  const [selectedZone, setSelectedZone] = useState(1);

  const debouncedUpdateColor = debounce(async (newColor: string) => {
    try {
      const result = await invoke<string>("keyboard_color", {
        zone1: tab === "all-zones" ? newColor : zonesEnabled.zone1 ? zone1 : "",
        zone2: tab === "all-zones" ? newColor : zonesEnabled.zone2 ? zone2 : "",
        zone3: tab === "all-zones" ? newColor : zonesEnabled.zone3 ? zone3 : "",
        zone4: tab === "all-zones" ? newColor : zonesEnabled.zone4 ? zone4 : "",
        all: newColor,
      });
      console.log("Update successful:", result);
    } catch (error) {
      console.error("Failed to update keyboard color:", error);
    }
  }, 300);

  const handleMainColorChange = (hex: string) => {
    setColor(hex);
    if (tab === "all-zones") {
      setZone1(hex);
      setZone2(hex);
      setZone3(hex);
      setZone4(hex);
    }
    debouncedUpdateColor(hex);
  };
  useEffect(() => {
    const fetchColor = async () => {
      try {
        const result = await invoke<string>("get_keybord_color_perzone");
        setZone1("#" + result[0]);
        setZone2("#" + result[1]);
        setZone3("#" + result[2]);
        setZone4("#" + result[3]);
        setColor("#" + result[0]);
      } catch (error) {
        console.error("Error getting keyboard_color:", error);
      }
    };
    fetchColor();
  }, []);

  const handleZoneColorChange = (zone: number, hex: string) => {
    if (tab === "all-zones") {
      handleMainColorChange(hex);
    } else {
      switch (zone) {
        case 1:
          setZone1(hex);
          break;
        case 2:
          setZone2(hex);
          break;
        case 3:
          setZone3(hex);
          break;
        case 4:
          setZone4(hex);
          break;
      }
      debouncedUpdateColor(hex);
    }
  };

  return (
    <>
      <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
        <div className="flex flex-row gap-2 justify-center w-full mt-3">
          <h1 className="flex text-base font-bold block">
            Keyboard RGB Control
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-5 overflow-hidden">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-zones">All Zones</TabsTrigger>
            <TabsTrigger value="per-zone">Per Zone</TabsTrigger>
          </TabsList>

          {/* All Zones Mode */}
          <TabsContent value="all-zones">
            <Card className="flex flex-col items-center gap-4 p-4">
              <KeyboardIcon color={color} size={200} />
              <p className="text-sm">Selected Color: {color}</p>
            </Card>
          </TabsContent>

          {/* Per Zone Mode with single color picker */}
          <TabsContent value="per-zone">
            <Card className="p-4 flex gap-1 flex-col ">
              {/* Zones Display */}
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((zoneNum) => {
                  const zoneKey = `zone${zoneNum}` as keyof typeof zonesEnabled;
                  const zoneColor = { 1: zone1, 2: zone2, 3: zone3, 4: zone4 }[
                    zoneNum
                  ];
                  return (
                    <div
                      key={zoneNum}
                      className={`flex flex-col items-center gap-2 cursor-pointer p-2 rounded-lg border ${selectedZone === zoneNum
                          ? "border-blue-500"
                          : "border-transparent"
                        }`}
                      onClick={() => setSelectedZone(zoneNum)}
                    >
                      <p className="text-sm font-semibold">Zone {zoneNum}</p>
                      <KeyboardIcon color={zoneColor} size={100} />
                      <Checkbox
                        checked={zonesEnabled[zoneKey]}
                        onCheckedChange={(checked) =>
                          setZonesEnabled((prev) => ({
                            ...prev,
                            [zoneKey]: !!checked,
                          }))
                        }
                      />
                      <p className="text-xs">Color: {zoneColor}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Single Color Picker */}
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <p className="text-sm">Selected Zone: {selectedZone}</p>
          <HexColorPicker
            color={
              { 1: zone1, 2: zone2, 3: zone3, 4: zone4 }[selectedZone] ||
              "#ffffff"
            }
            onChange={(hex) => handleZoneColorChange(selectedZone, hex)}
          />
        </div>
      </div>
    </>
  );
}
