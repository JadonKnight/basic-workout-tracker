import {
  InformationCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { NumberSetting, TimeSetting } from "./exercise-setting";
import { Disclosure } from "@headlessui/react";

interface Props {
  name: string;
}

export default function ExerciseCard({ name }: Props) {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl mx-auto shadow-md p-2">
      <Disclosure>
        {({ open }) => (
          <>
            {/* Control */}
            <div className="flex flex-row justify-between">
              <h2 className="inline-flex items-center text-2xl font-bold text-start p-4">
                {name}
              </h2>
              <div className="flex flex-row">
                <div className="flex flex-row">
                  <button className="p-4">
                    <InformationCircleIcon className="w-8 h-8" />
                  </button>
                </div>
                <div className="flex flex-row">
                  <Disclosure.Button className="p-4">
                    <ChevronDownIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-8 w-8`}
                    />
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            <Disclosure.Panel>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col p-4">
                  <NumberSetting
                    name="Set"
                    onSettingChange={(value) =>
                      console.log(`Value from parent is ${value}`)
                    }
                  />
                </div>
                <div className="flex flex-col p-4">
                  <NumberSetting name="Reps" />
                </div>
                <div className="flex flex-col p-4">
                  <NumberSetting name="Weight" />
                </div>
              </div>
              <div className="flex flex-row justify-around">
                <div className="flex flex-col p-2">
                  <TimeSetting name="Rest" />
                </div>
                <div className="flex flex-col p-2">
                  <TimeSetting name="Set" />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
