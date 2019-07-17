## Create Task

#### URL

`/v1/tasks`

#### Method

`POST`

#### Body params

| Name   | Type   | Required |
| ------ | ------ | -------- |
| `task` | `JSON` | `true`   |

#### Success response

| Code     | Content                                   |
| -------- | ----------------------------------------- |
| `200 OK` | `{"success": 1, "template_id": <number>}` |

#### Error responses

| Code              | Content                                       |
| ----------------- | --------------------------------------------- |
| `400 BAD REQUEST` | `{"success": 0, "message": "Not valid JSON"}` |

#### Sample call

```javascript
const response = await fetch("/v1/tasks", {
    credentials: "same-origin",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: json,
});
```
