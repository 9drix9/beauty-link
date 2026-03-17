import SwiftUI

struct ReviewView: View {
    let booking: Booking
    @Environment(\.dismiss) private var dismiss
    @State private var rating: Int = 5
    @State private var comment = ""
    @State private var isSubmitting = false
    @State private var isSubmitted = false
    @State private var error: String?

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                if isSubmitted {
                    successView
                } else {
                    ScrollView {
                        VStack(spacing: 24) {
                            // Service info
                            VStack(spacing: 8) {
                                Text(booking.listing?.serviceName ?? "Your Appointment")
                                    .font(AppTheme.serif(22))
                                    .foregroundColor(AppTheme.dark)
                                if let provider = booking.listing?.provider {
                                    Text("with \(provider.businessName ?? "Professional")")
                                        .font(.subheadline)
                                        .foregroundColor(AppTheme.muted)
                                }
                            }
                            .padding(.top, 8)

                            // Star rating
                            VStack(spacing: 10) {
                                Text("How Was Your Experience?")
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundColor(AppTheme.dark)

                                HStack(spacing: 8) {
                                    ForEach(1...5, id: \.self) { star in
                                        Button {
                                            withAnimation(.spring(response: 0.2)) {
                                                rating = star
                                            }
                                        } label: {
                                            Image(systemName: star <= rating ? "star.fill" : "star")
                                                .font(.system(size: 36))
                                                .foregroundColor(star <= rating ? AppTheme.accent : AppTheme.border)
                                        }
                                    }
                                }

                                Text(ratingLabel)
                                    .font(.caption)
                                    .foregroundColor(AppTheme.muted)
                            }
                            .padding()
                            .background(AppTheme.surface)
                            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))

                            // Comment
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Leave a Comment (Optional)")
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundColor(AppTheme.dark)

                                TextEditor(text: $comment)
                                    .frame(minHeight: 120)
                                    .padding(8)
                                    .background(AppTheme.surface)
                                    .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                                            .stroke(AppTheme.border, lineWidth: 1)
                                    )

                                Text("\(comment.count)/500")
                                    .font(.caption2)
                                    .foregroundColor(AppTheme.muted)
                                    .frame(maxWidth: .infinity, alignment: .trailing)
                            }

                            if let error {
                                Text(error)
                                    .font(.caption)
                                    .foregroundColor(AppTheme.error)
                            }

                            PrimaryButton(title: "Submit Review", action: submit, isLoading: isSubmitting)
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Leave a Review")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cancel") { dismiss() }
                        .foregroundColor(AppTheme.muted)
                }
            }
        }
    }

    private var ratingLabel: String {
        switch rating {
        case 1: return "Poor"
        case 2: return "Fair"
        case 3: return "Good"
        case 4: return "Great"
        case 5: return "Excellent"
        default: return ""
        }
    }

    private var successView: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "heart.circle.fill")
                .font(.system(size: 60))
                .foregroundColor(AppTheme.accent)
            Text("Thank You!")
                .font(AppTheme.serif(28))
                .foregroundColor(AppTheme.dark)
            Text("Your review helps other clients and supports this professional.")
                .font(.subheadline)
                .foregroundColor(AppTheme.muted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            PrimaryButton(title: "Done", action: { dismiss() })
                .padding(.horizontal, 32)
            Spacer()
        }
    }

    private func submit() {
        isSubmitting = true
        error = nil

        Task {
            do {
                _ = try await APIService.shared.submitReview(
                    bookingId: booking.id,
                    rating: rating,
                    comment: comment.isEmpty ? nil : comment
                )
                isSubmitted = true
            } catch {
                self.error = error.localizedDescription
            }
            isSubmitting = false
        }
    }
}
