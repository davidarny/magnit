## **Delete Template**

Deletes template and entities of template by template id.

**URL**  
/v1/templates/:id

**Method:**  
`DELETE`

**URL Params**

_Required:_

-   `id=[integer]`

**Data Params**  
None

**Success Response:**

-   Code: 200  
    Content: `{"success": 1}`

**Error Responses:**

-   Code: 404 NOT FOUND  
    Content: `{"success": 0, "message": "template does not exist"}`

-   Code: 403 FORBIDDEN  
    Content: `{"success": 0, "message": "template assigned to task; deletion impossible"}`

**Sample Call:**

```javascript
let response = await fetch("/v1/templates/17", {
    credentials: "same-origin",
    method: "DELETE",
});
```
