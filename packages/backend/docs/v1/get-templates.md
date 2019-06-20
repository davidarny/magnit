## **Get Templates**

Returns list of templates.

**URL**  
/v1/templates

**Method:**  
`GET`

**URL Params**

-   `offset=[integer]` (default = 0)
-   `limit=[integer]` (default = 10)
-   `sort=[enum(ASC, DESC)]` (default = ASC)
-   `title=[string]`

**Data Params**  
None

**Success Response:**

-   Code: 200  
    Content: `{"success": 1, total: <number> "templates": <array of objects>}`

    `total` - total number of pages by criteria

**Sample Call:**

```javascript
let response = await fetch(
    `/v1/templates?offset=42&limit=14&sort=DESC&title=${encodeURIComponent("Ведомость работ")}`,
    {
        credentials: "same-origin",
        method: "GET",
    }
);
```
