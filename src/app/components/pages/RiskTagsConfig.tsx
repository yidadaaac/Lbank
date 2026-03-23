import { useState } from "react";
import { Search, Calendar, Edit, Trash2, Eye, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface RiskTag {
  id: string;
  tagId: string;
  name: string;
  description: string;
  riskLevel: string;
  scope: string;
  timeRange: string;
  configParams: string;
  enabled: boolean;
  createdTime: string;
  updatedTime: string;
  lastUpdatedBy: string;
}

const mockData: RiskTag[] = [
  {
    id: "1",
    tagId: "Black_list",
    name: "黑名单",
    description: "用户任一交易权限被限制后自动打标，包括：C2C冻结、限制购买、限制出售。",
    riskLevel: "高风险",
    scope: "所有用户",
    timeRange: "实时 / 无统计周期",
    configParams: "不支持配置",
    enabled: true,
    createdTime: "2026/3/20 10:00",
    updatedTime: "2026/3/20 10:00",
    lastUpdatedBy: "Bridge.zhong",
  },
  {
    id: "2",
    tagId: "Quick_in_out",
    name: "快进快出",
    description: "商家在过去24小时内，若最新一笔成功完成订单与后一笔反方向成功完成订单的时间差小于60分钟，则打标。",
    riskLevel: "高风险",
    scope: "商家用户",
    timeRange: "过去24小时",
    configParams: "时间差阈值 = 60分钟",
    enabled: false,
    createdTime: "2026/3/20 10:00",
    updatedTime: "2026/3/20 10:00",
    lastUpdatedBy: "Bridge.zhong",
  },
  {
    id: "3",
    tagId: "Buy_high_sell_low",
    name: "高买低卖",
    description: "用户在过去24小时内，针对同一交易对，若（最新买单价格 - 最新卖单价格）/ 最新卖单价格 ≥ 10%，则打标。",
    riskLevel: "中风险",
    scope: "所有用户",
    timeRange: "过去24小时",
    configParams: "价差比例阈值 = 10%",
    enabled: true,
    createdTime: "2026/3/20 10:00",
    updatedTime: "2026/3/20 10:00",
    lastUpdatedBy: "Bridge.zhong",
  },
  {
    id: "4",
    tagId: "Fast_confirmation",
    name: "确认时间超短",
    description: "商家在过去24小时内，若订单状态流转满足：待付款→已付款 ≤ 40秒，或已付款→已放币 ≤ 40秒，则打标。",
    riskLevel: "中风险",
    scope: "商家用户",
    timeRange: "过去24小时",
    configParams: "待付款→已付款阈值 = 40秒；已付款→已放币阈值 = 40秒",
    enabled: true,
    createdTime: "2026/3/20 10:00",
    updatedTime: "2026/3/20 10:00",
    lastUpdatedBy: "Bridge.zhong",
  },
  {
    id: "5",
    tagId: "Multi_account_device",
    name: "多账户设备关联",
    description: "在过去24小时内，若同一设备ID关联的不同账户数量 ≥ 3个，则对该设备下所有关联用户打标。",
    riskLevel: "中风险",
    scope: "所有用户",
    timeRange: "过去24小时",
    configParams: "关联账户数量阈值 = 3个",
    enabled: false,
    createdTime: "2026/3/20 10:00",
    updatedTime: "2026/3/20 10:00",
    lastUpdatedBy: "Bridge.zhong",
  },
  {
    id: "6",
    tagId: "Trade_with_blacklist",
    name: "与黑名单账户交易",
    description: "用户在过去24小时内，若与已被打上黑名单标签的用户之间成功成交订单数 ≥ 3笔，则打标。",
    riskLevel: "高风险",
    scope: "所有用户",
    timeRange: "过去24小时",
    configParams: "成交笔数阈值 = 3笔",
    enabled: true,
    createdTime: "2026/3/20 10:00",
    updatedTime: "2026/3/20 10:00",
    lastUpdatedBy: "Bridge.zhong",
  },
  {
    id: "7",
    tagId: "Frequent_cancel",
    name: "高频取消",
    description: "用户在过去24小时内，若主动取消订单数 ≥ 3笔，则打标。",
    riskLevel: "低风险",
    scope: "所有用户",
    timeRange: "过去24小时",
    configParams: "主动取消订单数阈值 = 3笔",
    enabled: false,
    createdTime: "2026/3/20 10:00",
    updatedTime: "2026/3/20 10:00",
    lastUpdatedBy: "Bridge.zhong",
  },
];

export default function RiskTagsConfig() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [tagName, setTagName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<RiskTag | null>(null);

  const handleEdit = (tag: RiskTag) => {
    setSelectedTag(tag);
    setIsEditOpen(true);
  };

  const handleView = (tag: RiskTag) => {
    setSelectedTag(tag);
    setIsViewOpen(true);
  };

  // 根据标签获取阈值配置
  const getThresholdConfig = (tag: RiskTag | null) => {
    if (!tag) return { value: "40", label: "阈值", description: "当前配置：待付款→已付款阈值 = 40秒；已付款→已放币阈值 = 40秒", disabled: false };
    
    switch (tag.tagId) {
      case "Black_list":
        return { value: "", label: "阈值", description: "不支持配置", disabled: true };
      case "Quick_in_out":
        return { value: "60", label: "时间差阈值（分钟）", description: "当前配置：时间差阈值 = 60分钟", disabled: false };
      case "Buy_high_sell_low":
        return { value: "10", label: "价差比例阈值（%）", description: "当前配置：价差比例阈值 = 10%", disabled: false };
      case "Fast_confirmation":
        return { value: "40", label: "阈值（秒）", description: "当前配置：待付款→已付款阈值 = 40秒；已付款→已放币阈值 = 40秒", disabled: false };
      case "Multi_account_device":
        return { value: "3", label: "关联账户数量阈值（个）", description: "当前配置：关联账户数量阈值 = 3个", disabled: false };
      case "Trade_with_blacklist":
        return { value: "3", label: "成交笔数阈值（笔）", description: "当前配置：成交笔数阈值 = 3笔", disabled: false };
      case "Frequent_cancel":
        return { value: "3", label: "主动取消订单数阈值（笔）", description: "当前配置：主动取消订单数阈值 = 3笔", disabled: false };
      default:
        return { value: "40", label: "阈值", description: "当前配置：待付款→已付款阈值 = 40秒；已付款→已放币阈值 = 40秒", disabled: false };
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">P2P风控标签</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={tagName} onValueChange={setTagName}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="标签名称" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="黑名单">黑名单</SelectItem>
                <SelectItem value="快进快出">快进快出</SelectItem>
                <SelectItem value="高买低卖">高买低卖</SelectItem>
                <SelectItem value="确认时间超短">确认时间超短</SelectItem>
                <SelectItem value="多账户设备关联">多账户设备关联</SelectItem>
                <SelectItem value="与黑名单账户交易">与黑名单账户交易</SelectItem>
                <SelectItem value="高频取消">高频取消</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="开始时间"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="结束时间"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setTagName("");
              setStartDate("");
              setEndDate("");
            }}>
              重置
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-1" />
              搜索
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">标签ID</TableHead>
              <TableHead className="font-medium">标签名称</TableHead>
              <TableHead className="font-medium w-[400px]">标签定义（说明）</TableHead>
              <TableHead className="font-medium">风险等级</TableHead>
              <TableHead className="font-medium">范围</TableHead>
              <TableHead className="font-medium">创建时间</TableHead>
              <TableHead className="font-medium">更新时间</TableHead>
              <TableHead className="font-medium">最后更新人</TableHead>
              <TableHead className="font-medium">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="text-gray-900 font-mono text-sm">{tag.tagId}</TableCell>
                <TableCell className="text-gray-900">{tag.name}</TableCell>
                <TableCell className="text-gray-700 w-[400px]">
                  <div className="truncate max-w-[400px]" title={tag.description}>
                    {tag.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {tag.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700">{tag.scope}</TableCell>
                <TableCell className="text-gray-700">{tag.createdTime}</TableCell>
                <TableCell className="text-gray-700">{tag.updatedTime}</TableCell>
                <TableCell className="text-gray-700">{tag.lastUpdatedBy}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {tag.enabled ? "停用" : "启用"}
                    </button>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleEdit(tag)}
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleView(tag)}
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">共7条</div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &lt;
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              {currentPage}
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &gt;
            </button>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 条/页</SelectItem>
                <SelectItem value="20">20 条/页</SelectItem>
                <SelectItem value="50">50 条/页</SelectItem>
                <SelectItem value="100">100 条/页</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Edit Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-gray-200">
            <SheetTitle className="text-lg">编辑风控标签</SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              修改风控标签的配置信息
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                基本信息
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="tag-id" className="text-sm font-medium text-gray-700">
                  标签ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tag-id"
                  defaultValue={selectedTag?.tagId || "Black_list"}
                  className="h-10 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag-name" className="text-sm font-medium text-gray-700">
                  标签名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tag-name"
                  defaultValue={selectedTag?.name || "黑名单"}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag-definition" className="text-sm font-medium text-gray-700">
                  标签定义（说明）
                </Label>
                <Textarea
                  id="tag-definition"
                  defaultValue={selectedTag?.description || "用户任一交易权限被限制后自动打标"}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* 风险规则配置 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                风险规则配置
              </h3>

              <div className="space-y-2">
                <Label htmlFor="risk-level" className="text-sm font-medium text-gray-700">
                  风险等级
                </Label>
                <Select defaultValue={selectedTag?.riskLevel || "高风险"}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="高风险">高风险</SelectItem>
                    <SelectItem value="中风险">中风险</SelectItem>
                    <SelectItem value="低风险">低风险</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope" className="text-sm font-medium text-gray-700">
                  范围
                </Label>
                <Select defaultValue={selectedTag?.scope || "所有用户"}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="所有用户">所有用户</SelectItem>
                    <SelectItem value="商家用户">商家用户</SelectItem>
                    <SelectItem value="普通用户">普通用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-range" className="text-sm font-medium text-gray-700">
                  时间范围 <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="time-range" 
                  defaultValue={selectedTag?.timeRange?.match(/\d+/)?.[0] || "24"} 
                  className="h-10"
                  type="number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  当前配置：过去24小时
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="config-params" className="text-sm font-medium text-gray-700">
                  {getThresholdConfig(selectedTag).label} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="config-params"
                  defaultValue={getThresholdConfig(selectedTag).value}
                  className="h-10"
                  type="number"
                  disabled={getThresholdConfig(selectedTag).disabled}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {getThresholdConfig(selectedTag).description}
                </p>
              </div>
            </div>

            {/* 状态配置 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                状态配置
              </h3>

              <div className="space-y-2">
                <Label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                  启用状态
                </Label>
                <Select defaultValue={selectedTag?.enabled ? "enabled" : "disabled"}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">启用</SelectItem>
                    <SelectItem value="disabled">禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button 
              variant="outline" 
              onClick={() => setIsEditOpen(false)}
              className="h-10 px-6"
            >
              取消
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 h-10 px-6" 
              onClick={() => setIsEditOpen(false)}
            >
              保存
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* View Sheet */}
      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-gray-200">
            <SheetTitle className="text-lg">查看风控标签</SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              查看风控标签的配置信息
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                基本信息
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="tag-id" className="text-sm font-medium text-gray-700">
                  标签ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tag-id"
                  defaultValue={selectedTag?.tagId || "Black_list"}
                  className="h-10 font-mono"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag-name" className="text-sm font-medium text-gray-700">
                  标签名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tag-name"
                  defaultValue={selectedTag?.name || "黑名单"}
                  className="h-10"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag-definition" className="text-sm font-medium text-gray-700">
                  标签定义（说明）
                </Label>
                <Textarea
                  id="tag-definition"
                  defaultValue={selectedTag?.description || "用户任一交易权限被限制后自动打标"}
                  rows={3}
                  className="resize-none"
                  readOnly
                />
              </div>
            </div>

            {/* 风险规则配置 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                风险规则配置
              </h3>

              <div className="space-y-2">
                <Label htmlFor="risk-level" className="text-sm font-medium text-gray-700">
                  风险等级
                </Label>
                <Select defaultValue={selectedTag?.riskLevel || "高风险"}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="高风险">高风险</SelectItem>
                    <SelectItem value="中风险">中风险</SelectItem>
                    <SelectItem value="低风险">低风险</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope" className="text-sm font-medium text-gray-700">
                  范围
                </Label>
                <Select defaultValue={selectedTag?.scope || "所有用户"}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="所有用户">所有用户</SelectItem>
                    <SelectItem value="商家用户">商家用户</SelectItem>
                    <SelectItem value="普通用户">普通用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-range" className="text-sm font-medium text-gray-700">
                  时间范围 <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="time-range" 
                  defaultValue={selectedTag?.timeRange?.match(/\d+/)?.[0] || "24"} 
                  className="h-10"
                  type="number"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  当前配置：过去24小时
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="config-params" className="text-sm font-medium text-gray-700">
                  {getThresholdConfig(selectedTag).label} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="config-params"
                  defaultValue={getThresholdConfig(selectedTag).value}
                  className="h-10"
                  type="number"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  {getThresholdConfig(selectedTag).description}
                </p>
              </div>
            </div>

            {/* 状态配置 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                状态配置
              </h3>

              <div className="space-y-2">
                <Label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                  启用状态
                </Label>
                <Select defaultValue={selectedTag?.enabled ? "enabled" : "disabled"}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">启用</SelectItem>
                    <SelectItem value="disabled">禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button 
              variant="outline" 
              onClick={() => setIsViewOpen(false)}
              className="h-10 px-6"
            >
              关闭
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}