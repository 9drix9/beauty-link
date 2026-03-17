import SwiftUI

struct ProSettingsView: View {
    @State private var businessName = ""
    @State private var bio = ""
    @State private var city = ""
    @State private var instagramUrl = ""
    @State private var isSaving = false
    @State private var showSaved = false

    var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            Form {
                Section("Business Profile") {
                    TextField("Business Name", text: $businessName)
                    VStack(alignment: .leading) {
                        Text("Bio")
                            .font(.caption)
                            .foregroundColor(AppTheme.muted)
                        TextEditor(text: $bio)
                            .frame(minHeight: 80)
                    }
                }

                Section("Location") {
                    TextField("City", text: $city)
                }

                Section("Social") {
                    TextField("Instagram", text: $instagramUrl)
                        .autocapitalization(.none)
                }

                Section("Payment") {
                    HStack {
                        Image(systemName: "creditcard")
                            .foregroundColor(AppTheme.accent)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Stripe Payouts")
                                .font(.subheadline.weight(.medium))
                            Text("Manage your payout settings on the web dashboard.")
                                .font(.caption)
                                .foregroundColor(AppTheme.muted)
                        }
                    }
                }

                Section {
                    PrimaryButton(title: "Save Changes", action: save, isLoading: isSaving)
                }
            }
            .scrollContentBackground(.hidden)

            if showSaved {
                VStack {
                    Spacer()
                    HStack(spacing: 8) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(AppTheme.success)
                        Text("Changes saved")
                            .font(.subheadline.weight(.medium))
                            .foregroundColor(AppTheme.dark)
                    }
                    .padding()
                    .background(.ultraThinMaterial)
                    .clipShape(Capsule())
                    .padding(.bottom, 32)
                }
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .navigationTitle("Settings")
    }

    private func save() {
        isSaving = true
        // In a full implementation, this would call the API
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            isSaving = false
            withAnimation {
                showSaved = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                withAnimation {
                    showSaved = false
                }
            }
        }
    }
}
