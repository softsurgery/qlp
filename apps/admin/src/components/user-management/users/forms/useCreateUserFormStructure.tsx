import {
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  AvatarFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  SelectOption,
  TextFieldProps,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { UserStore } from "@/hooks/stores/useUserStore";
import { identifyUserAvatar } from "@/lib/user";
import { resolveUploadImageUrl } from "@/hooks/useProfilePictureUpload";

interface UseCreateUserFormStructureProps {
  userStore: UserStore;
  roles: SelectOption[];
  uploadProfilePicture: (input: {
    files: File[];
    onProgress: (progress: number) => void;
  }) => void;
  isProfilePictureUploadPending: boolean;
}

export const useCreateUserFormStructure = ({
  userStore,
  roles,
  uploadProfilePicture,
  isProfilePictureUploadPending,
}: UseCreateUserFormStructureProps) => {
  const { t } = useTranslation("user-management");
  const getError = (err?: string[]) => err?.[0];

  const photoField: Field<AvatarFieldProps> = {
    id: "photo",
    label: t("userManagement.forms.photo"),
    variant: FieldVariant.AVATAR,
    className: "bg-muted border-2 w-40 h-40 my-2 rounded-full",
    wrapperClassName: "flex flex-col gap-2 items-center",
    required: false,
    description: t("userManagement.forms.photoDescription"),
    error: getError(userStore.createDtoErrors?.pictureId),
    props: {
      image: userStore.picture,
      progress: userStore.progress,
      disabled: isProfilePictureUploadPending,
      fallback: identifyUserAvatar({
        firstName: userStore.createDto.firstName,
        lastName: userStore.createDto.lastName,
        username: userStore.createDto.username,
        email: userStore.createDto.email,
      }),
      resolveImageUrl: resolveUploadImageUrl,
      onFileChange: (value) => {
        userStore.set("picture", value);
        userStore.setNested("createDtoErrors.pictureId", []);
      },
      onUpload: (file, onProgress) => {
        userStore.set("progress", 0);
        uploadProfilePicture({
          files: [file],
          onProgress: (progress: number) => {
            userStore.set("progress", progress);
            onProgress(progress);
          },
        });
      },
    },
  };

  const firstNameField: Field<TextFieldProps> = {
    id: "firstname",
    label: t("userManagement.forms.firstName"),
    variant: FieldVariant.TEXT,
    placeholder: "John",
    description: t("userManagement.forms.firstNameDescription"),
    error: getError(userStore.createDtoErrors?.firstName),
    props: {
      value: userStore.createDto.firstName || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.firstName", value);
        userStore.setNested("createDtoErrors.firstName", []);
      },
    },
  };

  const lastNameField: Field<TextFieldProps> = {
    id: "lastname",
    label: t("userManagement.forms.lastName"),
    variant: FieldVariant.TEXT,
    placeholder: "Doe",
    description: t("userManagement.forms.lastNameDescription"),
    error: getError(userStore.createDtoErrors?.lastName),
    props: {
      value: userStore.createDto.lastName || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.lastName", value);
        userStore.setNested("createDtoErrors.lastName", []);
      },
    },
  };

  const emailField: Field<TextFieldProps> = {
    id: "email",
    label: t("userManagement.forms.email"),
    variant: FieldVariant.EMAIL,
    required: true,
    placeholder: "john@doe.com",
    description: t("userManagement.forms.emailDescription"),
    error: getError(userStore.createDtoErrors?.email),
    props: {
      value: userStore.createDto.email || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.email", value);
        userStore.setNested("createDtoErrors.email", []);
      },
    },
  };

  const dateOfBirthField: Field<DateFieldProps> = {
    id: "dateofbirth",
    label: t("userManagement.forms.dateOfBirth"),
    variant: FieldVariant.DATE,
    placeholder: "YYYY-MM-DD",
    description: t("userManagement.forms.dateOfBirthDescription"),
    error: getError(userStore.createDtoErrors?.dateOfBirth),
    props: {
      value: userStore.createDto.dateOfBirth || undefined,
      onDateChange: (value) => {
        userStore.setNested("createDto.dateOfBirth", value?.toISOString());
        userStore.setNested("createDtoErrors.dateOfBirth", []);
      },
      nullable: true,
    },
  };

  const usernameField: Field<TextFieldProps> = {
    id: "username",
    label: t("userManagement.forms.username"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("userManagement.forms.usernamePlaceholder"),
    description: t("userManagement.forms.usernameDescription"),
    error: getError(userStore.createDtoErrors?.username),
    props: {
      value: userStore.createDto.username || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.username", value);
        userStore.setNested("createDtoErrors.username", []);
      },
    },
  };

  const passwordField: Field<PasswordFieldProps> = {
    id: "password",
    label: t("userManagement.forms.password"),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: t("userManagement.forms.passwordPlaceholder"),
    description: t("userManagement.forms.passwordDescription"),
    error: getError(userStore.createDtoErrors?.password),
    props: {
      value: userStore.createDto.password || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.password", value);
        userStore.setNested("createDtoErrors.password", []);
      },
    },
  };

  const confirmPasswordField: Field<PasswordFieldProps> = {
    id: "confirmpassword",
    label: t("userManagement.forms.confirmPassword"),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: t("userManagement.forms.confirmPasswordPlaceholder"),
    description: t("userManagement.forms.confirmPasswordDescription"),
    error: getError(userStore.createDtoErrors?.confirmPassword),
    props: {
      value: userStore.confirmPassword || undefined,
      onChange: (value) => {
        userStore.set("confirmPassword", value);
        userStore.setNested("createDtoErrors.confirmPassword", []);
      },
    },
  };

  const roleField: Field<SelectFieldProps> = {
    id: "role",
    label: t("userManagement.forms.role"),
    variant: FieldVariant.SELECT,
    required: true,
    description: t("userManagement.forms.roleDescription"),
    placeholder: t("userManagement.forms.rolePlaceholder"),
    error: getError(userStore.createDtoErrors?.roleId),
    props: {
      options: roles,
      value: userStore.createDto.roleId,
      onValueChange: (value) => {
        userStore.setNested("createDto.roleId", value);
        userStore.setNested("createDtoErrors.roleId", []);
      },
    },
  };

  const userCreateFormStructure: FormStructure = {
    orientation: "horizontal",
    fieldsets: [
      {
        title: { value: t("userManagement.forms.step1Title") },
        includeHeader: true,
        rows: [
          { fields: [photoField] },
          { fields: [firstNameField, lastNameField] },
          { fields: [emailField, dateOfBirthField] },
        ],
      },
      {
        title: { value: t("userManagement.forms.step2Title") },
        includeHeader: true,
        rows: [
          { fields: [usernameField, roleField] },
          { fields: [passwordField, confirmPasswordField] },
        ],
      },
    ],
  };

  return { userCreateFormStructure };
};
