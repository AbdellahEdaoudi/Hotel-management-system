"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentConfirmContent() {
	const [showConfetti, setShowConfetti] = useState(false);
	const [confettiItems, setConfettiItems] = useState([]);
	const [isUpdating, setIsUpdating] = useState(true);
	const searchParams = useSearchParams();
	const paymentIntent = searchParams.get('payment_intent');
	const bookingId = searchParams.get('bookingId');

	useEffect(() => {
		// Generate confetti items on client side only
		const items = [...Array(50)].map((_, i) => ({
			id: i,
			left: Math.random() * 100,
			delay: Math.random() * 3,
			duration: 3 + Math.random() * 2,
			color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
		}));
		setConfettiItems(items);
		setShowConfetti(true);

		// Hide confetti after 5 seconds
		const timer = setTimeout(() => setShowConfetti(false), 5000);
		setIsUpdating(false);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
			{/* Confetti Effect */}
			{showConfetti && confettiItems.length > 0 && (
				<div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
					{confettiItems.map((item) => (
						<div
							key={item.id}
							className="absolute animate-confetti"
							style={{
								left: `${item.left}%`,
								top: '-10%',
								animationDelay: `${item.delay}s`,
								animationDuration: `${item.duration}s`,
							}}
						>
							<div
								className="w-2 h-2 rounded-full"
								style={{
									backgroundColor: item.color,
								}}
							/>
						</div>
					))}
				</div>
			)}

			{/* Main Content */}
			<div className="max-w-2xl w-full">
				{/* Success Card */}
				<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
					{/* Header with gradient */}
					<div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
						<div className="flex justify-center mb-4">
							<div className="relative">
								<div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
								<div className="relative bg-white rounded-full p-4">
									<svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							</div>
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
							Payment Successful!
						</h1>
						<p className="text-green-100 text-lg">
							Your booking has been confirmed
						</p>
					</div>

					{/* Body */}
					<div className="p-8">
						{/* Success Message */}
						<div className="text-center mb-8">
							<p className="text-gray-700 text-lg leading-relaxed">
								Thank you for choosing <span className="font-bold text-orange-600">EdHotel</span>!
								Your reservation has been successfully processed.
							</p>
						</div>

						{/* Info Cards */}
						<div className="grid md:grid-cols-2 gap-4 mb-8">
							<div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
								<svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								<div>
									<h3 className="font-semibold text-gray-900 mb-1">Confirmation Email</h3>
									<p className="text-sm text-gray-600">
										A confirmation email with all booking details has been sent to your inbox.
									</p>
								</div>
							</div>

							<div className="bg-green-50 rounded-lg p-4 flex items-start gap-3">
								<svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<div>
									<h3 className="font-semibold text-gray-900 mb-1">Booking Details</h3>
									<p className="text-sm text-gray-600">
										You can view and manage your bookings in your account dashboard.
									</p>
								</div>
							</div>
						</div>

						{/* Payment Reference */}
						{paymentIntent && (
							<div className="bg-gray-50 rounded-lg p-4 mb-8">
								<p className="text-xs text-gray-500 mb-1">Payment Reference</p>
								<p className="text-sm font-mono text-gray-700 break-all">{paymentIntent}</p>
							</div>
						)}

						{/* Next Steps */}
						<div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8">
							<h3 className="font-semibold text-orange-900 mb-2">What's Next?</h3>
							<ul className="space-y-2 text-sm text-orange-800">
								<li className="flex items-start gap-2">
									<span className="text-orange-500 mt-0.5">•</span>
									<span>Check your email for the confirmation and booking details</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-orange-500 mt-0.5">•</span>
									<span>Save your booking reference for check-in</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-orange-500 mt-0.5">•</span>
									<span>Contact us if you need to make any changes</span>
								</li>
							</ul>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								href="/Booking"
								className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								View My Bookings
							</Link>
							<Link
								href="/"
								className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
								Back to Home
							</Link>
						</div>
					</div>
				</div>

				{/* Footer Note */}
				<div className="text-center mt-8">
					<p className="text-gray-600 text-sm">
						Need help? <Link href="/Contact" className="text-orange-600 hover:text-orange-700 font-semibold">Contact our support team</Link>
					</p>
				</div>
			</div>

			{/* Custom Animations */}
			<style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
		</div>
	);
}

function PaymentConfirm() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
			</div>
		}>
			<PaymentConfirmContent />
		</Suspense>
	);
}

export default PaymentConfirm;
