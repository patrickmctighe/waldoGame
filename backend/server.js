import express from "express";
const router = express.Router();
const app = express();

// Place express.json() middleware before your route
app.use(express.json());

app.post("/api/validateSelection", (req, res) => {
  const { x, y, selectedCharacter } = req.body;
  const isCorrect = true; // Replace with your logic to check if the selection is correct

  if (isCorrect) {
    res.json({ msg: "Correct" });
  } else {
    res.json({ msg: "Incorrect" });
  }
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
