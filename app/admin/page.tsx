import db from "@/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await db?.order.aggregate({
    _sum: {
      priceInCents: true,
    },
    _count: true,
  });

  return {
    amount: (data?._sum.priceInCents || 0) / 100, // 100 cents = 1$
    numberOfSales: data?._count || 0,
  };
}

async function getUserData() {
  const [userCount, order] = await Promise.all([
    db?.user.count(),
    db?.order.aggregate({
      _sum: {
        priceInCents: true,
      },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (order?._sum.priceInCents || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db?.product.count({ where: { isAvailableForPurchase: true } }),
    db?.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return { activeCount, inactiveCount };
}

interface DashboardCardProps {
  title: string;
  description: string;
  content: string;
}

function DashboardCard({ title, description, content }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        description={`${formatNumber(salesData.numberOfSales)} Orders`}
        content={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        description={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        content={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        description={`${formatNumber(productData.inactiveCount)} Inactive`}
        content={formatNumber(productData.activeCount)}
      />
    </div>
  );
}
