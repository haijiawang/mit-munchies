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

### API Routes

For the Alpha release, we have implemented User and Donation Request.
Note: Freet documentation has been kept to serve as a continuous reference while implementing other concepts, but is not used for any functionality and will be deleted before the final push. 

#### `GET /`

This renders the `index.html` file. 

## User ##

#### `POST /api/users/session` - Sign in user

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

#### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

#### `POST /api/users` - Create an new user account

**Body**

- `username` _{string}_ - The user's username
- `phone` _{string}_ - The user’s phone number
- `email` _{string}_ - The user’s email address for contact
- `locationcity` _{string}_ - The user’s city
- `locationstate` _{string}_ - The user’s state
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

#### `PUT /api/users` - Update a user's profile

**Body** _(no need to add fields that are not being changed)_

- `username` _{string}_ - The user's username
- `phone` _{string}_ - The user’s phone number
- `email` _{string}_ - The user’s email address for contact
- `locationcity` _{string}_ - The user’s city
- `locationstate` _{string}_ - The user’s state
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if username or password is in the wrong format
- `409` if the username is already in use

#### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in

## Donation Request ##

#### `GET /api/requests` - Get all the requests

**Returns**

- An array of all requests sorted by the start date of the accepting donations period

#### `GET /api/requests?author=USERNAME` - Get requests by requestor

**Returns**

- An array of requests posted by the user with username `author`

**Throws**

- `400` if `author` is not given
- `404` if `author` is not a recognized username of any user

#### `POST /api/requests/` - Create a new request

**Body**

- `contact` _{string}_ - the email or phone number specific to this request
- `description` _{string}_ - the types of clothing and amounts wanted

**Returns**

- A success message
- A object with the created request

**Throws**

- `403` if the user is not logged in
- `400` If the any of the required request content is empty

#### `DELETE /api/requests/:requestId?` - Delete an existing request

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `403` if the user is not the requestor
- `404` if the requestId is invalid

#### `PUT /api/requests/:requestId?` - Update an existing request

**Body**

- `contact` _{string}_ - the email or phone number specific to this request
- `description` _{string}_ - the types of clothing and amounts wanted

**Returns**

- A success message
- An object with the updated request

**Throws**

- `403` if the user is not logged in
- `404` if the requestId is invalid
- `403` if the user is not the requestor
- `400` if there are no update fields given filled (all empty)
