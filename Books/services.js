const {
    Books
} = require('../data');

const add = async (name, authorId, genres) => {
    // create new Book obj
    // save it
    const book = new Books({
        name,
        genres,
        author
    });
    await book.save();
};

const getAll = async () => {
    // get all books
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'
    books = await Books.find({}).populate('author')

    return books.map(book =>{
        return {
            name: book.name,
            genres: book.genres,
            author: book.author.firstName + "-" + book.author.lastName
        }
    });
};

const getById = async (id) => {
    // get book by id
    // populate 'author' field
    // modify output so author is made of 'author.firstName author.lastName'
    books = await Books.findById(id).populate('author')

    return books.map(book =>{
        return {
            name: book.name,
            genres: book.genres,
            author: book.author.firstName + "-" + book.author.lastName            
        }
    });
};

const getByAuthorId = async (id) => {
    // get book by author id
    // modify output so author is made of 'author.firstName author.lastName'
    books = await Books.find({"author": id}).populate('author')

    return books.map(book =>{
        return {
            name: book.name,
            genres: book.genres,
            author: book.author.firstName + "-" + book.author.lastName            
        }
    });
};

const updateById = async (id, name, authorId, genres) => {
    // update by id
    await Books.findByIdAndUpdate(id, { name, genres, author});
};

const deleteById = async (id) => {
    // delete by id
    await Books.findByIdAndDelete(id);
};

module.exports = {
    add,
    getAll,
    getById,
    getByAuthorId,
    updateById,
    deleteById
}