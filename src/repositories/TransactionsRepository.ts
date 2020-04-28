import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    return transactions.reduce(
      (balanceCalc, transaction) => {
        const balance = balanceCalc;
        if (transaction.type === 'income') {
          balance.income += transaction.value;
        } else {
          balance.outcome += transaction.value;
        }

        balance.total = balance.income - balance.outcome;

        return balance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
  }
}

export default TransactionsRepository;
