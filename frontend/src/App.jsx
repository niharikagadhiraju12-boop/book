import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);

  // Get books from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  // Add book to MongoDB
  const addBook = () => {
    if (!title || !author) {
      alert("Please enter title and author");
      return;
    }

    fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        author: author
      })
    })
      .then((response) => response.json())
      .then((newBook) => {
        setBooks([...books, newBook]);
        setTitle("");
        setAuthor("");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div className="container">
      <h1>📚 Book Library</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <button onClick={addBook}>
          Add Book
        </button>
      </div>

      <h2>Books</h2>

      <div className="books">
        {books.map((book) => (
          <div className="book" key={book._id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;