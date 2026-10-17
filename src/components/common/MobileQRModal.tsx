import React, { useState } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Download,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface MobileQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
}

export const MobileQRModal: React.FC<MobileQRModalProps> = ({ isOpen, onClose, sharedUrl }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'android' | 'ios'>('scan');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // QR code image via reliable standard SVG QR API or data representation
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    sharedUrl
  )}&bgcolor=0f172a&color=f8fafc&margin=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 text-white text-left animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Open SpotLock on Your Mobile
              </h3>
              <p className="text-xs text-slate-400">
                Scan with your phone camera or copy the live link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="p-6 pb-0">
          <div className="grid grid-cols-3 p-1 bg-slate-800/80 rounded-xl mb-5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('scan')}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'scan' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR Code</span>
            </button>
            <button
              onClick={() => setActiveTab('android')}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'android' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Android Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'ios' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>iPhone Guide</span>
            </button>
          </div>
        </div>

        {/* Tab 1: SCAN QR CODE */}
        {activeTab === 'scan' && (
          <div className="p-6 pt-2 space-y-5 text-center">
            {/* QR Code Container */}
            <div className="relative mx-auto w-64 h-64 p-3 bg-slate-950 border-2 border-amber-400/40 rounded-2xl shadow-xl flex items-center justify-center group">
              <img
                src={qrCodeUrl}
                alt="SpotLock Mobile QR Code"
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-amber-400/20 pointer-events-none" />
            </div>

            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Open your <strong>Camera app</strong> (or Google Lens / QR Scanner) on your phone and point it at the code above to open SpotLock instantly.
            </p>

            {/* Direct Copy URL Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 text-left">
              <div className="truncate text-xs font-mono text-slate-300 pl-2">
                {sharedUrl}
              </div>
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: ANDROID GUIDE */}
        {activeTab === 'android' && (
          <div className="p-6 pt-2 space-y-4 text-left text-xs">
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Install SpotLock as a standalone app on your Android phone:</span>
            </div>

            <ol className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-bold text-center leading-5 text-amber-400 shrink-0">
                  1
                </span>
                <span>
                  Open <strong>Google Chrome</strong> on your Android phone and visit the link below.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-bold text-center leading-5 text-amber-400 shrink-0">
                  2
                </span>
                <span>
                  Tap the three vertical dots menu (<strong>⋮</strong>) in the top right corner of Chrome.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-bold text-center leading-5 text-amber-400 shrink-0">
                  3
                </span>
                <span>
                  Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-bold text-center leading-5 text-amber-400 shrink-0">
                  4
                </span>
                <span>
                  SpotLock will now be installed directly on your Android phone with its own app icon, launching in full-screen standalone mode without any browser URL bars!
                </span>
              </li>
            </ol>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Copy App Link to Send to Phone'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: IPHONE GUIDE */}
        {activeTab === 'ios' && (
          <div className="p-6 pt-2 space-y-4 text-left text-xs">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Install SpotLock as a full-screen app on your iPhone:</span>
            </div>

            <ol className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-bold text-center leading-5 text-amber-400 shrink-0">
                  1
                </span>
                <span>
                  Open <strong>Safari</strong> on your iPhone and visit the live SpotLock link.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-bold text-center leading-5 text-amber-400 shrink-0">
                  2
                </span>
                <span>
                  Tap the <strong>Share button</strong> (the square icon with an arrow pointing up) at the bottom toolbar.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-bold text-center leading-5 text-amber-400 shrink-0">
                  3
                </span>
                <span>
                  Scroll down the action sheet and tap <strong>"Add to Home Screen"</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-bold text-center leading-5 text-amber-400 shrink-0">
                  4
                </span>
                <span>
                  Tap <strong>Add</strong> in the top right. SpotLock will sit alongside your native iOS apps with smooth app icon launching!
                </span>
              </li>
            </ol>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Copy App Link to Send to Phone'}</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Optimized for iOS & Android mobile viewports</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
