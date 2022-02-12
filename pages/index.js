import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import SearchIcon from '@mui/icons-material/Search'
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import CustomMap from '../components/custommap'
import { styled, alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import { Text } from '../components/text'
import Head from 'next/head'
import {
  FaPhone,
  FaSearchLocation,
  FaFacebookF,
  FaEnvelope,
  FaPhoneAlt,
  FaWindowMaximize,
} from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { RouterTwoTone } from '@mui/icons-material'
import { isForwardRef } from 'react-is'

export async function getServerSideProps() {
  const response = await fetch(
    'https://app.digitaldeets.com/api_catalog/categories'
  )
  const result = await response.json()
  const availableCategories = result.categories
  availableCategories.unshift('All Categories')
  // Pass data to the page via props
  return { props: { availableCategories } }
}

const DEFAULT_DESC =
  ' Add a description to your organization listing.  The online Community Catalog is available to the entire community of organizations and members.  Update your information anytime.'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  marginLeft: theme.spacing(1),
  width: 'auto',
  color: 'white',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '40ch',
      '&:focus': {
        width: '45ch',
      },
    },
  },
}))

const SearchComponent = ({ searchTerm, handleSearch }) => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Find my organization"
        value={searchTerm}
        onChange={(e) => handleSearch(e)}
        inputProps={{ 'aria-label': 'find my listing' }}
      />
    </Search>
  )
}

function formatPhoneNumber(phoneNumberString) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return null
}

function DirectoryPage({ availableCategories = [] }) {
  const router = useRouter()
  const { categoryType, email, orgID, fName, lName } = router.query

  let match
  if (availableCategories && availableCategories.length) {
    match = availableCategories.find((availableCategory) => {
      if (categoryType) {
        return (
          availableCategory.toLowerCase().replace(/\s/g, '') ==
          categoryType.toLowerCase().replace(/\s/g, '')
        )
      }
    })
  }

  let search_str = (orgID != 'undefined' && orgID) ? orgID : ''

  const [category, setCategory] = useState(match ? match : 'All Categories')
  const [listings, setListings] = useState([])
  const [queryParams, setQueryParams] = useState('')
  const [displayedListings, setDisplayedListings] = useState([])
  const [limit, setLimit] = useState(21)
  const [offset, setOffset] = useState(0)
  const [searchTerm, setSearchTerm] = useState(search_str)
  const [paginatorCount, setPaginatorCount] = useState(0)
  const [page, setPage] = React.useState(1)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [open, setOpen] = React.useState(false)
  //const [seeMoreActive, setSeeMoreActive] = React.useState(true)
  const theme = useTheme()

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const makeQueryParamString = (params) => {
    return Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&')
  }
  useEffect(() => {
    setQueryParams(makeQueryParamString(router.query))
  }, [])

  /*useEffect(() => {
    async function fetchListings() {
      const queryString = new URLSearchParams({
        Categories: category,
        SearchTermA: searchTerm,
        offset: offset,
        orgID: orgID,
      }).toString()
      const response = await fetch(`/api/directory?${queryString}`)
      const json = await response.json()
      setListings(json.data)
      setDisplayedListings(json.data)
      setPaginatorCount(Math.ceil(json.count / limit))
    }
    fetchListings()
  }, [category])
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      async function fetchListings() {
        const queryString = new URLSearchParams({
          Categories: category,
          SearchTermA: searchTerm,
          offset: offset,
          orgID: orgID,
        }).toString()
        const response = await fetch(`/api/directory?${queryString}`)
        const json = await response.json()
        setListings(json.data)
        setDisplayedListings(json.data)
        setPaginatorCount(Math.ceil(json.count / limit))
      }
      fetchListings()
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])*/

   useEffect(() => {
    async function fetchListings() {
      const queryString = new URLSearchParams({
        category: (category == 'All Categories') ? 'all_organizations' : category,
        search: searchTerm,
        page_limit: limit,
        page: page
      }).toString()
      const response = await fetch(`https://app.digitaldeets.com/api_catalog/organizations?${queryString}`)
      const json = await response.json()
      setListings(json.organizations)
      setDisplayedListings(json.organizations)
      setPaginatorCount(Math.ceil(json.total / limit))
    }
      fetchListings()
  }, [category])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      async function fetchListings() {
        const queryString = new URLSearchParams({
          category: (category == 'All Categories') ? 'all_organizations' : category,
          search: searchTerm,
          page_limit: limit,
          page: page
        }).toString()
        const response = await fetch(`https://app.digitaldeets.com/api_catalog/organizations?${queryString}`)
        const json = await response.json()
        setListings(json.organizations)
        setDisplayedListings(json.organizations)
        setPaginatorCount(Math.ceil(json.total / limit))
      }

      if(orgID != searchTerm || (!router.query.orgID && orgID == searchTerm)){
        fetchListings()
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const handleChange = (event) => {
    setOffset(0)
    setPage(1)
    router.query.categoryType = event.target.value
    if(router.query.orgID){
      router.query.orgID = ''
      if(orgID == searchTerm){
        setSearchTerm('')
      }
    }
    router.push(router)
    setCategory(event.target.value)
  }
  const handleClose = (event) => {
    setOpen(false)
  }

  /*const handlePaging = async (event, value) => {
    if (!value) return
    setPage(value)
    setOffset((value - 1) * limit)
    const first = (value - 1) * limit
    const second = (value - 1) * limit + limit
    const queryString = new URLSearchParams({
      Categories: category,
      SearchTermA: searchTerm,
      offset: (value - 1) * limit,
    }).toString()
    const response = await fetch(`/api/directory?${queryString}`)
    const json = await response.json()

    setDisplayedListings(json.data)
  }*/

  const handlePaging = async (event, value) => {
    if (!value) return
    setPage(value)
    setOffset((value - 1) * limit)
    const first = (value - 1) * limit
    const second = (value - 1) * limit + limit
    const queryString = new URLSearchParams({
      category: (category == 'All Categories') ? 'all_organizations' : category,
      search: searchTerm,
      page_limit: limit,
      page: value
    }).toString()
    const response = await fetch(`https://app.digitaldeets.com/api_catalog/organizations?${queryString}`)
    const json = await response.json()
    setDisplayedListings(json.organizations)
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  const handleListItemClick = (event, index) => {
    analytics.identify({
      listing: displayedListings[index],
      firstName: fName,
      lastName: lName,
      email: email,
      LISTVIEW: true,
    })
    setSelectedIndex(index)
    setOpen(true)
  }

  const handleSignUpClick = (event, index) => {
    analytics.identify({
      listing: displayedListings[index],
      firstName: fName,
      lastName: lName,
      email: email,
      SIGNUP: true,
    })
  }

  const handleSearch = (event) => {
    event.stopPropagation()
    const term = event.target.value
    setOffset(0)
    setPage(1)
    setSearchTerm(term)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    padding: '20px',
    background: '#fff',
    boxShadow: 24,
    p: 4,
  }

  return (
    <>
      <Head>
        <title>Digital Deets - Community Catalog</title>
      </Head>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        className="text-grey"
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <IconButton
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          className="flex self-end m-4"
        >
          <CloseIcon />
        </IconButton>
        <div className="min-w-modal"></div>
        <img
          src={displayedListings[selectedIndex]?.logo}
          className="w-auto self-center"
        />
        <DialogTitle id="responsive-dialog-title">
          {displayedListings[selectedIndex]?.businessname}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {displayedListings[selectedIndex]?.description}
            </Typography>
            <div className="flex justify-center my-2">
              <img
                src={displayedListings[selectedIndex]?.spotlight_photo}
                className="w-auto self-center"
              />
            </div>
            {displayedListings[selectedIndex]?.categories[0] && (
              <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                <b>Category: </b>{' '}
                {displayedListings[selectedIndex]?.categories.join(', ')}
              </Typography>
            )}
            {displayedListings[selectedIndex]?.promocode && (
              <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                <b>Deal/Offer: </b>{' '}
                {displayedListings[selectedIndex]?.promocode}
                <p>{displayedListings[selectedIndex]?.promocode_description}</p>
              </Typography>
            )}
            {displayedListings[selectedIndex]?.website && (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 1 }}
                className="flex items-center"
              >
                <FaWindowMaximize className="mr-2" />
                <a
                  href={displayedListings[selectedIndex]?.website}
                  target="_blank"
                  className="text-blue"
                >
                  {displayedListings[selectedIndex]?.website}
                </a>
              </Typography>
            )}
            {displayedListings[selectedIndex]?.facebookpage && (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 1 }}
                className="flex items-center"
              >
                <FaFacebookF className="mr-2" />
                <a
                  href={displayedListings[selectedIndex]?.facebookpage}
                  target="_blank"
                  className="text-blue"
                >
                  {displayedListings[selectedIndex]?.facebookpage}
                </a>
              </Typography>
            )}
            {displayedListings[selectedIndex]?.phonenumber && (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 1 }}
                className="flex items-center"
              >
                <FaPhone className="mr-2" />
                {formatPhoneNumber(
                  displayedListings[selectedIndex]?.phonenumber
                )}
              </Typography>
            )}
            {displayedListings[selectedIndex]?.email && (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 1 }}
                className="flex items-center"
              >
                <FaEnvelope className="mr-2" />
                <a
                  href={`mailto:${displayedListings[selectedIndex]?.email}`}
                  target="_blank"
                  className="text-blue"
                >
                  {displayedListings[selectedIndex]?.email}
                </a>
              </Typography>
            )}
            {displayedListings[selectedIndex]?.streetaddress && (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 1 }}
                className="flex items-center"
              >
                <FaSearchLocation className="mr-2" />
                {displayedListings[selectedIndex]?.streetaddress},{' '}
                {displayedListings[selectedIndex]?.state},{' '}
                {displayedListings[selectedIndex]?.zipcode}
              </Typography>
            )}
          </DialogContentText>
          <div className="flex items-end">
            
            {displayedListings[selectedIndex]?.status != 'complete' ? (
              <a
                onClick={(event) => handleSignUpClick(event, selectedIndex)}
                className="w-full flex justify-end"
                href={`https://community.digitaldeets.com/onboarding/${displayedListings[selectedIndex]?.id}?${queryParams}`}
              >
                <Button className="w-full self-end bg-orange text-white normal-case">
                  Sign Up My Organization
                </Button>
              </a>
            ) : (
              <a
                onClick={(event) => handleSignUpClick(event, selectedIndex)}
                className="w-full flex justify-end text-blue"
                href={`https://community.digitaldeets.com/onboarding/${displayedListings[selectedIndex]?.id}?${queryParams}`}
              >Join this Organization</a>
            )}
            
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex lg:flex-row flex-col mt-32 xl:mt-0 text-grey">
        <Box sx={{ flex: 2 }}>
          <Grid
            sx={{
              backgroundColor: '#02779d',
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: '20px',
              paddingBottom: '10px',
            }}
          >
            {/* <Grid item sx={{ display: 'flex' }}> */}
            {/* <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Listings"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                inputProps={{ "aria-label": "search categories" }}
                style={{ width: "60%" }}
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton> */}
            <SearchComponent
              searchTerm={searchTerm}
              handleSearch={handleSearch}
            />
            {/* </Grid> */}
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControl
                fullWidth
                variant="standard"
                sx={{
                  color: 'white',
                  marginLeft: '24px',
                  fontSize: '12px',
                  marginTop: '5px',
                }}
              >
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{ color: 'white !important', fontSize: '12px' }}
                >
                  Browse by category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  // defaultValue={availableCategories[0].label}
                  onChange={handleChange}
                  style={{ color: 'white', fontSize: '14px' }}
                >
                  {availableCategories.map((availableCategory, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={availableCategory}
                        name={availableCategory}
                      >
                        {availableCategory}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* <Divider style={{ marginTop: "50px" }} /> */}
          <div className="my-4 ml-4">
            Can't find your organization? Submit it{' '}
            <a
              className="text-blue"
              href="https://zfrmz.com/aLhAfKDxfbYtVbnmdOWo"
            >
              here.
            </a>
          </div>
          <Grid
            sx={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
            }}
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {displayedListings.map((listing, index) => {
              return (
                <Grid
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  item
                  md={4}
                >
                  <Card
                    sx={{ maxWidth: 300 }}
                    className="flex flex-col justify-between text-grey"
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={listing.logo}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.style.display = 'none'
                      }}
                    />
                    <CardContent
                      onClick={(event) => handleListItemClick(event, index)}
                    >
                      <Typography gutterBottom variant="h5" component="div">
                        {listing.businessname}
                      </Typography>
                      {/* <Typography
                        variant="body2"
                        color="text.secondary"
                        className="line-clamp-5 overflow-hidden h-[150px]"
                      >
                        {listing.description
                          ? listing.description
                          : DEFAULT_DESC}
                      </Typography> */}
                      {listing.phonenumber && (
                        <Text
                          level="xs"
                          weight="normal"
                          className="mt-2 flex text-grey items-center"
                        >
                          <FaPhone className="mr-2 text-blue" />
                          {formatPhoneNumber(listing.phonenumber)}
                        </Text>
                      )}
                      {listing.streetaddress && (
                        <Text
                          level="xs"
                          weight="normal"
                          className="mt-2 flex text-grey"
                        >
                          <FaSearchLocation className="mr-2 text-blue" />
                          {`${listing.streetaddress}, ${listing.city}, ${listing.state}, ${listing.zipcode}`}
                        </Text>
                      )}
                    </CardContent>
                    <CardActions className="flex flex-col">
                      <div
                        className="flex w-full justify-end mr-2"
                        onClick={(event) => handleListItemClick(event, index)}
                      >
                        <Text
                          level="s"
                          weight="normal"
                          className="mt-2 text-blue text-end"
                        >
                          View full listing
                        </Text>
                      </div>                      
                      {listing.status != 'complete' ? (
                        <a
                        onClick={(event) => handleSignUpClick(event, index)}
                        className="w-full flex justify-end"
                        href={`https://community.digitaldeets.com/onboarding/${listing.id}?${queryParams}`}
                      >
                          <Button className="w-full self-end bg-orange text-white normal-case">
                            Sign Up My Organization
                          </Button>
                        </a>
                      ) : (
                        <a
                        onClick={(event) => handleSignUpClick(event, selectedIndex)}
                        className="w-full flex justify-end text-blue"
                        href={`https://community.digitaldeets.com/onboarding/${listing.id}?${queryParams}`}
                      >Join this Organization</a>
                      )}                      
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Box>
        <Box sx={{ flex: 1, marginTop: '-8px' }}>
          <CustomMap
            locations={displayedListings}
            google={{ zoomControl: true }}
          />
        </Box>
      </div>
      {paginatorCount > 1 && (
        <div
          className="mt-8"
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Pagination
            count={paginatorCount}
            color="secondary"
            variant="outlined"
            onChange={handlePaging}
            page={page}
          />
        </div>
      )}
    </>
  )
}

export default DirectoryPage
