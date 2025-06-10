import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: "#222436" },
        secondary: { value: "#590d0d" },
      },
      fonts: {
        body: { value: "system-ui, sans-serif" },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
