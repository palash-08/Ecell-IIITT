'use client';

import React, { useState, useEffect } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';
import api from '@/lib/api';
import MessageTable from '@/components/admin/messages/MessageTable';
import MessageViewModal from '@/components/admin/messages/MessageViewModal';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-2">Contact Inquiries</h1>
          <p className="text-gray-500 font-medium text-lg">Manage questions and messages from the community.</p>
        </div>
        <button 
          onClick={fetchMessages}
          className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-black hover:border-gray-300 transition-all shadow-sm cursor-pointer"
          title="Refresh Messages"
        >
          <FiRefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <MessageTable 
        messages={messages} 
        loading={loading} 
        deleteMessage={deleteMessage} 
        setSelectedMessage={setSelectedMessage} 
        formatDate={formatDate} 
      />

      <MessageViewModal 
        selectedMessage={selectedMessage} 
        setSelectedMessage={setSelectedMessage} 
        deleteMessage={deleteMessage} 
        formatDate={formatDate} 
      />
    </div>
  );
}
