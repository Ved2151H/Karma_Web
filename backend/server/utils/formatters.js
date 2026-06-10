const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  DISPATCHED: 'Dispatched',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const ROLE_LABELS = {
  SUPER_ADMIN: 'Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  CUSTOMER: 'Customer',
};

const STATUS_LABELS = {
  ACTIVE: 'Active',
  BANNED: 'Banned',
};

const CATEGORY_STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

function toNumber(value) {
  return value == null ? 0 : Number(value);
}

function toDateString(value) {
  if (!value) return null;
  return new Date(value).toISOString().split('T')[0];
}

export function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
  };
}

export function formatAuthUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export function formatAdminUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: ROLE_LABELS[user.role] || user.role,
    status: STATUS_LABELS[user.status] || user.status,
  };
}

export function formatProduct(product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category.slug,
    subcategory: product.subcategory.slug,
    subsection: product.subsection?.slug || undefined,
    image: product.image,
    price: toNumber(product.price),
    originalPrice: product.originalPrice != null ? toNumber(product.originalPrice) : undefined,
    discount: product.discount ?? undefined,
    badge: product.badge ?? undefined,
    brand: product.brand,
    industry: product.industry ?? undefined,
    material: product.material ?? undefined,
    resistanceType: product.resistanceType ?? undefined,
    lensType: product.lensType ?? undefined,
    snrDnr: product.snrDnr ?? undefined,
    reusable: product.reusable ?? undefined,
    countryOfOrigin: product.countryOfOrigin ?? undefined,
    rating: product.rating,
    stock: product.stock,
    dateAdded: toDateString(product.dateAdded),
    createdAt: product.createdAt,
    attributes: product.attributes ?? undefined,
    highlights: product.highlights ?? undefined,
    specs: product.specs ?? undefined,
    images: product.images ?? undefined,
    reviews: product.reviews ?? undefined,
  };
}

export function formatCategory(category, productCount = 0) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    count: productCount,
    status: CATEGORY_STATUS_LABELS[category.status] || category.status,
    subcategories: category.subcategories?.map((sub) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      subsections: sub.subsections?.map((subsec) => ({
        id: subsec.id,
        name: subsec.name,
        slug: subsec.slug,
      })),
    })),
  };
}

export function formatCustomerOrder(order) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    date: toDateString(order.createdAt),
    total: toNumber(order.total),
    status: ORDER_STATUS_LABELS[order.status] || order.status,
    items: order.items.map((item) => ({
      id: item.productId,
      title: item.title,
      quantity: item.quantity,
      price: toNumber(item.price),
    })),
  };
}

export function formatAdminOrder(order) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customer: order.user.name,
    email: order.user.email,
    amount: toNumber(order.total),
    status: mapAdminOrderStatus(order.status),
    date: toDateString(order.createdAt),
  };
}

function mapAdminOrderStatus(status) {
  if (status === 'DELIVERED') return 'Completed';
  return ORDER_STATUS_LABELS[status] || status;
}

export function parseOrderStatus(input) {
  if (!input) return undefined;

  const normalized = String(input).trim().toUpperCase().replace(/\s+/g, '_');
  const aliases = {
    COMPLETED: 'DELIVERED',
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    DISPATCHED: 'DISPATCHED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
  };

  return aliases[normalized] || normalized;
}

export function parseRole(input) {
  if (!input) return undefined;

  const normalized = String(input).trim().toUpperCase().replace(/\s+/g, '_');
  const aliases = {
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
    MANAGER: 'MANAGER',
    CUSTOMER: 'CUSTOMER',
  };

  return aliases[normalized] || normalized;
}

export function parseUserStatus(input) {
  if (!input) return undefined;
  return String(input).trim().toUpperCase() === 'BANNED' ? 'BANNED' : 'ACTIVE';
}

export function parseCategoryStatus(input) {
  if (!input) return undefined;
  return String(input).trim().toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
}

export function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
