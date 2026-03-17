import Foundation

// MARK: - User

struct User: Codable, Identifiable {
    let id: String
    let clerkId: String
    let email: String
    let firstName: String?
    let lastName: String?
    let profilePhotoUrl: String?
    let role: UserRole
    let createdAt: String

    var displayName: String {
        [firstName, lastName].compactMap { $0 }.joined(separator: " ")
    }

    var initials: String {
        let f = firstName?.prefix(1) ?? ""
        let l = lastName?.prefix(1) ?? ""
        return "\(f)\(l)".uppercased()
    }
}

enum UserRole: String, Codable {
    case CUSTOMER, PROFESSIONAL, ADMIN
}

// MARK: - Appointment Listing

struct Listing: Codable, Identifiable {
    let id: String
    let serviceName: String
    let serviceCategory: String
    let description: String?
    let originalPriceCents: Int
    let discountedPriceCents: Int
    let appointmentDate: String
    let startTime: String
    let endTime: String?
    let durationMinutes: Int
    let location: String?
    let address: String?
    let city: String?
    let zipCode: String?
    let latitude: Double?
    let longitude: Double?
    let maxClients: Int?
    let bookedCount: Int?
    let status: ListingStatus
    let photoUrl: String?
    let provider: ListingProvider?
    let createdAt: String?

    var originalPrice: Double { Double(originalPriceCents) / 100.0 }
    var discountedPrice: Double { Double(discountedPriceCents) / 100.0 }
    var savingsPercent: Int {
        guard originalPriceCents > 0 else { return 0 }
        return Int(round(Double(originalPriceCents - discountedPriceCents) / Double(originalPriceCents) * 100))
    }
    var isAvailable: Bool {
        status == .ACTIVE && (bookedCount ?? 0) < (maxClients ?? 1)
    }
}

struct ListingProvider: Codable {
    let id: String
    let businessName: String?
    let avatarUrl: String?
    let rating: Double?
    let reviewCount: Int?
    let verified: Bool?
}

enum ListingStatus: String, Codable {
    case ACTIVE, BOOKED, COMPLETED, CANCELLED, EXPIRED
}

// MARK: - Booking

struct Booking: Codable, Identifiable {
    let id: String
    let bookingReference: String
    let status: BookingStatus
    let totalChargedCents: Int
    let platformFeeCents: Int
    let providerPayoutCents: Int
    let listing: Listing?
    let customer: User?
    let provider: ListingProvider?
    let createdAt: String
    let cancelledAt: String?

    var totalCharged: Double { Double(totalChargedCents) / 100.0 }
}

enum BookingStatus: String, Codable {
    case PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW, DISPUTED
}

// MARK: - Review

struct Review: Codable, Identifiable {
    let id: String
    let rating: Int
    let comment: String?
    let customerName: String?
    let createdAt: String
}

// MARK: - Message

struct MessageThread: Codable, Identifiable {
    let id: String
    let otherUser: ThreadUser
    let lastMessage: String?
    let lastMessageAt: String?
    let unreadCount: Int?
}

struct ThreadUser: Codable {
    let id: String
    let firstName: String?
    let lastName: String?
    let profilePhotoUrl: String?

    var displayName: String {
        [firstName, lastName].compactMap { $0 }.joined(separator: " ")
    }
}

struct Message: Codable, Identifiable {
    let id: String
    let content: String
    let senderId: String
    let createdAt: String
}

// MARK: - Waitlist

struct WaitlistRequest: Codable {
    let email: String
    let source: String
}

// MARK: - Pro Application

struct ProApplication: Codable {
    let businessName: String
    let bio: String
    let serviceCategories: [String]
    let yearsExperience: String
    let workSetting: String
    let licenseType: String?
    let licenseNumber: String?
    let licenseState: String?
    let instagramUrl: String?
    let websiteUrl: String?
    let portfolioPhotos: [String]
    let city: String
    let state: String
    let serviceRadius: String?
    let pricingRange: String?
    let availabilityType: String?
    let currentPlatform: String?
    let clientVolume: String?
    let isStudent: Bool
    let school: String?
}

// MARK: - API Responses

struct ListingsResponse: Codable {
    let listings: [Listing]
    let total: Int?
    let page: Int?
}

struct BookingsResponse: Codable {
    let bookings: [Booking]
}

struct ThreadsResponse: Codable {
    let threads: [MessageThread]
}

struct MessagesResponse: Codable {
    let messages: [Message]
}

// MARK: - Earnings

struct EarningsSummary: Codable {
    let totalEarnedCents: Int
    let pendingPayoutCents: Int
    let completedBookings: Int
    let totalBookings: Int

    var totalEarned: Double { Double(totalEarnedCents) / 100.0 }
    var pendingPayout: Double { Double(pendingPayoutCents) / 100.0 }
}

// MARK: - Price Breakdown

struct PriceBreakdown {
    let originalPrice: Double
    let discountedPrice: Double
    let savingsAmount: Double
    let savingsPercent: Int
    let platformFee: Double
    let totalCharged: Double

    init(originalCents: Int, discountedCents: Int, feeRate: Double = 0.05) {
        self.originalPrice = Double(originalCents) / 100.0
        self.discountedPrice = Double(discountedCents) / 100.0
        self.savingsAmount = self.originalPrice - self.discountedPrice
        self.savingsPercent = originalCents > 0
            ? Int(round(Double(originalCents - discountedCents) / Double(originalCents) * 100))
            : 0
        self.platformFee = (self.discountedPrice * feeRate).rounded(to: 2)
        self.totalCharged = self.discountedPrice + self.platformFee
    }
}

extension Double {
    func rounded(to places: Int) -> Double {
        let multiplier = pow(10.0, Double(places))
        return (self * multiplier).rounded() / multiplier
    }
}
