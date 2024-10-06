# Tagit

This is a tool for viewing and easily reducing the amount of un-labeled emails in your gmail account.

## Installation

To serve the app locally, you first need to setup a corresponding app Google Cloud app and setup oauth2.
Once that is done:

- Install dependencies

``` shell
npm install
```

- Start the backend

``` shell
ts-node src/gmailapi/server.ts
```

- Start the frontend

``` shell
npm run dev
```

The app is then accessible by navigating to `http://localhost:5173` on any browser.

## License
This project is licensed under the [[file:LICENSE][MIT License]]
