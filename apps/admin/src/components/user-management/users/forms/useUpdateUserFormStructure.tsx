import {
  CheckboxFieldProps,
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
import { identifyUserAvatar } from "@qlp/lib";
import { resolveUploadImageUrl } from "@/hooks/useProfilePictureUpload";

interface UseUpdateUserFormStructureProps {
  userStore: UserStore;
  roles: SelectOption[];
  uploadProfilePicture: (input: {
    files: File[];
    onProgress: (progress: number) => void;
  }) => void;
  isProfilePictureUploadPending: boolean;
}

export const useUpdateUserFormStructure = ({
  userStore,
  roles,
  uploadProfilePicture,
  isProfilePictureUploadPending,
}: UseUpdateUserFormStructureProps) => {
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
    error: getError(userStore.updateDtoErrors?.pictureId),
    props: {
      image: userStore.picture,
      progress: userStore.progress,
      disabled: isProfilePictureUploadPending,
      fallback: identifyUserAvatar(
        userStore.response ?? {
          firstName: userStore.updateDto.firstName,
          lastName: userStore.updateDto.lastName,
          username: userStore.updateDto.username,
          email: userStore.updateDto.email,
        },
      ),
      resolveImageUrl: resolveUploadImageUrl,
      onFileChange: (value) => {
        userStore.set("picture", value);
        userStore.setNested("updateDtoErrors.pictureId", []);
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
    error: getError(userStore.updateDtoErrors?.firstName),
    props: {
      value: userStore.updateDto.firstName || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.firstName", value);
        userStore.setNested("updateDtoErrors.firstName", []);
      },
    },
  };

  const lastNameField: Field<TextFieldProps> = {
    id: "lastname",
    label: t("userManagement.forms.lastName"),
    variant: FieldVariant.TEXT,
    placeholder: "Doe",
    description: t("userManagement.forms.lastNameDescription"),
    error: getError(userStore.updateDtoErrors?.lastName),
    props: {
      value: userStore.updateDto.lastName || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.lastName", value);
        userStore.setNested("updateDtoErrors.lastName", []);
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
    error: getError(userStore.updateDtoErrors?.email),
    props: {
      value: userStore.updateDto.email || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.email", value);
        userStore.setNested("updateDtoErrors.email", []);
      },
    },
  };

  const dateOfBirthField: Field<DateFieldProps> = {
    id: "dateofbirth",
    label: t("userManagement.forms.dateOfBirth"),
    variant: FieldVariant.DATE,
    placeholder: "YYYY-MM-DD",
    description: t("userManagement.forms.dateOfBirthDescription"),
    error: getError(userStore.updateDtoErrors?.dateOfBirth),
    props: {
      value: userStore.updateDto.dateOfBirth || undefined,
      onDateChange: (value) => {
        userStore.setNested("updateDto.dateOfBirth", value?.toISOString());
        userStore.setNested("updateDtoErrors.dateOfBirth", []);
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
    error: getError(userStore.updateDtoErrors?.username),
    props: {
      value: userStore.updateDto.username || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.username", value);
        userStore.setNested("updateDtoErrors.username", []);
      },
    },
  };

  const checkPasswordField: Field<CheckboxFieldProps> = {
    id: "checkpassword",
    label: t("userManagement.forms.requirePasswordCheckTitle"),
    variant: FieldVariant.CHECKBOX,
    description: t("userManagement.forms.requirePasswordCheckDescription"),
    props: {
      checked: userStore.setManualPassword,
      onCheckedChange: (value) => userStore.set("setManualPassword", !!value),
    },
  };

  const passwordField: Field<PasswordFieldProps> = {
    id: "password",
    label: t("userManagement.forms.password"),
    variant: FieldVariant.PASSWORD,
    placeholder: t("userManagement.forms.passwordPlaceholder"),
    description: t("userManagement.forms.passwordDescription"),
    error: getError(userStore.updateDtoErrors?.password),
    hidden: !userStore.setManualPassword,
    props: {
      value: userStore.updateDto.password || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.password", value);
        userStore.setNested("updateDtoErrors.password", []);
      },
    },
  };

  const confirmPasswordField: Field<PasswordFieldProps> = {
    id: "confirmpassword",
    label: t("userManagement.forms.confirmPassword"),
    variant: FieldVariant.PASSWORD,
    placeholder: t("userManagement.forms.confirmPasswordPlaceholder"),
    description: t("userManagement.forms.confirmPasswordDescription"),
    error: getError(userStore.updateDtoErrors?.confirmPassword),
    hidden: !userStore.setManualPassword,
    props: {
      value: userStore.confirmPassword || undefined,
      onChange: (value) => {
        userStore.set("confirmPassword", value);
        userStore.setNested("updateDtoErrors.confirmPassword", []);
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
    error: getError(userStore.updateDtoErrors?.roleId),
    props: {
      options: roles,
      value: userStore.updateDto.roleId,
      onValueChange: (value) => {
        userStore.setNested("updateDto.roleId", value);
        userStore.setNested("updateDtoErrors.roleId", []);
      },
    },
  };

  const userUpdateFormStructure: FormStructure = {
    orientation: "horizontal",
    fieldsets: [
      {
        title: { value: t("userManagement.forms.step1FieldTitle") },
        includeHeader: true,
        rows: [
          { fields: [photoField] },
          { fields: [firstNameField, lastNameField] },
          { fields: [emailField, dateOfBirthField] },
        ],
      },
      {
        title: { value: t("userManagement.forms.step1Title") },
        includeHeader: true,
        rows: [
          { fields: [usernameField, roleField] },
          { fields: [checkPasswordField] },
          { fields: [passwordField, confirmPasswordField] },
        ],
      },
    ],
  };

  return { userUpdateFormStructure };
};
