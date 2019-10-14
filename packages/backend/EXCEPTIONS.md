# HTTP error codes

| Error Code | HTTP status code | Description                                | Detailed description                                 |
| ---------- | ---------------- | ------------------------------------------ | ---------------------------------------------------- |
| N/A        | 500              | Internal Server Error                      |                                                      |
| 0          | 404              | Template Not Found                         |                                                      |
| 1          | 404              | Task Not Found                             |                                                      |
| 2          | 500              | Cannot Insert Template                     |                                                      |
| 3          | 404              | Puzzle Not Found                           |                                                      |
| 4          | 409              | Found Non-Compatible Props                 | If one passing `status` & `statuses` in `GET /tasks` |
| 5          | 400              | Cannot Save Answers                        |                                                      |
| 6          | 400              | Cannot Save Duplicate Answers              |                                                      |
| 7          | 404              | File Not Found                             |                                                      |
| 8          | 401              | User Unauthorized                          |                                                      |
| 9          | 401              | Invalid Token                              |                                                      |
| 10         | 409              | Cannot send Push Notification              |                                                      |
| 11         | 400              | Incorrect Task status when setting Answers |                                                      |
| 12         | 400              | Cannot save Answers partially              |                                                      |
| 13         | 400              | Location not found in body                 |                                                      |
| 14         | 400              | Cannot parse location JSON                 |                                                      |
| 15         | 409              | User already exist                         |                                                      |
| 16         | 404              | User not found                             |                                                      |
| 17         | 404              | Role not found                             |                                                      |
