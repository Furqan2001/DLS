export enum URLS {
  dashboard = "/dashboard",
  usersDetail = "/dashboard/users",
  profile = "/dashboard/account-settings",
  login = "/login",
  landing = "/",
  allLands = "/dashboard/lands",
  newOwnerships = "/dashboard/new-ownership",
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

// it is used to fetch land record according to different status types
export enum GET_ALL_LAND_RECORD_STATUS {
  pending = "pending",
  underChangeReview = "underChangeReview",
  approved = "approved",
  rejected = "rejected",
  all = "all",
}
