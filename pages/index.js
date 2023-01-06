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
import Script from 'next/script'
import {
  FaPhone,
  FaSearchLocation,
  FaGlobe,
  FaFacebookF,
  FaTwitter,
  FaEnvelope,
  FaWindowMaximize,
} from 'react-icons/fa'
import {
  GrInstagram,
} from 'react-icons/gr'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'

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

const ListingComponent = ({
  listing,
  index,
  queryParams,
  first_block,
  handleListItemClick,
  handleSignUpClick,
  changeCatalogListingStatus,
}) => {
  let blocks_in_row = 3
  if (window.innerWidth < 900) {
    blocks_in_row = 2
  }

  let show_block =
    (first_block && index < blocks_in_row) ||
    (!first_block && index >= blocks_in_row)

  return show_block ? (
    <Grid
      sx={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
      }}
      item
      md={4}
    >
      <Card
        sx={{ width: 310 }}
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
        <CardContent onClick={(event) => handleListItemClick(index)}>
          <Typography gutterBottom variant="h5" component="div">
            {listing.businessname}
          </Typography>
          {listing.promocode && (
            <Text level="xs" weight="normal" className="mt-2 flex text-grey">
              <FaWindowMaximize className="mr-2 text-blue" />
              {listing.promocode}
            </Text>
          )}
          {listing.streetaddress && (
            <Text level="xs" weight="normal" className="mt-2 flex text-grey">
              <FaSearchLocation className="mr-2 text-blue" />
              {`${listing.streetaddress}, ${listing.city}, ${listing.state}, ${listing.zipcode}`}
            </Text>
          )}
        </CardContent>
        <CardActions className="flex flex-col">
          <div
            className="flex w-full justify-end mr-2"
            onClick={(event) => handleListItemClick(index)}
          >
            <Text level="s" weight="normal" className="mt-2 text-blue text-end">
              View full listing
            </Text>
          </div>
          {!listing.use_catalog && listing.catalog_listing_status != 'approve' ? (
              <div className="w-full mr-2">
                <div className="w-full overflow-hidden">
                <Button className="self-end bg-orange text-white normal-case mt-2 float-left" sx={{ minWidth: 130 }} onClick={(event) => changeCatalogListingStatus(index, 'approved')}>
                  Approve
                </Button>

                <Button className="self-end bg-orange text-white normal-case mt-2 float-right" sx={{ minWidth: 130 }} onClick={(event) => changeCatalogListingStatus(index, 'request_edits')}>
                  Request edits
                </Button>
                </div>
                <div className="w-full flex justify-center text-blue mt-2 cursor-pointer" onClick={(event) => changeCatalogListingStatus(index, 'removed')}><span>Remove my catalog listing</span></div>
              </div>
          ) : (
            <div>
            {listing.status != 'complete' ? (
              <a
                onClick={(event) => handleSignUpClick(index)}
                className="w-full flex justify-end"
                href={`https://community.digitaldeets.com/onboarding/${listing.id}?${queryParams}`}
              >
                <Button className="w-full self-end bg-orange text-white normal-case">
                  Sign Up My Organization
                </Button>
              </a>
            ) : (
              <a
                onClick={(event) => handleSignUpClick(index)}
                className="w-full flex justify-end text-blue"
                href={`https://community.digitaldeets.com/onboarding/${listing.id}?${queryParams}`}
              >
                Join this Organization
              </a>
            )}
            </div>
          )}
        </CardActions>
      </Card>
    </Grid>
  ) : (
    ''
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

function DirectoryPage() {
  const router = useRouter()

  const [APIurl, setAPIurl] = useState('https://app.digitaldeets.com')
  const [category, setCategory] = useState('')
  const [availableCategories, setAvailableCategories] = useState([])
  const [queryParams, setQueryParams] = useState('')
  const [displayedListings, setDisplayedListings] = useState([])
  const [limit, setLimit] = useState(21)
  const [org, setOrg] = useState('')

  const [searchTerm, setSearchTerm] = useState(null)
  const [paginatorCount, setPaginatorCount] = useState(0)
  const [page, setPage] = React.useState(1)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [open, setOpen] = React.useState(false)
  const theme = useTheme()

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const makeQueryParamString = (params) => {
    return Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&')
  }
  useEffect(() => {

    const API_url = (window.location.hostname == 'catalog.digitaldeets.com') ? 'https://app.digitaldeets.com' : 'http://digitaldeets.local'; 
    setAPIurl(API_url);
    
    async function fetchCategories() {
      const response = await fetch(
        API_url + '/api_catalog/categories'
      )
      const result = await response.json()
      const categories = result.categories
      categories.unshift('All Categories')
      setAvailableCategories(categories)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if(availableCategories && availableCategories.length){
      const { orgID = '', categoryType = ''} = router.query

      setQueryParams(makeQueryParamString(router.query))

      if (orgID) {
        setOrg(orgID)
      }
      
      if (!orgID || categoryType) {
        handleCategories(categoryType)
      }
    }
  }, [availableCategories])

  const handleCategories = (categoryType) => {
    let match
    if (categoryType && availableCategories && availableCategories.length) {
      match = availableCategories.find((availableCategory) => {
          return (
            availableCategory.toLowerCase().replace(/\s/g, '') ==
            categoryType.toLowerCase().replace(/\s/g, '')
          )
      })
    }
    if (match) {
      setCategory(match)
    } else {
      setCategory('All Categories')
    }
  }

  useEffect(() => {
    if (org) {
       async function fetchListings() {
        const response = await fetch(
          `${APIurl}/api_catalog/organization/${org}`
        )
        const json = await response.json()
        if(json.response == 1){
          setDisplayedListings([json.organization])
          setPaginatorCount(1)

          if(!json.organization.use_catalog){
            setSelectedIndex(0)
            setOpen(true)
          }
        }
      }
      fetchListings()
      setOrg('')
    }
  }, [org])

  useEffect(() => {
    const { orgID } = router.query
    if (category.length && !orgID) {
      let search_string = searchTerm !== null ? searchTerm : ''

      async function fetchListings() {
        let apiQueryString = new URLSearchParams({
          category:
            category == 'All Categories' ? 'all_organizations' : category,
          search: search_string,
          page_limit: limit,
          page: page,
        }).toString()
        const response = await fetch(
          `${APIurl}/api_catalog/organizations?${apiQueryString}`
        )
        const json = await response.json()
        setDisplayedListings(json.organizations)
        setPaginatorCount(Math.ceil(json.total / limit))
      }
      fetchListings()
    }
  }, [category])

  useEffect(() => {
    if (searchTerm !== null) {
      const delayDebounceFn = setTimeout(() => {
        async function fetchListings() {
          let apiQueryString = new URLSearchParams({
            category:
              category == 'All Categories' ? 'all_organizations' : category,
            search: searchTerm,
            page_limit: limit,
            page: page,
          }).toString()
          const response = await fetch(
            `${APIurl}/api_catalog/organizations?${apiQueryString}`
          )
          const json = await response.json()
          setDisplayedListings(json.organizations)
          setPaginatorCount(Math.ceil(json.total / limit))
        }
          fetchListings()
      }, 1000)

      return () => clearTimeout(delayDebounceFn)
    }
  }, [searchTerm])

  const handleChange = (event) => {
    setPage(1)
    router.query.categoryType = event.target.value
    if (router.query.orgID) {
      router.query.orgID = ''
      if (org == searchTerm) {
        setSearchTerm('')
      }
    }
    router.push(router)
    setCategory(event.target.value)
  }
  const handleClose = (event) => {
    setOpen(false)
  }

  const handlePaging = async (event, value) => {
    if (!value) return
    setPage(value)
    
    let search_string = searchTerm !== null ? searchTerm : ''

    const apiQueryString = new URLSearchParams({
      category: category == 'All Categories' ? 'all_organizations' : category,
      search: search_string,
      page_limit: limit,
      page: value,
    }).toString()
    const response = await fetch(
      `${APIurl}/api_catalog/organizations?${apiQueryString}`
    )
    const json = await response.json()
    setDisplayedListings(json.organizations)
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  const setAnalyticsIdentify = (analytics_data, additional_data) => {
    if(additional_data.firstName){
      analytics_data.firstName = additional_data.firstName
    }
    
    if(additional_data.lastName){
      analytics_data.lastName = additional_data.lastName
    }

    analytics.identify(analytics_data)
  }

  const setAnalyticsTrack = (event, analytics_data, additional_data) => {
    
    if(additional_data.firstName){
      analytics_data.firstName = additional_data.firstName
    }
    
    if(additional_data.lastName){
      analytics_data.lastName = additional_data.lastName
    }

    analytics.track(event, analytics_data)
  }

  const handleListItemClick = (index) => {

    const { email = '', fName = '', lName = '' } = router.query

    if(email){
      let identify_data = {
        listing: displayedListings[index],
        email: email,
        LISTVIEW: true,
      }
  
      let analytics_data = {
        ...displayedListings[index],
        email: email,
        LISTVIEW: true,
      }

      let additional_data = {
        firstName: fName,
        lastName: lName
      }
      
      setAnalyticsIdentify(identify_data, additional_data)
      setAnalyticsTrack('Catalog listing clicked', analytics_data, additional_data)
    }
    setSelectedIndex(index)
    setOpen(true)
  }

  const handleSignUpClick = (index) => {

    const { email = '', fName = '', lName = '' } = router.query

    if(email){
      let identify_data = {
        listing: displayedListings[index],
        email: email,
        SIGNUP: true,
      }
  
      let analytics_data = {
        ...displayedListings[index],
        email: email,
        SIGNUP: true,
      }

      let additional_data = {
        firstName: fName,
        lastName: lName
      }

      setAnalyticsIdentify(identify_data, additional_data)
      setAnalyticsTrack('Catalog signup clicked', analytics_data, additional_data)
    }
  }

  const changeCatalogListingStatus = (index, catalog_listing_status) => {

    const { email = '', fName = '', lName = '' } = router.query
    const orgID = displayedListings[index].id
    
    fetch(APIurl + '/wp-content/themes/sdthm/sdexe/api_catalog.php?request=save_catalog_listing_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organization_id: orgID,
        catalog_listing_status: catalog_listing_status,
      })
    }).then(response => response.json())
      .then(data => {
        if(data.response == 1){

          let redirect_timeout = 10

          if(email){
            redirect_timeout = 500

            let identify_data = {
              listing: displayedListings[index],
              email: email
            }
        
            let analytics_data = {
              ...displayedListings[index],
              email: email
            }
      
            let additional_data = {
              firstName: fName,
              lastName: lName
            }

            let analytics_event = ''
            if(catalog_listing_status == 'approved'){
              analytics_event = 'Catalog Confirmed'
            }else if(catalog_listing_status == 'request_edits'){
              analytics_event = 'Edits Requested'
            }else if(catalog_listing_status == 'removed'){
              analytics_event = 'Closed Lost Future Opp'
            }

            setAnalyticsIdentify(identify_data, additional_data)
            setAnalyticsTrack(analytics_event, analytics_data, additional_data)
          }

          if(catalog_listing_status == 'approved'){
            handleClose()
            setOrg(orgID)

            if(!email){
              Swal.fire({
                html: data.message,
                icon:'success',
                timer: 2500,
                showConfirmButton: false
              }) 
            }else{
              Swal.fire({
                  html: data.question,
                  icon:'question',
                  showCancelButton: true,
                  showConfirmButton: true,
                  confirmButtonText: "Add it now",
                  confirmButtonColor: "#0D779B"
              }).then((result) => {
                if (result.isConfirmed) {
                  fetch(APIurl + '/wp-content/themes/sdthm/sdexe/api_catalog.php?request=redirect_catalog_listing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      organization_id: orgID,
                      email: email,
                      first_name: fName,
                      last_name: lName
                    })
                  }).then(response => response.json())
                    .then(data => {
                      if(data.response == 1){
                          window.location.href = data.redirect_url
                      }else{
                        Swal.fire({
                          html: data.message,
                          icon:'error',
                          showConfirmButton: true,
                          confirmButtonColor: "#0D779B"
                        }) 
                      }
                    }) 
                    .catch((error) => {
                      console.error(error)
                    })
                }
              }) 
            }            
          }else if(catalog_listing_status == 'request_edits'){           
            setTimeout(function(){
              window.location.href =  data.redirect_url;
            }, redirect_timeout)
          }else if(catalog_listing_status == 'removed'){
            setTimeout(function(){
              window.location.href = 'https://digitaldeets.com/not-now-thank-you/'
            }, redirect_timeout)
          } 
        }else{
          Swal.fire({
            html: data.message,
            icon:'error',
            showConfirmButton: true,
            confirmButtonColor: "#0D779B"
          }) 
        }
      }) 
      .catch((error) => {
        console.error(error)
      })
  }

  const handleSearch = (event) => {
    event.stopPropagation()
    const term = event.target.value
    setPage(1)
    setSearchTerm(term)
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
        style={{zIndex:1000}}
      >
        <IconButton
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          className="flex self-end m-2"
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
            <Typography sx={{ mt: 2 }}>
              {displayedListings[selectedIndex]?.description}
            </Typography>
            <div className="flex justify-center my-2">
              <img
                src={displayedListings[selectedIndex]?.spotlight_photo}
                className="w-auto self-center"
              />
            </div>
            {displayedListings[selectedIndex]?.categories[0] && (
              <Typography sx={{ mt: 1 }}>
                <b>Category: </b>{' '}
                {displayedListings[selectedIndex]?.categories.join(', ')}
              </Typography>
            )}
            {displayedListings[selectedIndex]?.promocode && (
              <Typography sx={{ mt: 1 }}>
                <b>Deal/Offer: </b>{' '}
                {displayedListings[selectedIndex]?.promocode}<br />
                {displayedListings[selectedIndex]?.promocode_description}
              </Typography>
            )}
            <Typography sx={{ mt: 1 }}>
            {displayedListings[selectedIndex]?.website && (
                <a
                  href={displayedListings[selectedIndex]?.website}
                  target="_blank"
                >
                  <FaGlobe className="mr-3 inline-block" />
                </a>
            )}

            {displayedListings[selectedIndex]?.facebook && (
                <a
                  href={displayedListings[selectedIndex]?.facebook}
                  target="_blank"
                >
                  <FaFacebookF className="mr-3 inline-block" />
                </a>
            )}

            {displayedListings[selectedIndex]?.instagram && (
                <a
                  href={displayedListings[selectedIndex]?.instagram}
                  target="_blank"
                >
                  <GrInstagram className="mr-3 inline-block" />
                </a>
            )}
            {displayedListings[selectedIndex]?.twitter && (
                <a
                  href={displayedListings[selectedIndex]?.twitter}
                  target="_blank"
                >
                  <FaTwitter className="mr-3 inline-block" />
                </a>
            )}
            </Typography>

            {displayedListings[selectedIndex]?.phonenumber && (
               <Typography
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
                sx={{ mt: 1 }}
                className="flex items-center"
              >
                <FaEnvelope className="mr-2" />
                <a
                  href={`mailto:${displayedListings[selectedIndex]?.email}`}
                  target="_blank"
                >
                  {displayedListings[selectedIndex]?.email}
                </a>
              </Typography>
            )}
            {displayedListings[selectedIndex]?.streetaddress && (
              <Typography
                sx={{ mt: 1 }}
                className="flex items-center"
              >
                <FaSearchLocation className="mr-2" />
                {displayedListings[selectedIndex]?.streetaddress},{' '}
                {displayedListings[selectedIndex]?.city},{' '}
                {displayedListings[selectedIndex]?.state},{' '}
                {displayedListings[selectedIndex]?.zipcode}
              </Typography>
            )}
          </DialogContentText>
          {!displayedListings[selectedIndex]?.use_catalog && displayedListings[selectedIndex]?.catalog_listing_status != 'approve' ? (
              <div>
                <div>
                <Button className="self-end bg-orange text-white normal-case mt-2" sx={{ minWidth: 150 }} onClick={(event) => changeCatalogListingStatus(selectedIndex, 'approved')}>
                  Approve
                </Button>

                <Button className="self-end bg-orange text-white normal-case mt-2 float-right" sx={{ minWidth: 150 }} onClick={(event) => changeCatalogListingStatus(selectedIndex, 'request_edits')}>
                  Request edits
                </Button>
                </div>
                <div className="w-full flex justify-center text-blue mt-2 cursor-pointer" onClick={(event) => changeCatalogListingStatus(selectedIndex, 'removed')}><span>Remove my catalog listing</span></div>
              </div>
          ) : (
          <div className="flex items-end">
            {displayedListings[selectedIndex]?.status != 'complete' ? (
              <a
                onClick={(event) => handleSignUpClick(selectedIndex)}
                className="w-full flex justify-end"
                href={`https://community.digitaldeets.com/onboarding/${displayedListings[selectedIndex]?.id}?${queryParams}`}
              >
                <Button className="w-full self-end bg-orange text-white normal-case mt-2">
                  Sign Up My Organization
                </Button>
              </a>
            ) : (
              <a
                onClick={(event) => handleSignUpClick(selectedIndex)}
                className="w-full flex justify-end text-blue"
                href={`https://community.digitaldeets.com/onboarding/${displayedListings[selectedIndex]?.id}?${queryParams}`}
              >
                Join this Organization
              </a>
            )}
          </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="flex lg:flex-row flex-col mt-32 xl:mt-0 text-grey">
        <Box className="mb-4" sx={{ flex: 2 }}>
          <Grid
            sx={{
              backgroundColor: '#02779d',
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: '20px',
              paddingBottom: '10px',
            }}
          >
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
              href="https://zfrmz.com/FsmjxMy4ow0X1XG0S0X5"
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
            className="pl-1 pr-1"
          >
            {displayedListings.map((listing, index) => {
              return (
                <ListingComponent
                  key={index}
                  listing={listing}
                  index={index}
                  first_block={true}
                  queryParams={queryParams}
                  handleListItemClick={handleListItemClick}
                  handleSignUpClick={handleSignUpClick}
                  changeCatalogListingStatus={changeCatalogListingStatus}
                />
              )
            })}
            <div id="digitaldeets_promotions_widget"></div>
            {displayedListings.map((listing, index) => {
              return (
                <ListingComponent
                  key={index}
                  listing={listing}
                  index={index}
                  first_block={false}
                  queryParams={queryParams}
                  handleListItemClick={handleListItemClick}
                  handleSignUpClick={handleSignUpClick}
                  changeCatalogListingStatus={changeCatalogListingStatus}
                />
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
          className="mt-4 mb-4"
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
      <Script id="show-digitaldeets_promotions_widget">
        {`
        if (!window.DigitalDeets) window.DigitalDeets = {};
        DigitalDeets.promotionsLimit = 3;
        setTimeout(function(){ 
          if(!document.getElementById('digitaldeets_promotions_widget').childNodes.length){
            DigitalDeets.loadPromotionsWidget();
          }
         }, 3000)
        `}
      </Script>
      <Script src="https://api.digitaldeets.com/dd_widget/promotions.js" />
    </>
  )
}

export default DirectoryPage
