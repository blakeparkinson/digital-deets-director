export default async function handler(req, res) {
  // const response = await fetch("https://dittofi.com/409/iapi/v1/GetCategories")
  const json = {
    data: [
      { category: "" },
      { category: "AfterSchool-Academics" },
      { category: "AfterSchool-Athletics" },
      { category: "AfterSchool-TheArts" },
      { category: "Auto Sales/Repairs" },
      { category: "Dentist/Orthodontist" },
      { category: "Family Fun" },
      { category: "Kids/Teen Retail" },
      { category: "Lawyers" },
      { category: "Nonprofit" },
      { category: "Realtors" },
      { category: "Software" },
      { category: "Virtual Camp" },
      { category: "k-12 Public School" },
    ],
    message: "success",
    error: "",
  }
  json.data.forEach((categoryItem) => {
    if (categoryItem.category == "") {
      categoryItem.label = "All Categories"
    } else {
      categoryItem.label = categoryItem.category
    }
  })
  res.status(200).json(json)
}
