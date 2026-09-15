import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);

  // Get only the logged-in user's books
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/books`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  // Register or Login
  const handleAuth = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? "/api/login"
      : "/api/register";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        alert("Registration successful. Please login.");
        setIsLogin(true);
      }

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // Add book
  const addBook = async () => {
    if (!title || !author) {
      alert("Enter book title and author");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          author
        })
      });

      const newBook = await response.json();

      if (!response.ok) {
        alert(newBook.message);
        return;
      }

      setBooks([...books, newBook]);
      setTitle("");
      setAuthor("");

    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setBooks([]);
  };

  // Login/Register screen
  if (!token) {
    return (
      <div className="container">
        <h1>📚 Book Library</h1>

        <div className="auth-box">
          <h2>{isLogin ? "Login" : "Register"}</h2>

          <form onSubmit={handleAuth}>

            {!isLogin && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">
              {isLogin ? "Login" : "Register"}
            </button>

          </form>

          <p>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              className="switch-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? " Register" : " Login"}
            </button>
          </p>

        </div>
      </div>
    );
  }

  // Book Library screen
  return (
    <div className="container">

      <div className="header">
        <h1>📚 My Book Library</h1>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      <div className="form">

        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <button onClick={addBook}>
          Add Book
        </button>

      </div>

      <h2>My Books</h2>

      {books.map((book) => (
        <div className="book" key={book._id}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
        </div>
      ))}

    </div>
  );
}

export default App;