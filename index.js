import express from "express";
import axios from "axios";

const port = 3000;
const app = express();

const APIurl = "https://api.mangadex.org";

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(APIurl + "/manga/random");
    // console.log(response.data);
    const mangaID = response.data.data.id;
    const rel = response.data.data.relationships;
    // console.log(rel);
    const coverArt = rel.find((coverArt) => coverArt.type === "cover_art");
    const coverArtID = coverArt.id;
    const CoverFileName = await GetCoverFileName(coverArtID);
    const coverArtUrl =
      "https://uploads.mangadex.org/covers/" +
      mangaID +
      "/" +
      CoverFileName +
      ".512.jpg";
    res.render("index.ejs", { cover: coverArtUrl });
  } catch (error) {
    console.log(error.data);
  }
});

async function GetCoverFileName(coverArtID) {
  try {
    const result = await axios.get(APIurl + "/cover/" + coverArtID);
    const CoverFileName = result.data.data.attributes.fileName;
    return CoverFileName;
  } catch (error) {
    console.log(error.message);
  }
}

app.listen(port, () => {
  console.log("on");
});
