import SwiftUI

struct AppointmentDetailView: View {
    let listing: Listing
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var auth: AuthManager
    @State private var showCheckout = false

    var breakdown: PriceBreakdown {
        PriceBreakdown(originalCents: listing.originalPriceCents, discountedCents: listing.discountedPriceCents)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                // Hero Image
                ZStack(alignment: .topLeading) {
                    if let url = listing.photoUrl, let imageURL = URL(string: url) {
                        AsyncImage(url: imageURL) { image in
                            image.resizable().aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Rectangle().fill(AppTheme.background)
                        }
                        .frame(height: 260)
                        .clipped()
                    } else {
                        Rectangle()
                            .fill(LinearGradient(colors: [AppTheme.accentLight, AppTheme.background], startPoint: .topLeading, endPoint: .bottomTrailing))
                            .frame(height: 260)
                    }

                    SavingsBadge(percent: listing.savingsPercent)
                        .padding(16)
                }

                VStack(alignment: .leading, spacing: 16) {
                    // Title + Price
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(listing.serviceName)
                                .font(.title2.bold())
                                .foregroundColor(AppTheme.dark)

                            HStack(spacing: 8) {
                                Text(listing.serviceCategory)
                                    .font(.caption)
                                    .foregroundColor(AppTheme.muted)
                                PreviewBadge()
                            }
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            PriceDisplay(original: listing.originalPrice, discounted: listing.discountedPrice)
                            Text("Save \(listing.savingsPercent)%")
                                .font(.caption.bold())
                                .foregroundColor(AppTheme.cta)
                        }
                    }

                    // Provider
                    if let provider = listing.provider {
                        HStack(spacing: 12) {
                            AvatarView(name: provider.businessName ?? "P", url: provider.avatarUrl, size: 44)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(provider.businessName ?? "Professional")
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundColor(AppTheme.dark)
                                if let rating = provider.rating {
                                    RatingView(rating: rating, count: provider.reviewCount)
                                }
                            }
                            Spacer()
                            if provider.verified == true {
                                HStack(spacing: 4) {
                                    Image(systemName: "checkmark.shield.fill")
                                        .font(.caption)
                                    Text("Verified")
                                        .font(.caption.weight(.medium))
                                }
                                .foregroundColor(AppTheme.success)
                            }
                        }
                        .padding(12)
                        .background(AppTheme.background)
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                    }

                    // Details
                    VStack(spacing: 8) {
                        DetailRow(icon: "calendar", text: listing.appointmentDate)
                        DetailRow(icon: "clock", text: "\(listing.startTime) \u{2022} \(listing.durationMinutes) min")
                        if let location = listing.address ?? listing.location {
                            DetailRow(icon: "mappin.and.ellipse", text: location)
                        }
                    }

                    // Description
                    if let description = listing.description, !description.isEmpty {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("About This Service")
                                .font(.subheadline.bold())
                                .foregroundColor(AppTheme.dark)
                            Text(description)
                                .font(.subheadline)
                                .foregroundColor(AppTheme.body.opacity(0.8))
                                .lineSpacing(4)
                        }
                    }

                    Divider()

                    // Price Breakdown
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Price Breakdown")
                            .font(.subheadline.bold())
                            .foregroundColor(AppTheme.dark)

                        PriceRow(label: "Original price", value: "$\(String(format: "%.2f", breakdown.originalPrice))", style: .strikethrough)
                        PriceRow(label: "Discounted price", value: "$\(String(format: "%.2f", breakdown.discountedPrice))")
                        PriceRow(label: "Service fee (5%)", value: "$\(String(format: "%.2f", breakdown.platformFee))")
                        Divider()
                        PriceRow(label: "Total", value: "$\(String(format: "%.2f", breakdown.totalCharged))", style: .bold)
                    }

                    Divider()

                    // Preview notice
                    VStack(spacing: 8) {
                        Text("This is a preview listing. Bookings open soon.")
                            .font(.subheadline)
                            .foregroundColor(AppTheme.muted)
                            .multilineTextAlignment(.center)
                        WaitlistFormView(source: "ios-appointment-detail")
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical)
                }
                .padding()
            }
        }
        .background(AppTheme.surface)
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct DetailRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundColor(AppTheme.muted)
                .frame(width: 20)
            Text(text)
                .font(.subheadline)
                .foregroundColor(AppTheme.body)
        }
    }
}

enum PriceRowStyle { case normal, strikethrough, bold }

struct PriceRow: View {
    let label: String
    let value: String
    var style: PriceRowStyle = .normal

    var body: some View {
        HStack {
            Text(label)
                .font(style == .bold ? .subheadline.bold() : .subheadline)
                .foregroundColor(style == .bold ? AppTheme.dark : AppTheme.muted)
            Spacer()
            Text(value)
                .font(style == .bold ? .subheadline.bold() : .subheadline)
                .foregroundColor(style == .bold ? AppTheme.dark : AppTheme.body)
                .strikethrough(style == .strikethrough)
        }
    }
}
