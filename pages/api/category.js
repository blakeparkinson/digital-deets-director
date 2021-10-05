
export default async function handler(req, res) {
    const response = await fetch('https://dittofi.com/409/iapi/v1/GetCategories')
    const json = await response.json()
    res.status(200).json(json)
  }
        