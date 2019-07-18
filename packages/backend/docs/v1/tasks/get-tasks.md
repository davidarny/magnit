## Get Tasks

#### URL

`/v1/tasks`

#### Method

`GET`

#### URL params

| Name     | Type                                            | Required | Default |
| -------- | ----------------------------------------------- | -------- | ------- |
| `offset` | `integer`                                       | `false`  | 0       |
| `limit`  | `integer`                                       | `false`  | 10      |
| `sort`   | `enum(ASC, DESC)`                               | `false`  | `ASC`   |
| `name`   | `string`                                        | `false`  |         |
| `status` | `enum(in_progress, on_check, draft, completed)` | `false`  |         |

#### Success response

| Code     | Content                                                     |
| -------- | ----------------------------------------------------------- |
| `200 OK` | `{"success": 1, total: <number> "tasks": <array of Tasks>}` |

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

#### Sample Call

```javascript
const query = `offset=42&limit=14&sort=DESC&title=${encodeURIComponent("Ведомость работ")}`;
const response = await fetch(`/v1/templates?${query}`, {
    credentials: "same-origin",
    method: "GET",
});
```
