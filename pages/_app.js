import React from "react"
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles"
import { createTheme } from "@mui/material/styles"
import "tailwindcss/tailwind.css"

const theme = createTheme({
  palette: {
    primary: {
      main: `#02779d`,
    },
    secondary: {
      main: "#ee6c34",
    },
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default MyApp
