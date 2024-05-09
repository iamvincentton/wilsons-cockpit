# Wilson - Cockpit

The technical test of Eleven Labs.

## 1 - Run the backend project

First, go to the `backend` directory:

```shell
cd backend
```

Then, launch a docker container:

```shell
docker-compose up -d
```

Using this command will directly install the dependencies and start the server.

Two containers will be created: one for the server (server-eleven-test) and one for the database (db-eleven-test).

The server listens on `http://localhost:4000/`

### Migrate and seed the database

To add pre-defined data to the database, go to the server-eleven-test container

```shell
docker exec -it server-eleven-test sh
```

Then, run the following commands:

```shell
npm run migrate
npm run seed
```

For the migrate command, you need to see: `Batch 1 run: 3 migrations`

For the seed command, you need to see: `Ran 1 seed files`

### Running Tests

For testing, we use Jest, Supertest, and ts-jest. To run the tests, execute the following command directly on the terminal:

```shell
npm run test
```

Make sure that your devDependencies include the following packages:

- jest
- supertest
- ts-jest


## 2 - Run the frontend project

First, go to the `frontend` directory:

```shell
cd frontend
```


Then, launch a docker container:

```shell
docker-compose up -d
```

Using this command will directly install the dependencies and start the server.

The vite server listens on `http://localhost:3000/`

### ViteJS template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
