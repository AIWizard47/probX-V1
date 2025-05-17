import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import axios from 'axios';

export default function Faq() {
  // const [faqs, setFaqs] = useState([
  //   { id: 1, question: 'What is this application?', answer: 'This is a dashboard application with FAQ management capabilities.', isActive: true },
  //   { id: 2, question: 'How do I add a new FAQ?', answer: 'Use the form at the top of the FAQ manager to add new questions and answers.', isActive: true },
  //   { id: 3, question: 'Can I edit existing FAQs?', answer: 'Yes, click the edit button next to any FAQ to modify it.', isActive: false },
  // ]);

  // get faq


const [newFaq, setNewFaq] = useState({ question: '', answer: '', isActive: true });
  const [editingFaq, setEditingFaq] = useState(null);
  const [expandedFaqs, setExpandedFaqs] = useState({});
const [faqs, setFaqs] = useState([]);

useEffect(() => {
  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token missing. Please login.");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/admin/faq/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.faqs)) {
        setFaqs(response.data.faqs);
      } else {
        console.error("Unexpected response format:", response.data);
        alert("Failed to load FAQs.");
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error.response?.data || error.message);
      alert("Error loading FAQs. Please try again.");
    }
  };

  fetchFaqs();
}, []);



  // Add new FAQ
  const handleAddFaq = async () => {
  if (newFaq.question.trim() === '' || newFaq.answer.trim() === '') {
    alert('Please fill in both question and answer fields');
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }

    const response = await axios.post(
      "http://localhost:3000/api/admin/faq/add",
      {
        question: newFaq.question,
        answer: newFaq.answer,
        isActive: newFaq.isActive
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 201 || response.data.message === "FAQ Added") {
      const newId = response.data.id || (faqs.length > 0 ? Math.max(...faqs.map(faq => faq.id)) + 1 : 1);
      setFaqs([...faqs, { ...newFaq, id: newId }]);
      setNewFaq({ question: '', answer: '', isActive: true });
      alert("FAQ added successfully!");
    } else {
      alert("Unexpected response from the server.");
    }
  } catch (error) {
    console.error("Error adding FAQ:", error.response?.data || error.message);
    alert("Failed to add FAQ. Please try again.");
  }
};

  // Delete FAQ
const handleDeleteFaq = async (id) => {
  if (window.confirm('Are you sure you want to delete this FAQ?')) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        return;
      }

      await axios.delete(`http://localhost:3000/api/admin/faq/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state after successful deletion
      setFaqs(faqs.filter(faq => faq.id !== id));

      // Cancel edit mode if this FAQ was being edited
      if (editingFaq && editingFaq.id === id) {
        setEditingFaq(null);
      }

      alert("FAQ deleted successfully!");
    } catch (error) {
      console.error("Error deleting FAQ:", error.response?.data || error.message);
      alert("Failed to delete FAQ. Please try again.");
    }
  }
};

const handleEditStart = (faq) => {
  setEditingFaq({ ...faq }); // Make a copy to avoid mutating the original object
};

  // Start editing FAQ
const handleEditSubmit = async () => {
  if (!editingFaq || !editingFaq.id) {
    alert("No FAQ selected for editing.");
    return;
  }

  if (editingFaq.question.trim() === '' || editingFaq.answer.trim() === '') {
    alert('Please fill in both question and answer fields');
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing. Please login again.");
      return;
    }

    // API call to update the FAQ
    await axios.put(
      `http://localhost:3000/api/admin/faq/update/${editingFaq.id}`,
      {
        question: editingFaq.question,
        answer: editingFaq.answer,
        isActive: editingFaq.isActive,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update local state with the edited FAQ
    setFaqs(faqs.map(faq => faq.id === editingFaq.id ? editingFaq : faq));
    setEditingFaq(null);
    alert("FAQ updated successfully!");
  } catch (error) {
    console.error("Error updating FAQ:", error.response?.data || error.message);
    alert("Failed to update FAQ. Please try again.");
  }
};
  // Cancel editing
  const handleEditCancel = () => {
    setEditingFaq(null);
  };

  // Save edited FAQ
  const handleEditSave = () => {
    if (editingFaq.question.trim() === '' || editingFaq.answer.trim() === '') {
      alert('Please fill in both question and answer fields');
      return;
    }

    setFaqs(faqs.map(faq =>
      faq.id === editingFaq.id ? editingFaq : faq
    ));
    setEditingFaq(null);
  };

  // Toggle FAQ active status
  const handleToggleActive = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }

    // Send PATCH request to toggle isActive status
    await axios.patch(`http://localhost:3000/api/admin/faq/toggle/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update UI state only if backend update succeeded
    setFaqs(faqs.map(faq =>
      faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
    ));
  } catch (error) {
    console.error("Error toggling active status:", error.response?.data || error.message);
    alert("Failed to toggle FAQ status. Please try again.");
  }
};

  // Toggle FAQ expansion (for viewing answers)
  const handleToggleExpand = (id) => {
    setExpandedFaqs({
      ...expandedFaqs,
      [id]: !expandedFaqs[id]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">FAQ Manager</h2>

      {/* Add FAQ Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-medium mb-4">Add New FAQ</h3>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="question">
              Question
            </label>
            <input
              id="question"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              placeholder="Enter FAQ question"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="answer">
              Answer
            </label>
            <textarea
              id="answer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              placeholder="Enter FAQ answer"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-600"
                checked={newFaq.isActive}
                onChange={(e) => setNewFaq({ ...newFaq, isActive: e.target.checked })}
              />
              <span className="text-gray-700">Active</span>
            </label>
          </div>

          <button
            onClick={handleAddFaq}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* FAQ List */}
      <div>
        <h3 className="text-lg font-medium mb-4">Manage FAQs</h3>

        {faqs.length === 0 ? (
          <p className="text-gray-500 italic">No FAQs available</p>
        ) : (
          <ul className="space-y-4">
            {faqs.map(faq => (
              <li
                key={faq.id}
                className={`border rounded-lg ${faq.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
              >
                {editingFaq && editingFaq.id === faq.id ? (
                  // Edit mode
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Editing FAQ #{faq.id}</h4>
                    <div className="mb-3">
                      <label className="block text-gray-700 mb-1 text-sm">
                        Question
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={editingFaq.question}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-gray-700 mb-1 text-sm">
                        Answer
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        value={editingFaq.answer}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-blue-600"
                          checked={editingFaq.isActive}
                          onChange={(e) => setEditingFaq({ ...editingFaq, isActive: e.target.checked })}
                        />
                        <span className="text-gray-700">Active</span>
                      </label>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleEditSubmit}
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
                      <div
                        className="flex items-center cursor-pointer flex-1"
                        onClick={() => handleToggleExpand(faq.id)}
                      >
                        {expandedFaqs[faq.id] ? (
                          <ChevronUp size={20} className="text-gray-600 mr-2" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600 mr-2" />
                        )}
                        <h4 className="font-medium text-gray-800">{faq.question}</h4>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(faq.id)}
                          className={`px-2 py-1 text-xs rounded-md ${
                            faq.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => handleEditStart(faq)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          aria-label="Edit FAQ"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          aria-label="Delete FAQ"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>

                    {expandedFaqs[faq.id] && (
                      <div className="mt-2 pl-7 text-gray-600 border-t pt-2">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}