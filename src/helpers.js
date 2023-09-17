const handleOk = ({
  data,
  selectedEmail,
  selectedId,
  selectedName,
  selectedRole,
  selectedRowId,
  setData,
  setIsOpen
}) => {
  let updatedData = [...data];
  updatedData[selectedRowId].id = selectedId;
  updatedData[selectedRowId].email = selectedEmail;
  updatedData[selectedRowId].name = selectedName;
  updatedData[selectedRowId].role = selectedRole;
  setData(updatedData);
  setIsOpen(false);
};

const handleFirstPage = (table) => {
  table.setPageIndex(0);
};
const handlePrevPage = (table) => {
  table.previousPage();
};
const handleNextPage = (table) => {
  table.nextPage();
};
const handleLastPage = (table) => {
  table.setPageIndex(table.getPageCount() - 1);
};

const handleIdChange = ({ e, setSelectedId }) => {
  setSelectedId(e.target.value);
};
const handleRoleChange = ({ e, setSelectedRole }) => {
  setSelectedRole(e.target.value);
};
const handleNameChange = ({ e, setSelectedName }) => {
  setSelectedName(e.target.value);
};
const handleEmailChange = ({ e, setSelectedEmail }) => {
  setSelectedEmail(e.target.value);
};
const handleDeleteSelected = ({ setData, rowSelection, setRowSelection }) => {
  setData((records) =>
    records.filter((record, index) => {
      if (!Object.keys(rowSelection).includes(String(index))) {
        return true;
      }
      return false;
    })
  );
  setRowSelection({});
};
export {
  handleOk,
  handleRoleChange,
  handlePrevPage,
  handleNextPage,
  handleEmailChange,
  handleFirstPage,
  handleIdChange,
  handleLastPage,
  handleNameChange,
  handleDeleteSelected
};
