**v 1.0.0** :hammer:

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

<a href="https://www.facebook.com/andre.pinto.k/"><img src="https://i.imgur.com/Ahy2Fvj.jpg?1" align="left" height="120" width="600" ></a>

Add the Client ID and Secret and replace the **ACCOUNT ID** in both URLs for the respective ones.

---

## Current Funcionality :heavy_check_mark:

**Step 1:**

In order to reach the endpoint of the client there are 5 mandatory parameters. Is necessary to enter the Client ID, the State, the Redirect URI and select one or both of Restlets and Rest Web Services for the Scope. The Response Type is always 'code', so no need to enter it.

After clicking Authorize, user is redirected to the consent screen, after authorizing access, there's another redirect back to the App. This redirect will provide the Code parameter provided by the Client which is needed for the next step.

**Step 2:**

To get the Token is necessary to enter the Code. This is done automatically by the app. The Redirect URI will be saved locally and is passed from **Step 1** to **Step 2**. Select the Grant Type and click Get Token.
The Access Token will be return on the text area at the bottom of the page.

---

## Next Steps / Working on :construction:

- UI
  - Simple;
  - Improve the forms;
  - Add Refresh Token option;
  - Add Revoke Token option;
  - ...
- NodeJS Code
  - Structure the Routes;
  - Create a option/function to automatically generate a new state;
  - Create a function for the Authorization encoding;
  - Create a function for the Error handling;
  - Create a function to separate the Checkbox values return by the form; :heavy_check_mark:
  - ...
- Problems
  - On Step 1, it should be possible to select one or both checkboxes. None should not be possible. If none are selected this will break the flow;
  - On Step 2, one checkbox needs to be mandatory. None or both should not be possible, so I'll use Radio Buttons instead; :heavy_check_mark:
  - There are several I bet. Work in progress...

---

## Errors :no_entry:

No issues to report yet.
