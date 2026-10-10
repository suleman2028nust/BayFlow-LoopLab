'use client';

import { API_BASE_URL } from "@/lib/api";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WhatsAppLinkPage() {
  const [qrStatus, setQrStatus] = useState<string>('INITIALIZING');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Connecting to WhatsApp Engine...');
  const [testPhone, setTestPhone] = useState('');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [sendingTest, setSendingTest] = useState(false);

  const fetchQr = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/qr`);
      const data = await res.json();
      
      if (data.status) setQrStatus(data.status);
      if (data.message) setMessage(data.message);
      if (data.qrCode) setQrCode(data.qrCode);
      
    } catch (error) {
      console.error(error);
      setMessage('Failed to connect to the backend server.');
    }
  };

  const sendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim()) return;

    setSendingTest(true);
    setTestStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/whatsapp/test?phone=${encodeURIComponent(testPhone.trim())}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus(`✅ Success: Test message dispatched to ${testPhone}! Check your phone.`);
      } else {
        setTestStatus(`❌ Failed: ${data.message || 'Could not send test message'}`);
      }
    } catch (err: any) {
      setTestStatus(`❌ Error: ${err.message || 'Network error'}`);
    } finally {
      setSendingTest(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchQr, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">Link WhatsApp</h1>
        <p className="text-zinc-400 mb-8 text-sm">
          Connect your business number to automatically send booking updates to customers.
        </p>
        
        <div className="bg-white rounded-xl p-4 flex items-center justify-center min-h-[300px] mb-6">
          {qrStatus === 'CONNECTED' ? (
            <div className="text-emerald-500 font-bold text-xl flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-3xl">
                ✅
              </div>
              Connected!
              <span className="text-xs text-zinc-500 font-normal">
                WhatsApp engine is online and ready to dispatch messages.
              </span>
            </div>
          ) : qrCode ? (
            <Image 
              src={qrCode} 
              alt="WhatsApp QR Code" 
              width={250} 
              height={250} 
              className="rounded-lg"
            />
          ) : (
            <div className="text-zinc-500 animate-pulse font-medium">
              {message}
            </div>
          )}
        </div>
        
        {qrStatus === 'QR_READY' && (
          <p className="text-zinc-400 text-sm">
            Open WhatsApp on your phone &gt; Linked Devices &gt; Link a Device, and scan this code.
          </p>
        )}

        {qrStatus === 'CONNECTED' && (
          <form onSubmit={sendTestMessage} className="mt-6 pt-6 border-t border-zinc-800 text-left space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">Send Test WhatsApp Message</h3>
            <p className="text-xs text-zinc-400">Verify your connection by sending a real WhatsApp message to your phone:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Phone (e.g. 03289082754)"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={sendingTest || !testPhone.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
              >
                {sendingTest ? 'Sending...' : 'Send Test'}
              </button>
            </div>
            {testStatus && (
              <p className={`text-xs ${testStatus.startsWith('✅') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {testStatus}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
