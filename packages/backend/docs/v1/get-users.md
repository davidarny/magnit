## **Get Users**

Returns list of users.

**URL**  
/v1/users

**Method:**  
`GET`

**URL Params**

-   `offset=[integer]` (default = 0)
-   `limit=[integer]` (default = 10)
-   `sort=[enum(ASC, DESC)]` (default = ASC)
-   `user_id=[number]`
-   `region=[string]`
-   `branch=[string]`

**Data Params**  
None

**Success Response:**

-   Code: 200  
    Content: `{"success": 1, total: <number> "users": <array of objects>}`

    `total` - total number of pages by criteria

    `object sample:`
    {  
    &nbsp;&nbsp;&nbsp;&nbsp;id: 17,  
    &nbsp;&nbsp;&nbsp;&nbsp;region: 'region name',  
    &nbsp;&nbsp;&nbsp;&nbsp;branch: 'branch name',  
    &nbsp;&nbsp;&nbsp;&nbsp;name: 'Ivanov Ivan Ivanivich',  
    &nbsp;&nbsp;&nbsp;&nbsp;position: 'foreman',  
    &nbsp;&nbsp;&nbsp;&nbsp;assigned_count: '2',  
    &nbsp;&nbsp;&nbsp;&nbsp;completed_count: '1'  
    }

**Sample Call:**

```javascript
let response = await fetch(
    `/v1/users?offset=42&limit=14&sort=DESC&region=${encodeURIComponent("Астраханская область")}`,
    {
        credentials: "same-origin",
        method: "GET",
    }
);
```
