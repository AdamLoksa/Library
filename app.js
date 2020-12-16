// Selectors
const libraryButtons = document.querySelector('.books-list');
const formButtons = document.querySelectorAll('.form-popup button');

// Book library
const library = JSON.parse(localStorage.getItem('books-list')) || [];

//Obj constructor
class Book {
   constructor(title, author, readingStatus, bookID) {
      this.title = title;
      this.author = author;
      this.readingStatus = readingStatus;
      this.bookID = bookID;
   }
}


// Functions
function findBook(bookToFind) {
   let book = bookToFind.getAttribute('data-book-id')
   return library.find(item => item.bookID == book);
}

function changeReadingStatus(e) {
   let bookToChange = e.target.parentNode;
   let book = findBook(bookToChange);
   let bookIndex = library.indexOf(book);

   library[bookIndex].readingStatus = 'read';
   localStorage.setItem('books-list', JSON.stringify(library));
   bookToChange.parentNode.removeChild(bookToChange);
   addBookToDocument(book);
}

function deleteBook(e) {
   let bookToDelete = e.target.parentNode;
   let bookIndex = library.indexOf(findBook(bookToDelete));

   library.splice(bookIndex, 1);
   localStorage.setItem('books-list', JSON.stringify(library));
   bookToDelete.parentNode.removeChild(bookToDelete);
}

function addBookToDocument(book) {
   let bookList = `
   <li data-book-id="${book.bookID}" class="book">
      <div class="book__info">
         <p class="book-title">${book.title}</p>
         <p class="book-author">${book.author}</p>
      </div>
      <button id="${book.readingStatus === 'read' ? 'delete-book' : 'to-read'}" class="btn btn--book">${book.readingStatus === 'read' ? 'Delete' : 'Read'}</button>
   </li>
   `;

   let readingStatus = book.readingStatus === 'read' ? '.read' : '.to-read';
   document.querySelector(readingStatus).innerHTML += bookList;
}

function createBookID(str) {
   let newID = '';
   return str.replace(/[^a-zA-Z0-9 ]/g, '')
             .replace(/\s/g, '-')
             .toLowerCase()
             + '-' + Math.floor(Math.random() * (100 - 0 + 1)) + 0;
 }

function addBookToLibrary(title, author, readingStatus) {
   let bookID = createBookID(title);
   let newBook = new Book(title, author, readingStatus, bookID);

   library.push(newBook);
   localStorage.setItem('books-list', JSON.stringify(library));
   addBookToDocument(newBook);

   closeForm();
}

function changeLibraryContent(e) {
   if (e.target.id === 'add-book') {
      let form = document.querySelector('.form-popup');
      form.classList.add('active');
      setTimeout(function() { form.style = 'opacity: 1;' }, 10);
   } else if (e.target.id === 'to-read') {
      changeReadingStatus(e);
   } else if (e.target.id === 'delete-book') {
      deleteBook(e);
   }
}

function closeForm() {
   let form = document.querySelector('.form-popup');
   form.style = 'opacity: 0;'
   setTimeout(function() {
      form.classList.remove('active');
      document.querySelectorAll('input').forEach(input => input.value = '');
   }, 200);
}

function handleFormInput(e) {
   e.preventDefault();  

   let newBookTitle = document.getElementById('input-title').value;
   let newBookAuthor = document.getElementById('input-author').value;

   if (this.id === 'close-form') {
      closeForm();
   } else if (newBookTitle != '' && newBookAuthor != ''){
      if (e.target.id === 'add-read') {
         addBookToLibrary(newBookTitle, newBookAuthor, 'read');
      } else if (e.target.id === 'add-to-read') {
         addBookToLibrary(newBookTitle, newBookAuthor, 'to-read');
      }
   }
}

function loadLibrary() {
   library.forEach(book => addBookToDocument(book));
}


// Listeners
libraryButtons.addEventListener('click', changeLibraryContent);
formButtons.forEach(btn => btn.addEventListener('click', handleFormInput));


// Aplication start
loadLibrary();