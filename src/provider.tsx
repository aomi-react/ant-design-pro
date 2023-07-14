import React from "react";


export type Location = {
  navigate: (args: { pathname: string, params?: any }) => void
  goBack: () => void

  getParams: () => any
  getPathname: () => string
}

export type AntDesignProProviderValue = {
  location: Location
}

export const AntDesignProContext = React.createContext<AntDesignProProviderValue>({
  location: {
    navigate() {
    },
    goBack() {
    },
    getParams() {
    },
    getPathname() {
      return ''
    }
  }
})

export function AntDesignProProvider({children, ...value}: React.PropsWithChildren<AntDesignProProviderValue>) {
  return <AntDesignProContext.Provider value={value}>
    {children}
  </AntDesignProContext.Provider>

}
