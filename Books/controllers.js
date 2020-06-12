const express = require('express');

const BooksService = require('./services.js');
const {
    validateFields
} = require('../utils');
const {
    authorizeAndExtractToken
} = require('../security/Jwt');
const {
    ServerError
} = require('../errors');
const {
    authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        name,
        authorId,
        genres
    } = req.body;

    try {
        // do logic
        const fieldsToBeValidated = {
            name: {
                value: name,
                type: 'alpha'
            },
            authorId: {
                value: authorId,
                type: 'ascii'
            },
            genres: {
                    value: genres,
                    type: 'alpha'
            }
        }
        validateFields(fieldsToBeValidated);

        await BooksService.add(name, authorId, genres);
        res.status(201).end();

    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        // pot sa primesc eroare si ca genul nu e bun, trebuie verificat mesajul erorii
        // HINT err.message
        if (err.message) {
            next(new ServerError("Error to genre", 400))
        }
        next(err);
    }
});

router.get('/', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    try {
        // do logic
        const books = await BooksService.getAll();
        res.json(books);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    const {
        id
    } = req.params;

    try {
        // do logic
        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });

        const book = await BooksService.getById(id);
        res.json(book);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/authors/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    const {
        id
    } = req.params;

    try {
        // do logic
        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });

        const author = await BooksService.getByAuthorId(id);
        res.json(author);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;

    const {
        name,
        authorId,
        genres
    } = req.body;

    try {
       // do logic
       const fieldsToBeValidated = {
            id: {
                value: id,
                type: 'ascii'
            },
            name: {
                value: name,
                type: 'alpha'
            },
            authorId: {
                value: authorId,
                type: 'ascii'
            },
            genre: {
                    value: genres[i],
                    type: 'alpha'
            }
        }
        validateFields(fieldsToBeValidated);

        await BooksService.updateById(id, name, authorId, genres);
        res.status(204).end();

    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 

        // pot sa primesc eroare si ca genul nu e bun, trebuie verificat mesajul erorii
        // HINT err.message
        if (err.message) {
            next(new ServerError("Error to genre", 400))
        }
        next(err);
    }
});

router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        // do logic
        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });

        await BooksService.deleteById(id);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

module.exports = router;