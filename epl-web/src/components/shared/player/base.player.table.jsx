// epl-web/src/components/shared/player/base.player.table.jsx
import { fetchAllPlayersAPI } from "../../../services/api.service.js";
import GenericTable from "../generic/generic.table.jsx";

const PlayerBaseTable = ({ renderActions, urlPrefix = '', extraColumns = [], showAddButton = false }) => {
    // Define the base columns for players
    const baseColumns = [
        {
            title: "Name",
            dataIndex: "name",
            linkField: true, // This property indicates that this column should render as a link
        },
        {
            title: "Age",
            dataIndex: "age",
        },
        {
            title: "Shirt Number",
            dataIndex: "shirtNumber",
        },
        {
            title: "Citizenship",
            dataIndex: "citizenships",
            render: (citizenships) => {
                return Array.isArray(citizenships) ? citizenships.join(', ') : citizenships;
            }
        },
        {
            title: "Position",
            dataIndex: "positions",
            render: (positions) => {
                return Array.isArray(positions) ? positions.join(', ') : positions;
            }
        },
        {
            title: "Current Club",
            render: (_, record) => {
                return record.transferHistories && record.transferHistories[0] ?
                    record.transferHistories[0].club : "No information"
            }
        },
        {
            title: "Market Value(millions Euro)",
            dataIndex: "marketValue",
        },
    ];

    // Use the generic table component
    return GenericTable({
        fetchDataFunction: fetchAllPlayersAPI,
        baseColumns: baseColumns,
        extraColumns: extraColumns,
        urlPrefix: urlPrefix,
        tableTitle: 'Player Table',
        idField: 'id',
        renderActions: renderActions,
        showAddButton: showAddButton
    });
};

export default PlayerBaseTable;