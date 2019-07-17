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

    `object sample:`
    {  
    &nbsp;&nbsp;&nbsp;&nbsp;createdAt: '2019-06-20T14:40:43.463Z',  
    &nbsp;&nbsp;&nbsp;&nbsp;updatedAt: '2019-06-20T14:40:43.463Z',  
    &nbsp;&nbsp;&nbsp;&nbsp;id: 17,  
    &nbsp;&nbsp;&nbsp;&nbsp;title: 'some title',  
    &nbsp;&nbsp;&nbsp;&nbsp;description: 'some description',  
    &nbsp;&nbsp;&nbsp;&nbsp;assigned: false  
    }

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
