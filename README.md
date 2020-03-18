# Javascript Coding Challenge #

### Task ###

Spend 24 hours maximum from the moment you specify your start date and time.

Create Javascript library with Node.js that will manage virtual bank accounts. Library should support making a deposit to an account, making a withdrawal from an account and transferring money between accounts. Use Postgres database and Sequelize for persistence.

Use Case: Customer pays for a haircut by cash and leaves a tip, haircut money should go to the shop's cash account and tip should go into the barber's cash account. Barber and shop could see their cash balances. When a customer requests a refund then balance is taken out from the accounts.

Library should allow:

* Making a deposit
* Making a withdrawal
* Making a transfer
* Making a refund
* Getting the account balance
* Showing history of transactions


### Important Notes ###

* There can be multiple bank accounts differentiated by some string id
* Support a notion of refunds, refund should reference original transaction
* Managing barber, customer and shop is out of the scope of this challenge, it is only provided for context, manage accounts on their own


### What we expect from the code challenge ###

* Good software engineering practices are used.
* The solution is simple, and not over-engineered.
* 3rd party frameworks are kept at a minimum (except ones noted) - we want to see as much of the code you wrote.

### Deliverables ###
None. Be prepared to walk me through all steps in technical detail over zoom via screen share.
