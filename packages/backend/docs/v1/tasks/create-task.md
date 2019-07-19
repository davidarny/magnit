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

| Code     | Content                               |
| -------- | ------------------------------------- |
| `200 OK` | `{"success": 1, "task_id": <number>}` |

#### Error responses

| Code              | Content                                       |
| ----------------- | --------------------------------------------- |
| `400 BAD REQUEST` | `{"success": 0, "message": "Not valid JSON"}` |

#### Task schema

| Property name    | Property type                                   |
| ---------------- | ----------------------------------------------- |
| `id`             | `number`                                        |
| `name`           | `string`                                        |
| `object_id`      | `string or null`                                |
| `user_id`        | `string or null`                                |
| `status`         | `enum(in_progress, on_check, draft, completed)` |
| `deadline_date`  | `string or null`                                |
| `departure_date` | `string or null`                                |
| `description`    | `string or null`                                |
| `createdAt`      | `string`                                        |
| `updatedAt`      | `string`                                        |

#### Task example

```json
{
    "id": 8,
    "name": "task1",
    "object_id": null,
    "user_id": null,
    "status": "inactive",
    "deadline_date": null,
    "departure_date": null,
    "description": null,
    "createdAt": "2019-07-17T10:38:01.807Z",
    "updatedAt": "2019-07-17T10:38:01.807Z"
}
```

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
