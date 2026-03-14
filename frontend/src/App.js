import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/App.css";
import { Toaster } from "sonner";

// Icons
import {
  MessageSquare,
  Phone,
  Users,
  LayoutGrid,
  FolderOpen,
  Settings,
  Wifi,
  Battery,
  Signal,
  Search,
  ChevronRight,
  Mic,
  Clock,
  HardDrive,
  Cpu,
  Activity,
  ArrowLeft,
  Send,
  Star,
  Image,
  Music,
  Video,
  FileText,
  Archive,
  Download,
  Camera,
  Calendar,
  Mail,
  Map,
  Calculator,
  Zap,
  Moon,
  Sun,
  Volume2,
  Bluetooth,
  Shield,
  ChevronUp,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

// Menu items configuration
const MENU_ITEMS = [
  { id: "messages", label: "Messages", icon: MessageSquare, color: "#00F0FF" },
  { id: "calls", label: "Calls", icon: Phone, color: "#7000FF" },
  { id: "contacts", label: "Contacts", icon: Users, color: "#00d4e6" },
  { id: "apps", label: "Apps", icon: LayoutGrid, color: "#00F0FF" },
  { id: "files", label: "Files", icon: FolderOpen, color: "#7000FF" },
  { id: "settings", label: "Settings", icon: Settings, color: "#64748b" },
];

// Mock data
const MOCK_MESSAGES = [
  { id: 1, sender: "Alex Chen", preview: "Hey, are you coming to the meeting?", time: "2m ago", unread: true },
  { id: 2, sender: "AURIONA System", preview: "System update completed successfully", time: "15m ago", unread: true },
  { id: 3, sender: "Sarah Miller", preview: "Thanks for the files!", time: "1h ago", unread: false },
  { id: 4, sender: "Dev Team", preview: "New deployment ready for review", time: "3h ago", unread: false },
];

const MOCK_CALLS = [
  { id: 1, name: "Alex Chen", type: "incoming", time: "Today, 2:30 PM", duration: "5m 23s" },
  { id: 2, name: "Unknown", type: "missed", time: "Today, 11:45 AM", duration: null },
  { id: 3, name: "Sarah Miller", type: "outgoing", time: "Yesterday", duration: "12m 08s" },
];

const MOCK_CONTACTS = [
  { id: 1, name: "Alex Chen", status: "online", avatar: "AC" },
  { id: 2, name: "Sarah Miller", status: "offline", avatar: "SM" },
  { id: 3, name: "John Doe", status: "online", avatar: "JD" },
  { id: 4, name: "Emma Wilson", status: "away", avatar: "EW" },
];

const MOCK_APPS = [
  { id: 1, name: "Camera", icon: Camera, color: "#FF5555" },
  { id: 2, name: "Gallery", icon: Image, color: "#55FF55" },
  { id: 3, name: "Music", icon: Music, color: "#FF55FF" },
  { id: 4, name: "Video", icon: Video, color: "#5555FF" },
  { id: 5, name: "Calendar", icon: Calendar, color: "#FFAA00" },
  { id: 6, name: "Email", icon: Mail, color: "#00AAFF" },
  { id: 7, name: "Maps", icon: Map, color: "#00FF00" },
  { id: 8, name: "Calculator", icon: Calculator, color: "#888888" },
];

const MOCK_FILES = [
  { id: 1, name: "Documents", icon: FileText, count: 24, size: "1.2 GB" },
  { id: 2, name: "Images", icon: Image, count: 156, size: "3.4 GB" },
  { id: 3, name: "Videos", icon: Video, count: 12, size: "8.2 GB" },
  { id: 4, name: "Music", icon: Music, count: 89, size: "2.1 GB" },
  { id: 5, name: "Archives", icon: Archive, count: 5, size: "512 MB" },
  { id: 6, name: "Downloads", icon: Download, count: 34, size: "1.8 GB" },
];

// System Header Component
const SystemHeader = ({ currentTime, batteryLevel, signalStrength }) => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative z-10 px-4 md:px-8 py-4 md:py-6"
    data-testid="system-header"
  >
    <div className="flex items-center justify-between">
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center glow-cyan">
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="font-orbitron text-lg md:text-xl font-bold tracking-wider text-white">
            AURIONA<span className="text-cyan-400">.</span>OS
          </h1>
          <p className="text-xs text-slate-500 tracking-widest uppercase">System Active</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Time */}
        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span className="font-rajdhani text-sm font-medium tracking-wide">{currentTime}</span>
        </div>

        {/* Signal */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Signal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-medium text-slate-300 hidden sm:inline">{signalStrength}%</span>
        </div>

        {/* WiFi */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Wifi className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Battery */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Battery className="w-4 h-4 text-green-400" />
          <span className="text-xs font-medium text-slate-300">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  </motion.header>
);

// Navigation Menu Component
const NavigationMenu = ({ activeSection, onSelectSection }) => (
  <motion.nav
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="glass-panel rounded-2xl md:rounded-3xl p-2 md:p-3 w-full"
    data-testid="navigation-menu"
  >
    <div className="flex flex-col gap-1">
      {MENU_ITEMS.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => onSelectSection(item.id)}
            className={`menu-item flex items-center gap-4 p-3 md:p-4 w-full text-left rounded-xl md:rounded-2xl group ${
              isActive ? "active" : ""
            }`}
            data-testid={`menu-item-${item.id}`}
          >
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500/20 border border-cyan-500/40"
                  : "bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-cyan-500/30"
              }`}
            >
              <Icon
                className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <span
                className={`font-rajdhani text-base md:text-lg font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                }`}
              >
                {item.label}
              </span>
            </div>
            <ChevronRight
              className={`w-5 h-5 transition-all duration-300 ${
                isActive
                  ? "text-cyan-400 translate-x-1"
                  : "text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  </motion.nav>
);

// Command Bar Component
const CommandBar = ({ onCommand }) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim().toLowerCase());
      setInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-[92%] md:w-[600px] z-50"
      data-testid="command-bar"
    >
      <form onSubmit={handleSubmit}>
        <div
          className={`command-bar glass-panel rounded-full flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 ${
            isFocused ? "ring-1 ring-cyan-500/50" : ""
          }`}
        >
          <Terminal className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter command... (try: open apps, system status)"
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm md:text-base"
            data-testid="command-input"
          />
          <button
            type="submit"
            className="icon-btn w-9 h-9 md:w-10 md:h-10 rounded-full"
            data-testid="command-submit"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Command hints */}
      <div className="flex justify-center gap-2 mt-2 flex-wrap px-2">
        {["open apps", "system status", "search"].map((hint) => (
          <button
            key={hint}
            onClick={() => onCommand(hint)}
            className="text-xs text-slate-500 hover:text-cyan-400 px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-all"
            data-testid={`hint-${hint.replace(" ", "-")}`}
          >
            {hint}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Dashboard Widget Component
const DashboardWidget = ({ icon: Icon, label, value, subValue, color = "cyan" }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className="widget-card"
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          color === "cyan" ? "bg-cyan-500/10" : color === "violet" ? "bg-violet-500/10" : "bg-white/10"
        }`}
      >
        <Icon className={`w-5 h-5 ${color === "cyan" ? "text-cyan-400" : color === "violet" ? "text-violet-400" : "text-slate-400"}`} />
      </div>
    </div>
    <p className="text-2xl md:text-3xl font-bold font-rajdhani text-white mb-1">{value}</p>
    <p className="text-sm text-slate-400 font-medium">{label}</p>
    {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
  </motion.div>
);

// Section Components
const MessagesSection = () => (
  <div className="space-y-3">
    <h2 className="font-orbitron text-lg md:text-xl font-bold text-white mb-4">Messages</h2>
    {MOCK_MESSAGES.map((msg, index) => (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="contact-item"
        data-testid={`message-${msg.id}`}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center border border-cyan-500/30">
          <span className="text-sm font-bold text-cyan-400">{msg.sender.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-white truncate">{msg.sender}</p>
            {msg.unread && <span className="w-2 h-2 rounded-full bg-cyan-400 pulse" />}
          </div>
          <p className="text-sm text-slate-400 truncate">{msg.preview}</p>
        </div>
        <span className="text-xs text-slate-500 flex-shrink-0">{msg.time}</span>
      </motion.div>
    ))}
  </div>
);

const CallsSection = () => (
  <div className="space-y-3">
    <h2 className="font-orbitron text-lg md:text-xl font-bold text-white mb-4">Call History</h2>
    {MOCK_CALLS.map((call, index) => (
      <motion.div
        key={call.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="contact-item"
        data-testid={`call-${call.id}`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center border ${
            call.type === "missed"
              ? "bg-red-500/20 border-red-500/30"
              : call.type === "incoming"
              ? "bg-green-500/20 border-green-500/30"
              : "bg-cyan-500/20 border-cyan-500/30"
          }`}
        >
          <Phone
            className={`w-5 h-5 ${
              call.type === "missed"
                ? "text-red-400"
                : call.type === "incoming"
                ? "text-green-400"
                : "text-cyan-400"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white">{call.name}</p>
          <p className="text-sm text-slate-400 capitalize">{call.type}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">{call.time}</p>
          {call.duration && <p className="text-xs text-slate-600">{call.duration}</p>}
        </div>
      </motion.div>
    ))}
  </div>
);

const ContactsSection = () => (
  <div className="space-y-3">
    <h2 className="font-orbitron text-lg md:text-xl font-bold text-white mb-4">Contacts</h2>
    {MOCK_CONTACTS.map((contact, index) => (
      <motion.div
        key={contact.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="contact-item"
        data-testid={`contact-${contact.id}`}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center border border-white/10">
            <span className="text-sm font-bold text-white">{contact.avatar}</span>
          </div>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0d] ${
              contact.status === "online"
                ? "bg-green-400"
                : contact.status === "away"
                ? "bg-yellow-400"
                : "bg-slate-500"
            }`}
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-white">{contact.name}</p>
          <p className="text-sm text-slate-400 capitalize">{contact.status}</p>
        </div>
        <button className="icon-btn w-10 h-10">
          <Phone className="w-4 h-4" />
        </button>
      </motion.div>
    ))}
  </div>
);

const AppsSection = () => (
  <div>
    <h2 className="font-orbitron text-lg md:text-xl font-bold text-white mb-4">Applications</h2>
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {MOCK_APPS.map((app, index) => {
        const Icon = app.icon;
        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="app-item"
            data-testid={`app-${app.id}`}
          >
            <div
              className="icon-wrapper"
              style={{ backgroundColor: `${app.color}20`, border: `1px solid ${app.color}40` }}
            >
              <Icon style={{ color: app.color }} className="w-6 h-6" />
            </div>
            <span className="text-xs md:text-sm text-slate-300 text-center">{app.name}</span>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const FilesSection = () => (
  <div className="space-y-3">
    <h2 className="font-orbitron text-lg md:text-xl font-bold text-white mb-4">Files</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {MOCK_FILES.map((file, index) => {
        const Icon = file.icon;
        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="widget-card cursor-pointer"
            data-testid={`file-${file.id}`}
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3">
              <Icon className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="font-medium text-white">{file.name}</p>
            <p className="text-xs text-slate-500">{file.count} items • {file.size}</p>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const SettingsSection = () => (
  <div className="space-y-3">
    <h2 className="font-orbitron text-lg md:text-xl font-bold text-white mb-4">Settings</h2>
    <div className="space-y-2">
      {[
        { icon: Wifi, label: "Network", value: "Connected" },
        { icon: Bluetooth, label: "Bluetooth", value: "On" },
        { icon: Volume2, label: "Sound", value: "75%" },
        { icon: Moon, label: "Dark Mode", value: "Enabled" },
        { icon: Shield, label: "Security", value: "Active" },
        { icon: Cpu, label: "Performance", value: "Optimized" },
      ].map((setting, index) => {
        const Icon = setting.icon;
        return (
          <motion.div
            key={setting.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="contact-item"
            data-testid={`setting-${setting.label.toLowerCase()}`}
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
              <Icon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{setting.label}</p>
            </div>
            <span className="text-sm text-cyan-400">{setting.value}</span>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const SystemStatusSection = ({ batteryLevel, storageUsed, memoryUsed }) => (
  <div className="space-y-4">
    <h2 className="font-orbitron text-lg md:text-xl font-bold text-white mb-4">System Status</h2>
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <DashboardWidget icon={Battery} label="Battery" value={`${batteryLevel}%`} subValue="Charging" color="cyan" />
      <DashboardWidget icon={HardDrive} label="Storage" value={`${storageUsed}%`} subValue="64 GB Used" color="violet" />
      <DashboardWidget icon={Cpu} label="Memory" value={`${memoryUsed}%`} subValue="6.2 GB / 8 GB" color="cyan" />
      <DashboardWidget icon={Activity} label="Network" value="98ms" subValue="5G Connected" color="violet" />
    </div>
    <div className="divider-glow my-6" />
    <div className="widget-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">System Health</h3>
        <span className="status-badge online">
          <span className="w-2 h-2 rounded-full bg-cyan-400 pulse" />
          Optimal
        </span>
      </div>
      <div className="space-y-3">
        {[
          { label: "CPU Temperature", value: "42°C", max: 100, current: 42 },
          { label: "Network Speed", value: "125 Mbps", max: 200, current: 125 },
          { label: "Background Apps", value: "4 Active", max: 10, current: 4 },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-slate-300">{item.value}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.current / item.max) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState("messages");
  const [currentTime, setCurrentTime] = useState("");
  const [batteryLevel] = useState(87);
  const [signalStrength] = useState(92);
  const [storageUsed] = useState(68);
  const [memoryUsed] = useState(78);
  const [showSystemStatus, setShowSystemStatus] = useState(false);

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle command input
  const handleCommand = useCallback((command) => {
    const cmd = command.toLowerCase().trim();

    // Navigation commands
    if (cmd.includes("open messages") || cmd === "messages") {
      setActiveSection("messages");
      setShowSystemStatus(false);
      toast.success("Opening Messages");
    } else if (cmd.includes("open calls") || cmd === "calls") {
      setActiveSection("calls");
      setShowSystemStatus(false);
      toast.success("Opening Calls");
    } else if (cmd.includes("open contacts") || cmd === "contacts") {
      setActiveSection("contacts");
      setShowSystemStatus(false);
      toast.success("Opening Contacts");
    } else if (cmd.includes("open apps") || cmd === "apps") {
      setActiveSection("apps");
      setShowSystemStatus(false);
      toast.success("Opening Apps");
    } else if (cmd.includes("open files") || cmd === "files") {
      setActiveSection("files");
      setShowSystemStatus(false);
      toast.success("Opening Files");
    } else if (cmd.includes("open settings") || cmd === "settings") {
      setActiveSection("settings");
      setShowSystemStatus(false);
      toast.success("Opening Settings");
    } else if (cmd.includes("system status") || cmd === "status") {
      setShowSystemStatus(true);
      toast.success("Showing System Status");
    } else if (cmd.includes("search")) {
      toast.info("Search functionality activated");
    } else if (cmd.includes("help")) {
      toast.info("Available commands: open [section], system status, search");
    } else {
      toast.error(`Unknown command: "${command}"`);
    }
  }, []);

  // Render section content
  const renderSection = () => {
    if (showSystemStatus) {
      return (
        <SystemStatusSection
          batteryLevel={batteryLevel}
          storageUsed={storageUsed}
          memoryUsed={memoryUsed}
        />
      );
    }

    switch (activeSection) {
      case "messages":
        return <MessagesSection />;
      case "calls":
        return <CallsSection />;
      case "contacts":
        return <ContactsSection />;
      case "apps":
        return <AppsSection />;
      case "files":
        return <FilesSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <MessagesSection />;
    }
  };

  return (
    <div className="auriona-launcher" data-testid="auriona-launcher">
      {/* Background effects */}
      <div className="auriona-bg-glow" />
      <div className="auriona-bg-glow-bottom" />
      <div className="grid-background absolute inset-0 z-0" />

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* System Header */}
        <SystemHeader
          currentTime={currentTime}
          batteryLevel={batteryLevel}
          signalStrength={signalStrength}
        />

        {/* Main Layout */}
        <div className="flex-1 px-4 md:px-8 pb-32 overflow-hidden">
          <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Navigation Menu - Sidebar on desktop, top on mobile */}
            <div className="md:col-span-4 lg:col-span-3 order-2 md:order-1">
              <NavigationMenu
                activeSection={activeSection}
                onSelectSection={(section) => {
                  setActiveSection(section);
                  setShowSystemStatus(false);
                }}
              />
            </div>

            {/* Content Area */}
            <div className="md:col-span-8 lg:col-span-9 order-1 md:order-2 overflow-y-auto pb-4" data-testid="content-area">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel rounded-2xl md:rounded-3xl p-4 md:p-6 min-h-[300px]"
              >
                {/* Back button when in system status */}
                {showSystemStatus && (
                  <button
                    onClick={() => setShowSystemStatus(false)}
                    className="flex items-center gap-2 text-cyan-400 mb-4 hover:text-cyan-300 transition-colors"
                    data-testid="back-button"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Menu</span>
                  </button>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={showSystemStatus ? "status" : activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderSection()}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Command Bar */}
        <CommandBar onCommand={handleCommand} />
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(10, 10, 15, 0.9)",
            border: "1px solid rgba(0, 240, 255, 0.2)",
            color: "#F8FAFC",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </div>
  );
}

export default App;
