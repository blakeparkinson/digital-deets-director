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

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
          'z-20 bg-white border-b border-sand-30 items-center xl:px-16 lg:px-10 px-8 xl:sticky fixed w-full top-0 transform duration-300',
          {
            'py-small': small,
            'py-large': !small,
          }
        )}
      >
        <div className="xl:justify-center justify-between flex">
          <div className="flex">
            <img
                  className={cx({
                    'w-24': !small,
                    'w-16': small,
                  })}
                  src={logo}
                />
            <h1 
              style={brandColorsStyles.primary.text}
              className="xl:flex text-2xl items-center font-medium">
                {name}'s Community Catalog
            </h1>
          </div>
        </div>
    </div>
  )
}