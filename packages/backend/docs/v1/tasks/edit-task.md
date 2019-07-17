## Edit Task

#### URL

`/v1/tasks/:id`

#### Method

`PUT`

#### URL params

| Name | Type      | Required |
| ---- | --------- | -------- |
| `id` | `integer` | `true`   |

#### Body params

| Name   | Type   | Required |
| ------ | ------ | -------- |
| `task` | `JSON` | `true`   |

#### Success response

| Code     | Content          |
| -------- | ---------------- |
| `200 OK` | `{"success": 1}` |

#### Error responses

| Code            | Content                                            |
| --------------- | -------------------------------------------------- |
| `404 NOT FOUND` | `{"success": 0, "message": "Task does not exist"}` |

#### Sample call

```javascript
const response = await fetch("/v1/tasks/17", {
    credentials: "same-origin",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: json,
});
```
