const BooksMarketplace = artifacts.require('BooksMarketplace');

const ID = Math.random().toString(32).substr(2, 9);
const PRICE = Math.floor(Math.random() * 10);

function isWithError(error, errorString) {
  return error.hijackedStack.includes(errorString);
}

// TODO test on different wallets
// TODO fix removeBook

contract('BooksMarketplace', () => {
  let booksMarketplace;

  beforeEach(async () => {
    booksMarketplace = await BooksMarketplace.new();
  });

  it('should deploy contract', async () => {
    assert(booksMarketplace.address !== '');
  });

  contract('addBook', () => {
    it('should add new book', async () => {
      await booksMarketplace.addBook(ID, PRICE);
      const { 0: booksIds, 1: prices, 2: available, 3: sold } = await booksMarketplace.getBooks();

      assert.equal(booksIds.length, 1, 'should contains one book id');
      assert.equal(prices.length, 1, 'should contains one book price');
      assert.equal(available.length, 1, 'should contains one book available status');
      assert.equal(sold.length, 1, 'should contains one book number of sold books number');

      assert.equal(booksIds[0], ID, 'should return correct id');
      assert.equal(prices[0], PRICE, 'should return correct price');
    });

    it('should return error when adding book with existing id', async () => {
      let err = null

      try {
        await booksMarketplace.addBook(ID, PRICE);
        await booksMarketplace.addBook(ID, PRICE);
      } catch (error) {
        err = error;
      }

      assert.ok(err instanceof Error);
      expect(isWithError(err, 'id already exists')).to.be.true;
    });
  });

  contract('removeBook', () => {
    xit('should remove book', async () => {
      await booksMarketplace.addBook(ID, PRICE);

      const { 0: booksIds } = await booksMarketplace.getBooks();
      assert.equal(booksIds.length, 1, 'should contains one book id');

      await booksMarketplace.removeBook(ID);

      const { 1: prices } = await booksMarketplace.getBooks();
      assert.equal(prices.length, 0, 'list of books should be empty');
    });

    it('should throw an error on removing non existing book', async () => {
      await booksMarketplace.addBook(ID, PRICE);

      const { 0: preRemoveBooksIds } = await booksMarketplace.getBooks();
      assert.equal(preRemoveBooksIds.length, 1, 'should contains one book id');

      try {
        await booksMarketplace.removeBook(`new${ID}`);
      } catch (error) {
        err = error;
      }

      assert.ok(err instanceof Error);
      expect(isWithError(err, 'Book does not exists')).to.be.true;
    });
  });

  contract('getBalance', () => {
    it('should return empty balance by default', async () => {
      assert.equal(await booksMarketplace.getBalance(), 0);
    });

    it('should return non-empty balance', async () => {
      await booksMarketplace.addBook(ID, PRICE);
      await booksMarketplace.buyBook(ID, { value: PRICE });
      assert.equal(await booksMarketplace.getBalance(), PRICE);
    });
  });

  contract('buyBook', () => {
    it('should assign book to wallet', async () => {
      await booksMarketplace.addBook(ID, PRICE);
      await booksMarketplace.buyBook(ID, { value: PRICE });
      const { 0: booksIds, 1: prices, 2: available, 3: sold } = await booksMarketplace.getBooks();
      expect(available[0]).to.be.true;
    });

    it('should throw wrong value error', async () => {
      await booksMarketplace.addBook(ID, PRICE);

      try {
        await booksMarketplace.buyBook(ID, { value: PRICE + 1 });
      } catch (error) {
        err = error;
      }

      assert.ok(err instanceof Error);
      expect(isWithError(err, 'wrong value')).to.be.true;
    });

    it('should throw error with already purchased book', async () => {
      await booksMarketplace.addBook(ID, PRICE);
      await booksMarketplace.buyBook(ID, { value: PRICE });

      try {
        await booksMarketplace.buyBook(ID, { value: PRICE });
      } catch (error) {
        err = error;
      }

      assert.ok(err instanceof Error);
      expect(isWithError(err, 'book already purchased')).to.be.true;
    });
  });
});
