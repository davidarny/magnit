## Get Task

#### URL

`/v1/tasks/:id/extended`

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
| `templates`      | `<array of Templates>`                          |
| `estimates`      | `<array of Estimates>`                          |
| `createdAt`      | `string`                                        |
| `updatedAt`      | `string`                                        |

#### Task example

```json
{
    "id": 8,
    "name": "Task 1",
    "object_id": null,
    "user_id": null,
    "status": "inactive",
    "deadline_date": null,
    "departure_date": null,
    "description": null,
    "templates": [
        {
            "description": null,
            "id": 1,
            "title": "Template 1",
            "type": null
        }
    ],
    "createdAt": "2019-07-17T10:38:01.807Z",
    "updatedAt": "2019-07-17T10:38:01.807Z"
}
```

#### Estimate schema

| Property name | Property type |
| ------------- | ------------- |
| `id`          | `number`      |
| `ttile`       | `string`      |
| `template_id` | `string`      |
| `unit`        | `string`      |
| `count`       | `number`      |
| `cost`        | `number`      |

#### Estimate example

```json
{
    "cost": 250279,
    "count": 7624,
    "id": 1,
    "template_id": 1,
    "title": "Template 1",
    "unit": "м3"
}
```

#### Sample call

```javascript
const response = await fetch("/v1/templates/17/extended", {
    credentials: "same-origin",
    method: "GET",
});
```
