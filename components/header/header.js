import React, { useState } from "react"
import Link from "next/link"
import { Text } from "../text"
import { HamburgerIcon, CloseIcon } from "../icons"
import cx from "classnames"
import styled from "styled-components"

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
    name: "For Fundraisers",
    items: [
      { text: "Schools", href: "https://digitaldeets.com/schools" },
      { text: "Nonprofits", href: "https://digitaldeets.com/nonprofits" },
      {
        text: "School Fundraising Ideas",
        href: "https://digitaldeets.com/school-fundraising-ideas",
      },
    ],
  },
  {
    name: "For Businesses",
    items: [
      {
        text: "Kid-Friendly Businesses",
        href: "https://digitaldeets.com/kid-friendly-businesses",
      },
      {
        text: "Local Businesses",
        href: "https://digitaldeets.com/small-and-local-businesses/",
      },
      {
        text: "Advertise Your Business",
        href: "https://digitaldeets.com/small-and-local-businesses/advertising",
      },
    ],
  },
  {
    name: "Ways to Use",
    items: [
      {
        text: "List, Promote, and Sponsor",
        href: "https://digitaldeets.com/list-sponsor-and-promote/",
      },
      { text: "Fundraise" },
      { text: "Communicate" },
    ],
  },
  {
    name: "Learn More",
    items: [
      {
        text: "About Us",
        href: "https://digitaldeets.com/small-and-local-businesses/about-us",
      },
      {
        text: "Training",
        href: "https://digitaldeets.com/small-and-local-businesses/training",
      },
      {
        text: "Blog",
        href: "https://digitaldeets.com/small-and-local-businesses/blog",
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

  return (
    <div className="z-20 bg-white border-b items-center xl:px-28 lg:px-16 px-8 py-4 fixed xl:sticky w-full top-0">
      <div className="justify-between flex">
        <div className="flex">
          <Link href={`https://digitaldeets.com/`}>
            <a className="mr-4 cursor-pointer">
              <img
                className="w-12"
                src="https://digitaldeets.com/wp-content/uploads/2021/10/Digital-Deets-logo_new.png"
              />
            </a>
          </Link>
          <nav className="xl:flex hidden items-center">
            {navigation.map((nav) => {
              return (
                <MenuLink>
                  <div className="flex items-center mx-4 my-2  hover:opacity-70">
                    <Text weight={"normal"} level="s">
                      {nav.name}
                    </Text>
                  </div>
                  <ul class="dropdown-menu absolute text-gray-700 pt-1">
                    {nav.items &&
                      nav.items.map((item) => {
                        return (
                          <li class="">
                            <a
                              class="rounded-t bg-gray-100 hover:bg-gray-200 py-2 px-4 block whitespace-no-wrap"
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
          <Text level="s" weight="normal" className="mr-1">
            Already a member?
          </Text>
          <Link href="https://app.digitaldeets.com">
            <a>
              <Text level="s" weight="bold" className="mr-8">
                Login
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
          "mobile-menu xl:hidden flex flex-col md:flex-row md:items-center justify-between mt-12",
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
                  <Text level="m" weight="bold">
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
