import Foundation

enum APIError: LocalizedError {
    case invalidURL
    case unauthorized
    case serverError(Int, String?)
    case decodingError(Error)
    case networkError(Error)
    case notLaunched

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid request URL"
        case .unauthorized: return "Please sign in to continue"
        case .serverError(let code, let msg): return msg ?? "Server error (\(code))"
        case .decodingError: return "Failed to process response"
        case .networkError(let err): return err.localizedDescription
        case .notLaunched: return "BeautyLink has not launched yet"
        }
    }
}

@MainActor
class APIService: ObservableObject {
    static let shared = APIService()

    private let baseURL = "https://beautylinknetwork.com"
    private let session: URLSession
    private var authToken: String?

    init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 60
        self.session = URLSession(configuration: config)
    }

    func setAuthToken(_ token: String?) {
        self.authToken = token
    }

    // MARK: - Generic Request

    private func request<T: Decodable>(
        _ method: String,
        path: String,
        body: (any Encodable)? = nil,
        queryItems: [URLQueryItem]? = nil
    ) async throws -> T {
        guard var components = URLComponents(string: "\(baseURL)\(path)") else {
            throw APIError.invalidURL
        }

        if let queryItems, !queryItems.isEmpty {
            components.queryItems = queryItems
        }

        guard let url = components.url else {
            throw APIError.invalidURL
        }

        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = authToken {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body {
            req.httpBody = try JSONEncoder().encode(body)
        }

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: req)
        } catch {
            throw APIError.networkError(error)
        }

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.serverError(0, "Invalid response")
        }

        switch httpResponse.statusCode {
        case 200...299:
            break
        case 401:
            throw APIError.unauthorized
        case 503:
            throw APIError.notLaunched
        default:
            let errorBody = try? JSONDecoder().decode([String: String].self, from: data)
            throw APIError.serverError(httpResponse.statusCode, errorBody?["error"])
        }

        do {
            let decoder = JSONDecoder()
            return try decoder.decode(T.self, from: data)
        } catch {
            throw APIError.decodingError(error)
        }
    }

    // MARK: - Appointments

    func getListings(
        category: String? = nil,
        sort: String = "soonest",
        limit: Int = 20,
        page: Int = 1
    ) async throws -> ListingsResponse {
        var query: [URLQueryItem] = [
            .init(name: "sort", value: sort),
            .init(name: "limit", value: "\(limit)"),
            .init(name: "page", value: "\(page)"),
        ]
        if let category, category != "All" {
            query.append(.init(name: "category", value: category))
        }
        return try await request("GET", path: "/api/appointments", queryItems: query)
    }

    func getListing(id: String) async throws -> Listing {
        return try await request("GET", path: "/api/appointments/\(id)")
    }

    // MARK: - Bookings

    func getBookings() async throws -> [Booking] {
        let response: BookingsResponse = try await request("GET", path: "/api/bookings")
        return response.bookings
    }

    func getBooking(id: String) async throws -> Booking {
        return try await request("GET", path: "/api/bookings/\(id)")
    }

    func cancelBooking(id: String) async throws -> Booking {
        return try await request("PATCH", path: "/api/bookings/\(id)", body: ["action": "cancel"])
    }

    // MARK: - Checkout

    func createCheckout(listingId: String) async throws -> [String: String] {
        return try await request("POST", path: "/api/checkout", body: ["listingId": listingId])
    }

    func releaseHold(listingId: String) async throws -> [String: String] {
        return try await request("POST", path: "/api/checkout/release", body: ["listingId": listingId])
    }

    // MARK: - Messages

    func getThreads() async throws -> [MessageThread] {
        let response: ThreadsResponse = try await request("GET", path: "/api/messages")
        return response.threads
    }

    func getMessages(threadId: String) async throws -> [Message] {
        let response: MessagesResponse = try await request("GET", path: "/api/messages/\(threadId)")
        return response.messages
    }

    func sendMessage(threadId: String, content: String) async throws -> Message {
        return try await request("POST", path: "/api/messages", body: [
            "threadId": threadId,
            "content": content,
        ])
    }

    // MARK: - Reviews

    func getReviews(providerId: String) async throws -> [Review] {
        return try await request("GET", path: "/api/reviews", queryItems: [
            .init(name: "providerId", value: providerId),
        ])
    }

    func submitReview(bookingId: String, rating: Int, comment: String?) async throws -> Review {
        var body: [String: Any] = ["bookingId": bookingId, "rating": rating]
        if let comment { body["comment"] = comment }
        // Use manual encoding for mixed types
        let jsonData = try JSONSerialization.data(withJSONObject: body)
        guard let url = URL(string: "\(baseURL)/api/reviews") else { throw APIError.invalidURL }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = authToken {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        req.httpBody = jsonData
        let (data, _) = try await session.data(for: req)
        return try JSONDecoder().decode(Review.self, from: data)
    }

    // MARK: - Waitlist

    func joinWaitlist(email: String, source: String) async throws -> [String: String] {
        return try await request("POST", path: "/api/waitlist", body: WaitlistRequest(email: email, source: source))
    }

    // MARK: - Pro

    func submitApplication(_ application: ProApplication) async throws -> [String: String] {
        return try await request("POST", path: "/api/providers/apply", body: application)
    }

    func getProListings() async throws -> [Listing] {
        let response: ListingsResponse = try await request("GET", path: "/api/providers/listings")
        return response.listings
    }

    func createListing(_ body: [String: Any]) async throws -> Listing {
        let jsonData = try JSONSerialization.data(withJSONObject: body)
        guard let url = URL(string: "\(baseURL)/api/providers/listings") else { throw APIError.invalidURL }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = authToken {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        req.httpBody = jsonData
        let (data, _) = try await session.data(for: req)
        return try JSONDecoder().decode(Listing.self, from: data)
    }

    func deleteListing(id: String) async throws -> [String: String] {
        return try await request("DELETE", path: "/api/providers/listings/\(id)")
    }

    func getEarnings() async throws -> EarningsSummary {
        return try await request("GET", path: "/api/payouts")
    }

    // MARK: - User

    func getProStatus() async throws -> [String: Bool] {
        return try await request("GET", path: "/api/user/pro-status")
    }

    // MARK: - Contact

    func submitContactForm(
        name: String,
        email: String,
        subject: String,
        message: String,
        category: String
    ) async throws -> [String: String] {
        struct ContactBody: Codable {
            let name: String
            let email: String
            let subject: String
            let message: String
            let category: String
        }
        return try await request("POST", path: "/api/contact", body: ContactBody(
            name: name, email: email, subject: subject, message: message, category: category
        ))
    }
}
