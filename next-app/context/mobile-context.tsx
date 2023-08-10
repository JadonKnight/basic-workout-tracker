"use client";

import UAParser from "ua-parser-js";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// NOTE: I have set up this interface because
// in the future I might want to pass down more info
// about the device as opposed to just if it's a mobile.
interface MobileContextValues {
  isMobile: boolean;
}
interface MobileProviderProps {
  children: ReactNode;
}

const MobileContext = createContext<MobileContextValues>({
  isMobile: false,
});

export const useMobileContext = () => useContext(MobileContext);

export const MobileProvider = ({ children }: MobileProviderProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const deviceType = result.device.type;
    setIsMobile(deviceType === "mobile");
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};
