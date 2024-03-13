import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles"
import { createTheme } from "@mui/material/styles"
import { Header } from "../components"
import HeaderOrganization from '../components/header_organization'

import "tailwindcss/tailwind.css"

function MyApp({ Component, pageProps }) {

  const [showComponent, setShowComponent] = useState(false)
  const [showHeader, setShowHeader] = useState(false)
  const [showOrganizationHeader, setShowOrganizationHeader] = useState(false)

  const [themePrimaryColor, setThemePrimaryColor] = useState('#02779d')
  const [themeSecondaryColor, setThemeSecondaryColor] = useState('#ee6c34')

  const [organizationLogo, setOrganizationLogo] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [organization, setOrganization] = useState('')

  const router = useRouter()

   //get organization data
  useEffect(() => {

    if(!router.isReady) return;

    const { organization = ''} = router.query

    const { orgID = ''} = router.query

    let APIurl = (window.location.hostname == 'catalog.digitaldeets.com') ? 'https://app.digitaldeets.com' : 'http://digitaldeets.local'; 
      
    if(organization){
      fetch(`${APIurl}/api_catalog/organization_info/${organization}`)
      .then(response => response.json())
      .then(data => {
        if(data.response == 1){
          setOrganization(organization)

          if(data.colors.primary_color){
            setThemePrimaryColor(data.colors.primary_color)
          }

          if(data.colors.secondary_color){
            setThemeSecondaryColor(data.colors.secondary_color)
          }

          setOrganizationName(data.name)
          if(data.logo){
            setOrganizationLogo(data.logo)
          }

          setShowOrganizationHeader(true)
          setShowComponent(true)
        }else{
          setShowHeader(true)
          setShowComponent(true)
        }
      });
    }else if(orgID) {
      fetch(`${APIurl}/api_catalog/sponsored_organization_info/${orgID}`)
      .then(response => response.json())
      .then(data => {
        if(data.response == 1){

          if(data.colors){
            if(data.colors.primary_color){
              setThemePrimaryColor(data.colors.primary_color)
            }
  
            if(data.colors.secondary_color){
              setThemeSecondaryColor(data.colors.secondary_color)
            }
          }

          if(data.name){
            setOrganizationName(data.name)
          }
          
          if(data.logo){
            setOrganizationLogo(data.logo)
          }

          if(data.name){
            setShowOrganizationHeader(true)
          } else {
            setShowHeader(true)
          }
          setShowComponent(true)
        }else{
          setShowHeader(true)
          setShowComponent(true)
        }
      });
    }else{
      setShowHeader(true)
      setShowComponent(true)
    }
  }, [router.isReady]) 

  const theme = createTheme({
    palette: {
      primary: {
        main: themePrimaryColor,
      },
      secondary: {
        main: themeSecondaryColor,
      },
    },
  })

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {showHeader && <Header />}
        {showOrganizationHeader && 
          <HeaderOrganization 
            logo={organizationLogo}
            name={organizationName}
          />
        }
        {showComponent && <Component {...pageProps} organization={organization} />}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default MyApp
