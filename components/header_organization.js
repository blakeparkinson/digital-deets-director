import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import cx from 'classnames'

export default function HeaderOrganization({ logo = '', name = '' }) {

  const theme = useTheme()

  const brandColorsStyles = {
    primary:{
      text: {
        color: theme.palette.primary.main
      },
      background: {
        backgroundColor: theme.palette.primary.main
      }
    },
    secondary:{
      text: {
        color: theme.palette.secondary.main
      },
      background: {
        backgroundColor: theme.palette.secondary.main
      }
    }
  };

  const [small, setSmall] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setIsMobile(true)
      }

      window.addEventListener('resize', () => {
        if (window.innerWidth < 640) {
          setIsMobile(true)
        }else{
          setIsMobile(false)
        }
      })

      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 220) {
          setSmall(true)
        }
        if (window.pageYOffset < 180) {
          setSmall(false)
        }
      })
    }
  }, [])

  return (
    <div
        className={cx(
          'z-20 bg-white border-b border-sand-30 items-center xl:px-16 lg:px-8 px-4 xl:sticky fixed w-full top-0 transform duration-300',
          {
            'py-small': (isMobile || small),
            'py-large': (!isMobile && !small),
          }
        )}
      >
        <div className="sm:justify-center justify-between flex">
          <div className="flex">
            <img
                  className={cx(
                  {
                    'w-24': (!isMobile && !small),
                    'w-16': (isMobile || small),
                  })}
                  src={logo}
                />
            <h1 
              style={brandColorsStyles.primary.text}
              className="flex mx-4 xl:text-2xl sm:text-xl items-center font-medium">
                {name}'s Community Catalog
            </h1>
          </div>
        </div>
    </div>
  )
}