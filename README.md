# express-app-template
Use this template as a starting point for new express apps

## How to use
### create a repo on github with this template and add to local machine
```
git clone git@github.com:fermionnms/new-repo.git
cd new-repo
cp .env.example .env
cp config/serviceAPIKeysExample.js config/serviceAPIKeys.js
npm init
```


### update package.json
```
{
  "name": "stubber-core-ivan",
  "version": "1.0.0",
  "description": "Use this template as a starting point for new express apps",
  "main": "core.js",
  "directories": {
    "lib": "lib"
  },
  "scripts": {
    "test": "NODE_ENV=test nodemon --exec 'mocha || exit 1'",
    "local": "nodemon --ignore logs core.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ivanjenny/stubber-core-ivan.git"
  },
  "author": "Ivan Johannes",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ivanjenny/stubber-core-ivan/issues"
  },
  "homepage": "https://github.com/ivanjenny/stubber-core-ivan#readme",
  "dependencies": {}
}

```

### install base dependencies
```
npm i dotenv lodash mongoose uuid winston express
npm i --save-dev mocha chai mongodb-memory-server chai-http
```

### start app
```
npm run local
```

### test app
```
npm run test
```

http://localhost:1234/api/v1/test
