import { apiInstance } from "@shared/api";
import type { User } from "../model/types";

type ServerRole = { code: string; name: string };
type ServerUser = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  telephone: string;
  role: ServerRole;
  organizationId?: string | null;
  organization?: {
    id: string;
    name: string;
    avatar?: { storagePath: string } | null;
  } | null;
  avatarId?: string | null;
  avatar?: { storagePath: string } | null;
  organizerApplications?: Array<{
    id: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
  }>;
};

type ServerSubscription = {
  id: string;
  org: {
    id: string;
    name: string;
    description?: string | null;
    avatar?: { storagePath: string } | null;
    ratingAvg?: number | null;
    reviewsCount?: number;
  };
};

function mapServerUserToClient(user: ServerUser): User {
  const fullName = [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ");
  return {
    id: user.id,
    phone: user.telephone,
    name: fullName || undefined,
    avatar: user.avatar?.storagePath
      ? `${apiInstance.defaults.baseURL}/uploads/${user.avatar.storagePath}`
      : undefined,
    isOrganizer: user.role?.code === "organizer",
    organizationId: user.organizationId ?? user.organization?.id ?? null,
    organizerApplicationStatus: user.organizerApplications?.[0]?.status ?? null,
  };
}

function toTelephoneFromDigits(phoneDigits: string): string {
  // Ensure only digits, prefix with +7 for RU numbering plan
  const digitsOnly = phoneDigits.replace(/\D/g, "");
  return `+7${digitsOnly}`;
}

export const userApi = {
  // Events list
  getEvents: async (params?: {
    q?: string;
    cityId?: string;
    categoryId?: string;
    organizationId?: string;
    dateFrom?: string; // ISO or yyyy-mm-dd
    dateTo?: string; // ISO or yyyy-mm-dd
  }): Promise<
    Array<{
      id: string;
      title: string;
      date: string;
      location: string;
      price: string;
      imageUrl?: string;
      organization: { id: string };
    }>
  > => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        name: string;
        eventDate: string;
        startTime: string;
        location: string;
        price: number;
        poster?: { storagePath: string } | null;
        organization: {
          id: string;
          name: string;
          avatar?: { storagePath: string } | null;
        };
      }>;
    }>("/events", { params });

    return response.data.items.map((e) => ({
      id: e.id,
      title: e.name,
      date:
        new Date(e.eventDate).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) + ` в ${e.startTime}`,
      location: e.location,
      price: `${Number(e.price).toFixed(0)}₽`,
      imageUrl: e.poster?.storagePath
        ? `${apiInstance.defaults.baseURL}/uploads/${e.poster.storagePath}`
        : undefined,
      organization: { id: e.organization.id },
    }));
  },
  // Single event by id
  getEventById: async (
    id: string
  ): Promise<{
    id: string;
    title: string;
    date: string; // dd.mm.yyyy
    time: string;
    imageUrl?: string;
    description?: string;
    location: string;
    organization: { id: string; name: string; avatarUrl?: string };
    raw: {
      eventDate: string;
      startTime: string;
      organizationId: string;
    };
    price: number;
  }> => {
    const response = await apiInstance.get<{
      event: {
        id: string;
        name: string;
        description?: string | null;
        organizationId: string;
        organization?: {
          id: string;
          name: string;
          avatar?: { storagePath: string } | null;
        } | null;
        eventDate: string;
        startTime: string;
        location: string;
        poster?: { storagePath: string } | null;
        price: number;
      };
    }>(`/events/${id}`);

    const e = response.data.event;
    return {
      id: e.id,
      title: e.name,
      date: new Date(e.eventDate).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: e.startTime,
      imageUrl: e.poster?.storagePath
        ? `${apiInstance.defaults.baseURL}/uploads/${e.poster.storagePath}`
        : undefined,
      description: e.description ?? undefined,
      location: e.location,
      organization: {
        id: e.organization?.id ?? e.organizationId,
        name: e.organization?.name ?? "",
        avatarUrl: e.organization?.avatar?.storagePath
          ? `${apiInstance.defaults.baseURL}/uploads/${e.organization.avatar.storagePath}`
          : undefined,
      },
      raw: {
        eventDate: e.eventDate,
        startTime: e.startTime,
        organizationId: e.organizationId,
      },
      price: e.price,
    };
  },

  // Dictionaries
  getCities: async (): Promise<Array<{ id: string; name: string }>> => {
    const response = await apiInstance.get<{
      items: Array<{ id: string; name: string }>;
    }>("/dictionaries/cities");
    return response.data.items;
  },
  getCategories: async (): Promise<Array<{ id: string; name: string }>> => {
    const response = await apiInstance.get<{
      items: Array<{ id: string; name: string }>;
    }>("/dictionaries/categories");
    return response.data.items;
  },
  getColors: async (): Promise<
    Array<{ id: string; name: string; color: string; textColor: string }>
  > => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        name: string;
        color: string;
        textColor: string;
      }>;
    }>("/dictionaries/colors");
    return response.data.items;
  },
  getStoryColors: async (): Promise<
    Array<{ id: string; name: string; color: string; textColor: string }>
  > => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        name: string;
        color: string;
        textColor: string;
      }>;
    }>("/dictionaries/story-colors");
    return response.data.items;
  },
  // Check if phone exists
  checkPhone: async (phoneDigits: string): Promise<{ exists: boolean }> => {
    const telephone = toTelephoneFromDigits(phoneDigits);
    const response = await apiInstance.post<{ exists: boolean }>(
      "/auth/check-phone",
      { telephone }
    );
    return response.data;
  },

  // Login with phone and password
  login: async (
    phoneDigits: string,
    password: string
  ): Promise<{ token: string }> => {
    const telephone = toTelephoneFromDigits(phoneDigits);
    const response = await apiInstance.post<{ token: string }>("/auth/login", {
      telephone,
      password,
    });
    return response.data;
  },

  // Register with phone, password and names
  register: async (
    phoneDigits: string,
    password: string,
    names: { firstName: string; lastName: string; middleName?: string }
  ): Promise<{ token: string }> => {
    const telephone = toTelephoneFromDigits(phoneDigits);
    const payload: {
      firstName: string;
      lastName: string;
      middleName?: string;
      telephone: string;
      password: string;
    } = {
      firstName: names.firstName || "User",
      lastName: names.lastName || "",
      ...(names.middleName?.trim()
        ? { middleName: names.middleName.trim() }
        : {}),
      telephone,
      password,
    };
    const response = await apiInstance.post<{ token: string }>(
      "/auth/register",
      payload
    );
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ id: string; url: string }> => {
    const form = new FormData();
    form.append("file", file);
    const response = await apiInstance.post<{ id: string; url: string }>(
      "/uploads",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
  uploadFile: async (file: File): Promise<{ id: string; url: string }> => {
    const form = new FormData();
    form.append("file", file);
    const response = await apiInstance.post<{ id: string; url: string }>(
      "/uploads",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  updateMe: async (data: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    telephone?: string;
    avatarId?: string | null;
  }): Promise<{ id: string }> => {
    const response = await apiInstance.patch<{ id: string }>("/users/me", data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiInstance.get<{ user: ServerUser }>("/auth/me");
    return mapServerUserToClient(response.data.user);
  },

  getOrganization: async (
    id: string
  ): Promise<{
    id: string;
    name: string;
    avatarUrl?: string;
    description?: string;
    ratingAvg?: number | null;
    reviewsCount?: number;
    telephone?: string;
    socialUrl?: string;
    inn?: string;
    ogrn?: string;
    kpp?: string;
    licence?: string;
  }> => {
    const response = await apiInstance.get<{
      org: {
        id: string;
        name: string;
        description?: string | null;
        avatar?: { storagePath: string } | null;
        ratingAvg?: number | null;
        reviewsCount?: number;
        telephone?: string | null;
        socialUrl?: string | null;
        inn?: string | null;
        ogrn?: string | null;
        kpp?: string | null;
        licence?: string | null;
      };
    }>(`/organizations/${id}`);
    const org = response.data.org;
    return {
      id: org.id,
      name: org.name,
      description: org.description ?? undefined,
      avatarUrl: org.avatar?.storagePath
        ? `${apiInstance.defaults.baseURL}/uploads/${org.avatar.storagePath}`
        : undefined,
      ratingAvg: org.ratingAvg ?? null,
      reviewsCount: org.reviewsCount,
      telephone: org.telephone ?? undefined,
      socialUrl: org.socialUrl ?? undefined,
      inn: org.inn ?? undefined,
      ogrn: org.ogrn ?? undefined,
      kpp: org.kpp ?? undefined,
      licence: org.licence ?? undefined,
    };
  },

  getOrganizationEvents: async (
    organizationId: string,
    params?: { statusCode?: "published" | "moderation" | "completed" }
  ): Promise<
    Array<{
      id: string;
      title: string;
      date: string;
      location: string;
      price: string;
      imageUrl?: string;
      time: string;
    }>
  > => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        name: string;
        eventDate: string;
        startTime: string;
        location: string;
        price: number;
        poster?: { storagePath: string } | null;
      }>;
    }>(`/events`, { params: { organizationId, ...(params || {}) } });

    return response.data.items.map((e) => ({
      id: e.id,
      title: e.name,
      date: new Date(e.eventDate).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      location: e.location,
      price: `${Number(e.price).toFixed(0)}₽`,
      imageUrl: e.poster?.storagePath
        ? `${apiInstance.defaults.baseURL}/uploads/${e.poster.storagePath}`
        : undefined,
      time: e.startTime,
    }));
  },

  getOrganizationDrafts: async (
    organizationId: string
  ): Promise<
    Array<{
      id: string;
      title: string;
      date?: string;
      time?: string;
      imageUrl?: string;
    }>
  > => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        name: string;
        description?: string | null;
        eventDate?: string | null;
        startTime?: string | null;
        poster?: { storagePath: string } | null;
      }>;
    }>(`/organizations/${organizationId}/drafts`);

    return response.data.items.map((d) => ({
      id: d.id,
      title: d.name,
      date: d.eventDate
        ? new Date(d.eventDate).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : undefined,
      time: d.startTime ?? undefined,
      imageUrl: d.poster?.storagePath
        ? `${apiInstance.defaults.baseURL}/uploads/${d.poster.storagePath}`
        : undefined,
    }));
  },

  getOrganizationStories: async (
    organizationId: string
  ): Promise<
    Array<{
      id: string;
      title: string;
      description?: string;
      color: string;
      textColor: string;
      name: string;
      posterUrl?: string;
    }>
  > => {
    const response = await apiInstance.get<{ items: Array<any> }>(
      `/organizations/${organizationId}/stories`
    );
    return response.data.items.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description ?? undefined,
      color: s.color,
      textColor: s.textColor,
      name: s.name,
      posterUrl: s.poster?.storagePath
        ? `${apiInstance.defaults.baseURL}/uploads/${s.poster.storagePath}`
        : undefined,
    }));
  },

  // My subscriptions (organizations)
  getMySubscriptions: async (): Promise<
    Array<{
      id: string;
      organization: {
        id: string;
        name: string;
        avatarUrl?: string;
        description?: string;
        ratingAvg?: number | null;
        reviewsCount?: number;
      };
    }>
  > => {
    const response = await apiInstance.get<{ items: ServerSubscription[] }>(
      "/subscriptions"
    );
    const items = response.data.items.map((s) => ({
      id: s.id,
      organization: {
        id: s.org.id,
        name: s.org.name,
        description: s.org.description ?? undefined,
        avatarUrl: s.org.avatar?.storagePath
          ? `${apiInstance.defaults.baseURL}/uploads/${s.org.avatar.storagePath}`
          : undefined,
        ratingAvg: s.org.ratingAvg ?? null,
        reviewsCount: s.org.reviewsCount,
      },
    }));
    return items;
  },

  // Subscribe to organization
  subscribe: async (organizationId: string): Promise<{ id: string }> => {
    const response = await apiInstance.post<{ id: string }>("/subscriptions", {
      organizationId,
    });
    return response.data;
  },

  // Unsubscribe from organization
  unsubscribe: async (organizationId: string): Promise<{ id: string }> => {
    const response = await apiInstance.delete<{ id: string }>(
      `/subscriptions/${organizationId}`
    );
    return response.data;
  },

  // Favorites
  getFavorites: async (): Promise<string[]> => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        eventId: string;
        event: {
          id: string;
          name: string;
          eventDate: string;
          startTime: string;
          location: string;
          price: number;
          poster?: { storagePath: string } | null;
        };
      }>;
    }>("/favorites");
    return response.data.items.map((f) => f.eventId);
  },

  getFavoriteEvents: async (): Promise<
    Array<{
      id: string;
      title: string;
      date: string;
      time: string;
      imageUrl?: string;
    }>
  > => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        eventId: string;
        event: {
          id: string;
          name: string;
          eventDate: string;
          startTime: string;
          poster?: { storagePath: string } | null;
        };
      }>;
    }>("/favorites");

    return response.data.items.map((f) => ({
      id: f.event.id,
      title: f.event.name,
      date: new Date(f.event.eventDate).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      }),
      time: f.event.startTime,
      imageUrl: f.event.poster?.storagePath
        ? `${apiInstance.defaults.baseURL}/uploads/${f.event.poster.storagePath}`
        : undefined,
    }));
  },
  addFavorite: async (eventId: string): Promise<{ id: string }> => {
    const response = await apiInstance.post<{ id: string }>("/favorites", {
      eventId,
    });
    return response.data;
  },
  removeFavorite: async (eventId: string): Promise<{ id: string }> => {
    const response = await apiInstance.delete<{ id: string }>(
      `/favorites/${eventId}`
    );
    return response.data;
  },

  // Purchases for event (e.g., participants)
  getEventPurchases: async (
    eventId: string,
    statusCode: string = "paid"
  ): Promise<
    Array<{
      user: { id: string; name: string; avatarUrl?: string };
      price: number;
      serviceTax: number;
    }>
  > => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        user: {
          id: string;
          firstName: string;
          lastName: string;
          avatar?: { storagePath: string } | null;
        };
        price: number;
        serviceTax: number;
      }>;
    }>(`/purchases`, { params: { eventId, statusCode } });

    return response.data.items.map((p) => ({
      user: {
        id: p.user.id,
        name: `${p.user.firstName} ${p.user.lastName}`.trim(),
        avatarUrl: p.user.avatar?.storagePath
          ? `${apiInstance.defaults.baseURL}/uploads/${p.user.avatar.storagePath}`
          : undefined,
      },
      price: Number(p.price),
      serviceTax: Number(p.serviceTax),
    }));
  },

  getMyPurchases: async (
    statusCode: string = "paid"
  ): Promise<
    Array<{
      id: string; // purchase id
      eventId: string;
      title: string;
      date: string; // dd.mm or dd.mm.yyyy
      time: string; // HH:mm
      imageUrl?: string;
      raw: { eventDate: string; startTime: string };
    }>
  > => {
    const response = await apiInstance.get<{
      items: Array<{
        id: string;
        event: {
          id: string;
          name: string;
          eventDate: string; // ISO
          startTime: string; // HH:mm
          poster?: { storagePath: string } | null;
        };
      }>;
    }>(`/purchases`, { params: { statusCode } });

    return response.data.items.map((p) => ({
      id: p.id,
      eventId: p.event.id,
      title: p.event.name,
      date: new Date(p.event.eventDate).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      }),
      time: p.event.startTime,
      imageUrl: p.event.poster?.storagePath
        ? `${apiInstance.defaults.baseURL}/uploads/${p.event.poster.storagePath}`
        : undefined,
      raw: { eventDate: p.event.eventDate, startTime: p.event.startTime },
    }));
  },

  // Organizer application
  submitOrganizerApplication: async (data: {
    name: string;
    description: string;
    phoneDigits: string; // 10 digits
    socialUrl: string;
    inn: string;
    ogrn: string;
    kpp: string;
    licence: string;
    avatarId?: string | null;
  }): Promise<{ id: string }> => {
    const telephone = toTelephoneFromDigits(data.phoneDigits);
    const payload = {
      name: data.name,
      description: data.description,
      telephone,
      socialUrl: data.socialUrl,
      inn: data.inn,
      ogrn: data.ogrn,
      kpp: data.kpp,
      licence: data.licence,
      ...(data.avatarId ? { avatarId: data.avatarId } : {}),
    };
    const response = await apiInstance.post<{ id: string }>(
      "/organizer-applications",
      payload
    );
    return response.data;
  },

  // Organizer update application (existing organization)
  submitOrganizationUpdateApplication: async (data: {
    organizationId: string;
    name: string;
    description: string;
    phoneDigits: string; // 10 digits
    socialUrl: string;
    inn: string;
    ogrn: string;
    kpp: string;
    licence: string;
    avatarId?: string | null;
  }): Promise<{ id: string }> => {
    const telephone = toTelephoneFromDigits(data.phoneDigits);
    const payload = {
      organizationId: data.organizationId,
      name: data.name,
      description: data.description,
      telephone,
      socialUrl: data.socialUrl,
      inn: data.inn,
      ogrn: data.ogrn,
      kpp: data.kpp,
      licence: data.licence,
      ...(data.avatarId ? { avatarId: data.avatarId } : {}),
    };
    const response = await apiInstance.post<{ id: string }>(
      "/organizer-applications",
      payload
    );
    return response.data;
  },

  // Update organization avatar immediately
  updateOrganizationAvatar: async (
    organizationId: string,
    avatarId: string | null
  ): Promise<{ id: string }> => {
    const response = await apiInstance.patch<{ id: string }>(
      `/organizations/${organizationId}`,
      { avatarId }
    );
    return response.data;
  },

  createEvent: async (data: {
    organizationId: string;
    name: string;
    description?: string;
    categoryId: string;
    cityId: string;
    eventDate: string; // yyyy-mm-dd
    startTime: string; // HH:mm
    location: string;
    maxQuantity: number;
    price: number;
    colorId: string;
    posterId?: string | null;
  }): Promise<{ id: string }> => {
    const response = await apiInstance.post<{ id: string }>("/events", data);
    return response.data;
  },

  createOrganizationStory: async (data: {
    organizationId: string;
    eventId: string;
    description?: string;
    colorId: string;
    posterId?: string | null;
  }): Promise<{ id: string }> => {
    const { organizationId, ...payload } = data;
    const response = await apiInstance.post<{ id: string }>(
      `/organizations/${organizationId}/stories`,
      payload
    );
    return response.data;
  },
};
