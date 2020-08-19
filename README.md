<h1 align="center">GymPoint API</h1>

<h2>About the project</h2>

The purpose of the application is to assist the Gympoint academy to manage student attendance, to have control over each student's enrollment and to provide
assistance so that everyone has the best experience possible.

<h2>Technologies</h2>

<strong>Main technologies</strong>: Node.js.

<strong>Server and database</strong>: Express, Sequelize, PostgreSQL, Docker.

<strong>Editing and development tools</strong>: Sucrase, Nodemon.

<strong>Authentication and validation tools</strong>: bcrypt, JWT, yup.

<strong>Date manipulation</strong>: date-fns.

<strong>Email handling</strong>: nodemailer and handlebars.

<strong>Queue handling</strong>: bee-queue and redis.

<h2>Settings</h2>

Install server dependencies

``` yarn install ```

Configure the PostgreSQL database.

With the docker, create a postgres container and run it on the port of your choice.

``` 
docker run --name gympoint-postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres 

docker run --name redisgympoint -p 6379:6379 -d -t redis:alpine
```

Create the database with the name gympoint. A program like Postbird can be used to manage databases through a graphical interface.

Make a copy of the .env.example file, rename it to .env and fill in the database environment variables.

Run the tables in the database with the sequelize:

```
yarn sequelize db:migrate
```

Run the Seeds to fill the tables with predefined data:

```
yarn sequelize db:seed:all
```

Run the application.

``` yarn dev ```
> Where the application runs

``` yarn queue ```
> Where the email queue runs
