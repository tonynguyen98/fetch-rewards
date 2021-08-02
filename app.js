const express = require("express");
const cors = require("cors");

const port = 3000;
const app = express();

const pingRoute = require("./routes/ping.routes");
const rewardsRoute = require("./routes/rewards.routes");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(cors());

app.use(pingRoute);
app.use(rewardsRoute);

app.listen(port, () => {
  console.log(`Fetch Rewards Coding Exercise http://localhost:${port}`);
});
