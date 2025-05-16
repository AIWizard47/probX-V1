import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Search, Calendar, MapPin, Clock, Filter, Users, Tag, Save, X } from 'lucide-react';
import axios from 'axios';

export default function EventManager() {
  // Sample event categories based on the schema's EventCategary type
  const eventCategories = [
    "CRICKET", "CRYPTO", "YOUTUBE", "INSTAGRAM", "NEWS", "TWEET",
    "MOVIE", "STOCKMARKET", "FOOTBALL", "GAMING", "CHESS", "KABBADI", "PRIDICTX"
  ];

  // Initial events data - empty array
  const [events, setEvents] = useState([]);

  // Form state aligned with the schema
  const [newEvent, setNewEvent] = useState({
    eventTitle: '',
    cratedTime: formatDateTimeForInput(new Date()),
    startTime: formatDateTimeForInput(new Date()),
    endTime: formatDateTimeForInput(new Date(Date.now() + 3600000)), // 1 hour later
    eventLogo: '',
    categary: 'CRICKET',
    details: '',
    description: ''
  });

  // State for editing an event
  const [editingEvent, setEditingEvent] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'All'
  });

  // Helper function to format date to datetime-local input value
  function formatDateTimeForInput(date) {
    return new Date(date).toISOString().slice(0, 16);
  }

  // Add new event
  const handleAddEvent = async () => {
    if (newEvent.eventTitle.trim() === '' || newEvent.description.trim() === '') {
      alert('Please fill in all required fields (title and description)');
      return;
    }

    try {

        const token = localStorage.getItem("token");
      // Sending the newEvent data to the API
      const response = await axios.post("http://localhost:3000/api/admin/event", {
        eventTitle: newEvent.eventTitle,
        cratedTime: new Date(newEvent.cratedTime).toISOString(),
        startTime: new Date(newEvent.startTime).toISOString(),
        endTime: new Date(newEvent.endTime).toISOString(),
        eventLogo: newEvent.eventLogo,
        categary: newEvent.categary,
        details: newEvent.details,
        description: newEvent.description,
        },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if(response.data.message === "event created"){
        alert("Event added successfully!");

        // Add the event to the local state with the ID from the response (if available) or generate one
        const newId = response.data.id || (events.length > 0 ? Math.max(...events.map(event => event.id)) + 1 : 1);
        setEvents([...events, { ...newEvent, id: newId }]);

        // Reset the form
        setNewEvent({
          eventTitle: '',
          cratedTime: formatDateTimeForInput(new Date()),
          startTime: formatDateTimeForInput(new Date()),
          endTime: formatDateTimeForInput(new Date(Date.now() + 3600000)),

          eventLogo: '',
          categary: 'CRICKET',
          details: '',
          description: ''
        });
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert('Error adding event. Please try again.');
    }
  };

  // Delete event
  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));

      // If we're currently editing this event, cancel the edit
      if (editingEvent && editingEvent.id === id) {
        setEditingEvent(null);
      }
    }
  };

  // Start editing event
  const handleEditStart = (event) => {
    setEditingEvent({ ...event });
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingEvent(null);
  };

  // Save edited event
  const handleEditSave = () => {
    if (editingEvent.eventTitle.trim() === '' || editingEvent.description.trim() === '') {
      alert('Please fill in all required fields (title and description)');
      return;
    }

    setEvents(events.map(event =>
      event.id === editingEvent.id ? editingEvent : event
    ));
    setEditingEvent(null);
  };

  // Handle search input change
const handleSearchChange = async (category) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:3000/api/admin/event/category/${category}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEvents(response.data.events);
  } catch (error) {
    console.error("Failed to fetch events:", error.response?.data || error.message);
  }
};





const handleCategoryFilterChange = (category) => {
    setFilters({
      ...filters,
      category: category
    });
    handleSearchChange(category);
};

useEffect(() => {
  if (filters.category) {
    handleSearchChange(filters.category);
  }
}, [filters.category]);


  // Format date for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const searchEvents = async (searchText) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`http://localhost:3000/api/admin/event/search/${encodeURIComponent(searchText)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEvents(response.data.events);
  } catch (error) {
    console.error("Search failed:", error.response?.data || error.message);
    setEvents([]);  // clear or handle no results state
  }
};


  return (
    <div className="bg-white rounded-lg shadow p-6">

      <h2 className="text-2xl font-bold mb-6">Event Manager</h2>


      {/* Add Event Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-medium mb-4">Add New Event</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="eventTitle">
              Event Title *
            </label>
            <input
              id="eventTitle"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={newEvent.eventTitle}
              onChange={(e) => setNewEvent({ ...newEvent, eventTitle: e.target.value })}
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="categary">
              Category
            </label>
            <select
              id="categary"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newEvent.categary}
              onChange={(e) => setNewEvent({ ...newEvent, categary: e.target.value })}
            >
              {eventCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="cratedTime">
              Created Time
            </label>
            <input
              id="cratedTime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="datetime-local"
              value={newEvent.cratedTime}
              onChange={(e) => setNewEvent({ ...newEvent, cratedTime: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="startTime">
              Start Time *
            </label>
            <input
              id="startTime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="datetime-local"
              value={newEvent.startTime}
              onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="endTime">
              End Time *
            </label>
            <input
              id="endTime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="datetime-local"
              value={newEvent.endTime}
              onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
            />
          </div>
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="eventLogo">
            Event Logo URL
          </label>
          <input
            id="eventLogo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={newEvent.eventLogo}
            onChange={(e) => setNewEvent({ ...newEvent, eventLogo: e.target.value })}
            placeholder="URL to event logo image"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="details">
            Details
          </label>
          <textarea
            id="details"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            value={newEvent.details}
            onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
            placeholder="Event details"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder="Event description"
          />
        </div>

        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Event
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search events..."
                // value={filters.searchTerm}
                // value={filters.searchTerm}
                    onChange={(e) => {
                        const searchTerm = e.target.value;
                        setFilters(prev => ({ ...prev, searchTerm }));
                        if(!searchTerm){

                        }else{
                            searchEvents(searchTerm);
                        }
                    }}
              />
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.category}
                onChange={(e) => handleCategoryFilterChange(e.target.value)}
              >
                <option value="All">All Categories</option>
                {eventCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div>
        <h3 className="text-lg font-medium mb-4">Manage Events</h3>

        {events.length === 0 ? (
          <p className="text-gray-500 italic">No events found. Try adjusting your filters or add a new event.</p>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div
                key={event.id}
                className="border rounded-lg border-gray-200 bg-white"
              >
                {editingEvent && editingEvent.id === event.id ? (
                  // Edit mode
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Editing Event #{event.id}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm">
                          Event Title *
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="text"
                          value={editingEvent.eventTitle}
                          onChange={(e) => setEditingEvent({ ...editingEvent, eventTitle: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1 text-sm">
                          Category
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={editingEvent.categary}
                          onChange={(e) => setEditingEvent({ ...editingEvent, categary: e.target.value })}
                        >
                          {eventCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm">
                          Created Time
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="datetime-local"
                          value={editingEvent.cratedTime}
                          onChange={(e) => setEditingEvent({ ...editingEvent, cratedTime: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1 text-sm">
                          Start Time *
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="datetime-local"
                          value={editingEvent.startTime}
                          onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1 text-sm">
                          End Time *
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="datetime-local"
                          value={editingEvent.endTime}
                          onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm">
                          Yes Price
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingEvent.yesPrice}
                          onChange={(e) => setEditingEvent({ ...editingEvent, yesPrice: parseFloat(e.target.value) || 5 })}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1 text-sm">
                          No Price
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingEvent.noPrice}
                          onChange={(e) => setEditingEvent({ ...editingEvent, noPrice: parseFloat(e.target.value) || 5 })}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1 text-sm">
                        Event Logo URL
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={editingEvent.eventLogo}
                        onChange={(e) => setEditingEvent({ ...editingEvent, eventLogo: e.target.value })}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1 text-sm">
                        Details
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        value={editingEvent.details}
                        onChange={(e) => setEditingEvent({ ...editingEvent, details: e.target.value })}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1 text-sm">
                        Description *
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleEditSave}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center"
                      >
                        <Save size={14} className="mr-1" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 flex items-center"
                      >
                        <X size={14} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-800">{event.eventTitle}</h3>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
                          <Tag size={12} className="mr-1" />
                          {event.categary}
                        </span>
                        <button
                          onClick={() => handleEditStart(event)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          aria-label="Edit Event"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          aria-label="Delete Event"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-2 text-sm">{event.details}</p>
                    <p className="text-gray-600 mb-4">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>Created: {formatDateTime(event.createdTime)}</span>

                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>Start: {formatDateTime(event.startTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>End: {formatDateTime(event.endTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag size={16} className="mr-2 text-gray-500" />
                        <span>Yes Price: ${event.yesPrice.toFixed(2)} / No Price: ${event.noPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}