# Debugging Analysis

## Scenario 1: get an error while trying to setCustomClaims for admin user

-   **Breakpoint Location:** file:adminController.ts; line: 16
-   **Objective:** 
Because the error message is "SetCustomClaims Unseccessfully: Credential implementation provided to initializeApp() via the \"credential\" property failed to fetch a valid Google OAuth2 access token with the following error: \"Cannot set property project_id of #<Object> which has only a getter\".", the error seems from the built-in library of google, I try to find the root cause.

### Debugger Observations

-   **Variable States:** No used for this scenario.
-   **Call Stack:** No used for this scenario.
-   **Behavior:** 
Actually, when I use the breakpoint, the program directly goes to the catch part, and I couldn't figure out the specific location where the error is thrown, even with the error stack information. After doing some research, I found that I can check the 'Caught Exceptions' and 'Uncaught Exceptions' boxes in VS Code to locate the exact place where the error occurs.

### Analysis

-   What did you learn from this scenario?
I learned the different import methods in TS, this way `import * as serviceAccount from "../back-end-assignment04-firebase-private-key.json";` the serviceAccount would be a onlyread object, I shoud change it into `import serviceAccount from "../back-end-assignment04-firebase-private-key.json";`

-   Did you observe any unexpected behavior? If so, what might be the cause?
No unexpected behaviors were observed.

-   Are there areas for improvement or refactoring in this part of the code?
No areas for improvements at this moment.

-   How does this enhance your understanding of the overall project?
In the future, if I try to import a Json configuration file, I prefer to keep it read only status, not to modify it in the program. Maybe it could avoid the potential errors.   






## Scenario 2: could not see the idtoken object information in postman

-   **Breakpoint Location:** file:adminController.ts; line: 84
-   **Objective:** 
Becase I need to use different users to test my application. I write a api for admin to get all the users idtokens and the current roles in one go. However, in the request response I couldn't see the detail object information in postman.

### Debugger Observations

-   **Variable States:** No used for this scenario.
-   **Call Stack:** No used for this scenario.
-   **Behavior:** 
The object couldn't show correctly in the postman respnose body.

### Analysis

-   What did you learn from this scenario?
At the first, I doubted that I got the wrong information in the fetch part, but after I debugged the code line by line, I found that actually I put the original JS object directly in a string, that was also the reason why the object couldn't not be showen right. I shouls send the object to the successresponse as the data parameter.

-   Did you observe any unexpected behavior? If so, what might be the cause?
No unexpected behaviors were observed.

-   Are there areas for improvement or refactoring in this part of the code?
No areas for improvements at this moment.

-   How does this enhance your understanding of the overall project?
In the future, when I encounter a similar error, I will first try to troubleshoot with the thought that maybe I am not handling the object-to-string transformation correctly.







## Scenario 1: [Title of the Scenario]

-   **Breakpoint Location:** [File and line number]
-   **Objective:** [What you are investigating or trying to understand]

### Debugger Observations

-   **Variable States:** [List key variables and their values]
-   **Call Stack:** [Summarize the function sequence leading to the breakpoint]
-   **Behavior:** [Describe what happens at this point in the program]

### Analysis

-   What did you learn from this scenario?
-   Did you observe any unexpected behavior? If so, what might be the cause?
-   Are there areas for improvement or refactoring in this part of the code?
-   How does this enhance your understanding of the overall project?