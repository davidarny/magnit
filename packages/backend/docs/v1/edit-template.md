## **Edit Template**

Edits template by id and new JSON.

**URL**  
/v1/templates/:id

**Method:**  
`PUT`

**URL Params**

_Required:_

-   `id=[integer]`

**Data Params**

_Required:_

-   `template=[json]`

**Success Response:**

-   Code: 200  
    Content: `{"success": 1}`

**Error Responses:**

-   Code: 400 BAD REQUEST  
    Content: `{"success": 0, "message": "Not valid JSON"}`

-   Code: 404 NOT FOUND  
    Content: `{"success": 0, "message": "template does not exist"}`

-   Code: 403 FORBIDDEN  
    Content: `{"success": 0, "message": "template assigned to task; editing impossible"}`

**Sample Call:**

```javascript
let response = await fetch("/v1/templates/14", {
    credentials: "same-origin",
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
    body: json,
});
```
