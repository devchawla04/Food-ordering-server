const express = require("express");
const cors = require("cors");
const fetch = require("cross-fetch");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

// For Restaurant API
app.get("/api/restaurants", async (req, res) => {
  try {
    const { lat, lng, page_type, collection } = req.query;
    console.log(req.query);

    const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&collection=${collection}&page_type=${page_type}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).send("An error occurred while fetching restaurant data.");
  }
});

app.get("/api/menu", async (req, res) => {
    let {
      "page-type": page_type,
      "complete-menu": complete_menu,
      lat,
      lng,
      submitAction,
      restaurantId,
      catalog_qa,
      query,
    } = req.query;
  
    console.log(req.query);
  
    // Remove 'undefined' or empty parameters
    const queryParams = new URLSearchParams();
    if (page_type) queryParams.append("page-type", page_type);
    if (complete_menu) queryParams.append("complete-menu", complete_menu);
    if (lat) queryParams.append("lat", lat);
    if (lng) queryParams.append("lng", lng);
    if (restaurantId) queryParams.append("restaurantId", restaurantId);
    if (query) queryParams.append("query", query);
    if (submitAction) queryParams.append("submitAction", submitAction);
  
    // Only append catalog_qa if it is not 'undefined'
    if (catalog_qa && catalog_qa !== "undefined") {
      queryParams.append("catalog_qa", catalog_qa);
    }
  
    const url = `https://www.swiggy.com/dapi/menu/pl?${queryParams.toString()}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log(data);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  });
  

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
