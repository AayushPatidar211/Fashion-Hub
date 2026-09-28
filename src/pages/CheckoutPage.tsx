import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Banknote, Smartphone, Lock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Address, Order } from '../types';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onNavigateBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onNavigateBack,
}) => {
  const { cart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address State
  const [address, setAddress] = useState<Address>({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Sarah Jenkins',
    phone: user?.phoneNumber || '+1-555-0142',
    streetAddress: user?.defaultAddress?.streetAddress || '742 Evergreen Terrace',
    apartment: user?.defaultAddress?.apartment || 'Apt 4B',
    city: user?.defaultAddress?.city || 'Springfield',
    state: user?.defaultAddress?.state || 'OR',
    postalCode: user?.defaultAddress?.postalCode || '97477',
    country: user?.defaultAddress?.country || 'United States',
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'UPI' | 'COD'>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [upiId, setUpiId] = useState('sarah@oksbi');
  const [orderNotes, setOrderNotes] = useState('');

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.streetAddress || !address.city || !address.postalCode) {
      setError('Please fill in all mandatory delivery address fields.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const order = await orderService.placeOrder({
        shippingAddress: address,
        paymentMethod,
        orderNotes,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      onOrderSuccess(order);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Please review your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Breadcrumb / Stepper */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
        <button
          onClick={onNavigateBack}
          className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping Bag</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-mono font-medium">
          <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Delivery Address</span>
          </span>
          <span className="text-neutral-300">/</span>
          <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}>2</span>
            <span>Payment & Review</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Steps Form: 7 Cols */}
        <div className="lg:col-span-7">
          {step === 1 ? (
            /* Step 1: Address Form */
            <form onSubmit={handleAddressSubmit} className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-neutral-900">Shipping Address</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Please provide the destination for your garment package.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Full Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address.streetAddress}
                    onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    placeholder="House number and street name"
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    value={address.apartment}
                    onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                    placeholder="e.g. Apt 4B"
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">State / Province *</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Payment Method & Place Order */
            <form onSubmit={handlePlaceOrder} className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h2 className="font-serif text-xl font-bold text-neutral-900">Select Payment Method</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Secure payment provider abstraction (PaymentService).</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-neutral-600 hover:underline"
                >
                  Edit Address
                </button>
              </div>

              {/* Address Summary Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3.5 text-xs text-neutral-700 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-neutral-900">{address.fullName} ({address.phone})</span>
                  <p className="text-neutral-500 mt-0.5">
                    {address.streetAddress}{address.apartment ? `, ${address.apartment}` : ''}, {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                  Standard Delivery
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'CREDIT_CARD' ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-neutral-900" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">Credit / Debit Card</p>
                      <p className="text-[11px] text-neutral-500">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="accent-neutral-900"
                  />
                </label>

                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="p-4 bg-neutral-50 rounded-lg space-y-3 border border-neutral-200 text-xs">
                    <div>
                      <label className="block text-neutral-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-600 mb-1">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full text-xs font-mono px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-600 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          className="w-full text-xs font-mono px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-neutral-500" />
                      <span>Encrypted SSL 256-Bit Test Sandbox. Sensitive details never stored in MySQL.</span>
                    </p>
                  </div>
                )}

                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'UPI' ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-neutral-900" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">Instant UPI & NetBanking</p>
                      <p className="text-[11px] text-neutral-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-neutral-900"
                  />
                </label>

                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-neutral-50 rounded-lg space-y-2 border border-neutral-200 text-xs">
                    <label className="block text-neutral-600 mb-1">UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@upi"
                      className="w-full text-xs font-mono px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none"
                    />
                  </div>
                )}

                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD' ? 'border-neutral-900 bg-neutral-50/50' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-neutral-900" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-neutral-500">Pay cash upon parcel arrival at your doorstep</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-neutral-900"
                  />
                </label>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Delivery Notes or Special Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Leave with building concierge or front porch..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-neutral-600 hover:text-neutral-900"
                >
                  Back to Address
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-3.5 px-8 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Placing Order...' : `Pay $${cart.finalTotal.toFixed(2)} & Place Order`}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary Column: 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Order Items ({cart.totalItems})
            </h3>

            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3">
                  <div className="w-14 h-16 bg-neutral-100 rounded overflow-hidden shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-900 truncate">{item.productName}</h4>
                    <p className="text-[11px] text-neutral-500">
                      {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                    </p>
                    <span className="text-xs font-bold font-mono tabular-nums text-neutral-900 mt-1 block">
                      ${item.itemTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-900">${cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-${cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-mono tabular-nums text-neutral-900">
                  {cart.deliveryCharge === 0 ? 'FREE' : `$${cart.deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums">${cart.finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
