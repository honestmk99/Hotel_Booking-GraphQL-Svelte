# Hotel Manager - Backend

## Description

GraphQL API built with the [Nest](https://nestjs.com/) Typescript framework. Manages interaction with a local MongoDB instance useed to store information about hotels.

## Requirements

- Node v16
- npm
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

```bash
$ npm install
```

## Running the backend

Use the following command to build the Nest application.

```bash
$ npm run build
```

Then use the following command to start the local MongoDB instance and run the Nest application.

```bash
$ npm run start
```

Once the local MongoDB instance is running, use the following command to seed the database.

```bash
$ npm run db:seed
```

## Testing

After the database has been seeded, you should be able to access the GraphQL API at:

[http://localhost:5000/graphql](http://localhost:5000/graphql)

## Troubleshooting

If you run into any issues, please reach out to us over Slack or via [dean@roundrock.io](mailto:dean@roundrock.io)
