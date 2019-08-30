# HTTP error codes

| Error Code | HTTP status code | Description                   | Detailed description                                 |
| ---------- | ---------------- | ----------------------------- | ---------------------------------------------------- |
| N/A        | 500              | Internal Server Error         |                                                      |
| 0          | 404              | Template Not Found            |                                                      |
| 1          | 404              | Task Not Found                |                                                      |
| 2          | 500              | Cannot Insert Template        |                                                      |
| 3          | 404              | Puzzle Not Found              |                                                      |
| 4          | 400              | Found Non-Compatible Props    | If one passing `status` & `statuses` in `GET /tasks` |
| 5          | 400              | Cannot Save Answers           |                                                      |
| 6          | 400              | Cannot Save Duplicate Answers |                                                      |
| 7          | 404              | File Not Found                |                                                      |
| 8          | 401              | User Unauthorized             |                                                      |
| 9          | 401              | Invalid Token                 |                                                      |
