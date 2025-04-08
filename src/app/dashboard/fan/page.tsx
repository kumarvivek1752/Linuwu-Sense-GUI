"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
import { invoke } from "@tauri-apps/api/tauri";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import { FanIcon, GaugeIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

function debounce<T extends (...args: number[]) => void>(
  func: T,
  wait: number,
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default function FanControl() {
  const [cpuFan, setCpuFan] = useState<number>(0);
  const [gpuFan, setGpuFan] = useState<number>(0);
  const [cpuFanSpeed, setCpuFanSpeed] = useState("0");
  const [gpuFanSpeed, setGpuFanSpeed] = useState("0");
  const debouncedUpdateColor = debounce(
    async (cpuFan: number, gpuFan: number) => {
      try {
        const result = await invoke<string>("fan_control", {
          cpu: cpuFan,
          gpu: gpuFan,
        });
        console.log("Update successful:", result);
      } catch (error) {
        console.error("Failed to update keyboard color:", error);
      }
    },
    300,
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const result = await invoke<string>("get_fan_speed");
        const fanLines = result.split("\n");

        const cpuLine = fanLines.find((line) =>
          line.toLowerCase().includes("fan1"),
        );
        const gpuLine = fanLines.find((line) =>
          line.toLowerCase().includes("fan2"),
        );

        if (cpuLine) {
          const match = cpuLine.match(/(\d+)\s*RPM/);
          if (match) setCpuFanSpeed(match[1]);
        }

        if (gpuLine) {
          const match = gpuLine.match(/(\d+)\s*RPM/);
          // if (match) console.log("GPU Fan Speed:", match[1], "RPM");
          if (match) setGpuFanSpeed(match[1]);
        }
      } catch (error) {
        console.error("Error getting fan speed:", error);
      }
    }, 1000); // every second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const handleFanSpeedChange = (cpu: number, gpu: number) => {
    setCpuFan(cpu);
    setGpuFan(gpu);
    debouncedUpdateColor(cpu, gpu);
  };

  return (
    <>
      <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200 w-100">
        <div className="flex flex-row gap-2 justify-center w-full mt-3">
          <h1 className="flex text-base font-bold block">Fan Speed Control</h1>
        </div>
      </div>
      <div className="grid gap-4 p-5 pt-0 pb-0  w-full h-auto">
        <Card className="w-full h-auto">
          <CardHeader>
            <CardTitle className="text-center">Fan Modes</CardTitle>
          </CardHeader>
          <CardContent className="min-h-full  overflow-none ">
            <RadioGroup
              defaultValue="auto"
              className="grid grid-cols-3 justify-items-center content-center h-full w-auto lg:ml-[500px] lg:mr-[500px] "
            >
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Set Fan Speed </p>
                <FanIcon />
                <Button
                  onClick={() => handleFanSpeedChange(0, 0)}
                  variant="outline"
                >
                  Auto
                </Button>
              </div>
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Set Fan Speed </p>
                <FanIcon />
                <Button
                  onClick={() => handleFanSpeedChange(100, 100)}
                  variant="outline"
                >
                  Max
                </Button>
              </div>
              <div className="flex flex-col p-4  justify-items-center items-center  space-y-2 border-2 border-red-200 w-auto bg-red">
                <p className="text-nowrap ">Set Fan Speed </p>
                <FanIcon />
                <AlertDialog>
                  <AlertDialogTrigger>Custom</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-center mb-4">
                        Set Custom Fan Speed
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="flex gap-2 ">
                          <Input
                            placeholder="CPU Fan"
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={cpuFan}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCpuFan(val === "" ? 0 : Number(val));
                            }}
                          />
                          <Input
                            placeholder="GPU Fan"
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={gpuFan}
                            onChange={(e) => {
                              const val = e.target.value;
                              setGpuFan(val === "" ? 0 : Number(val));
                            }}
                          />
                        </div>
                        <ul className="mt-4">
                          <li>
                            cpu and gpu fan should should between 1 to 100
                          </li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleFanSpeedChange(cpuFan, gpuFan)}
                      >
                        Apply
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* <Button */}
                {/*   onClick={() => handleFanSpeedChange(100, 100)} */}
                {/*   variant="outline" */}
                {/* > */}
                {/*   Custom */}
                {/* </Button> */}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="grid">
          <div className="flex flex-col gap-2 justify-center">
            <GaugeIcon size={200} className="w-full" />
            <p className="text-center">CPU speed : {cpuFanSpeed} RPM </p>
            <p className="text-center">GPU speed : {gpuFanSpeed} RPM </p>
          </div>
        </div>
      </div>
    </>
  );
}
