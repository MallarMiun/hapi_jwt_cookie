# API-dokumentation - DT193G Fullstacksutveckling med ramverk

## Om dokumentationen

Detta är kursmaterial för kursen DT193G Fullstacksutveckling med ramverk vid Mittuniversitetet. Dokumentationen beskriver ett REST API byggt med Hapi.js-ramverket och implementerar autentisering med JWT (JSON Web Tokens) via HTTP-cookies.

## Innehållsförteckning

* [Översikt](#översikt)
* [Autentisering](#autentisering)
* [Endpoints](#endpoints)
  * [Products](#products)
  * [Users](#users)
  * [Autentisering](#autentisering-endpoints)
* [Felhantering](#felhantering)

## Översikt

Detta API hanterar produkter och användare med JWT-autentisering via HTTP-cookies.

## Autentisering

API:et använder JWT (JSON Web Tokens) för autentisering. Token lagras i en HTTP-only cookie efter inloggning.

### Autentiseringsflöde

1. Användaren loggar in via `/users/login`
2. Vid framgångsrik inloggning sätts en HTTP-only cookie med JWT
3. Denna cookie skickas automatiskt med varje efterföljande request
4. Vid utloggning via `/users/logout` raderas cookien

## Endpoints

### Products

#### `GET /products`

Hämtar alla produkter.

**Response:** `200 OK`

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number"
  }
]
```

#### `GET /products/{id}`

Hämtar en specifik produkt.

**Parameters:**

* `id`: Produktens ID

**Response:** `200 OK`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number"
}
```

#### `POST /products`

Skapar en ny produkt. Kräver autentisering.

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "price": "number"
}
```

**Response:** `201 Created`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number"
}
```

#### `PUT /products/{id}`

Uppdaterar en produkt. Kräver autentisering.

**Parameters:**

* `id`: Produktens ID

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "price": "number"
}
```

**Response:** `200 OK`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number"
}
```

#### `DELETE /products/{id}`

Raderar en produkt. Kräver autentisering.

**Parameters:**

* `id`: Produktens ID

**Response:** `204 No Content`

### Users

#### `GET /users`

Hämtar alla användare. Kräver autentisering.

**Response:** `200 OK`

```json
[
  {
    "id": "string",
    "username": "string",
    "email": "string"
  }
]
```

#### `GET /users/{id}`

Hämtar en specifik användare. Kräver autentisering.

**Parameters:**

* `id`: Användarens ID

**Response:** `200 OK`

```json
{
  "id": "string",
  "username": "string",
  "email": "string"
}
```

#### `POST /users`

Skapar en ny användare.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:** `201 Created`

```json
{
  "id": "string",
  "username": "string",
  "email": "string"
}
```

#### `PUT /users/{id}`

Uppdaterar en användare. Kräver autentisering.

**Parameters:**

* `id`: Användarens ID

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "id": "string",
  "username": "string",
  "email": "string"
}
```

#### `DELETE /users/{id}`

Raderar en användare. Kräver autentisering.

**Parameters:**

* `id`: Användarens ID

**Response:** `204 No Content`

### Autentisering Endpoints

#### `POST /users/login`

Loggar in en användare och sätter JWT cookie.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "message": "Successfully logged in"
}
```

#### `POST /users/logout`

Loggar ut användaren och raderar JWT cookie. Kräver autentisering.

**Response:** `200 OK`

```json
{
  "message": "Successfully logged out"
}
```

## Felhantering

API:et returnerar följande statuskoder:

* **400** Bad Request
  * När requestens format är ogiltigt
  * När valideringen misslyckas

* **401** Unauthorized
  * När JWT-token saknas
  * När JWT-token är ogiltig

* **403** Forbidden
  * När användaren saknar behörighet

* **404** Not Found
  * När efterfrågad resurs inte hittas

* **500** Internal Server Error
  * Vid oväntade serverfel