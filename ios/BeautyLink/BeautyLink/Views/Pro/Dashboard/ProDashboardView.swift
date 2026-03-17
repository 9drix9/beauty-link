import SwiftUI

struct ProDashboardView: View {
    @State private var listings: [Listing] = []
    @State private var earnings: EarningsSummary?
    @State private var isLoading = true

    var activeListings: [Listing] {
        listings.filter { $0.status == .ACTIVE }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                if isLoading {
                    ProgressView().tint(AppTheme.accent)
                } else {
                    ScrollView {
                        VStack(spacing: 16) {
                            // Stats Cards
                            HStack(spacing: 12) {
                                StatCard(
                                    title: "Total Earned",
                                    value: "$\(String(format: "%.0f", earnings?.totalEarned ?? 0))",
                                    icon: "dollarsign.circle"
                                )
                                StatCard(
                                    title: "Bookings",
                                    value: "\(earnings?.completedBookings ?? 0)",
                                    icon: "calendar.badge.checkmark"
                                )
                            }
                            HStack(spacing: 12) {
                                StatCard(
                                    title: "Active Listings",
                                    value: "\(activeListings.count)",
                                    icon: "list.bullet"
                                )
                                StatCard(
                                    title: "Pending Payout",
                                    value: "$\(String(format: "%.0f", earnings?.pendingPayout ?? 0))",
                                    icon: "banknote"
                                )
                            }

                            // Quick Actions
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Quick Actions")
                                    .font(.headline)
                                    .foregroundColor(AppTheme.dark)

                                NavigationLink(destination: CreateListingView()) {
                                    QuickAction(icon: "plus.circle.fill", title: "Create New Listing", color: AppTheme.accent)
                                }

                                NavigationLink(destination: ProListingsView()) {
                                    QuickAction(icon: "list.bullet.rectangle", title: "Manage Listings", color: AppTheme.cta)
                                }

                                NavigationLink(destination: ProEarningsView()) {
                                    QuickAction(icon: "chart.bar.fill", title: "View Earnings", color: AppTheme.success)
                                }
                            }
                            .padding()
                            .background(AppTheme.surface)
                            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))

                            // Active Listings
                            if !activeListings.isEmpty {
                                VStack(alignment: .leading, spacing: 12) {
                                    SectionHeader(title: "Active Listings")
                                    ForEach(activeListings.prefix(3)) { listing in
                                        ProListingRow(listing: listing)
                                    }
                                }
                                .padding()
                                .background(AppTheme.surface)
                                .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Dashboard")
            .task { await loadData() }
            .refreshable { await loadData() }
        }
    }

    private func loadData() async {
        isLoading = true
        async let listingsTask = APIService.shared.getProListings()
        async let earningsTask = APIService.shared.getEarnings()
        do {
            listings = try await listingsTask
            earnings = try await earningsTask
        } catch {}
        isLoading = false
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(AppTheme.accent)
            Text(value)
                .font(.title2.bold())
                .foregroundColor(AppTheme.dark)
            Text(title)
                .font(.caption)
                .foregroundColor(AppTheme.muted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(AppTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                .stroke(AppTheme.border, lineWidth: 1)
        )
    }
}

struct QuickAction: View {
    let icon: String
    let title: String
    let color: Color

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(color)
                .frame(width: 24)
            Text(title)
                .font(.subheadline.weight(.medium))
                .foregroundColor(AppTheme.dark)
            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(AppTheme.muted)
        }
        .padding(.vertical, 4)
    }
}

struct ProListingRow: View {
    let listing: Listing

    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 8)
                .fill(AppTheme.blush)
                .frame(width: 50, height: 50)
                .overlay(
                    Text(String(listing.serviceName.prefix(1)))
                        .font(.headline)
                        .foregroundColor(AppTheme.accent)
                )

            VStack(alignment: .leading, spacing: 2) {
                Text(listing.serviceName)
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(AppTheme.dark)
                Text("\(listing.appointmentDate) \u{2022} \(listing.startTime)")
                    .font(.caption)
                    .foregroundColor(AppTheme.muted)
            }
            Spacer()
            Text("$\(Int(listing.discountedPrice))")
                .font(.subheadline.bold())
                .foregroundColor(AppTheme.dark)
        }
    }
}
