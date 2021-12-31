import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Text } from '../text'
import { HamburgerIcon, CloseIcon } from '../icons'
import cx from 'classnames'
import styled from 'styled-components'
import { FaChevronDown } from 'react-icons/fa'

const MenuLink = styled.div`
  .dropdown-menu {
    display: none;
  }
  &:hover {
    .dropdown-menu {
      display: block;
    }
  }
`
const navigation = [
  {
    name: 'For Fundraisers',
    items: [
      { text: 'Schools', href: 'https://digitaldeets.com/schools' },
      { text: 'Nonprofits', href: 'https://digitaldeets.com/nonprofits' },
      {
        text: 'School Fundraising Ideas',
        href: 'https://digitaldeets.com/school-fundraising-ideas',
      },
    ],
  },
  {
    name: 'For Businesses',
    items: [
      {
        text: 'Kid-Friendly Businesses',
        href: 'https://digitaldeets.com/kid-friendly-businesses',
      },
      {
        text: 'Local Businesses',
        href: 'https://digitaldeets.com/small-and-local-businesses/',
      },
      {
        text: 'Advertise Your Business',
        href: 'https://digitaldeets.com/small-and-local-businesses/advertising',
      },
    ],
  },
  {
    name: 'Community Catalog',
    active: true,
  },
  {
    name: 'Ways to Use',
    items: [
      {
        text: 'Deets Digest',
        href: 'https://digitaldeets.com/deets-digest/',
      },
      {
        text: 'List, Promote, and Sponsor',
        href: 'https://digitaldeets.com/list-sponsor-and-promote/',
      },
      {
        text: 'Fundraise',
        href: 'https://digitaldeets.com/fundraising/',
      },
    ],
  },
  {
    name: 'Learn More',
    items: [
      {
        text: 'About Us',
        href: 'https://digitaldeets.com/small-and-local-businesses/about-us',
      },
      {
        text: 'Training',
        href: 'https://digitaldeets.com/small-and-local-businesses/training',
      },
      {
        text: 'Blog',
        href: 'https://digitaldeets.com/small-and-local-businesses/blog',
      },
    ],
  },
]

export const Header = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const [small, setSmall] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        setSmall(window.pageYOffset > 200)
      })
    }
  }, [])

  return (
    <div
      className={cx(
        'z-20 bg-white border-b border-sand-30 items-center xl:px-28 lg:px-16 px-8 xl:sticky fixed w-full top-0 transform duration-300',
        {
          'py-2': small,
          'py-4': !small,
        }
      )}
    >
      {' '}
      <div className="xl:justify-center justify-between flex">
        <div className="flex">
          <Link href={`https://digitaldeets.com/`}>
            <a className="mr-20 cursor-pointer">
              <img
                className={cx({
                  'w-24': !small,
                  'w-16': small,
                })}
                src="https://digitaldeets.com/wp-content/uploads/2021/10/Digital-Deets-logo_new.png"
              />
            </a>
          </Link>
          <nav className="xl:flex hidden items-center">
            {navigation.map((nav, index) => {
              return (
                <MenuLink key={index}>
                  <div className="flex items-center mx-4 my-2  opacity-60 hover:opacity-40">
                    <Text
                      weight={'bold'}
                      level="s"
                      className={cx({
                        'text-blue': nav.active,
                      })}
                    >
                      {nav.name}
                    </Text>
                    {nav.items && <FaChevronDown className="ml-1 text-xs" />}
                  </div>
                  <ul className="dropdown-menu absolute text-gray-700 pt-1 w-[240px] border-t-2 border-blue ">
                    {nav.items &&
                      nav.items.map((item) => {
                        return (
                          <li class="">
                            <a
                              className="bg-white hover:bg-gray-200 block whitespace-no-wrap py-2 px-8 text-sm"
                              href={item.href}
                            >
                              {item.text}
                            </a>
                          </li>
                        )
                      })}
                  </ul>
                </MenuLink>
              )
            })}
          </nav>
        </div>
        <div className="hidden xl:flex items-center">
          <Link href="https://app.digitaldeets.com">
            <a>
              <Text level="s" weight="bold" className="mr-8">
                Log in
              </Text>
            </a>
          </Link>
        </div>
        <div className="xl:hidden flex items-center">
          <button
            className="outline-none mobile-menu-button"
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            {hamburgerOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>
      <div
        className={cx(
          'mobile-menu xl:hidden flex flex-col md:flex-row md:items-center justify-between mt-12',
          {
            hidden: !hamburgerOpen,
          }
        )}
      >
        <ul className="mb-4 md:mb-0">
          {navigation.map((nav) => {
            return (
              <li key={nav.name}>
                <div className="flex pr-2 py-4 items-center">
                  <Text
                    level="m"
                    weight="bold"
                    className={cx({
                      'text-blue': nav.active,
                    })}
                  >
                    {nav.name}
                    <ul>
                      {nav.items &&
                        nav.items.map((item) => {
                          return (
                            <li class="">
                              <a
                                class="rounded-t  hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap"
                                href={item.href}
                              >
                                {item.text}
                              </a>
                            </li>
                          )
                        })}
                    </ul>
                  </Text>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-col items-center border-t">
          <div className="flex mt-8">
            <Text level="s" weight="normal" className="mr-1">
              Already a member?
            </Text>
            <Link href="https://app.digitaldeets.com">
              <a>
                <Text level="s" weight="bold">
                  Login
                </Text>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
