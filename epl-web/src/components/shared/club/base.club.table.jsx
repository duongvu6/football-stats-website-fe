// epl-web/src/components/shared/club/base.club.table.jsx
import { fetchAllClubsWithPaginationAPI } from "../../../services/api.service";
import GenericTable from "../generic/generic.table.jsx";

const BaseClubTable = ({ renderActions, urlPrefix = '', extraColumns = [], showAddButton = false }) => {
    // Define the base columns for clubs
    const baseColumns = [
        {
            title: "Name",
            dataIndex: "name",
            linkField: true, // This property indicates that this column should render as a link
        },
        {
            title: "Country",
            dataIndex: "country",
        },
        {
            title: "Stadium name",
            dataIndex: "stadiumName",
        },
    ];

    // Use the generic table component
    return GenericTable({
        fetchDataFunction: fetchAllClubsWithPaginationAPI,
        baseColumns: baseColumns,
        extraColumns: extraColumns,
        urlPrefix: urlPrefix,
        tableTitle: 'Club Table',
        idField: 'id',
        renderActions: renderActions,
        showAddButton: showAddButton
    });
};

export default BaseClubTable;