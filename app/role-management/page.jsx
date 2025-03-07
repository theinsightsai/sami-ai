"use client";
import { Fragment, useState, useEffect } from "react";
import { PageHeader, CustomTable, ConfirmationModal } from "@/components";
import withLayout from "@/components/hoc/withLayout";
import { useRouter } from "next/navigation";
import { ROUTE, ROLE_ID_BY_NAME, TABEL_ACTION } from "@/constants";
import { getApi } from "@/app/api/clientApi";
import { API } from "@/app/api/apiConstant";
import { formatDate } from "@/utils";
import { useSelector } from "react-redux";
import ToastMessage from "@/components/ToastMessage";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const createData = (id, created_at, name, status, is_deletable) => {
  return {
    id,
    role_name: <span className="capitalize">{name}</span>,
    created_at: formatDate(created_at),
    roleStatus: status,
    is_deletable,
  };
};

const RoleManagement = () => {
  const router = useRouter();
  const role_id = useSelector((state) => state?.auth?.role_id);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [deleteApi, setDeleteApi] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadApi = async () => {
  //     const { deleteApi } = await import("@/app/api/clientApi");
  //     setDeleteApi(() => deleteApi);
  //     setLoading(false);
  //   };

  //   loadApi();
  // }, []);

  const handleCloseModal = () => {
    setOpenConfirmation(false);
    setSelectedData(null);
  };

  const onActionClick = (event, identifier, row) => {
    if (identifier == "EDIT") {
      router.push(`${ROUTE.ROLE_MANAGEMENT}${ROUTE.ADD_EDIT}?id=${row?.id}`);
    } else {
      setOpenConfirmation(true);
      setSelectedData({ ...row });
    }
  };

  const handleConfirmClick = async () => {
    // try {
    //   setLoading(true);
    //   if (!deleteApi) {
    //     ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
    //     return;
    //   }
    //   const response = await deleteApi(
    //     `${API.DELETE_USER}/${selectedData?.id}`
    //   );
    //   if (response?.error) {
    //     ToastMessage("error", response?.message);
    //   } else if (!response?.error) {
    //     setRefresh(!refresh);
    //     ToastMessage("success", response?.data?.message);
    //   }
    // } catch (error) {
    //   ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
    // } finally {
    //   handleCloseModal();
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApi(
          `${API.GET_ROLE_LIST}?role_id=${role_id}&page=${
            page + 1
          }&per_page=${rowsPerPage}`
        );

        const taskList = response?.data?.data?.data;

        if (!response.error) {
          const formattedData = taskList?.map((role) =>
            createData(
              role.id,
              role.created_at,
              role.name,
              role.status,
              role.is_deletable
            )
          );
          setTotalCount(response?.data?.data?.total);
          setTableData(formattedData);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchData();
  }, [page, rowsPerPage, refresh]);

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
      id: "role_name",
      label: "Role",
      minWidth: 120,
      maxWidth: 120,
      align: "left",
      isVisible: true,
    },

    {
      id: "created_at",
      label: "Created Date",
      minWidth: 100,
      maxWidth: 100,
      align: "left",
      isVisible: true,
    },
    {
      id: "roleStatus",
      label: "Role Status",
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
      isVisible: role_id === ROLE_ID_BY_NAME.ADMIN,
    },
  ];

  return (
    <Fragment>
      <PageHeader
        text="Role Management"
        buttonText={"Add Role"}
        onButtonClick={() =>
          router.push(`${ROUTE.ROLE_MANAGEMENT}${ROUTE.ADD_EDIT}`)
        }
        icon={
          <ManageAccountsIcon
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
        alertText="Deleting this role will require all associated members to be reassigned to another role or a restricted role. Please select a role from the dropdown below."
        handleConfirmClick={handleConfirmClick}
        buttontext="Delete"
        user={{
          user: selectedData?.role_name,
          userType: "Role",
        }}
      />
    </Fragment>
  );
};
export default withLayout(RoleManagement);
