**v 1.1.0** :hammer:

---

## Introduction :open_book:

This small App main goal is to help understand and troubleshoot oAuth 2.0 Flow. It was made with NetSuite ERP as the client provider of the Integration details. This version shows how to get the Access Token which is used to authenticate Restlets or REST Web Services. For the time being this App intent is to be executed locally.

---

## Requirements :file_folder:

**This App current version requires the following dependencies:**

- express
- ejs
- dotenv
- axios

**Please refer to package.json**

---

## Installation :pen:

It should be a standard installation using `npm install` after downloading the code.

**_Important to note_** that the Redirect URI needs to use https protocol. This is mandatory. As the App runs locally only, is necessary to configure SSL.

Is necessary to have a cert.pem file and also a key.pem. I used OpenSSL for achieving this.

A config.env needs to be added relatively to _app.js_. As the App runs locally it should have a config.env file that looks like:

<a href="#"><img src="https://i.imgur.com/7lcBBHQ.jpg" align="left" height="100" width="700" ></a>

Add the Client ID and Secret and replace the **ACCOUNT ID** in both URLs for the respective ones.

---

## Current Funcionality :heavy_check_mark:

**Step 1:**

In order to reach the endpoint of the client there are 5 mandatory parameters. Is necessary to enter the _Client ID_, the _State_, the _Redirect URI_ and select one or both of Restlets and Rest Web Services for the _Scope_. The Response Type is always 'code', so no need to enter it.

After clicking Authorize, user is redirected to the consent screen. After authorizing access, there's another redirect back to the App. This redirect will provide the Code parameter provided by the Client which is needed for the next step.

**Step 2:**

To get the Token is necessary to enter the Code. This is done automatically by the App (the Code value is taken from the URL Parameters). The Redirect URI will be saved locally and is passed from **Step 1** to **Step 2**. The Grant Type is always Authorization Code for this step. Click Get Token.
The Access Token will be returned at the bottom of the page under the Token Result section.

**Refresh Token (Step 3):**

Here the current issued Token can be refreshed if necessary. Only 2 parameters are needed: the _Grant Type_ and the _Refresh Token_ returned from **Step 2**.
The Grant Type always needs to be Refresh Token.

**Revoke Token (Step 4):**

The value of the token parameter is the value of the refresh token that the application revokes. The _Refresh Token_ value returned from either **Step 2** or **Step 3**

---

## Next Steps / Working on :construction:

- UI
  - Improve the forms;
  - Created a new Homepage; :heavy_check_mark:
  - Added a navbar for better navigation; :heavy_check_mark:
  - Added a header; :heavy_check_mark:
  - Adding the possibility of testing both oAuth 1.0 and oAuth 2.0 flows;
  - Added a footer; :heavy_check_mark:
- NodeJS Code
  - Structure the Routes; :heavy_check_mark:
  - Create a option/function to automatically generate a new state;
  - Create a function for the Error handling;
  - Function to deal with the Basic Auth :heavy_check_mark:
  - ...
- Client JS
  - I've added jquery to assist me with client side JavaScript, so I need to use only jquery moving forward;
  - ...
- Problems
  - On Step 2, one checkbox needs to be mandatory. None or both should not be possible, so I'll use Radio Buttons instead; :heavy_check_mark:
  - There are several I bet. Work in progress...

---

## Errors :no_entry:

No issues to report yet.
