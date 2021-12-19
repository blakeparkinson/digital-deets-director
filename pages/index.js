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
import { FaPhone, FaSearchLocation } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export async function getServerSideProps() {
  const response = await fetch(`${process.env.API_URL}/api/category`)
  const availableCategories = await response.json()
  // Pass data to the page via props
  return { props: {} }
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
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
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
        placeholder="Find my listing"
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

function DirectoryPage({ availableCategories }) {
  const router = useRouter()
  const { categoryType } = router.query
  const match = availableCategories.find((availableCategory) => {
    if (categoryType) {
      return (
        availableCategory.toLowerCase().replace(/\s/g, '') ==
        categoryType.toLowerCase().replace(/\s/g, '')
      )
    }
  })
  const [category, setCategory] = useState(match ? match : '')
  // const [availableCategories, setAvailableCategories] = useState([])
  const [listings, setListings] = useState([])
  const [displayedListings, setDisplayedListings] = useState([])
  const [limit, setLimit] = useState(20)
  const [offset, setOffset] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [paginatorCount, setPaginatorCount] = useState(0)
  const [page, setPage] = React.useState(1)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [open, setOpen] = React.useState(false)
  const [seeMoreActive, setSeeMoreActive] = React.useState(true)
  const theme = useTheme()

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    async function fetchListings() {
      const queryString = new URLSearchParams({
        Categories: category,
        SearchTermA: searchTerm,
      }).toString()
      const response = await fetch(`/api/directory?${queryString}`)
      const json = await response.json()
      setListings(json.data)
      setDisplayedListings(json.data.slice(offset, limit))
      setPaginatorCount(Math.ceil(json.data.length / limit))
    }
    fetchListings()
  }, [category, searchTerm])

  const handleChange = (event) => {
    setOffset(0)
    setPage(1)
    setCategory(event.target.value)
  }
  const handleClose = (event) => {
    setOpen(false)
  }

  const handlePaging = (event, value) => {
    if (!value) return
    setPage(value)
    setOffset((value - 1) * limit)
    const first = (value - 1) * limit
    const second = (value - 1) * limit + limit

    setDisplayedListings(listings.slice(first, second))
  }

  const handleListItemClick = (event, index) => {
    analytics.track('Catalog Item Clicked', {
      listing: displayedListings[index],
    })
    setSelectedIndex(index)
    setOpen(true)
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
        <DialogTitle id="responsive-dialog-title">
          {listings[selectedIndex]?.businessname}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {listings[selectedIndex]?.description}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              <b>Category: </b> {listings[selectedIndex]?.category}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              <b>Website: </b>{' '}
              <a href={listings[selectedIndex]?.website} className="text-blue">
                {listings[selectedIndex]?.website}
              </a>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              <b>Facebook: </b>{' '}
              <a href={listings[selectedIndex]?.facebookpage}>
                {listings[selectedIndex]?.facebookpage}
              </a>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              <b>Telephone: </b>{' '}
              {formatPhoneNumber(listings[selectedIndex]?.phonenumber)}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              <b>Address: </b> {listings[selectedIndex]?.streetaddress}
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <div className="flex lg:flex-row flex-col mt-20 xl:mt-0 text-grey">
        <Box sx={{ flex: 2 }}>
          <Grid
            container
            rowSpacing={1}
            sx={{
              backgroundColor: '#02779d',
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: '20px',
              paddingBottom: '10px',
            }}
            columnSpacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Grid item sx={{ display: 'flex' }}>
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
            </Grid>
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
            Can't find your listing? Submit it{' '}
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
                      image={`https://dittofi.com/409/iapi/v1/PromoImage/${listing.id}/`}
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="line-clamp-5 overflow-hidden h-[150px]"
                      >
                        {listing.description
                          ? listing.description
                          : DEFAULT_DESC}
                      </Typography>
                      <Text
                        level="xs"
                        weight="normal"
                        className="mt-2 flex text-grey items-center"
                      >
                        <FaPhone className="mr-2 text-blue" />
                        {formatPhoneNumber(listing.phonenumber)}
                      </Text>
                      {listing.streetaddress && (
                        <Text
                          level="xs"
                          weight="normal"
                          className="mt-2 flex text-grey"
                        >
                          <FaSearchLocation className="mr-2 text-blue" />
                          {`${listing.streetaddress}, ${listing.city}, ${listing.state}`}
                        </Text>
                      )}
                    </CardContent>
                    <CardActions className="flex flex-col">
                      <div className="flex w-full justify-end mr-2">
                        <Text
                          level="s"
                          weight="normal"
                          className="mt-2 text-blue text-end"
                        >
                          View full listing
                        </Text>
                      </div>
                      <a
                        className="w-full"
                        href={`https://community.digitaldeets.com/home?communityId=${listing.id}`}
                      >
                        <Button className="w-full self-end bg-orange text-white normal-case">
                          Sign Up My Organization
                        </Button>
                      </a>
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
