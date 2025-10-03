
import * as React from 'react';

interface verificationEmailProps {
    userName: string;
    otp: number;
}
const year = new Date().getFullYear();

export const emailTemplate = ({userName, otp}:verificationEmailProps) => {
  return (
    <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', padding: '20px', color: '#333'}}>
      <div style={{maxWidth: '600px', margin: 'auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)'}}>
        <div style={{textAlign: 'center', paddingBottom: '20px'}}>
          <h2>Email Verification</h2>
        </div>

        <p>Hello <strong>{userName}</strong>,</p>

        <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>

        <div style={{backgroundColor: '#f0f0f0', padding: '16px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold', letterSpacing: '6px', margin: '20px 0', borderRadius: '5px'}}>
          {otp}
        </div>

        <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>

        <p>If you didn't request this, you can safely ignore this email.</p>

        <div style={{fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '30px'}}>
          &copy; {year} Your Company Name. All rights reserved.
        </div>
      </div>
    </div>
  );

}