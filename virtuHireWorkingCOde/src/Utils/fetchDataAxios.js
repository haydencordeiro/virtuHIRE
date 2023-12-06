const axios = require("axios");

const fetchData = () => {
  axios
    .get("https://aitalk.in:5000/json_data") // Replace with your actual Flask endpoint URL
    .then((response) => {
      const data = response.data;
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
