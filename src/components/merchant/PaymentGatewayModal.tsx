import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, RechargePlan, PaymentTransaction } from '../../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Printer,
  Download,
} from 'lucide-react';

interface PaymentGatewayModalProps {
  store: Store;
  plan: RechargePlan;
  customDays?: number;
  customPrice?: number;
  onClose: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  store,
  plan,
  customDays,
  customPrice,
  onClose,
}) => {
  const { processRecharge, setMerchantTab } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('Google Pay');
  const [upiIdInput, setUpiIdInput] = useState<string>('storeowner@okaxis');
  const [cardNumber, setCardNumber] = useState<string>('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState<string>('09/28');
  const [cardCvv, setCardCvv] = useState<string>('842');
  const [cardName, setCardName] = useState<string>(store.name);
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const duration = customDays || plan.durationDays;
  const basePrice = customPrice !== undefined ? customPrice : plan.price;
  const gst = Math.round(basePrice * 0.18 * 100) / 100;
  const total = Math.round((basePrice + gst) * 100) / 100;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate gateway verification
    setTimeout(() => {
      const tx = processRecharge(
        store.id,
        plan,
        paymentMethod,
        customDays,
        customPrice,
        paymentMethod === 'upi' ? selectedUpiApp : undefined
      );
      setIsProcessing(false);
      setCompletedTx(tx);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 text-white text-left">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                Secure Store Recharge Checkout
              </h3>
              <p className="text-[11px] text-slate-400">
                128-bit Encrypted Merchant Payment Gateway
              </p>
            </div>
          </div>
          {!completedTx && (
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* COMPLETED SUCCESS STATE */}
        {completedTx ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Payment Successful · Recharge Activated
              </div>
              <h2 className="text-2xl font-black text-white font-display mt-1">
                Your Store is Now LIVE on SpotLock!
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Your Tata Play-style prepaid subscription has been successfully credited. Shoppers nearby can now see your store, daily deals, and copy your coupon codes.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Receipt No:</span>
                <span className="text-white font-bold">{completedTx.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Store Name:</span>
                <span className="text-white">{completedTx.storeName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Plan Activated:</span>
                <span className="text-amber-400">{completedTx.planName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Duration Added:</span>
                <span className="text-white">+{completedTx.durationDays} Days</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>New Expiry Date:</span>
                <span className="text-emerald-400 font-bold">{completedTx.newExpiryDate}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-200 font-bold text-sm">
                <span>Amount Paid:</span>
                <span className="text-emerald-400">₹{completedTx.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print GST Invoice</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setMerchantTab('overview');
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <span>Return to Store Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM & BREAKDOWN */
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Order Invoice Breakdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Store Name:</span>
                <span className="text-white font-medium">{store.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Selected Plan:</span>
                <span className="text-amber-400 font-semibold">{customDays ? `Custom Flexi Pack (${customDays} Days)` : plan.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Validity Extended:</span>
                <span className="text-white">{duration} Days from today</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Base Subscription Fee:</span>
                <span className="text-white">₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18% CGST + SGST):</span>
                <span className="text-white">₹{gst.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                <span>Total Payable:</span>
                <span className="text-amber-400 text-base font-display">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Payment Mode:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === 'card'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === 'netbanking'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {paymentMethod === 'upi' && (
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-3">
                <div className="text-xs font-medium text-slate-300">Choose UPI App:</div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedUpiApp(app)}
                      className={`py-2 px-1 text-center rounded-lg border transition-colors ${
                        selectedUpiApp === app
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300 font-bold'
                          : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Or Enter Merchant UPI ID:
                  </label>
                  <input
                    type="text"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    placeholder="mobile@upi or user@okaxis"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                <label className="block text-xs text-slate-300">Popular Banks:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          selectedBank === bank
                            ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300 font-bold'
                            : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {bank}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Contacting Banking Gateway...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay ₹{total.toFixed(2)} & Activate Listing</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Instant auto-activation upon transaction completion</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
