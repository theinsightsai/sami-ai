"use client";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Project Import
import withLayout from "@/components/hoc/withLayout";
import { PageHeader, CustomTable, ConfirmationModal } from "@/components";
import { ERROR_TEXT, ROUTE, TABEL_ACTION, ASSEST_BASE_URL } from "@/constants";
import { getApi } from "@/app/api/clientApi";
import { API } from "@/app/api/apiConstant";
import { formatDate } from "@/utils";
import ToastMessage from "@/components/ToastMessage";

// Material UI import
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const COLUMNS = [
  {
    id: "sno",
    label: "S.No",
    minWidth: 70,
    maxWidth: 70,
    align: "left",
    isVisible: true,
  },
  {
    id: "name",
    label: "Full Name",
    minWidth: 120,
    maxWidth: 120,
    align: "left",
    isVisible: true,
  },
  {
    id: "created_at",
    label: "Registered Date",
    minWidth: 100,
    maxWidth: 100,
    align: "left",
    isVisible: true,
  },
  {
    id: "email_verified",
    label: "Email Verification",
    minWidth: 100,
    maxWidth: 100,
    align: "left",
    isVisible: true,
  },
  {
    id: "active_status",
    label: "Status",
    minWidth: 100,
    maxWidth: 100,
    align: "left",
    isVisible: true,
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    maxWidth: 100,
    align: "left",
    isVisible: true,
  },
];

const createData = (
  id,
  username,
  email,
  created_at,
  status,
  email_verified_at,
  image
) => {
  return {
    id,
    username,
    email,
    created_at: formatDate(created_at),
    email_verified: email_verified_at === null ? "Pending" : "Completed",
    active_status: status === 1 ? "Active" : "In-Active",
    image: image ? `${ASSEST_BASE_URL}${image}` : null,
  };
};

const UserManagement = () => {
  const router = useRouter();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [postApi, setPostApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadApi = async () => {
      const { postApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
      setLoading(false);
    };

    loadApi();
  }, []);

  const handleCloseModal = () => {
    setOpenConfirmation(false);
    setSelectedData(null);
  };

  const onActionClick = (event, identifier, row) => {
    if (identifier == "EDIT") {
      router.push(`${ROUTE.USER_MANAGEMENT}${ROUTE.ADD_EDIT}?id=${row?.id}`);
    } else {
      setOpenConfirmation(true);
      setSelectedData({ ...row });
    }
  };

  const handleConfirmClick = async () => {
    try {
      setLoading(true);
      if (!postApi) {
        ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
        return;
      }
      const response = await postApi(`${API.DELETE_USER}`, {
        id: selectedData?.id,
      });
      if (response?.error) {
        ToastMessage("error", response?.message);
      } else if (!response?.error) {
        setRefresh(!refresh);
        ToastMessage("success", response?.data?.message);
      }
    } catch (error) {
      ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      handleCloseModal();
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApi(
          `${API.GET_USERS}?type=3&page=${page + 1}&limit=${rowsPerPage}`
        );

        if (!response.error) {
          const formattedData = response?.data?.data?.data?.map((user) =>
            createData(
              user.id,
              user.name,
              user.email,
              user.created_at,
              user.status,
              user.email_verified_at,
              user.image
            )
          );
          setTotalCount(response?.data?.data?.total);
          setTableData(formattedData);
        } else {
          ToastMessage("error", response.message);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchData();
  }, [refresh, page, rowsPerPage]);

  return (
    <Fragment>
      <PageHeader
        text="Client Management"
        buttonText="Add Client"
        onButtonClick={() =>
          router.push(`${ROUTE.USER_MANAGEMENT}${ROUTE.ADD_EDIT}`)
        }
        icon={
          <PersonAddAltIcon
            height={20}
            width={20}
            style={{ marginBottom: "4px" }}
          />
        }
      />
      <CustomTable
        ACTION_MENU={TABEL_ACTION}
        onActionClick={onActionClick}
        columns={COLUMNS}
        rows={tableData}
        setPage={setPage}
        page={page}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
      />
      <ConfirmationModal
        open={openConfirmation}
        handleClose={handleCloseModal}
        handleConfirmClick={handleConfirmClick}
        buttontext={loading ? "Deleting" : "Delete"}
        user={{
          user: selectedData?.username,
          userType: "Client",
        }}
      />
    </Fragment>
  );
};
export default withLayout(UserManagement);
