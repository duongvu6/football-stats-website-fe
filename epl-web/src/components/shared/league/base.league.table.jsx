import { fetchAllLeaguesAPI } from "../../../services/api.service.js";
import GenericTable from "../generic/generic.table.jsx";

const BaseLeagueTable = ({ renderActions, urlPrefix = '', extraColumns = [], showAddButton = false }) => {
    // Define the base columns for leagues
    const baseColumns = [
        {
            title: "Name",
            dataIndex: "name",
            linkField: true,
        }
    ];

    return GenericTable({
        fetchDataFunction: fetchAllLeaguesAPI,
        baseColumns: baseColumns,
        extraColumns: extraColumns,
        urlPrefix: urlPrefix,
        tableTitle: 'League Table',
        idField: 'id',
        renderActions: renderActions,
        showAddButton: showAddButton
    });
};

export default BaseLeagueTable;