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
  KeyboardIcon,
  KeyboardOffIcon,
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

export default function BatteryCalibration() {
  const [batteryCalibration, setBatteryCalibration] = useState<number>(0);
  const debouncedUpdate = debounce(async function(state: string) {
    try {
      const result = await invoke<string>("set_battery_calibration", {
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
        const result = parseInt(
          await invoke<string>("get_battery_calibration"),
        );
        console.log(result);
        setBatteryCalibration(result);
      } catch (error) {
        console.error("Failed to update :", error);
      }
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const handleBatteryCalibrationChange = (state: string) => {
    debouncedUpdate(state);
  };

  return (
    <>
      <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200 w-100">
        <div className="flex flex-row gap-2 justify-center w-full mt-3">
          <h1 className="flex text-base font-bold block">
            Battery Calibration
          </h1>
        </div>
      </div>
      <div className="grid gap-4 p-5 pt-0 pb-0  w-full h-auto">
        <Card className="w-full h-auto">
          <CardHeader>
            <CardTitle className="text-center">Calibration Modes</CardTitle>
          </CardHeader>
          <CardContent className="min-h-full  overflow-none ">
            <RadioGroup
              defaultValue="auto"
              className="grid grid-cols-2 justify-items-center content-center h-full w-auto lg:ml-[550px] lg:mr-[550px] "
            >
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Start Battery Calibration </p>
                <BatteryFullIcon />
                <Button
                  onClick={() => handleBatteryCalibrationChange("On")}
                  variant="outline"
                >
                  Start
                </Button>
              </div>
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Stop Battery Calibration </p>
                <BatteryLowIcon />
                <Button
                  onClick={() => handleBatteryCalibrationChange("Off")}
                  variant="outline"
                >
                  Stop
                </Button>
              </div>
            </RadioGroup>
            <div className="mt-4 py-0 my-0">
              <p>
                This function calibrates your battery to provide a more accurate
                percentage reading. It involves charging the battery to 100%,
                draining it to 0%, and recharging it back to 100%. Do not unplug
                the laptop from AC power during calibration.
              </p>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <div className="grid">
          <div className="flex flex-col gap-2 justify-center">
            {batteryCalibration == 1 ? (
              <BatteryFullIcon size={150} className="w-full" />
            ) : (
              <BatteryLowIcon size={150} className="w-full" />
            )}
            <p className="text-center">
              Current State :
              {batteryCalibration === 1 ? " Started" : " Stopped"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
