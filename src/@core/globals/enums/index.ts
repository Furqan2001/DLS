export enum URLS {
  dashboard = "/dashboard",
  usersDetail = "/dashboard/users",
  profile = "/dashboard/account-settings",
  login = "/",
  landDetail = "/dashboard/lands"
}

export enum ROLES {
  visitor = "visitor",
  moderator = "moderator",
  admin = "admin",
}

export enum LOCAL_STORAGE_KEYS {
  accountAddress = "accountAddress",
}

export enum LAND_RECORD_STATUS {
  pending = "pending",
  underChangeReview = "underChangeReview",
  approved = "approved",
  rejected = "rejected",
}
