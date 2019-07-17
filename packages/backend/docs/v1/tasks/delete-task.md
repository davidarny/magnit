## Delete Task

#### URL

`/v1/tasks/:id`

#### Method:

`DELETE`

#### URL params

| Name | Type      | Required |
| ---- | --------- | -------- |
| `id` | `integer` | `true`   |

#### Success response

| Code     | Content          |
| -------- | ---------------- |
| `200 OK` | `{"success": 1}` |

#### Error responses

| Code            | Content                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| `404 NOT FOUND` | `{"success": 0, "message": "Task does not exist"}`                         |
| `403 FORBIDDEN` | `{"success": 0, "message": "Cannot delete Task with assigned Templates "}` |

#### Sample call

```javascript
const response = await fetch("/v1/templates/17", {
    credentials: "same-origin",
    method: "DELETE",
});
```
