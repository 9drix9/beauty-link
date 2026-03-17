import SwiftUI

struct ProEarningsView: View {
    @State private var earnings: EarningsSummary?
    @State private var isLoading = true

    var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            if isLoading {
                ProgressView().tint(AppTheme.accent)
            } else if let earnings {
                ScrollView {
                    VStack(spacing: 16) {
                        // Total Earned
                        VStack(spacing: 8) {
                            Text("Total Earned")
                                .font(.caption.weight(.semibold))
                                .foregroundColor(AppTheme.accent)
                                .textCase(.uppercase)
                                .tracking(1)
                            Text("$\(String(format: "%.2f", earnings.totalEarned))")
                                .font(.system(size: 42, weight: .bold))
                                .foregroundColor(AppTheme.dark)
                            Text("\(earnings.completedBookings) completed bookings")
                                .font(.subheadline)
                                .foregroundColor(AppTheme.muted)
                        }
                        .padding(.vertical, 24)
                        .frame(maxWidth: .infinity)
                        .background(
                            LinearGradient(
                                colors: [AppTheme.accentLight, AppTheme.surface],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))

                        // Breakdown
                        VStack(spacing: 12) {
                            EarningsRow(label: "Pending Payout", value: "$\(String(format: "%.2f", earnings.pendingPayout))", color: AppTheme.cta)
                            Divider()
                            EarningsRow(label: "Total Bookings", value: "\(earnings.totalBookings)", color: AppTheme.dark)
                            Divider()
                            EarningsRow(label: "Completed", value: "\(earnings.completedBookings)", color: AppTheme.success)
                        }
                        .padding()
                        .background(AppTheme.surface)
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))

                        // Info
                        VStack(spacing: 8) {
                            Image(systemName: "info.circle")
                                .foregroundColor(AppTheme.accent)
                            Text("Payouts are sent 24 hours after the appointment via Stripe. You keep 100% of your listed price.")
                                .font(.caption)
                                .foregroundColor(AppTheme.muted)
                                .multilineTextAlignment(.center)
                        }
                        .padding()
                    }
                    .padding()
                }
            } else {
                EmptyStateView(
                    icon: "chart.bar",
                    title: "No Earnings Yet",
                    message: "Your earnings will appear here once you complete bookings."
                )
            }
        }
        .navigationTitle("Earnings")
        .task { await loadEarnings() }
        .refreshable { await loadEarnings() }
    }

    private func loadEarnings() async {
        isLoading = true
        do {
            earnings = try await APIService.shared.getEarnings()
        } catch {}
        isLoading = false
    }
}

struct EarningsRow: View {
    let label: String
    let value: String
    let color: Color

    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundColor(AppTheme.muted)
            Spacer()
            Text(value)
                .font(.subheadline.bold())
                .foregroundColor(color)
        }
    }
}
