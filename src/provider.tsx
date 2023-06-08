import React from "react";


export type Location = {
  navigate: (args: { pathname: string, params?: any }) => void
  goBack: () => void

  getParams: () => any
  getPathname: () => string
}

export type AntDesignProProviderProps = {
  location: Location

}

export const AntDesignProContext = React.createContext<AntDesignProProviderProps | null>(null)

export function AntDesignProProvider({children, ...value}: React.PropsWithChildren<AntDesignProProviderProps>) {
  return <AntDesignProContext.Provider value={value}>
    {children}
  </AntDesignProContext.Provider>

}
