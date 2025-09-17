'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

export default function AdminDashboard() {
  const [authToken, setAuthToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date());
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
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

  const authenticate = async () => {
    if (!authToken) {
      setError('Please enter the analytics secret');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setIsAuthenticated(true);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError('Invalid authentication token');
      }
    } catch (err) {
      setError('Failed to fetch analytics');
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
  }, [isAuthenticated, authToken]);

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

  const exportData = async (type: 'consultations' | 'subscribers') => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
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

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '450px',
          border: '1px solid #e5e7eb'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            AxieStudio Admin Dashboard
          </h1>

          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              borderRadius: '6px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Analytics Secret
            </label>
            <input
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && authenticate()}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              placeholder="Enter analytics secret"
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            onClick={authenticate}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '14px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '8px'
            }}
            onMouseOver={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#3b82f6')}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0',
              marginBottom: '4px'
            }}>
              AxieStudio Analytics Dashboard
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: '0'
            }}>
              Real-time customer insights and analytics
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={fetchAnalytics}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔄 Refresh
            </button>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              textAlign: 'right'
            }}>
              <div>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Loading...'}</div>
              <div style={{ marginTop: '4px', color: '#10b981', fontWeight: '500' }}>● Live (auto-refresh 30s)</div>
            </div>
          </div>
        </div>

        {analytics ? (
          <div>
            {/* Quick Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0', marginBottom: '4px' }}>Total Consultations</p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                      {analytics.consultations?.total || 0}
                    </p>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    📋
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0', marginBottom: '4px' }}>Active Subscribers</p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                      {analytics.newsletter?.active || 0}
                    </p>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    📧
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0', marginBottom: '4px' }}>Pending Requests</p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                      {analytics.consultations?.pending || 0}
                    </p>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    ⏳
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0', marginBottom: '4px' }}>Total Leads</p>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                      {((analytics.newsletter?.active || 0) + (analytics.consultations?.total || 0))}
                    </p>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#e0e7ff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🎯
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Data Tables */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Consultation Requests Table */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: '0'
                  }}>
                    Recent Consultation Requests
                  </h2>
                  <button
                    onClick={() => exportData('consultations')}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Export CSV
                  </button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {analytics.consultationsList && analytics.consultationsList.length > 0 ? (
                    analytics.consultationsList.slice(0, 10).map((consultation: any, index: number) => (
                      <div key={consultation.id} style={{
                        padding: '16px 24px',
                        borderBottom: index < Math.min(analytics.consultationsList.length - 1, 9) ? '1px solid #f1f5f9' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1e293b',
                              margin: '0',
                              marginRight: '12px'
                            }}>
                              {consultation.name}
                            </h4>
                            <span style={{
                              fontSize: '12px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              backgroundColor: consultation.status === 'pending' ? '#fef3c7' :
                                             consultation.status === 'contacted' ? '#fed7aa' : '#dcfce7',
                              color: consultation.status === 'pending' ? '#92400e' :
                                     consultation.status === 'contacted' ? '#9a3412' : '#166534',
                              fontWeight: '500'
                            }}>
                              {consultation.status}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '13px',
                            color: '#64748b',
                            margin: '0',
                            marginBottom: '4px'
                          }}>
                            {consultation.email} {consultation.company && `• ${consultation.company}`}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            margin: '0'
                          }}>
                            {new Date(consultation.timestamp).toLocaleDateString()} at {new Date(consultation.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b',
                          textAlign: 'right',
                          marginLeft: '16px'
                        }}>
                          {consultation.timeline && (
                            <div style={{ marginBottom: '4px' }}>
                              Timeline: {consultation.timeline}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      padding: '40px 24px',
                      textAlign: 'center',
                      color: '#64748b'
                    }}>
                      No consultation requests yet
                    </div>
                  )}
                </div>
              </div>

              {/* Newsletter Subscribers Table */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: '0'
                  }}>
                    Newsletter Subscribers
                  </h2>
                  <button
                    onClick={() => exportData('subscribers')}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Export CSV
                  </button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {analytics.subscribersList && analytics.subscribersList.length > 0 ? (
                    analytics.subscribersList.slice(0, 10).map((subscriber: any, index: number) => (
                      <div key={subscriber.id} style={{
                        padding: '16px 24px',
                        borderBottom: index < Math.min(analytics.subscribersList.length - 1, 9) ? '1px solid #f1f5f9' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1e293b',
                              margin: '0',
                              marginRight: '12px'
                            }}>
                              {subscriber.email}
                            </h4>
                            <span style={{
                              fontSize: '12px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              backgroundColor: subscriber.status === 'active' ? '#dcfce7' : '#fee2e2',
                              color: subscriber.status === 'active' ? '#166534' : '#dc2626',
                              fontWeight: '500'
                            }}>
                              {subscriber.status}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            margin: '0'
                          }}>
                            Subscribed: {new Date(subscriber.timestamp).toLocaleDateString()} at {new Date(subscriber.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b',
                          textAlign: 'right',
                          marginLeft: '16px'
                        }}>
                          {subscriber.referrer && (
                            <div>
                              From: {new URL(subscriber.referrer).hostname}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      padding: '40px 24px',
                      textAlign: 'center',
                      color: '#64748b'
                    }}>
                      No newsletter subscribers yet
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading analytics...</p>
          </div>
        )}
      </div>
    </div>
  );
}
