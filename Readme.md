# Users-test API

**Running a project with docker-compose:**

```
git clone https://github.com/DenisLokhtin/Books-test.git

cd Users_test/

docker-compose-up
```

- This will start building the application via docker-compose.
- After building the docker images, the lifting of the application will start.
- Migration will run.
- Seeds will run.
- After a successful build and run, the application will be available on localhost 8071 port.

***

**Endpoints:**

The application has several endpoints:

```
GET /users
GET /users/:id
GET /users/:id/friends
POST /users
PUT /users/:id
DELETE /users/:id

GET /friends
POST /friends
DELETE /books/:id
```

***

- **GET /users**

Returns a list of all user objects:

```
[
    {
        "id": 1,
        "firstName": "Wyoming",
        "gender": "male"
    },
]
```

- **GET /users/:id**

Returns the user object:

```
{
    "id": 3,
    "firstName": "Stone",
    "gender": "male"
}
```

- **GET /users/:id/friends?order_type=asc**

Returns a user object with its subscriptions:

```
{
    "user": {
        "id": 194,
        "firstName": "Nerea",
        "gender": "female"
    },
    "subscriptions": [
        {
            "id": 1,
            "firstName": "Wyoming",
            "gender": "male"
        },
        {
            "id": 2,
            "firstName": "len",
            "gender": "female"
        },
    ]
}
```

***

- **GET /friends**

Returns a list of objects for all subscriptions:

```
[
     {
        "id": 1,
        "userId": 200
        "friendId": 1
    },
    {
        "id": 2,
        "userId": 199
        "friendId": 2
    },
]
```

***

- **POST /users**

Request body:

```
{
"firstName": string
"gender": string
}
```

- **POST /friends**

Request body:

```
{
"userId": number,
"friendId": number,
}
```

***

- **PUT /users**

Request body:

```
{
"firstName": string
"gender": string
}
```

***

- **DELETE /:id**

***