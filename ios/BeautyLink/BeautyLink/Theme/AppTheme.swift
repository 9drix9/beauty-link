import SwiftUI

enum AppTheme {
    // Primary palette
    static let background = Color(hex: "F6EDE6")
    static let surface = Color(hex: "FFF8F4")
    static let blush = Color(hex: "F4DDE5")
    static let blushAccent = Color(hex: "DFA3A6")
    static let coral = Color(hex: "D06A4E")
    static let dark = Color(hex: "3A1F10")
    static let body = Color(hex: "3A1F10")
    static let muted = Color(hex: "9A7B6A")
    static let border = Color(hex: "E6D8CF")
    static let cta = Color(hex: "4B2615")
    static let ctaHover = Color(hex: "5A2F1A")
    static let accent = Color(hex: "D06A4E")
    static let accentLight = Color(hex: "F4DDE5")
    static let success = Color(hex: "16A34A")
    static let error = Color(hex: "DC2626")
    static let white = Color.white

    // Typography
    static let headingFont: Font = .system(.title, design: .default, weight: .bold)
    static let subheadingFont: Font = .system(.title3, design: .default, weight: .semibold)
    static let bodyFont: Font = .system(.body, design: .default)
    static let captionFont: Font = .system(.caption, design: .default)

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
    static let radiusFull: CGFloat = 100
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
