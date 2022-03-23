# tcc-blockchain
## Installation

Use the package manager [npm](https://www.npmjs.com/) to install all dependencies.

```bash
npm install
```
You gotta use the above command in each of the 3 folders in this repository (cc, ledger and api).

## Setup

First you gotta create a .env file at the root of /api and set the variables values.

```javascript
MONGO_URI =
TOKEN_KEY =
SECRET_KEY =
SECRET_IV =
```
TOKEN_KEY is used to generate a JWT.
SECRET_KEY and SECRET_IV are used to cipher the file content.

## Routes

All routes, by default, are served at localhost port 8080.

### Post

-   localhost:8080/register -> This route will let you register yourself by passing an email and password.

```bash
{
    "email": "valid@email.com",
    "password":"1234"
}
```

-   localhost:8080/login -> This route will let you login if your email and password are valid, and create a JWT that will be used later on for authentication purposes.

```bash
{
    "email": "valid@email.com",
    "password":"1234"
}
```

-   localhost:8080/file -> This route will let you register an encrypted file into DB by passing the file path and the fileName.

```bash
#Header required for authentication
{
    "x-access-token": "JWT"
}
```

```bash
{
    "fileName": "test.txt",
    "owner": "Pedro Henrique"
}
```

### Get

- localhost:8080/file/${fileName} -> This route will let you get the file content by passing the fileName.

```bash
#Header required for authentication
{
    "x-access-token": "JWT"
}
```
- localhost:8080/file -> This route will let you get all the assets from the blockchain.

```bash
#Header required for authentication
{
    "x-access-token": "JWT"
}
```

- localhost:8080/file/filtered/${fileName} -> This route will let you filter the transactional history by the file name.

```bash
#Header required for authentication
{
    "x-access-token": "JWT"
}
```

### Put

- localhost:8080/file/${mongoId} -> This route will let you update a file by its id.

```bash
#Header required for authentication
{
    "x-access-token": "JWT"
}
```
```bash
{
    "fileName": "test.txt"
}
```
