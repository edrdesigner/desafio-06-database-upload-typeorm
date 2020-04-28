import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const total = transactionRepository.getBalance();
  const transactions = await transactionRepository.find();

  return response.json({ transactions, total });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, category, type, value } = request.body;
  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    category,
    type,
    value,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute({ id });

  return response.status(200);
});

transactionsRouter.post('/import', async (request, response) => {
  const { filename } = request.file;
  const importTransaction = new ImportTransactionsService();

  const transactions = await importTransaction.execute({ filename });

  return response.json(transactions);
});

export default transactionsRouter;
