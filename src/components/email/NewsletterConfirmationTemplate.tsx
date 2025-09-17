import * as React from 'react';

interface NewsletterConfirmationTemplateProps {
  email: string;
}

export function NewsletterConfirmationTemplate({ 
  email 
}: NewsletterConfirmationTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>Welcome to AI++ Newsletter</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>You're now subscribed to the latest in AI and Customer Service Automation</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#555', marginBottom: '20px' }}>Hello there,</h2>
          <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
            Thank you for subscribing to the <strong>AI++ Newsletter</strong> from AxieStudio! 
            You've just joined a community of forward-thinking professionals who are transforming 
            customer service with AI automation.
          </p>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Subscription Confirmed:</h3>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Newsletter:</strong> AI++ Newsletter</p>
            <p><strong>Status:</strong> Active</p>
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>What to Expect:</h3>
          <ul style={{ lineHeight: '1.8', color: '#666', paddingLeft: '20px' }}>
            <li><strong>AI Automation Tips:</strong> Latest strategies for customer service automation</li>
            <li><strong>AxieStudio Updates:</strong> New features and platform improvements</li>
            <li><strong>Industry Insights:</strong> Trends and best practices in customer service</li>
            <li><strong>Case Studies:</strong> Real success stories from our customers</li>
            <li><strong>Tutorials:</strong> Step-by-step guides for building better flows</li>
          </ul>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Ready to Get Started?</h3>
          <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
            While you wait for your first newsletter, why not explore what AxieStudio can do for your business?
          </p>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <a href="https://axiestudio.se" 
               style={{ 
                 backgroundColor: '#28a745', 
                 color: 'white', 
                 padding: '12px 24px', 
                 textDecoration: 'none', 
                 borderRadius: '6px',
                 display: 'inline-block',
                 fontWeight: 'bold',
                 marginRight: '10px'
               }}>
              Explore AxieStudio
            </a>
            <a href="https://axiestudio.se/consultation" 
               style={{ 
                 backgroundColor: '#007bff', 
                 color: 'white', 
                 padding: '12px 24px', 
                 textDecoration: 'none', 
                 borderRadius: '6px',
                 display: 'inline-block',
                 fontWeight: 'bold'
               }}>
              Book Free Consultation
            </a>
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Stay Connected:</h3>
          <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '15px' }}>
            Follow us on social media for daily tips and updates:
          </p>
          <div style={{ textAlign: 'center' }}>
            <a href="https://www.facebook.com/p/Axie-Studio-61573009403109/" style={{ margin: '0 10px', color: '#1976d2' }}>Facebook</a>
            <a href="https://www.instagram.com/axiestudi0/" style={{ margin: '0 10px', color: '#1976d2' }}>Instagram</a>
            <a href="https://www.youtube.com/channel/UCD4CAPRLqS3-NjBe8s2vr_g" style={{ margin: '0 10px', color: '#1976d2' }}>YouTube</a>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#1976d2' }}>
            <strong>AxieStudio</strong> - AI++ Newsletter
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
            Visit us at: <a href="https://axiestudio.se" style={{ color: '#1976d2' }}>axiestudio.se</a> |
            <a href="mailto:stefan@jonkoping.site" style={{ color: '#1976d2', marginLeft: '10px' }}>Contact Support</a>
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#999' }}>
            You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE"
          </p>
        </div>
      </div>
    </div>
  );
}
