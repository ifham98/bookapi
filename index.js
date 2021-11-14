const express = require("express");


//database
const Database = require("./database");

const MONGO_URI = "mongodb+srv://maai:<RfthBmi9-C_tTzv>@cluster0.2sxxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// initializing the application
const OurAPP = express();

OurAPP.use(express.json());


// specifying the route
OurAPP.get("/", (request, response) => {
    response.json({ message: "Server is working!!!!!!" });
});

/*
Route  - /book
Des    - to get all books
Access - Public
Method - GET
Params - none
Body   - none
*/
OurAPP.get("/book", (request, response) => {
    return response.json({ books: Database.Book});
});

/*
Route  - /book/:bookID
Des    - to get specific books
Access - Public
Method - GET
Params - bookID
Body   - none
*/
OurAPP.get("/book/:bookID", (request, response) => {
    const getBook = Database.Book.filter((book) => 
      book.ISBN === request.params.bookID);

    return response.json({book : getBook});
});

/*
Route  - /book/c/:category
Des    - to get a list books based on category
Access - Public
Method - GET
Params - category
Body   - none
*/
OurAPP.get("/book/c/:category", (request, response) => {
    const getBook = Database.Book.filter((book) => 
      book.category.includes(request.params.category)
        );

    return response.json({book : getBook});
});


/*
Route  - /book/d/:authors
Des    - to get a list of books based on author
Access - Public
Method - GET
Params - authors
Body   - none
*/
OurAPP.get("/book/d/:authors", (request, response) => {
    const getBook = Database.Book.filter((book) => 
      book.authors.includes(request.params.authors)
        );

    return response.json({book : getBook});
});

/*
Route  - /author
Des    - to get all authors
Access - Public
Method - GET
Params - none
Body   - none
*/
OurAPP.get("/author", (request, response) => {
    return response.json({author : Database.Author}); 
});

/*
Route  - /author/:name
Des    - to get all authors
Access - Public
Method - GET
Params - name
Body   - none
*/
OurAPP.get("/author/:name", (request, response) => {
    const getAuthor = Database.Author.filter((author) => 
    author.name.includes(request.params.name)
        );

    return response.json({author : getAuthor});
});


/*
Route  - /publication/
Des    - to get all publication
Access - Public
Method - GET
Params - none
Body   - none
*/
OurAPP.get("/publication", (request, response) => {
    return response.json({publication : Database.Publication}); 
});

/*
Route  - /publication/:name
Des    - to get specific publication
Access - Public
Method - GET
Params - name
Body   - none
*/
OurAPP.get("/publication/:name", (request, response) => {
    const getPublication = Database.Publication.filter((publication) => 
    publication.name.includes(request.params.name)
        );

    return response.json({publication : getPublication});
});

/*
Route  - /publication/:books
Des    - to get a list of publication based on a book
Access - Public
Method - GET
Params - books
Body   - none
*/
OurAPP.get("/publication/c/:books", (request, response) => {
    const getPublication = Database.Publication.filter((publication) => 
    publication.books.includes(request.params.books)
        );

    return response.json({publication : getPublication});
});

/*
Route  - /book/new
Des    - add a new book
Access - Public
Params - none
Method - POST
*/
OurAPP.post("/book/new", (req,res) => {
    const newBook = req.body;
    // console.log(newBook);  
    // return res.json({message: 'Book Added successfully'});

    //add new data
    Database.Book.push(newBook);
    return res.json(Database.Book);
});

/*
Route  - /author/new
Des    - add a new author
Access - Public
Params - none
Method - POST
*/
OurAPP.post("/author/new", (req, res) => {
    const {newAuthor} = req.body;
    // console.log(newAuthor);
    // return res.json({message: 'author was added!'});

    Database.Author.push(newAuthor);
    return res.json(Database.Author);
});

//Student Task - [Done]
/*
Route  - /publication/new
Des    - add a new publication
Access - Public
Params - none
Method - POST
*/
OurAPP.post("/publication/new", (req, res) => {
    const newPublication = req.body;

    // console.log(publication);
    // return res.json({message: 'Publication added!'});

    Database.Publication.push(newPublication);
    return res.json(Database.Publication);
});


/*
Route  - /book/update
Des    - update the details of the book
Access - Public
Params - ISBN
Method - PUT
*/
OurAPP.put("/book/update/:isbn", (req, res) => {
    const {updatedBook} = req.body;
    const {isbn} = req.params;

    console.log(updatedBook,isbn);

    const book = Database.Book.map((book) => {
        if (book.ISBN === isbn){
            return {...book, ...updatedBook}
        }

        return book;
    });

    return res.json(book);
});

/*
Route  - /book/updateTitle
Des    - update the title of the book
Access - Public
Params - ISBN
Method - PUT
*/
OurAPP.put("/book/updateTitle/:isbn", (req, res) => {
    const {updatedBook} = req.body;
    const {isbn} = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn){
            book.title = updatedBook.title;
            return;
        }
        return book;
    });

    return res.json(Database.Book);
});

/*
Route  - /book/update/:isbn
Des    - update new author to a book
Access - Public
Params - ISBN
Method - PUT
*/
OurAPP.put("/book/updateAuthor/:isbn", (req, res) => {
    const {newAuthor} = req.body;
    const {isbn} = req.params;

    //updating book database object
    Database.Book.forEach((book) => {
        //check if isbn no. match
        if (book.ISBN === isbn){
            //check if author already exist
            if(!book.authors.includes(newAuthor)){
                //if not, then push new author
                book.authors.push(newAuthor);
                return book;
            }
            //else return
            return book;
        }
        return book;
    });
    //updating author Database object
    Database.Author.forEach((author) => {
        //check if author id match
        if(author.id === newAuthor){
            //check if book already exist
            if(!author.books.includes(isbn)){
                //if not, then push new author
                author.books.push(isbn);
                return author;
            }
            //else return
            return author;
        }
        return author;
    })
    return res.json({ book: Database.Book, author: Database.Author });
});


/*
Route  - /author/update/:id
Des    - update any details of the author
Access - Public
Params - ID
Method - PUT
*/
OurAPP.put("/author/update/:id", (req, res) => {
    const {updateAuthor} = req.body;
    const {id} = req.params;

    console.log(updateAuthor,id);

    const author = Database.Author.map((author) => {
        if (author.id === parseInt(id)){
            return {...author, ...updateAuthor}
        }

        return author;
    });

    return res.json(author);
});

// Student Task - [Done]
/*
Route  - /author/updateName
Des    - update the name of the author
Access - Public
Params - id
Method - PUT
*/
OurAPP.put("/author/updateName/:id", (req, res) => {
    const {updateAuthor} = req.body;
    const {id} = req.params;

    Database.Author.forEach((author) => {
        if (author.id === parseInt(id)){
            author.name = updateAuthor.name;
            return;
        }
        return author;
    });

    return res.json(Database.Author);
});


/*
Route  - /book/delete/:isbn
Des    - delete a book
Access - Public
Params - ISBN
Method - DELETE
*/
OurAPP.delete("/book/delete/:isbn", (req, res) => {
    const {isbn} = req.params;
    
    const filteredBooks = Database.Book.filter((book) => 
        book.ISBN !== isbn 
        );

    Database.Book = filteredBooks;
    return res.json(Database.Book);
});

/*
Route  - /book/delete/author
Des    - delete an author from a book
Access - Public
Params - id, ISBN
Method - DELETE
*/
OurAPP.delete("/book/delete/author/:isbn/:id", (req, res) => {
    const {isbn, id} = req.params;
    
    //updating book database object
    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            if(!book.authors.includes(parseInt(id))){
                return;
            }
            book.authors = book.authors.filter(
                (databaseId) => databaseId !== parseInt(id));
            return book;
        }
        return book;
    });

    Database.Author.forEach((author) => {
        if(author.id === parseInt(id)){
            if(!author.books.includes(isbn)){
                return;
            }
            author.books = author.books.filter((book) => book !== isbn );
            return author;
        }
        return author;
    });
    return res.json({book: Database.Book, author: Database.Author});
});


/*
Route  - /author/delete/:id
Des    - delete an author
Access - Public
Params - id
Method - DELETE
*/
OurAPP.delete("/author/delete/:id", (req, res) => {
    const {id} = req.params;

    const filteredAuthors = Database.Author.filter(
        (author) => author.id !== parseInt(id));

    Database.Author = filteredAuthors;

    return res.json(Database.Author);
});


/*
Route  - /publication/delete
Des    - delete a publication
Access - Public
Params - id
Method - DELETE
*/
OurAPP.delete("/publication/delete/:id", (req, res) => {
    const {id} = req.params;

    const filteredPublication = Database.Publication.filter(
        (publication) => publication.id !== parseInt(id));

    Database.Publication = filteredPublication;

    return res.json(Database.Publication);
});

/*
Route  - /publication/delete/book
Des    - delete a book from a publication
Access - Public
Params - id, isbn
Method - DELETE
*/
OurAPP.delete("/publication/delete/book/:isbn/:id", (req, res) => {
    const {isbn, id} = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            book.publication = 0;
            return book;
        }
        return book;
    });
    
    Database.Publication.forEach((publication) => {
        if (publication.id === parseInt(id)) {
            const filteredBooks = publication.books.filter(
                (book) => book !== isbn);
            publication.books = filteredBooks;
            return publication;
        }
        return publication;
    });

    return res.json({book: Database.Book, publication: Database.Publication});
});


OurAPP.listen(4000, () => console.log("Server is running"));
