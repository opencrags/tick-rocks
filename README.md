# Tick Rocks
Open source bouldering and sport climbing website built on top of the open
climbing database [opencrags](https://github.com/opencrags/opencrags-rest-api).

## Development

```bash
nvm use
npm ci
```

Run backend separately using `docker-compose`:
```bash
docker-compose up
```

And then run the start script in another terminal:
```
nvm use
npm start
```
