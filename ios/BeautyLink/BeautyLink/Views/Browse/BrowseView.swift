import SwiftUI
import MapKit

struct BrowseView: View {
    @StateObject private var viewModel = BrowseViewModel()
    @State private var showMap = false

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search + Filters
                    filterBar

                    // Disclaimer banner
                    disclaimerBanner
                        .padding(.horizontal)
                        .padding(.top, 12)

                    // Content
                    if viewModel.isLoading {
                        Spacer()
                        ProgressView()
                            .tint(AppTheme.accent)
                        Spacer()
                    } else if viewModel.listings.isEmpty {
                        Spacer()
                        EmptyStateView(
                            icon: "sparkles",
                            title: "No Appointments Yet",
                            message: "Preview appointments will appear here. Check back soon."
                        )
                        Spacer()
                    } else if showMap {
                        mapView
                    } else {
                        listView
                    }
                }
            }
            .navigationTitle("Discover")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        withAnimation { showMap.toggle() }
                    } label: {
                        Image(systemName: showMap ? "list.bullet" : "map")
                            .foregroundColor(AppTheme.accent)
                    }
                }
            }
            .task {
                await viewModel.loadListings()
            }
        }
    }

    // MARK: - Filter Bar

    private var filterBar: some View {
        VStack(spacing: 8) {
            // Search
            HStack(spacing: 8) {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(AppTheme.muted)
                    TextField("Search services, professionals...", text: $viewModel.searchText)
                        .font(.subheadline)
                }
                .padding(10)
                .background(AppTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                .overlay(
                    RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                        .stroke(AppTheme.border, lineWidth: 1)
                )

                HStack {
                    Image(systemName: "mappin")
                        .foregroundColor(AppTheme.muted)
                        .font(.caption)
                    TextField("Zip", text: $viewModel.zipCode)
                        .font(.subheadline)
                        .keyboardType(.numberPad)
                        .frame(width: 50)
                }
                .padding(10)
                .background(AppTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
                .overlay(
                    RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                        .stroke(AppTheme.border, lineWidth: 1)
                )
            }
            .padding(.horizontal)

            // Category pills
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(viewModel.categories, id: \.self) { cat in
                        CategoryPill(
                            title: cat,
                            isActive: viewModel.activeCategory == cat
                        ) {
                            viewModel.activeCategory = cat
                        }
                    }
                }
                .padding(.horizontal)
            }
        }
        .padding(.vertical, 8)
        .background(AppTheme.surface)
    }

    // MARK: - Disclaimer

    private var disclaimerBanner: some View {
        HStack(spacing: 8) {
            Image(systemName: "info.circle")
                .foregroundColor(Color(hex: "92400E"))
                .font(.subheadline)
            Text("This page shows preview appointments to demonstrate the types of services you will be able to discover on BeautyLink. These listings are not real bookings. BeautyLink will officially launch in May 2026.")
                .font(.caption)
                .foregroundColor(Color(hex: "92400E"))
        }
        .padding(12)
        .background(Color(hex: "FFFBEB").opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMd))
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.radiusMd)
                .stroke(Color(hex: "FDE68A").opacity(0.6), lineWidth: 1)
        )
    }

    // MARK: - List View

    private var listView: some View {
        ScrollView {
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 12),
                GridItem(.flexible(), spacing: 12),
            ], spacing: 12) {
                ForEach(viewModel.filteredListings) { listing in
                    NavigationLink(destination: AppointmentDetailView(listing: listing)) {
                        ListingCard(listing: listing)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding()

            // Waitlist CTA
            waitlistSection
        }
    }

    // MARK: - Map View

    private var mapView: some View {
        VStack(spacing: 0) {
            MapView(listings: viewModel.filteredListings)
                .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
                .padding()

            waitlistSection
        }
    }

    // MARK: - Waitlist

    private var waitlistSection: some View {
        VStack(spacing: 12) {
            Text("Coming Soon")
                .font(.caption.weight(.semibold))
                .foregroundColor(AppTheme.accent)
                .textCase(.uppercase)
                .tracking(1)
            Text("BeautyLink Launches May 2026")
                .font(.title3.bold())
                .foregroundColor(AppTheme.dark)
            Text("Join the waitlist to get early access to discounted beauty appointments near you.")
                .font(.subheadline)
                .foregroundColor(AppTheme.muted)
                .multilineTextAlignment(.center)
            WaitlistFormView(source: "ios-browse")
        }
        .padding(.vertical, 32)
        .padding(.horizontal, 24)
    }
}

// MARK: - ViewModel

@MainActor
class BrowseViewModel: ObservableObject {
    @Published var listings: [Listing] = []
    @Published var isLoading = false
    @Published var searchText = ""
    @Published var zipCode = ""
    @Published var activeCategory = "All"

    let categories = ["All", "Hair", "Nails", "Makeup", "Lashes", "Brows", "Skincare"]

    var filteredListings: [Listing] {
        var result = listings
        if activeCategory != "All" {
            result = result.filter { $0.serviceCategory.lowercased() == activeCategory.lowercased() }
        }
        if !searchText.isEmpty {
            let query = searchText.lowercased()
            result = result.filter {
                $0.serviceName.lowercased().contains(query) ||
                ($0.provider?.businessName?.lowercased().contains(query) ?? false)
            }
        }
        return result
    }

    func loadListings() async {
        isLoading = true
        do {
            let response = try await APIService.shared.getListings()
            listings = response.listings
        } catch {
            listings = []
        }
        isLoading = false
    }
}

// MARK: - Listing Card

struct ListingCard: View {
    let listing: Listing

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            ZStack(alignment: .topLeading) {
                if let url = listing.photoUrl, let imageURL = URL(string: url) {
                    AsyncImage(url: imageURL) { image in
                        image.resizable().aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle().fill(AppTheme.background)
                    }
                    .frame(height: 120)
                    .clipped()
                } else {
                    Rectangle()
                        .fill(AppTheme.accentLight)
                        .frame(height: 120)
                        .overlay(
                            Image(systemName: "sparkles")
                                .foregroundColor(AppTheme.accent)
                        )
                }

                SavingsBadge(percent: listing.savingsPercent)
                    .padding(8)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(listing.serviceName)
                    .font(.subheadline.bold())
                    .foregroundColor(AppTheme.dark)
                    .lineLimit(1)

                PreviewBadge()

                if let provider = listing.provider {
                    HStack(spacing: 4) {
                        AvatarView(name: provider.businessName ?? "P", url: provider.avatarUrl, size: 18)
                        Text(provider.businessName ?? "Professional")
                            .font(.caption)
                            .foregroundColor(AppTheme.body)
                            .lineLimit(1)
                        if let rating = provider.rating {
                            RatingView(rating: rating, count: nil)
                        }
                    }
                }

                PriceDisplay(
                    original: listing.originalPrice,
                    discounted: listing.discountedPrice
                )

                if let location = listing.location ?? listing.city {
                    HStack(spacing: 2) {
                        Image(systemName: "mappin")
                            .font(.system(size: 10))
                        Text(location)
                            .font(.caption2)
                    }
                    .foregroundColor(AppTheme.muted)
                }
            }
            .padding(10)
        }
        .background(AppTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLg))
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.radiusLg)
                .stroke(AppTheme.border, lineWidth: 1)
        )
    }
}

// MARK: - Simple Map View

struct MapView: View {
    let listings: [Listing]

    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 34.048, longitude: -118.46),
        span: MKCoordinateSpan(latitudeDelta: 0.08, longitudeDelta: 0.08)
    )

    var body: some View {
        Map(coordinateRegion: $region, annotationItems: mapAnnotations) { item in
            MapAnnotation(coordinate: item.coordinate) {
                VStack(spacing: 2) {
                    Text(item.price)
                        .font(.caption.bold())
                        .foregroundColor(AppTheme.dark)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(.white)
                        .clipShape(Capsule())
                        .overlay(Capsule().stroke(AppTheme.border, lineWidth: 1))
                        .shadow(color: .black.opacity(0.1), radius: 4, y: 2)

                    Triangle()
                        .fill(.white)
                        .frame(width: 10, height: 6)
                }
            }
        }
    }

    private var mapAnnotations: [MapAnnotationItem] {
        listings.compactMap { listing in
            guard let lat = listing.latitude, let lng = listing.longitude else { return nil }
            return MapAnnotationItem(
                id: listing.id,
                coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                price: "$\(Int(listing.discountedPrice))"
            )
        }
    }
}

struct MapAnnotationItem: Identifiable {
    let id: String
    let coordinate: CLLocationCoordinate2D
    let price: String
}

struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.closeSubpath()
        return path
    }
}
