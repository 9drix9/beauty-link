import SwiftUI

struct ProApplyView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var step = 1
    @State private var isSubmitting = false
    @State private var isSubmitted = false
    @State private var error: String?

    // Form data
    @State private var businessName = ""
    @State private var bio = ""
    @State private var selectedCategories: Set<String> = []
    @State private var yearsExperience = ""
    @State private var workSetting = ""
    @State private var city = ""
    @State private var state = "CA"
    @State private var instagramUrl = ""
    @State private var pricingRange = ""
    @State private var agreedToTerms = false

    private let totalSteps = 5
    private let categories = ["Hair", "Nails", "Makeup", "Lashes", "Brows", "Skincare", "Barbering", "Facials"]
    private let experienceOptions = ["Under 1 year", "1 to 3 years", "3 to 5 years", "5 to 10 years", "10+ years"]
    private let workSettings = ["Salon/Studio", "Home studio", "Mobile/Travel", "Rent a chair"]
    private let pricingRanges = ["Under $50", "$50 to $100", "$100 to $200", "$200+"]

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                if isSubmitted {
                    successView
                } else {
                    VStack(spacing: 0) {
                        // Progress bar
                        progressBar

                        ScrollView {
                            VStack(spacing: 20) {
                                switch step {
                                case 1: step1BasicInfo
                                case 2: step2Services
                                case 3: step3Experience
                                case 4: step4Location
                                case 5: step5Review
                                default: EmptyView()
                                }

                                if let error {
                                    Text(error)
                                        .font(.caption)
                                        .foregroundColor(AppTheme.error)
                                }
                            }
                            .padding()
                        }

                        // Navigation buttons
                        navigationButtons
                    }
                }
            }
            .navigationTitle("Apply As A Professional")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                        .foregroundColor(AppTheme.muted)
                }
            }
        }
    }

    // MARK: - Progress Bar

    private var progressBar: some View {
        VStack(spacing: 6) {
            HStack {
                Text("Step \(step) of \(totalSteps)")
                    .font(.caption.weight(.medium))
                    .foregroundColor(AppTheme.dark)
                Spacer()
                Text(stepLabel)
                    .font(.caption)
                    .foregroundColor(AppTheme.muted)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(AppTheme.border).frame(height: 6)
                    Capsule().fill(AppTheme.accent)
                        .frame(width: geo.size.width * CGFloat(step) / CGFloat(totalSteps), height: 6)
                        .animation(.easeInOut, value: step)
                }
            }
            .frame(height: 6)
        }
        .padding()
        .background(AppTheme.surface)
    }

    private var stepLabel: String {
        switch step {
        case 1: return "Basic Info"
        case 2: return "Services"
        case 3: return "Experience"
        case 4: return "Location"
        case 5: return "Review"
        default: return ""
        }
    }

    // MARK: - Steps

    private var step1BasicInfo: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionTitle("Tell Us About Yourself")

            FormField(label: "Business or Display Name", icon: "person") {
                TextField("e.g. Hair by Maria", text: $businessName)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text("Bio")
                    .font(.caption.weight(.medium))
                    .foregroundColor(AppTheme.dark)
                TextEditor(text: $bio)
                    .frame(minHeight: 100)
                    .padding(8)
                    .background(AppTheme.surface)
                    .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                    .overlay(
                        RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                            .stroke(AppTheme.border, lineWidth: 1)
                    )
                Text("\(bio.count)/500 (min 50)")
                    .font(.caption2)
                    .foregroundColor(bio.count >= 50 ? AppTheme.success : AppTheme.muted)
                    .frame(maxWidth: .infinity, alignment: .trailing)
            }

            FormField(label: "Instagram (Optional)", icon: "camera") {
                TextField("@yourusername", text: $instagramUrl)
                    .autocapitalization(.none)
            }
        }
    }

    private var step2Services: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionTitle("What Services Do You Offer?")

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                ForEach(categories, id: \.self) { cat in
                    let selected = selectedCategories.contains(cat)
                    Button {
                        if selected { selectedCategories.remove(cat) }
                        else { selectedCategories.insert(cat) }
                    } label: {
                        HStack(spacing: 8) {
                            Image(systemName: selected ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(selected ? AppTheme.accent : AppTheme.border)
                            Text(cat)
                                .font(.subheadline.weight(.medium))
                                .foregroundColor(selected ? AppTheme.accent : AppTheme.body)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(selected ? AppTheme.accentLight : AppTheme.surface)
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                        .overlay(
                            RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                                .stroke(selected ? AppTheme.accent.opacity(0.3) : AppTheme.border, lineWidth: 1)
                        )
                    }
                }
            }
        }
    }

    private var step3Experience: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionTitle("Your Experience")

            OptionPicker(label: "Years of Experience", options: experienceOptions, selection: $yearsExperience)
            OptionPicker(label: "Work Setting", options: workSettings, selection: $workSetting)
            OptionPicker(label: "Typical Price Range", options: pricingRanges, selection: $pricingRange)
        }
    }

    private var step4Location: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionTitle("Where Are You Based?")

            FormField(label: "City", icon: "mappin") {
                TextField("e.g. Los Angeles", text: $city)
            }

            FormField(label: "State", icon: "map") {
                TextField("CA", text: $state)
                    .autocapitalization(.allCharacters)
            }
        }
    }

    private var step5Review: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionTitle("Review Your Application")

            ReviewRow(label: "Name", value: businessName)
            ReviewRow(label: "Services", value: selectedCategories.joined(separator: ", "))
            ReviewRow(label: "Experience", value: yearsExperience)
            ReviewRow(label: "Work Setting", value: workSetting)
            ReviewRow(label: "Location", value: "\(city), \(state)")
            if !instagramUrl.isEmpty {
                ReviewRow(label: "Instagram", value: instagramUrl)
            }

            Toggle(isOn: $agreedToTerms) {
                Text("I agree to BeautyLink's Terms of Service and Privacy Policy.")
                    .font(.caption)
                    .foregroundColor(AppTheme.body)
            }
            .tint(AppTheme.accent)
        }
    }

    // MARK: - Navigation

    private var navigationButtons: some View {
        HStack {
            if step > 1 {
                OutlineButton(title: "Back") {
                    withAnimation { step -= 1 }
                    error = nil
                }
            }
            Spacer()
            if step < totalSteps {
                PrimaryButton(title: "Next", action: {
                    if validateStep() {
                        withAnimation { step += 1 }
                        error = nil
                    }
                }, fullWidth: false)
            } else {
                PrimaryButton(title: "Submit Application", action: submitApplication, isLoading: isSubmitting, fullWidth: false)
            }
        }
        .padding()
        .background(AppTheme.surface)
    }

    // MARK: - Validation

    private func validateStep() -> Bool {
        switch step {
        case 1:
            guard !businessName.trimmingCharacters(in: .whitespaces).isEmpty else {
                error = "Please enter your business or display name."
                return false
            }
            guard bio.count >= 50 else {
                error = "Bio must be at least 50 characters."
                return false
            }
        case 2:
            guard !selectedCategories.isEmpty else {
                error = "Please select at least one service category."
                return false
            }
        case 3:
            guard !yearsExperience.isEmpty, !workSetting.isEmpty else {
                error = "Please select your experience and work setting."
                return false
            }
        case 4:
            guard !city.trimmingCharacters(in: .whitespaces).isEmpty else {
                error = "Please enter your city."
                return false
            }
        case 5:
            guard agreedToTerms else {
                error = "You must agree to the terms to continue."
                return false
            }
        default: break
        }
        return true
    }

    // MARK: - Submit

    private func submitApplication() {
        guard validateStep() else { return }
        isSubmitting = true
        error = nil

        let application = ProApplication(
            businessName: businessName.trimmingCharacters(in: .whitespaces),
            bio: bio.trimmingCharacters(in: .whitespaces),
            serviceCategories: Array(selectedCategories),
            yearsExperience: yearsExperience,
            workSetting: workSetting,
            licenseType: nil,
            licenseNumber: nil,
            licenseState: nil,
            instagramUrl: instagramUrl.isEmpty ? nil : instagramUrl,
            websiteUrl: nil,
            portfolioPhotos: [],
            city: city.trimmingCharacters(in: .whitespaces),
            state: state.uppercased(),
            serviceRadius: nil,
            pricingRange: pricingRange.isEmpty ? nil : pricingRange,
            availabilityType: nil,
            currentPlatform: nil,
            clientVolume: nil,
            isStudent: false,
            school: nil
        )

        Task {
            do {
                _ = try await APIService.shared.submitApplication(application)
                isSubmitted = true
            } catch {
                self.error = error.localizedDescription
            }
            isSubmitting = false
        }
    }

    // MARK: - Success

    private var successView: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 60))
                .foregroundColor(AppTheme.success)
            Text("Application Submitted!")
                .font(AppTheme.serif(28))
                .foregroundColor(AppTheme.dark)
            Text("Thank you for applying to BeautyLink. We will review your application and get back to you within 48 hours.")
                .font(.subheadline)
                .foregroundColor(AppTheme.muted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            PrimaryButton(title: "Done", action: { dismiss() })
                .padding(.horizontal, 32)
            Spacer()
        }
    }
}

// MARK: - Helpers

struct SectionTitle: View {
    let text: String
    init(_ text: String) { self.text = text }

    var body: some View {
        Text(text)
            .font(AppTheme.serif(20))
            .foregroundColor(AppTheme.dark)
    }
}

struct OptionPicker: View {
    let label: String
    let options: [String]
    @Binding var selection: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.caption.weight(.medium))
                .foregroundColor(AppTheme.dark)
            ForEach(options, id: \.self) { option in
                Button {
                    selection = option
                } label: {
                    HStack {
                        Text(option)
                            .font(.subheadline)
                            .foregroundColor(selection == option ? AppTheme.accent : AppTheme.body)
                        Spacer()
                        if selection == option {
                            Image(systemName: "checkmark")
                                .foregroundColor(AppTheme.accent)
                                .font(.caption)
                        }
                    }
                    .padding(12)
                    .background(selection == option ? AppTheme.accentLight : AppTheme.surface)
                    .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                    .overlay(
                        RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                            .stroke(selection == option ? AppTheme.accent.opacity(0.3) : AppTheme.border, lineWidth: 1)
                    )
                }
            }
        }
    }
}

struct ReviewRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundColor(AppTheme.muted)
            Spacer()
            Text(value)
                .font(.subheadline.weight(.medium))
                .foregroundColor(AppTheme.dark)
                .multilineTextAlignment(.trailing)
        }
        .padding(12)
        .background(AppTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
    }
}
