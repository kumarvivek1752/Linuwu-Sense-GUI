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

import { KeyboardIcon, KeyboardOffIcon } from "lucide-react";
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

export default function BacklightTimeout() {
  const [BacklightTimeout, setBacklightTimeout] = useState<number>(0);
  const debouncedUpdateTimeout = debounce(async function(state: string) {
    try {
      const result = await invoke<string>("set_backlight_timeout", {
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
        const result = parseInt(await invoke<string>("get_backlight_timeout"));
        console.log(result);
        setBacklightTimeout(result);
      } catch (error) {
        console.error("Failed to update :", error);
      }
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const handleBacklightTimeoutChange = (state: string) => {
    debouncedUpdateTimeout(state);
  };

  return (
    <>
      <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200 w-100">
        <div className="flex flex-row gap-2 justify-center w-full mt-3">
          <h1 className="flex text-base font-bold block">Backlight Timeout</h1>
        </div>
      </div>
      <div className="grid gap-4 p-5 pt-0 pb-0  w-full h-auto">
        <Card className="w-full h-auto">
          <CardHeader>
            <CardTitle className="text-center">Timeout Modes</CardTitle>
          </CardHeader>
          <CardContent className="min-h-full  overflow-none ">
            <RadioGroup
              defaultValue="auto"
              className="grid grid-cols-2 justify-items-center content-center h-full w-auto lg:ml-[550px] lg:mr-[550px] "
            >
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Enable Backlight Timeout </p>
                <KeyboardIcon />
                <Button
                  onClick={() => handleBacklightTimeoutChange("On")}
                  variant="outline"
                >
                  Enable
                </Button>
              </div>
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Disable Backlight Timeout </p>
                <KeyboardOffIcon />
                <Button
                  onClick={() => handleBacklightTimeoutChange("Off")}
                  variant="outline"
                >
                  Disable
                </Button>
              </div>
            </RadioGroup>
            <div className="mt-4 py-0 my-0">
              <p>
                This feature turns off the keyboard RGB after 30 seconds of idle
                mode.
              </p>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <div className="grid">
          <div className="flex flex-col gap-2 justify-center">
            {BacklightTimeout == 1 ? (
              <KeyboardIcon size={150} className="w-full" />
            ) : (
              <KeyboardOffIcon size={150} className="w-full" />
            )}
            <p className="text-center">
              Current State :{BacklightTimeout === 1 ? " Enabled" : " Disabled"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
