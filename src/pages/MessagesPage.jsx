import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function MessagesPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);

  const messagesEndRef = useRef(null);
  const attachmentInputRef = useRef(null);

  const handleAttachmentFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    document.body.classList.add('messages-active');
    return () => {
      document.body.classList.remove('messages-active');
    };
  }, []);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const convs = await api.getConversations();
      setConversations(convs);
      if (convs.length > 0) {
        setActiveChatId(convs[0].id);
        setMessages(convs[0].messages || []);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  useEffect(() => {
    if (activeChatId) {
      const active = conversations.find(c => c.id === activeChatId);
      if (active) {
        setMessages(active.messages || []);
      }
    }
  }, [activeChatId, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setShowMobileChat(true);

    // Mark as read
    setConversations(prev =>
      prev.map(c => (c.id === chatId ? { ...c, unread: 0 } : c))
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((!newMessageText.trim() && !attachedImage) || !activeChatId) return;

    const newMsg = {
      id: 'msg-' + Date.now(),
      sender: user?.name || 'Me',
      type: 'sent',
      text: newMessageText.trim(),
      image: attachedImage || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages in state and conversation
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setNewMessageText('');
    setAttachedImage(null);

    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: newMsg.text || '📷 Shared an image',
            time: 'Just now',
            messages: updatedMessages
          };
        }
        return c;
      });
      api.saveConversations(updated);
      return updated;
    });

    // Simulate reply after 1.5 seconds if talking to another user
    setTimeout(() => {
      const replyMsg = {
        id: 'msg-rep-' + Date.now(),
        sender: activeChat?.user?.name || 'Teammate',
        type: 'received',
        text: `Sounds great! Let's build it out together.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => {
        const updated = prev.map(c => {
          if (c.id === activeChatId) {
            return {
              ...c,
              lastMessage: replyMsg.text,
              time: 'Just now',
              messages: [...c.messages, replyMsg]
            };
          }
          return c;
        });
        api.saveConversations(updated);
        return updated;
      });
    }, 1500);
  };

  const onlineUsers = [
    { id: '1', name: 'Aditya', avatar: 'AS', color: 'purple' },
    { id: '2', name: 'Priya', avatar: 'PS', color: 'cyan' },
    { id: '3', name: 'Rahul', avatar: 'RK', color: 'pink' }
  ];

  const filteredConversations = conversations.filter(c => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      c.user.name.toLowerCase().includes(query) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(query))
    );
  });

  return (
    <div className={`messenger ${showMobileChat ? 'mobile-chat-active' : ''}`}>
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className={`sidebar ${showMobileChat ? 'mobile-hidden' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="back-btn" title="Back to Home">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>

          <h2>Messages</h2>

          <button
            className="icon-btn theme-toggle-btn"
            id="themeToggleBtn"
            title="Toggle Theme"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          <button
            className="icon-btn"
            id="newMessageBtn"
            title="New message"
            onClick={() => {
              const name = prompt('Enter teammate name to start conversation:');
              if (name && name.trim()) {
                const newConv = {
                  id: 'conv-' + Date.now(),
                  user: {
                    name: name.trim(),
                    avatar: name.slice(0, 2).toUpperCase(),
                    color: 'purple',
                    online: true
                  },
                  time: 'Just now',
                  lastMessage: 'Started new chat',
                  unread: 0,
                  messages: [
                    {
                      id: 'init-1',
                      sender: name.trim(),
                      type: 'received',
                      text: `Hi! Thanks for connecting.`,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]
                };
                setConversations(prev => [newConv, ...prev]);
                setActiveChatId(newConv.id);
                setShowMobileChat(true);
              }
            }}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            id="searchInput"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ONLINE USERS */}
        <div className="online-section">
          <h3>Active now</h3>
          <div className="online-users" id="onlineUsers">
            {onlineUsers.map(u => (
              <button
                key={u.id}
                className="online-user"
                onClick={() => handleSelectChat(u.id)}
              >
                <div className="avatar-wrap">
                  <div className={`avatar ${u.color}`}>{u.avatar}</div>
                  <span className="online-dot"></span>
                </div>
                <span>{u.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RECENT MESSAGES */}
        <div className="chat-list-header">
          <h3>Recent messages</h3>
          <span id="chatCount">{conversations.length} chats</span>
        </div>

        <div className="chat-list" id="chatList">
          {filteredConversations.map(c => {
            const isActive = c.id === activeChatId;
            return (
              <button
                key={c.id}
                className={`chat-user ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectChat(c.id)}
              >
                <div className="avatar-wrap">
                  <div className={`avatar ${c.user.color || 'purple'}`}>
                    {c.user.avatar}
                  </div>
                  {c.user.online && <span className="online-dot"></span>}
                </div>

                <div className="chat-info">
                  <div className="chat-name">
                    <strong>{c.user.name}</strong>
                    <span className="chat-time">{c.time}</span>
                  </div>
                  <div className="chat-preview">{c.lastMessage}</div>
                </div>

                {Boolean(c.unread) && <span className="unread-count">{c.unread}</span>}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ================= CHAT AREA ================= */}
      <section className={`chat-area ${!showMobileChat ? 'mobile-hidden' : ''}`}>
        {activeChat ? (
          <>
            {/* CHAT HEADER */}
            <div className="chat-header">
              <div className="chat-profile">
                <button
                  className="mobile-back"
                  style={{ display: showMobileChat ? 'inline-block' : 'none', marginRight: '8px' }}
                  onClick={() => setShowMobileChat(false)}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>

                <div className="avatar-wrap">
                  <div className={`avatar ${activeChat.user.color || 'purple'}`}>
                    {activeChat.user.avatar}
                  </div>
                  {activeChat.user.online && <span className="online-dot"></span>}
                </div>

                <div>
                  <h3>{activeChat.user.name}</h3>
                  <p className={activeChat.user.online ? '' : 'offline'}>
                    {activeChat.user.online ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="chat-actions">
                <button className="icon-btn" title="Start call">
                  <i className="fa-solid fa-phone"></i>
                </button>
                <button className="icon-btn" title="Video call">
                  <i className="fa-solid fa-video"></i>
                </button>
                <button className="icon-btn" title="More info">
                  <i className="fa-solid fa-circle-info"></i>
                </button>
              </div>
            </div>

            {/* MESSAGES LIST */}
            <div className="messages" id="messagesList">
              <div className="date-divider">
                <span>Today</span>
              </div>

              {messages.map(m => (
                <div key={m.id} className={`message ${m.type}`}>
                  {m.type === 'received' && (
                    <div className={`message-avatar avatar ${activeChat.user.color || 'purple'}`}>
                      {activeChat.user.avatar}
                    </div>
                  )}

                  <div className="message-content">
                    {m.image && (
                      <img
                        src={m.image}
                        alt="attachment"
                        style={{ maxWidth: '240px', maxHeight: '180px', borderRadius: '8px', marginBottom: '6px', display: 'block', objectFit: 'cover' }}
                      />
                    )}
                    {m.text && <p>{m.text}</p>}
                    <span>{m.time}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* ATTACHMENT PREVIEW IF ANY */}
            {attachedImage && (
              <div style={{ padding: '8px 16px', background: 'var(--card-solid)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={attachedImage} alt="Attachment preview" style={{ height: '48px', width: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Image ready to send</span>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                  title="Remove attachment"
                >
                  ✕
                </button>
              </div>
            )}

            {/* MESSAGE INPUT */}
            <form className="message-form" onSubmit={handleSendMessage}>
              <input
                type="file"
                ref={attachmentInputRef}
                onChange={handleAttachmentFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <button
                type="button"
                className="icon-btn"
                title="Attach image"
                onClick={() => attachmentInputRef.current?.click()}
              >
                <i className="fa-solid fa-paperclip"></i>
              </button>

              <input
                type="text"
                placeholder={attachedImage ? "Add a message (optional)..." : "Write a message..."}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />

              <button type="submit" className="send-btn" title="Send message">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
            <p>Select a conversation or start a new chat.</p>
          </div>
        )}
      </section>
    </div>
  );
}
