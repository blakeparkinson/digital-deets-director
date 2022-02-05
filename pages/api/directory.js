var cache = require('memory-cache')
import listings from '../../listings.json'

export default async function handler(req, res) {
  if (!cache.get('listings')) {
    // we dont have listings so we need to hit the db
    // const [countResponse] = await Promise.all([
    //   fetch(
    //     `https://app.digitaldeets.com/api_catalog/organizations?page_limit=15000&page=0`
    //   ),
    // ])
    // const countResponseJson = await countResponse.json()
    // console.log('crr: ', countResponseJson)
    const countResponseJson = {}
    countResponseJson['organizations'] = listings.data

    const withDescription = []
    const withoutDescription = []
    countResponseJson.organizations.forEach((org) => {
      if (org.description.length) {
        withDescription.push(org)
      } else {
        withoutDescription.push(org)
      }
    })
    countResponseJson.sortedOrganizations = [
      ...withDescription,
      ...withoutDescription,
    ]

    // cache.put('listings', countResponseJson, 5000)
    if (
      req.query.orgID &&
      req.query.orgID != 'undefined' &&
      req.query.orgID.length
    ) {
      const org = countResponseJson.sortedOrganizations.find(
        (listing) => listing.id == req.query.orgID
      )
      res.status(200).json({
        data: org ? [org] : [],
        count: 1,
      })
    } else {
      const results = filter(
        countResponseJson.sortedOrganizations,
        req.query.SearchTermA,
        req.query.Categories
      )

      res.status(200).json({
        data: results.slice(req.query.offset, parseInt(req.query.offset) + 20),
        count: results.length,
      })
    }
  } else {
    const listings = cache.get('listings')

    if (
      req.query.orgID &&
      req.query.orgID != 'undefined' &&
      req.query.orgID.length
    ) {
      const org = listings.find((listing) => {
        listing.id == req.query.orgID
      })
      res.status(200).json({
        data: org ? [org] : [],
        count: 1,
      })
    } else {
      const results = filter(
        listings.sortedOrganizations,
        req.query.SearchTermA,
        req.query.Categories
      )
      res.status(200).json({
        data: results.slice(req.query.offset, parseInt(req.query.offset) + 20),
        count: results.length,
      })
    }
  }
}

const filter = (listings, searchTerm, category) => {
  if (category == 'All Categories') {
    category = ''
  }
  const results = []
  for (let i = 0; i < listings.length; i++) {
    if (category && category.length) {
      if (isStringMatch(searchTerm, listings[i])) {
        if (listings[i].categories.includes(category)) {
          results.push(listings[i])
        }
      }
    } else {
      if (isStringMatch(searchTerm, listings[i])) {
        results.push(listings[i])
      }
    }
  }
  return results
}

const isStringMatch = (term, listing) => {
  if (!term || !term.length) {
    return true
  } else {
    const trimmed = term.trim().toLowerCase()
    if (
      (listing.businessname &&
        listing.businessname.toLowerCase().includes(trimmed)) ||
      (listing.description &&
        listing.description.toLowerCase().includes(trimmed)) ||
      (listing.city && listing.city.toLowerCase().includes(trimmed)) ||
      (listing.state && listing.state.toLowerCase().includes(trimmed)) ||
      (listing.zipcode && listing.zipcode.toLowerCase().includes(trimmed))
    ) {
      return true
    } else {
      return false
    }
  }
}
