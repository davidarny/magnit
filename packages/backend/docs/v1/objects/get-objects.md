## **Get Objects**

Returns list of objects.

**URL**  
/v1/objects

**Method:**  
`GET`

**URL Params**

-   `offset=[integer]` (default = 0)
-   `limit=[integer]` (default = 10)
-   `sort=[enum(ASC, DESC)]` (default = ASC)
-   `object_id=[number]`
-   `region=[string]`
-   `branch=[string]`

**Data Params**  
None

**Success Response:**

-   Code: 200  
    Content: `{"success": 1, total: <number> "objects": <array of objects>}`

    `total` - total number of pages by criteria

    `object sample:`
    {  
    &nbsp;&nbsp;&nbsp;&nbsp;id: 17,  
    &nbsp;&nbsp;&nbsp;&nbsp;region: 'region name',  
    &nbsp;&nbsp;&nbsp;&nbsp;branch: 'branch name',  
    &nbsp;&nbsp;&nbsp;&nbsp;address: 'address',  
    &nbsp;&nbsp;&nbsp;&nbsp;format: 'MK',  
    &nbsp;&nbsp;&nbsp;&nbsp;assigned_count: '2',  
    &nbsp;&nbsp;&nbsp;&nbsp;completed_count: '0'  
    }

**Sample Call:**

```javascript
let response = await fetch(
    `/v1/objects?offset=42&limit=14&sort=DESC&region=${encodeURIComponent("Астраханская область")}`,
    {
        credentials: "same-origin",
        method: "GET",
    }
);
```
