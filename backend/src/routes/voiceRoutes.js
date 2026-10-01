import express from "express";

const router = express.Router();

const sendEmergencyTwiML = (req, res) => {
  const accidentTime =
    req.method === "GET"
      ? req.query.accidentTime || "6:30 PM"
      : req.body?.accidentTime || "6:30 PM";

  const hospitalName =
    req.method === "GET"
      ? req.query.hospitalName || "Amrita Hospital"
      : req.body?.hospitalName || "Amrita Hospital";

  res.type("text/xml");

  res.send(`
<Response>
  <Say>
    HEALTECH emergency alert.
    An accident was reported at ${accidentTime}.
    The patient is being taken to ${hospitalName}.
    Please check on the patient immediately.
  </Say>
</Response>
  `);
};

router.get("/emergency", sendEmergencyTwiML);
router.post("/emergency", sendEmergencyTwiML);

export default router;