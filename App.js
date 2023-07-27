import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import firebaseConfig from "./firebaseconfig";

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    
    const fetchBlogs = async () => {
      try {
        const snapshot = await db.collection("blogs").get();
        const blogData = snapshot.docs.map((doc) => doc.data());
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    
    try {
      await db.collection("blogs").add({
        title,
        content,
      });

      
      setTitle("");
      setContent("");

      
      const snapshot = await db.collection("blogs").get();
      const blogData = snapshot.docs.map((doc) => doc.data());
      setBlogs(blogData);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  return (
    <div>
      <h1>Anonymous Blogging System</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <br />
        <button type="submit">Create Blog</button>
      </form>
      <div>
        <h2>Recent Blogs:</h2>
        <ul>
          {blogs.map((blog, index) => (
            <li key={index}>
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
