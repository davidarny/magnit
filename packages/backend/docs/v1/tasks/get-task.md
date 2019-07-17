## Get Task

#### URL

`/v1/tasks/:id`

#### Method

`GET`

#### URL params

| Name | Type      | Required |
| ---- | --------- | -------- |
| `id` | `integer` | `true`   |

#### Success response

| Code     | Content                              |
| -------- | ------------------------------------ |
| `200 OK` | `{"success": 1, "task: <Task JSON>}` |

#### Error responses

| Code            | Content                                            |
| --------------- | -------------------------------------------------- |
| `404 NOT FOUND` | `{"success": 0, "message": "Task does not exist"}` |

#### Task schema

| Property name    | Property type                                                       |
| ---------------- | ------------------------------------------------------------------- |
| `id`             | `number`                                                            |
| `name`           | `string`                                                            |
| `object_id`      | `string or null`                                                    |
| `user_id`        | `string or null`                                                    |
| `status`         | `enum(assigned, inactive, inprogress, oncheck, overdue, completed)` |
| `deadline_date`  | `string or null`                                                    |
| `departure_date` | `string or null`                                                    |
| `description`    | `string or null`                                                    |
| `createdAt`      | `string`                                                            |
| `updatedAt`      | `string`                                                            |

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
const response = await fetch("/v1/templates/17", {
    credentials: "same-origin",
    method: "GET",
});
```
