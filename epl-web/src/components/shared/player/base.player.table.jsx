import { fetchAllPlayersAPI } from "../../../services/api.service.js";
import GenericTable from "../generic/generic.table.jsx";

const BasePlayerTable = ({ renderActions, urlPrefix = '', extraColumns = [], showAddButton = false, initialFilters = {} }) => {
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
            },
            filters: [
                { text: 'England', value: 'England' },
                { text: 'France', value: 'France' },
                { text: 'Germany', value: 'Germany' },
                { text: 'Brazil', value: 'Brazil' },
                { text: 'Spain', value: 'Spain' },
                { text: 'Norway', value: 'Norway' },
                // Add more countries as needed
            ],
            onFilter: (value, record) => {
                return Array.isArray(record.citizenships)
                    ? record.citizenships.includes(value)
                    : record.citizenships === value;
            },
            defaultFilteredValue: initialFilters.citizenship ? [initialFilters.citizenship] : undefined
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
            },
            filters: [
                { text: 'GK', value: 'GK' },
                { text: 'CB', value: 'CB' },
                { text: 'LB', value: 'LB' },
                { text: 'RB', value: 'RB' },
                { text: 'CDM', value: 'CDM' },
                { text: 'CM', value: 'CM' },
                { text: 'CAM', value: 'CAM' },
                { text: 'LW', value: 'LW' },
                { text: 'RW', value: 'RW' },
                { text: 'ST', value: 'ST' },
                // Add more positions as needed
            ],
            onFilter: (value, record) => {
                return Array.isArray(record.positions)
                    ? record.positions.includes(value)
                    : record.positions === value;
            },
            defaultFilteredValue: initialFilters.position ? [initialFilters.position] : undefined
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

    // Use the generic table component with filter parameters applied
    return GenericTable({
        fetchDataFunction: (params) => {
            // Add filter parameters to API call
            let updatedParams = { ...params };

            if (initialFilters.position) {
                updatedParams.filter = updatedParams.filter
                    ? `${updatedParams.filter} and positions:${initialFilters.position}`
                    : `positions:${initialFilters.position}`;
            }

            if (initialFilters.citizenship) {
                updatedParams.filter = updatedParams.filter
                    ? `${updatedParams.filter} and citizenships:${initialFilters.citizenship}`
                    : `citizenships:${initialFilters.citizenship}`;
            }

            if (initialFilters.transferType) {
                updatedParams.filter = updatedParams.filter
                    ? `${updatedParams.filter} and transferHistories.type:${initialFilters.transferType}`
                    : `transferHistories.type:${initialFilters.transferType}`;
            }

            if (initialFilters.club) {
                updatedParams.filter = updatedParams.filter
                    ? `${updatedParams.filter} and transferHistories.club.id:${initialFilters.club}`
                    : `transferHistories.club.id:${initialFilters.club}`;
            }

            return fetchAllPlayersAPI(updatedParams);
        },
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