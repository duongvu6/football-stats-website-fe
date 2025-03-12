import { fetchAllPlayersAPI } from "../../../services/api.service.js";
import GenericTable from "../generic/generic.table.jsx";

const BasePlayerTable = ({ renderActions, urlPrefix = '', extraColumns = [], showAddButton = false }) => {
    // Define the base columns for players
    const baseColumns = [
        {
            title: "Name",
            dataIndex: "name",
            linkField: true,
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Age",
            dataIndex: "age",
            sorter: (a, b) => a.age - b.age
        },
        {
            title: "Shirt Number",
            dataIndex: "shirtNumber",
            sorter: (a, b) => a.shirtNumber - b.shirtNumber
        },
        {
            title: "Citizenship",
            dataIndex: "citizenships",
            render: (citizenships) => {
                return Array.isArray(citizenships) ? citizenships.join(', ') : citizenships;
            },
            sorter: (a, b) => {
                const aStr = Array.isArray(a.citizenships) ? a.citizenships.join(', ') : a.citizenships || '';
                const bStr = Array.isArray(b.citizenships) ? b.citizenships.join(', ') : b.citizenships || '';
                return aStr.localeCompare(bStr);
            }
        },
        {
            title: "Position",
            dataIndex: "positions",
            render: (positions) => {
                return Array.isArray(positions) ? positions.join(', ') : positions;
            },
            sorter: (a, b) => {
                const aStr = Array.isArray(a.positions) ? a.positions.join(', ') : a.positions || '';
                const bStr = Array.isArray(b.positions) ? b.positions.join(', ') : b.positions || '';
                return aStr.localeCompare(bStr);
            }
        },
        {
            title: "Current Club",
            render: (_, record) => {
                return record.transferHistories && record.transferHistories[0] ?
                    (typeof record.transferHistories[0].club === 'object' ?
                        record.transferHistories[0].club.name : record.transferHistories[0].club) : "No information"
            },
            sorter: (a, b) => {
                const aClub = a.transferHistories && a.transferHistories[0] ?
                    (typeof a.transferHistories[0].club === 'object' ?
                        a.transferHistories[0].club.name : a.transferHistories[0].club) : "No information";
                const bClub = b.transferHistories && b.transferHistories[0] ?
                    (typeof b.transferHistories[0].club === 'object' ?
                        b.transferHistories[0].club.name : b.transferHistories[0].club) : "No information";
                return aClub.localeCompare(bClub);
            }
        },
        {
            title: "Market Value(millions Euro)",
            dataIndex: "marketValue",
            sorter: (a, b) => a.marketValue - b.marketValue
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

export default BasePlayerTable;