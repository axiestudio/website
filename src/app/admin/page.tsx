'use client';

import { useState, useEffect } from 'react';

type ActiveScreen = 'consultations' | 'newsletter' | 'downloads';

export default function AdminDashboard() {
  const [authCode1, setAuthCode1] = useState('');
  const [authCode2, setAuthCode2] = useState('');
  const [authCode3, setAuthCode3] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('consultations');
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [consultationStatus, setConsultationStatus] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date());
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${authCode1}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (err) {
      setError('Failed to fetch analytics');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredCodes = [
      'axiestudio_admin_2024',
      'axiestudio_secure_2024',
      'axiestudio_premium_2024'
    ];

    const currentCode = getCurrentCode();

    if (!currentCode) {
      setError('Please enter the security code');
      return;
    }

    // Check if current code is correct
    if (currentCode !== requiredCodes[currentStep - 1]) {
      setError('Invalid security code');
      // Reset all codes and go back to step 1
      setAuthCode1('');
      setAuthCode2('');
      setAuthCode3('');
      setCurrentStep(1);
      setIsStepComplete(false);
      return;
    }

    setError('');
    setIsStepComplete(true);

    // Brief success animation before moving to next step
    setTimeout(() => {
      setIsStepComplete(false);

      // Move to next step or authenticate
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // All 3 codes entered correctly, authenticate
        authenticateUser();
      }
    }, 600);
  };

  const getCurrentCode = () => {
    switch (currentStep) {
      case 1: return authCode1;
      case 2: return authCode2;
      case 3: return authCode3;
      default: return '';
    }
  };

  const setCurrentCode = (value: string) => {
    switch (currentStep) {
      case 1: setAuthCode1(value); break;
      case 2: setAuthCode2(value); break;
      case 3: setAuthCode3(value); break;
    }
  };

  const authenticateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${authCode1}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setIsAuthenticated(true);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError('Authentication failed');
        // Reset on failure
        setAuthCode1('');
        setAuthCode2('');
        setAuthCode3('');
        setCurrentStep(1);
        setIsStepComplete(false);
      }
    } catch (err) {
      setError('Authentication failed');
      // Reset on failure
      setAuthCode1('');
      setAuthCode2('');
      setAuthCode3('');
      setCurrentStep(1);
      setIsStepComplete(false);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(fetchAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  const exportData = async (type: 'consultations' | 'subscribers' | 'desktop-downloads') => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authCode1}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError(`Failed to export ${type}`);
      }
    } catch (err) {
      setError(`Failed to export ${type}`);
    }
  };

  const openConsultationModal = (consultation: any) => {
    setSelectedConsultation(consultation);
    setConsultationNotes(consultation.notes || '');
    setConsultationStatus(consultation.status || 'pending');
    setFollowUpDate(consultation.followUpDate || '');
    setPriority(consultation.priority || 'medium');
    setShowConsultationModal(true);
  };

  const closeConsultationModal = () => {
    setShowConsultationModal(false);
    setSelectedConsultation(null);
    setConsultationNotes('');
    setConsultationStatus('');
    setFollowUpDate('');
    setPriority('medium');
  };

  const updateConsultationStatus = async () => {
    if (!selectedConsultation) return;

    try {
      const response = await fetch('/api/consultations/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authCode1}`,
        },
        body: JSON.stringify({
          id: selectedConsultation.id,
          status: consultationStatus,
          notes: consultationNotes,
          followUpDate: followUpDate,
          priority: priority,
          lastUpdated: new Date().toISOString()
        }),
      });

      if (response.ok) {
        // Refresh analytics data
        await fetchAnalytics();
        closeConsultationModal();
        alert('Consultation updated successfully!');
      } else {
        alert('Failed to update consultation');
      }
    } catch (err) {
      alert('Error updating consultation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', color: '#92400e' };
      case 'contacted': return { bg: '#dbeafe', color: '#1e40af' };
      case 'qualified': return { bg: '#d1fae5', color: '#065f46' };
      case 'proposal_sent': return { bg: '#e0e7ff', color: '#3730a3' };
      case 'closed_won': return { bg: '#d1fae5', color: '#065f46' };
      case 'closed_lost': return { bg: '#fee2e2', color: '#991b1b' };
      case 'follow_up': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: '#fee2e2', color: '#991b1b' };
      case 'medium': return { bg: '#fef3c7', color: '#92400e' };
      case 'low': return { bg: '#d1fae5', color: '#065f46' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '32px',
          width: '100%',
          maxWidth: '448px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="/images/axiestudio-logo-192.png"
              alt="AxieStudio Logo"
              width="64"
              height="64"
              style={{
                borderRadius: '8px',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              AxieStudio Admin
            </h1>
            <p style={{ color: '#6b7280', margin: '0' }}>Management Dashboard</p>
          </div>

          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Progress Indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  style={{
                    width: step === currentStep ? '16px' : '12px',
                    height: step === currentStep ? '16px' : '12px',
                    borderRadius: '50%',
                    backgroundColor: step < currentStep ? '#10b981' : step === currentStep ? '#3b82f6' : '#e5e7eb',
                    transition: 'all 0.4s ease',
                    boxShadow: step === currentStep ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
                    transform: step === currentStep ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
            </div>

            {/* Step Counter */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                Step {currentStep} of 3
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0'
              }}>
                Enter security code {currentStep}
              </p>
            </div>

            {/* Single Input Field */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input
                type="password"
                value={getCurrentCode()}
                onChange={(e) => setCurrentCode(e.target.value)}
                placeholder=""
                autoFocus
                disabled={isStepComplete}
                style={{
                  width: '280px',
                  padding: '16px 20px',
                  border: isStepComplete ? '2px solid #10b981' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  letterSpacing: '2px',
                  backgroundColor: isStepComplete ? '#f0fdf4' : 'white',
                  transform: isStepComplete ? 'scale(1.02)' : 'scale(1)'
                }}
                onFocus={(e) => {
                  if (!isStepComplete) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!isStepComplete) {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '280px',
                  backgroundColor: loading ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Authenticating...
                  </>
                ) : (
                  currentStep < 3 ? 'Continue' : 'Access Dashboard'
                )}
              </button>
            </div>
          </form>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const renderConsultationsScreen = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Quick Actions Panel */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>
            Quick Actions
          </h3>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            CMS Dashboard
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              const pendingConsultations = analytics?.consultationsList?.filter((c: any) => c.status === 'pending') || [];
              if (pendingConsultations.length > 0) {
                openConsultationModal(pendingConsultations[0]);
              } else {
                alert('No pending consultations to review');
              }
            }}
            style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#fde68a';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#fef3c7';
            }}
          >
            Review Pending ({analytics?.consultations?.pending || 0})
          </button>
          <button
            onClick={() => {
              const highPriorityConsultations = analytics?.consultationsList?.filter((c: any) => c.priority === 'high') || [];
              if (highPriorityConsultations.length > 0) {
                openConsultationModal(highPriorityConsultations[0]);
              } else {
                alert('No high priority consultations');
              }
            }}
            style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#fecaca';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#fee2e2';
            }}
          >
            High Priority ({analytics?.consultations?.highPriority || 0})
          </button>
          <button
            onClick={() => exportData('consultations')}
            style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#bfdbfe';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#dbeafe';
            }}
          >
            Export Excel Data
          </button>
          <button
            onClick={fetchAnalytics}
            style={{
              backgroundColor: '#d1fae5',
              color: '#065f46',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#a7f3d0';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#d1fae5';
            }}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#2563eb', fontSize: '18px', fontWeight: 'bold' }}>C</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                Total Consultations
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.consultations?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#d97706', fontSize: '18px', fontWeight: 'bold' }}>P</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                Pending Action
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.consultations?.pending || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#d1fae5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#059669', fontSize: '18px', fontWeight: 'bold' }}>W</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                Closed Won
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.consultations?.closedWon || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#f3e8ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#7c3aed', fontSize: '18px', fontWeight: 'bold' }}>H</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                High Priority
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.consultations?.highPriority || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#111827',
              margin: '0'
            }}>
              Consultation Requests
            </h3>
            <button
              onClick={() => exportData('consultations')}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
              }}
            >
              Export Excel
            </button>
          </div>

          {/* Search and Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '12px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
                <option value="follow_up">Follow Up</option>
              </select>
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Contact
                </th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Company
                </th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Priority
                </th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Status
                </th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Last Contact
                </th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {analytics?.consultationsList?.filter((consultation: any) => {
                // Search filter
                const searchMatch = !searchTerm ||
                  consultation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  consultation.company?.toLowerCase().includes(searchTerm.toLowerCase());

                // Status filter
                const statusMatch = statusFilter === 'all' || consultation.status === statusFilter;

                // Priority filter
                const priorityMatch = priorityFilter === 'all' || consultation.priority === priorityFilter;

                return searchMatch && statusMatch && priorityMatch;
              }).map((consultation: any) => {
                const statusColors = getStatusColor(consultation.status || 'pending');
                const priorityColors = getPriorityColor(consultation.priority || 'medium');

                return (
                  <tr key={consultation.id} style={{ borderTop: '1px solid #e5e7eb' }}
                    onMouseOver={(e) => {
                      (e.target as HTMLTableRowElement).style.backgroundColor = '#f9fafb';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLTableRowElement).style.backgroundColor = 'white';
                    }}
                  >
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#111827'
                        }}>
                          {consultation.name}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          {consultation.email}
                        </div>
                        {consultation.phone && (
                          <div style={{
                            fontSize: '12px',
                            color: '#9ca3af'
                          }}>
                            {consultation.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      whiteSpace: 'nowrap',
                      fontSize: '14px',
                      color: '#111827'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>
                          {consultation.company || '-'}
                        </div>
                        {consultation.timeline && (
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            Timeline: {consultation.timeline}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: priorityColors.bg,
                        color: priorityColors.color
                      }}>
                        {consultation.priority || 'medium'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: statusColors.bg,
                        color: statusColors.color
                      }}>
                        {consultation.status || 'pending'}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      whiteSpace: 'nowrap',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      <div>
                        {new Date(consultation.timestamp).toLocaleDateString()}
                      </div>
                      {consultation.followUpDate && (
                        <div style={{
                          fontSize: '12px',
                          color: '#f59e0b',
                          fontWeight: '500'
                        }}>
                          Follow-up: {new Date(consultation.followUpDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openConsultationModal(consultation)}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '60px',
                            textAlign: 'center'
                          }}
                          onMouseEnter={(e) => {
                            const btn = e.target as HTMLButtonElement;
                            btn.style.backgroundColor = '#2563eb';
                            btn.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            const btn = e.target as HTMLButtonElement;
                            btn.style.backgroundColor = '#3b82f6';
                            btn.style.transform = 'translateY(0)';
                          }}
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${consultation.email}`, '_blank')}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '50px',
                            textAlign: 'center'
                          }}
                          onMouseEnter={(e) => {
                            const btn = e.target as HTMLButtonElement;
                            btn.style.backgroundColor = '#059669';
                            btn.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            const btn = e.target as HTMLButtonElement;
                            btn.style.backgroundColor = '#10b981';
                            btn.style.transform = 'translateY(0)';
                          }}
                        >
                          Email
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) || (
                <tr>
                  <td colSpan={6} style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    No consultation requests yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNewsletterScreen = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#d1fae5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#059669', fontSize: '18px', fontWeight: 'bold' }}>N</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                Active Subscribers
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.newsletter?.active || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#2563eb', fontSize: '18px', fontWeight: 'bold' }}>A</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                This Week
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.newsletter?.thisWeek || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#111827',
            margin: '0'
          }}>
            Newsletter Subscribers
          </h3>
          <button
            onClick={() => exportData('subscribers')}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#047857';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#059669';
            }}
          >
            Export Excel
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Email
                </th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Status
                </th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Subscribed
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {analytics?.subscribersList?.map((subscriber: any) => (
                <tr key={subscriber.id} style={{ borderTop: '1px solid #e5e7eb' }}
                  onMouseOver={(e) => {
                    (e.target as HTMLTableRowElement).style.backgroundColor = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLTableRowElement).style.backgroundColor = 'white';
                  }}
                >
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {subscriber.email}
                  </td>
                  <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '9999px',
                      backgroundColor: subscriber.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: subscriber.status === 'active' ? '#065f46' : '#991b1b'
                    }}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {new Date(subscriber.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={3} style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    No newsletter subscribers yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDownloadsScreen = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#f3e8ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#7c3aed', fontSize: '18px' }}>💻</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                Total Downloads
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.desktopDownloads?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#2563eb', fontSize: '18px' }}>📈</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                This Week
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.desktopDownloads?.thisWeek || 0}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#d1fae5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#059669', fontSize: '18px' }}>📧</span>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                Newsletter Signups
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0'
              }}>
                {analytics?.desktopDownloadsList?.filter((d: any) => d.subscribeNewsletter).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#111827',
            margin: '0'
          }}>
            Desktop App Downloads
          </h3>
          <button
            onClick={() => exportData('desktop-downloads')}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#7c3aed';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#8b5cf6';
            }}
          >
            Export Excel
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Contact</th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Company</th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>OS</th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Language</th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Newsletter</th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Status</th>
                <th style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Date</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {analytics?.desktopDownloadsList?.map((download: any) => (
                <tr key={download.id} style={{ borderTop: '1px solid #e5e7eb' }}
                  onMouseOver={(e) => {
                    (e.target as HTMLTableRowElement).style.backgroundColor = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLTableRowElement).style.backgroundColor = 'white';
                  }}
                >
                  <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#111827'
                      }}>
                        {download.name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {download.email}
                      </div>
                    </div>
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#111827'
                  }}>
                    {download.company || '-'}
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#111827'
                  }}>
                    {download.operatingSystem}
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#111827'
                  }}>
                    {download.language}
                  </td>
                  <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                    {download.subscribeNewsletter ? (
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: '#d1fae5',
                        color: '#065f46'
                      }}>
                        Yes
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151'
                      }}>
                        No
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '9999px',
                      backgroundColor: download.status === 'sent' ? '#dbeafe' :
                                     download.status === 'downloaded' ? '#d1fae5' : '#fee2e2',
                      color: download.status === 'sent' ? '#1e40af' :
                             download.status === 'downloaded' ? '#065f46' : '#991b1b'
                    }}>
                      {download.status}
                    </span>
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {new Date(download.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={7} style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    No desktop downloads yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flexShrink: 0 }}>
                <img
                  src="/images/axiestudio-logo-192.png"
                  alt="AxieStudio Logo"
                  width="40"
                  height="40"
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>
                  AxieStudio Analytics
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>
                  Real-time customer insights and business analytics
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={fetchAnalytics}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
                }}
              >
                <span>🔄</span>
                <span>Refresh Data</span>
              </button>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Loading...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <button
              onClick={() => setActiveScreen('consultations')}
              style={{
                padding: '16px 4px',
                borderBottom: activeScreen === 'consultations' ? '2px solid #3b82f6' : '2px solid transparent',
                fontWeight: '500',
                fontSize: '14px',
                color: activeScreen === 'consultations' ? '#2563eb' : '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                if (activeScreen !== 'consultations') {
                  (e.target as HTMLButtonElement).style.color = '#374151';
                  (e.target as HTMLButtonElement).style.borderBottomColor = '#d1d5db';
                }
              }}
              onMouseOut={(e) => {
                if (activeScreen !== 'consultations') {
                  (e.target as HTMLButtonElement).style.color = '#6b7280';
                  (e.target as HTMLButtonElement).style.borderBottomColor = 'transparent';
                }
              }}
            >
              Consultations
            </button>
            <button
              onClick={() => setActiveScreen('newsletter')}
              style={{
                padding: '16px 4px',
                borderBottom: activeScreen === 'newsletter' ? '2px solid #3b82f6' : '2px solid transparent',
                fontWeight: '500',
                fontSize: '14px',
                color: activeScreen === 'newsletter' ? '#2563eb' : '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                if (activeScreen !== 'newsletter') {
                  (e.target as HTMLButtonElement).style.color = '#374151';
                  (e.target as HTMLButtonElement).style.borderBottomColor = '#d1d5db';
                }
              }}
              onMouseOut={(e) => {
                if (activeScreen !== 'newsletter') {
                  (e.target as HTMLButtonElement).style.color = '#6b7280';
                  (e.target as HTMLButtonElement).style.borderBottomColor = 'transparent';
                }
              }}
            >
              Newsletter
            </button>
            <button
              onClick={() => setActiveScreen('downloads')}
              style={{
                padding: '16px 4px',
                borderBottom: activeScreen === 'downloads' ? '2px solid #3b82f6' : '2px solid transparent',
                fontWeight: '500',
                fontSize: '14px',
                color: activeScreen === 'downloads' ? '#2563eb' : '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                if (activeScreen !== 'downloads') {
                  (e.target as HTMLButtonElement).style.color = '#374151';
                  (e.target as HTMLButtonElement).style.borderBottomColor = '#d1d5db';
                }
              }}
              onMouseOut={(e) => {
                if (activeScreen !== 'downloads') {
                  (e.target as HTMLButtonElement).style.color = '#6b7280';
                  (e.target as HTMLButtonElement).style.borderBottomColor = 'transparent';
                }
              }}
            >
              App Downloads
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        {analytics ? (
          <>
            {activeScreen === 'consultations' && renderConsultationsScreen()}
            {activeScreen === 'newsletter' && renderNewsletterScreen()}
            {activeScreen === 'downloads' && renderDownloadsScreen()}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading analytics...</div>
          </div>
        )}
      </div>

      {/* Consultation Management Modal */}
      {showConsultationModal && selectedConsultation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>
                  Manage Consultation
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>
                  {selectedConsultation.name} • {selectedConsultation.email}
                </p>
              </div>
              <button
                onClick={closeConsultationModal}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#374151';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#6b7280';
                }}
              >
                ×
              </button>
            </div>

            {/* Client Information */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 12px 0'
              }}>
                Client Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                    COMPANY
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#111827' }}>
                    {selectedConsultation.company || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                    TIMELINE
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#111827' }}>
                    {selectedConsultation.timeline || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                    SUBMITTED
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#111827' }}>
                    {new Date(selectedConsultation.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                    USE CASE
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#111827' }}>
                    {selectedConsultation.useCase || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Management Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Status
                </label>
                <select
                  value={consultationStatus}
                  onChange={(e) => setConsultationStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                  <option value="follow_up">Follow Up</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Follow-up Date */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Internal Notes
                </label>
                <textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Add internal notes about this consultation..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '32px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={closeConsultationModal}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                }}
              >
                Cancel
              </button>
              <button
                onClick={updateConsultationStatus}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
