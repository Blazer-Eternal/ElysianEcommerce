import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../../components/layout/AdminLayout";
import TanStackDataTable from "../../components/admin/TanStackDataTable";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import { couponService } from "../../services/couponService";
import type { Product } from "../../types/product.types";
import type { Category } from "../../types/category.types";
import type { Order } from "../../types/order.types";
import type { User } from "../../types/user.types";
import type { Coupon } from "../../types/coupon.types";
import { formatCurrency } from "../../utils/formatCurrency";

const DataTablesDemo = () => {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders" | "users" | "coupons">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  // Fetch products
  const { data: productsRes, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["products", "all"],
    queryFn: ({ signal }) => productService.getAll({ limit: 100 }, { signal }),
    staleTime: 5 * 60 * 1000,
  });

  const products = useMemo(() => {
    const prods = productsRes?.data || [];
    return prods;
  }, [productsRes]);

  // Fetch categories
  const { data: categoriesRes, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => categoryService.getAll({ signal }),
    staleTime: 5 * 60 * 1000,
  });

  const categories = useMemo(() => {
    const cats = categoriesRes?.data || [];
    return cats;
  }, [categoriesRes]);

  // Fetch orders
  const { data: ordersRes, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ["admin", "orders", "all"],
    queryFn: ({ signal }) => orderService.getAll(1, 100, { signal }),
    staleTime: 5 * 60 * 1000,
  });

  const orders = useMemo(() => {
    const ords = ordersRes?.data || [];
    return ords;
  }, [ordersRes]);

  // Fetch users
  const { data: usersRes, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["users", "all"],
    queryFn: ({ signal }) => userService.getAll(1, 100, { signal }),
    staleTime: 5 * 60 * 1000,
  });

  const users = useMemo(() => {
    const usr = usersRes?.data || [];
    return usr;
  }, [usersRes]);

  // Fetch coupons
  const { data: couponsRes, isLoading: couponsLoading, error: couponsError } = useQuery({
    queryKey: ["coupons"],
    queryFn: ({ signal }) => couponService.getAll({ signal }),
    staleTime: 5 * 60 * 1000,
  });

  const coupons = useMemo(() => {
    const cps = couponsRes?.data || [];
    return cps;
  }, [couponsRes]);

  // Create a map of coupon ID to coupon code for orders tab
  const couponMap = useMemo(() => {
    const map = new Map<string, string>();
    coupons.forEach((coupon: any) => {
      map.set(coupon._id, coupon.code);
    });
    return map;
  }, [coupons]);

  const getCouponCode = (couponId: string | null | undefined) => {
    if (!couponId) return null;
    return couponMap.get(couponId) || couponId;
  };

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "all"] });
      alert("Product deleted successfully!");
    },
    onError: () => {
      alert("Failed to delete product");
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      alert("Category deleted successfully!");
    },
    onError: () => {
      alert("Failed to delete category");
    },
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      alert("Order cancelled successfully!");
    },
    onError: () => {
      alert("Failed to cancel order");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      alert("User deleted successfully!");
    },
    onError: () => {
      alert("Failed to delete user");
    },
  });

  // Delete coupon mutation
  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => couponService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      alert("Coupon deleted successfully!");
    },
    onError: () => {
      alert("Failed to delete coupon");
    },
  });

  // Product Column definitions
  const productColumns: any[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Product Name",
        cell: (info: any) => (
          <div className="font-semibold text-gray-900">{info.getValue()}</div>
        ),
      },
      {
        id: "category_id",
        accessorKey: "category_id",
        header: "Category",
        cell: (info: any) => {
          const category = info.getValue() as any;
          const categoryName = typeof category === "object" ? category?.name : "—";
          return (
            <span className="inline-block px-2 py-1 bg-[#0e7c85]/20 text-[#0e7c85] rounded text-xs font-semibold">
              {categoryName}
            </span>
          );
        },
      },
      {
        id: "price",
        accessorKey: "price",
        header: "Price",
        cell: (info: any) => (
          <span className="font-semibold text-gray-900">
            {formatCurrency(info.getValue() as number)}
          </span>
        ),
      },
      {
        id: "stock",
        accessorKey: "stock",
        header: "Stock",
        cell: (info: any) => {
          const stock = info.getValue() as number;
          return (
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {stock} units
            </span>
          );
        },
      },
      {
        id: "rating_avg",
        accessorKey: "rating_avg",
        header: "Rating",
        cell: (info: any) => {
          const rating = (info.getValue() as number) || 0;
          return (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-gray-900">
                {rating.toFixed(1)}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c._id === categoryId)?.name || "—";
  };

  // Category Column definitions
  const categoryColumns: any[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Category Name",
        cell: (info: any) => {
          // Get the full row data
          const row = info.row?.original;
          // Check the parent_id field explicitly
          const parentId = row?.parent_id;
          
          // Only show star if parent_id is truly null, undefined, or empty string
          // NOT if it's an object (which would mean it's a populated reference)
          const isMainCategory = !parentId || parentId === null || parentId === undefined || parentId === "";
          
          return (
            <div className="flex items-center gap-2">
              {isMainCategory && (
                <span className="text-xl" title="Main Category">
                  ⭐
                </span>
              )}
              <span className="font-semibold text-gray-900">{info.getValue()}</span>
            </div>
          );
        },
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        cell: (info: any) => (
          <div className="text-gray-700 text-sm max-w-xs truncate">
            {info.getValue() || "—"}
          </div>
        ),
      },
      {
        id: "parent_id",
        accessorKey: "parent_id",
        header: "Parent Category",
        cell: (info: any) => {
          const parent = info.getValue() as any;
          if (!parent) {
            return <span className="text-gray-500 italic">—</span>;
          }
          const parentName = typeof parent === "object" ? parent?.name : getCategoryName(parent);
          return (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
              {parentName}
            </span>
          );
        },
      },
      {
        id: "productCount",
        accessorKey: "_id",
        header: "Products",
        cell: (info: any) => {
          // Get the actual category row data
          const categoryRow = info.row?.original;
          const categoryId = categoryRow?._id;
          const isMainCategory = !categoryRow?.parent_id || categoryRow.parent_id === null || categoryRow.parent_id === undefined || categoryRow.parent_id === "";
          
          const count = products.filter((p: any) => {
            if (!p) return false;
            let catId = "";
            if (typeof p.category_id === "object" && p.category_id !== null) {
              catId = p.category_id._id || p.category_id.toString();
            } else if (typeof p.category_id === "string") {
              catId = p.category_id;
            }
            return catId === categoryId;
          }).length;
          
          // For parent/main categories, show a special indicator
          if (isMainCategory) {
            return (
              <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                ↓ Parent
              </span>
            );
          }
          
          // For subcategories, show the actual count
          return (
            <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
              count > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {count} {count === 1 ? "product" : "products"}
            </span>
          );
        },
      },
    ],
    [products, categories]
  );

  // Order Column definitions
  const orderColumns: any[] = useMemo(
    () => [
      {
        id: "order_number",
        accessorKey: "order_number",
        header: "Order Number",
        cell: (info: any) => (
          <div className="font-semibold text-gray-900">{info.getValue()}</div>
        ),
      },
      {
        id: "user_id",
        accessorKey: "user_id",
        header: "Customer",
        cell: (info: any) => {
          const user = info.getValue() as any;
          const userName = typeof user === "object" ? user?.name : "—";
          return (
            <span className="inline-block px-2 py-1 bg-[#0e7c85]/20 text-[#0e7c85] rounded text-xs font-semibold">
              {userName}
            </span>
          );
        },
      },
      {
        id: "total_amount",
        accessorKey: "total_amount",
        header: "Total Amount",
        cell: (info: any) => (
          <span className="font-semibold text-gray-900">
            {formatCurrency(info.getValue() as number)}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: (info: any) => {
          const status = info.getValue() as string;
          const statusColors: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-700",
            paid: "bg-blue-100 text-blue-700",
            shipped: "bg-purple-100 text-purple-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
          };
          return (
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[status] || "bg-gray-100 text-gray-700"}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: "payment_status",
        accessorKey: "payment_status",
        header: "Payment",
        cell: (info: any) => {
          const paymentStatus = info.getValue() as string;
          const paymentColors: Record<string, string> = {
            unpaid: "bg-red-100 text-red-700",
            paid: "bg-green-100 text-green-700",
            refunded: "bg-orange-100 text-orange-700",
          };
          return (
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${paymentColors[paymentStatus] || "bg-gray-100 text-gray-700"}`}>
              {paymentStatus}
            </span>
          );
        },
      },
      {
        id: "coupon_id",
        accessorKey: "coupon_id",
        header: "Coupon",
        cell: (info: any) => {
          const coupon = info.getValue() as any;
          const row = info.row?.original;
          
          if (!coupon || !row?.discount || row.discount === 0) {
            return <span className="text-gray-500 italic text-xs">No coupon</span>;
          }

          const couponCode = typeof coupon === "object" ? coupon.code : getCouponCode(coupon);
          const discount = row.discount;

          return (
            <div className="flex flex-col gap-1">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold max-w-fit">
                {couponCode}
              </span>
              {discount && discount > 0 && (
                <span className="text-xs text-green-700 font-semibold">
                  -{formatCurrency(discount)}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Date",
        cell: (info: any) => {
          const date = new Date(info.getValue() as string);
          return <span className="text-gray-600 text-sm">{date.toLocaleDateString()}</span>;
        },
      },
    ],
    []
  );

  // User Column definitions
  const userColumns: any[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "User Name",
        cell: (info: any) => (
          <div className="font-semibold text-gray-900">{info.getValue()}</div>
        ),
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        cell: (info: any) => (
          <span className="text-gray-700 text-sm">{info.getValue()}</span>
        ),
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        cell: (info: any) => (
          <span className="text-gray-700 text-sm">{info.getValue() || "—"}</span>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        cell: (info: any) => {
          const role = info.getValue() as string;
          return (
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
              role === "admin" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>
              {role}
            </span>
          );
        },
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Joined",
        cell: (info: any) => {
          const date = new Date(info.getValue() as string);
          return <span className="text-gray-600 text-sm">{date.toLocaleDateString()}</span>;
        },
      },
    ],
    []
  );

  // Coupon Column definitions
  const couponColumns: any[] = useMemo(
    () => [
      {
        id: "code",
        accessorKey: "code",
        header: "Coupon Code",
        cell: (info: any) => (
          <div className="font-semibold text-gray-900 uppercase">{info.getValue()}</div>
        ),
      },
      {
        id: "discount_type",
        accessorKey: "discount_type",
        header: "Type",
        cell: (info: any) => {
          const type = info.getValue() as string;
          return (
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
              type === "percentage" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            }`}>
              {type === "percentage" ? "%" : "$"}
            </span>
          );
        },
      },
      {
        id: "value",
        accessorKey: "value",
        header: "Value",
        cell: (info: any) => {
          const value = info.getValue() as number;
          const type = (info.row?.original?.discount_type) as string;
          return (
            <span className="font-semibold text-gray-900">
              {type === "percentage" ? `${value}%` : formatCurrency(value)}
            </span>
          );
        },
      },
      {
        id: "usage_limit",
        accessorKey: "usage_limit",
        header: "Limit",
        cell: (info: any) => {
          const limit = info.getValue() as number | null;
          return (
            <span className="text-gray-600 text-sm">{limit ? `${limit} times` : "Unlimited"}</span>
          );
        },
      },
      {
        id: "used_count",
        accessorKey: "used_count",
        header: "Used",
        cell: (info: any) => {
          const used = info.getValue() as number;
          const limit = (info.row?.original?.usage_limit) as number | null;
          return (
            <span className="inline-block px-2 py-1 bg-[#0e7c85]/20 text-[#0e7c85] rounded text-xs font-semibold">
              {used}{limit ? ` / ${limit}` : ""}
            </span>
          );
        },
      },
      {
        id: "is_active",
        accessorKey: "is_active",
        header: "Status",
        cell: (info: any) => {
          const isActive = info.getValue() as boolean;
          return (
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
              isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        id: "expiry_date",
        accessorKey: "expiry_date",
        header: "Expiry",
        cell: (info: any) => {
          const date = new Date(info.getValue() as string);
          return <span className="text-gray-600 text-sm">{date.toLocaleDateString()}</span>;
        },
      },
    ],
    []
  );

  const handleCreateProduct = () => {
    alert(
      "Create functionality would open a modal or navigate to a create form.\nThis is a demo showcase of TanStack Table features."
    );
  };

  const handleEditProduct = (product: Product) => {
    alert(
      `Edit: ${product.name}\n\nEdit functionality would open a modal or navigate to an edit form with the product ID: ${product._id}`
    );
  };

  const handleDeleteProduct = (product: Product) => {
    deleteProductMutation.mutate(product._id);
  };

  const handleCreateCategory = () => {
    alert(
      "Create functionality would open a modal or navigate to a create form.\nThis is a demo showcase of TanStack Table features."
    );
  };

  const handleEditCategory = (category: Category) => {
    alert(
      `Edit: ${category.name}\n\nEdit functionality would open a modal or navigate to an edit form with the category ID: ${category._id}`
    );
  };

  const handleDeleteCategory = (category: Category) => {
    deleteCategoryMutation.mutate(category._id);
  };

  const handleCreateOrder = () => {
    alert(
      "Create functionality would open a modal or navigate to a create form.\nThis is a demo showcase of TanStack Table features."
    );
  };

  const handleEditOrder = (order: Order) => {
    alert(
      `Edit: ${order.order_number}\n\nEdit functionality would open a modal or navigate to an edit form with the order ID: ${order._id}`
    );
  };

  const handleDeleteOrder = (order: Order) => {
    deleteOrderMutation.mutate(order._id);
  };

  const handleCreateUser = () => {
    alert(
      "Create functionality would open a modal or navigate to a create form.\nThis is a demo showcase of TanStack Table features."
    );
  };

  const handleEditUser = (user: User) => {
    alert(
      `Edit: ${user.name}\n\nEdit functionality would open a modal or navigate to an edit form with the user ID: ${user._id}`
    );
  };

  const handleDeleteUser = (user: User) => {
    deleteUserMutation.mutate(user._id);
  };

  const handleCreateCoupon = () => {
    alert(
      "Create functionality would open a modal or navigate to a create form.\nThis is a demo showcase of TanStack Table features."
    );
  };

  const handleEditCoupon = (coupon: Coupon) => {
    alert(
      `Edit: ${coupon.code}\n\nEdit functionality would open a modal or navigate to an edit form with the coupon ID: ${coupon._id}`
    );
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    deleteCouponMutation.mutate(coupon._id);
  };

  return (
    <AdminLayout>
      <div className="w-full px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider">
            DATA MANAGEMENT
          </div>
          <h1 className="text-4xl font-bold text-gray-900">DataTables</h1>
          <p className="text-gray-600 mt-2">
            Manage your products, categories, orders, users, and coupons with advanced table features.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === "products"
                ? "text-[#0e7c85]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Products
            {activeTab === "products" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0e7c85]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === "categories"
                ? "text-[#0e7c85]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Categories
            {activeTab === "categories" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0e7c85]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === "orders"
                ? "text-[#0e7c85]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Orders
            {activeTab === "orders" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0e7c85]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === "users"
                ? "text-[#0e7c85]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Users
            {activeTab === "users" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0e7c85]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === "coupons"
                ? "text-[#0e7c85]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Coupons
            {activeTab === "coupons" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0e7c85]"></div>
            )}
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            {productsLoading ? (
              <div className="glass rounded-2xl p-12 border border-white/20 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e7c85]"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            ) : productsError ? (
              <div className="glass rounded-2xl p-8 border border-red-200 bg-red-50">
                <p className="text-red-700 font-semibold">
                  Failed to load products. Please try again.
                </p>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 border border-white/20">
                <TanStackDataTable
                  data={products}
                  columns={productColumns}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onCreate={handleCreateProduct}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  exportTitle="Products Report"
                />
              </div>
            )}
          </>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <>
            {categoriesLoading ? (
              <div className="glass rounded-2xl p-12 border border-white/20 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e7c85]"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading categories...</p>
              </div>
            ) : categoriesError ? (
              <div className="glass rounded-2xl p-8 border border-red-200 bg-red-50">
                <p className="text-red-700 font-semibold">
                  Failed to load categories. Please try again.
                </p>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 border border-white/20">
                <TanStackDataTable
                  data={categories}
                  columns={categoryColumns}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  onCreate={handleCreateCategory}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  exportTitle="Categories Report"
                  productsData={products}
                />
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <>
            {ordersLoading ? (
              <div className="glass rounded-2xl p-12 border border-white/20 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e7c85]"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading orders...</p>
              </div>
            ) : ordersError ? (
              <div className="glass rounded-2xl p-8 border border-red-200 bg-red-50">
                <p className="text-red-700 font-semibold">
                  Failed to load orders. Please try again.
                </p>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 border border-white/20">
                <TanStackDataTable
                  data={orders}
                  columns={orderColumns}
                  onEdit={handleEditOrder}
                  onDelete={handleDeleteOrder}
                  onCreate={handleCreateOrder}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  exportTitle="Orders Report"
                  couponMap={couponMap}
                />
              </div>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <>
            {usersLoading ? (
              <div className="glass rounded-2xl p-12 border border-white/20 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e7c85]"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading users...</p>
              </div>
            ) : usersError ? (
              <div className="glass rounded-2xl p-8 border border-red-200 bg-red-50">
                <p className="text-red-700 font-semibold">
                  Failed to load users. Please try again.
                </p>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 border border-white/20">
                <TanStackDataTable
                  data={users}
                  columns={userColumns}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onCreate={handleCreateUser}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  exportTitle="Users Report"
                />
              </div>
            )}
          </>
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <>
            {couponsLoading ? (
              <div className="glass rounded-2xl p-12 border border-white/20 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e7c85]"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading coupons...</p>
              </div>
            ) : couponsError ? (
              <div className="glass rounded-2xl p-8 border border-red-200 bg-red-50">
                <p className="text-red-700 font-semibold">
                  Failed to load coupons. Please try again.
                </p>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 border border-white/20">
                <TanStackDataTable
                  data={coupons}
                  columns={couponColumns}
                  onEdit={handleEditCoupon}
                  onDelete={handleDeleteCoupon}
                  onCreate={handleCreateCoupon}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  exportTitle="Coupons Report"
                />
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DataTablesDemo;
