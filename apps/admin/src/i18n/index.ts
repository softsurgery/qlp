import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const common = {
  commands: {
    actions: "Actions",
    inspect: "Inspect",
    edit: "Edit",
    delete: "Delete",
    reset: "Reset",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    apply: "Apply",
    hide: "Hide",
    display: "Display",
  },
  common: {
    buttons: {
      delete: "Delete",
      cancel: "Cancel",
      activate: "Activate",
      deactivate: "Deactivate",
      approve: "Approve",
      disapprove: "Disapprove",
    },
  },
  answer: { yes: "Yes", no: "No" },
  general: { unknown: "Unknown", more: "more" },
  table: { loading: "Loading" },
  datatable: {
    noResults: "No results",
    search: "Search {{entity}}",
    visibleColumns: "Visible columns",
    clearCriterias: "Clear filters",
    paginationPhrase: "Page {{page}} of {{total}}",
    order: { asc: "Ascending", desc: "Descending" },
    filter: {
      title: "Filter",
      clear: "Clear",
      selectPlaceholder: "Select",
      valuePlaceholder: "Value",
      dateFrom: "From",
      dateTo: "To",
    },
    export: {
      noData: "No data to export",
      success: "Export completed",
      error: "Export failed",
      currentPage: "Current page",
      allData: "All data",
      title: "Export",
      description: "Choose what to export",
    },
  },
};

const userManagement = {
  userManagement: {
    page: {
      title: "User management",
      users: "Users",
      user: "User",
      description: "Create and manage platform users.",
      activate: "Activate",
      deactivate: "Deactivate",
      approve: "Approve",
      disapprove: "Disapprove",
    },
    columns: {
      photo: "Photo",
      username: "Username",
      email: "Email",
      firstName: "First name",
      lastName: "Last name",
      dateOfBirth: "Date of birth",
      role: "Role",
      isActive: "Active",
      isApproved: "Approved",
      createdAt: "Created",
      updatedAt: "Updated",
    },
    errors: {
      notDefined: "Not defined",
      roleNotFound: "Role not found",
      generalError: "Something went wrong",
    },
    messages: {
      userDeletedSuccess: "User deleted",
      userActivatedSuccess: "User activated",
      userDeactivatedSuccess: "User deactivated",
      userApprovedSuccess: "User approved",
      userDisapprovedSuccess: "User disapproved",
      userCreatedSuccess: "User created",
      userUpdatedSuccess: "User updated",
    },
    dialogs: {
      deleteUserTitle: "Delete user",
      deleteUserDescription: "This will deactivate the user record.",
      activateUserTitle: "Activate user",
      activateUserDescription: "The user will be able to sign in again.",
      deactivateUserTitle: "Deactivate user",
      deactivateUserDescription: "The user will no longer be able to sign in.",
      approveUserTitle: "Approve user",
      approveUserDescription: "Mark this user as approved.",
      disapproveUserTitle: "Disapprove user",
      disapproveUserDescription: "Remove approval from this user.",
    },
    sheet: {
      createUserTitle: "Create user",
      createUserDescription: "Add a new platform user.",
      updateUserTitle: "Update user",
      updateUserDescription: "Edit the selected user.",
    },
    forms: {
      firstName: "First name",
      firstNameDescription: "Optional given name",
      lastName: "Last name",
      lastNameDescription: "Optional family name",
      email: "Email",
      emailDescription: "Used for login and notifications",
      dateOfBirth: "Date of birth",
      dateOfBirthDescription: "Optional",
      username: "Username",
      usernamePlaceholder: "jdoe",
      usernameDescription: "Unique username",
      password: "Password",
      passwordPlaceholder: "••••••••",
      passwordDescription: "At least 6 characters",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "••••••••",
      confirmPasswordDescription: "Repeat the password",
      role: "Role",
      roleDescription: "Assigned permissions",
      rolePlaceholder: "Select a role",
      requirePasswordCheckTitle: "Set a new password",
      requirePasswordCheckDescription: "Leave unchecked to keep the current password",
      step1Title: "Account",
      step1FieldTitle: "Profile",
      step2Title: "Credentials",
    },
  },
};

const role = {
  page: {
    title: "Roles",
    description: "Manage roles and their permissions.",
    singularName: "Role",
    pluralName: "Roles",
  },
  columns: {
    label: "Label",
    description: "Description",
    noDescription: "No description",
    permissions: "Permissions",
    noPermissions: "No permissions",
  },
  actions: { duplicate: "Duplicate" },
  messages: {
    createSuccess: "Role created",
    updateSuccess: "Role updated",
    deleteSuccess: "Role deleted",
    duplicateSuccess: "Role duplicated",
  },
  sheet: {
    create: { title: "Create role", description: "Define a role and its permissions." },
    update: { title: "Update role", description: "Edit the selected role." },
  },
  dialogs: {
    delete: {
      title: "Delete role",
      description: "This will soft-delete the role.",
      confirm: "Delete",
      cancel: "Cancel",
    },
  },
  forms: {
    create: {
      title: "Role details",
      description: "Set the label, description, and permissions.",
      fields: {
        label: {
          label: "Label",
          placeholder: "Administrator",
          description: "Unique role name",
        },
        description: {
          label: "Description",
          placeholder: "What this role can do",
          description: "Optional summary",
        },
        permissions: {
          label: "Permissions",
          description: "Toggle the permissions granted by this role",
        },
      },
    },
    update: {
      title: "Role details",
      description: "Update the label, description, and permissions.",
      fields: {
        label: {
          label: "Label",
          placeholder: "Administrator",
          description: "Unique role name",
        },
        description: {
          label: "Description",
          placeholder: "What this role can do",
          description: "Optional summary",
        },
        permissions: {
          label: "Permissions",
          description: "Toggle the permissions granted by this role",
        },
      },
    },
  },
};

void i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  resources: {
    en: {
      common,
      "user-management": userManagement,
      role,
    },
  },
});

export default i18n;
