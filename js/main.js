const books = [];
const RENDER_EVENT = "renderEvent";

function addBook() {
  const titleBook = document.getElementById("titleBook").value;
  const authorBook = document.getElementById("authorBook").value;
  const yearsBook = document.getElementById("yearsBook").value;
  const isCompleted = document.getElementById("isCompleted");

  let status;
  if (isCompleted.checked) {
    status = true;
  } else {
    status = false;
  }

  books.push({
    id: +new Date(),
    title: titleBook,
    author: authorBook,
    year: Number(yearsBook),
    isCompleted: status,
  });

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const unCompleted = document.getElementById("unComplete");
  unCompleted.innerHTML = "";

  const isCompleted = document.getElementById("isComplete");
  isCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unCompleted.append(bookElement);
    } else {
      isCompleted.append(bookElement);
    }
  }
});

function makeBook(objectBook) {
  const textTitle = document.createElement("p");
  textTitle.classList.add("itemTitle");
  textTitle.innerHTML = `${objectBook.title} - ${objectBook.year}`;

  const textAuthor = document.createElement("p");
  textAuthor.classList.add("itemAuthor");
  textAuthor.innerText = objectBook.author;

  const textContainer = document.createElement("div");
  textContainer.classList.add("itemText");
  textContainer.append(textTitle, textAuthor);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("itemAction");

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(textContainer);
  container.setAttribute("id", `book-${objectBook.id}`);

  if (objectBook.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undoButton");
    undoButton.innerHTML = `<i class="fa-solid fa-rotate-left"></i>`;

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(objectBook.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton");
    trashButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(objectBook.id);
    });

    actionContainer.append(undoButton, trashButton);
    container.append(actionContainer);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("checkButton");
    checkButton.innerHTML = `<i class="fa-solid fa-check"></i>`;

    checkButton.addEventListener("click", function () {
      addBookToCompleted(objectBook.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton");
    trashButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(objectBook.id);
    });

    actionContainer.append(checkButton, trashButton);
    container.append(actionContainer);
  }
  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  // Show the custom dialog using sweetalert2
  Swal.fire({
    title: "Apakah anda yakin ingin menghapus buku ini?",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      books.splice(findBookIndex(bookId), 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  });
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

document.addEventListener("DOMContentLoaded", function () {
  const saveForm = document.getElementById("formBuku");
  const formSearch = document.getElementById("searchBook");
  saveForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  formSearch.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputSearch = document.getElementById("searchBookTitle").value;
    bookSearch(inputSearch);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function searchBooks() {
  const inputSearch = document.getElementById("searchBookTitle").value.trim();
  const booksToDisplay = [];

  for (const book of books) {
    const title = book.title.toLowerCase();
    const author = book.author.toLowerCase();

    if (title.includes(inputSearch) || author.includes(inputSearch)) {
      booksToDisplay.push(book);
    }
  }

  displayBooks(booksToDisplay);
}

function bookSearch(keyword) {
  const booksToDisplay = [];

  for (const book of books) {
    const title = book.title.toLowerCase();

    if (title.includes(keyword)) {
      booksToDisplay.push(book);
    }
  }

  displayBooks(booksToDisplay);
}

function displayBooks(booksToDisplay) {
  const unCompleted = document.getElementById("unComplete");
  unCompleted.innerHTML = "";

  const isCompleted = document.getElementById("isComplete");
  isCompleted.innerHTML = "";

  for (const book of booksToDisplay) {
    const bookElement = makeBook(book);

    if (!book.isCompleted) {
      unCompleted.append(bookElement);
    } else {
      isCompleted.append(bookElement);
    }
  }
}

formSearch.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputSearch = document.getElementById("searchBookTitle").value;
  bookSearch(inputSearch);
});
