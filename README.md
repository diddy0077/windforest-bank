🏦 Banking Simulation Project – Pages & Features
1. Landing Page

Hero section (headline, CTA “Login” / “Sign Up”)

Features overview (secure transfers, smart savings, support)

Stats section (users, transactions, years in service)

Testimonials slider

FAQ accordion

Footer with links/socials

2. Signup Page

Form with:

Full name

Email

Password

On submit → create user in users (json-server POST)

Auto-generate 1 savings account for new user in accounts with balance = 0

3. Login Page

Email + password form

Validate against users (json-server GET)

On success → store session (userId in localStorage) → redirect to Dashboard

4. Dashboard Page

Greeting (“Welcome, Daniel”)

Display account cards:

Savings account balance

Current account balance (if exists)

Quick actions:

Make Transfer

View Transactions

Profile Settings

5. Accounts Page

List all user’s accounts (savings/current)

Show:

Account type

Account number (fake)

Balance

Button: “Open new account” → creates another account via POST /accounts

6. Transactions Page

Transaction history in a table:

Date

Description (e.g., “Transfer to Alice”)

Amount (credit/debit)

Balance after transaction

Pull data from /transactions?userId=1

7. Transfer Page

Transfer form:

From Account (dropdown of user accounts)

To Account (enter account number OR select saved beneficiary)

Amount

On submit:

Deduct balance from sender account (PATCH /accounts)

Add balance to recipient account (PATCH /accounts)

Record transaction for both users (POST /transactions)

Show success notification

8. Beneficiaries Page

List of saved beneficiaries (name + account number)

Add beneficiary form (name + account number → POST /beneficiaries)

Delete beneficiary

9. Profile Page

Show user details (name, email)

Allow edit + save (PATCH /users/:id)

Upload profile picture (store URL in user object)

10. Settings Page

Change password (PATCH /users/:id)

Toggle dark/light mode

Logout button (clear localStorage session)