## **Create Template**

Parses JSON and packs entities on different tables.

**URL**  
/v1/templates

**Method:**  
`POST`

**URL Params**  
None

**Data Params**

_Required:_

-   `template=[json]`

**Success Response:**

-   Code: 200  
    Content: `{"success": 1, "template_id": <number>}`

**Error Responses:**

-   Code: 400 BAD REQUEST  
    Content: `{"success": 0, "message": "Not valid JSON"}`

**Sample Call:**

```javascript
let response = await fetch("/v1/templates", {
    credentials: "same-origin",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: json,
});
```
