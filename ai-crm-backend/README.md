# AI CRM Backend — Auth Module

## Setup

1. `npm install`
2. `.env.example` ko copy karke `.env` banao aur apni MongoDB URI + JWT secret daalo
3. `npm run dev` (nodemon ke saath) ya `npm start`

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Naya business register karo (Company + Admin user banta hai) |
| POST | `/api/auth/login` | Public | Login, JWT token milta hai |
| GET | `/api/auth/me` | Private | Logged-in user + company profile |
| POST | `/api/auth/add-agent` | Private (admin) | Sales agent add karo apni company mein |

## Sample Signup Request Body
```json
{
  "companyName": "ABC Real Estate",
  "industry": "real estate",
  "name": "Abhishek Yadav",
  "email": "abhishek@abc.com",
  "password": "test1234",
  "phone": "9876543210"
}
```

## Sample Login Request Body
```json
{
  "email": "abhishek@abc.com",
  "password": "test1234"
}
```

## Auth Flow Explained

1. **Signup**: Ek business signup karta hai → ek `Company` document banta hai → owner `User` (role: admin) banta hai, jo us company se link hota hai (`companyId`).
2. **Login**: Email/password verify hoke JWT token milta hai jisme `userId`, `companyId`, aur `role` encoded hota hai.
3. **Protected Routes**: Frontend har request ke `Authorization: Bearer <token>` header mein token bhejta hai. `authMiddleware` isse verify karke `req.user` aur `req.companyId` set kar deta hai.
4. **Multi-tenant safety**: Aage jab leads/deals/tasks banoge, har query mein `{ companyId: req.companyId }` filter lagana zaroori hai — isse ek company ka data doosri company ko kabhi nahi dikhega.
5. **Roles**: `admin` (business owner) naye `agent` add kar sakta hai. Aage jaake fine-grained permissions (jaise agent sirf apne assigned leads dekh paye) bhi isi role field se control honge.

## Next Steps
- Lead model + CRUD routes (companyId-scoped)
- AI conversation service (Claude/OpenAI integration)
- Dashboard stats endpoint
