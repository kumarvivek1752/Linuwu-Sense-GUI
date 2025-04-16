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

import { PlugZap2Icon, UnplugIcon } from "lucide-react";
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

export default function UsbCharging() {
  const [usbCharging, setUsbCharging] = useState<number>(0);
  const debouncedUpdate = debounce(async function(state: string) {
    try {
      const result = await invoke<string>("set_usb_charging", {
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
        const result = parseInt(await invoke<string>("get_usb_charging"));
        console.log(result);
        setUsbCharging(result);
      } catch (error) {
        console.error("Failed to update :", error);
      }
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const handleUsbChargingChange = (state: string) => {
    debouncedUpdate(state);
  };

  return (
    <>
      <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200 w-100">
        <div className="flex flex-row gap-2 justify-center w-full mt-3">
          <h1 className="flex text-base font-bold block">USB Charging</h1>
        </div>
      </div>
      <div className="grid gap-4 p-5 pt-0 pb-0  w-full h-auto">
        <Card className="w-full h-auto">
          <CardHeader>
            <CardTitle className="text-center">USB Charging Modes</CardTitle>
          </CardHeader>
          <CardContent className="min-h-full  overflow-none ">
            <RadioGroup
              defaultValue="auto"
              className="grid grid-cols-2 justify-items-center content-center h-full w-auto lg:ml-[550px] lg:mr-[550px] "
            >
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Enable USB Charging </p>
                <PlugZap2Icon />
                <Button
                  onClick={() => handleUsbChargingChange("On")}
                  variant="outline"
                >
                  Enable
                </Button>
              </div>
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Disable USB Charging</p>
                <UnplugIcon />
                <Button
                  onClick={() => handleUsbChargingChange("Off")}
                  variant="outline"
                >
                  Disable
                </Button>
              </div>
            </RadioGroup>
            <div className="mt-4 py-0 my-0">
              <p>
                Allows the USB charging port to provide power even when the
                laptop is off. (not implementd yet)
              </p>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <div className="grid">
          <div className="flex flex-col gap-2 justify-center">
            {usbCharging == 1 ? (
              <PlugZap2Icon size={150} className="w-full" />
            ) : (
              <UnplugIcon size={150} className="w-full" />
            )}
            <p className="text-center">
              Current State :{usbCharging === 1 ? " Enabled" : " Disabled"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
