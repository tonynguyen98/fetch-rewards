const express = require("express");
const HashMap = require("hashmap");

const router = express.Router();

let transactionHistory = [];
let payerTotalPoints = new HashMap();

router.post("/add_transaction", (req, res) => {
  let payer = req.body.payer;
  let points = req.body.points;
  let timestamp = req.body.timestamp;

  if (!payer || !points || !timestamp) {
    throw "Bad body.";
  }

  transactionHistory.push({ payer, points, timestamp });

  if (!payerTotalPoints.get(payer)) {
    payerTotalPoints.set(payer, points);
  } else {
    payerTotalPoints.set(payer, payerTotalPoints.get(payer) + points);
  }

  res.status(201);
  res.send("Added transaction.");
});

router.post("/spend", (req, res) => {
  let pointsToSpend = req.body.points;
  let redemptionHistory = new HashMap();

  if (!pointsToSpend) {
    throw "Bad body.";
  }

  let i = 0;

  transactionHistory.sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  // keep running until all points are spent
  while (pointsToSpend != 0) {
    // if added points is negative, restore points
    if (transactionHistory[i].points < 0) {
      pointsToSpend -= transactionHistory[i].points;

      if (!redemptionHistory.get(transactionHistory[i].payer)) {
        redemptionHistory.set(
          transactionHistory[i].payer,
          transactionHistory[i].points
        );
      } else {
        redemptionHistory.set(
          transactionHistory[i].payer,
          redemptionHistory.get(transactionHistory[i].payer) +
            transactionHistory[i].points
        );
      }

      payerTotalPoints.set(
        transactionHistory[i].payer,
        payerTotalPoints.get(transactionHistory[i].payer) +
          Math.abs(transactionHistory[i].points)
      );
    }
    //take points as usual otherwise
    else {
      // if history points is more than req amount, use the history pts
      if (transactionHistory[i].points > pointsToSpend) {
        transactionHistory[i].points -= pointsToSpend;

        if (!redemptionHistory.get(transactionHistory[i].payer)) {
          redemptionHistory.set(transactionHistory[i].payer, pointsToSpend);
        } else {
          redemptionHistory.set(
            transactionHistory[i].payer,
            redemptionHistory.get(transactionHistory[i].payer) - pointsToSpend
          );
        }

        payerTotalPoints.set(
          transactionHistory[i].payer,
          payerTotalPoints.get(transactionHistory[i].payer) - pointsToSpend
        );

        pointsToSpend = 0; //end the while loop
      }
      // if history pts is less than req amount, deduct req amount
      else {
        pointsToSpend -= transactionHistory[i].points;

        if (!redemptionHistory.get(transactionHistory[i].payer)) {
          redemptionHistory.set(
            transactionHistory[i].payer,
            transactionHistory[i].points
          );
        } else {
          redemptionHistory.set(
            transactionHistory[i].payer,
            redemptionHistory.get(transactionHistory[i].payer) -
              transactionHistory[i].points
          );
        }

        payerTotalPoints.set(
          transactionHistory[i].payer,
          payerTotalPoints.get(transactionHistory[i].payer) -
            transactionHistory[i].points
        );
      }
    }

    i++;
  }

  // temp array to format output
  let output = [];

  //format output
  redemptionHistory.forEach((value, key) => {
    output.push({ payer: key, points: -value });
  });

  res.contentType("application/json");
  res.status(200);
  res.send(JSON.stringify(output));
});

router.get("/balances", (_, res) => {
  //temp object to format output
  let output = {};

  //format output
  payerTotalPoints.forEach((value, key) => {
    output[key] = value;
  });

  res.status(200);
  res.send(output);
});

module.exports = router;
