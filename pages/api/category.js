export default async function handler(req, res) {
  const response = await fetch(
    'https://app.digitaldeets.com/api_catalog/categories'
  )
  const data = await response.json()
  console.log('dc: ', data.categories)
  res.status(200).json({ data: data.categories })
}
