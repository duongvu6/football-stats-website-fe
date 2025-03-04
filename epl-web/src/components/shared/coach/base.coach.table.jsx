import GenericTable from "../generic/generic.table";
import { fetchAllCoachesAPI } from "../../../services/api.service.js";

const BaseCoachTable = ({renderActions, urlPrefix = '', extraColumns = [], showAddButton = false}) => {
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
            title: "Citizenship",
            dataIndex: "citizenships",
            render: (citizenships) => {
                return Array.isArray(citizenships) ? citizenships.join(', ') : citizenships;
            }
        },
        {
            title: "Current Club",
            render: (_, record) => {
                return record.coachClubs && record.coachClubs[0] ?
                    record.coachClubs[0].club : "No information"
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
