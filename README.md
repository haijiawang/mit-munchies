# Re-Thrift
Welcome to Re-Thrift's codebase! The below will document any relevant information about Re-Thrift's backend/frontend code. 

Re-Thrift aims to increase sustainable consumption by matching need and supply. Oftentimes, people are reluctant to thrift or shop second-hand at major thrift stores such as Goodwill or Buffalog Exchange because they have no idea what they might find. In some cases, they might be looking for a specific item that they do not know exists. Re-Thrift also makes hosting thrift pop-ups easier, as organizers can directly request for items from users. Organizers can set up events with requests for certain items and quantities. Donors can see what items they have to donate and respond to organizers who need donated items. In this way, we are hoping thrifting can become a more decentralized process that is more tailored to local experiences of communities. 

## Running locally

Running locally requires a few extra npm scripts from `package.json` in comparison to A5.
1. Run `npm run serve`, which compiles the frontend for hot-reloading with webpack and serves it at port `8080`.
2. Open a new terminal (with the original one still open) and run `npm run dev` to start the backend at port `3000`.
3. To view your website, **connect to [localhost:8080](http://localhost:8080)** (instead of port 3000) since the backend will no longer serve any HTML files.

## Deployed Site

Our official site is deployed [here](https://re-thrift-dyld.vercel.app/#/)
