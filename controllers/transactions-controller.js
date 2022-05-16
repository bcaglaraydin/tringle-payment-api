global.transactions = []
const addTransaction = (_accountNumber, _amount, _transationType) => {
    var datetime = new Date();
    transactions.push({
        accountNumber: _accountNumber,
        amount: _amount,
        transactioNType: _transationType,
        createdAt: datetime.getFullYear() + '-' + (datetime.getMonth() + 1) + '-' + datetime.getDate() + " " + datetime.getHours() + ":" + datetime.getMinutes()
    })
}


export const makePayment = (req, res) => {
    const sender = accounts.find(acc => acc.accountNumber === req.body.senderAccount);
    const receiver = accounts.find(acc => acc.accountNumber === req.body.receiverAccount);
    const amount = req.body.amount;

    if (!sender) {
        res.status(400).send("Error: Sender Account does not exist!")
    }
    if (!receiver) {
        res.status(400).send("Error: Sender Account does not exist!")
    }
    if (sender.accountType != "individual" || receiver.accountType != "corporate") {
        res.status(400).send("Error: Payments can only be wired from an individual account to a corporate account!")
    }
    if (sender.balance < amount) {
        res.status(400).send("Error: Insufficent balance!")
    }

    accounts = accounts.map(acc =>
        acc.accountNumber === receiver.accountNumber
            ? { ...acc, balance: parseInt(acc.balance) + parseInt(amount) }
            : acc
    );

    accounts = accounts.map(acc =>
        acc.accountNumber === sender.accountNumber
            ? { ...acc, balance: parseInt(acc.balance) - parseInt(amount) }
            : acc
    );

    addTransaction(sender.accountNumber, amount, "payment")
    addTransaction(receiver.accountNumber, amount, "payment")

    res.status(200).send()

};

export const makeDeposit = (req, res) => {

    const amount = req.body.amount;
    const account = accounts.find(acc => acc.accountNumber === req.body.accountNumber)

    if (!account) {
        res.status(400).send("Error: Account does not exist!")
    }
    if (account.accountType != "individual") {
        res.status(400).send("Error: accountType should be individual!")
    }

    accounts = accounts.map(acc =>
        acc.accountNumber === req.body.accountNumber
            ? { ...acc, balance: parseInt(acc.balance) + parseInt(amount) }
            : acc
    );

    addTransaction(account.accountNumber, amount, "deposit")

    res.status(200).send()

};


export const makeWithdraw = (req, res) => {

    const amount = req.body.amount;
    const account = accounts.find(acc => acc.accountNumber === req.body.accountNumber)

    if (!account) {
        res.status(400).send("Error: Account does not exist!")
    }
    if (account.accountType != "individual") {
        res.status(400).send("Error: accountType should be individual!")
    }
    if (account.balance < amount) {
        res.status(400).send("Error: Insufficent balance!")
    }

    accounts = accounts.map(acc =>
        acc.accountNumber === accountNumber
            ? { ...acc, balance: parseInt(acc.balance) - parseInt(amount) }
            : acc
    );

    addTransaction(account.accountNumber, amount, "withdraw")

    res.status(200).send()

};

export const getTransactions = (req, res) => {
    const accountNumber = req.params.accountNumber;
    const transaction = transactions.filter(t => t.accountNumber === accountNumber)
    res.status(200).send(transaction)
};