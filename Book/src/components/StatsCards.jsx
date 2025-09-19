import React from 'react';
import { BookOpen, TrendingUp, Clock, Users } from 'lucide-react';

const StatsCards = ({ books }) => {
  const stats = {
    total: books.length,
    available: books.filter(book => book.status === 'Available').length,
    issued: books.filter(book => book.status === 'Issued').length,
    genres: [...new Set(books.map(book => book.genre))].length
  };

  const statItems = [
    { label: 'Total Books', value: stats.total, icon: BookOpen, color: 'blue' },
    { label: 'Available', value: stats.available, icon: TrendingUp, color: 'green' },
    { label: 'Issued', value: stats.issued, icon: Clock, color: 'orange' },
    { label: 'Genres', value: stats.genres, icon: Users, color: 'purple' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className={`text-3xl font-bold text-${item.color}-600`}>{item.value}</p>
              </div>
              <Icon className={`h-8 w-8 text-${item.color}-600`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;