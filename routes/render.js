const router = require("express").Router();
// const { renderToFile } = require("@react-pdf/renderer");
// const { default: MyDocument } = require("../MyDocument");

//

router.post("/", async (req, res) => {
  console.log(req.body);

  //   MyDocument(req.body);

  // await renderToFile(<MyDocument />, "./test.pdf");
});

module.exports = router;
