import React from "react"
import { StyledEngineProvider } from "@mui/material/styles"
import "tailwindcss/tailwind.css"

function MyApp({ Component, pageProps }) {
  return (
    <StyledEngineProvider injectFirst>
      <Component {...pageProps} />
    </StyledEngineProvider>
  )
}

export default MyApp
