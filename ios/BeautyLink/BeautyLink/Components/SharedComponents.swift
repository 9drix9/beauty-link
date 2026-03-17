import SwiftUI

// MARK: - Price Display

struct PriceDisplay: View {
    let original: Double
    let discounted: Double

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 6) {
            Text("$\(Int(original))")
                .font(.caption)
                .foregroundColor(AppTheme.muted)
                .strikethrough()
            Text("$\(Int(discounted))")
                .font(.title3.bold())
                .foregroundColor(AppTheme.dark)
        }
    }
}

// MARK: - Savings Badge

struct SavingsBadge: View {
    let percent: Int

    var body: some View {
        Text("Save \(percent)%")
            .font(.caption2.bold())
            .foregroundColor(.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(AppTheme.cta)
            .clipShape(Capsule())
    }
}

// MARK: - Preview Badge

struct PreviewBadge: View {
    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "info.circle.fill")
                .font(.system(size: 10))
            Text("Preview Appointment")
                .font(.system(size: 10, weight: .semibold))
        }
        .foregroundColor(Color(hex: "92400E"))
        .padding(.horizontal, 8)
        .padding(.vertical, 3)
        .background(Color(hex: "FFFBEB"))
        .overlay(
            Capsule().stroke(Color(hex: "FDE68A").opacity(0.6), lineWidth: 1)
        )
        .clipShape(Capsule())
    }
}

// MARK: - Category Pill

struct CategoryPill: View {
    let title: String
    let isActive: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline.weight(.medium))
                .foregroundColor(isActive ? .white : AppTheme.body)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isActive ? AppTheme.dark : AppTheme.background)
                .clipShape(Capsule())
        }
    }
}

// MARK: - Primary Button

struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isLoading: Bool = false
    var fullWidth: Bool = true

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if isLoading {
                    ProgressView()
                        .tint(.white)
                        .scaleEffect(0.8)
                }
                Text(title)
                    .font(.subheadline.bold())
            }
            .foregroundColor(.white)
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .padding(.vertical, 14)
            .padding(.horizontal, 24)
            .background(AppTheme.dark)
            .clipShape(Capsule())
        }
        .disabled(isLoading)
    }
}

// MARK: - Outline Button

struct OutlineButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline.bold())
                .foregroundColor(AppTheme.body)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .padding(.horizontal, 24)
                .background(AppTheme.surface)
                .overlay(
                    Capsule().stroke(AppTheme.border, lineWidth: 1)
                )
                .clipShape(Capsule())
        }
    }
}

// MARK: - Avatar View

struct AvatarView: View {
    let name: String
    let url: String?
    var size: CGFloat = 40

    var body: some View {
        if let url, let imageURL = URL(string: url) {
            AsyncImage(url: imageURL) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                initialsView
            }
            .frame(width: size, height: size)
            .clipShape(Circle())
        } else {
            initialsView
        }
    }

    private var initialsView: some View {
        Circle()
            .fill(AppTheme.accentLight)
            .frame(width: size, height: size)
            .overlay(
                Text(String(name.prefix(1)).uppercased())
                    .font(.system(size: size * 0.4, weight: .bold))
                    .foregroundColor(AppTheme.accent)
            )
    }
}

// MARK: - Rating Stars

struct RatingView: View {
    let rating: Double
    let count: Int?

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "star.fill")
                .font(.caption2)
                .foregroundColor(AppTheme.cta)
            Text(String(format: "%.1f", rating))
                .font(.caption.weight(.medium))
                .foregroundColor(AppTheme.body)
            if let count {
                Text("(\(count))")
                    .font(.caption)
                    .foregroundColor(AppTheme.muted)
            }
        }
    }
}

// MARK: - Empty State

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 40))
                .foregroundColor(AppTheme.muted.opacity(0.5))
            Text(title)
                .font(.headline)
                .foregroundColor(AppTheme.dark)
            Text(message)
                .font(.subheadline)
                .foregroundColor(AppTheme.muted)
                .multilineTextAlignment(.center)
        }
        .padding(40)
    }
}

// MARK: - Section Header

struct SectionHeader: View {
    let title: String
    var action: (() -> Void)?
    var actionLabel: String = "See All"

    var body: some View {
        HStack {
            Text(title)
                .font(.title3.bold())
                .foregroundColor(AppTheme.dark)
            Spacer()
            if let action {
                Button(actionLabel, action: action)
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(AppTheme.accent)
            }
        }
    }
}

// MARK: - Waitlist Form

struct WaitlistFormView: View {
    let source: String
    @State private var email = ""
    @State private var isSubmitting = false
    @State private var isSubmitted = false
    @State private var errorMessage: String?

    var body: some View {
        if isSubmitted {
            HStack(spacing: 8) {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(AppTheme.success)
                Text("You're on the list. We'll be in touch.")
                    .font(.subheadline)
                    .foregroundColor(AppTheme.dark)
            }
            .padding()
            .background(AppTheme.surface)
            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
        } else {
            VStack(spacing: 12) {
                HStack(spacing: 8) {
                    TextField("Enter your email", text: $email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .padding(12)
                        .background(AppTheme.background)
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                        .overlay(
                            RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                                .stroke(AppTheme.border, lineWidth: 1)
                        )

                    Button {
                        submit()
                    } label: {
                        if isSubmitting {
                            ProgressView().tint(.white)
                        } else {
                            Text("Join")
                                .font(.subheadline.bold())
                        }
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(AppTheme.dark)
                    .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                    .disabled(isSubmitting || email.isEmpty)
                }

                if let errorMessage {
                    Text(errorMessage)
                        .font(.caption)
                        .foregroundColor(AppTheme.error)
                }
            }
        }
    }

    private func submit() {
        guard !email.isEmpty, email.contains("@") else {
            errorMessage = "Please enter a valid email address."
            return
        }
        isSubmitting = true
        errorMessage = nil

        Task {
            do {
                _ = try await APIService.shared.joinWaitlist(email: email, source: source)
                isSubmitted = true
            } catch {
                errorMessage = error.localizedDescription
            }
            isSubmitting = false
        }
    }
}
