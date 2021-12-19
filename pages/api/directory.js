// import data from '../../listings.json'
let listings

export default async function handler(req, res) {
  if (!listings) {
    //we dont have listings so we need to hit the db
    const [countResponse] = await Promise.all([
      fetch(
        `https://app.digitaldeets.com/api_catalog/organizations?page_limit=15000&page=0`
      ),
    ])
    // const dirResponseJson = await dirResponse.json()
    const countResponseJson = await countResponse.json()
    listings = countResponseJson
    // for (const i in listings.data) {
    //   if (
    //     listings.data[i].streetaddress &&
    //     listings.data[i].streetaddress.length &&
    //     listings.data[i].city &&
    //     listings.data[i].city.length &&
    //     listings.data[i].state &&
    //     listings.data[i].state.length
    //   ) {
    //     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${listings.data[i].streetaddress}&key=AIzaSyDwmj1y_jUUMEddwi4T0AydIoUKvb_Qz-8&city=${listings.data[i].city}&state=${listings.data[i].state}`

    //     const markerResponse = await fetch(url)
    //     const marker = await markerResponse.json()
    //     if (marker.results.length) {
    //       listings.data[i]["marker"] = marker.results[0].geometry.location
    //     }
    //   }

    //   // listing.marker = marker
    // }
    // dirResponseJson.count = countResponseJson.data.length
    res.status(200).json({ data: listings.organizations })
  } else {
    const results = filter(
      listings.organizations,
      req.query.SearchTermA,
      req.query.Categories
    )
    res.status(200).json({ data: results })
  }
}

const filter = (listings, searchTerm, category) => {
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
      (listing.state && listing.state.toLowerCase().includes(trimmed))
    ) {
      return true
    } else {
      return false
    }
  }
}
