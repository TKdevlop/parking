Parking API

POST /parking/add-parking-lot  
Add parking lot with a size of 10 for email test1@test.com
```json
{
    "email":"test1@test.com",
    "size":10
}
```
POST /parking/park  
Park at the closest slot available
```json
{
    "managerEmail":"test@test.com",
    "email":"usertest@test.com"
}
```
POST /parking/unpark  
Unpark based on slot number & email
```json
{
    "managerEmail":"test@test.com",
    "email":"usertest@test.com",
    "slot":5
}
```
POST /parking/slot-toggle  
Toggle parking slot based on manager email & it's availability
```json
{
    "managerEmail":"test@test.com",
    "slot":9
}
```