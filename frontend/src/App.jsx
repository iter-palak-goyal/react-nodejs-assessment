import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import NoteCard from "./components/NodeCard";
import Navbar from "./components/NavBar";

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notes"
      );

      setNotes(response.data);
      setFilteredNotes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add Note
  const addNote = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/notes", {
        title,
        description,
      });

      setTitle("");
      setDescription("");

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notes/${id}`
      );

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Note
  const editNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);

    setEditingId(note._id);
  };

  // Update Note
  const updateNote = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${editingId}`,
        {
          title,
          description,
        }
      );

      setTitle("");
      setDescription("");
      setEditingId(null);

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // Search
  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    const filtered = notes.filter(
      (note) =>
        note.title
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        note.description
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    setFilteredNotes(filtered);
  };

  // Sort Newest
  const newestFirst = () => {
    const sorted = [...filteredNotes].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    setFilteredNotes(sorted);
  };

  // Sort Oldest
  const oldestFirst = () => {
    const sorted = [...filteredNotes].sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt)
    );

    setFilteredNotes(sorted);
  };

  // Display All
  const displayAll = () => {
    setFilteredNotes(notes);
    setSearch("");
  };

  return (
    <div>
      <Navbar />

      <div className="container">

        {/* Add Note Form */}
        <div className="form-container">
          <h2>Add New Note</h2>

          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          ></textarea>

          {editingId ? (
            <button onClick={updateNote}>
              Update Note
            </button>
          ) : (
            <button onClick={addNote}>
              Add Note
            </button>
          )}
        </div>

        {/* Search & Sort */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={handleSearch}
          />

          <button onClick={newestFirst}>
            Newest First
          </button>

          <button onClick={oldestFirst}>
            Oldest First
          </button>

          <button onClick={displayAll}>
            Display All
          </button>
        </div>

        {/* Notes */}
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={deleteNote}
              onEdit={editNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;