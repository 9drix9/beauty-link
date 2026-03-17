import SwiftUI

struct CheckoutView: View {
    let listing: Listing
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var auth: AuthManager
    @State private var isProcessing = false
    @State private var checkoutComplete = false
    @State private var error: String?

    var breakdown: PriceBreakdown {
        PriceBreakdown(originalCents: listing.originalPriceCents, discountedCents: listing.discountedPriceCents)
    }

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                if checkoutComplete {
                    checkoutSuccessView
                } else {
                    ScrollView {
                        VStack(spacing: 20) {
                            // Service Summary
                            serviceSummary

                            // Price Breakdown
                            priceBreakdown

                            // Payment Notice
                            paymentNotice

                            // Book Button
                            PrimaryButton(
                                title: "Confirm Booking \u{2022} $\(String(format: "%.2f", breakdown.totalCharged))",
                                action: processCheckout,
                                isLoading: isProcessing
                            )

                            if let error {
                                Text(error)
                                    .font(.caption)
                                    .foregroundColor(AppTheme.error)
                            }

                            // Cancellation policy
                            HStack(spacing: 6) {
                                Image(systemName: "info.circle")
                                    .font(.caption)
                                Text("Free cancellation up to 24 hours before appointment.")
                                    .font(.caption)
                            }
                            .foregroundColor(AppTheme.muted)
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Checkout")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                        .foregroundColor(AppTheme.muted)
                }
            }
        }
    }

    // MARK: - Service Summary

    private var serviceSummary: some View {
        HStack(spacing: 14) {
            if let url = listing.photoUrl, let imageURL = URL(string: url) {
                AsyncImage(url: imageURL) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle().fill(AppTheme.accentLight)
                }
                .frame(width: 80, height: 80)
                .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(listing.serviceName)
                    .font(.headline)
                    .foregroundColor(AppTheme.dark)
                if let provider = listing.provider {
                    Text(provider.businessName ?? "Professional")
                        .font(.subheadline)
                        .foregroundColor(AppTheme.muted)
                }
                HStack(spacing: 12) {
                    Label(listing.appointmentDate, systemImage: "calendar")
                    Label(listing.startTime, systemImage: "clock")
                }
                .font(.caption)
                .foregroundColor(AppTheme.muted)
            }
            Spacer()
        }
        .padding()
        .background(AppTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                .stroke(AppTheme.border, lineWidth: 1)
        )
    }

    // MARK: - Price Breakdown

    private var priceBreakdown: some View {
        VStack(spacing: 10) {
            Text("Price Breakdown")
                .font(.subheadline.bold())
                .foregroundColor(AppTheme.dark)
                .frame(maxWidth: .infinity, alignment: .leading)

            PriceRow(label: "Original price", value: "$\(String(format: "%.2f", breakdown.originalPrice))", style: .strikethrough)
            PriceRow(label: "Discounted price", value: "$\(String(format: "%.2f", breakdown.discountedPrice))")
            PriceRow(label: "You save", value: "\(breakdown.savingsPercent)%")
            PriceRow(label: "Service fee (5%)", value: "$\(String(format: "%.2f", breakdown.platformFee))")
            Divider()
            PriceRow(label: "Total", value: "$\(String(format: "%.2f", breakdown.totalCharged))", style: .bold)
        }
        .padding()
        .background(AppTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                .stroke(AppTheme.border, lineWidth: 1)
        )
    }

    // MARK: - Payment Notice

    private var paymentNotice: some View {
        HStack(spacing: 10) {
            Image(systemName: "lock.shield.fill")
                .foregroundColor(AppTheme.success)
            VStack(alignment: .leading, spacing: 2) {
                Text("Secure Payment")
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(AppTheme.dark)
                Text("Payments processed by Stripe. Your card details are never stored on our servers.")
                    .font(.caption)
                    .foregroundColor(AppTheme.muted)
            }
        }
        .padding()
        .background(AppTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                .stroke(AppTheme.border, lineWidth: 1)
        )
    }

    // MARK: - Success

    private var checkoutSuccessView: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 60))
                .foregroundColor(AppTheme.success)
            Text("Booking Confirmed!")
                .font(AppTheme.serif(28))
                .foregroundColor(AppTheme.dark)
            Text("Your appointment has been booked. You will receive a confirmation email shortly.")
                .font(.subheadline)
                .foregroundColor(AppTheme.muted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            PrimaryButton(title: "View My Bookings", action: { dismiss() })
                .padding(.horizontal, 32)
            Spacer()
        }
    }

    // MARK: - Actions

    private func processCheckout() {
        isProcessing = true
        error = nil

        Task {
            do {
                _ = try await APIService.shared.createCheckout(listingId: listing.id)
                checkoutComplete = true
            } catch let apiError as APIError {
                error = apiError.errorDescription
            } catch {
                self.error = "Something went wrong. Please try again."
            }
            isProcessing = false
        }
    }
}
