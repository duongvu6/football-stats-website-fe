import GenericTable from "../generic/generic.table";
import { fetchAllCoachesAPI } from "../../../services/api.service.js";

const BaseCoachTable = ({renderActions, urlPrefix = '', extraColumns = [], showAddButton = false}) => {
    const baseColumns = [
        {
            title: "Name",
            dataIndex: "name",
            linkField: true, // This property indicates that this column should render as a link
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Age",
            dataIndex: "age",
            sorter: (a, b) => a.age - b.age
        },
        {
            title: "Citizenship",
            dataIndex: "citizenships",
            render: (citizenships) => {
                return Array.isArray(citizenships) ? citizenships.join(', ') : citizenships;
            },
            sorter: (a, b) => {
                const aStr = Array.isArray(a.citizenships) ? a.citizenships.join(', ') : (a.citizenships || '');
                const bStr = Array.isArray(b.citizenships) ? b.citizenships.join(', ') : (b.citizenships || '');
                return aStr.localeCompare(bStr);
            }
        },
        {
            title: "Current Club",
            render: (_, record) => {
                return record.coachClubs && record.coachClubs[0] ?
                    (typeof record.coachClubs[0].club === 'object' ?
                        record.coachClubs[0].club.name : record.coachClubs[0].club) : "No information"
            },
            sorter: (a, b) => {
                const aClub = a.coachClubs && a.coachClubs[0] ?
                    (typeof a.coachClubs[0].club === 'object' ?
                        a.coachClubs[0].club.name : a.coachClubs[0].club) : "No information";
                const bClub = b.coachClubs && b.coachClubs[0] ?
                    (typeof b.coachClubs[0].club === 'object' ?
                        b.coachClubs[0].club.name : b.coachClubs[0].club) : "No information";
                return aClub.localeCompare(bClub);
            }
        },
    ];

    return GenericTable({
        fetchDataFunction: fetchAllCoachesAPI,
        baseColumns: baseColumns,
        extraColumns: extraColumns,
        urlPrefix: urlPrefix,
        tableTitle: 'Coaches Table',
        idField: 'id',
        renderActions: renderActions,
        showAddButton: showAddButton
    });
};

export default BaseCoachTable;