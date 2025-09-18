# BGG Script

A Node.js app for fetching and visualizing BoardGameGeek (BGG) collection and play data. It proxies requests to the BGG XML API and provides a web interface for stats and graphs.

## Features
- Fetches your BGG collection and play data
- Visualizes stats using interactive charts
- Proxies BGG API requests through a Node.js backend
- Docker support for easy deployment

## Prerequisites
- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)
- (Optional) [Docker](https://www.docker.com/) for containerized deployment

## Running Locally
1. **Install dependencies:**
   ```bash
   npm ci
   ```
2. **Build the frontend bundle:**
   ```bash
   npm run build
   ```
3. **Start the server:**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:5000](http://localhost:5000) by default.

## Configuration
- The server port can be set via the `PORT` environment variable (defaults to 5000).

## Docker Usage

### Build the Docker image
```bash
docker build -t bgg-stats .
```

### Run the Docker container
```bash
docker run -p 5000:5000 bgg-stats
```
The app will be available at [http://localhost:5000](http://localhost:5000).

### To Save the docker container to an importable file
docker save -o bgg-stats.tar bgg-stats

## Development
- To watch and rebuild the frontend bundle on changes:
  ```bash
  npm run build:w
  ```

## License
MIT