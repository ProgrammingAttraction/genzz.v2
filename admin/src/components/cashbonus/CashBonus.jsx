import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaCalendarAlt, FaMoneyBill, FaGift, FaSpinner, 
  FaTimes, FaInfoCircle, FaSearch, FaUser, FaUsers, FaGlobe, 
  FaUserPlus, FaChevronDown, FaChevronUp, FaWallet, FaClock, 
  FaInfinity, FaTrash, FaCheckCircle, FaHourglassHalf, FaEye,
  FaEdit, FaBan, FaCheck, FaFilter, FaDownload, FaBell, FaTags
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import moment from 'moment';

const CashBonus = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bonuses, setBonuses] = useState([]);
  const [filteredBonuses, setFilteredBonuses] = useState([]);
  const [selectedBonus, setSelectedBonus] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bonusTypeFilter, setBonusTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Bonus Types for special occasions
  const bonusTypes = [
    { value: 'birthday', label: 'Birthday', icon: '🎂', color: 'bg-pink-100 text-pink-700' },
    { value: 'anniversary', label: 'Anniversary', icon: '💝', color: 'bg-rose-100 text-rose-700' },
    { value: 'festival', label: 'Festival', icon: '🎊', color: 'bg-orange-100 text-orange-700' },
    { value: 'holiday', label: 'Holiday', icon: '🏖️', color: 'bg-teal-100 text-teal-700' },
    { value: 'special_event', label: 'Special Event', icon: '⭐', color: 'bg-purple-100 text-purple-700' },
    { value: 'celebration', label: 'Celebration', icon: '🎉', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'thank_you', label: 'Thank You', icon: '🙏', color: 'bg-green-100 text-green-700' }
  ];
  
  // Form state with noExpiry option
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    expiresAt: '',
    noExpiry: false,
    bonusType: 'special_event',
    occasion: '',
    notes: ''
  });
  
  // User selection states
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSelectAll, setUserSelectAll] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch bonuses on component mount
  useEffect(() => {
    fetchBonuses();
    fetchUsers();
  }, []);

  // Filter bonuses based on search and filters
  useEffect(() => {
    let filtered = [...bonuses];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bonus => 
        bonus.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bonus.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bonus.occasion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bonus => bonus.status === statusFilter);
    }
    
    // Bonus type filter
    if (bonusTypeFilter !== 'all') {
      filtered = filtered.filter(bonus => bonus.bonusType === bonusTypeFilter);
    }
    
    setFilteredBonuses(filtered);
  }, [bonuses, searchTerm, statusFilter, bonusTypeFilter]);

  // Filter users based on search term
  useEffect(() => {
    if (userSearchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.player_id?.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [userSearchTerm, users]);

  // Fetch all cash bonuses
  const fetchBonuses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${base_url}/admin/cash-bonus/list`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBonuses(data.data);
        setFilteredBonuses(data.data);
      } else {
        toast.error('Failed to load bonuses');
      }
    } catch (error) {
      console.error('Error fetching bonuses:', error);
      toast.error('Failed to load bonuses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch(`${base_url}/admin/all-active-users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
        setFilteredUsers(data.data);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle user selection
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u._id === user._id);
      if (isSelected) {
        return prev.filter(u => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Select all users
  const handleSelectAll = () => {
    if (userSelectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([...filteredUsers]);
    }
    setUserSelectAll(!userSelectAll);
  };

  // Remove selected user
  const removeSelectedUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user._id !== userId));
  };

  // Clear all selected users
  const clearSelectedUsers = () => {
    setSelectedUsers([]);
    setUserSelectAll(false);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Bonus title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Bonus description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Bonus amount must be greater than 0';
    }

    // Validate expiry only if noExpiry is false
    if (!formData.noExpiry) {
      if (!formData.expiresAt) {
        newErrors.expiresAt = 'Expiry date is required';
      } else {
        const expiryDate = new Date(formData.expiresAt);
        if (expiryDate <= new Date()) {
          newErrors.expiresAt = 'Expiry date must be in the future';
        }
      }
    }

    if (selectedUsers.length === 0) {
      newErrors.users = 'Please select at least one user';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        expiresAt: formData.noExpiry ? null : new Date(formData.expiresAt).toISOString(),
        noExpiry: formData.noExpiry,
        bonusType: formData.bonusType,
        occasion: formData.occasion,
        notes: formData.notes,
        userIds: selectedUsers.map(user => user._id)
      };

      const response = await fetch(`${base_url}/admin/cash-bonus/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create bonus');
      }

      toast.success(`Bonus created for ${selectedUsers.length} users successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        expiresAt: '',
        noExpiry: false,
        bonusType: 'special_event',
        occasion: '',
        notes: ''
      });
      setSelectedUsers([]);
      setUserSelectAll(false);
      setShowCreateForm(false);
      
      // Refresh bonuses list
      fetchBonuses();

    } catch (error) {
      toast.error(error.message || 'Failed to create bonus');
      console.error('Error creating bonus:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete bonus
  const handleDeleteBonus = async (bonusId) => {
    if (!window.confirm('Are you sure you want to delete this bonus? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${base_url}/admin/cash-bonus/${bonusId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Bonus deleted successfully');
        fetchBonuses();
      } else {
        toast.error(data.message || 'Failed to delete bonus');
      }
    } catch (error) {
      console.error('Error deleting bonus:', error);
      toast.error('Failed to delete bonus');
    }
  };

  // View bonus details
  const handleViewDetails = (bonus) => {
    setSelectedBonus(bonus);
    setShowDetailsModal(true);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return { color: 'bg-green-100 text-green-700', icon: <FaCheckCircle className="mr-1" />, label: 'Active' };
      case 'expired':
        return { color: 'bg-red-100 text-red-700', icon: <FaBan className="mr-1" />, label: 'Expired' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: <FaHourglassHalf className="mr-1" />, label: status };
    }
  };

  // Get user status badge
  const getUserStatusBadge = (status) => {
    switch(status) {
      case 'claimed':
        return { color: 'bg-green-100 text-green-700', label: 'Claimed' };
      case 'unclaimed':
        return { color: 'bg-yellow-100 text-yellow-700', label: 'Unclaimed' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: status };
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Never Expires';
    return moment(date).format('DD MMM YYYY, hh:mm A');
  };

  // Get bonus type display
  const getBonusTypeDisplay = (type) => {
    const found = bonusTypes.find(bt => bt.value === type);
    return found || { label: type, icon: '🎁', color: 'bg-gray-100 text-gray-700' };
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBonuses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBonuses.length / itemsPerPage);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setBonusTypeFilter('all');
    setCurrentPage(1);
  };

  return (
    <section className="font-bai h-screen bg-gray-50">
      <Toaster position="top-right" autoClose={5000} />
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex">
        <main className="w-full mx-auto px-4 py-8">
          <div className="w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <FaGift className="text-purple-600" /> Cash Bonus Management
                  </h1>
                  <p className="text-sm md:text-base text-gray-500 mt-1">
                    Create and manage cash bonuses for special occasions
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium flex items-center gap-2 shadow-sm"
                >
                  <FaPlus /> Create New Bonus
                </button>
              </div>
            </div>

            {/* Create Bonus Form */}
            {showCreateForm && (
              <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                  <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                    <FaGift /> Create New Cash Bonus
                  </h2>
                  <p className="text-purple-100 text-sm mt-1">
                    Create special occasion bonuses for your users
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 text-gray-700 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-5">
                      {/* Bonus Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bonus Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Bonus Name"
                          className={`w-full px-4 py-3 text-gray-700 border rounded-lg outline-purple-500 focus:border-purple-500 ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                            <FaInfoCircle /> {errors.title}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Describe the bonus and its purpose..."
                          className={`w-full px-4 py-3 text-gray-700 border rounded-lg outline-purple-500 focus:border-purple-500 resize-none ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                        )}
                      </div>

                      {/* Bonus Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bonus Amount (BDT) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaBangladeshiTakaSign className="text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="500"
                            className={`w-full pl-10 pr-4 py-3 text-gray-700 border rounded-lg outline-purple-500 focus:border-purple-500 ${
                              errors.amount ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.amount && (
                          <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                        )}
                      </div>

                      {/* No Expiry Checkbox */}
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <input
                          type="checkbox"
                          name="noExpiry"
                          checked={formData.noExpiry}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-purple-600 rounded"
                        />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FaInfinity className="text-purple-600" /> No Expiry
                          </label>
                          <p className="text-xs text-gray-500">Bonus never expires (useful for permanent bonuses)</p>
                        </div>
                      </div>

                      {/* Expiry Date - Only show if noExpiry is false */}
                      {!formData.noExpiry && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaCalendarAlt className="text-gray-400" />
                            </div>
                            <input
                              type="datetime-local"
                              name="expiresAt"
                              value={formData.expiresAt}
                              onChange={handleInputChange}
                              min={new Date().toISOString().slice(0, 16)}
                              className={`w-full pl-10 pr-4 py-3 text-gray-700 border rounded-lg outline-purple-500 focus:border-purple-500 ${
                                errors.expiresAt ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                          </div>
                          {errors.expiresAt && (
                            <p className="mt-1 text-sm text-red-500">{errors.expiresAt}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Users must claim the bonus before this date and time
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                      {/* Bonus Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bonus Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {bonusTypes.map(type => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, bonusType: type.value }))}
                              className={`p-3 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                                formData.bonusType === type.value
                                  ? `${type.color} border-purple-500 ring-2 ring-purple-200`
                                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                              }`}
                            >
                              <span className="text-xl">{type.icon}</span>
                              <span className="text-sm font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
    

                      {/* User Selection */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Users <span className="text-red-500">*</span>
                          </label>
                          {selectedUsers.length > 0 && (
                            <button
                              type="button"
                              onClick={clearSelectedUsers}
                              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <FaTimes /> Clear All
                            </button>
                          )}
                        </div>

                        {/* Selected Users Display */}
                        {selectedUsers.length > 0 && (
                          <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex flex-wrap gap-2">
                              {selectedUsers.map(user => (
                                <div
                                  key={user._id}
                                  className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg"
                                >
                                  <FaUser className="text-sm" />
                                  <span className="text-sm font-medium">
                                    {user.username || user.email}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeSelectedUser(user._id)}
                                    className="text-purple-500 hover:text-red-500"
                                  >
                                    <FaTimes className="text-xs" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-purple-600 mt-2">
                              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                            </p>
                          </div>
                        )}

                        {errors.users && (
                          <p className="mt-1 text-sm text-red-500 mb-2">{errors.users}</p>
                        )}

                        {/* User Selector Toggle */}
                        <button
                          type="button"
                          onClick={() => setShowUserSelector(!showUserSelector)}
                          className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg flex items-center justify-between hover:border-purple-300"
                        >
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-gray-400" />
                            <span className="text-gray-600">
                              {showUserSelector ? 'Hide User List' : 'Browse Users to Assign'}
                            </span>
                          </div>
                          {showUserSelector ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        {/* User Selector */}
                        {showUserSelector && (
                          <div className="mt-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium text-gray-700">Select Users</h4>
                              <label className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  checked={userSelectAll}
                                  onChange={handleSelectAll}
                                  className="h-4 w-4 text-purple-600 rounded"
                                />
                                <span className="ml-2 text-gray-500">Select All</span>
                              </label>
                            </div>

                            {/* Search Bar */}
                            <div className="relative mb-4">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="Search users by username, email, player ID..."
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-500 text-gray-500 outline-purple-500"
                              />
                            </div>

                            {/* Users List */}
                            <div className="max-h-60 overflow-y-auto">
                              {loadingUsers ? (
                                <div className="flex justify-center py-4">
                                  <FaSpinner className="animate-spin text-purple-500" />
                                </div>
                              ) : filteredUsers.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No users found</p>
                              ) : (
                                <div className="space-y-2">
                                  {filteredUsers.map(user => {
                                    const isSelected = selectedUsers.some(u => u._id === user._id);
                                    return (
                                      <div
                                        key={user._id}
                                        onClick={() => toggleUserSelection(user)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                                          isSelected
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            isSelected ? 'bg-purple-100' : 'bg-gray-100'
                                          }`}>
                                            <FaUser className={isSelected ? 'text-purple-600' : 'text-gray-400'} />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-800">
                                              {user.username || user.email}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {user.player_id && `ID: ${user.player_id} | `}
                                              {user.firstName && user.lastName 
                                                ? `${user.firstName} ${user.lastName}` 
                                                : user.email
                                              }
                                            </div>
                                          </div>
                                        </div>
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => {}}
                                          className="h-4 w-4 text-purple-600 rounded"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Selected users will receive this cash bonus automatically.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  {(formData.title || formData.amount || selectedUsers.length > 0) && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <h3 className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
                        <FaGift /> Bonus Preview
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Title</p>
                          <p className="font-medium text-gray-800">{formData.title || 'Not set'}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-bold text-purple-600">
                            {formData.amount ? `${formData.amount} BDT` : 'Not set'}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Expiry</p>
                          <p className="font-medium text-gray-800 flex items-center gap-1">
                            {formData.noExpiry ? (
                              <>
                                <FaInfinity className="text-green-500" /> Never Expires
                              </>
                            ) : (
                              formData.expiresAt ? formatDate(formData.expiresAt) : 'Not set'
                            )}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Users</p>
                          <p className="font-medium text-gray-800">
                            {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="mt-6 flex flex-col-reverse md:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setFormData({
                          title: '',
                          description: '',
                          amount: '',
                          expiresAt: '',
                          noExpiry: false,
                          bonusType: 'special_event',
                          occasion: '',
                          notes: ''
                        });
                        setSelectedUsers([]);
                      }}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" /> Creating...
                        </>
                      ) : (
                        <>
                          <FaGift /> Create Bonus
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filters and Search */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search bonuses by title, description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 outline-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 outline-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>

                {/* Bonus Type Filter */}
                <select
                  value={bonusTypeFilter}
                  onChange={(e) => setBonusTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 outline-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Types</option>
                  {bonusTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                {/* Reset Filters */}
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                  <FaTimes /> Reset
                </button>
              </div>
            </div>

            {/* Bonuses Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Users</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expiry</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <FaSpinner className="animate-spin mx-auto text-purple-500 text-2xl" />
                          <p className="mt-2 text-gray-500">Loading bonuses...</p>
                        </td>
                      </tr>
                    ) : currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <FaGift className="mx-auto text-gray-400 text-4xl mb-3" />
                          <p className="text-gray-500">No bonuses found</p>
                          <button
                            onClick={() => setShowCreateForm(true)}
                            className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
                          >
                            Create your first bonus
                          </button>
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((bonus) => {
                        const statusBadge = getStatusBadge(bonus.status);
                        const bonusTypeDisplay = getBonusTypeDisplay(bonus.bonusType);
                        const totalUsers = bonus.users?.length || 0;
                        const claimedUsers = bonus.users?.filter(u => u.status === 'claimed').length || 0;
                        const hasNoExpiry = bonus.noExpiry === true;
                        
                        return (
                          <tr key={bonus._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-800">{bonus.title}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{bonus.description}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bonusTypeDisplay.color}`}>
                                <span>{bonusTypeDisplay.icon}</span> {bonusTypeDisplay.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-purple-600">{bonus.amount} BDT</p>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">{totalUsers}</span> total
                                </p>
                                <p className="text-xs text-green-600">
                                  {claimedUsers} claimed
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                {statusBadge.icon} {statusBadge.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                {hasNoExpiry ? (
                                  <span className="inline-flex items-center gap-1 text-green-600">
                                    <FaInfinity /> Never Expires
                                  </span>
                                ) : (
                                  <>
                                    <p className="text-gray-700">{formatDate(bonus.expiresAt)}</p>
                                    {bonus.expiresAt && new Date(bonus.expiresAt) < new Date() && bonus.status === 'active' && (
                                      <p className="text-xs text-red-500 mt-1">Expired</p>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewDetails(bonus)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                                {bonus.status === 'active' && (
                                  <button
                                    onClick={() => handleDeleteBonus(bonus._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Bonus"
                                  >
                                    <FaTrash />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredBonuses.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBonuses.length)} of {filteredBonuses.length} bonuses
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Bonus Details Modal */}
      {showDetailsModal && selectedBonus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <FaGift /> Bonus Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:bg-purple-500 rounded-lg p-2 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              {/* Bonus Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Title</p>
                  <p className="font-semibold text-gray-800">{selectedBonus.title}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-semibold text-gray-800">{getBonusTypeDisplay(selectedBonus.bonusType).label}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-bold text-purple-600 text-xl">{selectedBonus.amount} BDT</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Expiry</p>
                  {selectedBonus.noExpiry ? (
                    <p className="font-semibold text-green-600 flex items-center gap-1">
                      <FaInfinity /> Never Expires
                    </p>
                  ) : (
                    <p className="font-semibold text-gray-800">{formatDate(selectedBonus.expiresAt)}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedBonus.status).color}`}>
                    {getStatusBadge(selectedBonus.status).icon} {getStatusBadge(selectedBonus.status).label}
                  </span>
                </div>
                {selectedBonus.occasion && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Occasion</p>
                    <p className="font-semibold text-gray-800">{selectedBonus.occasion}</p>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{selectedBonus.description}</p>
                </div>
              </div>
              
              {/* Notes */}
              {selectedBonus.notes && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{selectedBonus.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Users List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUsers /> Users ({selectedBonus.users?.length || 0})
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Claimed At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedBonus.users?.map((user, idx) => (
                        <tr key={user.userId?._id || idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-800">{user.username || user.userId?.username || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{user.email || user.userId?.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUserStatusBadge(user.status).color}`}>
                              {getUserStatusBadge(user.status).label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {user.claimedAt ? formatDate(user.claimedAt) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CashBonus;