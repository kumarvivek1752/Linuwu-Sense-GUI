"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { invoke } from "@tauri-apps/api/tauri";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import {
  BatteryFullIcon,
  BatteryLowIcon,
  BatteryMediumIcon,
} from "lucide-react";
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

export default function BatteryLimiter() {
  const [batteryLimiter, setBatteryLimiter] = useState<number>(0);
  const debouncedUpdate = debounce(async function(state: string) {
    try {
      const result = await invoke<string>("set_battery_limiter", {
        state: state,
      });
      console.log("Update successful:", result);
    } catch (error) {
      console.error("Failed to update :", error);
    }
  }, 300);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const result = parseInt(await invoke<string>("get_battery_limiter"));
        console.log(result);
        setBatteryLimiter(result);
      } catch (error) {
        console.error("Failed to update :", error);
      }
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const handleBatteryLimiterChange = (state: string) => {
    debouncedUpdate(state);
  };

  return (
    <>
      <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200 w-100">
        <div className="flex flex-row gap-2 justify-center w-full mt-3">
          <h1 className="flex text-base font-bold block">Battery Limiter</h1>
        </div>
      </div>
      <div className="grid gap-4 p-5 pt-0 pb-0  w-full h-auto">
        <Card className="w-full h-auto">
          <CardHeader>
            <CardTitle className="text-center">Limiter Modes</CardTitle>
          </CardHeader>
          <CardContent className="min-h-full  overflow-none ">
            <RadioGroup
              defaultValue="auto"
              className="grid grid-cols-2 justify-items-center content-center h-full w-auto lg:ml-[550px] lg:mr-[550px] "
            >
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Enable Battery Limiter </p>
                <BatteryMediumIcon />
                <Button
                  onClick={() => handleBatteryLimiterChange("On")}
                  variant="outline"
                >
                  Enable
                </Button>
              </div>
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Disable Battery Limiter </p>
                <BatteryFullIcon />
                <Button
                  onClick={() => handleBatteryLimiterChange("Off")}
                  variant="outline"
                >
                  Disable
                </Button>
              </div>
            </RadioGroup>
            <div className="mt-4 py-0 my-0">
              <p>
                Limits battery charging to 80%, preserving battery health for
                laptops primarily used while plugged into AC power.
              </p>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <div className="grid">
          <div className="flex flex-col gap-2 justify-center">
            {batteryLimiter == 1 ? (
              <BatteryMediumIcon size={150} className="w-full" />
            ) : (
              <BatteryFullIcon size={150} className="w-full" />
            )}
            <p className="text-center">
              Current State :{batteryLimiter === 1 ? " Enabled" : " Disabled"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
