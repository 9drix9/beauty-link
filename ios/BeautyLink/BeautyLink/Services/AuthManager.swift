import Foundation
import SwiftUI
import AuthenticationServices

@MainActor
class AuthManager: ObservableObject {
    static let shared = AuthManager()

    @Published var isSignedIn = false
    @Published var currentUser: User?
    @Published var isPro = false
    @Published var isLoading = true

    private let api = APIService.shared
    private let tokenKey = "beautylink_auth_token"

    init() {
        if let token = UserDefaults.standard.string(forKey: tokenKey) {
            api.setAuthToken(token)
            isSignedIn = true
        }
        isLoading = false
    }

    func signIn(token: String, user: User) {
        UserDefaults.standard.set(token, forKey: tokenKey)
        api.setAuthToken(token)
        self.currentUser = user
        self.isSignedIn = true
        Task { await checkProStatus() }
    }

    func signOut() {
        UserDefaults.standard.removeObject(forKey: tokenKey)
        api.setAuthToken(nil)
        self.currentUser = nil
        self.isSignedIn = false
        self.isPro = false
    }

    func checkProStatus() async {
        do {
            let status = try await api.getProStatus()
            isPro = status["isPro"] ?? false
        } catch {
            isPro = false
        }
    }
}
