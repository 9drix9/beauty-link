# BeautyLink iOS App

Native iOS app built with SwiftUI, targeting iOS 17+.

## Setup

1. Open Xcode
2. **File > New > Project > App**
3. Set:
   - Product Name: `BeautyLink`
   - Bundle Identifier: `com.beautylink.app`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Minimum Deployment: **iOS 17.0**
4. Save the project inside `ios/BeautyLink/`
5. Delete the auto-generated `ContentView.swift` and `BeautyLinkApp.swift`
6. Drag all files from `ios/BeautyLink/BeautyLink/` into the Xcode project navigator
7. Build and run on Simulator (no developer account needed)

## Architecture

```
BeautyLink/
  BeautyLinkApp.swift          # App entry point
  ContentView.swift            # Tab navigation
  Theme/AppTheme.swift         # Colors, fonts, spacing
  Models/Models.swift          # All data models
  Services/
    APIService.swift           # HTTP client for beautylinknetwork.com
    AuthManager.swift          # Auth state management
  Components/SharedComponents.swift  # Reusable UI components
  Views/
    Browse/BrowseView.swift           # Browse + map + filters
    Appointment/AppointmentDetailView.swift  # Listing detail
    Bookings/BookingsView.swift       # My bookings
    Messages/MessagesView.swift       # Chat threads
    Profile/ProfileView.swift         # Profile + auth prompt
    Pro/
      Dashboard/ProDashboardView.swift    # Pro dashboard
      Listings/ProListingsView.swift      # Manage + create listings
      Earnings/ProEarningsView.swift      # Earnings overview
```

## Features

**Customer:**
- Browse appointments with map view, search, category filters, zip code
- Appointment detail with price breakdown
- My bookings (upcoming / past)
- Messages with professionals
- Waitlist signup
- Profile management

**Professional:**
- Dashboard with stats
- Create and manage listings
- Earnings overview
- Quick actions

## API

All data comes from `https://beautylinknetwork.com/api/`. Auth uses Bearer tokens via Clerk.

## Notes

- No Apple Developer account needed for Simulator testing
- $99/yr account needed for physical device testing or App Store submission
- Auth currently opens web login (Clerk) in Safari; native Clerk SDK can be added later
