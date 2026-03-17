import SwiftUI

@main
struct BeautyLinkApp: App {
    @StateObject private var authManager = AuthManager.shared
    @StateObject private var api = APIService.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
                .environmentObject(api)
        }
    }
}
