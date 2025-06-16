# **Exercise-backend-advanced**

This repository contains the exercise for the module **"Desarrollo Backend Avanzado con Node.js"** from the KeepCoding bootcamp **"Desarrollo Web | Edición XVII"**.
The exercise statement is provided in the file **Práctica Web18 Baxkend Avanzado.pdf**.

## Installation info

Install dependencies with:

```sh
npm install
```

Copy environment variables example to .env:

```sh
cp .env.example .env
```

Review your new .env values to match your configuration.

On first deploy you can use the next command to initialize the database:

```sh
npm run initDB
```

Running Nodepop on localhost:3000:

```sh
npm run dev
```

## API

Base URL: http://localhost:3000/api

### Product list

GET /api/products

```json
{
  "results": [
    {
      "_id": "67ebfc3328328dd1142b53dd",
      "name": "Bosch drill machine",
      "owner": "67ebfc3328328dd1142b53d6",
      "price": 150,
      "image": "https://m.media-amazon.com/images/I/61T3Nj83OuL.jpg",
      "tags": ["work"],
      "__v": 0
    },
    {
      "_id": "684a20b5339153e7ca591e7b",
      "name": "xxx",
      "owner": "67ebfc3328328dd1142b53d6",
      "price": 900,
      "image": "1749688501769-cometa-kite-fone-bandite-xv-1640251374.jpeg",
      "tags": ["lifestyle"],
      "__v": 0
    }
  ]
}
```

TODO add more endpoints
