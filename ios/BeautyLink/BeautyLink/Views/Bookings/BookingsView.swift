import SwiftUI

struct BookingsView: View {
    @State private var bookings: [Booking] = []
    @State private var isLoading = true
    @State private var selectedTab = 0

    private var upcoming: [Booking] {
        bookings.filter { $0.status == .CONFIRMED || $0.status == .PENDING }
    }

    private var past: [Booking] {
        bookings.filter { $0.status == .COMPLETED || $0.status == .CANCELLED || $0.status == .NO_SHOW }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                VStack(spacing: 0) {
                    // Tab picker
                    Picker("", selection: $selectedTab) {
                        Text("Upcoming").tag(0)
                        Text("Past").tag(1)
                    }
                    .pickerStyle(.segmented)
                    .padding()

                    if isLoading {
                        Spacer()
                        ProgressView().tint(AppTheme.accent)
                        Spacer()
                    } else {
                        let items = selectedTab == 0 ? upcoming : past
                        if items.isEmpty {
                            Spacer()
                            EmptyStateView(
                                icon: selectedTab == 0 ? "calendar" : "clock",
                                title: selectedTab == 0 ? "No Upcoming Bookings" : "No Past Bookings",
                                message: selectedTab == 0
                                    ? "Your upcoming appointments will appear here."
                                    : "Your completed appointments will appear here."
                            )
                            Spacer()
                        } else {
                            ScrollView {
                                LazyVStack(spacing: 12) {
                                    ForEach(items) { booking in
                                        BookingCard(booking: booking)
                                    }
                                }
                                .padding()
                            }
                        }
                    }
                }
            }
            .navigationTitle("My Bookings")
            .task {
                await loadBookings()
            }
            .refreshable {
                await loadBookings()
            }
        }
    }

    private func loadBookings() async {
        isLoading = true
        do {
            bookings = try await APIService.shared.getBookings()
        } catch {
            bookings = []
        }
        isLoading = false
    }
}

struct BookingCard: View {
    let booking: Booking

    var statusColor: Color {
        switch booking.status {
        case .CONFIRMED, .PENDING: return AppTheme.success
        case .COMPLETED: return AppTheme.accent
        case .CANCELLED, .NO_SHOW: return AppTheme.error
        case .DISPUTED: return Color.orange
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(booking.listing?.serviceName ?? "Appointment")
                        .font(.headline)
                        .foregroundColor(AppTheme.dark)
                    if let provider = booking.listing?.provider {
                        Text(provider.businessName ?? "Professional")
                            .font(.subheadline)
                            .foregroundColor(AppTheme.muted)
                    }
                }
                Spacer()
                Text(booking.status.rawValue.capitalized)
                    .font(.caption.bold())
                    .foregroundColor(statusColor)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(statusColor.opacity(0.1))
                    .clipShape(Capsule())
            }

            Divider()

            HStack(spacing: 16) {
                if let listing = booking.listing {
                    Label(listing.appointmentDate, systemImage: "calendar")
                        .font(.caption)
                        .foregroundColor(AppTheme.muted)
                    Label(listing.startTime, systemImage: "clock")
                        .font(.caption)
                        .foregroundColor(AppTheme.muted)
                }
                Spacer()
                Text("$\(String(format: "%.2f", booking.totalCharged))")
                    .font(.subheadline.bold())
                    .foregroundColor(AppTheme.dark)
            }

            Text("Ref: \(booking.bookingReference)")
                .font(.caption2)
                .foregroundColor(AppTheme.muted)
        }
        .padding()
        .background(AppTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                .stroke(AppTheme.border, lineWidth: 1)
        )
    }
}
