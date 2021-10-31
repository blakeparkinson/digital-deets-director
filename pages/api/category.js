export default async function handler(req, res) {
  const response = await fetch("https://dittofi.com/409/iapi/v1/GetCategories")
  const json = await response.json()
  json.data.forEach((categoryItem) => {
    if (categoryItem.category == "") {
      categoryItem.label = "All Categories"
    } else {
      categoryItem.label = categoryItem.category
    }
  })
  res.status(200).json(json)
}
