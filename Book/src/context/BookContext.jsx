import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const BookContext = createContext();

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await api.getBooks();
      setBooks(data);
    } catch (error) {
      showToast('Failed to load books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData) => {
    try {
      const newBook = await api.addBook(bookData);
      setBooks(prev => [newBook, ...prev]);
      showToast('Book added successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to add book', 'error');
      return false;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      const updatedBook = await api.updateBook(id, bookData);
      setBooks(prev => prev.map(book => (book._id || book.id) === id ? updatedBook : book));
      showToast('Book updated successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to update book', 'error');
      return false;
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.deleteBook(id);
      setBooks(prev => prev.filter(book => (book._id || book.id) !== id));
      showToast('Book deleted successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to delete book', 'error');
      return false;
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const value = {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    showToast,
    toast,
    setToast
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};