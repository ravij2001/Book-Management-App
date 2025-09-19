import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { BookProvider, useBooks } from './context/BookContext';
import {
  BookForm,
  BookSkeleton,
  BookTable,
  DeleteConfirmation,
  SearchFilters,
  StatsCards,
  Toast
} from './components';

const Dashboard = () => {
  const { books, loading, addBook, updateBook, deleteBook, toast, setToast } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBook, setDeletingBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const booksPerPage = 10;
  const genres = [...new Set(books.map(book => book.genre))];

  // Filter and paginate books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !genreFilter || book.genre === genreFilter;
    const matchesStatus = !statusFilter || book.status === statusFilter;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  // Event handlers
  const handleSaveBook = async (bookData) => {
    setFormLoading(true);
    let success;
    
    if (editingBook) {
      success = await updateBook(editingBook._id || editingBook.id, bookData);
    } else {
      success = await addBook(bookData);
    }
    
    setFormLoading(false);
    
    if (success) {
      setShowBookForm(false);
      setEditingBook(null);
    }
  };

  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    
    setFormLoading(true);
    const success = await deleteBook(deletingBook._id || deletingBook.id);
    setFormLoading(false);
    
    if (success) {
      setShowDeleteModal(false);
      setDeletingBook(null);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleDelete = (book) => {
    setDeletingBook(book);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  Book Management Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Manage your library collection</p>
              </div>
              <button
                onClick={() => setShowBookForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Book
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards books={books} />

        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          genres={genres}
          setCurrentPage={setCurrentPage}
        />

        {/* Books Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6">
            <BookSkeleton />
          </div>
        ) : (
          <BookTable
            paginatedBooks={paginatedBooks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            filteredBooks={filteredBooks}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            booksPerPage={booksPerPage}
          />
        )}
      </div>

      {/* Modals */}
      {showBookForm && (
        <BookForm
          book={editingBook}
          onSave={handleSaveBook}
          onCancel={() => {
            setShowBookForm(false);
            setEditingBook(null);
          }}
          isLoading={formLoading}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          book={deletingBook}
          onConfirm={handleDeleteBook}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingBook(null);
          }}
          isLoading={formLoading}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <BookProvider>
      <Dashboard />
    </BookProvider>
  );
};

export default App;