'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiMail, FiLock, FiAlertCircle, FiArrowLeft, FiKey, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export default function ForgotPasswordFlow({ onBackClick }) {
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { forgotPassword, resetPassword } = useAuth();
    
    const handleForgotEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const res = await forgotPassword(forgotEmail);
        
        if (res.success) {
            setForgotStep(2);
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        setForgotStep(3);
        setError('');
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const res = await resetPassword(forgotEmail, otp, newPassword);
        
        if (res.success) {
            setSuccessMessage('Password reset successfully! Redirecting...');
        } else {
            setError(res.error);
            setLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={onBackClick}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 font-bold text-sm"
            >
                <FiArrowLeft /> Back to Login
            </button>

            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-white mb-3">Forgot <span className="text-[#FFB800]">Pass?</span></h1>
                <p className="text-gray-400 font-medium tracking-tight">
                    {forgotStep === 1 && "Enter your email to receive an OTP."}
                    {forgotStep === 2 && "Enter the 6-digit OTP sent to your email."}
                    {forgotStep === 3 && "Create a new strong password."}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold">
                    <FiAlertCircle className="shrink-0" />
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-500 text-sm font-bold">
                    <FiCheckCircle className="shrink-0" />
                    {successMessage}
                </div>
            )}

            {forgotStep === 1 && (
                <form onSubmit={handleForgotEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFB800] transition-colors" />
                            <input 
                                type="email" 
                                required
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#FFB800] hover:bg-[#e6a600] text-black font-black py-4 rounded-2xl shadow-xl shadow-[#FFB800]/10 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div> : "SEND OTP"}
                    </button>
                </form>
            )}

            {forgotStep === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Verification OTP</label>
                        <div className="relative group">
                            <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFB800] transition-colors" />
                            <input 
                                type="text" 
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium tracking-[0.5em] text-center text-xl overflow-hidden"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-[#FFB800] hover:bg-[#e6a600] text-black font-black py-4 rounded-2xl shadow-xl shadow-[#FFB800]/10 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.98]"
                    >
                        VERIFY OTP
                    </button>
                </form>
            )}

            {forgotStep === 3 && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFB800] transition-colors" />
                            <input 
                                type={showNewPassword ? 'text' : 'password'} 
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFB800] transition-colors"
                            >
                                {showNewPassword ? <FiEye /> : <FiEyeOff />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFB800] transition-colors" />
                            <input 
                                type={showConfirmPassword ? 'text' : 'password'} 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all font-medium"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFB800] transition-colors"
                            >
                                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#FFB800] hover:bg-[#e6a600] text-black font-black py-4 rounded-2xl shadow-xl shadow-[#FFB800]/10 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div> : "RESET PASSWORD"}
                    </button>
                </form>
            )}
        </>
    );
}
