export default async function handler(req, res) {
  // const response = await fetch("https://dittofi.com/409/iapi/v1/GetCategories")
  const json = {
    data: [
      { category: "", label: "All Categories" },
      { category: "AfterSchool-Academics", label: "After School-Academics" },
      { category: "AfterSchool-Athletics", label: "After School-Athletics" },
      { category: "AfterSchool-TheArts", label: "After School-TheArts" },
      { category: "Auto Sales/Repairs", label: "Auto Sales/Repairs" },
      { category: "Dentist/Orthodontist", label: "Dentist/Orthodontist" },
      { category: "Family Fun", label: "Family Fun" },
      { category: "Kids/Teen Retail", label: "Kids/Teen Retail" },
      { category: "Lawyers", label: "Lawyers" },
      { category: "Nonprofit", label: "Nonprofit" },
      { category: "Realtors", label: "Realtors" },
      { category: "Software", label: "Software" },
      { category: "Virtual Camp", label: "Virtual Camp" },
      { category: "k-12 Public School", label: "K-12 Public School" },
    ],
    message: "success",
    error: "",
  }
  res.status(200).json(json)
}
