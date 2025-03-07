"use client";
import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// Project import
import { PageHeader, CustomTable, ConfirmationModal } from "@/components";
import withLayout from "@/components/hoc/withLayout";
import {
  ROUTE,
  ROLE_ID_BY_NAME,
  ACTION_IDENTIFIER,
  ASSEST_BASE_URL,
} from "@/constants";
import { getApi } from "@/app/api/clientApi";
import { API } from "@/app/api/apiConstant";
import { formatDate } from "@/utils";
import ToastMessage from "@/components/ToastMessage";

// Material UI Import
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
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
    minWidth: 140,
    maxWidth: 140,
    align: "left",
    isVisible: true,
  },
  {
    id: "role_name",
    label: "Role",
    minWidth: 100,
    maxWidth: 100,
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
    minWidth: 50,
    maxWidth: 50,
    align: "left",
    isVisible: true,
  },
  {
    id: "active_status",
    label: "Status",
    minWidth: 50,
    maxWidth: 50,
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

const TABEL_ACTION = [
  {
    toolTipLabel: "Edit",
    icon: <CreateIcon className="cursor-pointer hover:text-[#005B96]" />,
    identifier: ACTION_IDENTIFIER.EDIT,
  },
  {
    toolTipLabel: "Delete",
    icon: <DeleteIcon className="cursor-pointer hover:text-[#005B96]" />,
    identifier: ACTION_IDENTIFIER.DELETE,
  },
  {
    toolTipLabel: "Clone",
    icon: <FileCopyIcon className="cursor-pointer hover:text-[#005B96]" />,
    identifier: ACTION_IDENTIFIER.CLONE,
  },
];

const TeamManagement = () => {
  const router = useRouter();
  const role_id = useSelector((state) => state?.auth?.role_id);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [postApi, setPostApi] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const createData = (
    id,
    username,
    email,
    created_at,
    status,
    email_verified_at,
    image,
    role
  ) => {
    return {
      id,
      username,
      email,
      created_at: formatDate(created_at),
      email_verified: email_verified_at === null ? "Pending" : "Completed",
      active_status: status === 1 ? "Active" : "In-Active",
      image: image ? `${ASSEST_BASE_URL}${image}` : null,
      role_name: <span className="capitalize">{role}</span>,
    };
  };

  const onActionClick = (event, identifier, row) => {
    switch (identifier) {
      case ACTION_IDENTIFIER.EDIT:
        router.push(`${ROUTE.TEAM_MANAGEMENT}${ROUTE.ADD_EDIT}?id=${row?.id}`);
        break;

      case ACTION_IDENTIFIER.CLONE:
      case ACTION_IDENTIFIER.DELETE:
        setOpenConfirmation(true);
        setSelectedData({ ...row, action: identifier });
        break;

      default:
        ToastMessage("error", "Invalid action identifier");
        break;
    }
  };

  const handleConfirmClick = async (event, identifier) => {
    switch (identifier) {
      case ACTION_IDENTIFIER.DELETE:
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
          } else {
            setRefresh(!refresh);
            ToastMessage("success", response?.data?.message);
          }
        } catch (error) {
          ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
        } finally {
          handleCloseModal();
          setLoading(false);
        }
        break;

      case ACTION_IDENTIFIER.CLONE:
        router.push(
          `${ROUTE.TEAM_MANAGEMENT}${ROUTE.ADD_EDIT}?id=${selectedData?.id}&op=clone`
        );

        break;

      default:
        ToastMessage("error", "Invalid action identifier");
        break;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApi(
          `${API.GET_USERS}?type=2&page=${page + 1}&limit=${rowsPerPage}`
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
              user.image,
              user.role.name
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
        text="Team Management"
        buttonText={role_id === ROLE_ID_BY_NAME.ADMIN ? "Add Member" : ""}
        onButtonClick={() =>
          router.push(`${ROUTE.TEAM_MANAGEMENT}${ROUTE.ADD_EDIT}`)
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
        buttontext={selectedData?.action}
        user={{
          user: selectedData?.username,
          userType: "Team Member",
        }}
      />
    </Fragment>
  );
};
export default withLayout(TeamManagement);
