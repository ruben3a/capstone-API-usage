import express from "express";
import axios from "axios";

const port = 3000;
const app = express();

const APIurl = "https://api.mangadex.org";

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(APIurl + "/manga");
    console.log(response.data.result);
    console.log(response.data);
    res.send(response.data.data);
  } catch (error) {
    console.log(error.data.data);
  }
});

app.listen(port, () => {
  console.log("on");
});
