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
                                    .font(AppTheme.serif(22))
                                    .foregroundColor(AppTheme.dark)
                                Text(user.email)
                                    .font(.subheadline)
                                    .foregroundColor(AppTheme.muted)
                            }
                            .padding(24)
                            .frame(maxWidth: .infinity)
                            .background(AppTheme.surface)
                            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
                            .overlay(
                                RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                                    .stroke(AppTheme.border, lineWidth: 1)
                            )
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
                        } else {
                            // Become a pro CTA
                            NavigationLink(destination: ProApplyView()) {
                                HStack(spacing: 12) {
                                    Image(systemName: "sparkles")
                                        .foregroundColor(.white)
                                        .frame(width: 40, height: 40)
                                        .background(AppTheme.accent)
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Become A Founding Stylist")
                                            .font(.subheadline.bold())
                                            .foregroundColor(AppTheme.dark)
                                        Text("Apply to list your services on BeautyLink")
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
                        VStack(spacing: 0) {
                            ProfileMenuItem(icon: "heart", title: "Saved Professionals")
                            Divider().padding(.leading, 52)
                            ProfileMenuItem(icon: "bell", title: "Notification Preferences")
                            Divider().padding(.leading, 52)
                            NavigationLink(destination: HelpCenterView()) {
                                ProfileMenuContent(icon: "questionmark.circle", title: "Help Center")
                            }
                            Divider().padding(.leading, 52)
                            NavigationLink(destination: ContactFormView()) {
                                ProfileMenuContent(icon: "envelope", title: "Contact Support")
                            }
                            Divider().padding(.leading, 52)
                            ProfileMenuItem(icon: "doc.text", title: "Terms of Service")
                            Divider().padding(.leading, 52)
                            ProfileMenuItem(icon: "lock.shield", title: "Privacy Policy")
                        }
                        .background(AppTheme.surface)
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
                        .overlay(
                            RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                                .stroke(AppTheme.border, lineWidth: 1)
                        )

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
                            .overlay(
                                RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                                    .stroke(AppTheme.border, lineWidth: 1)
                            )
                        }

                        // App version
                        Text("BeautyLink v1.0")
                            .font(.caption2)
                            .foregroundColor(AppTheme.muted)
                            .padding(.top, 8)
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
        ProfileMenuContent(icon: icon, title: title)
    }
}

struct ProfileMenuContent: View {
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
    @State private var showSignIn = false

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                VStack(spacing: 24) {
                    Spacer()

                    BrandLogo(size: 36)

                    VStack(spacing: 8) {
                        Text("Welcome To BeautyLink")
                            .font(AppTheme.serif(26))
                            .foregroundColor(AppTheme.dark)
                        Text("Create an account or sign in to book appointments, message professionals, and more.")
                            .font(.subheadline)
                            .foregroundColor(AppTheme.muted)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }

                    VStack(spacing: 12) {
                        PrimaryButton(title: "Sign Up") {
                            if let url = URL(string: "https://beautylinknetwork.com/signup") {
                                UIApplication.shared.open(url)
                            }
                        }
                        OutlineButton(title: "Log In") {
                            showSignIn = true
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
            .sheet(isPresented: $showSignIn) {
                SignInView()
            }
        }
    }
}

// MARK: - Help Center

struct HelpCenterView: View {
    let topics = [
        ("calendar.badge.checkmark", "Booking & Appointments", [
            "Browse available appointments on the Browse page",
            "Tap 'Book Now' and complete checkout with secure payment",
            "View your upcoming bookings in My Bookings",
            "Cancel for free up to 24 hours before the appointment",
        ]),
        ("creditcard", "Payments & Refunds", [
            "All payments are processed securely through Stripe",
            "A small service fee is added at checkout",
            "Full refund if you cancel more than 24 hours in advance",
            "Cancellations within 24 hours are non-refundable",
        ]),
        ("person.badge.shield.checkmark", "Trust & Safety", [
            "All professionals are reviewed and approved before listing",
            "License information is verified when provided",
            "Ratings and reviews help you choose with confidence",
            "Payment is held securely until after your appointment",
        ]),
    ]

    var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 12) {
                    ForEach(topics, id: \.1) { icon, title, items in
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(spacing: 10) {
                                Image(systemName: icon)
                                    .foregroundColor(AppTheme.accent)
                                Text(title)
                                    .font(.subheadline.bold())
                                    .foregroundColor(AppTheme.dark)
                            }
                            ForEach(items, id: \.self) { item in
                                HStack(alignment: .top, spacing: 8) {
                                    Circle()
                                        .fill(AppTheme.accentMuted)
                                        .frame(width: 5, height: 5)
                                        .padding(.top, 6)
                                    Text(item)
                                        .font(.subheadline)
                                        .foregroundColor(AppTheme.body)
                                }
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
                }
                .padding()
            }
        }
        .navigationTitle("Help Center")
    }
}

// MARK: - Contact Form

struct ContactFormView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var email = ""
    @State private var subject = ""
    @State private var message = ""
    @State private var category = "general"
    @State private var isSubmitting = false
    @State private var isSubmitted = false
    @State private var reference = ""
    @State private var error: String?

    let categories = [
        ("general", "General Inquiry"),
        ("booking", "Booking Help"),
        ("account", "Account Issue"),
        ("payments", "Payments & Refunds"),
        ("professional", "Professional Inquiry"),
        ("feedback", "Feedback"),
    ]

    var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            if isSubmitted {
                VStack(spacing: 16) {
                    Spacer()
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 50))
                        .foregroundColor(AppTheme.success)
                    Text("Message Sent")
                        .font(AppTheme.serif(24))
                        .foregroundColor(AppTheme.dark)
                    Text("We will get back to you within 24 hours.")
                        .font(.subheadline)
                        .foregroundColor(AppTheme.muted)
                    if !reference.isEmpty {
                        Text("Reference: #\(reference)")
                            .font(.caption.weight(.medium))
                            .foregroundColor(AppTheme.dark)
                    }
                    PrimaryButton(title: "Done", action: { dismiss() })
                        .padding(.horizontal, 40)
                    Spacer()
                }
            } else {
                Form {
                    Section("Your Info") {
                        TextField("Name", text: $name)
                        TextField("Email", text: $email)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                    }

                    Section("Category") {
                        Picker("Category", selection: $category) {
                            ForEach(categories, id: \.0) { value, label in
                                Text(label).tag(value)
                            }
                        }
                    }

                    Section("Message") {
                        TextField("Subject", text: $subject)
                        TextEditor(text: $message)
                            .frame(minHeight: 100)
                    }

                    if let error {
                        Section {
                            Text(error)
                                .foregroundColor(AppTheme.error)
                                .font(.caption)
                        }
                    }

                    Section {
                        PrimaryButton(title: "Send Message", action: submit, isLoading: isSubmitting)
                    }
                }
                .scrollContentBackground(.hidden)
            }
        }
        .navigationTitle("Contact Support")
    }

    private func submit() {
        guard !name.isEmpty, !email.isEmpty, !subject.isEmpty, message.count >= 10 else {
            error = "Please fill in all fields."
            return
        }
        isSubmitting = true
        error = nil

        Task {
            do {
                let result = try await APIService.shared.submitContactForm(
                    name: name, email: email, subject: subject, message: message, category: category
                )
                reference = result["reference"] ?? ""
                isSubmitted = true
            } catch {
                self.error = error.localizedDescription
            }
            isSubmitting = false
        }
    }
}
