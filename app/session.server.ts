import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User, Farm } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { getAdminBYId } from "./models/admin.server";
import { GetFarmById } from "./models/farm.server";
import {
  getPickUpStationById,
  PickUpStation,
} from "./models/pickupstation.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});
export const farmSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__farmsession",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});
export const adminSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__adminsession",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});
export const pickUpSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__pickupstationsession",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
export async function getFarmSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return farmSessionStorage.getSession(cookie);
}
export async function getAdminSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return adminSessionStorage.getSession(cookie);
}
export async function getPickUpSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return pickUpSessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}
export async function getFarmId(request: Request): Promise<string | undefined> {
  const session = await getFarmSession(request);
  const farmId = session.get(USER_SESSION_KEY);
  return farmId;
}
export async function getAdminId(
  request: Request
): Promise<string | undefined> {
  const session = await getAdminSession(request);
  const adminId = session.get(USER_SESSION_KEY);
  return adminId;
}
export async function getPickUpId(
  request: Request
): Promise<string | undefined> {
  const session = await getPickUpSession(request);
  const farmId = session.get(USER_SESSION_KEY);
  return farmId;
}

export async function getUser(request: Request): Promise<null | User> {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  return null;
}
export async function getFarm(request: Request): Promise<null | Farm> {
  const farmId = await getFarmId(request);
  if (farmId === undefined) return null;

  const farm = await GetFarmById(farmId);
  if (farm) return farm;

  return null;
}
export async function getAdmin(request: Request): Promise<null | Farm> {
  const adminId = await getAdminId(request);
  if (adminId === undefined) return null;

  const admin = await GetFarmById(adminId);
  if (admin) return admin;

  return null;
}
export async function getPickUp(
  request: Request
): Promise<null | PickUpStation> {
  const pickUpId = await getFarmId(request);
  if (pickUpId === undefined) return null;

  const pickup = await getPickUpStationById(pickUpId);
  if (pickup) return pickup;

  return null;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
export const getfarmId = (request: Request) => {
  const farmId = request.headers.get("Cookie");
  return farmId;
};

export async function requireFarmId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const userId = await getFarmId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/farmlogin?${searchParams}`);
  }
  return userId;
}
export async function requireAdminId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const userId = await getAdminId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/adminlogin?${searchParams}`);
  }
  return userId;
}
export async function requirePickUpId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const userId = await getPickUpId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/pickuplogin?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireFarm(request: Request) {
  const userId = await requireFarmId(request);

  const user = await GetFarmById(userId);
  if (user) return user;

  throw await farmLogout(request);
}
export async function requireAdmin(request: Request) {
  const userId = await requireFarmId(request);

  const user = await getAdminBYId(userId);
  if (user) return user;

  throw await adminLogout(request);
}
export async function requirePickUp(request: Request) {
  const userId = await requireFarmId(request);

  const user = await getPickUpStationById(userId);
  if (user) return user;

  throw await pickupLogout(request);
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}
export async function createFarmSession({
  request,
  farmId,
  remember,
  redirectTo,
}: {
  request: Request;
  farmId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getFarmSession(request);
  session.set(USER_SESSION_KEY, farmId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await farmSessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}
export async function createAdminSession({
  request,
  adminId,
  remember,
  redirectTo,
}: {
  request: Request;
  adminId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getFarmSession(request);
  session.set(USER_SESSION_KEY, adminId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await adminSessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}
export async function createPickUpSession({
  request,
  pickupId,
  remember,
  redirectTo,
}: {
  request: Request;
  pickupId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getPickUpSession(request);
  session.set(USER_SESSION_KEY, pickupId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await pickUpSessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
export async function farmLogout(request: Request) {
  const session = await getFarmSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await farmSessionStorage.destroySession(session),
    },
  });
}
export async function adminLogout(request: Request) {
  const session = await getAdminSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await adminSessionStorage.destroySession(session),
    },
  });
}
export async function pickupLogout(request: Request) {
  const session = await getFarmSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await pickUpSessionStorage.destroySession(session),
    },
  });
}
