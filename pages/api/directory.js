let listings

export default async function handler(req, res) {
  if (!listings) {
    //we dont have listings so we need to hit the db
    const queryString = new URLSearchParams(req.query).toString()
    const [countResponse] = await Promise.all([
      // fetch(`https://dittofi.com/409/iapi/v1/SearchDirectory2?${queryString}`),
      fetch(`https://dittofi.com:/409/iapi/v1/DirectoryCount?`),
    ])
    // const dirResponseJson = await dirResponse.json()
    const countResponseJson = await countResponse.json()
    listings = countResponseJson
    // dirResponseJson.count = countResponseJson.data.length
    res.status(200).json(listings)
  } else {
    const results = filter(
      listings.data,
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
        if (listings[i].category === category) {
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
