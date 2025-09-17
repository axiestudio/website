import * as React from 'react';

interface ConsultationConfirmationTemplateProps {
  name: string;
  usecase: string;
  timeline?: string;
}

export function ConsultationConfirmationTemplate({ 
  name, 
  usecase, 
  timeline 
}: ConsultationConfirmationTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>Thank You for Your Consultation Request</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>We've received your request and will be in touch soon.</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#555', marginBottom: '20px' }}>Hello {name},</h2>
          <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
            Thank you for reaching out to AxieStudio for your customer service automation needs. 
            We're excited to help you transform your customer service operations with AI-powered solutions.
          </p>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Your Request Summary:</h3>
            <p><strong>Use Case:</strong> {usecase}</p>
            {timeline && <p><strong>Timeline:</strong> {timeline}</p>}
          </div>

          <h3 style={{ color: '#333', marginBottom: '15px' }}>What Happens Next?</h3>
          <ul style={{ lineHeight: '1.8', color: '#666', paddingLeft: '20px' }}>
            <li><strong>Within 24 hours:</strong> Our team will review your requirements</li>
            <li><strong>Within 48 hours:</strong> We'll contact you to schedule a consultation call</li>
            <li><strong>During the call:</strong> We'll discuss your specific needs and create a custom solution</li>
          </ul>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Why Choose AxieStudio?</h3>
          <ul style={{ lineHeight: '1.8', color: '#666', paddingLeft: '20px' }}>
            <li><strong>AI-Powered Automation:</strong> Reduce response times by 90%</li>
            <li><strong>Custom Solutions:</strong> Tailored to your specific business needs</li>
            <li><strong>Easy Integration:</strong> Works with your existing systems</li>
            <li><strong>24/7 Support:</strong> Always available when you need us</li>
          </ul>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Need Immediate Assistance?</h3>
          <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '15px' }}>
            If you have any urgent questions or need to modify your request, feel free to reply to this email 
            or contact us directly.
          </p>
          <div style={{ textAlign: 'center' }}>
            <a href="mailto:stefan@jonkoping.site" 
               style={{ 
                 backgroundColor: '#007bff', 
                 color: 'white', 
                 padding: '12px 24px', 
                 textDecoration: 'none', 
                 borderRadius: '6px',
                 display: 'inline-block',
                 fontWeight: 'bold'
               }}>
              Contact Us Directly
            </a>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#1976d2' }}>
            <strong>AxieStudio</strong> - Customer Service Automation Platform
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
            Visit us at: <a href="https://axiestudio.se" style={{ color: '#1976d2' }}>axiestudio.se</a>
          </p>
        </div>
      </div>
    </div>
  );
}
