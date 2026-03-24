import { useState } from "react";
import { Search, Calendar, Plus, AlertCircle } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner";

interface BlacklistUser {
  id: string;
  uid: string;
  nickname: string;
  realName: string;
  userType: "商家" | "普通用户";
  country: string;
  addReason: "手动添加" | "平台风控" | "业务风控";
  restrictions: Array<"购买权限" | "出售权限" | "发布广告权限">;
  unlockTime: string | "永久";
  addTime: string;
  updateTime: string;
  lastOperator: string;
}

const mockData: BlacklistUser[] = [
  {
    id: "1",
    uid: "123456789",
    nickname: "用户A",
    realName: "张三",
    userType: "商家",
    country: "中国",
    addReason: "手动添加",
    restrictions: ["购买权限", "出售权限"],
    unlockTime: "2026/4/20 10:00:00",
    addTime: "2026/3/20 10:00:00",
    updateTime: "2026/3/20 10:00:00",
    lastOperator: "管理员1",
  },
  {
    id: "2",
    uid: "987654321",
    nickname: "用户B",
    realName: "李四",
    userType: "普通用户",
    country: "美国",
    addReason: "平台风控",
    restrictions: ["购买权限", "出售权限"],
    unlockTime: "永久",
    addTime: "2026/3/19 14:30:00",
    updateTime: "2026/3/19 14:30:00",
    lastOperator: "平台风控",
  },
  {
    id: "3",
    uid: "555666777",
    nickname: "商家C",
    realName: "王五",
    userType: "商家",
    country: "日本",
    addReason: "手动添加",
    restrictions: ["发布广告权限"],
    unlockTime: "2026/4/5 09:00:00",
    addTime: "2026/3/18 16:45:00",
    updateTime: "2026/3/18 16:45:00",
    lastOperator: "管理员3",
  },
  {
    id: "4",
    uid: "111222333",
    nickname: "用户D",
    realName: "赵六",
    userType: "普通用户",
    country: "韩国",
    addReason: "业务风控",
    restrictions: [],
    unlockTime: "",
    addTime: "2026/3/15 11:20:00",
    updateTime: "2026/3/15 11:20:00",
    lastOperator: "管理员4",
  },
];

export default function BlacklistManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  
  // 筛选条件
  const [filterUid, setFilterUid] = useState("");
  const [filterNickname, setFilterNickname] = useState("");
  const [filterRealName, setFilterRealName] = useState("");
  const [filterUserType, setFilterUserType] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterAddReason, setFilterAddReason] = useState("");
  const [filterRestriction, setFilterRestriction] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 弹窗状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRestrictionDialogOpen, setIsRestrictionDialogOpen] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [isReleaseConfirmOpen, setIsReleaseConfirmOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BlacklistUser | null>(null);

  // 新增黑名单表单
  const [newUid, setNewUid] = useState("");
  const [detectedUserType, setDetectedUserType] = useState<"商家" | "普通用户" | null>(null);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  // 权限限制表单
  const [restrictionType, setRestrictionType] = useState<string[]>([]);
  const [restrictionDuration, setRestrictionDuration] = useState<"永久" | "按天限制">("永久");
  const [restrictionDays, setRestrictionDays] = useState("");

  // 解除限制表单
  const [releaseRestrictions, setReleaseRestrictions] = useState<string[]>([]);

  const handleResetFilters = () => {
    setFilterUid("");
    setFilterNickname("");
    setFilterRealName("");
    setFilterUserType("");
    setFilterCountry("");
    setFilterAddReason("");
    setFilterRestriction("");
    setFilterStatus("");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  const handleAddBlacklist = () => {
    setIsAddDialogOpen(true);
    setNewUid("");
    setDetectedUserType(null);
    setSelectedRestrictions([]);
  };

  const handleUidChange = (uid: string) => {
    setNewUid(uid);
    // 模拟自动识别用户类型
    if (uid.length >= 6) {
      // 简单规则：偶数最后一位为商家，奇数为普通用户
      const lastDigit = parseInt(uid[uid.length - 1]);
      setDetectedUserType(lastDigit % 2 === 0 ? "商家" : "普通用户");
    } else {
      setDetectedUserType(null);
    }
  };

  const handleRestrictionToggle = (restriction: string) => {
    if (restriction === "全部") {
      if (selectedRestrictions.includes("全部")) {
        setSelectedRestrictions([]);
      } else {
        const allRestrictions = detectedUserType === "商家" 
          ? ["全部", "限制购买", "限制出售", "限制发布广告"]
          : ["全部", "限制购买", "限制出售"];
        setSelectedRestrictions(allRestrictions);
      }
    } else {
      setSelectedRestrictions(prev => 
        prev.includes(restriction) 
          ? prev.filter(r => r !== restriction && r !== "全部")
          : [...prev.filter(r => r !== "全部"), restriction]
      );
    }
  };

  const handleConfirmAdd = () => {
    if (!newUid) {
      toast.error("用户不存在，请检查 UID 后重试");
      return;
    }
    toast.success("新增黑名单成功");
    setIsAddDialogOpen(false);
  };

  const handleOpenRestriction = (user: BlacklistUser) => {
    setSelectedUser(user);
    setRestrictionType([]);
    setRestrictionDuration("永久");
    setRestrictionDays("");
    setIsRestrictionDialogOpen(true);
  };

  const handleConfirmRestriction = () => {
    toast.success("权限限制已生效");
    setIsRestrictionDialogOpen(false);
  };

  const handleOpenRelease = (user: BlacklistUser) => {
    setSelectedUser(user);
    setReleaseRestrictions([]);
    setIsReleaseDialogOpen(true);
  };

  const handleConfirmRelease = () => {
    setIsReleaseDialogOpen(false);
    setIsReleaseConfirmOpen(true);
  };

  const handleFinalRelease = () => {
    toast.success("权限已解除");
    setIsReleaseConfirmOpen(false);
  };

  const handleRemove = (user: BlacklistUser) => {
    setSelectedUser(user);
    setIsRemoveDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    toast.success("已移除黑名单");
    setIsRemoveDialogOpen(false);
  };

  const canRemove = (user: BlacklistUser) => {
    return user.restrictions.length === 0;
  };

  const hasRestrictions = (user: BlacklistUser) => {
    return user.restrictions.length > 0;
  };

  const getRestrictionBadgeVariant = (restriction: string) => {
    return "secondary";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">P2P黑名单管理</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <Input
              placeholder="UID"
              value={filterUid}
              onChange={(e) => setFilterUid(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="用户昵称"
              value={filterNickname}
              onChange={(e) => setFilterNickname(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="用户实名"
              value={filterRealName}
              onChange={(e) => setFilterRealName(e.target.value)}
            />
          </div>
          <div>
            <Select value={filterUserType} onValueChange={setFilterUserType}>
              <SelectTrigger>
                <SelectValue placeholder="用户类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="商家">商家</SelectItem>
                <SelectItem value="普通用户">普通用户</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger>
                <SelectValue placeholder="国家" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="中国">中国</SelectItem>
                <SelectItem value="美国">美国</SelectItem>
                <SelectItem value="日本">日本</SelectItem>
                <SelectItem value="韩国">韩国</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterAddReason} onValueChange={setFilterAddReason}>
              <SelectTrigger>
                <SelectValue placeholder="添加原因" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="手动添加">手动添加</SelectItem>
                <SelectItem value="平台风控">平台风控</SelectItem>
                <SelectItem value="业务风控">业务风控</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterRestriction} onValueChange={setFilterRestriction}>
              <SelectTrigger>
                <SelectValue placeholder="禁用权限" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="购买权限">购买权限</SelectItem>
                <SelectItem value="出售权限">出售权限</SelectItem>
                <SelectItem value="发布广告权限">发布广告权限</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="限制中">限制中</SelectItem>
                <SelectItem value="已全部解除">已全部解除</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="创建开始时间"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="创建结束时间"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetFilters}>
              重置
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-1" />
              查询
            </Button>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="mb-4">
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleAddBlacklist}
        >
          <Plus className="w-4 h-4 mr-1" />
          新增黑名单
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">UID</TableHead>
              <TableHead className="font-medium">用户昵称</TableHead>
              <TableHead className="font-medium">用户实名</TableHead>
              <TableHead className="font-medium">用户类型</TableHead>
              <TableHead className="font-medium">国家</TableHead>
              <TableHead className="font-medium">添加原因</TableHead>
              <TableHead className="font-medium">禁用权限</TableHead>
              <TableHead className="font-medium">解锁时间</TableHead>
              <TableHead className="font-medium">创建时间</TableHead>
              <TableHead className="font-medium">更新时间</TableHead>
              <TableHead className="font-medium">最后操作人</TableHead>
              <TableHead className="font-medium">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-gray-900 font-mono text-sm">{user.uid}</TableCell>
                <TableCell className="text-gray-900">{user.nickname}</TableCell>
                <TableCell className="text-gray-700">{user.realName}</TableCell>
                <TableCell className="text-gray-700">{user.userType}</TableCell>
                <TableCell className="text-gray-700">{user.country}</TableCell>
                <TableCell className="text-gray-700">{user.addReason}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.restrictions.map((restriction) => (
                      <Badge 
                        key={restriction} 
                        variant={getRestrictionBadgeVariant(restriction)}
                        className="text-xs"
                      >
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">{user.unlockTime}</TableCell>
                <TableCell className="text-gray-700">{user.addTime}</TableCell>
                <TableCell className="text-gray-700">{user.updateTime}</TableCell>
                <TableCell className="text-gray-700">{user.lastOperator}</TableCell>
                <TableCell>
                  {user.addReason !== "平台风控" && (
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        onClick={() => handleOpenRestriction(user)}
                      >
                        权限限制
                      </button>
                      {hasRestrictions(user) && (
                        <button 
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          onClick={() => handleOpenRelease(user)}
                        >
                          解除限制
                        </button>
                      )}
                      {canRemove(user) && (
                        <button 
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                          onClick={() => handleRemove(user)}
                        >
                          移除黑名单
                        </button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">共{mockData.length}条</div>
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

      {/* 新增黑名单弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新增黑名单</DialogTitle>
            <DialogDescription>
              请输入用户UID并选择需要限制的权限
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="uid">
                用户UID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="uid"
                placeholder="请输入用户UID"
                value={newUid}
                onChange={(e) => handleUidChange(e.target.value)}
              />
            </div>
            {detectedUserType && (
              <div className="space-y-2">
                <Label>用户类型</Label>
                <Input value={detectedUserType} readOnly className="bg-gray-50" />
              </div>
            )}
            {detectedUserType && (
              <div className="space-y-2">
                <Label>权限限制</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all"
                      checked={selectedRestrictions.includes("全部")}
                      onCheckedChange={() => handleRestrictionToggle("全部")}
                    />
                    <label htmlFor="all" className="text-sm font-medium cursor-pointer">
                      全部
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="buy"
                      checked={selectedRestrictions.includes("限制购买")}
                      onCheckedChange={() => handleRestrictionToggle("限制购买")}
                    />
                    <label htmlFor="buy" className="text-sm font-medium cursor-pointer">
                      限制购买
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sell"
                      checked={selectedRestrictions.includes("限制出售")}
                      onCheckedChange={() => handleRestrictionToggle("限制出售")}
                    />
                    <label htmlFor="sell" className="text-sm font-medium cursor-pointer">
                      限制出售
                    </label>
                  </div>
                  {detectedUserType === "商家" && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ad"
                        checked={selectedRestrictions.includes("限制发布广告")}
                        onCheckedChange={() => handleRestrictionToggle("限制发布广告")}
                      />
                      <label htmlFor="ad" className="text-sm font-medium cursor-pointer">
                        限制发布广告
                      </label>
                    </div>
                  )}
                  {detectedUserType === "普通用户" && (
                    <div className="flex items-center space-x-2 opacity-50">
                      <Checkbox id="ad-disabled" disabled />
                      <label htmlFor="ad-disabled" className="text-sm font-medium">
                        限制发布广告
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmAdd}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 权限限制弹窗 */}
      <Dialog open={isRestrictionDialogOpen} onOpenChange={setIsRestrictionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>权限限制</DialogTitle>
            <DialogDescription>
              设置用户的权限限制
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedUser && (
              <>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">UID:</span>
                    <span className="text-sm text-gray-900 font-mono">{selectedUser.uid}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">用户昵称:</span>
                    <span className="text-sm text-gray-900">{selectedUser.nickname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">用户类型:</span>
                    <span className="text-sm text-gray-900">{selectedUser.userType}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>权限限制</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="restrict-all"
                        checked={restrictionType.includes("全部")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRestrictionType(
                              selectedUser.userType === "商家"
                                ? ["全部", "限制购买", "限制出售", "限制发布广告"]
                                : ["全部", "限制购买", "限制出售"]
                            );
                          } else {
                            setRestrictionType([]);
                          }
                        }}
                      />
                      <label htmlFor="restrict-all" className="text-sm font-medium cursor-pointer">
                        全部
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="restrict-buy"
                        checked={restrictionType.includes("限制购买")}
                        onCheckedChange={(checked) => {
                          setRestrictionType(prev => 
                            checked 
                              ? [...prev.filter(r => r !== "全部"), "限制购买"]
                              : prev.filter(r => r !== "限制购买" && r !== "全部")
                          );
                        }}
                      />
                      <label htmlFor="restrict-buy" className="text-sm font-medium cursor-pointer">
                        限制购买
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="restrict-sell"
                        checked={restrictionType.includes("限制出售")}
                        onCheckedChange={(checked) => {
                          setRestrictionType(prev => 
                            checked 
                              ? [...prev.filter(r => r !== "全部"), "限制出售"]
                              : prev.filter(r => r !== "限制出售" && r !== "全部")
                          );
                        }}
                      />
                      <label htmlFor="restrict-sell" className="text-sm font-medium cursor-pointer">
                        限制出售
                      </label>
                    </div>
                    {selectedUser.userType === "商家" ? (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="restrict-ad"
                          checked={restrictionType.includes("限制发布广告")}
                          onCheckedChange={(checked) => {
                            setRestrictionType(prev => 
                              checked 
                                ? [...prev.filter(r => r !== "全部"), "限制发布广告"]
                                : prev.filter(r => r !== "限制发布广告" && r !== "全部")
                            );
                          }}
                        />
                        <label htmlFor="restrict-ad" className="text-sm font-medium cursor-pointer">
                          限制发布广告
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 opacity-50">
                        <Checkbox id="restrict-ad-disabled" disabled />
                        <label htmlFor="restrict-ad-disabled" className="text-sm font-medium">
                          限制发布广告
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>限制时间</Label>
                  <RadioGroup value={restrictionDuration} onValueChange={(value: any) => setRestrictionDuration(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="永久" id="duration-permanent" />
                      <label htmlFor="duration-permanent" className="text-sm font-medium cursor-pointer">
                        永久
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="按天限制" id="duration-days" />
                      <label htmlFor="duration-days" className="text-sm font-medium cursor-pointer">
                        按天限制
                      </label>
                    </div>
                  </RadioGroup>
                  {restrictionDuration === "按天限制" && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="请输入天数"
                        value={restrictionDays}
                        onChange={(e) => setRestrictionDays(e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">天</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestrictionDialogOpen(false)}>
              取消
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmRestriction}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 解除限制弹窗 */}
      <Dialog open={isReleaseDialogOpen} onOpenChange={setIsReleaseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>解除限制</DialogTitle>
            <DialogDescription>
              选择需要解除的权限限制
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedUser && (
              <>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">UID:</span>
                    <span className="text-sm text-gray-900 font-mono">{selectedUser.uid}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">用户昵称:</span>
                    <span className="text-sm text-gray-900">{selectedUser.nickname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">用户类型:</span>
                    <span className="text-sm text-gray-900">{selectedUser.userType}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>可解除限选择</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="release-all"
                        checked={releaseRestrictions.includes("全部")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // 只选中可解除的项（非平台风控）
                            const releasable = selectedUser.addReason !== "平台风控" 
                              ? ["全部", ...selectedUser.restrictions.map(r => r.replace("权限", ""))]
                              : ["全部"];
                            setReleaseRestrictions(releasable);
                          } else {
                            setReleaseRestrictions([]);
                          }
                        }}
                      />
                      <label htmlFor="release-all" className="text-sm font-medium cursor-pointer">
                        全部
                      </label>
                    </div>
                    {selectedUser.restrictions.includes("购买权限") && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="release-buy"
                            checked={releaseRestrictions.includes("购买")}
                            disabled={selectedUser.addReason === "平台风控"}
                            onCheckedChange={(checked) => {
                              setReleaseRestrictions(prev => 
                                checked 
                                  ? [...prev.filter(r => r !== "全部"), "购买"]
                                  : prev.filter(r => r !== "购买" && r !== "全部")
                              );
                            }}
                          />
                          <label htmlFor="release-buy" className="text-sm font-medium cursor-pointer">
                            限制购买
                          </label>
                        </div>
                        {selectedUser.addReason === "平台风控" && (
                          <span className="text-xs text-gray-400">平台限制，无法解除</span>
                        )}
                      </div>
                    )}
                    {selectedUser.restrictions.includes("出售权限") && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="release-sell"
                            checked={releaseRestrictions.includes("出售")}
                            disabled={selectedUser.addReason === "平台风控"}
                            onCheckedChange={(checked) => {
                              setReleaseRestrictions(prev => 
                                checked 
                                  ? [...prev.filter(r => r !== "全部"), "出售"]
                                  : prev.filter(r => r !== "出售" && r !== "全部")
                              );
                            }}
                          />
                          <label htmlFor="release-sell" className="text-sm font-medium cursor-pointer">
                            限制出售
                          </label>
                        </div>
                        {selectedUser.addReason === "平台风控" && (
                          <span className="text-xs text-gray-400">平台限制，无法解除</span>
                        )}
                      </div>
                    )}
                    {selectedUser.restrictions.includes("发布广告权限") && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="release-ad"
                            checked={releaseRestrictions.includes("发布广告")}
                            disabled={selectedUser.addReason === "平台风控"}
                            onCheckedChange={(checked) => {
                              setReleaseRestrictions(prev => 
                                checked 
                                  ? [...prev.filter(r => r !== "全部"), "发布告"]
                                  : prev.filter(r => r !== "发布广告" && r !== "全部")
                              );
                            }}
                          />
                          <label htmlFor="release-ad" className="text-sm font-medium cursor-pointer">
                            限制发布广告
                          </label>
                        </div>
                        {selectedUser.addReason === "平台风控" && (
                          <span className="text-xs text-gray-400">平台限制，无法解除</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReleaseDialogOpen(false)}>
              取消
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmRelease}>
              确定解除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 解除限制二次确认弹窗 */}
      <Dialog open={isReleaseConfirmOpen} onOpenChange={setIsReleaseConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              确认解除限制？
            </DialogTitle>
            <DialogDescription>
              解除后将恢复该用户对应权限，请确认是否继续
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReleaseConfirmOpen(false)}>
              取消
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleFinalRelease}>
              确认解除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 移除黑名单确认弹窗 */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              确认移除黑名单？
            </DialogTitle>
            <DialogDescription>
              移除后，该用户将不再出现在黑名单列表中，请确认是否继续
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              取消
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleConfirmRemove}>
              确认移除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}