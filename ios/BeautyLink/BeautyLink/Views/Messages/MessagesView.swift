import SwiftUI

struct MessagesView: View {
    @State private var threads: [MessageThread] = []
    @State private var isLoading = true

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                if isLoading {
                    ProgressView().tint(AppTheme.accent)
                } else if threads.isEmpty {
                    EmptyStateView(
                        icon: "bubble.left.and.bubble.right",
                        title: "No Messages",
                        message: "Your conversations with professionals will appear here."
                    )
                } else {
                    List(threads) { thread in
                        NavigationLink(destination: ChatView(thread: thread)) {
                            ThreadRow(thread: thread)
                        }
                        .listRowBackground(AppTheme.surface)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Messages")
            .task { await loadThreads() }
            .refreshable { await loadThreads() }
        }
    }

    private func loadThreads() async {
        isLoading = true
        do {
            threads = try await APIService.shared.getThreads()
        } catch {
            threads = []
        }
        isLoading = false
    }
}

struct ThreadRow: View {
    let thread: MessageThread

    var body: some View {
        HStack(spacing: 12) {
            AvatarView(name: thread.otherUser.displayName, url: thread.otherUser.profilePhotoUrl)

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(thread.otherUser.displayName)
                        .font(.subheadline.weight(.semibold))
                        .foregroundColor(AppTheme.dark)
                    Spacer()
                    if let date = thread.lastMessageAt {
                        Text(date)
                            .font(.caption2)
                            .foregroundColor(AppTheme.muted)
                    }
                }
                if let message = thread.lastMessage {
                    Text(message)
                        .font(.caption)
                        .foregroundColor(AppTheme.muted)
                        .lineLimit(1)
                }
            }

            if let unread = thread.unreadCount, unread > 0 {
                Text("\(unread)")
                    .font(.caption2.bold())
                    .foregroundColor(.white)
                    .frame(width: 20, height: 20)
                    .background(AppTheme.accent)
                    .clipShape(Circle())
            }
        }
        .padding(.vertical, 4)
    }
}

struct ChatView: View {
    let thread: MessageThread
    @State private var messages: [Message] = []
    @State private var newMessage = ""
    @State private var isLoading = true
    @EnvironmentObject var auth: AuthManager

    var body: some View {
        VStack(spacing: 0) {
            if isLoading {
                Spacer()
                ProgressView().tint(AppTheme.accent)
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 8) {
                        ForEach(messages) { message in
                            MessageBubble(
                                message: message,
                                isMe: message.senderId == auth.currentUser?.id
                            )
                        }
                    }
                    .padding()
                }

                // Input bar
                HStack(spacing: 8) {
                    TextField("Type a message...", text: $newMessage)
                        .textFieldStyle(.roundedBorder)

                    Button {
                        sendMessage()
                    } label: {
                        Image(systemName: "arrow.up.circle.fill")
                            .font(.title2)
                            .foregroundColor(newMessage.isEmpty ? AppTheme.muted : AppTheme.accent)
                    }
                    .disabled(newMessage.isEmpty)
                }
                .padding()
                .background(AppTheme.surface)
            }
        }
        .navigationTitle(thread.otherUser.displayName)
        .navigationBarTitleDisplayMode(.inline)
        .task { await loadMessages() }
    }

    private func loadMessages() async {
        isLoading = true
        do {
            messages = try await APIService.shared.getMessages(threadId: thread.id)
        } catch {
            messages = []
        }
        isLoading = false
    }

    private func sendMessage() {
        let content = newMessage.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !content.isEmpty else { return }
        newMessage = ""

        Task {
            do {
                let msg = try await APIService.shared.sendMessage(threadId: thread.id, content: content)
                messages.append(msg)
            } catch {}
        }
    }
}

struct MessageBubble: View {
    let message: Message
    let isMe: Bool

    var body: some View {
        HStack {
            if isMe { Spacer(minLength: 60) }
            Text(message.content)
                .font(.subheadline)
                .foregroundColor(isMe ? .white : AppTheme.dark)
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(isMe ? AppTheme.dark : AppTheme.background)
                .clipShape(RoundedRectangle(cornerRadius: 18))
            if !isMe { Spacer(minLength: 60) }
        }
    }
}
