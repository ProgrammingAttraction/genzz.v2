import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import { MdArrowDropDown } from 'react-icons/md';
import {
  FaFacebookF,
  FaTwitter,
  FaTelegramPlane,
  FaWhatsapp,
  FaCopy,
  FaHeadset,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaUserFriends,
  FaHistory,
  FaCalendarAlt,
  FaTimesCircle,
  FaCheck,
  FaUser,
  FaFacebookMessenger,
  FaInstagram,
  FaIdCard,
  FaEnvelope,
  FaClock ,
  FaCheckCircle,
} from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';
import { GiTrophy, GiCrownCoin } from 'react-icons/gi';
import { TbCalendarWeek, TbCalendarMonth } from 'react-icons/tb';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { TiWarningOutline } from 'react-icons/ti';
import { ImInfo } from 'react-icons/im';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../../context/UserContext';
import { HiIdentification } from "react-icons/hi";
import { GiGiftTrap } from 'react-icons/gi';
import { MdRefresh, MdInfoOutline, MdCheckCircle, MdAttachMoney } from 'react-icons/md';
import { FaFilter } from "react-icons/fa";

// Images
import popular_img from "../../assets/popular.png"
import dice_img from "../../assets/dice.png";
import user_img from "../../assets/user.png"
import bonus_img from "../../assets/bonus.png"
import affiliate_img from "../../assets/affiliate.png"
import question_img from "../../assets/question.png";
import teamwork_img from "../../assets/teamwork.png"
import party_img from "../../assets/party.png";
import link_img from "../../assets/link.png";
import download_img from "../../assets/cloud.png";
import support_img from "../../assets/support.png";
import medal_img from "../../assets/level/silver.png";
import silver_img from "../../assets/level/badge.png";
import gold_img from "../../assets/level/medal.png";
import diamond_img from "../../assets/level/diamond.png";
import platinum_img from "../../assets/level/platinum.png";
import weekly_img from "../../assets/weekly.jpg";
import monthly_img from "../../assets/monthly.jpg";
import slot_img from "../../assets/slot.png"
import controller_img from "../../assets/controller.png"
import popular_games from "../../assets/category/popular.svg";
import man from "../../assets/profileimages/man.png";
import man1 from "../../assets/profileimages/man1.png";
import man2 from "../../assets/profileimages/man2.png";
import man3 from "../../assets/profileimages/man3.png";
import man4 from "../../assets/profileimages/man4.png";
import man5 from "../../assets/profileimages/man5.png";
import man6 from "../../assets/profileimages/man6.png";
import bonusimg1 from "../../assets/bonus/bonus1.png";
import bonusimg2 from "../../assets/bonus/bonus2.png";
import bonusimg3 from "../../assets/bonus/bonus3.png";
import bonusimg4 from "../../assets/bonus/bonus4.png";
const profileImages = [man, man1, man2, man3, man4, man5, man6];

const getProfileImage = (username) => {
  if (!username) return man;
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % profileImages.length;
  return profileImages[index];
};

const Sidebar = ({ showPopup, setShowPopup, activeLeftTab, setActiveLeftTab }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { userData } = useUser();
  const { language, changeLanguage, t } = useContext(LanguageContext);

  const downloadFileAtURL = (url) => {
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const languages = [
    { code: 'bn', name: 'বাংলা', flag: 'https://images.5849492029.com//TCG_PROD_IMAGES/COUNTRY_FLAG/CIRCLE/BD.svg' },
    { code: 'en', name: 'English', flag: 'https://images.5849492029.com//TCG_PROD_IMAGES/COUNTRY_FLAG/CIRCLE/US.svg' }
  ];

  const menuItems = [
    { icon: popular_img, label: t?.casinoMenu || 'ক্যাসিনো', path: '/casino-games' },
    { icon: slot_img, label: t?.slotMenu || 'স্লট', path: '/slot-games' },
    { icon: popular_games, label: t?.popular || 'জনপ্রিয়', path: '/popular-game' },
    { icon: controller_img, label: t?.allGames || 'সকল গেমস', path: '/all-games' },
    { icon: user_img, label: t?.myAccount || 'আমার একাউন্ট', leftTab: t?.myAccount || 'আমার অ্যাকাউন্ট' },
    { icon: bonus_img, label: t?.bonus || 'বোনাস', leftTab: t?.bonus || 'বোনাস' },
    { icon: teamwork_img, label: t?.provider || 'প্রভাইডার', path: '/provider' },
    { icon: affiliate_img, label: t?.affiliate || 'এফিলিয়েট', path: '/affiliate-programme' },
    { icon: support_img, label: t?.contact || 'যোগাযোগ', path: '/contact' },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.label === (t?.myAccount || 'আমার একাউন্ট') && !userData) return false;
    return true;
  });

  const handleMenuClick = (item) => {
    if (item.label === (t?.downloadApp || 'ডাউনলোড অ্যাপ') && item.onClick) {
      item.onClick();
      return;
    }

    if (item.label === (t?.referralProgram || 'রেফারেল প্রোগ্রাম')) {
      if (!userData) {
        setShowAuthModal(true);
        setActiveTab('login');
      } else {
        setShowInvitePopup(true);
      }
    } else if (item.label === (t?.myAccount || 'আমার একাউন্ট') || item.label === (t?.bonus || 'বোনাস')) {
      if (!userData) {
        setShowAuthModal(true);
        setActiveTab('login');
      } else {
        setSelectedMenu(item);
        if (item.leftTab) setActiveLeftTab(item.leftTab);
        setShowPopup(true);
      }
    } else if (item.path) {
      navigate(item.path);
    } else {
      setSelectedMenu(item);
      if (item.leftTab) setActiveLeftTab(item.leftTab);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowInvitePopup(false);
    setSelectedMenu(null);
  };

  const closeAuthModal = () => setShowAuthModal(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setShowDropdown(false);
  };

  const MenuCard = ({ item, onClick }) => (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200 group"
    >
      <img src={item.icon} alt={item.label} className="w-5 h-5 group-hover:opacity-100 transition-opacity" />
      <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
    </div>
  );

  return (
    <>
      <div className="bg-white w-[280px] pb-[100px] pt-[30px] border-r border-gray-200 h-full fixed top-[70px] overflow-y-auto no-scrollbar left-0 px-3 py-4 shadow-sm">
        <div className="grid grid-cols-1 gap-2.5">
          {filteredMenuItems.map((item, index) => (
            <MenuCard key={index} item={item} onClick={() => handleMenuClick(item)} />
          ))}

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center w-full p-2.5 bg-gray-100 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <img src={language.flag} alt={language.name} className="w-5 h-5 mr-2 rounded-full" />
              <span className="flex-1 text-left text-sm font-medium">{language.name}</span>
              <MdArrowDropDown className={`text-gray-500 text-lg transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDropdown && (
              <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang)}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <img src={lang.flag} alt={lang.name} className="w-5 h-5 mr-2 rounded-full" />
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-[20px]">
            {/* Telegram */}
            <a href="https://t.me/+CUD2OZlCEOAxMTg0" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
              <div className="w-10 h-10 rounded-full bg-[#24A1DE] flex items-center justify-center shadow-md">
                <FaTelegramPlane className="text-white text-xl ml-[-2px]" />
              </div>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/61480897550" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
                <FaWhatsapp className="text-white text-2xl" />
              </div>
            </a>

            {/* Messenger */}
            <a target='_blank' href="https://tawk.to/chat/68a35260fcd547192dde87ce/1j6ibcsl1" className="transition-transform hover:scale-110">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#006AFF] via-[#A133FF] to-[#FF5C87] flex items-center justify-center shadow-md">
                <FaFacebookMessenger className="text-white text-xl" />
              </div>
            </a>

            {/* Instagram */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFB700] via-[#FF0069] to-[#7638FA] flex items-center justify-center shadow-md">
                <FaInstagram className="text-white text-xl" />
              </div>
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com/genzzzcasino" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
              <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-md">
                <FaFacebookF className="text-white text-xl" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          selectedMenu={selectedMenu}
          activeLeftTab={activeLeftTab}
          setActiveLeftTab={setActiveLeftTab}
        />
      )}

      {showInvitePopup && <InvitePopup onClose={handleClosePopup} />}

      {showAuthModal && (
        <AuthModal
          showAuthModal={showAuthModal}
          closeAuthModal={closeAuthModal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </>
  );
};

// Auth Modal Component
const AuthModal = ({ showAuthModal, closeAuthModal, activeTab, setActiveTab }) => {
  const { t, language } = useContext(LanguageContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    email: '',
    formError: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [referralCodeValid, setReferralCodeValid] = useState(false);
  const [referralCodeChecking, setReferralCodeChecking] = useState(false);
  const [referralCodeError, setReferralCodeError] = useState('');
  const [referrerInfo, setReferrerInfo] = useState(null);
  const otpInputRefs = useRef([]);
  const API_BASE_URL = import.meta.env.VITE_API_KEY_Base_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (showOtpModal && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, showOtpModal]);

  const checkReferralCode = async (code) => {
    if (!code) {
      setReferralCodeValid(false);
      setReferralCodeError('');
      setReferrerInfo(null);
      return;
    }

    setReferralCodeChecking(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/check-referral-code/${code}`);
      if (response.data.exists) {
        setReferralCodeValid(true);
        setReferralCodeError('');
        setReferrerInfo(response.data.referrer);
      } else {
        setReferralCodeValid(false);
        setReferralCodeError(t?.invalidReferral || 'অবৈধ রেফারেল কোড');
        setReferrerInfo(null);
      }
    } catch (error) {
      setReferralCodeValid(false);
      setReferralCodeError(t?.referralCheckError || 'রেফারেল কোড চেক করতে সমস্যা হয়েছে');
      setReferrerInfo(null);
    } finally {
      setReferralCodeChecking(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.formError) {
      setErrors(prev => ({ ...prev, [name]: '', formError: '' }));
    }
    if (name === 'referralCode') checkReferralCode(value);
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { password: '', confirmPassword: '', email: '', formError: '' };

    if (!formData.email) {
      newErrors.email = t?.emailRequired || 'ইমেইল প্রয়োজন';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = t?.invalidEmail || 'সঠিক ইমেইল দিন';
      valid = false;
    }

    if ((activeTab === 'login' || activeTab === 'register' || activeTab === 'reset-password') && !formData.password) {
      newErrors.password = t?.passwordRequired || 'পাসওয়ার্ড প্রয়োজন';
      valid = false;
    } else if ((activeTab === 'login' || activeTab === 'register' || activeTab === 'reset-password') && formData.password.length < 6) {
      newErrors.password = t?.passwordLength || 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে';
      valid = false;
    }

    if (activeTab === 'register' || activeTab === 'reset-password') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t?.passwordMismatch || 'পাসওয়ার্ড মিলছে না';
        valid = false;
      }
    }

    if (activeTab === 'register' && formData.referralCode && !referralCodeValid) {
      newErrors.formError = t?.invalidReferral || 'অবৈধ রেফারেল কোড';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      closeAuthModal();
      toast.success(t?.loginSuccess || 'সফলভাবে লগইন করা হয়েছে!');
      navigate("/");
      window.location.reload();
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        formError: error.response?.data?.message || t?.loginError || 'লগইন করতে সমস্যা হয়েছে'
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    if (formData.referralCode && !referralCodeValid) {
      setErrors(prev => ({ ...prev, formError: t?.invalidReferral || 'অবৈধ রেফারেল কোড' }));
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      closeAuthModal();
      toast.success(t?.registerSuccess || 'সফলভাবে নিবন্ধন করা হয়েছে!');
      navigate("/");
      window.location.reload();
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        formError: error.response?.data?.message || t?.registerError || 'নিবন্ধন করতে সমস্যা হয়েছে'
      }));
    }
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) return;

    try {
      await axios.post(`${API_BASE_URL}/auth/request-password-reset`, { email: formData.email });
      setOtpEmail(formData.email);
      setShowOtpModal(true);
      setCountdown(60);
      toast.success(t?.otpSent || 'OTP ইমেইলে পাঠানো হয়েছে');
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        formError: error.response?.data?.message || t?.resetPasswordError || 'পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে'
      }));
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error(t?.invalidOtp || 'সম্পূর্ণ OTP দিন');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-reset-otp`, {
        email: otpEmail,
        otp: otpCode
      });

      const { resetToken } = response.data;
      localStorage.setItem('resetToken', resetToken);
      setActiveTab('reset-password');
      setShowOtpModal(false);
      setOtp(['', '', '', '', '', '']);
      toast.success(t?.otpVerified || 'OTP সফলভাবে যাচাই করা হয়েছে');
    } catch (error) {
      toast.error(error.response?.data?.message || t?.otpVerifyError || 'OTP যাচাই করতে সমস্যা হয়েছে');
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      const resetToken = localStorage.getItem('resetToken');
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        resetToken,
        newPassword: formData.password
      });

      localStorage.removeItem('resetToken');
      closeAuthModal();
      toast.success(t?.passwordResetSuccess || 'পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে');

      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: response.data.user.email,
        password: formData.password
      });

      const { token, user } = loginResponse.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate("/");
      window.location.reload();
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        formError: error.response?.data?.message || t?.resetPasswordError || 'পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে'
      }));
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;

    try {
      await axios.post(`${API_BASE_URL}/auth/request-password-reset`, { email: otpEmail });
      setCountdown(60);
      toast.success(t?.newOtpSent || 'নতুন OTP ইমেইলে পাঠানো হয়েছে');
    } catch (error) {
      toast.error(error.response?.data?.message || t?.otpResendError || 'OTP পুনরায় পাঠাতে সমস্যা হয়েছে');
    }
  };

  return (
    <>
      {showAuthModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-gray-800 text-xl font-semibold">
                {activeTab === 'login' && (t?.login || 'লগইন করুন')}
                {activeTab === 'register' && (t?.register || 'নিবন্ধন করুন')}
                {activeTab === 'forgot-password' && (t?.resetPassword || 'পাসওয়ার্ড রিসেট করুন')}
                {activeTab === 'reset-password' && (t?.setNewPassword || 'নতুন পাসওয়ার্ড সেট করুন')}
              </h2>
              <button onClick={closeAuthModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <div className="flex border-b border-gray-200">
              {['login', 'register'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm md:text-base font-medium cursor-pointer ${
                    activeTab === tab
                      ? 'text-gray-800 border-b-2 border-gray-800'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'login' ? (t?.login || 'লগইন') : (t?.register || 'নিবন্ধন')}
                </button>
              ))}
            </div>

            <div className="p-6">
              {errors.formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {errors.formError}
                </div>
              )}

              {activeTab === 'login' && (
                <div className="space-y-4">
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t?.emailPlaceholder || 'ইমেইল'}
                      className={`w-full bg-gray-50 text-gray-800 border ${errors.email ? 'border-red-300' : 'border-gray-300'} py-2 pl-10 pr-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t?.passwordPlaceholder || 'পাসওয়ার্ড'}
                      className={`w-full bg-gray-50 text-gray-800 border ${errors.password ? 'border-red-300' : 'border-gray-300'} py-2 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400`}
                    />
                    <button
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <input type="checkbox" id="remember" className="mr-2 accent-gray-800" />
                      <label htmlFor="remember" className="text-gray-600">{t?.rememberMe || 'মনে রাখুন'}</label>
                    </div>
                    <button onClick={() => setActiveTab('forgot-password')} className="text-gray-600 hover:text-gray-800 underline cursor-pointer">
                      {t?.forgotPassword || 'পাসওয়ার্ড ভুলে গেছেন?'}
                    </button>
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white px-[20px] py-[10px] rounded-lg font-medium transition-colors"
                  >
                    {t?.login || 'লগইন করুন'}
                  </button>
                </div>
              )}

              {activeTab === 'register' && (
                <div className="space-y-4">
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t?.emailPlaceholder || 'ইমেইল'}
                      className={`w-full bg-gray-50 text-gray-800 border ${errors.email ? 'border-red-300' : 'border-gray-300'} py-2 pl-10 pr-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t?.passwordPlaceholder || 'পাসওয়ার্ড'}
                      className={`w-full bg-gray-50 text-gray-800 border ${errors.password ? 'border-red-300' : 'border-gray-300'} py-2 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400`}
                    />
                    <button
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={t?.confirmPasswordPlaceholder || 'পাসওয়ার্ড নিশ্চিত করুন'}
                      className={`w-full bg-gray-50 text-gray-800 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} py-2 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400`}
                    />
                    <button
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="relative">
                    <FaUserFriends className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      placeholder={t?.referralCodePlaceholder || 'রেফারেল কোড (ঐচ্ছিক)'}
                      className="w-full bg-gray-50 text-gray-800 border border-gray-300 py-2 pl-10 pr-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400"
                    />
                    {referralCodeChecking && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                      </div>
                    )}
                    {referralCodeError && !referralCodeChecking && (
                      <p className="text-red-500 text-xs mt-1">{referralCodeError}</p>
                    )}
                    {referrerInfo && !referralCodeChecking && (
                      <p className="text-green-600 text-xs mt-1">{t?.referrer || 'রেফারার'}: {referrerInfo.username}</p>
                    )}
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={formData.referralCode && !referralCodeValid}
                    className={`w-full bg-gray-800 hover:bg-gray-900 text-white px-[20px] py-[10px] rounded-lg font-medium transition-colors ${
                      formData.referralCode && !referralCodeValid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {t?.register || 'নিবন্ধন করুন'}
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    {language?.code === 'bn' ? (
                      <>
                        নিবন্ধন করে, আপনি আমাদের <a href="#" className="text-gray-600 hover:text-gray-800 underline">শর্তাবলী</a> এবং <a href="#" className="text-gray-600 hover:text-gray-800 underline">গোপনীয়তা নীতি</a> স্বীকার করেছেন
                      </>
                    ) : (
                      <>
                        By registering, you agree to our <a href="#" className="text-gray-600 hover:text-gray-800 underline">terms</a> and <a href="#" className="text-gray-600 hover:text-gray-800 underline">privacy policy</a>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'forgot-password' && (
                <div className="space-y-4">
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t?.emailPlaceholder || 'আপনার ইমেইল ঠিকানা'}
                      className={`w-full bg-gray-50 text-gray-800 border ${errors.email ? 'border-red-300' : 'border-gray-300'} py-2 pl-10 pr-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <button
                    onClick={handleForgotPassword}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white px-[20px] py-[10px] rounded-lg font-medium transition-colors"
                  >
                    {t?.resetPassword || 'পাসওয়ার্ড রিসেট করুন'}
                  </button>

                  <button
                    onClick={() => setActiveTab('login')}
                    className="flex items-center justify-center w-full text-gray-600 hover:text-gray-800 cursor-pointer text-sm"
                  >
                    <FaArrowLeft className="mr-1" /> {t?.backToLogin || 'লগইন পৃষ্ঠায় ফিরে যান'}
                  </button>
                </div>
              )}

              {activeTab === 'reset-password' && (
                <div className="space-y-4">
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t?.passwordPlaceholder || 'নতুন পাসওয়ার্ড'}
                      className={`w-full bg-gray-50 text-gray-800 border ${errors.password ? 'border-red-300' : 'border-gray-300'} py-2 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400`}
                    />
                    <button
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400 text-sm md:text-base" />
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={t?.confirmPasswordPlaceholder || 'পাসওয়ার্ড নিশ্চিত করুন'}
                      className={`w-full bg-gray-50 text-gray-800 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} py-2 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base placeholder-gray-400`}
                    />
                    <button
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <button
                    onClick={handleResetPassword}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white px-[20px] py-[10px] rounded-lg font-medium transition-colors"
                  >
                    {t?.changePassword || 'পাসওয়ার্ড পরিবর্তন করুন'}
                  </button>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                {activeTab === 'login' ? (
                  <>
                    {t?.noAccount || 'অ্যাকাউন্ট নেই?'}{' '}
                    <button onClick={() => setActiveTab('register')} className="text-gray-600 hover:text-gray-800 underline cursor-pointer">
                      {t?.register || 'নিবন্ধন করুন'}
                    </button>
                  </>
                ) : (
                  <>
                    {t?.haveAccount || 'ইতিমধ্যে অ্যাকাউন্ট আছে?'}{' '}
                    <button onClick={() => setActiveTab('login')} className="text-gray-600 hover:text-gray-800 underline cursor-pointer">
                      {t?.login || 'লগইন করুন'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-gray-800 text-xl font-semibold">{t?.verifyOtp || 'OTP যাচাই করুন'}</h2>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp(['', '', '', '', '', '']);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                {t?.otpMessage || '৬-অংকের OTP কোডটি ইমেইলে পাঠানো হয়েছে'}: {otpEmail}
              </p>

              <div className="flex justify-center space-x-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-11 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-center text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white px-[20px] py-[10px] rounded-lg font-medium mb-4 transition-colors"
              >
                {t?.verifyOtp || 'যাচাই করুন'}
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-500 text-sm">
                    {countdown}{t?.resendTimer || ' সেকেন্ড পর নতুন OTP পাঠানো যাবে'}
                  </p>
                ) : (
                  <button onClick={resendOtp} className="text-gray-600 hover:text-gray-800 underline cursor-pointer text-sm">
                    {t?.resendOtp || 'OTP পুনরায় পাঠান'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Popup Component
// Popup Component
const Popup = ({ onClose, selectedMenu, activeLeftTab, setActiveLeftTab }) => {
  const { t } = useContext(LanguageContext);

  const leftMenuItemsKeys = [
    'myAccount',
    'deposit',
    'withdrawal',
    'bettingRecord',
    'accountRecord',
    'rewardCenter',
    'inviteFriend',
    'kyc', // Added KYC tab here
    'loginPasswordUpdate',
    'transactionPasswordUpdate',
  ];

  const leftMenuItems = leftMenuItemsKeys.map(key => {
    if (key === 'kyc') return t?.kyc || 'KYC';
    return t?.[key] || key;
  });

  return (
    <div className="fixed top-0 left-0 inset-0 z-[1000] w-full h-screen bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 w-full max-w-6xl h-[90vh] rounded-xl shadow-xl overflow-hidden relative">
        <button
          className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600 text-2xl z-10"
          onClick={onClose}
        >
          <IoClose />
        </button>

        <div className="flex h-full">
          <div className="w-64 bg-gray-50 text-gray-800 p-5 overflow-y-auto border-r border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-700">{t?.personalCenter || 'পার্সোনাল সেন্টার'}</h2>
            </div>
            <ul className="space-y-3">
              {leftMenuItems.map((item, index) => (
                <li
                  key={index}
                  className={`py-2.5 px-3 rounded-lg border-[1px] cursor-pointer transition-all text-sm ${
                    item === activeLeftTab
                      ? 'bg-theme_color2 border-theme_color2 text-white font-medium'
                      : ' border-gray-200 text-gray-600'
                  }`}
                  onClick={() => setActiveLeftTab(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {activeLeftTab === (t?.myAccount || 'আমার অ্যাকাউন্ট') ? (
              <AccountTabContent />
            ) : activeLeftTab === (t?.deposit || 'ডিপোজিট') ? (
              <DepositTabContent />
            ) : activeLeftTab === (t?.withdrawal || 'উত্তোলন') ? (
           <WithdrawalTabContent setActiveLeftTab={setActiveLeftTab} /> 
            ) : activeLeftTab === (t?.bettingRecord || 'বেটিং রেকর্ড') ? (
              <BettingRecordTabContent />
            ) : activeLeftTab === (t?.accountRecord || 'অ্যাকাউন্ট রেকর্ড') ? (
              <AccountRecordTabContent />
            ) : activeLeftTab === (t?.rewardCenter || 'পুরস্কার কেন্দ্র') ? (
              <RewardCenterTabContent />
            ) : activeLeftTab === (t?.inviteFriend || 'বন্ধুকে আমন্ত্রণ') ? (
              <InviteFriendTabContent />
            ) : activeLeftTab === (t?.kyc || 'KYC') ? (
              <KYCTabContent />
            ) : activeLeftTab === (t?.loginPasswordUpdate || 'লগইন পাসওয়ার্ড আপডেট') ? (
              <LoginPasswordUpdateTabContent />
            ) : activeLeftTab === (t?.transactionPasswordUpdate || 'ট্রানজেকশন পাসওয়ার্ড আপডেট') ? (
              <TransactionPasswordUpdateTabContent />
            ) : (
              <DefaultTabContent activeLeftTab={activeLeftTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Invite Popup Component
const InvitePopup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('invite');
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState({
    referralCode: '',
    totalReferrals: 0,
    referralEarnings: 0,
    referredUsers: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userData } = useUser();
  const API_BASE_URL = import.meta.env.VITE_API_KEY_Base_URL;
  const { t } = useContext(LanguageContext);

  const referralLink = `${window.location.origin}/?refer_code=${userData?.referralCode || ''}`;

  useEffect(() => {
    if (userData?._id && (activeTab === 'list' || activeTab === 'reward')) {
      fetchReferralData();
    }
  }, [activeTab, userData]);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/user/referred-users-details/${userData?._id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) setReferralData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || t?.error || 'Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocialMedia = (platform) => {
    const text = `${t?.shareLink || 'Join using my referral link and get bonus'}: ${referralLink}`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('bn-BD', { minimumFractionDigits: 2 }).format(amount || 0);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-5 rounded-xl border border-gray-200 max-w-xl w-full relative shadow-lg">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" onClick={onClose}>
          <FaTimes />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-gray-800">{t?.inviteFriend || 'বন্ধুকে আমন্ত্রণ করুন'}</h3>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['invite', 'list', 'reward'].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
                  activeTab === tab ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'invite' && <FaUser size={12} />}
                {tab === 'list' && <FaHistory size={12} />}
                {tab === 'reward' && <FaCoins size={12} />}
                {tab === 'invite' && (t?.inviteFriend || 'আমন্ত্রণ')}
                {tab === 'list' && (t?.invitedList || 'আমন্ত্রিত তালিকা')}
                {tab === 'reward' && (t?.reward || 'পুরস্কার')}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-800"></div>
              <p className="mt-2 text-gray-500 text-sm">{t?.loading || 'লোড হচ্ছে...'}</p>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

          {!loading && activeTab === 'invite' && (
            <div>
              <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2 text-gray-700">{t?.referralLink || 'আপনার রেফারেল লিঙ্ক'}</h4>
                <div className="flex items-center gap-2">
                  <input type="text" className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm" value={referralLink} readOnly />
                  <button className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors" onClick={handleCopyLink}>
                    {copied ? <FaCheck /> : <FaCopy />} {copied ? (t?.copied || 'কপি হয়েছে') : (t?.copy || 'কপি করুন')}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2 text-gray-700">{t?.shareSocial || 'সোশ্যাল মিডিয়ায় শেয়ার করুন'}</h4>
                <div className="flex gap-2">
                  {[
                    { platform: 'facebook', icon: FaFacebookF, color: 'bg-gray-700 hover:bg-gray-800' },
                    { platform: 'twitter', icon: FaTwitter, color: 'bg-gray-700 hover:bg-gray-800' },
                    { platform: 'telegram', icon: FaTelegramPlane, color: 'bg-gray-700 hover:bg-gray-800' },
                    { platform: 'whatsapp', icon: FaWhatsapp, color: 'bg-gray-700 hover:bg-gray-800' }
                  ].map(({ platform, icon: Icon, color }) => (
                    <button
                      key={platform}
                      className={`${color} text-white p-2 rounded-lg transition-colors`}
                      onClick={() => shareOnSocialMedia(platform)}
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2 text-gray-700">{t?.referralRules || 'রেফারেল নিয়ম'}</h4>
                <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
                  <li>{t?.rule1 || 'আপনার আমন্ত্রিত বন্ধুকে ন্যূনতম ১০০ টাকা ডিপোজিট করতে হবে'}</li>
                  <li>{t?.rule2 || 'আপনার আমন্ত্রিত বন্ধুকে ন্যূনতম ৩টি বেট প্লেস করতে হবে'}</li>
                </ul>
              </div>
            </div>
          )}

          {!loading && activeTab === 'list' && (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-200">{t?.username || 'ব্যবহারকারীর নাম'}</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-200">{t?.joinDate || 'যোগদানের তারিখ'}</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-200">{t?.reward || 'পুরস্কার'}</th>
                  </tr>
                </thead>
                <tbody>
                  {referralData.referredUsers?.length > 0 ? (
                    referralData.referredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"><FaUser size={12} className="text-gray-500" /></div>
                            <span className="text-sm font-medium text-gray-700">{user.username}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 border-b border-gray-200 text-sm text-gray-600">{new Date(user.joinDate).toLocaleDateString('bn-BD')}</td>
                        <td className="py-2 px-3 border-b border-gray-200 text-sm font-medium text-gray-700">৳{formatCurrency(user.earnedAmount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="py-6 text-center text-gray-500 text-sm">{t?.noFriends || 'কোন আমন্ত্রিত বন্ধু পাওয়া যায়নি'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && activeTab === 'reward' && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">{t?.totalInvites || 'মোট আমন্ত্রণ'}</p>
                  <p className="text-lg font-bold text-gray-800">{referralData.totalReferrals || 0}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">{t?.totalEarnings || 'মোট আয়'}</p>
                  <p className="text-lg font-bold text-gray-800">৳{formatCurrency(referralData.referralEarnings)}</p>
                </div>
              </div>
              {referralData.referralEarnings > 999 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t?.eligibleMessage || 'আপনি রেফারেল বোনাসের জন্য যোগ্য!'}</p>
                  <button className="w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    {t?.addToMainBalance || 'মেইন বালেন্সে যোগ করুন'}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t?.notEligible || 'আপনি এখনও রেফারেল বোনাসের জন্য যোগ্য নন'}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Account Tab Content Component
// Account Tab Content Component
const AccountTabContent = () => {
  const { t } = useContext(LanguageContext);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showTransactionPassword, setShowTransactionPassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState(t?.personalInfo || 'ব্যক্তিগত তথ্য');
  const [editableUsername, setEditableUsername] = useState('');
  const [editablePhone, setEditablePhone] = useState('');
  const [editableDob, setEditableDob] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [hasDobBeenUpdated, setHasDobBeenUpdated] = useState(false);
  const [hasUsernameBeenUpdated, setHasUsernameBeenUpdated] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '', field: '' });
  const { userData, loading, error, fetchUserData } = useUser();

  const tabs = [t?.personalInfo || 'ব্যক্তিগত তথ্য'];

  useEffect(() => {
    if (userData?.username) {
      setEditableUsername(userData.username);
      // Check if username has been updated/customized (not the default one)
      // You can add logic here to determine if it's a default username
      setHasUsernameBeenUpdated(true);
    }
    if (userData?.phone) setEditablePhone(userData.phone);
    if (userData?.dateOfBirth) {
      // Format date for input field (YYYY-MM-DD)
      const dob = new Date(userData.dateOfBirth);
      const formattedDob = dob.toISOString().split('T')[0];
      setEditableDob(formattedDob);
      
      // Check if date of birth has been set/updated before
      setHasDobBeenUpdated(true);
    } else {
      setHasDobBeenUpdated(false);
    }
  }, [userData]);

  const formatBalance = (amount) => {
    if (amount === undefined || amount === null) return '০.০০';
    return new Intl.NumberFormat('bn-BD', { minimumFractionDigits: 2 }).format(amount);
  };

  const handleUsernameUpdate = async () => {
    try {
      const base_url = import.meta.env.VITE_API_KEY_Base_URL;
      await axios.put(`${base_url}/user/update-username`, {
        userId: userData._id,
        newUsername: editableUsername
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setFeedback({ type: 'success', message: t?.usernameUpdateSuccess || 'ব্যবহারকারীর নাম আপডেট করা হয়েছে', field: 'personalInfo' });
      setIsEditingUsername(false);
      setHasUsernameBeenUpdated(true); // Mark as updated after successful API call
      fetchUserData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || t?.error || 'ব্যর্থ হয়েছে', field: 'personalInfo' });
    }
  };

  const handlePhoneUpdate = async () => {
    try {
      const base_url = import.meta.env.VITE_API_KEY_Base_URL;
      await axios.put(`${base_url}/user/update-phone`, {
        userId: userData._id,
        phone: editablePhone
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setFeedback({ type: 'success', message: 'ফোন নম্বর আপডেট করা হয়েছে', field: 'personalInfo' });
      setIsEditingPhone(false);
      fetchUserData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'ব্যর্থ হয়েছে', field: 'personalInfo' });
    }
  };

  const handleDobUpdate = async () => {
    try {
      const base_url = import.meta.env.VITE_API_KEY_Base_URL;
      await axios.put(`${base_url}/user/update-dob`, {
        userId: userData._id,
        dateOfBirth: editableDob
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setFeedback({ type: 'success', message: 'জন্ম তারিখ আপডেট করা হয়েছে', field: 'personalInfo' });
      setIsEditingDob(false);
      setHasDobBeenUpdated(true); // Mark as updated after successful API call
      fetchUserData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'ব্যর্থ হয়েছে', field: 'personalInfo' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-t-gray-800 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-800">
      {/* Profile Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <img src={getProfileImage(userData?.username)} alt="User" className="w-14 h-14 rounded-full border-2 border-gray-300 object-cover" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{userData?.username || 'N/A'}</h3>
            <p className="text-sm text-gray-500">{t?.playerId || 'আইডি'}: {userData?.player_id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        {selectedTab === tabs[0] && (
          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">{t?.personalInfo || 'ব্যক্তিগত তথ্য'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">{t?.mainBalance || 'মেইন ব্যালেন্স'}</p>
                <p className="text-base font-bold text-gray-800">{formatBalance(userData?.balance)} ৳</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">{t?.bonusBalance || 'বোনাস ব্যালেন্স'}</p>
                <p className="text-base font-bold text-gray-800">{formatBalance(userData?.bonusBalance)} ৳</p>
              </div>
            </div>

            {feedback.field === 'personalInfo' && (
              <div className={`mb-3 p-2 rounded-lg text-sm ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {feedback.message}
              </div>
            )}

            <div className="space-y-4">
              {/* Player ID - Read Only with Lock Icon on Right */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t?.playerId || 'প্লেয়ার আইডি'}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-2 py-2.5 pr-8 border border-gray-300 rounded-lg outline-none bg-gray-100 text-gray-700 text-[15px] cursor-not-allowed" 
                    value={userData?.player_id || 'N/A'} 
                    readOnly 
                  />
                  <FaLock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Email - Read Only with Lock Icon on Right */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t?.email || 'ইমেইল'}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-2 py-2.5 pr-8 border border-gray-300 rounded-lg outline-none bg-gray-100 text-gray-700 text-[15px] cursor-not-allowed" 
                    value={userData?.email || 'N/A'} 
                    readOnly 
                  />
                  <FaLock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Phone Number - Read Only with Lock Icon (Cannot Update) */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t?.mobileNumber || 'মোবাইল নম্বর'}</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-2 py-2.5 pr-8 border border-gray-300 rounded-lg outline-none bg-gray-100 text-gray-700 text-[15px] cursor-not-allowed"
                    value={editablePhone || userData?.phone || 'N/A'}
                    readOnly
                    placeholder="01XXXXXXXXX"
                  />
                  <FaLock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Date of Birth - Editable only once, then locked */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t?.dateOfBirth || 'জন্ম তারিখ'}</label>
                {hasDobBeenUpdated ? (
                  // Show locked version if already updated
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-2 py-2.5 pr-8 border border-gray-300 rounded-lg outline-none bg-gray-100 text-gray-700 text-[15px] cursor-not-allowed"
                      value={editableDob ? new Date(editableDob).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                      readOnly
                    />
                    <FaLock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  </div>
                ) : (
                  // Show editable version if never updated
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className={`flex-1 px-2 py-2.5 border rounded-lg text-[15px] outline-theme_color2 ${isEditingDob ? 'border-gray-400 bg-white' : 'border-gray-300 bg-gray-100'}`}
                      value={editableDob}
                      onChange={(e) => setEditableDob(e.target.value)}
                      readOnly={!isEditingDob}
                      max={new Date().toISOString().split('T')[0]} // Prevent future dates
                    />
                    {isEditingDob ? (
                      <>
                        <button onClick={handleDobUpdate} className="bg-theme_color2 text-white px-3 py-1 rounded-lg text-sm transition-colors">{t?.save || 'সংরক্ষণ'}</button>
                        <button onClick={() => setIsEditingDob(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm transition-colors">{t?.cancel || 'বাতিল'}</button>
                      </>
                    ) : (
                      <button onClick={() => setIsEditingDob(true)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm transition-colors">{t?.edit || 'সম্পাদনা'}</button>
                    )}
                  </div>
                )}
              </div>

              {/* Username - Editable only once, then locked */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t?.username || 'ব্যবহারকারীর নাম'}</label>
                {hasUsernameBeenUpdated ? (
                  // Show locked version if already updated
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-2 py-2.5 pr-8 border border-gray-300 rounded-lg outline-none bg-gray-100 text-gray-700 text-[15px] cursor-not-allowed"
                      value={editableUsername || 'N/A'}
                      readOnly
                    />
                    <FaLock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  </div>
                ) : (
                  // Show editable version if never updated
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className={`flex-1 px-2 py-2.5 border rounded-lg text-[15px] outline-theme_color2 ${isEditingUsername ? 'border-gray-400 bg-white' : 'border-gray-300 bg-gray-100'}`}
                      value={editableUsername}
                      onChange={(e) => setEditableUsername(e.target.value)}
                      readOnly={!isEditingUsername}
                      placeholder="Enter username"
                    />
                    {isEditingUsername ? (
                      <>
                        <button onClick={handleUsernameUpdate} className="bg-theme_color2 text-white px-3 py-1 rounded-lg text-sm transition-colors">{t?.save || 'সংরক্ষণ'}</button>
                        <button onClick={() => setIsEditingUsername(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm transition-colors">{t?.cancel || 'বাতিল'}</button>
                      </>
                    ) : (
                      <button onClick={() => setIsEditingUsername(true)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm transition-colors">{t?.edit || 'সম্পাদনা'}</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === tabs[1] && (
          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">{t?.passwordUpdate || 'পাসওয়ার্ড আপডেট'}</h3>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <FaLock className="text-gray-400" /> {t?.changeLoginPassword || 'লগইন পাসওয়ার্ড পরিবর্তন করুন'}
              </h4>
              {feedback.field === 'loginPassword' && (
                <div className={`mb-2 p-2 rounded-lg text-sm ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {feedback.message}
                </div>
              )}
              <form className="space-y-3">
                <div className="relative">
                  <input type={showLoginPassword ? "text" : "password"} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm" placeholder={t?.currentPasswordPlaceholder || 'বর্তমান পাসওয়ার্ড'} />
                  <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-gray-600" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                    {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="password" className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm" placeholder={t?.newPasswordPlaceholder || 'নতুন পাসওয়ার্ড'} />
                  <input type="password" className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm" placeholder={t?.confirmPasswordPlaceholder || 'পাসওয়ার্ড নিশ্চিত করুন'} />
                </div>
                <button type="submit" className="bg-theme_color2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">{t?.changePasswordButton || 'পাসওয়ার্ড পরিবর্তন করুন'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// Deposit Tab Content
// Deposit Tab Content
const DepositTabContent = () => {
  const { t, language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bkash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userData, fetchUserData } = useUser();
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const base_url2 = import.meta.env.VITE_API_KEY_Base_URL2;
  const frontend_url = import.meta.env.VITE_API_KEY_Frotend_URL;
  const amounts = [500, 800, 1500, 2000, 5000];
  const [availableBonuses, setAvailableBonuses] = useState([]);
  const [bonusLoading, setBonusLoading] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [autoPaymentStatus, setAutoPaymentStatus] = useState(false);
  const [autoPaymentLoading, setAutoPaymentLoading] = useState(true);
  
  // Refs for mouse drag scrolling
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Bonus gradients and emojis
  const bonusGradients = [
    'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
  ];

  const bonusEmojis = ['🎁', '💎', '🔥', '⚡', '🎯', '🚀'];

  // Mouse drag handlers for horizontal scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.removeProperty('user-select');
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.removeProperty('user-select');
    }
  };

  const formatNumber = (number) => {
    if (number === undefined || number === null) return language?.code === 'bn' ? '০' : '0';
    return new Intl.NumberFormat(language?.code === 'bn' ? 'bn-BD' : 'en-US').format(number);
  };

  // Fetch auto payment status
  useEffect(() => {
    const fetchAutoPaymentStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${base_url}/user/auto-payment-status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) setAutoPaymentStatus(response.data.status);
      } catch (err) {
        setAutoPaymentStatus(false);
      } finally {
        setAutoPaymentLoading(false);
      }
    };
    fetchAutoPaymentStatus();
  }, []);

  // Fetch available bonuses
  useEffect(() => {
    const fetchAvailableBonuses = async () => {
      try {
        setBonusLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (!user || !user._id) return;
        const response = await axios.get(`${base_url}/user/bonuses/available`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userid: user._id }
        });
        if (response.data) setAvailableBonuses(response.data.data || []);
      } catch (err) {
        console.error("Error fetching bonuses:", err);
      } finally {
        setBonusLoading(false);
      }
    };
    fetchAvailableBonuses();
  }, []);

  // Calculate bonus amount
  const calculateBonusAmount = (bonus) => {
    if (!amount || isNaN(parseFloat(amount))) return 0;
    const amountNum = parseFloat(amount);
    let calculatedBonus = 0;
    
    if (bonus.percentage > 0) {
      calculatedBonus = (amountNum * bonus.percentage) / 100;
      if (bonus.maxBonus && calculatedBonus > bonus.maxBonus) calculatedBonus = bonus.maxBonus;
    } else if (bonus.amount > 0) {
      calculatedBonus = bonus.amount;
    }
    return calculatedBonus;
  };

  // Handle deposit
  const handleDeposit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!amount) {
      setErrorMessage(t?.enterAmountError || 'অনুগ্রহ করে পরিমাণ লিখুন');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      setErrorMessage(t?.invalidAmountError || 'অবৈধ পরিমাণ');
      return;
    }

    if (amountNum < 300) {
      setErrorMessage(t?.minimumDepositError || 'ন্যূনতম ডিপোজিট ৩০০ টাকা');
      return;
    }

    if (amountNum > 30000) {
      setErrorMessage(t?.maximumDepositError || 'সর্বোচ্চ ডিপোজিট ৩০,০০০ টাকা');
      return;
    }

    if (!/^\d+$/.test(amount)) {
      setErrorMessage(t?.numericAmountError || 'শুধুমাত্র সংখ্যা লিখুন');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare bonus data
      let bonusData = {
        bonusType: 'none',
        bonusId: null,
        bonusCode: null,
        bonusAmount: 0,
        bonusName: null,
        bonusPercentage: 0,
        bonusMaxAmount: 0,
        wageringRequirement: 0,
        balanceType: 'main_balance',
        waigergamecategory: [],
        gameCategory: null
      };

      if (selectedBonus && selectedBonus !== 'none') {
        const calculatedAmount = calculateBonusAmount(selectedBonus);
        
        // Check minimum deposit for bonus
        if (selectedBonus.minDeposit && amountNum < selectedBonus.minDeposit) {
          setErrorMessage(`এই বোনাসের জন্য ন্যূনতম ডিপোজিট ${selectedBonus.minDeposit} টাকা`);
          setIsSubmitting(false);
          return;
        }

        bonusData = {
          bonusType: selectedBonus.type || selectedBonus.bonusType || 'custom',
          bonusId: selectedBonus._id || selectedBonus.id,
          bonusCode: selectedBonus.bonusCode || selectedBonus.code,
          bonusAmount: calculatedAmount,
          bonusName: selectedBonus.name || selectedBonus.title,
          bonusPercentage: selectedBonus.percentage || 0,
          bonusMaxAmount: selectedBonus.maxBonus || 0,
          wageringRequirement: selectedBonus.wageringRequirement || 0,
          balanceType: selectedBonus.balanceType || 'bonus_balance',
          waigergamecategory: selectedBonus.waigergamecategory || selectedBonus.gamesCategory || selectedBonus.gameCategories || [],
          gameCategory: selectedBonus.gameCategory || null
        };
      }

      const token = localStorage.getItem("token");
      
      // Generate order ID
      let orderCounter = (Date.now() % 1000) * 1000;
      const generateOrderId = () => {
        orderCounter = (orderCounter + 1) % 1000000;
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const randomStr2 = Math.random().toString(36).substring(2, 15);
        const userPart = userData?._id?.slice(-6) || '000000';
        return `DEP${timestamp}${orderCounter}${randomStr}${randomStr2}${userPart}`;
      };
      
      const orderId = generateOrderId();

      // Prepare payload
      const payload = {
        method: selectedMethod || 'bkash',
        amount: amountNum,
        bonusType: bonusData.bonusType,
        bonusId: bonusData.bonusId,
        bonusCode: bonusData.bonusCode,
        bonusAmount: bonusData.bonusAmount,
        bonusName: bonusData.bonusName,
        bonusPercentage: bonusData.bonusPercentage,
        bonusMaxAmount: bonusData.bonusMaxAmount,
        wageringRequirement: bonusData.wageringRequirement,
        balanceType: bonusData.balanceType,
        userid: userData._id,
        playerbalance: userData.balance || 0,
        waigergamecategory: bonusData.waigergamecategory,
        gameCategory: bonusData.gameCategory,
        orderId
      };

      // Handle Bkash Fast payment
      if (selectedMethod === 'bkash_fast') {
        const initiateResponse = await axios.post(`${base_url}/user/initiate`, payload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (initiateResponse.data.success) {
          const bkashFastResponse = await axios.post(`${base_url2}/api/payment/p2c/bkash/payment`, {
            orderId,
            payerId: userData.player_id,
            amount: amountNum,
            player_id: userData.player_id,
            currency: 'BDT',
            redirectUrl: `${frontend_url}`,
            callbackUrl: `${frontend_url}/callback-payment`,
            sitecallback: `${base_url}/user/callback`,
            transactionId: initiateResponse.data.transactionId,
            paymentId: initiateResponse.data.paymentId
          }, {
            headers: { 
              Authorization: `Bearer ${token}`, 
              'x-api-key': localStorage.getItem("apiKey") || "18e5f948356de68e2909", 
              'Content-Type': 'application/json' 
            }
          });

          if (bkashFastResponse.data.success && bkashFastResponse.data.link) {
            setSuccessMessage(t?.paymentInitiatedSuccess || 'পেমেন্ট শুরু হয়েছে');
            
            // Save deposit info
            localStorage.setItem('lastDeposit', JSON.stringify({
              amount: amountNum,
              bonus: bonusData,
              method: 'bkash_fast',
              paymentId: bkashFastResponse.data.paymentId || initiateResponse.data.paymentId,
              orderId: bkashFastResponse.data.orderId || orderId,
              transactionId: initiateResponse.data.transactionId,
              timestamp: new Date().toISOString()
            }));

            // Redirect to payment page
            window.location.href = bkashFastResponse.data.link;
          } else {
            setErrorMessage(bkashFastResponse.data.message || t?.paymentInitiateError || 'পেমেন্ট শুরু করতে সমস্যা হয়েছে');
          }
        } else {
          setErrorMessage(initiateResponse.data.message || t?.paymentInitiateError || 'পেমেন্ট শুরু করতে সমস্যা হয়েছে');
        }
        setIsSubmitting(false);
        return;
      }

      // Regular payment flow
      const initiateResponse = await axios.post(`${base_url}/user/initiate`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (initiateResponse.data.success && initiateResponse.data.redirectUrl) {
        setSuccessMessage(t?.paymentInitiatedSuccess || 'পেমেন্ট শুরু হয়েছে');
        
        // Save deposit info
        localStorage.setItem('lastDeposit', JSON.stringify({
          amount: amountNum,
          bonus: bonusData,
          waigergamecategory: bonusData.waigergamecategory,
          gameCategory: bonusData.gameCategory,
          transactionId: initiateResponse.data.transactionId,
          paymentId: initiateResponse.data.paymentId,
          timestamp: new Date().toISOString()
        }));

        // Redirect to payment page
        window.location.href = initiateResponse.data.redirectUrl;
      } else {
        setErrorMessage(initiateResponse.data.message || t?.paymentInitiateError || 'পেমেন্ট শুরু করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage(error.response.data.message || t?.paymentFailedError || 'পেমেন্ট ব্যর্থ হয়েছে');
        } else if (error.response.status === 401) {
          setErrorMessage(t?.sessionExpiredError || "সেশন শেষ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।");
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setErrorMessage(error.response.data?.message || t?.paymentFailedError || 'পেমেন্ট ব্যর্থ হয়েছে');
        }
      } else {
        setErrorMessage(t?.networkError || "নেটওয়ার্ক সমস্যা। আপনার সংযোগ পরীক্ষা করুন।");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t?.deposit || 'ডিপোজিট'}</h3>

      {/* Payment Method Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t?.paymentMethod || 'পেমেন্ট মেথড'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Bkash */}
          <button
            onClick={() => setSelectedMethod('bkash')}
            className={`rounded-lg border-2 p-2 flex cursor-pointer flex-col items-center gap-1 transition-all ${
              selectedMethod === 'bkash'
                ? 'border-cyan-400 bg-cyan-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <img
              src="https://images.5949390294.com/mcs-images/bank_type/BKASH/BN_2_20240312225413337.png"
              alt="bkash"
              className="w-[50px] object-contain"
            />
            <span className="text-xs font-medium text-gray-600">{t?.bkash || 'Bkash'}</span>
          </button>

          {/* Nagad */}
          <button
            onClick={() => setSelectedMethod('nagad')}
            className={`rounded-lg border-2 p-2 flex cursor-pointer flex-col items-center gap-1 transition-all ${
              selectedMethod === 'nagad'
                ? 'border-cyan-400 bg-cyan-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <img
              src="https://images.5949390294.com/mcs-images/bank_type/NAGAD/BN_2_20240312230148421.png"
              alt="nagad"
              className="w-[50px] object-contain"
            />
            <span className="text-xs font-medium text-gray-600">{t?.nagad || 'Nagad'}</span>
          </button>

          {/* Bkash Fast (conditional) */}
          {!autoPaymentLoading && autoPaymentStatus && (
            <button
              onClick={() => setSelectedMethod('bkash_fast')}
              className={`rounded-lg border-2 p-2 flex flex-col items-center gap-1 transition-all ${
                selectedMethod === 'bkash_fast'
                  ? 'border-cyan-400 bg-cyan-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <img
                src="https://play-lh.googleusercontent.com/1CRcUfmtwvWxT2g-xJF8s9_btha42TLi6Lo-qVkVomXBb_citzakZX9BbeY51iholWs"
                alt="bkash fast"
                className="w-10 h-6 object-contain rounded"
              />
              <span className="text-xs font-medium text-gray-600">{t?.bkashFast || 'Bkash Fast'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t?.depositAmount || 'জমার পরিমাণ'}
        </label>
        
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => { 
                setAmount(amt.toString()); 
                setErrorMessage(''); 
              }}
              className={`bg-white border ${
                amount === amt.toString() 
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-700' 
                  : 'border-gray-300 hover:border-cyan-300'
              } px-2 py-1.5 rounded-lg cursor-pointer text-sm text-gray-700 transition-colors`}
            >
              {formatNumber(amt)} ৳
            </button>
          ))}
        </div>

        {/* Amount Input Field */}
        <div className="relative mt-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^\d+$/.test(v)) {
                setAmount(v);
                setErrorMessage('');
              }
            }}
            className="w-full p-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder={t?.amountPlaceholder || 'জমার পরিমাণ লিখুন'}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">৳</span>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          *{t?.minimumAmount || 'ন্যূনতম ৩০০ - সর্বোচ্চ ৩০,০০০ টাকা'}
        </p>
      </div>

      {/* Bonus Section - Horizontal Scroll with 2 boxes and mouse drag */}
      {(availableBonuses.length > 0 || bonusLoading) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t?.selectBonusOffer || 'বোনাস অফার নির্বাচন করুন'}
          </label>

          {bonusLoading ? (
            <div className="text-center py-4">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-cyan-500 border-r-transparent"></div>
              <p className="text-xs text-gray-400 mt-1">{t?.loadingBonuses || 'বোনাস লোড হচ্ছে...'}</p>
            </div>
          ) : (
            <>
              <div 
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                className="flex gap-3 overflow-x-auto pb-2 px-1 cursor-grab select-none"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e0 #f1f5f9',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: isDragging ? 'auto' : 'smooth',
                }}
              >
                {/* No Bonus Option - 2 boxes width (50% each = 100% total) */}
                <button
                  onClick={() => !isDragging && setSelectedBonus(null)}
                  className="flex-shrink-0 relative rounded-xl overflow-hidden transition-all"
                  style={{
                    width: 'calc(50% - 6px)', // Exactly 2 boxes (50% each)
                    background: selectedBonus === null
                      ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                      : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                    boxShadow: selectedBonus === null
                      ? '0 4px 12px rgba(6, 182, 212, 0.3)'
                      : '0 2px 6px rgba(0,0,0,0.05)',
                    transform: selectedBonus === null ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Decorative circles */}
                  <div style={{
                    position: 'absolute', top: '-10px', right: '-10px',
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '-6px', left: '-6px',
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)'
                  }} />
                  
                  <div className="relative p-3 flex items-center gap-2">
                    <div className="text-xl flex-shrink-0">🚫</div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className={`text-xs font-bold ${selectedBonus === null ? 'text-white' : 'text-gray-600'}`}>
                        {t?.noBonus || 'কোন বোনাস নয়'}
                      </div>
                      <div className={`text-[10px] leading-tight ${selectedBonus === null ? 'text-white/70' : 'text-gray-400'}`}>
                        {t?.noBonusDesc || 'বোনাস ছাড়া চালিয়ে যান'}
                      </div>
                    </div>
                    
                    {/* Selected checkmark */}
                    {selectedBonus === null && (
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-cyan-500" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                {/* Bonus Cards - each also 50% width for exactly 2 boxes */}
                {availableBonuses.map((bonus, idx) => {
                  const calculatedAmount = calculateBonusAmount(bonus);
                  const isSelected = selectedBonus && 
                    ((selectedBonus._id && selectedBonus._id === bonus._id) || 
                     (selectedBonus.id && selectedBonus.id === bonus.id));
                  const gradient = bonusGradients[idx % bonusGradients.length];
                  const emoji = bonusEmojis[idx % bonusEmojis.length];

                  return (
                    <button
                      key={bonus._id || bonus.id}
                      onClick={() => !isDragging && setSelectedBonus(bonus)}
                      className="flex-shrink-0 relative rounded-xl overflow-hidden transition-all"
                      style={{
                        width: 'calc(50% - 6px)', // Exactly 2 boxes (50% each)
                        background: gradient,
                        boxShadow: isSelected
                          ? '0 6px 16px rgba(0,0,0,0.15)'
                          : '0 2px 6px rgba(0,0,0,0.08)',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        opacity: isSelected ? 1 : 0.9,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Decorative circles */}
                      <div style={{
                        position: 'absolute', top: '-10px', right: '-10px',
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)'
                      }} />
                      <div style={{
                        position: 'absolute', bottom: '-6px', left: '-6px',
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)'
                      }} />
                      
                      <div className="relative p-3">
                        <div className="flex items-start gap-2">
                          <div className="text-xl flex-shrink-0">{emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-bold truncate">{bonus.name}</div>
                            <div className="text-white/80 text-[10px] mt-0.5">
                              {bonus.percentage > 0 ? `${bonus.percentage}%` : ''}
                              {bonus.maxBonus > 0 ? ` (max ${formatNumber(bonus.maxBonus)} ৳)` : ''}
                            </div>
                            {amount && calculatedAmount > 0 && (
                              <div className="text-white text-[10px] font-semibold mt-1 bg-white/20 rounded-full px-2 py-0.5 inline-block">
                                +{formatNumber(calculatedAmount)} ৳
                              </div>
                            )}
                          </div>
                          
                          {/* Selected checkmark */}
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 12 12" stroke={gradient.includes('7c3aed') ? '#7c3aed' : '#0ea5e9'} strokeWidth="2.5">
                                <polyline points="2,6 5,9 10,3" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Minimum deposit info if exists */}
                        {bonus.minDeposit > 0 && (
                          <div className="mt-1 text-[9px] text-white/70">
                            Min: {formatNumber(bonus.minDeposit)} ৳
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Scroll position indicator */}
              {availableBonuses.length > 2 && (
                <div className="flex justify-center mt-2 gap-1">
                  <div className={`h-1 rounded-full transition-all ${scrollContainerRef.current?.scrollLeft === 0 ? 'w-4 bg-cyan-400' : 'w-2 bg-gray-300'}`}></div>
                  <div className={`h-1 rounded-full transition-all ${scrollContainerRef.current?.scrollLeft > 0 ? 'w-4 bg-cyan-400' : 'w-2 bg-gray-300'}`}></div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-lg text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        onClick={handleDeposit}
        disabled={isSubmitting || !amount}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t?.processing || 'প্রক্রিয়াধীন...'}
          </>
        ) : (
          t?.requestDeposit || 'ডিপোজিট করুন'
        )}
      </button>
    </div>
  );
};
// Withdrawal Tab Content
// Withdrawal Tab Content
// Withdrawal Tab Content
const WithdrawalTabContent = ({ setActiveLeftTab }) => {
  const { t, language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelBonus, setCancelBonus] = useState(false);
  const [showBonusCancelConfirm, setShowBonusCancelConfirm] = useState(false);
  const [cancelBonusLoading, setCancelBonusLoading] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showTransactionPassword, setShowTransactionPassword] = useState(false);
  const [transactionPassword, setTransactionPassword] = useState('');
  const [bonusCountdown, setBonusCountdown] = useState(null);
  const [showTransferBonusButton, setShowTransferBonusButton] = useState(false);
  const [transferBonusLoading, setTransferBonusLoading] = useState(false);

  const { userData, loading: userLoading, error: userError, fetchUserData } = useUser();
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const isWithdrawalBanned = userData?.withdrawalBanned || false;
  const banReason = userData?.withdrawalBanReason || "";
  const unbanDate = userData?.withdrawalUnbanDate;
  const isKYCCompleted = userData?.kycCompleted || false;
  const isKYCSubmitted = userData?.kycSubmitted || false;
  const showKYCVerificationMessage = isKYCSubmitted && !isKYCCompleted;

  const wageringProgress = userData?.waigeringneed && userData.waigeringneed > 0 && userData?.bonusBalance > 0
    ? Math.min(((userData?.total_bet || 0) / (userData.waigeringneed * userData.bonusBalance)) * 100, 100)
    : 0;
  const isWageringComplete = userData?.waigeringneed > 0 && userData?.bonusBalance > 0 &&
    userData?.total_bet >= userData?.waigeringneed * userData?.bonusBalance;

  const formatUnbanDate = (dateString) => {
    if (!dateString) return t?.notSpecified || 'Not specified';
    return new Date(dateString).toLocaleDateString(
      language?.code === 'bn' ? 'bn-BD' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };

  const getTimeUntilUnban = () => {
    if (!unbanDate) return null;
    const diffMs = new Date(unbanDate) - new Date();
    if (diffMs <= 0) return t?.banPeriodEnded || 'Ban period ended';
    const d = Math.floor(diffMs / 86400000);
    const h = Math.floor((diffMs % 86400000) / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    return language?.code === 'bn' 
      ? `${d} দিন ${h} ঘন্টা ${m} মিনিট` 
      : `${d} days ${h} hours ${m} minutes`;
  };

  const formatNumber = (number) => {
    if (number === undefined || number === null) return language?.code === 'bn' ? '০' : '0';
    return new Intl.NumberFormat(
      language?.code === 'bn' ? 'bn-BD' : 'en-US',
      { minimumFractionDigits: 2 }
    ).format(number);
  };

  // Bonus countdown timer
  useEffect(() => {
    if (userData?.bonusInfo?.activeBonuses?.length > 0) {
      const activeBonuses = userData.bonusInfo.activeBonuses.filter(b => b.status === 'active');
      if (activeBonuses.length > 0) {
        const calculateCountdown = () => {
          const expiresAt = new Date(new Date(activeBonuses[0].createdAt).getTime() + 7 * 86400000);
          const diffMs = expiresAt - new Date();
          const isTransferEligible = userData.waigeringneed > 0 && userData.bonusBalance > 0
            ? (userData.total_bet || 0) >= userData.waigeringneed * userData.bonusBalance
            : (userData.total_bet || 0) >= userData.total_deposit * 30;
          
          if (diffMs <= 0) { 
            setBonusCountdown({ expired: true }); 
            setShowTransferBonusButton(false); 
            return; 
          }
          
          setBonusCountdown({
            days: Math.floor(diffMs / 86400000),
            hours: Math.floor((diffMs % 86400000) / 3600000),
            minutes: Math.floor((diffMs % 3600000) / 60000),
            seconds: Math.floor((diffMs % 60000) / 1000),
            expired: false,
            remainingWagering: userData.waigeringneed > 0 && userData.bonusBalance > 0
              ? Math.max(0, (userData.waigeringneed * userData.bonusBalance) - (userData.total_bet || 0))
              : Math.max(0, (userData.total_deposit * 30) - (userData.total_bet || 0))
          });
          setShowTransferBonusButton(isTransferEligible && userData.bonusBalance > 0);
        };
        calculateCountdown();
        const interval = setInterval(calculateCountdown, 1000);
        return () => clearInterval(interval);
      } else { 
        setBonusCountdown(null); 
        setShowTransferBonusButton(false); 
      }
    }
  }, [userData]);

  // Fetch withdrawal history
  useEffect(() => {
    const fetchWithdrawalHistory = async () => {
      if (!userData?._id || !isKYCCompleted) {
        setHistoryLoading(false);
        return;
      }
      
      try {
        setHistoryLoading(true);
        const response = await axios.get(`${base_url}/user/withdrawal/${userData._id}`, {
          headers: { 
            'x-api-key': import.meta.env.VITE_API_KEY, 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
        setWithdrawalHistory(response.data.data || []);
      } catch (err) {
        console.error("Error fetching withdrawal history:", err);
        setError(t?.withdrawalHistoryLoadError || 'Failed to load withdrawal history');
      } finally { 
        setHistoryLoading(false); 
      }
    };
    
    if (userData?._id && isKYCCompleted) fetchWithdrawalHistory();
  }, [userData?._id, base_url, t, isKYCCompleted]);

  const hasMobileNumber = userData?.phone;

  // Calculate withdrawal info based on user data
  const calculateWithdrawalInfo = () => {
    if (!userData) return { availableBalance: 0, commissionRate: 0, needsWagering: false };
    
    if (userData.bonusBalance > 0 && !cancelBonus) {
      return { 
        availableBalance: 0, 
        commissionRate: 0, 
        needsWagering: false, 
        hasActiveBonus: true,
        bonusBalance: userData.bonusBalance 
      };
    }
    
    if (userData.waigeringneed && userData.waigeringneed > 0 && userData.bonusBalance > 0) {
      const req = userData.waigeringneed * userData.bonusBalance;
      const done = userData.total_bet || 0;
      if (done < req) {
        const comm = userData.total_deposit > 0 && done < userData.total_deposit ? 0.2 : 0;
        return { 
          availableBalance: userData.balance, 
          commissionRate: comm, 
          needsWagering: true, 
          wageringStatus: comm > 0 ? 'less-than-deposit' : 'pending-wagering', 
          remainingWagering: req - done,
          totalDeposit: userData.total_deposit
        };
      }
      return { 
        availableBalance: userData.balance, 
        commissionRate: 0, 
        needsWagering: false, 
        wageringStatus: 'completed' 
      };
    }
    
    if (userData.total_deposit > 0) {
      const done = userData.total_bet || 0;
      const req1 = userData.total_deposit;
      const req3 = userData.total_deposit * 3;
      if (done < req1) {
        return { 
          availableBalance: 0, 
          commissionRate: 0, 
          needsWagering: true, 
          wageringStatus: 'less-than-1x', 
          remainingWagering: req1 - done,
          totalDeposit: userData.total_deposit
        };
      }
      if (done < req3) {
        return { 
          availableBalance: userData.balance, 
          commissionRate: 0.2, 
          needsWagering: true, 
          wageringStatus: 'less-than-3x', 
          remainingWagering: req3 - done,
          totalDeposit: userData.total_deposit
        };
      }
    }
    
    return { 
      availableBalance: userData.balance, 
      commissionRate: 0, 
      needsWagering: false, 
      wageringStatus: 'completed' 
    };
  };

  const { availableBalance, commissionRate, needsWagering, hasActiveBonus, remainingWagering, wageringStatus, bonusBalance } = calculateWithdrawalInfo();

  // Handle cancel bonus
  const handleCancelBonus = async () => {
    setCancelBonusLoading(true); 
    setError('');
    try {
      const response = await axios.post(`${base_url}/user/cancel-bonus`, 
        { userid: userData._id }, 
        { 
          headers: { 
            'x-api-key': import.meta.env.VITE_API_KEY, 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          } 
        }
      );
      if (response.data.success) { 
        setSuccess(response.data.message || t?.cancelBonusSuccess || 'Bonus cancelled successfully'); 
        setCancelBonus(false); 
        setShowBonusCancelConfirm(false); 
        await fetchUserData(); 
      } else {
        setError(response.data.message || t?.cancelBonusError || 'Failed to cancel bonus');
      }
    } catch (err) { 
      setError(err.response?.data?.message || t?.cancelBonusError || 'Failed to cancel bonus'); 
    } finally { 
      setCancelBonusLoading(false); 
    }
  };

  // Handle transfer bonus
  const handleTransferBonus = async () => {
    setTransferBonusLoading(true); 
    setError('');
    try {
      const response = await axios.put(`${base_url}/user/transfer-bonus-to-main-balance`, 
        { userId: userData._id }, 
        { 
          headers: { 
            'x-api-key': import.meta.env.VITE_API_KEY, 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          } 
        }
      );
      if (response.data.success) { 
        setSuccess(response.data.message || t?.transferBonusSuccess || 'Bonus transferred successfully'); 
        setShowTransferBonusButton(false); 
        await fetchUserData(); 
      } else {
        setError(response.data.message || t?.transferBonusError || 'Failed to transfer bonus');
      }
    } catch (err) { 
      setError(err.response?.data?.message || t?.transferBonusError || 'Failed to transfer bonus'); 
    } finally { 
      setTransferBonusLoading(false); 
    }
  };

  // Handle withdrawal
  const handleWithdrawal = async () => {
    setError(''); 
    setSuccess('');

    if (!amount || amount < 800) { 
      setError(t?.minimumWithdrawalError || 'Minimum withdrawal amount is 800 BDT'); 
      return; 
    }
    
    if (parseFloat(amount) > userData.balance) { 
      setError(`${t?.insufficientBalanceError || 'Insufficient balance'} ৳${formatNumber(userData.balance)}`); 
      return; 
    }
    
    if (!accountNumber) { 
      setError(t?.accountNumberRequired || 'Account number is required'); 
      return; 
    }
    
    if (!transactionPassword) { 
      setError(t?.transactionPasswordRequired || 'Transaction password is required'); 
      return; 
    }
    
    if (['bkash', 'nagad'].includes(paymentMethod) && !/^01\d{9}$/.test(accountNumber)) { 
      setError(t?.invalidAccountNumberError?.replace('{method}', paymentMethod === 'bkash' ? (t?.bkash || 'Bkash') : (t?.nagad || 'Nagad')) || 'Invalid account number'); 
      return; 
    }
    
    if (wageringStatus === 'less-than-1x') { 
      setError(t?.wagering1xError?.replace('{amount}', formatNumber(remainingWagering)) || 'Complete wagering requirement first'); 
      return; 
    }

    try {
      setLoading(true);
      const orderId = `WD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const payoutResponse = await axios.post(`${base_url}/user/payout`, 
        { 
          userId: userData._id, 
          username: userData.username, 
          email: userData.email, 
          playerId: userData.player_id, 
          provider: paymentMethod, 
          amount: parseFloat(amount), 
          orderId, 
          payeeAccount: accountNumber, 
          transactionPassword, 
          wageringStatus: wageringStatus || 'completed', 
          cancelBonus, 
          waigeringneed: userData.waigeringneed, 
          total_bet: userData.total_bet 
        }, 
        { 
          headers: { 
            'x-api-key': import.meta.env.VITE_API_KEY, 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          } 
        }
      );

      if (payoutResponse.data.success) {
        setSuccess(payoutResponse.data.message || t?.withdrawalRequestSuccess || 'Withdrawal request submitted successfully');
        setAmount(''); 
        setAccountNumber(''); 
        setTransactionPassword(''); 
        setCancelBonus(false);
        await fetchUserData();
        
        // Refresh withdrawal history
        const hr = await axios.get(`${base_url}/user/withdrawal/${userData._id}`, { 
          headers: { 
            'x-api-key': import.meta.env.VITE_API_KEY, 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          } 
        });
        setWithdrawalHistory(hr.data.data || []);
      } else { 
        setError(payoutResponse.data.message || t?.withdrawalRequestError || 'Withdrawal request failed'); 
      }
    } catch (err) {
      if (err.response) {
        const msg = err.response.data.message;
        if (msg === 'Transaction password not set for this user') {
          setError(
            <span>
              {t?.transactionPasswordNotSet || 'Transaction password not set. '}
              <button 
                className="text-cyan-600 underline" 
                onClick={() => navigate('/mobile-information')}
              >
                {t?.setPasswordLink || 'Set password now'}
              </button>
            </span>
          );
        } else {
          setError(msg || t?.serverError || 'Server error occurred');
        }
      } else {
        setError(t?.networkError || "Network error. Please check your connection.");
      }
    } finally { 
      setLoading(false); 
    }
  };

  // KYC verification message
  if (showKYCVerificationMessage || (userData?.kycSubmitted === true && userData?.kycCompleted === false)) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <div className="bg-yellow-100 p-3 rounded-full inline-block mb-3">
          <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 className="text-sm font-bold text-yellow-600 mb-2">{t?.kycVerificationRequired || "KYC verification required"}</h3>
        <p className="text-gray-500 text-xs mb-4">{t?.kycVerificationDesc || "Complete KYC verification to withdraw funds."}</p>
        <button 
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm"
          onClick={() => setActiveLeftTab(t?.kyc || 'KYC')}
        >
          {t?.completeKycVerification || "Complete KYC"}
        </button>
      </div>
    );
  }

  // Withdrawal banned message
  if (isWithdrawalBanned) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <div className="bg-red-100 p-3 rounded-full inline-block mb-3">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h3 className="text-sm font-bold text-red-500 mb-1">{t?.withdrawalRestricted || 'Withdrawal Restricted'}</h3>
        <p className="text-gray-500 text-xs mb-3">{t?.withdrawalRestrictedDesc || 'Your withdrawal privilege has been restricted.'}</p>
        <div className="bg-white p-3 rounded-xl text-left text-xs mb-3">
          <p className="text-gray-400">{t?.reason || 'Reason'}</p>
          <p className="text-red-500 font-medium">{banReason || t?.noReasonSpecified || 'No reason specified'}</p>
          {unbanDate && (
            <>
              <p className="text-gray-400 mt-1">{t?.banEndDate || 'Ban end date'}</p>
              <p className="text-yellow-600 font-medium">{formatUnbanDate(unbanDate)}</p>
              <p className="text-gray-400 mt-1">{t?.timeRemaining || 'Time remaining'}</p>
              <p className="text-green-600 font-medium">{getTimeUntilUnban()}</p>
            </>
          )}
        </div>
        <p className="text-gray-400 text-xs">{t?.contactSupport || 'Contact support for assistance'}</p>
      </div>
    );
  }

  // User loading
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-cyan-500 border-b-cyan-500 border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  // User error
  if (userError) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-xl text-xs text-center">
          {t?.userDataError || 'Error loading user data'}: {userError}
        </div>
      </div>
    );
  }

  // No mobile number
  if (!hasMobileNumber) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <h3 className="text-sm font-bold text-gray-700 mb-2">{t?.addMobileNumber || 'Add Mobile Number'}</h3>
        <p className="text-gray-500 text-xs mb-4">{t?.addMobileNumberDesc || 'Mobile number required for withdrawals'}</p>
        <button 
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-5 rounded-lg text-sm"
          onClick={() => setActiveLeftTab(t?.myAccount || 'আমার অ্যাকাউন্ট')}
        >
          {t?.editProfile || 'Edit Profile'}
        </button>
      </div>
    );
  }

  // Disabled state based on conditions
  const isDisabled = !amount || amount < 800 || !accountNumber || !transactionPassword || loading || hasActiveBonus || wageringStatus === 'less-than-1x' || parseFloat(amount || 0) > availableBalance;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t?.withdrawMoney || 'টাকা উত্তোলন'}</h3>

      {/* Balance Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <p className="text-cyan-500 font-bold text-sm mb-1">{t?.availableBalance || 'Available Balance'}</p>
        <p className="text-2xl font-bold text-gray-800">৳ {formatNumber(availableBalance)}</p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        
        {/* Active Bonus Section */}
        {hasActiveBonus && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-xl mb-4 text-xs">
            <p className="font-semibold mb-1">{t?.activeBonus || 'Active Bonus'}</p>
            <p className="text-gray-600">
              {(t?.activeBonusMessage || 'You have active bonus of {amount} BDT').replace('{amount}', formatNumber(userData?.bonusBalance || 0))}
            </p>
            
            {userData?.waigeringneed > 0 && userData?.bonusBalance > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${wageringProgress >= 100 ? 'bg-green-500' : 'bg-yellow-400'}`} 
                    style={{ width: `${wageringProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 text-[10px] mt-1">
                  {(t?.wageringProgress || 'Bet: {bet}/{target} ({percent}%)')
                    .replace('{bet}', formatNumber(userData.total_bet || 0))
                    .replace('{target}', formatNumber(userData.waigeringneed * userData.bonusBalance))
                    .replace('{percent}', wageringProgress.toFixed(0))}
                </p>
              </div>
            )}

            {bonusCountdown && !bonusCountdown.expired && (
              <p className="mt-1 text-gray-500 text-[10px]">
                {t?.bonusExpiresIn || 'Bonus expires in'}: <span className="font-semibold text-yellow-600">
                  {bonusCountdown.days}d {bonusCountdown.hours}h {bonusCountdown.minutes}m
                </span>
              </p>
            )}

            {isWageringComplete && (
              <div className="mt-2 p-1.5 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 font-semibold text-[10px]">
                  {t?.wageringRequirementMet || "Wagering complete!"}
                </p>
              </div>
            )}

            <div className="mt-2 flex items-center gap-2">
              {!isWageringComplete && (
                <div className="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    id="cancelBonus" 
                    checked={cancelBonus} 
                    onChange={(e) => { 
                      if (e.target.checked) setShowBonusCancelConfirm(true); 
                      else setCancelBonus(false); 
                    }} 
                    className="h-3 w-3"
                  />
                  <label htmlFor="cancelBonus" className="text-[10px] text-gray-500">
                    {t?.cancelBonusCheckbox || 'Cancel bonus'}
                  </label>
                </div>
              )}
              {isWageringComplete && (
                <button 
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                    transferBonusLoading 
                      ? 'bg-gray-200 text-gray-400' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`} 
                  onClick={handleTransferBonus} 
                  disabled={transferBonusLoading}
                >
                  {transferBonusLoading ? '...' : (t?.transferBonus || 'Transfer to Main')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bonus Cancel Confirmation Modal */}
        {showBonusCancelConfirm && (
          <div className="bg-gray-50 border border-red-200 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">{t?.confirmCancelBonus || 'Cancel Bonus?'}</h3>
            <p className="text-gray-500 text-xs mb-2">
              {t?.cancelBonusMessage || 'Are you sure you want to cancel your bonus?'}
            </p>
            <div className="bg-white p-2 rounded-lg border border-gray-100 mb-2">
              <p className="text-cyan-500 font-semibold text-sm">৳{formatNumber(userData?.bonusBalance || 0)}</p>
            </div>
            <p className="text-red-400 text-xs mb-3">
              {t?.cancelBonusWarning || 'This action cannot be undone'}
            </p>
            <div className="flex gap-2">
              <button 
                className="flex-1 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200" 
                onClick={() => { setShowBonusCancelConfirm(false); setCancelBonus(false); }} 
                disabled={cancelBonusLoading}
              >
                {t?.cancel || 'Cancel'}
              </button>
              <button 
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-xs font-semibold text-white" 
                onClick={handleCancelBonus} 
                disabled={cancelBonusLoading}
              >
                {cancelBonusLoading ? '...' : (t?.confirm || 'Confirm')}
              </button>
            </div>
          </div>
        )}

        {/* Wagering Info */}
        {needsWagering && (
          <div className="bg-purple-50 border border-purple-200 text-purple-600 p-3 rounded-xl mb-4 text-xs">
            <div className="flex items-start gap-2">
              <ImInfo className="text-sm flex-shrink-0 mt-0.5"/>
              <div>
                <p className="font-semibold mb-1">{t?.wageringRequirement || 'Wagering Requirement'}</p>
                
                {wageringStatus === 'less-than-1x' && (
                  <>
                    <p className="text-red-500">
                      {(t?.wagering1xIncomplete || 'Bet {bet}/{target}').replace('{bet}', formatNumber(userData?.total_bet || 0)).replace('{target}', formatNumber(userData?.total_deposit || 0))}
                    </p>
                    <p className="mt-1">
                      {(t?.wagering1xInstruction || 'Need {amount} more to withdraw').replace('{amount}', formatNumber(remainingWagering))}
                    </p>
                  </>
                )}
                
                {(wageringStatus === 'less-than-3x' || wageringStatus === 'less-than-deposit') && (
                  <>
                    <p>
                      {(t?.remainingWagering || 'Remaining: {amount}').replace('{amount}', formatNumber(remainingWagering))}
                    </p>
                    <p className="mt-1">
                      {t?.commissionWarning || '20% commission applies on withdrawals before 3x wagering'}
                    </p>
                    {amount && (
                      <div className="mt-1.5 bg-purple-100 p-2 rounded-lg">
                        <p>{t?.withdrawalAmount || 'Withdrawal'}: ৳{formatNumber(parseFloat(amount))}</p>
                        <p>{t?.commission || 'Commission'}: ৳{formatNumber(parseFloat(amount) * commissionRate)}</p>
                        <p className="font-bold">
                          {t?.receivable || 'Receivable'}: ৳{formatNumber(parseFloat(amount) * (1 - commissionRate))}
                        </p>
                      </div>
                    )}
                  </>
                )}
                
                {wageringStatus === 'pending-wagering' && (
                  <>
                    <p>
                      {(t?.remainingWagering || 'Remaining: {amount}').replace('{amount}', formatNumber(remainingWagering))}
                    </p>
                    <p className="mt-1">
                      {(t?.wageringInstruction || 'Complete {target} wagering requirement').replace('{target}', formatNumber(userData?.waigeringneed * userData?.bonusBalance))}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-xl mb-4 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Payment Method */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            {t?.paymentMethod || 'Select your preferred payment method'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* Bkash */}
            <button
              onClick={() => setPaymentMethod('bkash')}
              className={`rounded-lg border-2 p-2.5 flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'bkash' 
                  ? 'border-cyan-400 bg-cyan-50' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <img 
                src="https://images.5949390294.com/mcs-images/bank_type/BKASH/BN_2_20240312225413337.png" 
                alt="bkash" 
                className="w-10 h-7 object-contain"
              />
              <span className="text-[10px] font-bold text-gray-600">
                {t?.bkash || 'Bkash P2P'}
              </span>
            </button>

            {/* Nagad */}
            <button
              onClick={() => setPaymentMethod('nagad')}
              className={`rounded-lg border-2 p-2.5 flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'nagad' 
                  ? 'border-cyan-400 bg-cyan-50' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <img 
                src="https://images.5949390294.com/mcs-images/bank_type/NAGAD/BN_2_20240312230148421.png" 
                alt="nagad" 
                className="w-10 h-7 object-contain"
              />
              <span className="text-[10px] font-bold text-gray-600">
                {t?.nagad || 'Nagad P2P'}
              </span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            {t?.withdrawalAmount || 'Enter Amount'}
          </label>
          <div className="relative">
            <input 
              type="number" 
              className="w-full border border-gray-200 rounded-lg py-3 pl-4 pr-10 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-cyan-400 focus:bg-white transition-colors" 
              placeholder={t?.amountPlaceholder || 'Minimum 800 BDT'} 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              min="800" 
              step="100"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">৳</span>
          </div>
          <p className="text-[10px] text-red-400 mt-1">
            *{t?.minimumAmount || 'Min & maximum withdrawal amount 800–25000 BDT'}
          </p>
        </div>

        {/* Account Number Input */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            {paymentMethod === 'bkash' 
              ? (t?.bkashNumber || 'Bkash Number') 
              : paymentMethod === 'nagad' 
                ? (t?.nagadNumber || 'Nagad Number') 
                : 'Rocket Number'}
          </label>
          <input 
            type="text" 
            className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-cyan-400 focus:bg-white transition-colors" 
            placeholder={t?.bkashPlaceholder || 'Enter wallet number'} 
            value={accountNumber} 
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            {t?.accountNumberFormat || 'Format: 01XXXXXXXXX'}
          </p>
        </div>

        {/* Transaction Password */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            {t?.transactionPassword || 'Enter Transaction Password'}
          </label>
          <div className="relative">
            <input 
              type={showTransactionPassword ? "text" : "password"} 
              className="w-full border border-gray-200 rounded-lg py-3 pl-4 pr-10 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-cyan-400 focus:bg-white transition-colors" 
              placeholder={t?.transactionPasswordPlaceholder || 'Enter Transaction Password'} 
              value={transactionPassword} 
              onChange={(e) => setTransactionPassword(e.target.value)}
            />
            <button 
              type="button" 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowTransactionPassword(!showTransactionPassword)}
            >
              {showTransactionPassword ? <FaEyeSlash size={13}/> : <FaEye size={13}/>}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className={`w-full py-3.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
            isDisabled 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
          }`}
          onClick={handleWithdrawal}
          disabled={isDisabled}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {t?.processing || 'Processing...'}
            </>
          ) : wageringStatus === 'less-than-1x' ? (
            t?.complete1xWagering || 'Complete Wagering First'
          ) : hasActiveBonus ? (
            t?.cancelOrTransferBonus || 'Cancel or Transfer Bonus'
          ) : (
            t?.requestWithdrawal || 'Request Withdrawal'
          )}
        </button>
      </div>

      {/* Withdrawal History */}
      {isKYCCompleted && (
        <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {t?.withdrawalHistory || 'Withdrawal History'}
          </h4>
          
          {historyLoading ? (
            <div className="text-center py-4">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-cyan-500 border-r-transparent"></div>
              <p className="text-xs text-gray-400 mt-1">{t?.loading || 'Loading...'}</p>
            </div>
          ) : withdrawalHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-2 text-left font-medium text-gray-600">{t?.date || 'Date'}</th>
                    <th className="py-2 px-2 text-left font-medium text-gray-600">{t?.amount || 'Amount'}</th>
                    <th className="py-2 px-2 text-left font-medium text-gray-600">{t?.method || 'Method'}</th>
                    <th className="py-2 px-2 text-left font-medium text-gray-600">{t?.status || 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalHistory.slice(0, 5).map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="py-2 px-2 text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2 text-gray-800 font-medium">
                        ৳{formatNumber(item.amount)}
                      </td>
                      <td className="py-2 px-2 text-gray-600">
                        {item.provider || item.method}
                      </td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {withdrawalHistory.length > 5 && (
                <p className="text-center text-[10px] text-gray-400 mt-2">
                  {t?.viewMore || 'View more in account records'}
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xs py-4">
              {t?.noWithdrawalHistory || 'No withdrawal history found'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Betting Record Tab Content
const BettingRecordTabContent = () => {
  const { t, language } = useContext(LanguageContext);
  const { userData } = useUser(); // Add this to get user data
  const [timeRange, setTimeRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalBets: 0,
    totalWins: 0,
    totalRefunds: 0,
    netProfit: 0
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterGame, setFilterGame] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [error, setError] = useState('');
  const itemsPerPage = 10;

  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const formatCurrency = (amount) => new Intl.NumberFormat(language?.code === 'bn' ? 'bn-BD' : 'en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Intl.DateTimeFormat(language.code === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const getDateRange = (range) => {
    const now = new Date();
    let startDate, endDate;
    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default:
        startDate = null;
        endDate = null;
    }
    return {
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    };
  };

  // Fetch betting records from API
  const fetchBettingRecords = async (page = 1, range = timeRange) => {
    if (!userData?._id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { startDate, endDate } = getDateRange(range);
      const response = await axios.get(`${base_url}/user/game-history/${userData._id}`, {
        params: { 
          page, 
          limit: itemsPerPage, 
          startDate, 
          endDate 
        },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      if (response.data.success) {
        const { sessions: sessionData, summary: summaryData, pagination: paginationData } = response.data.data;
        
        // Process the sessions data
        const processed = (sessionData || []).map(session => {
          const transactions = session.transactions || [];
          const totalBet = transactions.filter(tx => tx.type === 'bet').reduce((s, tx) => s + (tx.amount || 0), 0);
          const totalWin = transactions.filter(tx => tx.type === 'win').reduce((s, tx) => s + (tx.amount || 0), 0);
          const totalRefund = transactions.filter(tx => tx.type === 'refund').reduce((s, tx) => s + (tx.amount || 0), 0);
          
          // Determine status
          let status = 'loss';
          if (totalWin > 0) status = 'win';
          else if (totalRefund > 0) status = 'refund';
          
          return { 
            ...session, 
            totalBet, 
            totalWin, 
            totalRefund, 
            netResult: totalWin + totalRefund - totalBet,
            status,
            game: session.game_name || '—',
            date: session.started_at || session.createdAt,
            bet: totalBet,
            win: totalWin,
            refund: totalRefund
          };
        });
        
        setRecords(processed);
        setSummary(summaryData || { totalBets: 0, totalWins: 0, totalRefunds: 0, netProfit: 0 });
        setPagination({
          page: paginationData?.page || page,
          limit: itemsPerPage,
          total: paginationData?.total || 0,
          pages: paginationData?.pages || 0,
        });
        setCurrentPage(page);
      } else {
        setError(t.fetchRecordsError || 'Failed to load records.');
      }
    } catch (err) {
      console.error('Error fetching betting records:', err);
      setError(err.response?.data?.message || t.fetchRecordsError || 'Failed to load records.');
    } finally {
      setLoading(false);
    }
  };

  // Filter records based on game name and date (client-side filtering)
  const filteredRecords = records.filter(record => {
    const matchGame = filterGame
      ? (record.game || '').toLowerCase().includes(filterGame.toLowerCase())
      : true;
    const matchDate = filterDate
      ? new Date(record.date).toISOString().slice(0, 10) === filterDate
      : true;
    return matchGame && matchDate;
  });

  const hasActiveFilter = filterGame || filterDate;

  // Time range labels
  const timeRanges = [
    { id: 'today', label: t?.today || 'Today', icon: '📅' },
    { id: 'yesterday', label: t?.yesterday || 'Yesterday', icon: '📆' },
    { id: 'week', label: t?.week || 'This Week', icon: '📊' },
    { id: 'month', label: t?.month || 'This Month', icon: '📈' },
    { id: 'all', label: t?.all || 'All Time', icon: '🎯' },
  ];

  // Fetch data when time range or user changes
  useEffect(() => {
    if (userData?._id) {
      fetchBettingRecords(1, timeRange);
    }
  }, [userData, timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setCurrentPage(1);
    setFilterGame('');
    setFilterDate('');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchBettingRecords(newPage, timeRange);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'win') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Win</span>;
    } else if (status === 'refund') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Refund</span>;
    } else if (status === 'loss') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Loss</span>;
    }
    return null;
  };

  // Display records (either paginated from API or filtered)
  const displayRecords = hasActiveFilter ? filteredRecords : records;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
      {/* Filter Drawer */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-fadeInUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Filter Bets</h3>
              <p className="text-sm text-gray-500 mt-1">Narrow down your betting history</p>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Game Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Game Name
                </label>
                <input
                  type="text"
                  value={filterGame}
                  onChange={e => setFilterGame(e.target.value)}
                  placeholder="Search by game name..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-gray-50 text-gray-700 transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specific Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-gray-50 text-gray-700 transition-all"
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { setFilterGame(''); setFilterDate(''); setFilterOpen(false); }}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {t?.bettingRecord || 'Betting History'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              View and analyze your betting activity
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {hasActiveFilter && displayRecords.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-600 text-sm">🎯</span>
                <span className="text-orange-700 text-sm font-medium">
                  {displayRecords.length} results
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                  timeRange === range.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => handleTimeRangeChange(range.id)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Main Table */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-cyan-500 border-b-cyan-500 border-l-transparent border-r-transparent mx-auto"></div>
              <p className="text-gray-500 mt-3">Loading betting records...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl  overflow-hidden border border-gray-200">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                                      <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.date}</th>
                        <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.gameName}</th>
                 <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.totalBet}</th>
          <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.totalWin}</th>
              <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.totalRefund}</th>
                       <th className="py-2 px-4 text-left text-sm border-b border-gray-600">
                                        {t.status || 'Status'}
                                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayRecords.length > 0 ? (
                    displayRecords.map((record, index) => (
                      <tr key={record.session_id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6 text-sm text-gray-600 whitespace-nowrap">
                          {formatDate(record.date)}
                        </td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-800">
                          {record.game}
                        </td>
                        <td className="py-3 px-6 text-sm text-blue-600 font-semibold text-right">
                          ৳{formatCurrency(record.bet)}
                        </td>
                        <td className="py-3 px-6 text-sm text-green-600 font-semibold text-right">
                          ৳{formatCurrency(record.win)}
                        </td>
                        <td className="py-3 px-6 text-sm text-yellow-600 font-semibold text-right">
                          ৳{formatCurrency(record.refund || 0)}
                        </td>
                        <td className="py-3 px-6 text-center">
                          {getStatusBadge(record.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                            />
                          </svg>
                          <p className="text-gray-500 font-medium">No betting records found</p>
                          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or time range</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {displayRecords.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {displayRecords.map((record, index) => (
                    <div key={record.session_id || index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-800">{record.game}</div>
                          <div className="text-xs text-gray-500 mt-1">{formatDate(record.date)}</div>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Bet</div>
                          <div className="text-sm font-semibold text-blue-600">৳{formatCurrency(record.bet)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Win</div>
                          <div className="text-sm font-semibold text-green-600">৳{formatCurrency(record.win)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Refund</div>
                          <div className="text-sm font-semibold text-yellow-600">৳{formatCurrency(record.refund || 0)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    <p className="text-gray-500 font-medium">No betting records found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or time range</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination - Only show when not filtering and API pagination available */}
            {!hasActiveFilter && pagination.pages > 1 && (
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total entries)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                            pagination.page === pageNum
                              ? 'bg-cyan-500 text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Account Record Tab Content
const AccountRecordTabContent = () => {
  const { t, language } = useContext(LanguageContext);
  const { userData, loading, error, fetchUserData } = useUser();
  const [recordType, setRecordType] = useState('all');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter records based on selected type
  useEffect(() => {
    if (!userData) return;

    let records = [];
    
    // Combine all transaction types
    if (recordType === 'all' || recordType === 'deposit') {
      const deposits = userData.depositHistory || [];
      records = [...records, ...deposits.map(deposit => ({
        ...deposit,
        transactionType: 'deposit',
        originalType: 'deposit',
        amount: deposit.amount,
        status: deposit.status,
        description: deposit.description || `${t.depositDesc?.replace('{method}', deposit.method || t.na) || 'Deposit via ' + (deposit.method || 'N/A')}`,
        createdAt: deposit.createdAt || deposit.date
      }))];
    }
    
    if (recordType === 'all' || recordType === 'withdrawal') {
      const withdrawals = userData.withdrawHistory || [];
      records = [...records, ...withdrawals.map(withdrawal => ({
        ...withdrawal,
        transactionType: 'withdrawal',
        originalType: 'withdrawal',
        amount: withdrawal.amount,
        status: withdrawal.status,
        description: withdrawal.description || `${t.withdrawalDesc?.replace('{method}', withdrawal.method || t.na) || 'Withdrawal via ' + (withdrawal.method || 'N/A')}`,
        createdAt: withdrawal.createdAt || withdrawal.date
      }))];
    }
    
    if (recordType === 'all' || recordType === 'bonus') {
      const bonuses = userData.bonusActivityLogs || [];
      records = [...records, ...bonuses.map(bonus => ({
        ...bonus,
        transactionType: 'bonus',
        originalType: 'bonus',
        amount: bonus.bonusAmount,
        status: bonus.status || 'completed',
        description: bonus.description || `${t.bonusDesc?.replace('{bonusType}', bonus.bonusType || 'bonus') || 'Bonus received'}`,
        createdAt: bonus.activatedAt || bonus.createdAt
      }))];
      
      // Also include bonus transactions from transactionHistory
      const bonusTransactions = (userData.transactionHistory || []).filter(
        transaction => transaction.type === 'bonus'
      );
      records = [...records, ...bonusTransactions.map(transaction => ({
        ...transaction,
        transactionType: 'bonus',
        originalType: 'bonus',
        amount: transaction.amount,
        status: transaction.status,
        description: transaction.description || t.bonusDesc || 'Bonus transaction',
        createdAt: transaction.createdAt
      }))];
    }

    // Sort by date (newest first)
    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredRecords(records);
    setCurrentPage(1);
  }, [userData, recordType, t]);

  // Apply additional filters (status and date)
  const getFilteredRecords = () => {
    let records = [...filteredRecords];
    
    if (filterStatus) {
      records = records.filter(record => record.status === filterStatus);
    }
    
    if (filterDate) {
      records = records.filter(record => {
        const recordDate = new Date(record.createdAt).toISOString().slice(0, 10);
        return recordDate === filterDate;
      });
    }
    
    return records;
  };

  const displayRecords = getFilteredRecords();
  const hasActiveFilter = filterStatus || filterDate;
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = displayRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayRecords.length / itemsPerPage);

  // Format date with seconds
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language.code === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'processing': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      'success': { bg: 'bg-green-100', text: 'text-green-800', label: 'Success' },
      'failed': { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const label = t[`status${status?.charAt(0).toUpperCase() + status?.slice(1)}`] || config.label;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {label}
      </span>
    );
  };

  // Get type badge with styling
  const getTypeBadge = (type) => {
    const typeConfig = {
      'deposit': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '', label: 'Deposit' },
      'withdrawal': { bg: 'bg-orange-100', text: 'text-orange-800', icon: '', label: 'Withdrawal' },
      'bonus': { bg: 'bg-purple-100', text: 'text-purple-800', icon: '', label: 'Bonus' },
      'first_deposit': { bg: 'bg-green-100', text: 'text-green-800', icon: '', label: 'First Deposit' },
      'special_bonus': { bg: 'bg-pink-100', text: 'text-pink-800', icon: '', label: 'Special Bonus' }
    };
    
    const config = typeConfig[type] || typeConfig.deposit;
    const label = t[`type${type?.charAt(0).toUpperCase() + type?.slice(1)}`] || config.label;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span>{config.icon}</span>
        {label}
      </span>
    );
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat(language.code === 'bn' ? 'bn-BD' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Record type buttons
  const recordTypes = [
    { id: 'all', label: t?.all || 'All', icon: '📊' },
    { id: 'deposit', label: t?.deposit || 'Deposit', icon: '💰' },
    { id: 'withdrawal', label: t?.withdrawal || 'Withdrawal', icon: '💸' },
    { id: 'bonus', label: t?.bonus || 'Bonus', icon: '🎁' },
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm p-6">
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-cyan-500 border-b-cyan-500 border-l-transparent border-r-transparent mx-auto"></div>
            <p className="text-gray-500 mt-3">{t?.loading || 'Loading records...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-3 text-5xl">⚠️</div>
          <p className="text-red-600 mb-3">{error}</p>
          <button 
            onClick={fetchUserData}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            {t?.tryAgain || 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
      {/* Filter Drawer */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-fadeInUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Filter Transactions</h3>
              <p className="text-sm text-gray-500 mt-1">Narrow down your transaction history</p>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-gray-50 text-gray-700 transition-all"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specific Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-gray-50 text-gray-700 transition-all"
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { setFilterStatus(''); setFilterDate(''); setFilterOpen(false); }}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {t?.accountRecord || 'Account History'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              View all your deposits, withdrawals, and bonus transactions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {hasActiveFilter && displayRecords.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-600 text-sm">🎯</span>
                <span className="text-orange-700 text-sm font-medium">
                  {displayRecords.length} results
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Record Type Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {recordTypes.map((type) => (
              <button
                key={type.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                  recordType === type.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setRecordType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>


        {/* Main Table */}
        <div className="bg-white rounded-xl  overflow-hidden border border-gray-200">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
              <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.dateTime}</th>
                <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.type}</th>
                <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.amount}</th>
                <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.status}</th>
                <th className="py-2 px-4 text-left text-sm border-b border-gray-600">{t.description}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRecords.length > 0 ? (
                  currentRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="py-3 px-6">
                        {getTypeBadge(record.transactionType)}
                      </td>
                      <td className={`py-3 px-6 text-sm font-semibold text-right ${
                        record.transactionType === 'deposit' || record.transactionType === 'bonus' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {record.transactionType === 'deposit' || record.transactionType === 'bonus' ? '+' : '-'}
                        ৳{formatAmount(record.amount)}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-500 max-w-xs truncate">
                        {record.description || '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        <p className="text-gray-500 font-medium">No transactions found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or record type</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {currentRecords.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {currentRecords.map((record, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeBadge(record.transactionType)}
                          {getStatusBadge(record.status)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(record.createdAt)}
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        record.transactionType === 'deposit' || record.transactionType === 'bonus' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {record.transactionType === 'deposit' || record.transactionType === 'bonus' ? '+' : '-'}
                        ৳{formatAmount(record.amount)}
                      </div>
                    </div>
                    {record.description && (
                      <div className="mt-2 text-xs text-gray-500 border-t border-gray-100 pt-2">
                        {record.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <p className="text-gray-500 font-medium">No transactions found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or record type</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, displayRecords.length)} of {displayRecords.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Profit Loss Tab Content
const ProfitLossTabContent = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t?.profitLoss || 'লাভ/ক্ষতি'}</h3>
      <p className="text-gray-500 text-center py-8">{t?.noData || 'কোন ডেটা নেই'}</p>
    </div>
  );
};

// Reward Center Tab Content
// Reward Center Tab Content
 
const RewardCenterTabContent = () => {
  const { t, language } = useContext(LanguageContext);
  const { userData, fetchUserData } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weeklyBonus, setWeeklyBonus] = useState(null);
  const [monthlyBonus, setMonthlyBonus] = useState(null);
  const [cashBonuses, setCashBonuses] = useState([]);
  const [depositBonuses, setDepositBonuses] = useState([]);
  const [depositBonusLoading, setDepositBonusLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [weeklyTimeLeft, setWeeklyTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [monthlyTimeLeft, setMonthlyTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  // Level configuration for progress bar
  const LEVELS = [
    { name: 'Bronze', threshold: 0, color: '#cd7f32' },
    { name: 'Silver', threshold: 10000, color: '#c0c0c0' },
    { name: 'Gold', threshold: 50000, color: '#ffd700' },
    { name: 'Platinum', threshold: 200000, color: '#e5e4e2' },
    { name: 'Diamond', threshold: 1000000, color: '#b9f2ff' },
  ];

  const getLevelData = (bet = 0) => {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];
    
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (bet >= LEVELS[i].threshold) {
        currentLevel = LEVELS[i];
        nextLevel = LEVELS[i + 1] || null;
        break;
      }
    }
    
    const percentage = nextLevel
      ? Math.min(100, Math.round(((bet - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100))
      : 100;
    
    return { currentLevel, nextLevel, percentage, totalBet: bet };
  };

  // ─── Date Helpers ──────────────────────────────────────────────────────────

  const getNextTuesday = () => {
    const today = new Date(), dayOfWeek = today.getDay();
    const t = new Date(today);
    t.setDate(today.getDate() + (dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek));
    t.setHours(0, 0, 0, 0);
    return t;
  };

  const getNext4thDay = () => {
    const d = new Date();
    const t = d.getDate() < 4
      ? new Date(d.getFullYear(), d.getMonth(), 4)
      : new Date(d.getFullYear(), d.getMonth() + 1, 4);
    t.setHours(0, 0, 0, 0);
    return t;
  };

  const calcTL = (target) => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };

  const pad = n => String(n).padStart(2, '0');

  const isTuesday = () => new Date().getDay() === 2;
  const is4thDay  = () => new Date().getDate() === 4;

  // ─── Formatters ────────────────────────────────────────────────────────────

  const fmt = n =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

  const fmtD = d => d ? new Date(d).toLocaleDateString('en-US') : 'N/A';

  const imgFor = type => ({
    birthday: bonusimg1, anniversary: bonusimg1, celebration: bonusimg1,
    festival: bonusimg2, special_event: bonusimg2,
    holiday: bonusimg3, thank_you: bonusimg4,
  }[type] || bonusimg1);

  // ─── API Calls ─────────────────────────────────────────────────────────────

  const hdrs = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    userId: userData._id,
  });

  const fetchBonuses = async () => {
    if (!userData?._id) return;
    try {
      if (!refreshing) setLoading(true);
      const [bonusResponse, cashResponse] = await Promise.all([
        axios.get(`${base_url}/user/bonus/monthly-weekly/${userData._id}`, { headers: hdrs() }),
        axios.get(`${base_url}/user/cash-bonus/list/${userData._id}`,       { headers: hdrs() }),
      ]);
      if (bonusResponse.data.success) {
        const bonusData = bonusResponse.data.data || [];
        const weekly  = bonusData.find(b => b.type === 'weekly');
        const monthly = bonusData.find(b => b.type === 'monthly');
        setWeeklyBonus(weekly   ? { ...weekly,  canClaim: isTuesday() && weekly.status  === 'unclaimed' } : null);
        setMonthlyBonus(monthly ? { ...monthly, canClaim: is4thDay()  && monthly.status === 'unclaimed' } : null);
        setError(null);
      }
      if (cashResponse.data.success) setCashBonuses(cashResponse.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bonuses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDepositBonuses = async () => {
    try {
      setDepositBonusLoading(true);
      const user  = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      if (!user || !user._id) return;
      const response = await axios.get(`${base_url}/user/bonuses/available`, {
        headers: { Authorization: `Bearer ${token}` },
        params:  { userid: user._id },
      });
      if (response.data) setDepositBonuses(response.data.data || []);
    } catch (err) {
      console.error('Error fetching deposit bonuses:', err);
    } finally {
      setDepositBonusLoading(false);
    }
  };

  const claimBonus = async (bonusId, bonusType) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${base_url}/user/bonus/claim/${userData._id}`,
        { bonusId },
        { headers: { ...hdrs(), 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        setFeedback({ type: 'success', message: `${bonusType} bonus claimed! +${fmt(response.data.data?.amount)} ৳` });
        await fetchBonuses(); await fetchUserData();
        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
      } else {
        setFeedback({ type: 'error', message: response.data.message || `Failed to claim ${bonusType} bonus` });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || `Failed to claim ${bonusType} bonus` });
    } finally { setLoading(false); }
  };

  const claimCashBonus = async (bonusId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${base_url}/user/cash-bonus/claim/${bonusId}`, {},
        { headers: { ...hdrs(), 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        setFeedback({ type: 'success', message: response.data.message });
        await fetchBonuses(); await fetchUserData();
        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
      } else {
        setFeedback({ type: 'error', message: response.data.message || 'Failed to claim bonus' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to claim bonus' });
    } finally { setLoading(false); }
  };

  const handleRefresh = () => { setRefreshing(true); fetchBonuses(); };

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const tick = () => {
      setWeeklyTimeLeft(calcTL(getNextTuesday()));
      setMonthlyTimeLeft(calcTL(getNext4thDay()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (userData?._id) { fetchBonuses(); fetchDepositBonuses(); }
  }, [userData]);

  // ─── Derived State ─────────────────────────────────────────────────────────

  const availableCashBonuses = cashBonuses.filter(b => b.canClaim === true);
  const claimedCashBonuses   = cashBonuses.filter(b => b.userStatus === 'claimed');
  const expiredCashBonuses   = cashBonuses.filter(b => b.isExpired === true);
  
  // Level progress data
  const levelData = getLevelData(userData?.lifetime_bet || 0);

  // Progress Bar Component
  const ProgressBar = ({ percentage, color }) => (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );

  // Level Card Component
  const LevelCard = () => (
    <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-cyan-100">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-sm font-semibold text-gray-600">Current Level</span>
          <h3 className="text-2xl font-bold" style={{ color: levelData.currentLevel.color }}>
            {levelData.currentLevel.name}
          </h3>
        </div>
        {levelData.nextLevel && (
          <div className="text-right">
            <span className="text-xs text-gray-500">Next: {levelData.nextLevel.name}</span>
            <p className="text-sm font-semibold text-gray-700">
              {fmt(levelData.totalBet)} / {fmt(levelData.nextLevel.threshold)}
            </p>
          </div>
        )}
      </div>
      <ProgressBar percentage={levelData.percentage} color={levelData.currentLevel.color} />
      <div className="mt-3 text-xs text-gray-500 text-center">
        Total Lifetime Bet: {fmt(levelData.totalBet)} ৳
      </div>
    </div>
  );

  // Compact Bonus Card for 2-per-row layout
  const CompactBonusCard = ({ tag, title, rows, img, claimed, onClaim, claimLabel }) => (
    <div
      className="relative mb-4 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        border: '1px solid #81d4fa',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <div className="p-3">
        {/* Image top-right absolute */}
        <div className="absolute pointer-events-none z-10" style={{ top: 5, right: 5, width: 60, height: 60 }}>
          <img src={img} alt="bonus" className="w-12 object-contain opacity-80" />
        </div>
        
        {/* Tag */}
        <span
          className="inline-block text-[10px] font-semibold rounded-full px-2 py-0.5 mb-2"
          style={{ background: '#ffffff', color: '#4a6572', border: '0.5px solid #ffe0b2' }}
        >
          {tag}
        </span>
        
        {/* Title */}
        <p className="font-bold text-sm mb-2 pr-12" style={{ color: '#0d2b35' }}>
          {title}
        </p>
        
        {/* Info rows - simplified for compact view */}
        <div className="space-y-1 mb-3">
          {rows.slice(0, 3).map(([k, v], idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500">{k}</span>
              <span className="text-[10px] font-semibold text-gray-800">{v}</span>
            </div>
          ))}
        </div>
        
        {/* Button */}
        {claimed ? (
          <div className="flex items-center justify-center gap-1 py-1.5 bg-green-50 rounded-lg">
            <MdCheckCircle className="text-green-500 text-sm" />
            <span className="text-green-700 text-xs font-semibold">Claimed</span>
          </div>
        ) : (
          <button
            onClick={!loading ? onClaim : undefined}
            disabled={loading}
            className="w-full py-1.5 text-white font-semibold rounded-lg text-sm transition-all active:scale-95"
            style={{
              background: 'linear-gradient(90deg, #0ab8cc 0%, #00c8dc 100%)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '…' : (claimLabel || 'Claim')}
          </button>
        )}
      </div>
    </div>
  );

  // ─── Loading State ─────────────────────────────────────────────────────────

  if (loading && !refreshing) {
    return (
      <div className="bg-slate-50 p-6 rounded-lg min-h-[400px] flex flex-col items-center justify-center">
        <div
          className="w-11 h-11 rounded-full border-4 border-slate-200"
          style={{ borderTopColor: '#0bbcd4', animation: 'spin .8s linear infinite' }}
        />
        <p className="text-slate-400 mt-4 text-sm">Loading bonuses…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const wExp = `${pad(weeklyTimeLeft.d)}D:${pad(weeklyTimeLeft.h)}H:${pad(weeklyTimeLeft.m)}M:${pad(weeklyTimeLeft.s)}S`;
  const mExp = `${pad(monthlyTimeLeft.d)}D:${pad(monthlyTimeLeft.h)}H:${pad(monthlyTimeLeft.m)}M:${pad(monthlyTimeLeft.s)}S`;

  // Combine all bonuses for grid display
  const allBonuses = [
    weeklyBonus && { type: 'weekly', data: weeklyBonus, tag: 'Weekly', title: 'Weekly Reward', img: bonusimg2, 
      rows: [
        ['Wager', weeklyBonus.wager_requirement ?? '—'],
        ['Max', weeklyBonus.max_amount ? fmt(weeklyBonus.max_amount) : 'No Limit'],
        ['Time', weeklyBonus.status === 'claimed' ? 'Claimed' : isTuesday() ? 'Available!' : wExp],
      ] },
    monthlyBonus && { type: 'monthly', data: monthlyBonus, tag: 'Monthly', title: 'Monthly Reward', img: bonusimg3,
      rows: [
        ['Wager', monthlyBonus.wager_requirement ?? '—'],
        ['Max', monthlyBonus.max_amount ? fmt(monthlyBonus.max_amount) : 'No Limit'],
        ['Time', monthlyBonus.status === 'claimed' ? 'Claimed' : is4thDay() ? 'Available!' : mExp],
      ] },
    ...availableCashBonuses.map(b => ({
      type: 'cash', data: b, tag: b.bonusType?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Special',
      title: b.title, img: imgFor(b.bonusType),
      rows: [
        ['Amount', fmt(b.amount) + ' ৳'],
        ...(b.wager_requirement ? [['Wager', b.wager_requirement]] : []),
        ...(!b.noExpiry && b.expiresAt ? [['Expires', fmtD(b.expiresAt)]] : []),
      ],
    })),
  ].filter(Boolean);

  // Split into pairs for 2-per-row
  const bonusPairs = [];
  for (let i = 0; i < allBonuses.length; i += 2) {
    bonusPairs.push(allBonuses.slice(i, i + 2));
  }

  return (
    <div className=" font-anek min-h-screen pb-8">

      {/* ── Feedback Toast ── */}
      {feedback.message && (
        <div
          className={`mb-4 px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
          style={{ animation: 'fadeIn .3s ease' }}
        >
          {feedback.type === 'success'
            ? <MdCheckCircle className="text-green-500 text-lg flex-shrink-0" />
            : <MdInfoOutline  className="text-red-500 text-lg flex-shrink-0" />}
          {feedback.message}
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-sm">
          <span className="text-red-700">{error}</span>
          <button onClick={handleRefresh} className="text-cyan-500 font-medium text-xs ml-3">Retry</button>
        </div>
      )}

      <div className="pb-4">
        {/* ── Level Progress Card ── */}
        <LevelCard />

        {/* ── Section Title ── */}
        <p className="text-xl font-bold text-slate-900 tracking-tight mt-2 mb-4">
          { t.unlockableBonuses || 'Unlockable Bonuses'}
        </p>

        {/* ── Bonuses Grid - 2 per row ── */}
        {bonusPairs.length > 0 ? (
          <div className="space-y-4">
            {bonusPairs.map((pair, pairIdx) => (
              <div key={pairIdx} className="grid grid-cols-2 gap-3">
                {pair.map((bonus, idx) => (
                  <CompactBonusCard
                    key={`${bonus.type}-${bonus.data._id || idx}`}
                    tag={bonus.tag + ' Bonus'}
                    title={bonus.title}
                    rows={bonus.rows}
                    img={bonus.img}
                    claimed={bonus.type === 'weekly' || bonus.type === 'monthly' 
                      ? bonus.data.status === 'claimed' 
                      : false}
                    onClaim={() => {
                      if (bonus.type === 'weekly') claimBonus(bonus.data._id, 'weekly');
                      else if (bonus.type === 'monthly') claimBonus(bonus.data._id, 'monthly');
                      else claimCashBonus(bonus.data._id);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="mt-8 bg-white rounded-3xl border border-slate-100 py-12 px-6 flex flex-col items-center text-center">
            <GiTrophy className="text-5xl text-slate-300 mb-4" />
            <p className="font-bold text-slate-600 text-base mb-1">No Bonuses Available</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Place bets to earn weekly & monthly bonuses.<br />
              Check back Tuesday & 4th of each month.
            </p>
          </div>
        )}

        {/* ── Deposit Bonuses Section (separate, also 2 per row) ── */}
        {depositBonusLoading ? (
          <div className="flex items-center justify-center py-6">
            <div
              className="w-8 h-8 rounded-full border-4 border-slate-200"
              style={{ borderTopColor: '#0bbcd4', animation: 'spin .8s linear infinite' }}
            />
          </div>
        ) : depositBonuses.length > 0 && (
          <>
            <p className="text-xl font-bold text-slate-900 tracking-tight mt-6 mb-4">
                { t.depositBonuses || 'Deposit Bonuses'}
              
            </p>
            <div className="grid grid-cols-2 gap-3">
              {depositBonuses.map((b, idx) => {
                const bonusImgs = [bonusimg1, bonusimg2, bonusimg3, bonusimg4];
                const img = bonusImgs[idx % bonusImgs.length];
                const tag = b.bonusType
                  ? b.bonusType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                  : 'Deposit';
                const rows = [
                  ...(b.percentage > 0 ? [['Bonus %', `${b.percentage}%`]] : []),
                  ...(b.maxBonus > 0 ? [['Max', fmt(b.maxBonus)]] : []),
                  ...(b.minDeposit > 0 ? [['Min Dep.', fmt(b.minDeposit)]] : []),
                ];
                return (
                  <CompactBonusCard
                    key={b._id || b.id || idx}
                    tag={tag + ' Bonus'}
                    title={b.name || b.title || 'Deposit Bonus'}
                    rows={rows}
                    img={img}
                    claimed={false}
                    claimLabel="Deposit"
                    onClaim={() => navigate('/deposit')}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @keyframes spin   { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
// Invite Friend Tab Content
// Invite Friend Tab Content
const InviteFriendTabContent = () => {
  const { t, language } = useContext(LanguageContext);
  const { userData, fetchUserData } = useUser();
  const [activeTab, setActiveTab] = useState('invite'); // Added this line
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState({
    referralCode: '',
    referredBy: null,
    totalReferrals: 0,
    activeReferrals: 0,
    depositedReferrals: 0,
    totalDepositsByReferrals: 0,
    totalWithdrawalsByReferrals: 0,
    referralEarnings: 0,
    referredUsers: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '', field: '' });
  
  const API_BASE_URL = import.meta.env.VITE_API_KEY_Base_URL;
  const referralLink = `${window.location.origin}/?refer_code=${userData?.referralCode || ''}`;

  useEffect(() => {
    if (userData?._id) {
      fetchReferralData();
    }
  }, [userData]);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${API_BASE_URL}/user/referred-users-details/${userData?._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setReferralData(response.data.data);
      } else {
        throw new Error(t?.referralFetchError || 'Failed to fetch referral data');
      }
    } catch (err) {
      console.error('Error fetching referral data:', err);
      setError(err.response?.data?.message || err.message || t?.referralFetchError || 'Failed to fetch referral data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocialMedia = (platform) => {
    let url = '';
    const text = `${t?.referralShareText || 'Join using my referral link and get bonus'}: ${referralLink}`;
    
    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString) => {
    if (!dateString) return t?.na || 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(language?.code === 'bn' ? 'bn-BD' : 'en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language?.code === 'bn' ? 'bn-BD' : 'en-US', {
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatMobileNumber = (number) => {
    if (!number || number.length < 7) return number;
    const firstPart = number.substring(0, 4);
    const lastPart = number.substring(number.length - 3);
    return `${firstPart}****${lastPart}`;
  };

  const transferToMainBalance = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/user/transfer-refer-balance-to-main-balance`,
        { userId: userData._id },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setFeedback({
          type: 'success',
          message: t?.referralTransferSuccess || 'Referral earnings transferred successfully',
          field: 'referralEarnings'
        });
        setReferralData(prevData => ({
          ...prevData,
          referralEarnings: 0
        }));
        fetchUserData();
        
        // Clear feedback after 3 seconds
        setTimeout(() => setFeedback({ type: '', message: '', field: '' }), 3000);
      } else {
        throw new Error(t?.referralTransferError || 'Failed to transfer referral earnings');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || t?.referralTransferError || 'Failed to transfer referral earnings',
        field: 'referralEarnings'
      });
      
      // Clear feedback after 3 seconds
      setTimeout(() => setFeedback({ type: '', message: '', field: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t?.inviteFriend || 'বন্ধুকে আমন্ত্রণ'}</h3>
      
      {/* Feedback Message */}
      {feedback.message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          feedback.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <FaCheck className="text-green-500" />
              ) : (
                <FaTimes className="text-red-500" />
              )}
              {feedback.message}
            </div>
            <button 
              onClick={() => setFeedback({ type: '', message: '', field: '' })}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
            activeTab === 'invite' ? 'bg-theme_color2 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('invite')}
        >
          <FaUser size={12} /> {t?.inviteFriend || 'আমন্ত্রণ'}
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
            activeTab === 'list' ? 'bg-theme_color2 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('list')}
        >
          <FaHistory size={12} /> {t?.invitedList || 'আমন্ত্রিত তালিকা'}
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
            activeTab === 'reward' ? 'bg-theme_color2 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('reward')}
        >
          <FaCoins size={12} /> {t?.reward || 'পুরস্কার'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-theme_color2 border-b-theme_color2 border-l-transparent border-r-transparent"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 bg-theme_color2/20 blur-sm"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Invite Tab Content */}
      {!loading && !error && activeTab === 'invite' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3 text-gray-700">{t?.referralLink || 'আপনার রেফারেল লিঙ্ক'}</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                value={referralLink}
                readOnly
              />
              <button 
                className="bg-theme_color2 hover:bg-theme_color2/80 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
                onClick={handleCopyLink}
              >
                <FaCopy /> {copied ? (t?.copied || 'কপি হয়েছে') : (t?.copy || 'কপি করুন')}
              </button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3 text-gray-700">{t?.shareSocial || 'সোশ্যাল মিডিয়ায় শেয়ার করুন'}</h4>
            <div className="flex gap-3">
              <button 
                className="bg-[#1877F2] hover:bg-[#0E5FCC] text-white p-2.5 rounded-full transition-colors"
                onClick={() => shareOnSocialMedia('facebook')}
              >
                <FaFacebookF size={16} />
              </button>
              <button 
                className="bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white p-2.5 rounded-full transition-colors"
                onClick={() => shareOnSocialMedia('twitter')}
              >
                <FaTwitter size={16} />
              </button>
              <button 
                className="bg-[#24A1DE] hover:bg-[#1F8CC9] text-white p-2.5 rounded-full transition-colors"
                onClick={() => shareOnSocialMedia('telegram')}
              >
                <FaTelegramPlane size={16} />
              </button>
              <button 
                className="bg-[#25D366] hover:bg-[#20B859] text-white p-2.5 rounded-full transition-colors"
                onClick={() => shareOnSocialMedia('whatsapp')}
              >
                <FaWhatsapp size={16} />
              </button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3 text-gray-700">{t?.referralRules || 'রেফারেল নিয়ম'}</h4>
            <ul className="list-disc pl-5 text-sm text-gray-500 space-y-2">
              <li>{t?.rule1 || 'আপনার আমন্ত্রিত বন্ধুকে ন্যূনতম ১০০ টাকা ডিপোজিট করতে হবে'}</li>
              <li>{t?.rule2 || 'আপনার আমন্ত্রিত বন্ধুকে ন্যূনতম ৩টি বেট প্লেস করতে হবে'}</li>
              <li>{t?.rule3 || 'প্রতি সফল রেফারেলের জন্য আপনি ১০% কমিশন পাবেন'}</li>
              <li>{t?.rule4 || 'রেফারেল বোনাস ১০০০ টাকা হলে ট্রান্সফার করতে পারবেন'}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Referred List Tab Content */}
      {!loading && !error && activeTab === 'list' && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-200">{t?.username || 'ব্যবহারকারীর নাম'}</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-200">{t?.joinDate || 'যোগদানের তারিখ'}</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase border-b border-gray-200">{t?.reward || 'পুরস্কার'}</th>
              </tr>
            </thead>
            <tbody>
              {referralData.referredUsers.length > 0 ? (
                referralData.referredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{user.username}</p>
                          {user.phone && (
                            <p className="text-xs text-gray-500">{formatMobileNumber(user.phone)}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FaCalendarAlt size={12} className="text-gray-400" />
                        {formatDate(user.joinDate)}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      <span className="text-sm font-medium text-green-600">
                        ৳{formatCurrency(user.earnedAmount)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaUser className="text-gray-300 mb-2" size={32} />
                      <p className="text-sm">{t?.noFriends || 'কোন আমন্ত্রিত বন্ধু পাওয়া যায়নি'}</p>
                      <p className="text-xs text-gray-400 mt-1">{t?.inviteFriends || 'বন্ধুদের আমন্ত্রণ জানান এবং বোনাস পান'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reward Tab Content */}
      {!loading && !error && activeTab === 'reward' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{t?.totalInvites || 'মোট আমন্ত্রণ'}</p>
              <p className="text-2xl font-bold text-theme_color2">
                {referralData.totalReferrals}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{t?.totalEarnings || 'মোট আয়'}</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{formatCurrency(referralData.referralEarnings)}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            {referralData.referralEarnings >= 1000 ? (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  {t?.eligibleMessage || 'আপনি রেফারেল বোনাসের জন্য যোগ্য!'}
                </p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-3">
                  <p className="text-xs text-blue-700 mb-1">{t?.bonusAmount || 'বোনাস পরিমাণ'}: ৳{formatCurrency(referralData.referralEarnings)}</p>
                  <p className="text-xs text-blue-700">{t?.referralCode || 'রেফারেল কোড'}: {referralData.referralCode}</p>
                </div>
                <button 
                  className="w-full bg-gradient-to-r from-theme_color2 to-theme_color2/80 hover:from-theme_color2/90 hover:to-theme_color2/70 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all"
                  onClick={transferToMainBalance}
                  disabled={loading}
                >
                  {loading ? (t?.processing || 'প্রক্রিয়াধীন...') : (t?.addToMainBalance || 'মেইন বালেন্সে যোগ করুন')}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  {t?.referralCode || 'রেফারেল কোড'}: <span className="font-bold text-theme_color2">{referralData.referralCode}</span>
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {t?.notEligible || 'আপনি এখনও রেফারেল বোনাসের জন্য যোগ্য নন'}
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-xs text-yellow-700">
                    {t?.thresholdMessage || 'ন্যূনতম ১০০০ টাকা রেফারেল আয় প্রয়োজন'}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {t?.currentEarnings || 'বর্তমান আয়'}: ৳{formatCurrency(referralData.referralEarnings)} / ৳1,000
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-yellow-400 h-1.5 rounded-full" 
                      style={{ width: `${Math.min((referralData.referralEarnings / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Login Password Update Tab Content
// Login Password Update Tab Content - FIXED
// Login Password Update Tab Content - SHOW TOAST THEN LOGOUT
const LoginPasswordUpdateTabContent = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userData, logout } = useUser();
  const API_BASE_URL = import.meta.env.VITE_API_KEY_Base_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.currentPassword) {
      setError(t?.currentPasswordRequired || 'বর্তমান পাসওয়ার্ড দিন');
      return;
    }
    if (!formData.newPassword) {
      setError(t?.newPasswordRequired || 'নতুন পাসওয়ার্ড দিন');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError(t?.passwordLength || 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t?.passwordMismatch || 'পাসওয়ার্ড মিলছে না');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/user/update-account-password`, {
        userId: userData._id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        // Show toast message
        toast.success(t?.passwordUpdateSuccess || 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে');
        
        // Immediately logout and redirect
        handleDirectLogout();
      }
    } catch (err) {
      setError(err.response?.data?.message || t?.error || 'পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে');
      setLoading(false);
    }
  };

  const handleDirectLogout = () => {
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('resetToken');
    
    // Call logout from context if available
    if (logout) {
      logout();
    }
    
    // Direct navigation without any delay
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t?.loginPasswordUpdate || 'লগইন পাসওয়ার্ড আপডেট'}</h3>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t?.currentPassword || 'বর্তমান পাসওয়ার্ড'}</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder={t?.currentPasswordPlaceholder || 'বর্তমান পাসওয়ার্ড লিখুন'}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t?.newPassword || 'নতুন পাসওয়ার্ড'}</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder={t?.newPasswordPlaceholder || 'নতুন পাসওয়ার্ড লিখুন'}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t?.confirmPassword || 'পাসওয়ার্ড নিশ্চিত করুন'}</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder={t?.confirmPasswordPlaceholder || 'পাসওয়ার্ড নিশ্চিত করুন'}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-theme_color2 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (t?.processing || 'প্রক্রিয়াধীন...') : (t?.updatePassword || 'পাসওয়ার্ড আপডেট করুন')}
          </button>
        </form>
      </div>
    </div>
  );
};

// Transaction Password Update Tab Content
// Transaction Password Update Tab Content - CORRECT (already working)
const TransactionPasswordUpdateTabContent = () => {
  const { t } = useContext(LanguageContext);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { userData } = useUser();
  const API_BASE_URL = import.meta.env.VITE_API_KEY_Base_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword) {
      setError(t?.currentPasswordRequired || 'বর্তমান ট্রানজেকশন পাসওয়ার্ড দিন');
      return;
    }
    if (!formData.newPassword) {
      setError(t?.newPasswordRequired || 'নতুন ট্রানজেকশন পাসওয়ার্ড দিন');
      return;
    }
    if (formData.newPassword.length < 4) {
      setError(t?.transactionPasswordLength || 'ট্রানজেকশন পাসওয়ার্ড কমপক্ষে ৪ অক্ষর হতে হবে');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t?.passwordMismatch || 'পাসওয়ার্ড মিলছে না');
      return;
    }

    setLoading(true);
    try {
      // This endpoint is correct as per your backend
      const response = await axios.put(`${API_BASE_URL}/user/update-transaction-password`, {
        userId: userData._id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setSuccess(t?.transactionPasswordUpdateSuccess || 'ট্রানজেকশন পাসওয়ার্ড সফলভাবে আপডেট হয়েছে');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || t?.error || 'ট্রানজেকশন পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t?.transactionPasswordUpdate || 'ট্রানজেকশন পাসওয়ার্ড আপডেট'}</h3>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t?.currentTransactionPassword || 'বর্তমান ট্রানজেকশন পাসওয়ার্ড'}</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder={t?.currentTransactionPasswordPlaceholder || 'বর্তমান ট্রানজেকশন পাসওয়ার্ড লিখুন'}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t?.newTransactionPassword || 'নতুন ট্রানজেকশন পাসওয়ার্ড'}</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder={t?.newTransactionPasswordPlaceholder || 'নতুন ট্রানজেকশন পাসওয়ার্ড লিখুন'}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t?.confirmTransactionPassword || 'ট্রানজেকশন পাসওয়ার্ড নিশ্চিত করুন'}</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder={t?.confirmTransactionPasswordPlaceholder || 'ট্রানজেকশন পাসওয়ার্ড নিশ্চিত করুন'}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-theme_color2 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (t?.processing || 'প্রক্রিয়াধীন...') : (t?.updateTransactionPassword || 'ট্রানজেকশন পাসওয়ার্ড আপডেট করুন')}
          </button>
        </form>
      </div>
    </div>
  );
};

// KYC Tab Content Component
const KYCTabContent = () => {
  const { t, language } = useContext(LanguageContext);
  const { userData, fetchUserData } = useUser();
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState({
    isVerified: false,
    hasPendingOTP: false,
    attempts: 0,
    lastSent: null,
  });
  const [emailOTP, setEmailOTP] = useState(['', '', '', '', '', '']);
  const [showEmailOTPInput, setShowEmailOTPInput] = useState(false);
  const [emailOTPTimer, setEmailOTPTimer] = useState(0);
  const otpInputRefs = useRef([]);

  const [kycStatus, setKycStatus] = useState({
    status: 'unverified',
    submittedAt: null,
    verifiedAt: null,
    rejectionReason: '',
    documents: [],
    hasNotStartedSession: false,
    hasExistingSession: false,
    verificationUrl: null,
    latestVerification: null,
  });

  const themeColor = '#0FD9F1';
  
  // Helper function for consistent styling
  const themeClass = (type) => {
    const styles = {
      bg: 'bg-[#0FD9F1]',
      bgHover: 'hover:bg-[#0BC5D9]',
      border: 'border-[#0FD9F1]',
      text: 'text-[#0FD9F1]',
      ring: 'focus:ring-[#0FD9F1]',
      shadow: 'shadow-[#0FD9F1]/20'
    };
    return styles[type] || '';
  };

  const showTabs = userData?.kycSubmitted === true && userData?.kycCompleted === false;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(
      language?.code === 'bn' ? 'bn-BD' : 'en-US'
    );
  };

  useEffect(() => {
    let interval;
    if (emailOTPTimer > 0) {
      interval = setInterval(() => setEmailOTPTimer((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailOTPTimer]);

  useEffect(() => {
    if (userData) {
      checkEmailVerificationStatus();
      checkKYCStatus();
    }
  }, [userData]);

  useEffect(() => {
    if (showEmailOTPInput && otpInputRefs.current[0]) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    }
  }, [showEmailOTPInput]);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  const jsonAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const checkEmailVerificationStatus = async () => {
    try {
      const res = await axios.get(
        `${base_url}/user/check-email-verification/${userData._id}`,
        authHeader()
      );
      if (res.data.success) {
        setEmailVerificationStatus({
          isVerified: res.data.data.isEmailVerified,
          hasPendingOTP: res.data.data.hasPendingOTP,
          attempts: res.data.data.attempts,
          lastSent: res.data.data.lastSentAt,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkKYCStatus = async () => {
    try {
      const res = await axios.get(
        `${base_url}/user/kyc-status/${userData._id}`,
        authHeader()
      );
      if (res.data.success) {
        const d = res.data.data;
        const hasSessions = d.kycVerifications?.length > 0;
        let latestVerification = null;
        let hasNotStartedSession = false;
        let hasExistingSession = false;
        let verificationUrl = null;

        if (hasSessions) {
          latestVerification = d.kycVerifications[d.kycVerifications.length - 1];
          verificationUrl = latestVerification.verificationUrl;
          hasNotStartedSession = [
            'Not Started', 'not_started', 'NOT_STARTED', 'created', 'initiated',
          ].includes(latestVerification.status);
          hasExistingSession = true;
        }

        let actualStatus = d.kycStatus;
        if (d.kycStatus === 'pending' && (hasNotStartedSession || d.kycCompleted === false)) {
          actualStatus = 'unverified';
        }

        setKycStatus({
          status: actualStatus,
          submittedAt: d.lastUpdated,
          verifiedAt: d.kycInfo?.verifiedAt,
          rejectionReason: d.kycInfo?.rejectionReason,
          documents: d.kycDocuments || [],
          hasNotStartedSession,
          hasExistingSession,
          verificationUrl,
          latestVerification,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendEmailVerificationOTP = async () => {
    if (emailVerificationStatus.isVerified) return toast.info('Email already verified');
    if (emailOTPTimer > 0) return toast.warning(`Resend in ${emailOTPTimer}s`);
    setEmailVerificationLoading(true);
    try {
      const res = await axios.post(
        `${base_url}/user/send-email-verification-otp`,
        { userId: userData._id },
        jsonAuthHeader()
      );
      if (res.data.success) {
        toast.success('OTP sent to your email');
        setShowEmailOTPInput(true);
        setEmailOTPTimer(60);
        checkEmailVerificationStatus();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send OTP');
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  const resendEmailVerificationOTP = async () => {
    if (emailOTPTimer > 0) return toast.warning(`Resend in ${emailOTPTimer}s`);
    setOtpLoading(true);
    try {
      const res = await axios.post(
        `${base_url}/user/resend-email-verification-otp`,
        { userId: userData._id },
        jsonAuthHeader()
      );
      if (res.data.success) {
        toast.success('OTP resent');
        setEmailOTPTimer(60);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleEmailOTPChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOTP = [...emailOTP];
    newOTP[index] = value;
    setEmailOTP(newOTP);
    if (value && index < 5)
      setTimeout(() => otpInputRefs.current[index + 1]?.focus(), 10);
  };

  const handleEmailOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !emailOTP[index] && index > 0)
      setTimeout(() => otpInputRefs.current[index - 1]?.focus(), 10);
    if (e.key === 'ArrowLeft' && index > 0) otpInputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleEmailOTPPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setEmailOTP(pasted.split(''));
      setTimeout(() => otpInputRefs.current[5]?.focus(), 10);
    } else {
      toast.error('Please paste a valid 6-digit OTP');
    }
  };

  const verifyEmailOTP = async () => {
    const otpCode = emailOTP.join('');
    if (otpCode.length !== 6) return toast.error('Enter all 6 digits');
    setOtpLoading(true);
    try {
      const res = await axios.post(
        `${base_url}/user/verify-email-otp`,
        { userId: userData._id, otpCode },
        jsonAuthHeader()
      );
      if (res.data.success) {
        toast.success('Email verified successfully!');
        setShowEmailOTPInput(false);
        setEmailOTP(['', '', '', '', '', '']);
        checkEmailVerificationStatus();
        fetchUserData();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Verification failed');
      setEmailOTP(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 10);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleKYCVerification = async () => {
    if (kycStatus.hasExistingSession && kycStatus.verificationUrl && kycStatus.hasNotStartedSession) {
      return continueExistingKYC();
    }
    startNewKYC();
  };

  const continueExistingKYC = async () => {
    setLoading(true);
    try {
      if (!kycStatus.verificationUrl) return toast.error('Verification URL not found');
      toast.success('Redirecting to verification page...');
      setTimeout(() => window.open(kycStatus.verificationUrl, '_blank', 'noopener,noreferrer'), 1500);
    } catch (e) {
      toast.error('Failed to continue KYC');
    } finally {
      setLoading(false);
    }
  };

  const startNewKYC = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${base_url}/user/kyc/start-verification`,
        { userId: userData._id },
        jsonAuthHeader()
      );
      if (res.data) {
        const url = res.data.data.verification_url;
        if (!url) return toast.error('Verification URL not found');
        toast.success('KYC verification started! Redirecting...');
        setKycStatus((prev) => ({
          ...prev,
          status: 'unverified',
          submittedAt: new Date().toISOString(),
          hasNotStartedSession: true,
          hasExistingSession: true,
          verificationUrl: url,
        }));
        setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 1500);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to start KYC');
    } finally {
      setLoading(false);
    }
  };

  const resubmitKYC = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${base_url}/user/kyc/resubmit`,
        { userId: userData._id },
        jsonAuthHeader()
      );
      if (res.data) {
        const url = res.data.data.verification_url;
        if (!url) return toast.error('Verification URL not found');
        toast.success('KYC resubmitted! Redirecting...');
        setKycStatus((prev) => ({
          ...prev,
          submittedAt: new Date().toISOString(),
          hasNotStartedSession: true,
          hasExistingSession: true,
          verificationUrl: url,
        }));
        setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 1500);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to resubmit KYC');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // OTP FULLSCREEN — shown when OTP is sent
  // ─────────────────────────────────────────────────────────────────────────
  if (showEmailOTPInput && !emailVerificationStatus.isVerified) {
    return (
      <div className="font-anek flex items-center justify-center px-6">
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: 10, fontSize: 14 } }} />

        <div
          className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-lg"
          style={{ border: '2px solid #0FD9F1' }}
        >
          {/* Close */}
          <button
            onClick={() => {
              setShowEmailOTPInput(false);
              setEmailOTP(['', '', '', '', '', '']);
            }}
            className="absolute top-4 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <IoClose className="text-xl" />
          </button>

          {/* 6 digit boxes */}
          <div className="flex justify-center gap-3 mb-6 pt-4 mt-2">
            {emailOTP.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpInputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleEmailOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleEmailOTPKeyDown(index, e)}
                onPaste={index === 0 ? handleEmailOTPPaste : undefined}
                className="w-11 h-14 text-center text-2xl font-bold bg-[#0FD9F1] text-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#0FD9F1] transition-all shadow-sm"
                style={{ caretColor: 'white', color: digit ? 'white' : 'transparent' }}
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mb-6">
            Please check your Email for OTP code.
          </p>

          <button
            onClick={verifyEmailOTP}
            disabled={otpLoading || emailOTP.join('').length !== 6}
            className="w-full bg-[#0FD9F1] hover:bg-[#0BC5D9] disabled:bg-[#0FD9F1]/50 text-white py-3.5 rounded-full font-bold text-base cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {otpLoading ? <><FaSpinner className="animate-spin" /> Verifying...</> : 'Verify'}
          </button>

          <div className="flex items-center justify-center gap-1 mt-4">
            <p className="text-xs text-gray-400">Didn't receive the code?</p>
            <button
              onClick={resendEmailVerificationOTP}
              disabled={emailOTPTimer > 0 || otpLoading}
              className="text-xs font-bold text-[#0FD9F1] hover:text-[#0BC5D9] disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              {emailOTPTimer > 0 ? `Resend in ${emailOTPTimer}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NOT ASSIGNED STATE
  // ─────────────────────────────────────────────────────────────────────────
  if (!showTabs) {
    return (
      <div className=" font-anek flex items-center justify-center px-6">
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: 10, fontSize: 14 } }} />
        <div className="relative rounded-2xl p-8 text-center  w-full max-w-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <HiIdentification className="text-4xl text-gray-300" />
          </div>
          <h2 className="text-lg font-bold text-gray-700 mb-2">KYC Not Assigned</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your KYC verification has not been assigned yet.
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN PAGE
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className=" flex justify-center items-center font-anek p-[10px]">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: 10, fontSize: 14 } }} />

      <div className="  w-full rounded-[20px] overflow-y-auto">

        <div className="px-4 pt-3 max-w-lg mx-auto">

          {/* ── Tab Switcher ── */}
          <div className="rounded-full p-1 flex mb-5 gap-2">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-2.5 rounded-[10px] text-[15px] font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-[#0FD9F1] text-white shadow-md shadow-cyan-200'
                  : 'text-gray-500 hover:text-gray-700 bg-gray-200'
              }`}
            >
              Email Verify
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`flex-1 py-2.5 rounded-[10px] text-[15px] font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'kyc'
                  ? 'bg-[#0FD9F1] text-white shadow-md shadow-cyan-200'
                  : 'text-gray-500 hover:text-gray-700 bg-gray-200'
              }`}
            >
              Identity Verify
            </button>
          </div>

          {/* ══════════════ EMAIL TAB ══════════════ */}
          {activeTab === 'email' && (
            <div className="space-y-4">

              {/* Email input card */}
              <div className="py-3">
                {!emailVerificationStatus.isVerified && (
                  <p className="text-xs text-gray-400 mb-3">
                    I am agree to proved my email is valided.
                  </p>
                )}

                <div className="flex items-center gap-2 bg-[#DDD4E9] p-[10px] rounded-[15px]">
                  <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-[15px] px-3 py-2.5 gap-2">
                    <FaEnvelope className="text-gray-400 text-sm flex-shrink-0" />
                    <input
                      type="text"
                      className="flex-1 text-sm text-gray-700 bg-transparent outline-none cursor-not-allowed"
                      value={userData?.email || ''}
                      readOnly
                    />
                  </div>

                  {emailVerificationStatus.isVerified ? (
                    <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-2.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <FaCheckCircle className="text-xs" /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={sendEmailVerificationOTP}
                      disabled={emailVerificationLoading || emailOTPTimer > 0}
                      className="bg-[#0FD9F1] disabled:bg-[#0FD9F1]/50 text-white text-sm font-bold px-4 py-2.5 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
                    >
                      {emailVerificationLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : emailOTPTimer > 0 ? (
                        `${emailOTPTimer}s`
                      ) : (
                        'OTP'
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Why verify */}
              <div className="bg-[#DDD4E9] rounded-2xl p-5 border border-purple-100 shadow-sm">
                <p className="font-bold text-gray-800 mb-3 text-sm">
                  Why You should verify Email?
                </p>
                <ul className="space-y-2">
                  {[
                    'Keep your account more secure.',
                    'Bonus & Promotion Eligibility updates.',
                    'Important Notifications for transections Update.',
                    'Fair Play & Compliance.',
                  ].map((text, i) => (
                    <li key={i} className="text-xs text-gray-600">
                      -{text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ══════════════ IDENTITY / KYC TAB ══════════════ */}
          {activeTab === 'kyc' && (
            <div className="space-y-4">

              {/* ── EMAIL NOT VERIFIED: show ONLY this message ── */}
              {!emailVerificationStatus.isVerified ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <p className="text-base font-bold text-gray-700 mb-1">
                    Please verify your email first
                  </p>
                  <p className="text-xs text-gray-400">
                    Go to the{' '}
                    <button
                      onClick={() => setActiveTab('email')}
                      className="text-[#0FD9F1] font-bold underline cursor-pointer"
                    >
                      Email Verify
                    </button>{' '}
                    tab to complete verification.
                  </p>
                </div>
              ) : (
                <>
                  {/* Status card */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <HiIdentification className="text-[#0FD9F1] text-xl" />
                        <h3 className="font-bold text-gray-800 text-sm">KYC Verification</h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          kycStatus.status === 'verified'
                            ? 'bg-green-100 text-green-600'
                            : kycStatus.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : kycStatus.status === 'rejected'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {kycStatus.status.charAt(0).toUpperCase() + kycStatus.status.slice(1)}
                      </span>
                    </div>

                    {kycStatus.status === 'verified' && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                        <FaCheckCircle className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-green-700 text-sm">KYC Verified</p>
                          <p className="text-xs text-green-600 mt-1">
                            Verified on {formatDate(kycStatus.verifiedAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Pending */}
                    {kycStatus.status === 'pending' && userData?.kycCompleted === true && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <FaSpinner className="animate-spin text-yellow-500 text-lg mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-yellow-700 text-sm">KYC Under Review</p>
                            <p className="text-xs text-yellow-600 mt-0.5">
                              Submitted on {formatDate(kycStatus.submittedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-yellow-100 rounded-lg p-3 space-y-1">
                          <p className="text-xs text-yellow-700">✓ Verification in progress</p>
                          <p className="text-xs text-yellow-700">✓ Application in queue</p>
                          <p className="text-xs text-yellow-700">✓ Status will update automatically</p>
                        </div>
                        <p className="text-xs text-yellow-500 mt-2 text-center">
                          Review may take 24–48 hours
                        </p>
                      </div>
                    )}

                    {kycStatus.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <FaTimesCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-red-700 text-sm">KYC Rejected</p>
                            {kycStatus.rejectionReason && (
                              <p className="text-xs text-red-600 mt-1">
                                Reason: {kycStatus.rejectionReason}
                              </p>
                            )}
                            <p className="text-xs text-red-500 mt-1">
                              Please update your information and resubmit.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {kycStatus.hasExistingSession && kycStatus.hasNotStartedSession && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <FaInfoCircle className="text-blue-400 text-lg mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-blue-700 text-sm">Session Not Completed</p>
                            <p className="text-xs text-blue-600 mt-1">
                              You started KYC but did not finish. Click below to continue.
                            </p>
                            {kycStatus.latestVerification?.createdAt && (
                              <p className="text-xs text-blue-500 mt-1">
                                Started: {formatDate(kycStatus.latestVerification.createdAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {(kycStatus.status === 'unverified' ||
                    (kycStatus.status === 'pending' && kycStatus.hasNotStartedSession) ||
                    kycStatus.hasNotStartedSession) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                      <div className="text-center mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#0FD9F1] to-[#0BC5D9] rounded-full flex items-center justify-center mx-auto mb-3">
                          <HiIdentification className="text-2xl text-white" />
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">
                          {kycStatus.hasExistingSession && kycStatus.hasNotStartedSession
                            ? 'Continue KYC Verification'
                            : 'Start KYC Verification'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {kycStatus.hasExistingSession && kycStatus.hasNotStartedSession
                            ? 'Continue your KYC verification from where you left off.'
                            : 'Complete your identity verification with our secure partner.'}
                        </p>
                      </div>

                      <button
                        onClick={handleKYCVerification}
                        disabled={loading}
                        className="w-full bg-[#0FD9F1] hover:bg-[#0BC5D9] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0FD9F1]/20"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            {kycStatus.hasExistingSession && kycStatus.hasNotStartedSession
                              ? 'Continuing...'
                              : 'Starting...'}
                          </>
                        ) : (
                          <>
                            <HiIdentification />
                            {kycStatus.hasExistingSession && kycStatus.hasNotStartedSession
                              ? 'Continue KYC'
                              : 'Complete KYC'}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Resubmit */}
                  {kycStatus.status === 'rejected' && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                      <button
                        onClick={resubmitKYC}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-100"
                      >
                        {loading ? (
                          <><FaSpinner className="animate-spin" /> Resubmitting...</>
                        ) : (
                          <><FaRedoAlt /> Resubmit KYC</>
                        )}
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-2">
                        Resubmit with corrected information
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Default Tab Content
const DefaultTabContent = ({ activeLeftTab }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{activeLeftTab}</h3>
      <p className="text-gray-500 text-center py-8">এই বিভাগটি উন্নয়নাধীন রয়েছে</p>
    </div>
  );
};

// Arrow Left Icon for Forgot Password
const FaArrowLeft = ({ className }) => (
  <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default Sidebar;