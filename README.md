# React Skeleton
This skeleton is designed to provide devs with a template to set up a React app with GraphQL easily and quickly

[https://react-skeleton-demo.herokuapp.com/](https://react-skeleton-demo.herokuapp.com/)

## Structures
```
app // React app
├── app.js.
├── apollo-client.js
├── /containers
│   └── /sample // a sample container
│       └── index.js
├── /components
|   └── /sample // a sample component
|       └── index.js
server // Express and GraphQL API
├── app.js
├── graphql.js
├── /schema // To store GraphQL schema
│   └── schema.graphql
└── /resolvers // To store Graphql Resolvers
```

## Commands
For develolopment purpose, a minimal express development server comes with the project. Below are the possible npm commands that a user can execute.
```
# npm install // Install all related javascript packages (Ex. react.js, express, webpack, etc)
# npm start // Run a server - to be used in production.
# npm run lint // Run ESLint on client/server Javascript files
# npm run build // Produce production-ready(minified) assets.
# npm run watch // Continuouly produce assets for development purpose whenever changes made.
# npm run nodemon // Run a development server for the project.
# npm run dev // Run both "npm run watch" and "npm run nodemon" together.
```

## License
MIT
