import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronDown,
  ChevronRight,
  Search,
  LogOut,
  FileText,
  Shield,
  ShieldAlert,
  CreditCard,
  Database,
  TrendingUp,
  Settings,
  Globe,
  Activity,
  BarChart3,
  Flame,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "fiat-business",
    label: "法币业务",
    icon: <CreditCard className="w-4 h-4" />,
    children: [
      {
        id: "p2p-business",
        label: "P2P业务管理",
        children: [
          {
            id: "blacklist",
            label: "P2P黑名单管理",
            path: "/blacklist",
          },
        ],
      },
      {
        id: "new-system-business",
        label: "法币新系统业务管理",
        children: [
          {
            id: "risk-tags",
            label: "风控标签配置",
            children: [
              {
                id: "p2p-risk",
                label: "P2P风险标签",
                path: "/",
              },
              {
                id: "otc-risk",
                label: "OTC风险标签",
                path: "/otc-risk-tags",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["fiat-business", "new-system-business", "risk-tags"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = location.pathname === item.path;

    // Calculate padding based on depth (in pixels)
    const paddingLeft = depth === 0 ? 16 : 16 + depth * 16;

    return (
      <div key={item.id}>
        {item.path ? (
          <Link
            to={item.path}
            style={{ paddingLeft: `${paddingLeft}px` }}
            className={`flex items-center gap-2 pr-4 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
          </Link>
        ) : (
          <button
            onClick={() => hasChildren && toggleExpanded(item.id)}
            style={{ paddingLeft: `${paddingLeft}px` }}
            className={`flex items-center gap-2 pr-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 w-full transition-colors`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ))}
          </button>
        )}
        {hasChildren && isExpanded && (
          <div className={depth === 0 ? "bg-gray-50" : ""}>
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-52 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">TWALK</h1>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* User Info */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xs text-white">BZ</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-900 truncate">bridge.zhong@ibk...</p>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <LogOut className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </aside>
  );
}