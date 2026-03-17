import SwiftUI

struct ContentView: View {
    @EnvironmentObject var auth: AuthManager

    var body: some View {
        if auth.isLoading {
            LoadingView()
        } else {
            MainTabView()
        }
    }
}

struct LoadingView: View {
    var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()
            VStack(spacing: 16) {
                BrandLogo(size: 32)
                ProgressView()
                    .tint(AppTheme.accent)
            }
        }
    }
}

// MARK: - Brand Logo

struct BrandLogo: View {
    var size: CGFloat = 22

    var body: some View {
        HStack(spacing: 0) {
            Text("beauty")
                .font(AppTheme.serif(size, weight: .bold))
                .foregroundColor(AppTheme.dark)
            Text("link")
                .font(AppTheme.serifItalic(size))
                .foregroundColor(AppTheme.dark)
        }
    }
}

// MARK: - Tab View

struct MainTabView: View {
    @EnvironmentObject var auth: AuthManager
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            BrowseView()
                .tabItem {
                    Image(systemName: "magnifyingglass")
                    Text("Browse")
                }
                .tag(0)

            if auth.isSignedIn {
                BookingsView()
                    .tabItem {
                        Image(systemName: "calendar")
                        Text("Bookings")
                    }
                    .tag(1)

                MessagesView()
                    .tabItem {
                        Image(systemName: "bubble.left.and.bubble.right")
                        Text("Messages")
                    }
                    .tag(2)

                if auth.isPro {
                    ProDashboardView()
                        .tabItem {
                            Image(systemName: "chart.bar")
                            Text("Pro")
                        }
                        .tag(3)
                }

                ProfileView()
                    .tabItem {
                        Image(systemName: "person")
                        Text("Profile")
                    }
                    .tag(4)
            } else {
                AuthPromptView()
                    .tabItem {
                        Image(systemName: "person")
                        Text("Account")
                    }
                    .tag(1)
            }
        }
        .tint(AppTheme.accent)
    }
}
