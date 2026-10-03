import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  ZoomIn,
  ArrowLeft,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Timer,
} from 'lucide-react';

interface SubmissionItem {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  city: string;
  utr: string;
  submittedAt: string;
  status: 'Pending Verification' | 'Payment Verified' | 'Access Sent' | 'Rejected';
  screenshotOriginalName: string;
  screenshotMimeType: string;
  screenshotSizeBytes: number;
  hasScreenshotData: boolean;
}

interface StoredSession {
  token: string;
  expiresAt: string;
}

export function AdminVerificationPage() {
  // We ONLY store the short-lived signed session token, NEVER the raw secret key
  const [sessionToken, setSessionToken] = useState<string>(() => {
    try {
      const raw = sessionStorage.getItem('fwd_admin_session');
      if (raw) {
        const parsed: StoredSession = JSON.parse(raw);
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          return parsed.token;
        }
      }
    } catch {
      // Ignore
    }
    return '';
  });

  const [sessionExpiry, setSessionExpiry] = useState<string>(() => {
    try {
      const raw = sessionStorage.getItem('fwd_admin_session');
      if (raw) {
        const parsed: StoredSession = JSON.parse(raw);
        return parsed.expiresAt;
      }
    } catch {
      // Ignore
    }
    return '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [screenshotBlobUrl, setScreenshotBlobUrl] = useState<string | null>(null);
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Time remaining formatted string
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Check URL query param for specific ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    if (idParam) {
      setSelectedId(idParam);
    }
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('fwd_admin_session');
    setSessionToken('');
    setSessionExpiry('');
    setIsAuthenticated(false);
    setSelectedSubmission(null);
    setSubmissions([]);
    if (screenshotBlobUrl) {
      URL.revokeObjectURL(screenshotBlobUrl);
      setScreenshotBlobUrl(null);
    }
  }, [screenshotBlobUrl]);

  // Check session token validity on load
  useEffect(() => {
    if (!sessionToken) {
      setIsAuthenticated(false);
      return;
    }

    let isMounted = true;

    async function verifySession() {
      try {
        const resp = await fetch('/api/membership/lookup?action=verify_session', {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        if (resp.ok) {
          if (isMounted) setIsAuthenticated(true);
        } else {
          if (isMounted) handleLogout();
        }
      } catch {
        if (isMounted) handleLogout();
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [sessionToken, handleLogout]);

  // Session expiry countdown ticker
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return;

    const interval = setInterval(() => {
      const remainingMs = new Date(sessionExpiry).getTime() - Date.now();
      if (remainingMs <= 0) {
        setTimeRemaining('Expired');
        handleLogout();
      } else {
        const minutes = Math.floor(remainingMs / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiry, handleLogout]);

  // Login handler: Authenticates raw secret and exchanges for short-lived session token
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setAuthError('Please enter your admin secret key.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    try {
      const resp = await fetch('/api/membership/lookup?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secretKey: inputKey.trim(),
        }),
      });

      const data = await resp.json();

      // Wipe raw password from input state immediately
      setInputKey('');

      if (resp.ok && data.success && data.token) {
        const sessionData: StoredSession = {
          token: data.token,
          expiresAt: data.expiresAt,
        };
        sessionStorage.setItem('fwd_admin_session', JSON.stringify(sessionData));
        setSessionToken(data.token);
        setSessionExpiry(data.expiresAt);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.message || 'Invalid admin secret key. Access denied.');
      }
    } catch {
      setAuthError('Failed to connect to authentication service. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadSubmissions = useCallback(async () => {
    if (!sessionToken) return;
    try {
      const resp = await fetch('/api/membership/lookup?id=all', {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
          if (!selectedId && data.submissions.length > 0) {
            setSelectedId(data.submissions[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  }, [sessionToken, selectedId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated, loadSubmissions]);

  // Load selected submission detail
  useEffect(() => {
    if (!isAuthenticated || !selectedId || !sessionToken) return;

    let isMounted = true;

    async function fetchDetail() {
      try {
        const resp = await fetch(`/api/membership/lookup?id=${encodeURIComponent(selectedId)}`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        if (resp.ok) {
          const data = await resp.json();
          if (isMounted && data.success && data.submission) {
            setSelectedSubmission(data.submission);
          }
        }
      } catch (err) {
        console.error('Error fetching detail:', err);
      }
    }

    async function fetchScreenshot() {
      setIsLoadingScreenshot(true);
      if (screenshotBlobUrl) {
        URL.revokeObjectURL(screenshotBlobUrl);
        setScreenshotBlobUrl(null);
      }

      try {
        const resp = await fetch(
          `/api/membership/lookup?id=${encodeURIComponent(selectedId)}&type=screenshot`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        if (resp.ok) {
          const blob = await resp.blob();
          if (isMounted) {
            const objectUrl = URL.createObjectURL(blob);
            setScreenshotBlobUrl(objectUrl);
          }
        }
      } catch (err) {
        console.error('Error fetching screenshot image:', err);
      } finally {
        if (isMounted) {
          setIsLoadingScreenshot(false);
        }
      }
    }

    fetchDetail();
    fetchScreenshot();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, selectedId, sessionToken]);

  const handleUpdateStatus = async (newStatus: SubmissionItem['status']) => {
    if (!selectedId || !sessionToken) return;
    setIsUpdatingStatus(true);
    setActionMessage(null);

    try {
      const resp = await fetch('/api/membership/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          id: selectedId,
          status: newStatus,
        }),
      });

      const data = await resp.json();
      if (resp.ok && data.success) {
        setActionMessage({
          type: 'success',
          text: `Status successfully updated to "${newStatus}" in PostgreSQL database.`,
        });
        setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === selectedId ? { ...sub, status: newStatus } : sub))
        );
      } else {
        setActionMessage({
          type: 'error',
          text: data.message || 'Failed to update status in database.',
        });
      }
    } catch {
      setActionMessage({
        type: 'error',
        text: 'Network error updating submission status.',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (statusFilter === 'all') return true;
      return sub.status.toLowerCase().replace(/\s+/g, '_') === statusFilter;
    });
  }, [submissions, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payment Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payment Verified
          </span>
        );
      case 'Access Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Send className="w-3.5 h-3.5" /> Access Sent
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending Verification
          </span>
        );
    }
  };

  // ==========================================
  // VIEW 1: AUTHENTICATION LOCK SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-black">
        <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Admin Verification Portal</h1>
            <p className="text-sm text-gray-400 mt-1">Finance With Dev — Membership Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Admin Secret Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter ADMIN_SECRET_KEY"
                  className="w-full pl-10 pr-10 py-3 bg-[#1A2234] border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !inputKey.trim()}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-800/80 pt-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation */}
      <header className="bg-[#111827] border-b border-gray-800 sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Membership Verification Dashboard
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE SESSION
              </span>
            </h1>
            <p className="text-xs text-gray-400">Finance With Dev — ₹199 Community Lifetime Access</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {timeRemaining && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#1A2234] border border-gray-700 rounded-lg text-xs text-gray-300">
              <Timer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session: {timeRemaining}</span>
            </div>
          )}
          <button
            onClick={() => loadSubmissions()}
            className="p-2 text-gray-400 hover:text-white bg-[#1A2234] border border-gray-700 rounded-lg hover:border-gray-600 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            title="Refresh submissions"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="py-1.5 px-3 text-gray-400 hover:text-rose-400 bg-[#1A2234] border border-gray-700 rounded-lg hover:border-rose-500/30 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            title="End admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Split: Sidebar + Detail View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Submissions List */}
        <aside className="w-full lg:w-96 bg-[#0E1422] border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col h-auto lg:h-[calc(100vh-61px)]">
          {/* Filter Bar */}
          <div className="p-3.5 border-b border-gray-800 bg-[#111827]/50 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span className="font-semibold uppercase tracking-wider">Submissions ({filteredSubmissions.length})</span>
              <span className="text-[11px] text-gray-500">Auto-synced</span>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending_verification', label: 'Pending' },
                { id: 'payment_verified', label: 'Verified' },
                { id: 'access_sent', label: 'Sent' },
                { id: 'rejected', label: 'Rejected' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'bg-[#1A2234] text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60 max-h-[300px] lg:max-h-none">
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">
                No submissions found matching the selected filter.
              </div>
            ) : (
              filteredSubmissions.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A2234] border-l-4 border-emerald-500'
                        : 'hover:bg-[#131B2E] border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm text-white truncate">{item.fullName}</span>
                      <span className="text-[11px] font-mono text-emerald-400 font-medium shrink-0">₹199</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs text-gray-400 mb-2">
                      <span className="truncate font-mono text-[11px]">{item.id}</span>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {new Date(item.submittedAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(item.status)}
                      <span className="text-[10px] text-gray-500 font-mono">UTR: {item.utr.slice(0, 10)}...</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Main Panel: Detail & Verification Actions */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          {actionMessage && (
            <div
              className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
                actionMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                )}
                <span>{actionMessage.text}</span>
              </div>
              <button
                onClick={() => setActionMessage(null)}
                className="text-gray-400 hover:text-white text-xs cursor-pointer ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {selectedSubmission ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column: Applicant & Payment Details */}
              <div className="xl:col-span-7 space-y-6">
                {/* Header Card */}
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-white">{selectedSubmission.fullName}</h2>
                        {getStatusBadge(selectedSubmission.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        <span>Reference ID: {selectedSubmission.id}</span>
                        <button
                          onClick={() => copyToClipboard(selectedSubmission.id, 'id')}
                          className="text-gray-500 hover:text-emerald-400 transition-colors"
                          title="Copy ID"
                        >
                          {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-right">
                      <div className="text-xs text-emerald-400 font-medium">Payment Amount</div>
                      <div className="text-xl font-bold text-emerald-300">₹199</div>
                    </div>
                  </div>

                  {/* Submission Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${selectedSubmission.email}`}
                          className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                        >
                          {selectedSubmission.email}
                        </a>
                        <button
                          onClick={() => copyToClipboard(selectedSubmission.email, 'email')}
                          className="text-gray-500 hover:text-gray-300"
                        >
                          {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Number
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${selectedSubmission.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(`Hi ${selectedSubmission.fullName}, this is Dev from Finance With Dev. Your community membership payment (Ref: ${selectedSubmission.id}) has been verified! Here is your private community invite:`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          {selectedSubmission.whatsappNumber}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-gray-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" /> City
                      </div>
                      <div className="text-sm font-medium text-white">
                        {selectedSubmission.city || 'Not provided'}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400" /> Submitted At
                      </div>
                      <div className="text-sm font-medium text-white">
                        {new Date(selectedSubmission.submittedAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                          timeZone: 'Asia/Kolkata',
                        })}{' '}
                        (IST)
                      </div>
                    </div>
                  </div>

                  {/* UTR Box with One-click Copy */}
                  <div className="mt-6 bg-[#0E1422] border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" /> Transaction ID / UTR Number
                      </div>
                      <div className="text-base font-mono font-bold text-white mt-0.5 select-all">
                        {selectedSubmission.utr}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedSubmission.utr, 'utr')}
                      className="py-2 px-3 bg-[#1A2234] hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedField === 'utr' ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy UTR
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Admin Status Actions Panel */}
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                    Verification Actions (Updates PostgreSQL)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleUpdateStatus('Payment Verified')}
                      disabled={isUpdatingStatus || selectedSubmission.status === 'Payment Verified'}
                      className="py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 disabled:opacity-50 text-emerald-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Payment</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('Access Sent')}
                      disabled={isUpdatingStatus || selectedSubmission.status === 'Access Sent'}
                      className="py-3 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 disabled:opacity-50 text-blue-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Mark Access Sent</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('Rejected')}
                      disabled={isUpdatingStatus || selectedSubmission.status === 'Rejected'}
                      className="py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 disabled:opacity-50 text-rose-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Request</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Screenshot Lightbox / Zoom View */}
              <div className="xl:col-span-5 space-y-4">
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        Payment Proof Screenshot
                      </h3>
                      <p className="text-xs text-gray-400">
                        {selectedSubmission.screenshotOriginalName} (
                        {Math.round(selectedSubmission.screenshotSizeBytes / 1024)} KB)
                      </p>
                    </div>
                    {screenshotBlobUrl && (
                      <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="p-2 text-gray-400 hover:text-white bg-[#1A2234] border border-gray-700 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        title="Zoom Fullscreen"
                      >
                        <ZoomIn className="w-4 h-4" />
                        <span>Zoom</span>
                      </button>
                    )}
                  </div>

                  {/* Image Container */}
                  <div className="bg-[#0B0F17] border border-gray-800 rounded-xl overflow-hidden min-h-[340px] flex items-center justify-center relative group">
                    {isLoadingScreenshot ? (
                      <div className="flex flex-col items-center gap-2 text-gray-500 text-xs">
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                        <span>Loading encrypted screenshot...</span>
                      </div>
                    ) : screenshotBlobUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center p-2">
                        <img
                          src={screenshotBlobUrl}
                          alt="Payment Screenshot Proof"
                          className="max-h-[480px] w-auto object-contain rounded-lg shadow-lg cursor-zoom-in group-hover:opacity-95 transition-opacity"
                          onClick={() => setIsLightboxOpen(true)}
                        />
                        <div
                          onClick={() => setIsLightboxOpen(true)}
                          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-zoom-in rounded-lg"
                        >
                          <span className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow">
                            <ZoomIn className="w-3.5 h-3.5" /> Click to Expand
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-gray-500 text-xs">
                        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span>Screenshot unavailable or could not be loaded.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-base font-medium text-gray-400">No submission selected</p>
              <p className="text-xs mt-1">Select a record from the sidebar to inspect payment details and approve access.</p>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && screenshotBlobUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden p-2 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between p-3 border-b border-gray-800 text-xs text-gray-400">
              <span className="font-mono text-white">{selectedSubmission?.id} — Payment Proof</span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="py-1 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-xs cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[80vh] flex items-center justify-center">
              <img
                src={screenshotBlobUrl}
                alt="Full Resolution Payment Proof"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
