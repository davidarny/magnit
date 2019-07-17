## **Get Template**

Returns JSON by template id.

**URL**  
/v1/templates/:id

**Method:**  
`GET`

**URL Params**

_Required:_

-   `id=[integer]`

**Data Params**  
None

**Success Response:**

-   Code: 200  
    Content: `{"success": 1, "template": <json>}`

**Error Responses:**

-   Code: 404 NOT FOUND  
    Content: `{"success": 0, "message": "template does not exist"}`

**Sample Call:**

```javascript
let response = await fetch("/v1/templates/17", {
    credentials: "same-origin",
    method: "GET",
});
```
