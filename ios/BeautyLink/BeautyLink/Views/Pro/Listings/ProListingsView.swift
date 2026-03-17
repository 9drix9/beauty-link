import SwiftUI

struct ProListingsView: View {
    @State private var listings: [Listing] = []
    @State private var isLoading = true

    var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            if isLoading {
                ProgressView().tint(AppTheme.accent)
            } else if listings.isEmpty {
                EmptyStateView(
                    icon: "list.bullet.rectangle",
                    title: "No Listings Yet",
                    message: "Create your first listing to start getting booked."
                )
            } else {
                List {
                    ForEach(listings) { listing in
                        ProListingRow(listing: listing)
                            .listRowBackground(AppTheme.surface)
                    }
                    .onDelete(perform: deleteListing)
                }
                .listStyle(.plain)
            }
        }
        .navigationTitle("My Listings")
        .toolbar {
            NavigationLink(destination: CreateListingView()) {
                Image(systemName: "plus")
                    .foregroundColor(AppTheme.accent)
            }
        }
        .task { await loadListings() }
        .refreshable { await loadListings() }
    }

    private func loadListings() async {
        isLoading = true
        do {
            listings = try await APIService.shared.getProListings()
        } catch {}
        isLoading = false
    }

    private func deleteListing(at offsets: IndexSet) {
        let ids = offsets.map { listings[$0].id }
        listings.remove(atOffsets: offsets)
        Task {
            for id in ids {
                _ = try? await APIService.shared.deleteListing(id: id)
            }
        }
    }
}

struct CreateListingView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var serviceName = ""
    @State private var serviceCategory = "Hair"
    @State private var description = ""
    @State private var originalPrice = ""
    @State private var discountedPrice = ""
    @State private var appointmentDate = Date()
    @State private var startTime = Date()
    @State private var durationMinutes = "60"
    @State private var location = ""
    @State private var city = ""
    @State private var zipCode = ""
    @State private var isSubmitting = false
    @State private var errorMessage: String?

    let categories = ["Hair", "Nails", "Makeup", "Lashes", "Brows", "Skincare"]

    var body: some View {
        Form {
            Section("Service Details") {
                TextField("Service Name", text: $serviceName)
                Picker("Category", selection: $serviceCategory) {
                    ForEach(categories, id: \.self) { Text($0) }
                }
                TextField("Description", text: $description, axis: .vertical)
                    .lineLimit(3...6)
            }

            Section("Pricing") {
                HStack {
                    Text("Original Price")
                    Spacer()
                    TextField("$0", text: $originalPrice)
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                        .frame(width: 100)
                }
                HStack {
                    Text("Discounted Price")
                    Spacer()
                    TextField("$0", text: $discountedPrice)
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                        .frame(width: 100)
                }
            }

            Section("Schedule") {
                DatePicker("Date", selection: $appointmentDate, displayedComponents: .date)
                DatePicker("Start Time", selection: $startTime, displayedComponents: .hourAndMinute)
                HStack {
                    Text("Duration (min)")
                    Spacer()
                    TextField("60", text: $durationMinutes)
                        .keyboardType(.numberPad)
                        .multilineTextAlignment(.trailing)
                        .frame(width: 60)
                }
            }

            Section("Location") {
                TextField("Address / Studio Name", text: $location)
                TextField("City", text: $city)
                TextField("Zip Code", text: $zipCode)
                    .keyboardType(.numberPad)
            }

            if let errorMessage {
                Section {
                    Text(errorMessage)
                        .foregroundColor(AppTheme.error)
                        .font(.caption)
                }
            }

            Section {
                PrimaryButton(title: "Create Listing", action: submit, isLoading: isSubmitting)
            }
        }
        .navigationTitle("New Listing")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func submit() {
        guard !serviceName.isEmpty,
              let origPrice = Double(originalPrice),
              let discPrice = Double(discountedPrice)
        else {
            errorMessage = "Please fill in all required fields."
            return
        }

        isSubmitting = true
        errorMessage = nil

        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let dateStr = formatter.string(from: appointmentDate)

        let timeFormatter = DateFormatter()
        timeFormatter.dateFormat = "HH:mm"
        let timeStr = timeFormatter.string(from: startTime)

        let body: [String: Any] = [
            "serviceName": serviceName,
            "serviceCategory": serviceCategory,
            "description": description,
            "originalPriceCents": Int(origPrice * 100),
            "discountedPriceCents": Int(discPrice * 100),
            "appointmentDate": dateStr,
            "startTime": timeStr,
            "durationMinutes": Int(durationMinutes) ?? 60,
            "location": location,
            "city": city,
            "zipCode": zipCode,
        ]

        Task {
            do {
                _ = try await APIService.shared.createListing(body)
                dismiss()
            } catch {
                errorMessage = error.localizedDescription
            }
            isSubmitting = false
        }
    }
}
