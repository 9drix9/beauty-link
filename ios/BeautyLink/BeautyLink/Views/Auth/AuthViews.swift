import SwiftUI

struct SignInView: View {
    @EnvironmentObject var auth: AuthManager
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var error: String?

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        // Logo
                        BrandLogo(size: 32)
                            .padding(.top, 40)

                        VStack(spacing: 4) {
                            Text("Welcome Back")
                                .font(AppTheme.serif(28))
                                .foregroundColor(AppTheme.dark)
                            Text("Sign in to your BeautyLink account")
                                .font(.subheadline)
                                .foregroundColor(AppTheme.muted)
                        }

                        VStack(spacing: 16) {
                            FormField(label: "Email", icon: "envelope") {
                                TextField("you@example.com", text: $email)
                                    .textContentType(.emailAddress)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                            }

                            FormField(label: "Password", icon: "lock") {
                                SecureField("Password", text: $password)
                                    .textContentType(.password)
                            }
                        }
                        .padding(.horizontal)

                        if let error {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(AppTheme.error)
                                .padding(.horizontal)
                        }

                        PrimaryButton(title: "Sign In", action: signIn, isLoading: isLoading)
                            .padding(.horizontal)

                        HStack {
                            Text("Don't have an account?")
                                .font(.subheadline)
                                .foregroundColor(AppTheme.muted)
                            NavigationLink("Sign Up") {
                                SignUpView()
                            }
                            .font(.subheadline.weight(.semibold))
                            .foregroundColor(AppTheme.accent)
                        }

                        Spacer()
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cancel") { dismiss() }
                        .foregroundColor(AppTheme.muted)
                }
            }
        }
    }

    private func signIn() {
        guard !email.isEmpty, !password.isEmpty else {
            error = "Please enter your email and password."
            return
        }
        isLoading = true
        error = nil

        // Open web auth as fallback (Clerk doesn't have native iOS SDK yet)
        if let url = URL(string: "https://beautylinknetwork.com/login") {
            UIApplication.shared.open(url)
        }
        isLoading = false
    }
}

struct SignUpView: View {
    @EnvironmentObject var auth: AuthManager
    @Environment(\.dismiss) private var dismiss
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var error: String?

    var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    VStack(spacing: 4) {
                        Text("Create Account")
                            .font(AppTheme.serif(28))
                            .foregroundColor(AppTheme.dark)
                        Text("Join BeautyLink to discover beauty deals")
                            .font(.subheadline)
                            .foregroundColor(AppTheme.muted)
                    }
                    .padding(.top, 20)

                    VStack(spacing: 16) {
                        HStack(spacing: 12) {
                            FormField(label: "First Name", icon: "person") {
                                TextField("First", text: $firstName)
                                    .textContentType(.givenName)
                            }
                            FormField(label: "Last Name", icon: "person") {
                                TextField("Last", text: $lastName)
                                    .textContentType(.familyName)
                            }
                        }

                        FormField(label: "Email", icon: "envelope") {
                            TextField("you@example.com", text: $email)
                                .textContentType(.emailAddress)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                        }

                        FormField(label: "Password", icon: "lock") {
                            SecureField("Create a password", text: $password)
                                .textContentType(.newPassword)
                        }
                    }
                    .padding(.horizontal)

                    if let error {
                        Text(error)
                            .font(.caption)
                            .foregroundColor(AppTheme.error)
                            .padding(.horizontal)
                    }

                    PrimaryButton(title: "Create Account", action: signUp, isLoading: isLoading)
                        .padding(.horizontal)

                    Text("By signing up, you agree to our Terms of Service and Privacy Policy.")
                        .font(.caption)
                        .foregroundColor(AppTheme.muted)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                }
            }
        }
        .navigationTitle("Sign Up")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func signUp() {
        guard !firstName.isEmpty, !email.isEmpty, !password.isEmpty else {
            error = "Please fill in all required fields."
            return
        }
        isLoading = true
        error = nil

        if let url = URL(string: "https://beautylinknetwork.com/signup") {
            UIApplication.shared.open(url)
        }
        isLoading = false
    }
}

// MARK: - Form Field

struct FormField<Content: View>: View {
    let label: String
    let icon: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.caption.weight(.medium))
                .foregroundColor(AppTheme.dark)
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .font(.subheadline)
                    .foregroundColor(AppTheme.muted)
                    .frame(width: 20)
                content
                    .font(.subheadline)
            }
            .padding(12)
            .background(AppTheme.surface)
            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
            .overlay(
                RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                    .stroke(AppTheme.border, lineWidth: 1)
            )
        }
    }
}
