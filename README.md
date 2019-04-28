# Instagram image feed scraper Express REST API

Simple Express REST API for getting latest instagram images by username.

It will scrape images from public page of the user so no need to authenticate or use access tokens.

## Install

```sh
npm install
npm start
# or with nodemon
npm run dev
```

# Endpoints

## Get server health

`GET /api/health`

### Request

`curl localhost:5000/api/health`

### Response

HTTP Status Code: `204`

## Get user latest images

`GET /api/instagram/:username/images`

### Request

`curl localhost:5000/api/instagram/<your username>/images`

### Response

```
[
  {
    "src": "https://<url to the image>",
    "link": "url to instagram page of the image",
    "likes": 8,
    "comments": 0,
    "caption": "Content of the image",
    "thumbnails": [
      {
        "src": "https://<url to the thumbnail>",
        "config_width": 150,
        "config_height": 150
      },
      {
        "src": "https://<url to the thumbnail>",
        "config_width": 240,
        "config_height": 240
      },
      {
        "src": "https://<url to the thumbnail>",
        "config_width": 320,
        "config_height": 320
      },
      {
        "src": "https://<url to the thumbnail>",
        "config_width": 480,
        "config_height": 480
      },
      {
        "src": "https://<url to the thumbnail>",
        "config_width": 640,
        "config_height": 640
      }
    ]
  }
]
```

# Environment variables

Custom configuration with enviroment variables. dotenv .env files is supported.

| Variable  | Default | Description                    |
| --------- | ------- | ------------------------------ |
| PORT      | 5000    | Server port                    |
| CACHE_TTL | 100     | In memory cache ttl in seconds |
