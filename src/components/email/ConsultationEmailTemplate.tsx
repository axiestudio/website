import * as React from 'react';

interface ConsultationEmailTemplateProps {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  usecase: string;
  timeline?: string;
  referrer?: string;
}

export function ConsultationEmailTemplate({ 
  name, 
  email, 
  company, 
  phone, 
  usecase, 
  timeline,
  referrer 
}: ConsultationEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>🎯 New Consultation Request</h1>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>👤 Contact Information</h2>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          {company && <p><strong>Company:</strong> {company}</p>}
          {phone && <p><strong>Phone:</strong> {phone}</p>}
          {timeline && <p><strong>Timeline:</strong> {timeline}</p>}
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>🎯 Use Case & Requirements</h2>
          <p style={{ lineHeight: '1.6', color: '#666' }}>{usecase}</p>
        </div>

        {referrer && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <h2 style={{ color: '#555', marginBottom: '15px' }}>📊 Source Information</h2>
            <p><strong>Referrer:</strong> {referrer}</p>
          </div>
        )}
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#1976d2' }}>
            🚀 This consultation request was submitted from AxieStudio.se - Customer Service Automation Platform
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
