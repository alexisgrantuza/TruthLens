import DetailInfoGrid from "@components/grid/DetailInfoGrid";
import OrderBasedDetailBasicStatusBadge from "@pages/order-based-progress/detail/basic-status/OrderBasedDetailBasicStatusBadge";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface OrderStatusData {
  orderNumber: string;
  detailedOrderNo: string;
  orderDate: string;
  deliveryDate: string;
  orderClosed: boolean;
  orderQuantity: number;
  receivedQuantity: string;
  shippedQuantity: string;
  estimatedDeliveryDate: string;
  receiptDate: string;
  shippingDate: string;
  salesDate: string;
  customerCode: string;
  customer: string;
  specification: string;
  currencyUnit: string;
}

interface OrderBasedDetailStatusProps {
  orderId?: string;
  data?: OrderStatusData;
  onDataLoad?: (data: OrderStatusData) => void;
  apiEndpoint?: string;
}

export default function OrderBasedDetailStatus({
  orderId,
  data: propData,
  onDataLoad,
  apiEndpoint = "/api/orders",
}: OrderBasedDetailStatusProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<OrderStatusData | null>(propData || null);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If data is provided via props, use it
    if (propData) {
      setData(propData);
      setLoading(false);
      return;
    }

    // If no orderId, don't fetch
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Fetch data from API
    const fetchOrderStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${apiEndpoint}/${orderId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);

        if (onDataLoad) {
          onDataLoad(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching order status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId, propData, apiEndpoint, onDataLoad]);

  if (loading) {
    return (
      <div className="bg-[#FFFFFF] flex-1 overflow-y-auto py-[4px] scrollbar_thin">
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-[#9E9E9E] text-[14px]">{t("loading")}...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFFFFF] flex-1 overflow-y-auto py-[4px] scrollbar_thin">
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-[#F44336] text-[14px]">
            {t("error")}: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#FFFFFF] flex-1 overflow-y-auto py-[4px] scrollbar_thin">
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-[#9E9E9E] text-[14px]">{t("no_data")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] flex-1 overflow-y-auto py-[4px] scrollbar_thin">
      <DetailInfoGrid
        data={[
          { label: t("order_number"), value: data.orderNumber },
          { label: t("detailed_order_no"), value: data.detailedOrderNo },
          { label: t("order_date"), value: data.orderDate },
          { label: t("delivery_date"), value: data.deliveryDate },
          {
            label: t("order_closed"),
            labelClassName: "font-[700] text-[#424242]",
            value: (
              <OrderBasedDetailBasicStatusBadge value={data.orderClosed} />
            ),
          },
        ]}
      />
      <div className="border border-b-[#F1F5FA] border-b-[4px] border-l-0 border-r-0 border-t-0">
        <div className="flex items-center justify-between px-[20px] py-[16px] w-full">
          <span className="font-[700] leading-[100%] text-[#424242] text-[15px]">
            {t("order_quantity")}
          </span>
          <span className="font-[700] leading-[100%] text-[#000000] text-[15px] text-right">
            {data.orderQuantity.toLocaleString()}
          </span>
        </div>
      </div>
      <DetailInfoGrid
        data={[
          { label: t("received_quantity"), value: data.receivedQuantity },
          { label: t("shipped_quantity"), value: data.shippedQuantity },
          {
            label: t("estimated_delivery_date"),
            value: data.estimatedDeliveryDate,
          },
          { label: t("receipt_date"), value: data.receiptDate },
          { label: t("shipping_date"), value: data.shippingDate },
          { label: t("sales_date"), value: data.salesDate },
        ]}
      />
      <DetailInfoGrid
        data={[
          { label: t("customer_code"), value: data.customerCode },
          { label: t("customer"), value: data.customer },
        ]}
      />
      <DetailInfoGrid
        hasNoBorder
        data={[
          { label: t("specification"), value: data.specification },
          { label: t("currency_unit"), value: data.currencyUnit },
        ]}
      />
    </div>
  );
}

import { classMerge } from "@utils/css.util";
import { useTranslation } from "react-i18next";

export default function OrderBasedDetailBasicStatusBadge({
  value,
}: {
  value: boolean;
}) {
  // Hooks
  const { t } = useTranslation();

  return (
    <div
      className={classMerge(
        "flex font-[700] h-[20px] items-center leading-[100%] px-[9px] py-[3px] rounded-[10px] text-[14px] text-base",
        value ? "bg-[#D6F4E9] text-[#00935E]" : "bg-[#FFDFDD] text-[#FF0000]"
      )}
    >
      <span className="uppercase">{value ? t("open_en") : t("close_en")}</span>
    </div>
  );
}

import { useTranslation } from "react-i18next";

interface ProgressProps {
  // Date value
  date: number;

  // Background color
  background: string;

  // Quantity value
  qty: number;

  // Progress stage
  stage: string;
}
export default function OrderBasedDetailProgressStatus() {
  const { t } = useTranslation();
  const progressData: ProgressProps[] = [
    {
      date: 2025 - 12 - 22,
      background: "#2AA6FF",
      qty: 7200,
      stage: t("order"),
    },
    {
      date: 2025 - 12 - 23,
      background: "#FFA800",
      qty: 0,
      stage: t("receiving"),
    },
    {
      date: 2025 - 12 - 24,
      background: "#FF5E56",
      qty: 0,
      stage: t("shipping"),
    },
    {
      date: 2025 - 12 - 25,
      background: "#A076F9",
      qty: 200,
      stage: t("sales"),
    },
  ];

  return (
    <div className="overflow-y-auto p-[20px] scrollbar_thin w-full">
      <div className="font-[500] leading-[100%] mb-[20px] text-[#616161] text-[18px] text-right"></div>
      <table className="border-x-0 border-y-[#B9CBE1] border-y-[2px] table-fixed text-right w-full">
        <thead className="bg-[#F1F5FA] h-[32px] text-[#4B5563] text-[14px] text-center">
          <tr>
            <th className="w-[69px]">{t("progress_stage")}</th>
            <th>{t("quantity")}</th>
            <th>{t("amount")}</th>
          </tr>
        </thead>
        <tbody>
          {progressData.map((item, index) => (
            <tr
              className="border-[#B9CBE1] border-b font-[500] text-[#000000] text-[15px]"
              key={`order-data-${index}`}
            >
              <td className="px-[4px] py-[6px] text-left">
                <div
                  className="flex font-[700] h-[28px] items-center justify-center leading-none mx-auto py-[6px] rounded-[2px] text-[#FFFFFF] text-[13px] w-[58px]"
                  style={{ background: item.background }}
                >
                  {item.stage}
                </div>
              </td>
              <td className="border-r border-r-[#E5EAF1] break-words px-[4px] py-[6px]">
                {item.qty.toLocaleString()}
              </td>
              <td className="break-words px-[4px] py-[6px]">
                {item.date.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Main;

import MainDiv from "@components/MainDiv";
import DetailPageNavbar from "@components/navbar/DetailPageNavbar";
import NavbarTab from "@components/navbar/NavbarTab";
import ProductBar from "@components/navbar/ProductBar";
import OrderBasedDetailStatus from "@pages/order-based-progress/detail/basic-status";
import OrderBasedDetailProgressStatus from "@pages/order-based-progress/detail/progress-status";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function OrderBasedDetail() {
  // Hooks
  const { t } = useTranslation();

  // State variables
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Custom variables
  const tabs = [t("basic_status"), t("progress_status")];

  return (
    <MainDiv className="flex flex-col h-[100vh] overflow-hidden">
      <div className="sticky top-0 z-50">
        <DetailPageNavbar title={t("orderbased_detail")} />
        <ProductBar
          itemCode="5ABTAAA-001A"
          itemName="젤 바디로션 모이스처라이징"
        />
        <NavbarTab
          activeTabIndex={activeTabIndex}
          tabs={tabs}
          setActiveTabIndex={setActiveTabIndex}
        />
      </div>
      {activeTabIndex ? (
        <OrderBasedDetailProgressStatus />
      ) : (
        <OrderBasedDetailStatus />
      )}
    </MainDiv>
  );
}
