"use client";
import { Fragment, useState, useEffect } from "react";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import dynamic from "next/dynamic";

// Project Import
import withLayout from "@/components/hoc/withLayout";
import { PageHeader, ProfileUpload } from "@/components";
import { ASSEST_BASE_URL, ERROR_TEXT, ROUTE } from "@/constants";
import { API } from "@/app/api/apiConstant";
import ToastMessage from "@/components/ToastMessage";

//Material UI import
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/system";
import { Paper, Checkbox } from "@mui/material";

const FormController = dynamic(() => import("@/components/FormController"), {
  ssr: false,
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  status: "",
  image: "",
  assign_role: "",
};

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const AddEditMember = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const op = searchParams.get("op");
  const isEditMode = Boolean(id);
  const isOpMode = Boolean(op === "clone");

  const [postApi, setPostApi] = useState(null);
  const [getApi, setGetApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    const loadApi = async () => {
      const { postApi, putApi, getApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
      setGetApi(() => getApi);
      setLoading(false);
    };
    loadApi();
  }, []);

  const fetchRoleList = async () => {
    try {
      setLoading(true);
      const response = await getApi(API.GET_ROLE_LIST);

      if (!response.error) {
        const {
          data: {
            data: { data },
          },
        } = response;
        if (data) {
          const options = data.map((obj, i, arr) => {
            return {
              label: (
                <span style={{ textTransform: "capitalize" }}>{obj?.name}</span>
              ),
              value: obj?.id,
            };
          });
          setRoleOptions(options);
        }
      } else {
        ToastMessage("error", response.message);
      }
    } catch (error) {
      ToastMessage("error", "Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getApi) {
      fetchRoleList();
    }
  }, [getApi]);

  useEffect(() => {
    if (isEditMode && getApi) {
      fetchUserData();
    }
  }, [isEditMode, getApi]);

  const REGISTER_FORM = [
    { id: "name", label: "Name", component: "TEXT" },
    { id: "email", label: "Email Address", component: "TEXT" },
    {
      id: "status",
      label: "Status",
      component: "SELECT",
      options: [
        { label: "Active", value: 1 },
        { label: "In-Active", value: 0 },
      ],
    },
    {
      id: "assign_role",
      label: "Assign Role",
      component: "SELECT",
      options: roleOptions,
    },
    { id: "password", label: "Password", component: "PASSWORD" },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      component: "PASSWORD",
    },
  ];

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getApi(`${API.GET_USER_BY_ID}/${id}`);
      if (!response.error) {
        const {
          data: { data },
        } = response;
        if (data) {
          formik.setValues({
            name: data?.name || "",
            email: data?.email || "",
            password: data?.password || "",
            confirmPassword: data?.password || "",
            status: data?.status,
            assign_role: data?.role?.id,
          });
          if (data?.image !== "") {
            setProfileImage(`${ASSEST_BASE_URL}${data?.image}`);
          }
        }
      } else {
        ToastMessage("error", response.message);
      }
    } catch (error) {
      ToastMessage("error", "Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      if (!postApi) {
        ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
        return;
      }

      const apiUrl =
        isEditMode && !isOpMode ? API.UPDATE_USER : API.CREATE_USER;

      const formData = new FormData();
      formData.append("name", values?.name);
      formData.append("email", values?.email);
      formData.append("password", values?.password || "");
      formData.append("status", values?.status);
      formData.append("role_id", values?.assign_role);

      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      if (isEditMode && !isOpMode) {
        formData.append("user_id", id);
      }

      // Define headers only if necessary
      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const response = await postApi(apiUrl, formData, { headers });

      if (response?.error) {
        ToastMessage("error", response?.message);
      } else {
        router.push(ROUTE.TEAM_MANAGEMENT);
        ToastMessage(
          "success",
          isEditMode
            ? "Member Updated"
            : isOpMode
            ? "Member Cloned"
            : "Member Added"
        );
      }
    } catch (error) {
      ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .when([], (values, schema) =>
        isEditMode && !isOpMode
          ? schema
          : schema.required("Password is required")
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .when([], (values, schema) =>
        isEditMode && !isOpMode
          ? schema
          : schema.required("Confirm Password is required")
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const { setFieldValue, values, handleSubmit, touched, errors, isSubmitting } =
    formik;

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      ToastMessage("error", ERROR_TEXT.IMAGE_VALIDATION);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setFieldValue("image", file);
    setProfileImage(imageUrl);
  };

  return (
    <Fragment>
      <PageHeader
        text={
          isEditMode
            ? "Edit Team Member"
            : isOpMode
            ? "Clone Team Member"
            : "Add Team Member"
        }
        buttonText="Back"
        onButtonClick={() => router.back()}
        icon={<ArrowBackIcon height={20} width={20} />}
      />

      <Paper className="mt-5 min-h-[60vh] p-12 bg-white shadow-md rounded-lg">
        <StyledForm noValidate onSubmit={handleSubmit}>
          <ProfileUpload
            handleFileChange={handleFileChange}
            profileImage={profileImage}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGISTER_FORM.map((fieldObj) => (
              <FormController
                key={fieldObj?.id}
                fieldObj={fieldObj}
                values={values}
                touched={touched}
                errors={errors}
                setFieldValue={setFieldValue}
              />
            ))}
          </div>

          <div className="flex justify-end col-span-1 sm:col-span-2 lg:col-span-3 text-center mt-4">
            <button
              type="submit"
              className="gap-1 flex justify-center items-center bg-[#005B96] border-2 border-[#005B96] 
             rounded-[5px] text-white text-lg font-semibold no-underline p-2 px-5 
             hover:bg-white hover:text-[#005B96] hover:border-[#005B96] 
             transition duration-300 ease-in-out"
            >
              {isSubmitting
                ? "Processing..."
                : isEditMode
                ? "Update"
                : isOpMode
                ? "Clone"
                : "Submit"}
            </button>
          </div>
        </StyledForm>
      </Paper>
    </Fragment>
  );
};

export default withLayout(AddEditMember);

{
  /* <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-3 mt-4">
            <div className="text-4xl">Permissions</div>
            <table className="mt-7" style={{ width: "40%" }}>
              <thead>
                <tr>
                  <th className="p-3 text-start">Role</th>
                  {permissions.map((perm) => (
                    <th key={perm} className="p-3 text-start">
                      {perm}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role}>
                    <td className="p-3 font-medium text-start">{role}</td>
                    {permissions.map((perm) => (
                      <td key={perm} className="p-3 text-start">
                        <Checkbox
                          color="primary"
                          checked={values?.permissions[role][perm]}
                          onChange={() => handlePermissionChange(role, perm)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */
}

// const handlePermissionChange = (role, permission) => {
//   setFieldValue(
//     `permissions.${role}.${permission}`,
//     !values.permissions[role][permission]
//   );
// };

// const roles = [
//   "Logs",
//   "Task Management",
//   "User Management",
//   "Team Management",
//   "Role Management",
// ];
// const permissions = ["View", "Add", "Edit", "Delete"];
// permissions: {
//   Logs: { View: false, Add: false, Edit: false, Delete: false },
//   "Task Management": { View: false, Add: false, Edit: false, Delete: false },
//   "User Management": { View: false, Add: false, Edit: false, Delete: false },
//   "Team Management": { View: false, Add: false, Edit: false, Delete: false },
//   "Role Management": { View: false, Add: false, Edit: false, Delete: false },
// },

// permissions: data.permissions || initialValues.permissions,
