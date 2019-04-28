require('dotenv').config();

const fetch = require('node-fetch');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL || 100 });
const app = express();

app.enable('trust proxy');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(router);

router.get('/api/health', (req, res) => res.sendStatus(200));

router.get('/api/:username/images', (req, res) => {
  const username = req.params.username;
  const cachedImages = cache.get(username);
  if (cachedImages) {
    res.send(cachedImages);
  } else {
    getImages(req.params.username)
      .then(images => {
        cache.set(username, images);
        res.send(images);
      })
      .catch(e => {
        console.log('ERROR: Unable get images.', e);
        res.status(500).send({ error: e.message });
      });
  }
});

async function getImages(username) {
  const data = await fetch(`https://www.instagram.com/${username}/`);
  const source = await data.text();
  const jsonObject = source
    .match(
      /<script type="text\/javascript">window\._sharedData = (.*)<\/script>/
    )[1]
    .slice(0, -1);

  const userInfo = JSON.parse(jsonObject);

  const feed =
    userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media
      .edges;

  const images = feed
    .filter(e => e.node.__typename === 'GraphImage')
    .map(e => {
      const {
        display_url,
        shortcode,
        edge_media_preview_like,
        edge_media_to_comment,
        accessibility_caption,
        thumbnail_resources
      } = e.node;

      return {
        src: display_url,
        link: `https://www.instagram.com/p/${shortcode}/`,
        likes: edge_media_preview_like.count,
        comments: edge_media_to_comment.count,
        caption: accessibility_caption,
        thumbnails: thumbnail_resources
      };
    });

  return images;
}

module.exports = app;
