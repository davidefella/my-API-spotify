# My Spotify Top 3 Artists

Current version: 1.0.0

## Overview

"My Spotify Top 3 Artists" is a web application that allows users to view their top 3 most listened-to artists on Spotify during a specific period of time. After logging in and authorizing the application to access their Spotify account, the application automatically retrieves the necessary information to display the requested data. The resulting HTML page presents the information in a simple and intuitive way. 

## Requirments

In order to run this application, you will need to have the following installed on your machine:

- Basic understanding of Bootstrap, JavaScript and HTML
- Node.js (version >= 14.0.0)
- NPM (version >= 6.0.0)
- A basic Spotify account

Nice to have: 

- Knowledge of OAuth 2.0 authentication flow
- REST API 

## Installation

- Install the dependencies: 

```
npm install
```

- Set up the environment variables by creating a `.env` file in the root directory of the project and adding your Spotify API credentials (take a look to the env.example)


## How to use it

- Run the app

```
nodemon app.js
```

- Open your web browser and go to http://localhost:8888.

- Click the "Fetch Data" button and log in with your Spotify account.

- After granting access to your Spotify account, you will be redirected to a page showing your top 3 most listened to artists on Spotify in the last months. 

## Authentication with Spotify

This project uses the Spotify Web API for retrieving data. To use this API, you need to authenticate with Spotify and obtain an access token.

The authentication method used in this project is the Client Credentials Flow. This flow is used when your application is accessing its own data (i.e., not on behalf of a user). It is used for server-to-server authentication.

To authenticate with the Spotify API, you will need to provide your Client ID and Client Secret, which can be obtained from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/). Once you have obtained these credentials, you can make a request to the Spotify Web API to obtain an access token.

For more information on the authentication flow, see the [Spotify Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/).


## License

This project is licensed under the terms of the MIT license. See the LICENSE file for details.

The MIT License is a permissive free software license that allows you to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software. It is provided "as is" without express or implied warranty.

## Future development
- Enhanced UI with a separate login page
- Advanced cookie management
- Implement additional routes for other Spotify APIs
- Managing the Refresh Token

## Changelog

- 1.0.0 (2023-05-XX)
    - First relase

## References
- [Spotify Authentication Guide](https://developer.spotify.com/documentation/general/guides/authentication/)
- [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/reference/)

## Author
- Author: Davide Fella 
