import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';

import {
  TruckIcon,
  Receipt,
  Package,
  Wallet,
  Users,
  UserSquare,
  Handshake,
  LogOut
} from 'lucide-react';

import { useAuth } from '../../utils/authContext';
import { TruckDriverManager } from './TruckDriverManager';
import { ExpenseManager } from './ExpenseManager';
import { MaalInManager } from './MaalInManager';
import { RokadiManager } from './RokadiManager';
import { FeriwalaManager } from './FeriwalaManager';
import { LabourManager } from './LabourManager';
import { KabadiwalaManager } from './KabadiwalaManager';

export function ManagerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("truck-driver");

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-600">Manager Dashboard</h2>
          <p className="text-gray-600">Manage all daily operations</p>
        </div>

        <Card className="border shadow-sm">
          <CardContent className="flex items-center gap-4 p-3">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CLEAN HORIZONTAL SCROLL TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        <TabsList
          className="
            flex 
            overflow-x-auto 
            gap-3 
            p-2 
            bg-gray-100 
            rounded-lg
            no-scrollbar
          "
        >
          <TabsTrigger value="truck-driver" className="min-w-[110px] flex flex-col items-center gap-1">
            <TruckIcon className="h-4 w-4" />
            <span className="text-xs">Truck Driver</span>
          </TabsTrigger>

          <TabsTrigger value="expenses" className="min-w-[110px] flex flex-col items-center gap-1">
            <Receipt className="h-4 w-4" />
            <span className="text-xs">Expenses</span>
          </TabsTrigger>

          <TabsTrigger value="maal-in" className="min-w-[110px] flex flex-col items-center gap-1">
            <Package className="h-4 w-4" />
            <span className="text-xs">Maal In</span>
          </TabsTrigger>

          <TabsTrigger value="rokadi" className="min-w-[110px] flex flex-col items-center gap-1">
            <Wallet className="h-4 w-4" />
            <span className="text-xs">Rokadi</span>
          </TabsTrigger>

          <TabsTrigger value="feriwala" className="min-w-[110px] flex flex-col items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="text-xs">Feriwala</span>
          </TabsTrigger>

          <TabsTrigger value="labour" className="min-w-[110px] flex flex-col items-center gap-1">
            <UserSquare className="h-4 w-4" />
            <span className="text-xs">Labour</span>
          </TabsTrigger>

          <TabsTrigger value="kabadiwala" className="min-w-[110px] flex flex-col items-center gap-1">
            <Handshake className="h-4 w-4" />
            <span className="text-xs">Kabadiwala</span>
          </TabsTrigger>
        </TabsList>

        {/* Content */}
        <TabsContent value="truck-driver"><TruckDriverManager /></TabsContent>
        <TabsContent value="expenses"><ExpenseManager /></TabsContent>
        <TabsContent value="maal-in"><MaalInManager /></TabsContent>
        <TabsContent value="rokadi"><RokadiManager /></TabsContent>
        <TabsContent value="feriwala"><FeriwalaManager /></TabsContent>
        <TabsContent value="labour"><LabourManager /></TabsContent>
        <TabsContent value="kabadiwala"><KabadiwalaManager /></TabsContent>

      </Tabs>
    </div>
  );
}
