import express from "express";
import axios from "axios";

const port = 3000;
const app = express();

const APIurl = "https://api.mangadex.org";

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(APIurl + "/manga/random");
    // console.log(response.data.data);
    const mangaID = response.data.data.id;
    const mangaTitle = response.data.data.attributes.title.en;
    const mangaDescription = response.data.data.attributes.description.en;
    const rel = response.data.data.relationships;
    // console.log(rel);
    const coverArt = rel.find((coverArt) => coverArt.type === "cover_art");
    const coverArtID = coverArt.id;
    const CoverFileName = await GetCoverFileName(coverArtID);
    const firstChapter = await GetFirstChaptert(mangaID);
    const coverArtUrl =
      "https://uploads.mangadex.org/covers/" +
      mangaID +
      "/" +
      CoverFileName +
      ".512.jpg";
    res.render("index.ejs", {
      cover: coverArtUrl,
      title: mangaTitle,
      description: mangaDescription,
    });
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

async function GetFirstChaptert(mangaID) {
  try {
    const result = await axios.get(`${APIurl}/manga/${mangaID}/feed`);
    const output = result.data.data[0];
    const FirstChapterData = await axios.get(`${APIurl}/chapter/${output.id}`);
    console.log(FirstChapterData.data.data.attributes.chapter);
    return FirstChapterData.data;
  } catch (error) {
    console.log(error);
  }
}

app.listen(port, () => {
  console.log("on");
});
