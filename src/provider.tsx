import React, { useContext } from "react";
import ProConfigContext from "@ant-design/pro-provider";
import { valueTypeMap } from "./Form/valueTypeMap";

export type Location = {
  navigate: (args: { pathname: string; params?: any }) => void;
  goBack: () => void;

  getParams: () => any;
  getPathname: () => string;
};

export type AntDesignProProviderValue = {
  navigate: (args: { pathname: string; params?: any }) => void;
  goBack: () => void;

  getParams: () => any;
  getPathname: () => string;
};

export const AntDesignProContext = React.createContext<AntDesignProProviderValue>(
  {
    navigate() {},
    goBack() {},
    getParams() {},
    getPathname() {
      return "";
    },
  }
);

export function AntDesignProProvider({
  children,
  ...value
}: React.PropsWithChildren<AntDesignProProviderValue>) {
  const context = useContext(ProConfigContext);
  context.valueTypeMap = {
    ...context.valueTypeMap,
    ...valueTypeMap,
  };

  return (
    <AntDesignProContext.Provider value={value}>
      {children}
    </AntDesignProContext.Provider>
  );
}
