"use client";

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import api from "@/lib/api";
import { AnimatePresence } from "framer-motion";
import GalleryGrid from "@/components/admin/gallery/GalleryGrid";
import AddMediaModal from "@/components/admin/gallery/AddMediaModal";

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState([]);

  const fetchGallery = async () => {
    try {
      const res = await api.get("/gallery");
      setItems(res.data.data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-black mb-2">
            Media <span className="text-[#FFB800]">Gallery.</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Manage photos and videos across all events.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black hover:bg-[#FFB800] hover:text-black transition-all shadow-xl uppercase tracking-widest text-sm cursor-pointer w-full md:w-auto"
        >
          <FiPlus size={20} />
          Add Media
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading gallery...</p>
        </div>
      ) : (
        <GalleryGrid
          items={items}
          handleDelete={handleDelete}
        />
      )}

      <AnimatePresence>
        {showAddModal && (
          <AddMediaModal
            setShowAddModal={setShowAddModal}
            fetchGallery={fetchGallery}
            events={events}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
