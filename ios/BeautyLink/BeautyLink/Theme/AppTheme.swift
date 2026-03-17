import SwiftUI

enum AppTheme {
    // Brand colors (matching logo)
    static let dark = Color(hex: "3d1a0f")
    static let body = Color(hex: "3d1a0f")
    static let accent = Color(hex: "b05a2a")
    static let accentHover = Color(hex: "6b3020")
    static let accentLight = Color(hex: "f5e8da")
    static let accentMuted = Color(hex: "c4a98c")
    static let muted = Color(hex: "9a7b6a")
    static let background = Color(hex: "faf5f0")
    static let surface = Color.white
    static let border = Color(hex: "e0d3c8")
    static let cta = Color(hex: "3d1a0f")
    static let ctaHover = Color(hex: "6b3020")
    static let success = Color(hex: "10B981")
    static let error = Color(hex: "EF4444")
    static let warning = Color(hex: "F59E0B")

    // Typography
    static let headingFont: Font = .custom("PlayfairDisplay-Bold", size: 28, relativeTo: .title)
    static let headingItalic: Font = .custom("PlayfairDisplay-Italic", size: 28, relativeTo: .title)
    static let subheadingFont: Font = .custom("PlayfairDisplay-SemiBold", size: 20, relativeTo: .title3)

    // Fallback serif for headings (when custom fonts not bundled)
    static func serif(_ size: CGFloat, weight: Font.Weight = .bold) -> Font {
        .system(size: size, weight: weight, design: .serif)
    }

    static func serifItalic(_ size: CGFloat) -> Font {
        .system(size: size, design: .serif).italic()
    }

    // Spacing
    static let paddingSm: CGFloat = 8
    static let paddingMd: CGFloat = 16
    static let paddingLg: CGFloat = 24
    static let paddingXl: CGFloat = 32

    // Radii
    static let radiusSm: CGFloat = 8
    static let radiusMd: CGFloat = 12
    static let radiusLg: CGFloat = 16
    static let radiusXl: CGFloat = 20
    static let radiusPill: CGFloat = 24
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = ((int >> 24) & 0xFF, (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
