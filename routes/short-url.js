const express = require("express");
const dns = require("dns");
const router = express.Router();

const urlList = [];

router.post("/shorturl", (req, res) => {
  console.log(`short-url api`);
  console.log(`original URL ${req.body.url}`);
  console.log(`URL list `);
  console.log(urlList);

  const shortenURL = (originalURL) => {
    const url = new URL(originalURL);
    const saveToURLMap = (url) => {
      if (!urlList.includes(url)) {
        urlList.push(url);
        return urlList.length;
      } else {
        return urlList.indexOf(url) + 1;
      }
    };

    dns.lookup(url.host, (err, address, family) => {
      console.log("address: %j family: IPv%s", address, family);
      console.error(`Error is : `, err);
      if (err) {
        res.json({ error: `Invalid URL` });
      } else {
        const index = saveToURLMap(url.href);
        res.json({ original_url: url.href, short_url: index });
      }
    });
  };

  try {
    shortenURL(req.body.url);
  } catch (error) {
    console.error(`Error while shortening URL`, error);
    res.json({ error: `Invalid URL` });
  }
});

module.exports = router;
