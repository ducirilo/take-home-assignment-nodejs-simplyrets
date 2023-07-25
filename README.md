# ITypescript + NodeJS :rocket:

## Prerequisites

You'll need to install [NodeJS >= 18 on your machine](https://nodejs.org/pt-br/download).

Alternatively, you may want to use somne sort of version manager for NodeJS, such as [NVM](https://github.com/nvm-sh/nvm),
to quickly switch your NodeJS instalation to the proper version.

You will also need [Yarn](https://classic.yarnpkg.com/en/docs/getting-started) as package manager installed.

## Getting Started

To get started, navigate to the directory on your machine and install the NodeJS modules (with yarn :raised_hands:):

```sh
yarn install
```

Then, start up the API by running the following command:

```sh
yarn start
```

This will:

* Build the api files :white_check_mark:
* Populate the database with seed data :seedling:
* Start up the API


## Design Decisions

*1. TypeScript for Enhanced Code Reliability and Readability:*
> TypeScript was chosen to enhance the application's reliability by preventing errors related to incorrect data types used across modules. Its static typing checking helps identify potential issues ahead of time. Furthermore, TypeScript improves code readability by facilitating the understanding of expected parameters and outputs, leading to easier maintenance and development.

*2. Data Input Validation with express-validator:*
> To ensure data integrity in endpoints, data input validation is implemented as a middleware using the express-validator library. This tool enables defining validation rules on a per-route basis, catering to specific data validity requirements for each endpoint. The custom middleware `src/middlewares/DataInputValidatorMiddleware.ts` efficiently captures and validates the data, allowing seamless continuation of processing or blocking erroneous requests.

*3. Simplified Data Handling with TypeORM:*
> The application relies on TypeORM, an Object Relational Mapping (ORM) framework, for seamless integration with the relational database. By abstracting the database manipulation as programmatic functions closer to the programming language, TypeORM accelerates development and eases maintenance tasks, streamlining data handling.

*4. Error Handling with Custom Error Types:*
> The API's error handling is based on custom error types located in the `src/common/errors` folder. Each error implements the default `Error` interface, extending it to provide specific details for each error type/nature. Utilizing a common interface enables a standardized error handler function in `src/app.ts``, which ensures consistent and formatted error responses.

*5. Environment Variables and Configuration:*
> The inclusion of a `.env` file in the application's root directory streamlines the management of environment-specific variables during deployment or execution. The `dotenv` library is incorporated as a dependency to  extract environment variables from the `.env` file, simplifying configuration.

*6. Comprehensive Testing with End-to-End Test Cases:*
> Test cases located at `src/routes/__tests__`` provide comprehensive end-to-end testing of each endpoint's functionality. Designed to cover both the happy path scenarios (valid input data and filters) and error cases (invalid or missing parameters, non-existent IDs, etc.), these tests ensure the reliability of the application. Instead of mocking data, the test cases are using an in-memory pre-seeded database for each test run, avoiding that test data polutes the actual dev database and making the tests simple to implement.

*7. Code Quality Enforcement with ESLint:*
> ESLint support is integrated into the project to enforce consistent code formatting and adherence to coding standards. By maintaining clean and standardized code, ESLint enhances readability, simplifies maintenance, and promotes collaboration among developers.


## Playing with the API

To play around with the API, after building your environment, the following endpoints are available:

- *POST /properties*
```sh
curl --location 'http://localhost:3000/properties' \
--header 'Content-Type: application/json' \
--data '{
    "address": "74434 East Sweet Bottom Br #18393",
    "price": 20714261,
    "bedrooms": 0,
    "bathrooms": 0,
    "type": "Test"
}'
```

- *GET /properties*
```sh
curl --location 'http://localhost:3000/properties?page=1&pageSize=15&bedrooms=6&bathrooms=2&type=Condominium'
```

- *GET /properties/:id*
```sh
curl --location 'http://localhost:3000/properties/1'
```

- *PUT /properties/:id*
```sh
curl --location --request PUT 'http://localhost:3000/properties/126' \
--header 'Content-Type: application/json' \
--data '{
    "address": "74434 East Sweet Bottom Br #18393",
    "price": 20714261,
    "bedrooms": 2,
    "bathrooms": 5,
    "type": "Apartment"
}'
```

- *DELETE /properties/:id*
```sh
curl --location --request DELETE 'http://localhost:3000/properties/126'
```

## Running Tests
Some tests have been included in this repository.  To run the tests, execute:

```sh
yarn test
```

## Resources

* [ExpressJS](https://expressjs.com/)
* [express-validator](https://express-validator.github.io/docs/)
* [TypeORM](https://typeorm.io/)

