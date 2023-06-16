import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

interface Props {
  name: string;
  onSettingChange?: (value: number) => void;
}

export function NumberSetting({ name, onSettingChange }: Props) {
  const [value, setValue] = useState(0);

  // Event handlers
  const increment = () => {
    setValue(value + 1);
  };
  const decrement = () => {
    // If the value is 0, don't decrement
    if (value === 0) return;
    setValue(value - 1);
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    // If the input is empty, set the value to 0
    if (inputVal === "") {
      setValue(NaN);
      return;
    }
    const newValue = parseInt(inputVal);
    setValue(newValue);
  };

  // Use effect to pass any change in value to the parent
  useEffect(() => {
    const returnValue = () => {
      if (onSettingChange) {
        onSettingChange(value);
      }
    };
    returnValue();
  }, [value, onSettingChange]);

  return (
    <>
      <h3 className="text-xl font-bold text-center">{name}</h3>
      <div className="flex sm:flex-row-reverse flex-col flex-wrap items-center text-lg">
        <button onClick={() => increment()}>
          <PlusIcon className="w-6 h-6 m-3" />
        </button>
        <input
          type="number"
          className="w-16 bg-inherit text-center focus-visible:outline-none focus:ring focus:ring-white"
          value={value}
          onChange={handleInput}
        />
        <button onClick={() => decrement()}>
          <MinusIcon className="w-6 h-6 m-3" />
        </button>
      </div>
    </>
  );
}

export function TimeSetting({ name }: Props) {
  // Write the handler now. It will be similar to the NumberSetting handler.
  const [secondValue, setSecondValue] = useState("00");
  const [minuteValue, setMinuteValue] = useState("00");

  const handleSecondInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    if (parseInt(inputVal) < 0 || inputVal.length > 2) return;
    // Overflow into the minutes if seconds are greater than 59
    if (parseInt(inputVal) > 59) {
      const numberInput = parseInt(inputVal);
      const minutes = Math.floor(numberInput / 60);
      const seconds = numberInput % 60;
      const newMinutes = parseInt(minuteValue) + minutes;
      const newMinutesString =
        newMinutes < 10 ? `0${newMinutes}` : newMinutes.toString();

      setMinuteValue(newMinutesString);
      setSecondValue(seconds.toString());
      return;
    }
    setSecondValue(inputVal);
  };
  const handleMinuteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    if (parseInt(inputVal) < 0 || inputVal.length > 2) return;
    setMinuteValue(inputVal);
  };
  const formatSecondInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    if (inputVal.length === 0) {
      setSecondValue("00");
      return;
    }
    if (inputVal.length === 1) {
      setSecondValue(`0${inputVal}`);
      return;
    }
  };
  const formatMinuteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    if (inputVal.length === 0) {
      setMinuteValue("00");
      return;
    }
    if (inputVal.length === 1) {
      setMinuteValue(`0${inputVal}`);
      return;
    }
  };

  const increment = () => {
    // Convert the current minutes and seconds to seconds then add 1 then convert back to minutes and seconds
    const currentSeconds = parseInt(minuteValue) * 60 + parseInt(secondValue);
    const newSeconds = currentSeconds + 1;
    const newMinutes = Math.floor(newSeconds / 60);
    const newSecondsRemainder = newSeconds % 60;
    const newMinutesString =
      newMinutes < 10 ? `0${newMinutes}` : newMinutes.toString();
    const newSecondsString =
      newSecondsRemainder < 10
        ? `0${newSecondsRemainder}`
        : newSecondsRemainder.toString();
    setMinuteValue(newMinutesString);
    setSecondValue(newSecondsString);
  };
  const decrement = () => {
    // Convert the current minutes and seconds to seconds then subtract 1 then convert back to minutes and seconds
    const currentSeconds = parseInt(minuteValue) * 60 + parseInt(secondValue);
    // If the current seconds is 0, don't decrement
    if (currentSeconds === 0) return;
    const newSeconds = currentSeconds - 1;
    const newMinutes = Math.floor(newSeconds / 60);
    const newSecondsRemainder = newSeconds % 60;
    const newMinutesString =
      newMinutes < 10 ? `0${newMinutes}` : newMinutes.toString();
    const newSecondsString =
      newSecondsRemainder < 10
        ? `0${newSecondsRemainder}`
        : newSecondsRemainder.toString();
    setMinuteValue(newMinutesString);
    setSecondValue(newSecondsString);
  };

  return (
    <>
      <h3 className="text-xl font-bold text-center mb-3">{name}</h3>
      <div className="flex flex-wrap items-center text-lg">
        <div className="flex justify-center w-full">
          <input
            type="number"
            className="w-8 bg-inherit text-center focus-visible:outline-none focus:ring focus:ring-white"
            value={minuteValue}
            onChange={handleMinuteInput}
            onBlur={formatMinuteInput}
          />
          <span className="mx-1">:</span>
          <input
            type="number"
            className="w-8 bg-inherit text-center focus-visible:outline-none focus:ring focus:ring-white"
            value={secondValue}
            onChange={handleSecondInput}
            onBlur={formatSecondInput}
          />
        </div>
        <div className="flex justify-center w-full">
          <button onClick={decrement}>
            <MinusIcon className="w-6 h-6 m-3" />
          </button>
          <button onClick={increment}>
            <PlusIcon className="w-6 h-6 m-3" />
          </button>
        </div>
      </div>
    </>
  );
}
