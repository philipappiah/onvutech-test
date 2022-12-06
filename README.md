

---

# MPEG-DASH SERVER

A Node.js server to generate and serve MPEG-DASH contents using [Express 4](http://expressjs.com/) and [MongoDB](https://www.mongodb.com/) using [Mongoose ODM](https://mongoosejs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```bash
npm install
npm start
```

Your app should now be running on [localhost:4000](http://localhost:4000/).

You can view the api docs via the endpoint http://localhost:4000/api-docs



## Running with Docker
Make sure you have [Docker](https://www.docker.com/) and [Docker-Compose](https://docs.docker.com/compose/) installed.
Docker version 20.10.10 or higher

```bash
docker-compose build
docker-compose up
```

Your app should now be running on [localhost:4000](http://localhost:4000/).

You can view the api docs via the endpoint http://localhost:4000/api-docs

## Testing
```bash
npm run test
```

## Sample test endpoint:
http://onvumediauploads.s3.eu-west-2.amazonaws.com/manifest.mpd
