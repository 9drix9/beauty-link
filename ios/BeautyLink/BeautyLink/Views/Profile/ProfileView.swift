import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var auth: AuthManager

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 16) {
                        // Profile header
                        if let user = auth.currentUser {
                            VStack(spacing: 12) {
                                AvatarView(name: user.displayName, url: user.profilePhotoUrl, size: 80)
                                Text(user.displayName)
                                    .font(.title2.bold())
                                    .foregroundColor(AppTheme.dark)
                                Text(user.email)
                                    .font(.subheadline)
                                    .foregroundColor(AppTheme.muted)
                            }
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(AppTheme.surface)
                            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
                        }

                        // Pro Dashboard Link
                        if auth.isPro {
                            NavigationLink(destination: ProDashboardView()) {
                                HStack(spacing: 12) {
                                    Image(systemName: "briefcase.fill")
                                        .foregroundColor(.white)
                                        .frame(width: 40, height: 40)
                                        .background(AppTheme.accent)
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Pro Dashboard")
                                            .font(.subheadline.bold())
                                            .foregroundColor(AppTheme.dark)
                                        Text("Manage your listings & bookings")
                                            .font(.caption)
                                            .foregroundColor(AppTheme.muted)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right")
                                        .foregroundColor(AppTheme.muted)
                                }
                                .padding()
                                .background(AppTheme.accentLight)
                                .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
                            }
                        }

                        // Menu Items
                        VStack(spacing: 2) {
                            ProfileMenuItem(icon: "heart", title: "Saved Professionals")
                            ProfileMenuItem(icon: "bell", title: "Notification Preferences")
                            ProfileMenuItem(icon: "questionmark.circle", title: "Help Center")
                            ProfileMenuItem(icon: "doc.text", title: "Terms of Service")
                            ProfileMenuItem(icon: "lock.shield", title: "Privacy Policy")
                        }
                        .background(AppTheme.surface)
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))

                        // Sign Out
                        Button {
                            auth.signOut()
                        } label: {
                            HStack {
                                Image(systemName: "rectangle.portrait.and.arrow.right")
                                Text("Sign Out")
                            }
                            .font(.subheadline.weight(.medium))
                            .foregroundColor(AppTheme.error)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(AppTheme.surface)
                            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Profile")
        }
    }
}

struct ProfileMenuItem: View {
    let icon: String
    let title: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(AppTheme.accent)
                .frame(width: 24)
            Text(title)
                .font(.subheadline)
                .foregroundColor(AppTheme.dark)
            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(AppTheme.muted)
        }
        .padding()
    }
}

// MARK: - Auth Prompt (Not Signed In)

struct AuthPromptView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                VStack(spacing: 24) {
                    Spacer()

                    VStack(spacing: 8) {
                        Image(systemName: "person.crop.circle")
                            .font(.system(size: 60))
                            .foregroundColor(AppTheme.accent.opacity(0.5))
                        Text("Sign In to BeautyLink")
                            .font(.title2.bold())
                            .foregroundColor(AppTheme.dark)
                        Text("Create an account or sign in to book appointments, message professionals, and more.")
                            .font(.subheadline)
                            .foregroundColor(AppTheme.muted)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }

                    VStack(spacing: 12) {
                        PrimaryButton(title: "Sign Up") {
                            // Open Clerk signup in browser
                            if let url = URL(string: "https://beautylinknetwork.com/signup") {
                                UIApplication.shared.open(url)
                            }
                        }
                        OutlineButton(title: "Log In") {
                            if let url = URL(string: "https://beautylinknetwork.com/login") {
                                UIApplication.shared.open(url)
                            }
                        }
                    }
                    .padding(.horizontal, 32)

                    Spacer()

                    // Waitlist
                    VStack(spacing: 8) {
                        Text("Not ready to sign up?")
                            .font(.subheadline)
                            .foregroundColor(AppTheme.muted)
                        WaitlistFormView(source: "ios-auth-prompt")
                    }
                    .padding()
                }
            }
            .navigationTitle("Account")
        }
    }
}
