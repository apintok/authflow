**v 1.0.0** :hammer:

---

## Introduction :open_book:

This small App main goal is to help understand and troubleshoot oAuth 2.0 Flow. It was made with NetSuite ERP as the client provider of the Integration details. This version shows how to get the Access Token which is used to authenticate Restlets or REST Web Services. For the time being this App intent is to be executed locally.

---

## Requirements :file_folder:

**This App current version requires the following dependencies:**

- Express
- EJS
- dotenv
- axios

**Please refer to package.json**

---

## Installation :pen:

It should be a standard installation using `npm install` after downloading the code.

**_Important to note_** the Redirect URI needs to be https. This is mandatory. As the App runs locally is necessary to configure SSL.

Is necessary to have a cert.pem file and also a key.pem.

---

## Current Funcionality :heavy_check_mark:

**Step 1:**

In order to reach the endpoint of the client there are 5 mandatory parameters. Is necessary to enter the Client ID, the State, the Redirect URI and select one or both of Restlets and Rest Web Services for the Scope. The Response Type is always 'code', so no need to enter it.

After clicking Authorize, user is redirected to the consent screen, after authorizing access, there's another redirect back to the App. This redirect will provide the Code parameter provided by the Client which is needed for the next step.

**Step 2:**

To get the Token is necessary to enter the Code. This is done automatically by the app. Enter the Redirect URI as in previous step. Select the Grant Type and click Get Token.
The Access Token will be return on the text area at the bottom of the page.

---

## Next Steps / Working on :construction:

- UI
  - Simple;
  - Improve the forms;
  - ...
- NodeJS Code
  - Structure the Routes;
  - Create a function for the Authorization encoding;
  - Create a function for the Error handling;
  - Create a function to separate the Checkbox values return by the form;
  - ...
- Problems
  - On Step 1, it should be possible to select one or both checkboxes. None should not be possible. If none are selected this will break the flow;
  - On Step 2, one checkbox needs to be mandatory. None or both should not be possible;
  - There are several I bet. Work in progress...

---

## Errors :no_entry:

No issues to report yet.
